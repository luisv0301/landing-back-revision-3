import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        console.log('\n=============================================');
        console.log('🔔 [WEBHOOK RECIBIDO] EVENTO:', payload.event_name || payload.name);
        console.log('🔑 PARAMETRO (ID):', payload.callback_param);


        if (payload.event_name === 'policy_list' || payload.name === 'policy_list') {
            const ofertas = payload.data || payload.offers || [];
            console.log(`✅ ¡ÉXITO! Se recibieron ${ofertas.length} ofertas.`);


            if (ofertas.length > 0) {
                console.log('📄 EJEMPLO DE LA PRIMERA OFERTA:', JSON.stringify(ofertas[0].products?.[0] || ofertas[0], null, 2));
            }
        } else {

            console.log('⚠️ DETALLE:', JSON.stringify(payload, null, 2));
        }
        console.log('=============================================\n');


        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('❌ Error procesando el webhook:', error.message);
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
}