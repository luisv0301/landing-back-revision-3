"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarCiudadesAction, MunicipioDIVIPOLA } from "@/app/actions";
import { iniciarCotizacionAction } from "@/app/actions/cotizaciones";
import { DocumentType, PolicyExpiresCode } from "@/lib/types/sunrise";
import {
  DatosTomadorFields,
  CiudadCirculacionInput,
  CondicionesPolizaFields,
  VALIDACIONES,
  FieldError,
} from "./shared/formFields";

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  firstname: string;
  lastname: string;
  tipoDocumento: DocumentType;
  numeroDocumento: string;
  telefono: string;
  email: string;
  genero: "M" | "F";
  fechaNacimiento: string;
  cityCode: string;
  cityName: string;
  policyExpires: PolicyExpiresCode;
  hasCurrentPolicy: boolean;
  bankEndorsement: boolean;
}

interface Step3Props {
  onNext: (datos: {
    personales: DatosPersonales;
    ticketId?: number | string;
    status?: string;
    quoted?: boolean;
    message?: string;
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

  const matchExacto = ciudades.find((c) => {
    const cityNorm = normalizar(c.city_name);
    return cityNorm === primerNombreNorm || cityNorm === textoNorm;
  });
  if (matchExacto) return matchExacto;

  const matchCombinado = ciudades.find((c) => {
    const comb = normalizar(`${c.city_name} ${c.state_name}`);
    return comb === textoNorm || textoNorm.includes(comb);
  });
  if (matchCombinado) return matchCombinado;

  if (primerNombreNorm.length >= 4) {
    const matchPrefijo = ciudades.find((c) =>
      normalizar(c.city_name).startsWith(primerNombreNorm),
    );
    if (matchPrefijo) return matchPrefijo;
  }

  const matchContenido = ciudades.find((c) => {
    const cityNorm = normalizar(c.city_name);
    return cityNorm.length >= 4 && textoNorm.includes(cityNorm);
  });
  if (matchContenido) return matchContenido;

  return ciudades[0] || null;
}

export default function Step3DatosPersonales({
  onNext,
  vehiculoData,
  initialData,
}: Step3Props) {
  // Estados del Tomador / Conductor
  const [nombre, setNombre] = useState(() => {
    if (initialData?.nombre) return initialData.nombre;
    if (initialData?.firstname) return initialData.firstname;
    if (initialData?.nombreCompleto) {
      return initialData.nombreCompleto.trim().split(" ")[0] || "";
    }
    return "";
  });
  const [apellido, setApellido] = useState(() => {
    if (initialData?.apellido) return initialData.apellido;
    if (initialData?.lastname) return initialData.lastname;
    if (initialData?.nombreCompleto) {
      const parts = initialData.nombreCompleto.trim().split(" ");
      return parts.slice(1).join(" ") || "";
    }
    return "";
  });
  const [tipoDocumento, setTipoDocumento] = useState<DocumentType>(
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

  // Errores de validación de campos
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  // Condiciones de la póliza
  const [policyExpires, setPolicyExpires] = useState<PolicyExpiresCode>(
    initialData?.policyExpires || "now",
  );
  const [bankEndorsement, setBankEndorsement] = useState<boolean>(
    initialData?.bankEndorsement ?? false,
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

  const handleSearchCiudad = (text: string) => {
    setQueryCiudad(text);
    const cleanText = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[,(]/)[0]
      .trim();

    if (cleanText.length >= 2) {
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

    const formElement = e.currentTarget;
    const inputCiudadEl = formElement.querySelector<HTMLInputElement>(
      "#search_query_circulacion",
    );
    const rawInputCity = (inputCiudadEl?.value || queryCiudad || "").trim();

    // 1. Validar todos los campos del formulario
    const errores: Record<string, string | null> = {
      nombre: VALIDACIONES.nombre(nombre),
      apellido: VALIDACIONES.apellido(apellido),
      numeroDocumento: VALIDACIONES.documento(numeroDocumento, tipoDocumento),
      telefono: VALIDACIONES.telefono(telefono),
      email: VALIDACIONES.email(email),
      ciudad: VALIDACIONES.ciudad(ciudadSeleccionada, rawInputCity),
      fechaNacimiento: !fechaNacimiento ? "Ingresa tu fecha de nacimiento." : null,
    };

    setFieldErrors(errores);

    const primerErrorCampo = Object.keys(errores).find((k) => Boolean(errores[k]));
    if (primerErrorCampo) {
      const mapaSelectores: Record<string, string> = {
        nombre: "#nombre",
        apellido: "#apellido",
        numeroDocumento: "#documento",
        telefono: "#telefono",
        email: "#email",
        ciudad: "#search_query_circulacion",
        fechaNacimiento: "#nacimiento",
      };

      const selector = mapaSelectores[primerErrorCampo];
      if (selector) {
        formElement.querySelector<HTMLElement>(selector)?.focus();
      }
      return;
    }

    startTransitionSubmit(async () => {
      let targetCiudad = ciudadSeleccionada;

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
        setFieldErrors((prev) => ({
          ...prev,
          ciudad: "Por favor selecciona tu ciudad de circulación de la lista.",
        }));
        formElement.querySelector<HTMLElement>("#search_query_circulacion")?.focus();
        return;
      }

      const firstname = nombre.trim();
      const lastname = apellido.trim();
      const nombreCompleto = `${firstname} ${lastname}`.trim();

      const hasCurrentPolicy = policyExpires !== "none";

      const payloadPersonales: DatosPersonales = {
        nombre: firstname,
        apellido: lastname,
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
        policyExpires,
        hasCurrentPolicy,
        bankEndorsement,
      };

      const cotizadorPayload = {
        vehiculo: vehiculoData,
        personales: payloadPersonales,
      };

      console.log("cotizadorPayload", cotizadorPayload);

      const res = await iniciarCotizacionAction(cotizadorPayload);

      if (res.success) {
        onNext({
          personales: payloadPersonales,
          ticketId: res.ticketId,
          status: res.status,
          quoted: res.quoted,
          message: res.message,
        });
      } else {
        setErrorLocal(res.error || "Ocurrió un error al procesar tu cotización.");
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
          Datos del conductor y riesgo
        </h1>
        <p className="text-gray-600 text-sm">
          Calcularemos tus opciones personalizadas con las mejores aseguradoras.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
        {/* Sección: Datos del Tomador */}
        <DatosTomadorFields
          nombre={nombre}
          onChangeNombre={setNombre}
          apellido={apellido}
          onChangeApellido={setApellido}
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
          errors={fieldErrors}
          onBlurField={(field, error) => {
            setFieldErrors((prev) => ({ ...prev, [field]: error }));
          }}
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
            setFieldErrors((prev) => ({ ...prev, ciudad: null }));
          }}
          onResetCiudad={() => {
            setCiudadSeleccionada(null);
            setFieldErrors((prev) => ({ ...prev, ciudad: null }));
          }}
          error={fieldErrors["ciudad"]}
        />

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="nacimiento">Fecha de Nacimiento *</Label>
          <Input
            id="nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => {
              setFechaNacimiento(e.target.value);
              if (fieldErrors["fechaNacimiento"]) {
                setFieldErrors((prev) => ({ ...prev, fechaNacimiento: null }));
              }
            }}
            onBlur={() => {
              if (!fechaNacimiento) {
                setFieldErrors((prev) => ({ ...prev, fechaNacimiento: "Ingresa tu fecha de nacimiento." }));
              } else {
                setFieldErrors((prev) => ({ ...prev, fechaNacimiento: null }));
              }
            }}
            aria-invalid={Boolean(fieldErrors["fechaNacimiento"])}
            aria-describedby={fieldErrors["fechaNacimiento"] ? "nacimiento-error" : undefined}
            required
            className="uppercase bg-white p-6 rounded-full"
          />
          <FieldError id="nacimiento" error={fieldErrors["fechaNacimiento"]} />
        </div>

        {/* Condiciones de la Póliza */}
        <CondicionesPolizaFields
          vencimientoPoliza={policyExpires}
          onChangeVencimiento={setPolicyExpires}
          endosoBanco={bankEndorsement}
          onChangeEndoso={setBankEndorsement}
        />

        {errorLocal && (
          <p className="text-sm text-red-500 font-medium text-center pt-2">{errorLocal}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full hover:bg-yellow-500 text-black rounded-full p-6 cursor-pointer font-semibold"
        >
          {isSubmitting ? "Generando cotizaciones…" : "Generar cotizaciones"}
        </Button>
      </form>
    </motion.div>
  );
}
