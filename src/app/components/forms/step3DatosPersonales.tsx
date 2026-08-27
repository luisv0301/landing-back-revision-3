"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
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
import { buscarCiudadesAction, MunicipioDIVIPOLA } from "@/app/actions";
import { Search } from "lucide-react";
import { iniciarCotizacionAction } from "@/app/actions/cotizaciones";

interface DatosPersonales {
  nombreCompleto: string;
  firstname: string;
  lastname: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  genero: "M" | "F";
  fechaNacimiento: string;
  cityCode: string;
  cityName: string;
  vencimientoPoliza?: string;
  endosoBanco?: string;
}

interface Step3Props {
  onNext: (datos: {
    personales: DatosPersonales;
    session: { channelName: string; token: string | undefined };
    oppId: string;
    jsonComparativoUrl: string;
    pdfUrl: string;
  }) => void;
  vehiculoData: any;
  initialData: any;
}

export default function Step3DatosPersonales({
  onNext,
  vehiculoData,
  initialData,
}: Step3Props) {
  // Estados del Formulario
  const [nombreCompleto, setNombreCompleto] = useState(
    initialData?.nombreCompleto || "",
  );
  const [tipoDocumento, setTipoDocumento] = useState(
    initialData?.tipoDocumento || "CC",
  );
  const [numeroDocumento, setNumeroDocumento] = useState(
    initialData?.numeroDocumento || "",
  );
  const [telefono, setTelefono] = useState(initialData?.telefono || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [genero, setGenero] = useState<"M" | "F">(initialData?.genero || "M");
  const [fechaNacimiento, setFechaNacimiento] = useState(
    initialData?.fechaNacimiento || "",
  );
  const [educationalLevel, setEducationalLevel] = useState(
    initialData?.educationalLevel || "professional",
  );

  // Opciones de prospección/CRM
  const [vencimientoPoliza, setVencimientoPoliza] = useState("Ya mismo");
  const [endosoBanco, setEndosoBanco] = useState("No tiene endoso");

  // Autocompletado de Ciudades DIVIPOLA
  const [queryCiudad, setQueryCiudad] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] =
    useState<MunicipioDIVIPOLA | null>(
      initialData?.cityCode && initialData?.cityName
        ? {
            city_code: initialData.cityCode,
            city_name: initialData.cityName,
            state_name: "", // Opcional
          }
        : null,
    );
  const [listaCiudades, setListaCiudades] = useState<MunicipioDIVIPOLA[]>([]);
  const [isPendingCiudad, startTransitionCiudad] = useTransition();

  const [errorLocal, setErrorLocal] = useState("");
  const [isSubmitting, startTransitionSubmit] = useTransition();

  // Búsqueda de ciudades con debounce visual
  const handleSearchCiudad = (text: string) => {
    setQueryCiudad(text);
    if (text.length >= 3) {
      startTransitionCiudad(async () => {
        const res = await buscarCiudadesAction(text);
        if (res.success && res.ciudades) {
          setListaCiudades(res.ciudades);
        }
      });
    } else {
      setListaCiudades([]);
    }
  };

  // Manejo del Submit del Paso 3
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLocal("");

    if (!ciudadSeleccionada) {
      setErrorLocal(
        "Por favor selecciona tu ciudad de circulación de la lista",
      );
      return;
    }

    // Dividir Nombre Completo
    const partesNombre = nombreCompleto.trim().split(" ");
    const firstname = partesNombre[0] || "";
    const lastname = partesNombre.slice(1).join(" ") || partesNombre[0] || "";

    const payloadPersonales = {
      nombreCompleto,
      firstname,
      lastname,
      tipoDocumento,
      numeroDocumento,
      telefono,
      email,
      genero,
      fechaNacimiento,
      cityCode: ciudadSeleccionada.city_code,
      cityName: ciudadSeleccionada.city_name,
    };

    // Disparamos la acción del servidor y avanzamos al Paso 4 pasando la sesión de cotización
    startTransitionSubmit(async () => {
      // Le pasamos el estado actual acumulado (Vehículo + Personales)
      const cotizadorPayload = {
        vehiculo: vehiculoData, // Asumimos que viene por props desde el orquestador
        personales: payloadPersonales,
      };

      const res = await iniciarCotizacionAction(cotizadorPayload);

      if (res.success && res.channelName) {
        // Pasamos al Paso 4 enviando el canal de transmisión de las ofertas
        onNext({
          personales: payloadPersonales,
          session: {
            channelName: res.channelName,
            token: res.token,
          },
          oppId: res.oppId,
          jsonComparativoUrl: res.jsonComparativoUrl,
          pdfUrl: res.pdfUrl,
        });
      } else {
        setErrorLocal(res.error || "Ocurrió un error al enviar tus datos.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        bounce: 0.45,
        duration: 0.5,
      }}
      className="w-full  mx-auto flex flex-col items-center max-w-137.5"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Datos del Conductor y Riesgo
        </h1>
        <p className="text-gray-600 text-sm">
          Necesitamos esta información para calcular tu cotización.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Nombre Completo */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Completo *</Label>
          <Input
            id="nombre"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            placeholder="Ej: Juan Pérez García"
            required
            className="uppercase bg-white p-6 rounded-full"
          />
        </div>

        {/* Tipo y Número de Documento */}
        <div className="flex gap-2">
          <div className="space-y-2 ">
            <Label>Tipo *</Label>
            <Select
              value={tipoDocumento}
              onValueChange={(val) => setTipoDocumento(val ?? "CC")}
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
          </div>

          <div className="space-y-2 grow">
            <Label htmlFor="documento">Número de Documento *</Label>
            <Input
              id="documento"
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              placeholder="Ej: 123456789"
              required
              className="uppercase bg-white p-6 rounded-full pr-10"
            />
          </div>
        </div>

        {/* Género */}
        <div className="space-y-1.5">
          <Label>Género *</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={() => setGenero("M")}
              className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input  ${
                genero === "M"
                  ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
                  : "border-gray-200 bg-white "
              }`}
            >
              Masculino
            </Button>
            <Button
              type="button"
              onClick={() => setGenero("F")}
              className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input  ${
                genero === "F"
                  ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
                  : "border-gray-200 bg-white "
              }`}
            >
              Femenino
            </Button>
          </div>
        </div>

        {/* Celular y Correo */}
        <div className="space-y-2">
          <Label htmlFor="telefono">Número de Celular *</Label>
          <Input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 3101234567"
            required
            className="uppercase bg-white p-6 rounded-full "
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
            className="uppercase bg-white p-6 rounded-full pr-10"
          />
        </div>

        {/* Nivel educativo */}

        <div className="space-y-1.5">
          <Label>Nivel Educativo *</Label>
          <Select
            value={educationalLevel}
            onValueChange={(val) => setEducationalLevel(val ?? "professional")}
          >
            <SelectTrigger className="bg-white p-6 rounded-full w-full uppercase">
              <SelectValue placeholder="Selecciona tu nivel educativo" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="uppercase">
              <SelectItem value="secondary">Secundaria / Bachiller</SelectItem>
              <SelectItem value="intermediate">
                Técnico / Tecnológico
              </SelectItem>
              <SelectItem value="professional">
                Profesional / Pregrado
              </SelectItem>
              <SelectItem value="master">Maestría / Posgrado</SelectItem>
              <SelectItem value="doctorate">Doctorado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ciudad de Circulación (DIVIPOLA) */}
        <div className="space-y-2 relative">
          <Label htmlFor="ciudad">Ciudad de Circulación *</Label>
          <div className="relative">
            <Input
              id="ciudad"
              value={
                ciudadSeleccionada
                  ? `${ciudadSeleccionada.city_name} (${ciudadSeleccionada.state_name})`
                  : queryCiudad
              }
              onChange={(e) => {
                setCiudadSeleccionada(null);
                handleSearchCiudad(e.target.value);
              }}
              placeholder="Escribe tu ciudad (ej: Cali, Bogotá)"
              autoComplete="off"
              required
              className="uppercase bg-white p-6 rounded-full pr-10"
            />
            <Search
              className="absolute right-6 top-4 text-gray-400"
              size={18}
            />
          </div>

          {/* Menú Flotante de Resultados DIVIPOLA */}
          {!ciudadSeleccionada && listaCiudades.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto mt-1">
              {listaCiudades.map((c) => (
                <button
                  key={c.city_code}
                  type="button"
                  onClick={() => {
                    setCiudadSeleccionada(c);
                    setListaCiudades([]);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-yellow-50 text-sm border-b last:border-0 border-gray-100"
                >
                  <span className="font-semibold text-gray-900">
                    {c.city_name}
                  </span>
                  <span className="text-gray-500 text-xs block">
                    {c.state_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="nacimiento">Fecha de Nacimiento *</Label>
          <Input
            id="nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
            className="uppercase bg-white p-6 rounded-full"
          />
        </div>

        {/* Preguntas adicionales comerciales / CRM */}
        <div className="pt-2 space-y-3 border-t border-gray-100">
          <Label className="text-sm font-semibold">
            ¿Cuándo vence tu póliza actual?
          </Label>
          <div className="space-y-1.5 md:grid md:grid-cols-2 md:gap-2">
            {[
              "Ya mismo",
              "En 1 semana",
              "15-30 días",
              "Más de 30 días",
              "No tengo póliza actualmente",
            ].map((op) => (
              <Button
                key={op}
                type="button"
                onClick={() => setVencimientoPoliza(op)}
                className={`w-full text-left p-6 rounded-full border text-sm font-medium transition-all shadow-xs border-input ${
                  vencimientoPoliza === op
                    ? "border-yellow-400 bg-yellow-50 text-black font-semibold"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {op}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Condición Financiera</Label>
          <div className="space-y-1.5">
            {[
              { id: "endoso", label: "Sí, tiene endoso a favor de un banco" },
              { id: "sin_endoso", label: "No tiene endoso" },
            ].map((op) => (
              <Button
                key={op.id}
                type="button"
                onClick={() => setEndosoBanco(op.label)}
                className={`w-full text-left p-6 rounded-full  text-sm font-medium transition-all shadow-xs border border-input ${
                  endosoBanco === op.label
                    ? "border-yellow-400 bg-yellow-50 text-black font-semibold"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {op.label}
              </Button>
            ))}
          </div>
        </div>

        {errorLocal && (
          <p className="text-sm text-red-500 text-center pt-2">{errorLocal}</p>
        )}

        <Button
          type="submit"
          className="w-full  hover:bg-yellow-500 text-black rounded-full p-6"
        >
          Generar Cotizaciones
        </Button>
      </form>
    </motion.div>
  );
}
