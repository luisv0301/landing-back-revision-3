"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MunicipioDIVIPOLA } from "@/app/actions";
import { DocumentType, PolicyExpiresCode } from "@/lib/types/sunrise";
import { Search, X, UserCheck, RotateCcw, AlertCircle } from "lucide-react";

// Subcomponente accesible y animado para mensajes de error debajo del campo
export function FieldError({
  id,
  error,
}: {
  id: string;
  error?: string | null;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          initial={{
            opacity: 0,
            transform: shouldReduceMotion ? "none" : "translateY(-4px)",
          }}
          animate={{
            opacity: 1,
            transform: shouldReduceMotion ? "none" : "translateY(0px)",
          }}
          exit={{
            opacity: 0,
            transform: shouldReduceMotion ? "none" : "translateY(-4px)",
          }}
          transition={{
            duration: 0.18,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1.5"
        >
          <AlertCircle size={14} className="shrink-0 text-red-500" aria-hidden="true" />
          <span>{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// Funciones puras de validación de campos
export const VALIDACIONES = {
  nombre: (val: string): string | null => {
    const v = val.trim();
    if (!v) return "Ingresa tu nombre.";
    if (v.length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v)) {
      return "El nombre solo puede contener letras y espacios.";
    }
    return null;
  },

  apellido: (val: string): string | null => {
    const v = val.trim();
    if (!v) return "Ingresa tu apellido.";
    if (v.length < 2) return "El apellido debe tener al menos 2 caracteres.";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v)) {
      return "El apellido solo puede contener letras y espacios.";
    }
    return null;
  },

  documento: (val: string, tipo: DocumentType): string | null => {
    const v = val.trim();
    if (!v) return "Ingresa tu número de documento.";

    if (tipo === "CC") {
      if (!/^\d+$/.test(v)) return "La cédula solo debe contener números.";
      if (v.length < 5 || v.length > 10) return "La cédula debe tener entre 5 y 10 dígitos.";
    } else if (tipo === "CE") {
      if (!/^\d+$/.test(v)) return "La cédula de extranjería solo debe contener números.";
      if (v.length < 6 || v.length > 10) return "La cédula de extranjería debe tener entre 6 y 10 dígitos.";
    } else if (tipo === "NIT") {
      if (!/^\d+$/.test(v)) return "El NIT solo debe contener números.";
      if (v.length < 9 || v.length > 10) return "El NIT debe tener entre 9 y 10 dígitos.";
    } else if (tipo === "PA") {
      if (v.length < 6 || v.length > 16) return "El pasaporte debe tener entre 6 y 16 caracteres.";
    }
    return null;
  },

  telefono: (val: string): string | null => {
    const v = val.replace(/\D/g, "");
    if (!v) return "Ingresa tu número de celular.";
    if (v.length !== 10 || !v.startsWith("3")) {
      return "Ingresa un celular válido de 10 dígitos (ej: 300 123 4567).";
    }
    return null;
  },

  email: (val: string): string | null => {
    const v = val.trim();
    if (!v) return "Ingresa tu correo electrónico.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(v)) {
      return "Ingresa un correo electrónico válido (ej: nombre@correo.com).";
    }
    return null;
  },

  ciudad: (ciudad: MunicipioDIVIPOLA | null, query: string): string | null => {
    if (!ciudad) {
      return query.trim().length > 0
        ? "Selecciona una ciudad válida de las opciones desplegadas."
        : "Selecciona tu ciudad de circulación.";
    }
    return null;
  },
};

// Subcomponente: Formulario de Datos del Tomador
export function DatosTomadorFields({
  nombre,
  onChangeNombre,
  apellido,
  onChangeApellido,
  tipoDocumento,
  onChangeTipoDocumento,
  numeroDocumento,
  onChangeNumeroDocumento,
  genero,
  onChangeGenero,
  telefono,
  onChangeTelefono,
  email,
  onChangeEmail,
  errors,
  onBlurField,
}: {
  nombre: string;
  onChangeNombre: (val: string) => void;
  apellido: string;
  onChangeApellido: (val: string) => void;
  tipoDocumento: DocumentType;
  onChangeTipoDocumento: (val: DocumentType) => void;
  numeroDocumento: string;
  onChangeNumeroDocumento: (val: string) => void;
  genero: "M" | "F";
  onChangeGenero: (val: "M" | "F") => void;
  telefono: string;
  onChangeTelefono: (val: string) => void;
  email: string;
  onChangeEmail: (val: string) => void;
  errors?: Record<string, string | null>;
  onBlurField?: (field: string, error: string | null) => void;
}) {
  const [localErrors, setLocalErrors] = useState<Record<string, string | null>>({});

  const handleBlur = (field: string) => {
    let error: string | null = null;
    switch (field) {
      case "nombre":
        error = VALIDACIONES.nombre(nombre);
        break;
      case "apellido":
        error = VALIDACIONES.apellido(apellido);
        break;
      case "numeroDocumento":
        error = VALIDACIONES.documento(numeroDocumento, tipoDocumento);
        break;
      case "telefono":
        error = VALIDACIONES.telefono(telefono);
        break;
      case "email":
        error = VALIDACIONES.email(email);
        break;
    }

    setLocalErrors((prev) => ({ ...prev, [field]: error }));
    onBlurField?.(field, error);
  };

  const getError = (field: string) => errors?.[field] ?? localErrors[field];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre(s) *</Label>
          <Input
            id="nombre"
            name="nombre"
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => onChangeNombre(e.target.value)}
            onBlur={() => handleBlur("nombre")}
            aria-invalid={Boolean(getError("nombre"))}
            aria-describedby={getError("nombre") ? "nombre-error" : undefined}
            placeholder="Ej: Lionel Andrés…"
            required
            spellCheck={false}
            className="uppercase bg-white p-6 rounded-full"
          />
          <FieldError id="nombre" error={getError("nombre")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido(s) *</Label>
          <Input
            id="apellido"
            name="apellido"
            autoComplete="family-name"
            value={apellido}
            onChange={(e) => onChangeApellido(e.target.value)}
            onBlur={() => handleBlur("apellido")}
            aria-invalid={Boolean(getError("apellido"))}
            aria-describedby={getError("apellido") ? "apellido-error" : undefined}
            placeholder="Ej: Messi Cuccittini…"
            required
            spellCheck={false}
            className="uppercase bg-white p-6 rounded-full"
          />
          <FieldError id="apellido" error={getError("apellido")} />
        </div>
      </div>

      <div className="flex gap-2 items-start">
        <div className="space-y-2 w-28 shrink-0">
          <Label>Tipo *</Label>
          <Select
            value={tipoDocumento}
            onValueChange={(val) => {
              const nextType = (val as DocumentType) ?? "CC";
              onChangeTipoDocumento(nextType);
              if (localErrors["numeroDocumento"] !== undefined) {
                setLocalErrors((prev) => ({
                  ...prev,
                  numeroDocumento: VALIDACIONES.documento(numeroDocumento, nextType),
                }));
              }
            }}
          >
            <SelectTrigger className="bg-white p-6 rounded-full w-full">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="CC">CC</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
              <SelectItem value="PA">PAS</SelectItem>
              <SelectItem value="NIT">NIT</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="tipoDocumento" value={tipoDocumento} />
        </div>

        <div className="space-y-2 grow">
          <Label htmlFor="documento">Número de Documento *</Label>
          <Input
            id="documento"
            name="numeroDocumento"
            value={numeroDocumento}
            onChange={(e) => onChangeNumeroDocumento(e.target.value)}
            onBlur={() => handleBlur("numeroDocumento")}
            aria-invalid={Boolean(getError("numeroDocumento"))}
            aria-describedby={getError("numeroDocumento") ? "documento-error" : undefined}
            inputMode="numeric"
            required
            className="uppercase bg-white p-6 rounded-full pr-10"
          />
          <FieldError id="documento" error={getError("numeroDocumento")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Género *</Label>
        <input type="hidden" name="genero" value={genero} />
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => onChangeGenero("M")}
            className={`p-6 rounded-full text-gray-700 hover:bg-neutral-700 hover:text-white font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${genero === "M"
              ? "border-neutral-900 bg-neutral-900 font-semibold text-white"
              : "border-gray-200 bg-white"
              }`}
          >
            Masculino
          </Button>
          <Button
            type="button"
            onClick={() => onChangeGenero("F")}
            className={`p-6 rounded-full text-gray-700 hover:bg-neutral-700 hover:text-white font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${genero === "F"
              ? "border-neutral-900 bg-neutral-900 font-semibold text-white"
              : "border-gray-200 bg-white"
              }`}
          >
            Femenino
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Número de Celular *</Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telefono}
          onChange={(e) => onChangeTelefono(e.target.value)}
          onBlur={() => handleBlur("telefono")}
          aria-invalid={Boolean(getError("telefono"))}
          aria-describedby={getError("telefono") ? "telefono-error" : undefined}
          required
          className="uppercase bg-white p-6 rounded-full"
        />
        <FieldError id="telefono" error={getError("telefono")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          aria-invalid={Boolean(getError("email"))}
          aria-describedby={getError("email") ? "email-error" : undefined}
          required
          className="uppercase bg-white p-6 rounded-full pr-10"
        />
        <FieldError id="email" error={getError("email")} />
      </div>
    </>
  );
}

// Subcomponente: Input y Búsqueda de Ciudad de Circulación
export function CiudadCirculacionInput({
  ciudadSeleccionada,
  queryCiudad,
  listaCiudades,
  onSearchCiudad,
  onSelectCiudad,
  onResetCiudad,
  error: errorExterno,
}: {
  ciudadSeleccionada: MunicipioDIVIPOLA | null;
  queryCiudad: string;
  listaCiudades: MunicipioDIVIPOLA[];
  onSearchCiudad: (text: string) => void;
  onSelectCiudad: (c: MunicipioDIVIPOLA) => void;
  onResetCiudad: () => void;
  error?: string | null;
}) {
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const tieneValor = Boolean(ciudadSeleccionada || queryCiudad);

  const handleClear = () => {
    onResetCiudad();
    onSearchCiudad("");
    setErrorLocal(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const err = VALIDACIONES.ciudad(ciudadSeleccionada, queryCiudad);
      setErrorLocal(err);
    }, 200);
  };

  const errorActual = errorExterno ?? errorLocal;

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="search_query_circulacion">Ciudad de Circulación *</Label>
      <input
        type="hidden"
        name="cityCode"
        value={ciudadSeleccionada?.city_code || ""}
      />
      <input
        type="hidden"
        name="cityName"
        value={ciudadSeleccionada?.city_name || ""}
      />
      <div className="relative">
        <Input
          id="search_query_circulacion"
          name="no_autofill_circulacion_search"
          value={
            ciudadSeleccionada
              ? `${ciudadSeleccionada.city_name} (${ciudadSeleccionada.state_name})`
              : queryCiudad
          }
          onChange={(e) => {
            onResetCiudad();
            onSearchCiudad(e.target.value);
          }}
          onBlur={handleBlur}
          placeholder="ej: Cali, Bogotá"
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          required
          aria-invalid={Boolean(errorActual)}
          aria-describedby={errorActual ? "search_query_circulacion-error" : undefined}
          className="uppercase bg-white p-6 rounded-full pr-12"
        />
        {tieneValor ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer"
            aria-label="Limpiar ciudad"
          >
            <X size={18} />
          </button>
        ) : (
          <Search
            className="absolute right-6 top-4 text-gray-400 pointer-events-none"
            size={18}
          />
        )}
      </div>

      <FieldError id="search_query_circulacion" error={errorActual} />

      {!ciudadSeleccionada && listaCiudades.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto mt-1">
          {listaCiudades.map((c) => (
            <button
              key={c.city_code}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                onSelectCiudad(c);
                setErrorLocal(null);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-yellow-50 text-sm border-b last:border-0 border-gray-100 cursor-pointer"
            >
              <span className="font-semibold text-gray-900">{c.city_name}</span>
              <span className="text-gray-500 text-xs block">
                {c.state_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Subcomponente: Condiciones de la Póliza (Vencimiento y Endoso)
export const OPCIONES_VENCIMIENTO: Array<{ code: PolicyExpiresCode; label: string }> = [
  { code: "now", label: "Ya mismo" },
  { code: "week", label: "En una semana" },
  { code: "15_30", label: "15-30 días" },
  { code: "over_30", label: "Más de 30 días" },
  { code: "none", label: "No tengo póliza actualmente" },
];

export const OPCIONES_ENDOSO: Array<{ value: boolean; label: string }> = [
  { value: true, label: "Sí, tiene endoso a favor de un banco" },
  { value: false, label: "No tiene endoso" },
];

export function CondicionesPolizaFields({
  vencimientoPoliza = "now",
  onChangeVencimiento,
  endosoBanco = false,
  onChangeEndoso,
}: {
  vencimientoPoliza: PolicyExpiresCode;
  onChangeVencimiento: (val: PolicyExpiresCode) => void;
  endosoBanco: boolean;
  onChangeEndoso: (val: boolean) => void;
}) {
  return (
    <>
      <div className="pt-2 space-y-3 border-t border-gray-100">
        <Label className="text-sm font-semibold">
          ¿Cuándo vence tu póliza actual?
        </Label>
        <input
          type="hidden"
          name="policyExpires"
          value={vencimientoPoliza}
        />
        <input
          type="hidden"
          name="hasCurrentPolicy"
          value={vencimientoPoliza !== "none" ? "true" : "false"}
        />
        <div className="space-y-1.5 md:grid md:grid-cols-2 md:gap-2">
          {OPCIONES_VENCIMIENTO.map((op) => (
            <Button
              key={op.code}
              type="button"
              onClick={() => onChangeVencimiento(op.code)}
              className={`w-full text-left p-6 rounded-full border text-sm font-medium transition-all shadow-xs border-input cursor-pointer ${vencimientoPoliza === op.code
                ? "border-neutral-900 bg-neutral-900 text-white font-semibold hover:bg-neutral-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-neutral-700 hover:text-white"
                }`}
            >
              {op.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Condición Financiera</Label>
        <input
          type="hidden"
          name="bankEndorsement"
          value={endosoBanco ? "true" : "false"}
        />
        <div className="space-y-1.5">
          {OPCIONES_ENDOSO.map((op) => (
            <Button
              key={op.label}
              type="button"
              onClick={() => onChangeEndoso(op.value)}
              className={`w-full text-left p-6 rounded-full text-sm font-medium transition-all shadow-xs border border-input cursor-pointer ${endosoBanco === op.value
                ? "border-neutral-900 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold"
                : "border-gray-200 bg-white text-gray-700 hover:bg-neutral-700 hover:text-white"
                }`}
            >
              {op.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

// Subcomponente: Tarjeta de Notificación para Cotizaciones que esperan Asesor o con Estado Failed
export function OfertaAwaitingAdvisorCard({
  ticketId,
  message,
  status,
  onReset,
}: {
  ticketId?: number | string;
  message?: string | null;
  status?: string | null;
  onReset?: () => void;
}) {
  const isFailed = status === "failed";
  const title = isFailed
    ? "No fue posible liquidar ofertas en línea"
    : "Un asesor te contactará a la brevedad";

  const description =
    message ||
    (isFailed
      ? "No pudimos conectar con las aseguradoras en este momento, pero tu solicitud ha quedado radicada y un especialista revisará tu caso para brindarte las mejores opciones."
      : "Hemos recibido tu solicitud y un especialista de Segurautos revisará las opciones y te contactará con la mejor tarifa disponible.");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xs max-w-xl mx-auto"
    >
      <div
        className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full ${isFailed ? "bg-amber-100 text-amber-700" : "bg-yellow-100 text-yellow-700"
          }`}
      >
        <UserCheck size={32} />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        {ticketId && (
          <div className="inline-block mt-3 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
            Número de Solicitud: #{ticketId}
          </div>
        )}
      </div>

      {onReset && (
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="rounded-full px-6 py-2 text-sm text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            <RotateCcw size={16} className="mr-2" />
            Cotizar otro vehículo
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// Subcomponente: Tarjeta de Estado Vacío (Ready pero sin ofertas y sin PDF)
export function OfertaEmptyStateCard({
  ticketId,
  message,
  onReintentar,
  onReset,
}: {
  ticketId?: number | string;
  message?: string | null;
  onReintentar?: () => void;
  onReset?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-6 shadow-xs max-w-xl mx-auto"
    >
      <div className="mx-auto bg-gray-100 w-16 h-16 flex items-center justify-center rounded-full text-gray-600">
        <Search size={32} />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-gray-900">
          No encontramos ofertas inmediatas en línea
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {message ||
            "Para las características de este vehículo o perfil, las aseguradoras no generaron cotizaciones automáticas directas. Sin embargo, tu solicitud está radicada y nuestro equipo puede cotizarlo de manera personalizada."}
        </p>
        {ticketId && (
          <div className="inline-block mt-3 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
            Radicado de Solicitud: #{ticketId}
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {onReintentar && (
          <Button
            type="button"
            variant="outline"
            onClick={onReintentar}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer w-full sm:w-auto"
          >
            <RotateCcw size={16} className="mr-2" />
            Reintentar consulta
          </Button>
        )}
        {onReset && (
          <Button
            type="button"
            onClick={onReset}
            className="rounded-full px-6 py-2.5 text-sm font-semibold bg-[#FFCC00] hover:bg-[#E6B800] text-black transition-colors cursor-pointer w-full sm:w-auto shadow-none"
          >
            Cotizar otro vehículo
          </Button>
        )}
      </div>
    </motion.div>
  );
}
