'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import Image from 'next/image'
import CarIcon from "./images/carro.svg"
import BikeIcon from "./images/moto.svg"
import { consultarVehiculoAction, obtenerMarcasAction, obtenerReferenciasAction, obtenerVersionesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Bike, Truck, ChevronLeft } from 'lucide-react';
import { div } from 'motion/react-client';
import { USOS_VEHICULO_PESADO } from '@/lib/constantes';

interface Step1CotizaProps {
    onSuccess: (data: any) => void;
    initialTipo?: 'carro' | 'moto' | 'pesado';
}

export default function Step1Cotiza({ onSuccess, initialTipo = 'carro' }: Step1CotizaProps) {
    const [esCeroKm, setEsCeroKm] = useState(false);
    const [tipoVehiculo, setTipoVehiculo] = useState<'carro' | 'moto' | 'pesado'>(initialTipo);
    const [usoPesado, setUsoPesado] = useState<string>('carga_transporte_mercancia_propia');

    const [marcas, setMarcas] = useState<string[]>([]);
    const [referencias, setReferencias] = useState<string[]>([]);
    const [versiones, setVersiones] = useState<any[]>([]);

    const [marcaSel, setMarcaSel] = useState('');
    const [modeloSel, setModeloSel] = useState('2026');
    const [refSel, setRefSel] = useState('');
    const [versionSel, setVersionSel] = useState('');
    const [precioFactura, setPrecioFactura] = useState('');

    const [aceptaHabeasData, setAceptaHabeasData] = useState(false);
    const [errorHabeasData, setErrorHabeasData] = useState(false);
    const [noEncuentraVehiculo, setNoEncuentraVehiculo] = useState(false);
    const [archivoFactura, setArchivoFactura] = useState<File | null>(null);
    const [facturaEnviada, setFacturaEnviada] = useState(false);

    const [isPendingCatalog, startTransition] = useTransition();


    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await consultarVehiculoAction(prevState, formData);
        if (res.success) {
            onSuccess(res.data);
        }
        return res;
    }, null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!aceptaHabeasData) {
            e.preventDefault();
            setErrorHabeasData(true);
            return;
        }
        setErrorHabeasData(false);

        if (esCeroKm) {
            e.preventDefault();

            if (noEncuentraVehiculo) {
                if (!archivoFactura) {
                    alert("Por favor selecciona una foto o PDF de la factura.");
                    return;
                }
                setFacturaEnviada(true);
                alert("Factura enviada con éxito. Un agente de Segurautos te contactará a la brevedad.");
                return;
            }

            const versionObjeto = versiones.find((v) => v.code === versionSel);

            const datosVehiculoCeroKm = {
                placa: '',
                tipoVehiculo,
                esCeroKm: true,
                fasecoldaCode: versionSel,
                modelo: modeloSel,
                brand: marcaSel,
                line: versionObjeto?.lineaCompleta || refSel,
                commercialPrice: Number(precioFactura) || 0,
                referencePrice: versionObjeto?.precioReferencia || Number(precioFactura) || 0,
            };


            onSuccess(datosVehiculoCeroKm);
        }

    };

    const handleTipoVehiculoChange = (tipo: 'carro' | 'moto' | 'pesado') => {
        setTipoVehiculo(tipo);

        if (esCeroKm) {
            setMarcaSel('');
            setRefSel('');
            setVersionSel('');
        }
    };


    const handleToggleCeroKm = (checked: boolean) => {
        setEsCeroKm(checked);
        if (!checked) {
            setNoEncuentraVehiculo(false);
            setArchivoFactura(null);
            setFacturaEnviada(false);
        }

        if (checked && marcas.length === 0) {
            startTransition(async () => {
                const res = await obtenerMarcasAction();
                if (res.success && res.marcas) setMarcas(res.marcas);
            });
        }
    };


    const handleMarcaChange = (marca: string | null) => {
        if (!marca) return;
        setMarcaSel(marca);
        setRefSel('');
        setVersionSel('');
        console.log("la marca", marca)
        startTransition(async () => {
            const res = await obtenerReferenciasAction(marca, parseInt(modeloSel));
            if (res.success && res.referencias) setReferencias(res.referencias);
        });
    };


    const handleRefChange = (ref: string | null) => {
        if (!ref) return;
        setRefSel(ref);
        setVersionSel('');
        startTransition(async () => {
            const res = await obtenerVersionesAction(marcaSel, parseInt(modeloSel), ref);
            if (res.success && res.versiones) setVersiones(res.versiones);
        });
    };

    return (
        <div className='w-full max-w-137.5'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-2'>Cotiza tu seguro todo riego </h1>
            <p className='text-center my-2'>¿Qué tipo de vehículo quieres asegurar?</p>
            <form action={formAction} onSubmit={handleSubmit} className="w-full space-y-9 mt-9">
                <input type="hidden" name="tipoVehiculo" value={tipoVehiculo} />
                <input type="hidden" name="esCeroKm" value={esCeroKm.toString()} />


                <div className="grid grid-cols-3 gap-3">
                    <SelectorVehiculo
                        id="carro"
                        label="Carro"
                        icon={<Image
                            src="/images/carro.svg"
                            alt="Icono de carro"
                            width={60}
                            height={60}
                        />}
                        isActive={tipoVehiculo === 'carro'}
                        onClick={() => handleTipoVehiculoChange('carro')}
                    />
                    <SelectorVehiculo
                        id="moto"
                        label="Moto"
                        icon={<Image
                            src="/images/moto.svg"
                            alt="Icono de moto"
                            width={60}
                            height={60}
                        />}
                        isActive={tipoVehiculo === 'moto'}
                        onClick={() => handleTipoVehiculoChange('moto')}
                    />
                    <SelectorVehiculo
                        id="pesado"
                        label="Pesado"
                        icon={<Image
                            src="/images/carro.svg"
                            alt="Icono de carro"
                            width={60}
                            height={60}
                        />}
                        isActive={tipoVehiculo === 'pesado'}
                        onClick={() => setTipoVehiculo('pesado')}
                    />
                </div>

                {/* Selector CONDICIONAL de Uso de Vehículo (SOLO PARA PESADOS) */}
                {tipoVehiculo === 'pesado' && (
                    <div className="space-y-1.5 pt-1">
                        <Label className="text-sm font-medium text-gray-700">Tipo de Uso (Carga / Utilitario)</Label>
                        <Select value={usoPesado} onValueChange={(val) => setUsoPesado(val ?? 'carga_transporte_mercancia_propia')}>
                            <SelectTrigger className="bg-white p-6 rounded-full w-full border-gray-200">
                                <SelectValue placeholder="Selecciona el tipo de uso" />
                            </SelectTrigger>
                            <SelectContent side="bottom" sideOffset={6} alignItemWithTrigger={false}>
                                {USOS_VEHICULO_PESADO.map((u) => (
                                    <SelectItem key={u.value} value={u.value}>
                                        {u.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Checkbox 0km */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="ceroKm" checked={esCeroKm} onCheckedChange={handleToggleCeroKm} className="rounded-full bg-white" />
                    <Label htmlFor="ceroKm">Mi vehículo es 0 kilómetros.</Label>
                </div>

                {!esCeroKm ? (
                    /* FLUTO TRADICIONAL POR PLACA */
                    <div className="space-y-2">
                        <Label htmlFor="placa">Placa</Label>
                        <Input id="placa" name="placa" placeholder="ABC123" maxLength={6} required className="uppercase bg-white p-6 rounded-full" />
                    </div>
                ) : (
                    /* FLUJO CASCADA PARA 0 KM */
                    <div className="space-y-6">
                        <button
                            type="button"
                            onClick={() => {
                                setNoEncuentraVehiculo(!noEncuentraVehiculo);
                                setFacturaEnviada(false);
                            }}
                            className="flex gap-1 items-center text-xs text-yellow-600 hover:text-yellow-700 underline font-medium cursor-pointer"
                        >
                            {noEncuentraVehiculo
                                ? <><ChevronLeft /> Volver al buscador de vehículos</>
                                : "¿No encuentras tu vehículo? Haz clic aquí para adjuntar tu factura"}
                        </button>


                        {noEncuentraVehiculo ? (
                            <div className="space-y-4 p-4 bg-white rounded-2xl border border-gray-200">
                                <Label htmlFor="facturaFile">
                                    Adjunta la foto o PDF de la factura del vehículo *
                                </Label>
                                <Input
                                    id="facturaFile"
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setArchivoFactura(e.target.files?.[0] || null)}
                                    className="px-0 border-0 shadow-[0] file:mr-4 file:rounded-full file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-600 hover:file:bg-yellow-100"
                                />
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Un agente de Segurautos revisará tu factura y te contactará manualmente para procesar tu cotización.
                                </p>
                                {facturaEnviada && (
                                    <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-xs rounded-xl font-medium text-center">
                                        ✓ Factura enviada con éxito. Un agente de Segurautos te contactará a la brevedad.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <input type="hidden" name="fasecoldaCode" value={versionSel} />

                                <div className="space-y-2">
                                    <Label>Año Modelo</Label>
                                    <Select value={modeloSel} onValueChange={(val) => setModeloSel(val ?? '')} name="modelo" >
                                        <SelectTrigger className="bg-white p-6 rounded-full w-full"><SelectValue placeholder="Modelo" /></SelectTrigger>
                                        <SelectContent alignItemWithTrigger={false}>
                                            <SelectItem value="2026">2026</SelectItem>
                                            <SelectItem value="2025">2025</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Marca</Label>
                                    <Select value={marcaSel} onValueChange={handleMarcaChange} disabled={isPendingCatalog} >
                                        <SelectTrigger className="bg-white p-6 rounded-full w-full"><SelectValue placeholder="Selecciona Marca" /></SelectTrigger>
                                        <SelectContent alignItemWithTrigger={false} >
                                            {marcas.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {marcaSel && (
                                    <div className='space-y-2'>
                                        <Label>Línea / Referencia</Label>
                                        <Select value={refSel} onValueChange={handleRefChange} disabled={isPendingCatalog}>
                                            <SelectTrigger className="bg-white p-6 rounded-full w-full"><SelectValue placeholder="Selecciona Línea" /></SelectTrigger>
                                            <SelectContent alignItemWithTrigger={false} >
                                                {referencias.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {refSel && (
                                    <div className='space-y-2'>
                                        <Label>Versión Exacta</Label>
                                        <Select value={versionSel} onValueChange={(val) => setVersionSel(val ?? '')} disabled={isPendingCatalog}>
                                            <SelectTrigger className="bg-white p-6 rounded-full w-full"><SelectValue placeholder="Selecciona Versión" /></SelectTrigger>
                                            <SelectContent alignItemWithTrigger={false} >
                                                {versiones.map((v) => (
                                                    <SelectItem key={v.code} value={v.code}>
                                                        {v.lineaCompleta}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {versionSel && (
                                    <div className="space-y-2">
                                        <Label htmlFor="commercialPrice">Valor del vehículo en factura ($)</Label>
                                        <Input id="commercialPrice"
                                            name="commercialPrice"
                                            type="number"
                                            value={precioFactura}
                                            onChange={(e) => setPrecioFactura(e.target.value)}
                                            placeholder="Ej: 85000000"
                                            required
                                            className="uppercase bg-white p-6 rounded-full" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Aceptación de Habeas Data */}
                <div className="space-y-1 pt-2">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="habeasData"
                            checked={aceptaHabeasData}
                            onCheckedChange={(checked) => {
                                setAceptaHabeasData(!!checked);
                                if (checked) setErrorHabeasData(false);
                            }}
                            className="mt-0.5 rounded-md bg-white border-gray-300"
                        />
                        <Label htmlFor="habeasData" className="inline-block text-xs text-gray-600 leading-tight cursor-pointer">
                            Acepto la <a href="/politicas" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black">política de tratamiento de datos personales</a> y los términos y condiciones. *
                        </Label>
                    </div>
                    {errorHabeasData && (
                        <p className="text-xs text-red-500 font-medium pl-6">
                            Debes aceptar la política de tratamiento de datos para continuar.
                        </p>
                    )}
                </div>

                {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

                <Button type="submit" disabled={isPending} className="w-full  hover:bg-yellow-500 text-black rounded-full p-6">
                    {isPending ? 'Procesando...' : (esCeroKm && noEncuentraVehiculo ? 'Enviar factura' : 'Ver ofertas disponibles')}
                </Button>
            </form>
        </div>

    );
}

function SelectorVehiculo({ id, label, icon, isActive, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-150 active:scale-[0.96] cursor-pointer ${isActive
                ? 'bg-[#222222] border-[#222222] text-white shadow-md'
                : 'bg-white border-gray-200 text-black hover:border-gray-300 hover:shadow-xs'
                }`}
        >
            <div className="mb-2 transition-transform duration-150 group-active:scale-95">{icon}</div>
            <span className="font-semibold text-sm">{label}</span>
            {isActive && (
                <div className="absolute top-2 right-2 bg-[#FFCC00] text-black rounded-full p-0.5 animate-in fade-in zoom-in-75 duration-150">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
        </button>
    );
}