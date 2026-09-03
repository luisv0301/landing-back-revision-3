import CotizadorForm from "../components/forms/cotizadorForm";

export default async function FormPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const initialTipo =
    params?.tipo === "moto" || params?.tipo === "pesado" || params?.tipo === "carro"
      ? (params.tipo as "carro" | "moto" | "pesado")
      : "carro";

  return (
    <div className="bg-[#F4F4F4]">
      <CotizadorForm initialTipo={initialTipo} />
    </div>
  );
}