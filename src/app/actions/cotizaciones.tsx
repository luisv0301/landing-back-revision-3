"use server";

async function obtenerTokenAgenteMotor(): Promise<string> {
  const authPayload = {
    username: process.env.AGENTE_MOTOR_USERNAME,
    password: process.env.AGENTE_MOTOR_PASSWORD,
    tenant: process.env.AGENTE_MOTOR_TENANT,
  };

  const res = await fetch(
    "https://apipro.agentemotor.com/app/co/customers/authentication",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authPayload),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("No se pudo autenticar con la plataforma de seguros.");
  }

  const data = await res.json();
  return data.access_token || data["access token"];
}

export async function iniciarCotizacionAction(datos: any) {
  try {
    const token = await obtenerTokenAgenteMotor();
    const tenant = process.env.AGENTE_MOTOR_TENANT;
    const { vehiculo, personales } = datos;

    const emailContacto = process.env.NODE_ENV === "production" ? personales.email : "test@agentemotor.com";
    const rawPhone = (personales.telefono || "").replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("57") ? `+${rawPhone}` : `+57${rawPhone}`;

    const payloadQuotation = {
      name: "event-create-quote",
      tenant_data: {
        name: tenant,
        user_mail: process.env.AGENTE_MOTOR_USER_MAIL || "Intercolseguros@gmail.com",
      },

      data: {
        business_line: "vehiculos",
        insurable_objects: [
          {
            type: "vehicle",
            vehicle: {
              plate: vehiculo.esCeroKm ? "" : vehiculo.placa || "",
              model: Number(vehiculo.modelo),
              codification: { code: vehiculo.fasecoldaCode },
              vehicle_risk: {
                accesories_price: "0",
                in_agency: Boolean(vehiculo.esCeroKm),
                plate_type: "particular",
                use_type: vehiculo.useType || "particular",
                reference_price: Number(vehiculo.referencePrice || 0),
                commercial_price: Number(vehiculo.referencePrice || 0),
              },
            },
          },
        ],
        parties: [
          {
            party_rol: "Asegurado",
            party_type: "person",
            person: {
              identification_type: personales.tipoDocumento || "CC",
              identification_number: String(personales.numeroDocumento),
              firstname: personales.firstname.toUpperCase(),
              lastname: personales.lastname.toUpperCase(),
              gender: personales.genero || "M",
              birht_date: personales.fechaNacimiento, // Mantener el typo obligatorio de Agente Motor
              //occupation: "Profesional Independiente",
              // educational_level: "none",
              contact_data: [
                {
                  contact_tag: "principal",
                  contact_info: {
                    email: emailContacto,
                    phone: formattedPhone,
                    ubication: {
                      address_line1: "",
                      place: { city_code: personales.cityCode || "76001", country_code: "170" },
                    },
                  },
                },
              ],
            },
          },
        ],
        ubication: { place: { city_code: personales.cityCode || "76001", country_code: "170" } },
      },
    };

    const resQuote = await fetch("https://apipro.agentemotor.com/app/co/customers/quotation", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payloadQuotation),
      cache: "no-store",
    });

    if (!resQuote.ok) {
      return { success: false, error: "No se pudieron consultar las aseguradoras." };
    }

    const responseJson = await resQuote.json();

    return {
      success: true,
      oppId: responseJson.opp_id,
      jsonComparativoUrl: responseJson.json_comparativo,
      pdfUrl: responseJson.url_pdf_comparativo,
      token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function consultarOfertasRespaldoAction(
  jsonComparativoUrl: string,
) {
  try {
    if (!jsonComparativoUrl) return { success: false, ofertas: [] };

    const res = await fetch(jsonComparativoUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, ofertas: [] };
    }

    const data = await res.json();

    const rawOffers =
      data.policy_list ||
      data.sale_orders ||
      data.offers ||
      data.data ||
      (Array.isArray(data) ? data : []);

    return { success: true, ofertas: rawOffers };
  } catch (error: any) {
    console.error("Error en consulta de respaldo:", error.message);
    return { success: false, ofertas: [] };
  }
}
