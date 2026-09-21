import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  status?: string;
  detailUrl?: string;
  rawOfferData?: any;
}

/**
 * Normaliza las ofertas recibidas desde Sunrise CRM o comparativos de pólizas.
 */
export const formatearPolizas = (listaRaw: any[]): OfertaPoliza[] => {
  const nuevasOfertas: OfertaPoliza[] = [];

  listaRaw.forEach((poliza: any, idx: number) => {
    // Si ya viene formateado desde Sunrise API (quotes: [{ id, insurer, plan_name, premium, status, logo_url, detail_url }])
    if (poliza.insurer || poliza.plan_name || poliza.premium) {
      const precio = Number(poliza.premium || poliza.total_price || 0);
      if (precio > 0) {
        const coberturas: CoberturaDetalle[] = Array.isArray(poliza.coverages)
          ? poliza.coverages.map((c: any) => ({
              titulo: c.title || c.description_tag || "Cobertura",
              descripcion: c.description || "Incluida",
              grupo: c.group,
            }))
          : [
              {
                titulo: "Responsabilidad Civil Extracontractual",
                descripcion: "Hasta $4.000.000.000",
                grupo: "Cobertura Principal",
              },
              {
                titulo: "Pérdida Total por Daños o Hurto",
                descripcion: "100% del valor comercial",
                grupo: "Cobertura Principal",
              },
              {
                titulo: "Pérdida Parcial Daños / Hurto",
                descripcion: "Deducible estándar 1.0 SMMLV",
                grupo: "Deducibles",
              },
              {
                titulo: "Asistencia en Viaje y Grúa",
                descripcion: "Cobertura nacional 24/7",
                grupo: "Asistencias",
              },
            ];

        nuevasOfertas.push({
          id: String(poliza.id || poliza.quote_id || idx),
          aseguradora: poliza.insurer || "Aseguradora",
          logoUrl: poliza.logo_url || poliza.logo,
          planNombre: poliza.plan_name || "Póliza Todo Riesgo",
          precioAnual: precio,
          tipoCobertura: poliza.status || "Amplia",
          deducible: "1.0 SMMLV",
          coberturaRC: "$4.000.000.000",
          coberturas,
          status: poliza.status,
          detailUrl: poliza.detail_url,
          rawOfferData: poliza,
        });
      }
      return;
    }

    // Compatibilidad con respuestas raw de Agente Motor / comparativos S3
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