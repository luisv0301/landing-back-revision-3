import CotizadorForm from "../components/forms/cotizadorForm";
import { getGoogleReviews } from "@/lib/google-reviews";

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

  //const reviewsData = await getGoogleReviews();

  const reviewsData = {
    rating: 4.9,
    user_ratings_total: 3558
  }

  return (
    <div className="bg-[#F4F4F4]">
      <CotizadorForm
        initialTipo={initialTipo}
        rating={reviewsData?.rating ?? 4.9}
        userRatingTotal={reviewsData?.user_ratings_total ?? 3558}
      />
    </div>
  );
}