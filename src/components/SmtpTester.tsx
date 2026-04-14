"use client";

import { useState } from "react";
import { testSmtp, TestResult } from "@/app/actions/smtp-actions";
import { Play, ShieldAlert, CheckCircle, XCircle } from "lucide-react";

export default function SmtpTester({ initialHistory }: { initialHistory: any[] }) {
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState(initialHistory);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await testSmtp(formData);
    
    setResult(res);
    setHistory([
      {
        id: Date.now(),
        host: formData.get("host"),
        port: Number(formData.get("port")),
        encryption: formData.get("encryption"),
        success: res.success,
        errorMsg: !res.success ? res.message : null,
        errorStage: !res.success ? res.stage : null,
      },
      ...history
    ].slice(0, 20));

    setLoading(false);
  };

  const autoPorts = [
    { port: 587, enc: "starttls", lbl: "587 (STARTTLS)" },
    { port: 465, enc: "ssl", lbl: "465 (SSL/TLS)" },
    { port: 25, enc: "none", lbl: "25 (Sem criptografia)" }
  ];

  const onAutoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const baseForm = new FormData(e.currentTarget);
    const host = baseForm.get("host") as string;
    
    // We will test sequentially for simplicity
    for (const conf of autoPorts) {
      baseForm.set("port", conf.port.toString());
      baseForm.set("encryption", conf.enc);
      
      const res = await testSmtp(baseForm);
      if (res.success) {
        setResult({
          success: true,
          message: `Sucesso! A configuração ideal é Porta ${conf.port} com ${conf.enc.toUpperCase()}.`,
          stage: "connection"
        });
        
        setHistory((prev) => [
          {
            id: Date.now(),
            host,
            port: conf.port,
            encryption: conf.enc,
            success: true
          },
          ...prev
        ].slice(0, 20));

        setLoading(false);
        return;
      }
    }

    setResult({
      success: false,
      message: "Nenhuma das configurações padrão (587, 465, 25) funcionou. Verifique o host, usuário ou senha.",
      stage: "connection"
    });
    setLoading(false);
  };

  return (
    <div className="main-grid">
      <div className="glass-panel">
        <div className="tabs">
          <button 
            type="button"
            className={`tab ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => { setActiveTab("manual"); setResult(null); }}
          >
            Teste Manual
          </button>
          <button 
            type="button"
            className={`tab ${activeTab === "auto" ? "active" : ""}`}
            onClick={() => { setActiveTab("auto"); setResult(null); }}
          >
            Descobrir Configuração
          </button>
        </div>

        {activeTab === "manual" ? (
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Servidor SMTP (Host)</label>
                <input type="text" name="host" required placeholder="ex: smtp.gmail.com" />
              </div>
              <div className="form-group" style={{ flex: 0.3 }}>
                <label>Porta</label>
                <input type="number" name="port" required defaultValue={587} min={1} max={65535} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Criptografia</label>
                <select name="encryption" defaultValue="auto">
                  <option value="auto">Automático (recomendado)</option>
                  <option value="starttls">STARTTLS / TLS Explícito</option>
                  <option value="ssl">SSL / TLS Implícito</option>
                  <option value="none">Nenhuma</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Usuário (Login)</label>
                <input type="text" name="username" placeholder="Seu e-mail ou nome de usuário" />
              </div>
              <div className="form-group">
                <label>Senha</label>
                <input type="password" name="password" placeholder="Sua senha ou App Password" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Remetente (From)</label>
                <input type="email" name="sender" placeholder="Deixar em branco usa o login" />
              </div>
              <div className="form-group">
                <label>Destinatário de Teste (To)</label>
                <input type="email" name="target" placeholder="E-mail para receber teste (opcional)" />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              <Play size={18} /> {loading ? "Testando..." : "Testar Conexão e Envio"}
            </button>
          </form>
        ) : (
          <form onSubmit={onAutoSubmit}>
             <div className="form-group">
                <label>Servidor SMTP (Host)</label>
                <input type="text" name="host" required placeholder="ex: smtp.gmail.com" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Usuário (Login)</label>
                  <input type="text" name="username" placeholder="Seu e-mail ou nome de usuário" />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" name="password" placeholder="Sua senha ou App Password" />
                </div>
              </div>
              <p style={{marginBottom: "1rem", fontSize: "0.9rem"}}>
                O sistema tentará conectar nas portas 587, 465 e 25 verificando qual é a ideal para este servidor.
              </p>
              <button type="submit" className="btn" disabled={loading}>
                <ShieldAlert size={18} /> {loading ? "Buscando configurações..." : "Testar Automaticamente"}
              </button>
          </form>
        )}

        {result && (
          <div className={`alert ${result.success ? "alert-success" : "alert-error"}`}>
            <h4>
              {result.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
              {result.success ? "Sucesso!" : `Erro na etapa: ${result.stage}`}
            </h4>
            <p>{result.message}</p>
            {result.details && <div className="alert-details">{result.details}</div>}
          </div>
        )}
      </div>

      <div className="glass-panel">
        <h2>Histórico de Testes</h2>
        <p style={{fontSize: "0.9rem"}}>Salvo no banco de dados local.</p>
        
        <div className="history-list">
          {history.length === 0 && <p style={{marginTop: "1rem", textAlign: "center"}}>Nenhum teste recente.</p>}
          {history.map((h, i) => (
            <div key={i} className={`history-item ${h.success ? "success" : "error"}`}>
              <div className="history-meta">
                <span className="history-host">{h.host}:{h.port}</span>
                <span className="history-details">{h.success ? "Certinho" : (h.errorMsg || "Erro")}</span>
              </div>
              {h.success ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
