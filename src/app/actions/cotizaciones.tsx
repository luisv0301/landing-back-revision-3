"use server";

import crypto from "crypto";


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

// 2. Iniciar Cotización en Agente Motor

/*

// ----------- MOCK --------------------------//
export async function iniciarCotizacionAction(_datos?: any) {
    try {
        const token = await obtenerTokenAgenteMotor();
        const tenant = process.env.AGENTE_MOTOR_TENANT || 'segurautos.co.agentemotor.com';
        const sessionUuid = crypto.randomUUID().replaceAll('-', '');
        const fallbackChannelName = `landing_${sessionUuid}@${tenant}`;

        // Payload de prueba estático entregado por Agente Motor
        const payloadQuotation = {
            name: 'event-create-quote',
            tenant_data: {
                name: tenant,
                user_mail: 'Intercolseguros@gmail.com',
            },
            channel_name: fallbackChannelName,
            data: {
                business_line: 'vehiculos',
                insurable_objects: [
                    {
                        type: 'vehicle',
                        vehicle: {
                            plate: 'XXX000',
                            vehicle_risk: {
                                accesories_price: '0',
                                in_agency: false,
                                plate_type: 'particular',
                                use_type: 'particular',
                                reference_price: 55200000,
                                commercial_price: 55200000,
                            },
                            model: 2020,
                            codification: {
                                code: '04601265',
                            },
                        },
                    },
                ],
                parties: [
                    {
                        party_rol: 'Asegurado',
                        party_type: 'person',
                        person: {
                            identification_type: 'CC',
                            identification_number: '15819999',
                            firstname: 'JUAN',
                            lastname: 'GARCIA',
                            gender: 'M',
                            birht_date: '1984-06-04',
                            occupation: 'Profesional Independiente',
                            educational_level: 'none',
                            contact_data: [
                                {
                                    contact_tag: 'principal',
                                    contact_info: {
                                        email: 'test@agentemotor.com',
                                        phone: '+573117942229',
                                        ubication: {
                                            address_line1: '',
                                            place: {
                                                city_code: '76001',
                                                country_code: '170',
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
                ubication: {
                    place: {
                        city_code: '76001',
                        country_code: '170',
                    },
                },
            },
        };

        console.log('>>> ENVIANDO PAYLOAD DE PRUEBA A AGENTE MOTOR...');

        const resQuote = await fetch('https://apipro.agentemotor.com/app/co/customers/quotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payloadQuotation),
            cache: 'no-store',
        });

        if (!resQuote.ok) {
            const errText = await resQuote.text();
            console.error('>>> ERROR EN QUOTATION:', errText);
            return { success: false, error: errText || 'No se pudieron consultar las aseguradoras.' };
        }

        const responseJson = await resQuote.json();
        console.log('>>> RESPUESTA DE QUOTATION:', JSON.stringify(responseJson, null, 2));

        const realChannelName = responseJson.callback?.channel_name || fallbackChannelName;

        return {
            success: true,
            oppId: responseJson.opp_id,
            channelName: realChannelName,
            token,
        };
    } catch (error: any) {
        console.error('>>> CATCH ERROR:', error.message);
        return { success: false, error: error.message };
    }
}

*/

// ----------------- PRODUCCION -------------- //

export async function iniciarCotizacionAction(datos: any) {
  try {
    const token = await obtenerTokenAgenteMotor();
    const tenant = process.env.AGENTE_MOTOR_TENANT;
    const sessionUuid = crypto.randomUUID().replaceAll("-", "");
    const fallbackChannelName = `landing_${sessionUuid}@${tenant}`;

    const { vehiculo, personales } = datos;

    console.log("DATOS DE VEHICULO PERSONALES: ", vehiculo, personales);


    const emailContacto =
      process.env.NODE_ENV === "production"
        ? personales.email
        : "test@agentemotor.com";


    const rawPhone = (personales.telefono || "").replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("57")
      ? `+${rawPhone}`
      : `+57${rawPhone}`;

    const payloadQuotation = {
      name: "event-create-quote",
      tenant_data: {
        name: tenant,
        user_mail:
          process.env.AGENTE_MOTOR_USER_MAIL || "Intercolseguros@gmail.com",
      },
      channel_name: fallbackChannelName,
      data: {
        business_line: "vehiculos",
        insurable_objects: [
          {
            type: "vehicle",
            vehicle: {
              plate: vehiculo.esCeroKm ? "XXX000" : vehiculo.placa || "XXX000",
              model: Number(vehiculo.modelo),
              codification: {
                code: vehiculo.fasecoldaCode,
              },
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
              birht_date: personales.fechaNacimiento,
              occupation: "Profesional Independiente",
              educational_level: "none",
              contact_data: [
                {
                  contact_tag: "principal",
                  contact_info: {
                    email: emailContacto,
                    phone: formattedPhone,
                    ubication: {
                      address_line1: "",
                      place: {
                        city_code: personales.cityCode || "76001",
                        country_code: "170",
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
        ubication: {
          place: {
            city_code: personales.cityCode || "76001",
            country_code: "170",
          },
        },
      },
    };

    console.log(
      "PAYLOAD QUOTATION: ",
      JSON.stringify(payloadQuotation, null, 2),
    );

    const resQuote = await fetch(
      "https://apipro.agentemotor.com/app/co/customers/quotation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadQuotation),
        cache: "no-store",
      },
    );

    if (!resQuote.ok) {
      const errText = await resQuote.text();
      return {
        success: false,
        error: errText || "No se pudieron consultar las aseguradoras.",
      };
    }

    const responseJson = await resQuote.json();
    console.log(">>> 🔗 URL CLIENTE PARA PROBAR EN EL NAVEGADOR:");
    console.log("RESp", JSON.stringify(responseJson, null, 2));
    console.log(responseJson.url_cliente);
    const realChannelName =
      responseJson.callback?.channel_name || fallbackChannelName;

    return {
      success: true,
      oppId: responseJson.opp_id,
      channelName: realChannelName,
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
  token?: string,
) {
  console.log(
    ">>>>>>>> CONSULTANDO OFERTAS RESPALDO JSONCOMPARATIVO: ",
    jsonComparativoUrl,
  );

  try {
    if (!jsonComparativoUrl || !token) return { success: false, ofertas: [] };


    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    console.log(
      ">>>>>>>> ENVIANDO CON AUTH HEADER: ",
      authHeader.substring(0, 20) + "...",
    );


    const res = await fetch(jsonComparativoUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      cache: "no-store",
    });

    console.log(">>>>>>>>>>>>>> STATUS: ", res.status, res.statusText);

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        "Error HTTP en get_opportunity_offers:",
        res.status,
        errText,
      );


      return { success: false, ofertas: [] };
    }

    const data = await res.json();
    console.log(
      ">>>>>>>>>>>>>>> RESPUESTA JSON: ",
      JSON.stringify(data, null, 2),
    );

    const rawOffers =
      data.offers ||
      data.data ||
      data.response ||
      (Array.isArray(data) ? data : []);

    return { success: true, ofertas: rawOffers };
  } catch (error: any) {
    console.error("Error en consulta de respaldo:", error.message);
    return { success: false, ofertas: [] };
  }
}

// --------------- CON WEBHOOK-------------------------------

/*
export async function iniciarCotizacionAction(datos: any) {
  try {
    const token = await obtenerTokenAgenteMotor();
    const tenant = process.env.AGENTE_MOTOR_TENANT;
    const sessionUuid = crypto.randomUUID().replaceAll("-", "");
    const fallbackChannelName = `landing_${sessionUuid}@${tenant}`;

    const { vehiculo, personales } = datos;

    console.log("DATOS DE VEHICULO PERSONALES: ", vehiculo, personales);


    const emailContacto =
      process.env.NODE_ENV === "production"
        ? personales.email
        : "test@agentemotor.com";

   
    const rawPhone = (personales.telefono || "").replace(/\D/g, "");
    const formattedPhone = rawPhone.startsWith("57")
      ? `+${rawPhone}`
      : `+57${rawPhone}`;

    const webhookUrl =
      "https://xjqpsc98-3000.use2.devtunnels.ms/api/webhook/agentemotor";

    const payloadQuotation = {
      name: "event-create-quote",
      tenant_data: {
        name: tenant,
        user_mail:
          process.env.AGENTE_MOTOR_USER_MAIL || "Intercolseguros@gmail.com",
      },
      callback: {
        url_callback: webhookUrl,
        callback_param: fallbackChannelName, 
      },
      channel_name: fallbackChannelName,
      data: {
        business_line: "vehiculos",
        insurable_objects: [
          {
            type: "vehicle",
            vehicle: {
              plate: vehiculo.esCeroKm ? "XXX000" : vehiculo.placa || "XXX000",
              model: Number(vehiculo.modelo),
              codification: {
                code: vehiculo.fasecoldaCode,
              },
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
              birht_date: personales.fechaNacimiento,
              occupation: "Profesional Independiente",
              educational_level: "none",
              contact_data: [
                {
                  contact_tag: "principal",
                  contact_info: {
                    email: emailContacto,
                    phone: formattedPhone,
                    ubication: {
                      address_line1: "",
                      place: {
                        city_code: personales.cityCode || "76001",
                        country_code: "170",
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
        ubication: {
          place: {
            city_code: personales.cityCode || "76001",
            country_code: "170",
          },
        },
      },
    };

    console.log(
      "PAYLOAD QUOTATION: ",
      JSON.stringify(payloadQuotation, null, 2),
    );

    const resQuote = await fetch(
      "https://apipro.agentemotor.com/app/co/customers/quotation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadQuotation),
        cache: "no-store",
      },
    );

    if (!resQuote.ok) {
      const errText = await resQuote.text();
      return {
        success: false,
        error: errText || "No se pudieron consultar las aseguradoras.",
      };
    }

    const responseJson = await resQuote.json();
    console.log(">>> 🔗 URL CLIENTE PARA PROBAR EN EL NAVEGADOR:");
    console.log("RESp", JSON.stringify(responseJson, null, 2));
    console.log(responseJson.url_cliente);
    const realChannelName =
      responseJson.callback?.channel_name || fallbackChannelName;

    return {
      success: true,
      oppId: responseJson.opp_id,
      channelName: realChannelName,
      jsonComparativoUrl: responseJson.json_comparativo,
      token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


*/
