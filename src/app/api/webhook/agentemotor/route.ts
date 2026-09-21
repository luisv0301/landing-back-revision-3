/**
 * Webhook anterior de Agente Motor.
 * NOTA: Deprecado. La nueva arquitectura con Sunrise CRM entrega los resultados
 * mediante polling al endpoint GET /api/landing/quotes/{ticket_id}/ sin requerir webhooks públicos.
 */
export async function GET() {
  return new Response("Webhook de Agente Motor deprecado. Integración migrada a Sunrise CRM API.", {
    status: 200,
  });
}

export async function POST() {
  return new Response(JSON.stringify({ received: true, status: "deprecated" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
