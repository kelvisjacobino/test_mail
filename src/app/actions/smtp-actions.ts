"use server";

import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export type TestResult = {
  success: boolean;
  message: string;
  stage?: string;
  details?: string;
};

export async function testSmtp(formData: FormData): Promise<TestResult> {
  const host = formData.get("host") as string;
  const port = parseInt(formData.get("port") as string, 10);
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const sender = formData.get("sender") as string;
  const target = formData.get("target") as string;
  const encryption = (formData.get("encryption") as string) || "auto";

  let secure = false;
  let requireTLS = false;

  if (encryption === "ssl" || port === 465) {
    secure = true;
  } else if (encryption === "starttls") {
    secure = false;
    requireTLS = true;
  } else if (encryption === "none") {
    secure = false;
    requireTLS = false;
  } else {
    // auto
    secure = port === 465;
  }

  const transporterParams: any = {
    host,
    port,
    secure,
    requireTLS,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
  };

  if (username && password) {
    transporterParams.auth = {
      user: username,
      pass: password,
    };
  }

  const transporter = nodemailer.createTransport(transporterParams);
  let result: TestResult;

  try {
    // Testa a conexão e autenticação
    await transporter.verify();

    // Se o usuário solicitou o envio para um alvo
    if (target) {
      await transporter.sendMail({
        from: sender || username || "test@test.com",
        to: target,
        subject: "Teste de SMTP - App de Verificação",
        text: "Este é um e-mail de teste gerado pelo testador de SMTP.",
      });
      result = {
        success: true,
        message: "Conexão, Autenticação e Envio realizados com sucesso!",
        stage: "sending",
      };
    } else {
      result = {
        success: true,
        message: "Conexão e Autenticação aprovadas! (Nenhum envio solicitado)",
        stage: "authentication",
      };
    }
  } catch (error: any) {
    let stage = "connection";
    let message = error.message || "Erro desconhecido";
    
    if (error.code === "ECONNECTION" || error.code === "ECONNREFUSED") {
      message = `A porta ${port} bloqueou a conexão ou o host está incorreto.`;
      stage = "connection";
    } else if (error.code === "EAUTH") {
      message = "Falha de autenticação. Usuário ou senha incorretos, ou o servidor exige App Password/OAuth2.";
      stage = "authentication";
    } else if (message.includes("Greeting never received")) {
      message = `O servidor na porta ${port} não respondeu à saudação SMTP a tempo. Tente outra criptografia.`;
      stage = "connection";
    } else if (error.command === "MAIL FROM" || error.command === "RCPT TO") {
      message = "O envio do e-mail foi recusado após a autenticação. Verifique o remetente ou as permissões.";
      stage = "sending";
    }

    result = {
      success: false,
      message,
      stage,
      details: error.message,
    };
  }

  // Save to History using Prisma
  try {
    await prisma.testResult.create({
      data: {
        host,
        port,
        username: username || null,
        encryption,
        success: result.success,
        errorMsg: result.success ? null : result.message,
        errorStage: result.success ? null : result.stage,
      },
    });
  } catch (dbError) {
    console.error("Failed to save history:", dbError);
  }

  return result;
}

export async function getHistoryArgs() {
    try {
        const history = await prisma.testResult.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return history;
    } catch {
        return [];
    }
}
