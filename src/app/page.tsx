import { getHistoryArgs } from "./actions/smtp-actions";
import SmtpTester from "@/components/SmtpTester";
import { Mail } from "lucide-react";

export default async function Home() {
  const historyList = await getHistoryArgs();

  return (
    <div className="app-container">
      <header>
        <h1>
          Testador SMTP <Mail style={{ display: "inline", verticalAlign: "middle" }} size={36} />
        </h1>
        <p>Valide suas credenciais, portas e criptografia rapidamente.</p>
      </header>

      <main>
        <SmtpTester initialHistory={historyList} />
      </main>
    </div>
  );
}
