
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

export default function Home() {
  return (
    <div className="bg-[#FFFDEF]">
      <Navbar />
      <HomeHeader />
      <Marquee />
      <Beneficios />
      <div className="px-2">
        <ComoFunciona />
      </div>
      <Coberturas />
      <div className="px-2">
        <TestimonialsSection />
      </div>
      <Aseguradoras />
      <FAQS />
      <div className="px-2 pb-2">
        <Footer />
      </div>
    </div>
  );
}
