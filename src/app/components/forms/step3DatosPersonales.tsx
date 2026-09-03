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
import { Search, X } from "lucide-react";
import { iniciarCotizacionAction } from "@/app/actions/cotizaciones";

export interface DatosPersonales {
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
  esMismoAsegurado?: boolean;
  aseguradoNombre?: string;
  aseguradoApellidos?: string;
  aseguradoCedula?: string;
  aseguradoEmail?: string;
}

interface Step3Props {
  onNext: (datos: {
    personales: DatosPersonales;
    oppId: string;
    jsonComparativoUrl: string;
    pdfUrl: string;
  }) => void;
  vehiculoData: any;
  initialData: any;
}

function encontrarMejorCoincidenciaCiudad(
  ciudades: MunicipioDIVIPOLA[],
  texto: string,
): MunicipioDIVIPOLA | null {
  if (!ciudades || ciudades.length === 0 || !texto) return null;

  const normalizar = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .trim();

  const textoNorm = normalizar(texto);
  const primerNombreNorm = normalizar(texto.split(/[,(]/)[0]);

  // 1. Coincidencia exacta de nombre de ciudad (ej. "Medellín" === "Medellin", "Bogota" === "Bogota")
  const matchExacto = ciudades.find((c) => {
    const cityNorm = normalizar(c.city_name);
    return cityNorm === primerNombreNorm || cityNorm === textoNorm;
  });
  if (matchExacto) return matchExacto;

  // 2. Coincidencia con "Ciudad (Departamento)" o "Ciudad Departamento"
  const matchCombinado = ciudades.find((c) => {
    const comb = normalizar(`${c.city_name} ${c.state_name}`);
    return comb === textoNorm || textoNorm.includes(comb);
  });
  if (matchCombinado) return matchCombinado;

  // 3. Coincidencia donde el nombre de la ciudad empieza exactamente igual (para "BOGOTA, D.C." buscando "Bogota")
  if (primerNombreNorm.length >= 4) {
    const matchPrefijo = ciudades.find((c) =>
      normalizar(c.city_name).startsWith(primerNombreNorm),
    );
    if (matchPrefijo) return matchPrefijo;
  }

  // 4. Si el texto completo incluye el nombre de la ciudad
  const matchContenido = ciudades.find((c) => {
    const cityNorm = normalizar(c.city_name);
    return cityNorm.length >= 4 && textoNorm.includes(cityNorm);
  });
  if (matchContenido) return matchContenido;

  // 5. Fallback al primer resultado si la búsqueda fue específica
  return ciudades[0] || null;
}

export default function Step3DatosPersonales({
  onNext,
  vehiculoData,
  initialData,
}: Step3Props) {
  // Estados del Tomador / Conductor
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

  // Estados del Asegurado
  const [esMismoAsegurado, setEsMismoAsegurado] = useState<boolean>(
    initialData?.esMismoAsegurado !== undefined ? initialData.esMismoAsegurado : true,
  );
  const [aseguradoNombre, setAseguradoNombre] = useState(
    initialData?.aseguradoNombre || "",
  );
  const [aseguradoApellidos, setAseguradoApellidos] = useState(
    initialData?.aseguradoApellidos || "",
  );
  const [aseguradoCedula, setAseguradoCedula] = useState(
    initialData?.aseguradoCedula || "",
  );
  const [aseguradoEmail, setAseguradoEmail] = useState(
    initialData?.aseguradoEmail || "",
  );

  // Condiciones de la póliza
  const [vencimientoPoliza, setVencimientoPoliza] = useState(
    initialData?.vencimientoPoliza || "Ya mismo",
  );
  const [endosoBanco, setEndosoBanco] = useState(
    initialData?.endosoBanco || "No tiene endoso",
  );

  // Búsqueda y selección de ciudad
  const [queryCiudad, setQueryCiudad] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] =
    useState<MunicipioDIVIPOLA | null>(
      initialData?.cityCode && initialData?.cityName
        ? {
          city_code: initialData.cityCode,
          city_name: initialData.cityName,
          state_name: "",
        }
        : null,
    );
  const [listaCiudades, setListaCiudades] = useState<MunicipioDIVIPOLA[]>([]);
  const [, startTransitionCiudad] = useTransition();

  const [errorLocal, setErrorLocal] = useState("");
  const [isSubmitting, startTransitionSubmit] = useTransition();

  // Búsqueda de ciudades para desplegar resultados en el menú (sin auto-bloquear el input mientras se escribe o borra)
  const handleSearchCiudad = (text: string) => {
    setQueryCiudad(text);
    const cleanText = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[,(]/)[0]
      .trim();

    if (cleanText.length >= 3) {
      startTransitionCiudad(async () => {
        const res = await buscarCiudadesAction(cleanText);
        if (res.success && res.ciudades) {
          setListaCiudades(res.ciudades);
        }
      });
    } else {
      setListaCiudades([]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLocal("");

    if (!esMismoAsegurado) {
      if (!aseguradoNombre.trim() || !aseguradoEmail.trim()) {
        setErrorLocal(
          "Por favor completa los datos obligatorios del asegurado",
        );
        return;
      }
    }

    // Leemos el valor real del input directamente desde el formulario del DOM para atrapar autocompletados del navegador
    const formElement = e.currentTarget;
    const inputCiudadEl = formElement.querySelector<HTMLInputElement>(
      "#search_query_circulacion",
    );
    const rawInputCity = (inputCiudadEl?.value || queryCiudad || "").trim();

    startTransitionSubmit(async () => {
      let targetCiudad = ciudadSeleccionada;

      // Si fue autocompletado por el navegador o no se seleccionó de la lista,
      // intentamos resolver automáticamente la ciudad a partir del texto del DOM / estado.
      if (!targetCiudad && rawInputCity.length >= 2) {
        const resCiudad = await buscarCiudadesAction(rawInputCity);
        if (resCiudad.success && resCiudad.ciudades && resCiudad.ciudades.length > 0) {
          targetCiudad = encontrarMejorCoincidenciaCiudad(resCiudad.ciudades, rawInputCity);
          if (targetCiudad) {
            setCiudadSeleccionada(targetCiudad);
          }
        }
      }

      if (!targetCiudad) {
        setErrorLocal(
          "Por favor selecciona tu ciudad de circulación de la lista",
        );
        return;
      }

      const partesNombre = nombreCompleto.trim().split(" ");
      const firstname = partesNombre[0] || "";
      const lastname = partesNombre.slice(1).join(" ") || partesNombre[0] || "";

      const payloadPersonales: DatosPersonales = {
        nombreCompleto,
        firstname,
        lastname,
        tipoDocumento,
        numeroDocumento,
        telefono,
        email,
        genero,
        fechaNacimiento,
        cityCode: targetCiudad.city_code,
        cityName: targetCiudad.city_name,
        vencimientoPoliza,
        endosoBanco,
        esMismoAsegurado,
        ...(esMismoAsegurado
          ? {}
          : {
            aseguradoNombre,
            aseguradoApellidos,
            aseguradoCedula,
            aseguradoEmail,
          }),
      };

      const cotizadorPayload = {
        vehiculo: vehiculoData,
        personales: payloadPersonales,
      };

      const res = await iniciarCotizacionAction(cotizadorPayload);

      if (res.success) {
        onNext({
          personales: payloadPersonales,
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
      className="w-full mx-auto flex flex-col items-center max-w-137.5"
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
        {/* Sección: Datos del Tomador */}
        <DatosTomadorForm
          nombreCompleto={nombreCompleto}
          onChangeNombre={setNombreCompleto}
          tipoDocumento={tipoDocumento}
          onChangeTipoDocumento={setTipoDocumento}
          numeroDocumento={numeroDocumento}
          onChangeNumeroDocumento={setNumeroDocumento}
          genero={genero}
          onChangeGenero={setGenero}
          telefono={telefono}
          onChangeTelefono={setTelefono}
          email={email}
          onChangeEmail={setEmail}
        />

        {/* Sección: Datos del Asegurado */}
        <DatosAseguradoSection
          esMismoAsegurado={esMismoAsegurado}
          onChangeEsMismoAsegurado={setEsMismoAsegurado}
          aseguradoNombre={aseguradoNombre}
          onChangeAseguradoNombre={setAseguradoNombre}
          aseguradoEmail={aseguradoEmail}
          onChangeAseguradoEmail={setAseguradoEmail}
        />

        {/* Sección: Ciudad de Circulación */}
        <CiudadCirculacionInput
          ciudadSeleccionada={ciudadSeleccionada}
          queryCiudad={queryCiudad}
          listaCiudades={listaCiudades}
          onSearchCiudad={handleSearchCiudad}
          onSelectCiudad={(c) => {
            setCiudadSeleccionada(c);
            setListaCiudades([]);
          }}
          onResetCiudad={() => setCiudadSeleccionada(null)}
        />

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

        {/* Condiciones de la Póliza */}
        <CondicionesPolizaSection
          vencimientoPoliza={vencimientoPoliza}
          onChangeVencimiento={setVencimientoPoliza}
          endosoBanco={endosoBanco}
          onChangeEndoso={setEndosoBanco}
        />

        {errorLocal && (
          <p className="text-sm text-red-500 text-center pt-2">{errorLocal}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full hover:bg-yellow-500 text-black rounded-full p-6 cursor-pointer"
        >
          {isSubmitting ? "Generando Cotizaciones…" : "Generar Cotizaciones"}
        </Button>
      </form>
    </motion.div>
  );
}

// Subcomponente: Formulario de Datos del Tomador
function DatosTomadorForm({
  nombreCompleto,
  onChangeNombre,
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
}: {
  nombreCompleto: string;
  onChangeNombre: (val: string) => void;
  tipoDocumento: string;
  onChangeTipoDocumento: (val: string) => void;
  numeroDocumento: string;
  onChangeNumeroDocumento: (val: string) => void;
  genero: "M" | "F";
  onChangeGenero: (val: "M" | "F") => void;
  telefono: string;
  onChangeTelefono: (val: string) => void;
  email: string;
  onChangeEmail: (val: string) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre Completo *</Label>
        <Input
          id="nombre"
          value={nombreCompleto}
          onChange={(e) => onChangeNombre(e.target.value)}
          placeholder="Ej: Lionel Andrés Messi"
          required
          spellCheck={false}
          className="uppercase bg-white p-6 rounded-full"
        />
      </div>

      <div className="flex gap-2">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select
            value={tipoDocumento}
            onValueChange={(val) => onChangeTipoDocumento(val ?? "CC")}
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
            onChange={(e) => onChangeNumeroDocumento(e.target.value)}

            inputMode="numeric"
            required
            className="uppercase bg-white p-6 rounded-full pr-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Género *</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => onChangeGenero("M")}
            className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${genero === "M"
              ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
              : "border-gray-200 bg-white"
              }`}
          >
            Masculino
          </Button>
          <Button
            type="button"
            onClick={() => onChangeGenero("F")}
            className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${genero === "F"
              ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
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
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={telefono}
          onChange={(e) => onChangeTelefono(e.target.value)}

          required
          className="uppercase bg-white p-6 rounded-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico *</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}

          required
          className="uppercase bg-white p-6 rounded-full pr-10"
        />
      </div>
    </>
  );
}

// Subcomponente: Sección Asegurado Mismo/Diferente
function DatosAseguradoSection({
  esMismoAsegurado,
  onChangeEsMismoAsegurado,
  aseguradoNombre,
  onChangeAseguradoNombre,
  aseguradoEmail,
  onChangeAseguradoEmail,
}: {
  esMismoAsegurado: boolean;
  onChangeEsMismoAsegurado: (val: boolean) => void;
  aseguradoNombre: string;
  onChangeAseguradoNombre: (val: string) => void;
  aseguradoEmail: string;
  onChangeAseguradoEmail: (val: string) => void;
}) {
  return (
    <div className="space-y-3 border-t border-b border-gray-100 py-4">
      <Label className="text-sm font-semibold">
        ¿El asegurado es la misma persona que diligencia los datos? *
      </Label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={() => onChangeEsMismoAsegurado(true)}
          className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${esMismoAsegurado
            ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
            : "border-gray-200 bg-white"
            }`}
        >
          Sí
        </Button>
        <Button
          type="button"
          onClick={() => onChangeEsMismoAsegurado(false)}
          className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${!esMismoAsegurado
            ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
            : "border-gray-200 bg-white"
            }`}
        >
          No (Es otra persona)
        </Button>
      </div>

      {!esMismoAsegurado && (
        <div className="space-y-4 mt-2 bg-gray-50 py-6 px-4 rounded-2xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800">Datos de quien diligencia los datos</h3>
          <div className="space-y-4">
            <Label htmlFor="aseguradoNombre">Nombre completo *</Label>
            <Input
              id="aseguradoNombre"
              value={aseguradoNombre}
              onChange={(e) => onChangeAseguradoNombre(e.target.value)}

              required={!esMismoAsegurado}
              spellCheck={false}
              className="uppercase bg-white p-6 rounded-full text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aseguradoEmail">Email *</Label>
            <Input
              id="aseguradoEmail"
              type="email"
              inputMode="email"
              spellCheck={false}
              value={aseguradoEmail}
              onChange={(e) => onChangeAseguradoEmail(e.target.value)}

              required={!esMismoAsegurado}
              className="uppercase bg-white p-6 rounded-full text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente: Input y Búsqueda de Ciudad de Circulación
function CiudadCirculacionInput({
  ciudadSeleccionada,
  queryCiudad,
  listaCiudades,
  onSearchCiudad,
  onSelectCiudad,
  onResetCiudad,
}: {
  ciudadSeleccionada: MunicipioDIVIPOLA | null;
  queryCiudad: string;
  listaCiudades: MunicipioDIVIPOLA[];
  onSearchCiudad: (text: string) => void;
  onSelectCiudad: (c: MunicipioDIVIPOLA) => void;
  onResetCiudad: () => void;
}) {
  const tieneValor = Boolean(ciudadSeleccionada || queryCiudad);

  const handleClear = () => {
    onResetCiudad();
    onSearchCiudad("");
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="search_query_circulacion">Ciudad de Circulación *</Label>
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
          placeholder="ej: Cali, Bogotá"
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          required
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

      {!ciudadSeleccionada && listaCiudades.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto mt-1">
          {listaCiudades.map((c) => (
            <button
              key={c.city_code}
              type="button"
              onClick={() => onSelectCiudad(c)}
              className="w-full text-left px-4 py-2.5 hover:bg-yellow-50 text-sm border-b last:border-0 border-gray-100 cursor-pointer"
            >
              <span className="font-semibold text-gray-900">{c.city_name}</span>
              <span className="text-gray-500 text-xs block">{c.state_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Subcomponente: Condiciones de la Póliza (Vencimiento y Endoso)
function CondicionesPolizaSection({
  vencimientoPoliza,
  onChangeVencimiento,
  endosoBanco,
  onChangeEndoso,
}: {
  vencimientoPoliza: string;
  onChangeVencimiento: (val: string) => void;
  endosoBanco: string;
  onChangeEndoso: (val: string) => void;
}) {
  const OPCIONES_VENCIMIENTO = [
    "Ya mismo",
    "En 1 semana",
    "15-30 días",
    "Más de 30 días",
    "No tengo póliza actualmente",
  ];

  const OPCIONES_ENDOSO = [
    { id: "endoso", label: "Sí, tiene endoso a favor de un banco" },
    { id: "sin_endoso", label: "No tiene endoso" },
  ];

  return (
    <>
      <div className="pt-2 space-y-3 border-t border-gray-100">
        <Label className="text-sm font-semibold">
          ¿Cuándo vence tu póliza actual?
        </Label>
        <div className="space-y-1.5 md:grid md:grid-cols-2 md:gap-2">
          {OPCIONES_VENCIMIENTO.map((op) => (
            <Button
              key={op}
              type="button"
              onClick={() => onChangeVencimiento(op)}
              className={`w-full text-left p-6 rounded-full border text-sm font-medium transition-all shadow-xs border-input cursor-pointer ${vencimientoPoliza === op
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
          {OPCIONES_ENDOSO.map((op) => (
            <Button
              key={op.id}
              type="button"
              onClick={() => onChangeEndoso(op.label)}
              className={`w-full text-left p-6 rounded-full text-sm font-medium transition-all shadow-xs border border-input cursor-pointer ${endosoBanco === op.label
                ? "border-yellow-400 bg-yellow-50 text-black font-semibold"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
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
