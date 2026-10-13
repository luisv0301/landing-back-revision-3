import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"

//const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Segurautos | El mejor seguro todo riesgo para tu carro o moto",
    template: "%s | Segurautos",
  },
  description:
    "Compara y cotiza tu seguro todo riesgo para carro o moto con más de 13 aseguradoras aliadas en Colombia. Encuentra la mejor cobertura en segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        instrumentSans.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col scrollbar-gutter-stable"><Toaster />{children}</body>
    </html>
  );
}
