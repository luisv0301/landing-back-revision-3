export async function GET() {
  return new Response("Webhook activo y escuchando", { status: 200 });
}

export async function POST(req: Request) {
  let body;

  try {
    body = await req.json();
  } catch (err: any) {
    console.error(
      ">>> ⚠️ ERROR PARSEANDO JSON (Payload muy grande o corrupto).",
    );

    return new Response(
      JSON.stringify({ received: true, status: "parse_error" }),
      { status: 200 },
    );
  }

  try {
    console.log(">>> EVENTO RECIBIDO (RAW):", body);

    const extraerOfertas = (payload: any): any[] => {
      let posiblesOfertas: any[] = [];
      if (Array.isArray(payload)) posiblesOfertas = payload;
      else if (payload?.data && Array.isArray(payload.data))
        posiblesOfertas = payload.data;
      else if (payload?.data?.groups && Array.isArray(payload.data.groups))
        posiblesOfertas = payload.data.groups;
      else if (payload?.payload && Array.isArray(payload.payload))
        posiblesOfertas = payload.payload;

      return posiblesOfertas.filter(
        (item) =>
          item?.products ||
          item?.id_db ||
          item?.total_price ||
          item?.document_reference,
      );
    };

    const ofertasValidas = extraerOfertas(body);
    const nombresExitosos = [
      "policy_list",
      "policy-list",
      "update-policy",
      "update-view-status",
    ];

    let esEventoExitoso = false;
    let eventName = "ARRAY_PAYLOAD";

    if (!Array.isArray(body)) {
      eventName = body?.event_name || body?.name || "SIN_NOMBRE";
      if (nombresExitosos.includes(eventName)) esEventoExitoso = true;
    }

    if (ofertasValidas.length > 0 || esEventoExitoso) {
      console.log(
        `>>> OFERTAS APROBADAS ENCONTRADAS (${ofertasValidas.length})`,
      );
    }
  } catch (err: any) {
    console.error(">>> ERROR LÓGICO EN WEBHOOK:", err.message);
  }

  // Siempre responder 200 al final
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
