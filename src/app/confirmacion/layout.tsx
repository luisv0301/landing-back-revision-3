import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotización Confirmada",
  description:
    "Hemos registrado tu selección de póliza todo riesgo. Un especialista de Segurautos te contactará en breve.",
};

export default function ConfirmacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
