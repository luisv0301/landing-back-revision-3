
import type { Metadata } from "next";
import HomeHeader from "@/app/components/home/header";
import Beneficios from "@/app/components/home/beneficios";
import ComoFunciona from "@/app/components/home/comoFunciona";
import Coberturas from "@/app/components/home/coberturas";
import TestimonialsSection from "@/app/components/home/testimonios";
import Aseguradoras from "@/app/components/home/aseguradoras";
import FAQS from "@/app/components/home/faqs";
import Marquee from "@/app/components/home/marquee";
import Footer from "@/app/components/home/footer";
import Navbar from "@/app/components/home/navbar";
import { getGoogleReviews, type GoogleReview } from "@/lib/google-reviews";

const TESTIMONIALS_DATA: GoogleReview[] = [
  {
    author_name: "María Salamanka",
    author_url: "",
    language: "",
    original_language: "",
    profile_photo_url: "/images/profile-img.png",
    rating: 5,
    relative_time_description: "Bogotá",
    text: "Excelente experiencia al contratar mi póliza todo riesgo. La atención y asesoramiento fueron fundamentales para encontrar la mejor opción para mis necesidades. Me explicaron claramente los términos y condiciones, y me ayudaron a entender todo el proceso. La amabilidad y profesionalismo me dieron confianza en la decisión que tomé. ¡Gracias por el excelente servicio!",
    translated: false,
    time: 1700000000,

  },
  {
    author_name: "María Salamanka",
    author_url: "",
    language: "",
    original_language: "",
    profile_photo_url: "/images/profile-img.png",
    rating: 5,
    relative_time_description: "Bogotá",
    text: "En el desarrollo de actualizar la vigencia de mi seguro de vehículo me atendio la Sra. Manuela Leyton y el apoyo durante todo el tramite fue muy cordial, clara y atenta. Muchas gracias.",
    translated: false,
    time: 1800000000,
  },
  {
    author_name: "María Salamanka",
    author_url: "",
    language: "",
    original_language: "",
    profile_photo_url: "/images/profile-img.png",
    rating: 5,
    relative_time_description: "Bogotá",
    text: "El proceso con ellos es muy ágil y rápido, facilitan mucho la comparación entre aseguradoras permitiendo escoger la que mejor se adapte a las necesidades del usuario, Karen Mendivelso me colaboró en todo el proceso, estuvo muy atenta todo el tiempo y resolvió todas mis dudas.",
    translated: false,
    time: 1900000000,
  },
] as const;

export const metadata: Metadata = {
  title: "Segurautos | El mejor seguro todo riesgo para tu carro o moto",
  description:
    "Comparamos entre más de 13 aseguradoras aliadas para encontrar la mejor póliza todo riesgo adaptada a tu presupuesto. Cotiza en segundos sin costo.",
  openGraph: {
    title: "Segurautos | El mejor seguro todo riesgo para tu carro o moto",
    description:
      "Comparamos entre más de 13 aseguradoras aliadas para encontrar la mejor cobertura para tu vehículo.",
    //url: "https://segurautos.co",
    siteName: "Segurautos",
    locale: "es_CO",
    type: "website",
  },
};

export default async function Home() {

  const reviewsData = await getGoogleReviews();
  console.log("Google Reviews: ", reviewsData);

  /*
  const reviewsData = {
    reviews: TESTIMONIALS_DATA,
    rating: 5,
    user_ratings_total: 13112312
  }
    */

  return (
    <div className="bg-[#FFFDEF]">
      <Navbar />
      <HomeHeader rating={reviewsData?.rating ?? 4.9} userRatingTotal={reviewsData?.user_ratings_total ?? 3745} />
      <Marquee />
      <Beneficios />
      <div className="px-4">
        <ComoFunciona />
      </div>
      <Coberturas />
      <div className="px-4">
        <TestimonialsSection reviews={reviewsData?.reviews ?? TESTIMONIALS_DATA} rating={reviewsData?.rating ?? 4.9} userRatingTotal={reviewsData?.user_ratings_total ?? 3745} />
      </div>
      <Aseguradoras />
      <FAQS />
      <div className="px-4 pb-6">
        <Footer />
      </div>
    </div>
  );
}
