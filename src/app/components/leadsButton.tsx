"use client";

import { useActionState, useId } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    sendLeadAction,
    type FormState,
} from "../actions/leads";

const CIUDADES_COLOMBIA = [
    "(Otro)",
    "Bogotá, Distrito Capital",
    "Medellín",
    "Cartagena",
    "Barranquilla",
    "Bucaramanga",
    "Cali",
    "Armenia",
    "Apartadó",
    "Arauca",
    "Buenaventura",
    "Cúcuta",
    "Florencia",
    "Dosquebradas",
    "Fusagasugá",
    "IbaguéInírida",
    "Manizales",
    "Montería",
    "Neiva",
    "Pasto",
    "Pereira",
    "Quibdó",
    "Ríohacha",
    "Santa Marta",
    "Tunja",
    "Valledupar",
    "Villavicencio",
];

const initialFormState: FormState = {
    success: false,
    message: null,
};


export function QuoteForm({
    defaultVehicleType = "carro",
    onSuccess,
}: {
    defaultVehicleType?: "carro" | "moto" | "publicos pesados";
    onSuccess?: () => void;
}) {
    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        async (prevState, formData) => {
            const result = await sendLeadAction(prevState, formData);
            if (result.success && onSuccess) {
                onSuccess();
            }
            return result;
        },
        initialFormState
    );

    const tipoVehiculoId = useId();
    const placaId = useId();
    const modeloId = useId();
    const ciudadId = useId();
    const nombreId = useId();
    const cedulaId = useId();
    const fechaNacimientoId = useId();
    const telefonoId = useId();
    const emailId = useId();
    const polizaSiId = useId();
    const polizaNoId = useId();
    const comentarioId = useId();
    const aceptaTerminosId = useId();

    return (
        <form action={formAction} className="w-full space-y-6 pb-6 text-neutral-900">


            {/* Bloque 1: Información del Vehículo */}
            <fieldset className="space-y-4 rounded-2xl bg-neutral-50/80 p-4 border border-neutral-200/80">
                <legend className="px-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
                    1. Datos del Vehículo
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Tipo de vehículo */}
                    <div>
                        <label
                            htmlFor={tipoVehiculoId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Tipo de vehículo <span className="text-red-500">*</span>
                        </label>
                        <select
                            id={tipoVehiculoId}
                            name="tipo_vehiculo"
                            defaultValue={defaultVehicleType}
                            required
                            disabled={isPending}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        >
                            <option value="carro">Carro</option>
                            <option value="moto">Moto</option>
                            <option value="publicos pesados">Públicos / Pesados</option>
                        </select>
                        {state.errors?.tipo_vehiculo && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.tipo_vehiculo[0]}</p>
                        )}
                    </div>

                    {/* Placa */}
                    <div>
                        <label
                            htmlFor={placaId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Placa del vehículo <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={placaId}
                            name="placa"
                            type="text"
                            required
                            disabled={isPending}
                            placeholder="Ej. ABC123…"
                            maxLength={7}
                            autoCapitalize="characters"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm uppercase text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.placa && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.placa[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Modelo (Año) */}
                    <div>
                        <label
                            htmlFor={modeloId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Modelo (Año) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={modeloId}
                            name="modelo"
                            type="number"
                            inputMode="numeric"
                            min="1980"
                            max="2030"
                            required
                            disabled={isPending}
                            placeholder="Ej. 2023…"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.modelo && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.modelo[0]}</p>
                        )}
                    </div>

                    {/* Ciudad de circulación */}
                    <div>
                        <label
                            htmlFor={ciudadId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Ciudad de circulación <span className="text-red-500">*</span>
                        </label>
                        <select
                            id={ciudadId}
                            name="ciudad"
                            required
                            disabled={isPending}
                            defaultValue=""
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        >
                            <option value="" disabled>
                                Selecciona una ciudad…
                            </option>
                            {CIUDADES_COLOMBIA.map((ciudad) => (
                                <option key={ciudad} value={ciudad}>
                                    {ciudad}
                                </option>
                            ))}
                        </select>
                        {state.errors?.ciudad && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.ciudad[0]}</p>
                        )}
                    </div>
                </div>
            </fieldset>

            {/* Bloque 2: Datos Personales */}
            <fieldset className="space-y-4 rounded-2xl bg-neutral-50/80 p-4 border border-neutral-200/80">
                <legend className="px-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
                    2. Datos del Asegurado
                </legend>

                <div>
                    <label
                        htmlFor={nombreId}
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                        Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                        id={nombreId}
                        name="nombre"
                        type="text"
                        autoComplete="name"
                        required
                        disabled={isPending}
                        placeholder="Ej. Juan Carlos Pérez…"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                    />
                    {state.errors?.nombre && (
                        <p className="mt-1 text-xs text-red-600">{state.errors.nombre[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Cédula */}
                    <div>
                        <label
                            htmlFor={cedulaId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Número de Cédula <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={cedulaId}
                            name="cedula"
                            type="text"
                            inputMode="numeric"
                            required
                            disabled={isPending}
                            placeholder="Ej. 1020304050…"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.cedula && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.cedula[0]}</p>
                        )}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                        <label
                            htmlFor={fechaNacimientoId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Fecha de Nacimiento <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={fechaNacimientoId}
                            name="fecha_nacimiento"
                            type="date"
                            autoComplete="bday"
                            required
                            disabled={isPending}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.fecha_nacimiento && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.fecha_nacimiento[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Teléfono */}
                    <div>
                        <label
                            htmlFor={telefonoId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Número de teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={telefonoId}
                            name="telefono"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                            disabled={isPending}
                            placeholder="Ej. 320 123 4567…"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.telefono && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.telefono[0]}</p>
                        )}
                    </div>

                    {/* Correo electrónico */}
                    <div>
                        <label
                            htmlFor={emailId}
                            className="block text-xs font-semibold text-neutral-700 mb-1"
                        >
                            Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={emailId}
                            name="email"
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
                            required
                            disabled={isPending}
                            placeholder="ejemplo@correo.com…"
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50"
                        />
                        {state.errors?.email && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
                        )}
                    </div>
                </div>
            </fieldset>

            {/* Bloque 3: Opciones Adicionales */}
            <fieldset className="space-y-4 rounded-2xl bg-neutral-50/80 p-4 border border-neutral-200/80">
                <legend className="px-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
                    3. Información Adicional
                </legend>

                {/* ¿Tienes póliza todo riesgo? */}
                <div>
                    <span className="block text-xs font-semibold text-neutral-700 mb-2">
                        ¿Tienes póliza todo riesgo actualmente? (Opcional)
                    </span>
                    <div className="flex items-center gap-6">
                        <label
                            htmlFor={polizaSiId}
                            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 cursor-pointer"
                        >
                            <input
                                id={polizaSiId}
                                name="tiene_poliza"
                                type="radio"
                                value="si"
                                disabled={isPending}
                                className="size-4 text-neutral-900 border-neutral-300 focus-visible:ring-neutral-900"
                            />
                            <span>Sí</span>
                        </label>
                        <label
                            htmlFor={polizaNoId}
                            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-800 cursor-pointer"
                        >
                            <input
                                id={polizaNoId}
                                name="tiene_poliza"
                                type="radio"
                                value="no"
                                disabled={isPending}
                                className="size-4 text-neutral-900 border-neutral-300 focus-visible:ring-neutral-900"
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                {/* Comentario opcional */}
                <div>
                    <label
                        htmlFor={comentarioId}
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                        Comentario adicional (Opcional)
                    </label>
                    <textarea
                        id={comentarioId}
                        name="comentario"
                        rows={2}
                        disabled={isPending}
                        placeholder="Ej. Deseo conocer coberturas de pérdida total o conductor elegido…"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 disabled:opacity-50 resize-none"
                    />
                </div>
            </fieldset>

            {/* Bloque 4: Términos y Confirmación */}
            <div className="space-y-4">
                <label
                    htmlFor={aceptaTerminosId}
                    className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 cursor-pointer select-none"
                >
                    <input
                        id={aceptaTerminosId}
                        name="acepta_terminos"
                        type="checkbox"
                        required
                        disabled={isPending}
                        className="mt-0.5 size-4 rounded border-amber-400 text-neutral-900 focus-visible:ring-amber-500 shrink-0"
                    />
                    <span className="text-xs font-medium text-neutral-800 leading-snug">
                        Solo cotizamos <strong>PÓLIZAS Todo Riesgo</strong>. No aplica para SOAT. Marca esta casilla para aceptar. <span className="text-red-500">*</span>
                    </span>
                </label>
                {state.errors?.acepta_terminos && (
                    <p className="text-xs text-red-600">{state.errors.acepta_terminos[0]}</p>
                )}

                {/* Botón de Enviar con Feedback de Carga */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full min-h-14 items-center justify-center gap-2.5 rounded-full bg-[#FFD000] px-6 py-4 text-base font-bold text-neutral-900 transition-all duration-200 hover:bg-[#e6bd00] active:scale-[0.99] focus-visible:ring-3 focus-visible:ring-neutral-900/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 shadow-sm cursor-pointer"
                >
                    {isPending ? (
                        <>
                            <SpinnerIcon className="h-5 w-5 animate-spin" />
                            <span>Enviando cotización…</span>
                        </>
                    ) : (
                        <span>Quiero cotizar mi seguro gratis</span>
                    )}
                </button>

                <p className="text-xs text-neutral-500 text-center">
                    Sin costo ni compromiso. Te contactaremos por WhatsApp o correo.
                </p>
            </div>

            {/* Mensaje de retroalimentación accesible */}
            {state.message && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`p-4 rounded-2xl text-sm font-medium text-center transition-all ${state.success
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                        : "bg-red-50 text-red-900 border border-red-300"
                        }`}
                >
                    {state.message}
                </div>
            )}
        </form>
    );
}


export function LeadQuoteSheet({
    trigger,
    defaultVehicleType = "carro",
}: {
    trigger?: React.ReactNode;
    defaultVehicleType?: "carro" | "moto" | "publicos pesados";
}) {
    return (
        <Sheet>
            <SheetTrigger render={
                <Button
                    className="py-5 px-6 rounded-full text-black w-full min-h-14 font-bold transition-all duration-200 hover:bg-yellow-500 active:scale-[0.98] cursor-pointer shadow-xs"
                >Cotizar</Button>

            } />
            <SheetContent
                side="right"
                className="border-t min-w-[90%] sm:h-full sm:max-h-full sm:w-full sm:min-w-105 sm:rounded-none sm:border-t-0 sm:border-l overflow-y-auto overscroll-contain p-6"
            >
                <SheetHeader className="p-0 mb-4 text-left">
                    <SheetTitle className="text-xl font-bold tracking-tight text-neutral-900">
                        Cotiza tu seguro todo riesgo
                    </SheetTitle>
                    <SheetDescription className="text-xs text-neutral-600">
                        Completa tus datos y los de tu vehículo para recibir las mejores opciones de más de 13 aseguradoras.
                    </SheetDescription>
                </SheetHeader>

                <QuoteForm defaultVehicleType={defaultVehicleType} />
            </SheetContent>
        </Sheet>
    );
}

function SpinnerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
