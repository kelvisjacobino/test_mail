<div align="center">
  <img src="https://img.icons8.com/color/96/000000/send-mass-email.png" alt="Email Icon" />
  <h1>SMTP Tester</h1>
  <p>Uma ferramenta completa e visual para testar e validar conexões SMTP locais e remotos.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  </p>
</div>

<br/>

## 🚀 Sobre o Projeto
O **SMTP Tester** é uma aplicação web feita para facilitar a vida de desenvolvedores e analistas de infraestrutura que precisam validar envios de e-mails via SMTP. 

Ao invés de testar usando scripts de terminal chatos, essa ferramenta oferece uma interface gráfica amigável — permitindo preencher Host, Porta, Usuário, Senha e destinatário de teste. Além de mostrar em tempo real o status se a conexão deu certo ou não, a aplicação **guarda o histórico dos testes recentes** utilizando um banco de dados local.

## ✨ Funcionalidades
- **Teste rápido de SMTP**: Preencha as credenciais e envie um e-mail de teste instantaneamente.
- **Validação de configurações**: Funciona perfeitamente com provedores conhecidos (Gmail, Outlook) ou servidores SMTP próprios.
- **Histórico Persistente**: Graças ao Prisma e o banco de dados SQLite, a aplicação salva de forma automática os seus últimos testes (dados sensíveis, como a senha do e-mail, **não** são expostos no histórico).
- **Interface Responsiva**: Design moderno usando Tailwind CSS, funcional do mobile ao desktop.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** (App Router)
- **[React](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)** e **[Lucide Icons](https://lucide.dev/)** para o visual.
- **[Prisma ORM](https://www.prisma.io/)** com banco de dados SQLite para o armazenamento local.
- **[Nodemailer](https://nodemailer.com/)** para o núcleo do disparo do SMTP por baixo dos panos.

---

## ⚙️ Como executar localmente

Siga o passo a passo abaixo para rodar o projeto na sua máquina:

### 1. Pré-requisitos
- Node.js (versão 18 ou superior) instalado
- Git instalado

### 2. Clonando e instalando

```bash
# Clone o repositório
git clone https://github.com/kelvisjacobino/test_mail.git

# Acesse a pasta do projeto
cd test_mail

# Instale as dependências usando NPM
npm install
```

### 3. Configurando o Banco de dados

Esta aplicação utiliza o Prisma com um banco SQLite local (que será criado na pasta `prisma/`).

```bash
# Rode a migração do Prisma para criar o banco e as tabelas necessárias
npx prisma db push
```

### 4. Rodando o servidor
Agora basta iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação funcionando.

---

## 📌 Próximos Passos (To-Do)
- [ ] Implementar integração para reuso das credenciais já testadas, clicando diretamente no histórico.
- [ ] Criação de log detalhado da tentativa de conexão do Nodemailer exportado para o usuário ver onde quebrou (Ex: Erro de certificado SSL).

---

<div align="center">
  Desenvolvido com 🩵
</div>
