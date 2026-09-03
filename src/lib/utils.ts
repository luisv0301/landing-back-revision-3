import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CoberturaDetalle {
  titulo: string;
  descripcion: string;
  grupo?: string;
}
export interface OfertaPoliza {
  id: string;
  aseguradora: string;
  logoUrl?: string;
  planNombre: string;
  precioAnual: number;
  tipoCobertura: string;
  deducible: string;
  coberturaRC: string;
  coberturas: CoberturaDetalle[];
  rawOfferData: any;
}


export const formatearPolizas = (listaRaw: any[]): OfertaPoliza[] => {
  const nuevasOfertas: OfertaPoliza[] = [];

  listaRaw.forEach((poliza: any, idx: number) => {
    const producto = poliza.products?.[0] || poliza.offer || {};
    const rawCoverages: any[] = producto.coverages || [];

    const coberturas: CoberturaDetalle[] = rawCoverages
      .filter((c: any) => {
        const titulo =
          typeof c.description_tag === "string" ? c.description_tag.trim() : "";
        const desc =
          typeof c.description === "string" ? c.description.trim() : "";
        return (
          titulo.length > 0 &&
          desc.length > 0 &&
          c.coverage_tag !== "URLCLA" &&
          c.coverage_tag !== "PRODUCT_NAME"
        );
      })
      .map((c: any) => ({
        titulo: c.description_tag,
        descripcion: c.description,
        grupo: typeof c.group === "string" ? c.group : undefined,
      }));

    const coverageRC = rawCoverages.find((c: any) => {
      const tag = typeof c.coverage_tag === "string" ? c.coverage_tag : "";
      const group = typeof c.group === "string" ? c.group : "";
      return tag === "RESEXT" || group.includes("Responsabilidad Civil");
    });

    const coverageDeducible = rawCoverages.find((c: any) => {
      const tag = typeof c.coverage_tag === "string" ? c.coverage_tag : "";
      return tag === "DEBPPD";
    });

    const precio = Number(
      poliza.total_price || producto.price || poliza.total_premium || 0,
    );

    if (precio > 0) {
      nuevasOfertas.push({
        id: String(poliza.id_db || poliza.process_id || idx),
        aseguradora:
          producto.manufacturer ||
          poliza.provider ||
          poliza.insurer_name ||
          "Aseguradora",
        logoUrl: producto.logo || poliza.insurer_logo_url,
        planNombre:
          producto.name || producto.product_name || "Póliza Todo Riesgo",
        precioAnual: precio,
        tipoCobertura: "Amplia",
        deducible: coverageDeducible?.description || "1.0 SMMLV",
        coberturaRC: coverageRC?.description || "$4.000.000.000",
        coberturas,
        rawOfferData: poliza,
      });
    }
  });

  return [...nuevasOfertas].sort((a, b) => a.precioAnual - b.precioAnual);
};