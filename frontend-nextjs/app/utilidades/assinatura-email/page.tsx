import { PageHeading } from "@/src/components/PageHeading";
import EmailSignatureGenerator from "@/src/components/EmailSignatureGenerator";

export const metadata = {
  title: "Assinatura de e-mail | SEDEC.NEWS",
  description: "Gere a imagem da sua assinatura de e-mail institucional da SEDEC.",
};

export default function EmailSignaturePage() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Utilidades"
          title="Assinatura de e-mail"
          dek="Preencha seus dados e baixe a imagem da assinatura institucional. Tudo é feito no seu navegador, nada é enviado a servidores."
        />
        <EmailSignatureGenerator />
      </section>
    </main>
  );
}
