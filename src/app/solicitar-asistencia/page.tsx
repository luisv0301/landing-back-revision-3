import type { Metadata } from "next";
import Navbar from "@/app/components/home/navbar";
import Footer from "@/app/components/home/footer";
import AsistenciaClient from "./asistenciaClient";
import Link from "next/link";
import { ChevronRight, PhoneCall } from "lucide-react";

export const metadata: Metadata = {
    title: "Solicitar Asistencia | Números de Emergencia de Aseguradoras - Segurautos",
    description:
        "Encuentra las líneas de asistencia en carretera, números cortos (#) y teléfonos de emergencia 24/7 en Bogotá y a nivel nacional de las principales aseguradoras de Colombia.",
    openGraph: {
        title: "Solicitar Asistencia | Segurautos",
        description:
            "Encuentra las líneas de asistencia en carretera (#) y teléfonos 24/7 de SURA, Allianz, Seguros Bolívar, AXA Colpatria, Mapfre, HDI y más.",
        siteName: "Segurautos",
        locale: "es_CO",
        type: "website",
    },
};

export default function SolicitarAsistenciaPage() {
    return (
        <div className="min-h-screen bg-[#FFFDEF]">
            <Navbar />

            <main className="w-full pt-4 pb-16 px-4 sm:px-6 lg:py-12 lg:px-8">
                <div className="mx-auto max-w-5xl">


                    {/* Page Header */}
                    <header className="mb-8 sm:mb-10 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 mb-3 border border-amber-200/60">
                            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Líneas de Asistencia 24/7</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 text-balance">
                            Solicita tu asistencia
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto text-pretty">
                            Encuentra aquí la aseguradora de tu póliza y comunícate directamente con la línea de auxilio mecánico, grúa o reporte de siniestros.
                        </p>
                    </header>

                    {/* Interactive Directory & Search */}
                    <AsistenciaClient />
                </div>
            </main>

            <div className="px-4 pb-6">
                <Footer />
            </div>
        </div>
    );
}
