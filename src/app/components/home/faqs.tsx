import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: readonly FAQItem[] = [
    {
        id: "faq-1",
        question: "¿Cuánto cuesta que Segurautos me ayude a cotizar?",
        answer:
            "Nada. El análisis y comparación entre aseguradoras es completamente gratis y sin compromiso — solo pagas la prima de tu póliza si decides tomarla.",
    },
    {
        id: "faq-2",
        question: "¿Por qué la pérdida total de moto no cubre el 100%?",
        answer:
            "La mayoría de las aseguradoras aplican un deducible o porcentaje de depreciación según el modelo y el mercado para ajustar el riesgo, aunque algunas pólizas exclusivas ofrecen coberturas más cercanas al valor pactado.",
    },
    {
        id: "faq-3",
        question: "¿Cuánto tiempo toma tener mi póliza activa?",
        answer:
            "Una vez eliges tu opción preferida y envías los documentos básicos, la emisión suele tomar entre 15 minutos y 24 horas hábiles según la aseguradora.",
    },
    {
        id: "faq-4",
        question: "¿Qué pasa si tengo un siniestro?",
        answer:
            "Nuestra línea de acompañamiento y el equipo de la aseguradora te asisten 24/7. Te guiamos paso a paso en el reporte, la grúa o asistencia inmediata y el seguimiento del caso.",
    },
    {
        id: "faq-5",
        question: "¿Con cuántas aseguradoras trabajan?",
        answer:
            "Trabajamos con más de 13 aseguradoras líderes en el país (SURA, Allianz, AXA Colpatria, Mapfre, HDI, entre otras) para garantizarte la mejor tarifa y cobertura.",
    },
    {
        id: "faq-6",
        question: "¿Cómo los contacto si tengo dudas?",
        answer:
            "Puedes escribirnos por WhatsApp directamente, llamarnos o agendar una asesoría personalizada con una de nuestras gestoras sin costo adicional.",
    },
] as const;


export default function FAQS() {
    return (
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="w-full pb-16 px-4 lg:pb-24 lg:max-w-280 lg:mx-auto"
        >
            <div className="mx-auto max-w-3xl">

                <header className="mb-10 text-center sm:mb-12">
                    <h2
                        id="faq-title"
                        className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
                    >
                        Preguntas Frecuentes
                    </h2>
                </header>

                <Accordion defaultValue={["faq-1"]} className="max-w-lg space-y-3 mx-auto">
                    {FAQ_DATA.map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="bg-white px-6 py-3 rounded-3xl">
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}