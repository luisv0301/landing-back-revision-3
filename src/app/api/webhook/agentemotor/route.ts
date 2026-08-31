export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(
      ">>> EVENTO RECIBIDO EN WEBHOOK:",
      JSON.stringify(body, null, 2),
    );
    const eventName = body.event_name || body.name;

    console.log(`>>> TIPO DE EVENTO: ${eventName}`);

    if (eventName === "policy_list" || body.offers || body.data?.products) {
      console.log(">>> ¡OFERTAS APROBADAS RECIBIDAS EN EL WEBHOOK!");
      console.log(JSON.stringify(body, null, 2));
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 400 });
  }
}
