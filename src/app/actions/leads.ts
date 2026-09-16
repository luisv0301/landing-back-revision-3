"use server";

import nodemailer from "nodemailer";

export interface FormState {
    success: boolean;
    message: string | null;
    errors?: Record<string, string[]>;
}

export async function sendLeadAction(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const tipoVehiculo = formData.get("tipo_vehiculo")?.toString().trim();
    const placa = formData.get("placa")?.toString().trim().toUpperCase();
    const modelo = formData.get("modelo")?.toString().trim();
    const ciudad = formData.get("ciudad")?.toString().trim();
    const telefono = formData.get("telefono")?.toString().trim();
    const nombre = formData.get("nombre")?.toString().trim();
    const cedula = formData.get("cedula")?.toString().trim();
    const fechaNacimiento = formData.get("fecha_nacimiento")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const tienePoliza = formData.get("tiene_poliza")?.toString().trim() || "No especificado";
    const comentario = formData.get("comentario")?.toString().trim() || "Ninguno";
    const aceptaTerminos = formData.get("acepta_terminos");

    const errors: Record<string, string[]> = {};

    // Validaciones
    if (!tipoVehiculo) {
        errors.tipo_vehiculo = ["Selecciona el tipo de vehículo."];
    }
    if (!placa || placa.length < 5) {
        errors.placa = ["Ingresa una placa válida."];
    }
    if (!modelo || isNaN(Number(modelo))) {
        errors.modelo = ["Ingresa un año de modelo válido."];
    }
    if (!ciudad) {
        errors.ciudad = ["Selecciona la ciudad de circulación."];
    }
    if (!telefono || telefono.length < 7) {
        errors.telefono = ["Ingresa un número de teléfono válido."];
    }
    if (!nombre || nombre.length < 3) {
        errors.nombre = ["Ingresa tu nombre completo."];
    }
    if (!cedula || cedula.length < 5) {
        errors.cedula = ["Ingresa un número de cédula válido."];
    }
    if (!fechaNacimiento) {
        errors.fecha_nacimiento = ["Ingresa tu fecha de nacimiento."];
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = ["Ingresa un correo electrónico válido."];
    }
    if (!aceptaTerminos) {
        errors.acepta_terminos = ["Debes aceptar que solo cotizamos pólizas Todo Riesgo."];
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "Por favor revisa los campos requeridos.",
            errors,
        };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Cotizador Segurautos" <${process.env.GMAIL_USER}>`,
            to: "comunicaintercol@gmail.com",
            replyTo: email,
            subject: `Nueva solicitud de cotización Todo Riesgo - ${placa} (${tipoVehiculo})`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #171717;">
            <h2 style="color: #000; border-bottom: 2px solid #FFD000; padding-bottom: 8px;">Nueva solicitud de cotización todo riesgo</h2>
            
            <h3 style="color: #444; margin-top: 20px;">Datos del Vehículo</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 40%;">Tipo de vehículo:</td>
                    <td style="padding: 6px 0; text-transform: capitalize;">${tipoVehiculo}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Placa:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #000;">${placa}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Modelo (Año):</td>
                    <td style="padding: 6px 0;">${modelo}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Ciudad de circulación:</td>
                    <td style="padding: 6px 0;">${ciudad}</td>
                </tr>
            </table>

            <h3 style="color: #444; margin-top: 20px;">Datos Personales</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 40%;">Nombre completo:</td>
                    <td style="padding: 6px 0;">${nombre}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Número de Cédula:</td>
                    <td style="padding: 6px 0;">${cedula}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Fecha de Nacimiento:</td>
                    <td style="padding: 6px 0;">${fechaNacimiento}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Teléfono / WhatsApp:</td>
                    <td style="padding: 6px 0;"><a href="tel:${telefono}" style="color: #0066cc;">${telefono}</a></td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Correo electrónico:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
                </tr>
            </table>

            <h3 style="color: #444; margin-top: 20px;">Información Adicional</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 40%;">¿Tiene póliza todo riesgo?:</td>
                    <td style="padding: 6px 0; text-transform: capitalize;">${tienePoliza}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Comentario:</td>
                    <td style="padding: 6px 0;">${comentario}</td>
                </tr>
            </table>

            <p style="font-size: 12px; color: #737373; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px;">
                Mensaje generado automáticamente desde la landing de Segurautos.
            </p>
        </div>
      `,
        });

        return {
            success: true,
            message: "¡Cotización enviada con éxito! Pronto te contactaremos.",
        };
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return {
            success: false,
            message: "Ocurrió un error al enviar tu solicitud. Intenta nuevamente.",
        };
    }
}