import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { PageHeading } from "@/src/components/PageHeading";
import QRCodeGenerator from "@/src/components/QRCodeGenerator";

export const metadata = {
  title: "Gerador de QR Code | SEDEC.NEWS",
  description: "Gere QR Codes a partir de uma URL ou de um contato telefônico.",
};

export default function QRCodePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Utilidades"
          title="Gerador de QR Code"
          dek="Gere um QR Code a partir de uma URL ou de um contato telefônico. Tudo é feito no seu navegador, nada é enviado a servidores."
        />
        <QRCodeGenerator />
      </section>

      <Footer />
    </main>
  );
}
