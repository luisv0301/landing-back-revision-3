
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

export default function Home() {
  return (
    <div className="bg-[#FFFDEF]">
      <Navbar />
      <HomeHeader />
      <Marquee />
      <Beneficios />
      <div className="px-4">
        <ComoFunciona />
      </div>
      <Coberturas />
      <div className="px-4">
        <TestimonialsSection />
      </div>
      <Aseguradoras />
      <FAQS />
      <div className="px-4 pb-6">
        <Footer />
      </div>
    </div>
  );
}
