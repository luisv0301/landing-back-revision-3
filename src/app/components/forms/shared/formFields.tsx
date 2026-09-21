"use client";

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
import { DocumentType } from "@/lib/types/sunrise";
import { Search, X } from "lucide-react";

// Subcomponente: Formulario de Datos del Tomador
export function DatosTomadorFields({
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
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre Completo *</Label>
        <Input
          id="nombre"
          name="nombreCompleto"
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
            onValueChange={(val) =>
              onChangeTipoDocumento((val as DocumentType) ?? "CC")
            }
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
            inputMode="numeric"
            required
            className="uppercase bg-white p-6 rounded-full pr-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Género *</Label>
        <input type="hidden" name="genero" value={genero} />
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => onChangeGenero("M")}
            className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${
              genero === "M"
                ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
                : "border-gray-200 bg-white"
            }`}
          >
            Masculino
          </Button>
          <Button
            type="button"
            onClick={() => onChangeGenero("F")}
            className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${
              genero === "F"
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
          name="telefono"
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
          name="email"
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
export function DatosAseguradoFields({
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
      <input
        type="hidden"
        name="esMismoAsegurado"
        value={esMismoAsegurado.toString()}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={() => onChangeEsMismoAsegurado(true)}
          className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${
            esMismoAsegurado
              ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
              : "border-gray-200 bg-white"
          }`}
        >
          Sí
        </Button>
        <Button
          type="button"
          onClick={() => onChangeEsMismoAsegurado(false)}
          className={`p-6 rounded-full text-gray-700 font-medium text-sm transition-all shadow-xs border border-input cursor-pointer ${
            !esMismoAsegurado
              ? "border-yellow-400 bg-yellow-50 font-semibold text-black"
              : "border-gray-200 bg-white"
          }`}
        >
          No (Es otra persona)
        </Button>
      </div>

      {!esMismoAsegurado && (
        <div className="space-y-4 mt-2 bg-gray-50 py-6 px-4 rounded-2xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800">
            Datos de quien diligencia los datos
          </h3>
          <div className="space-y-4">
            <Label htmlFor="aseguradoNombre">Nombre completo *</Label>
            <Input
              id="aseguradoNombre"
              name="aseguradoNombre"
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
              name="aseguradoEmail"
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
export function CiudadCirculacionInput({
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
export function CondicionesPolizaFields({
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
        <input
          type="hidden"
          name="vencimientoPoliza"
          value={vencimientoPoliza}
        />
        <div className="space-y-1.5 md:grid md:grid-cols-2 md:gap-2">
          {OPCIONES_VENCIMIENTO.map((op) => (
            <Button
              key={op}
              type="button"
              onClick={() => onChangeVencimiento(op)}
              className={`w-full text-left p-6 rounded-full border text-sm font-medium transition-all shadow-xs border-input cursor-pointer ${
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
        <input type="hidden" name="endosoBanco" value={endosoBanco} />
        <div className="space-y-1.5">
          {OPCIONES_ENDOSO.map((op) => (
            <Button
              key={op.id}
              type="button"
              onClick={() => onChangeEndoso(op.label)}
              className={`w-full text-left p-6 rounded-full text-sm font-medium transition-all shadow-xs border border-input cursor-pointer ${
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
    </>
  );
}
