'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import { consultarVehiculoAction, obtenerMarcasAction, obtenerReferenciasAction, obtenerVersionesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Bike, Truck } from 'lucide-react';
import { div } from 'motion/react-client';
import { USOS_VEHICULO_PESADO } from '@/lib/constantes';

export default function Step1Cotiza({ onSuccess }: { onSuccess: (data: any) => void }) {
    const [esCeroKm, setEsCeroKm] = useState(false);
    const [tipoVehiculo, setTipoVehiculo] = useState<'carro' | 'moto' | 'pesado'>('carro');
    const [usoPesado, setUsoPesado] = useState<string>('carga_transporte_mercancia_propia');

    // Estado para la cascada 0 km
    const [marcas, setMarcas] = useState<string[]>([]);
    const [referencias, setReferencias] = useState<string[]>([]);
    const [versiones, setVersiones] = useState<any[]>([]);

    const [marcaSel, setMarcaSel] = useState('');
    const [modeloSel, setModeloSel] = useState('2026');
    const [refSel, setRefSel] = useState('');
    const [versionSel, setVersionSel] = useState('');
    const [precioFactura, setPrecioFactura] = useState('');

    const [isPendingCatalog, startTransition] = useTransition();

    // Acción principal del formulario
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await consultarVehiculoAction(prevState, formData);
        if (res.success) {
            onSuccess(res.data);
        }
        return res;
    }, null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (esCeroKm) {
            e.preventDefault(); // Detenemos el envío a la Server Action de Placa

            // Buscamos los datos completos de la versión elegida
            const versionObjeto = versiones.find((v) => v.code === versionSel);

            const datosVehiculoCeroKm = {
                placa: '', // Cadena vacía requerida por la API para 0km
                tipoVehiculo,
                esCeroKm: true,
                fasecoldaCode: versionSel,
                modelo: modeloSel,
                brand: marcaSel,
                line: versionObjeto?.lineaCompleta || refSel,
                commercialPrice: Number(precioFactura) || 0,
                referencePrice: versionObjeto?.precioReferencia || Number(precioFactura) || 0,
            };

            // Avanzamos directamente al Paso 2 sin llamar a la API
            onSuccess(datosVehiculoCeroKm);
        }
        // Si no es 0km (tiene placa), dejamos que el evento continúe hacia formAction normalmente
    };

    const handleTipoVehiculoChange = (tipo: 'carro' | 'moto' | 'pesado') => {
        setTipoVehiculo(tipo);
        // Reseteamos selecciones de catálogo 0km al cambiar tipo
        if (esCeroKm) {
            setMarcaSel('');
            setRefSel('');
            setVersionSel('');
        }
    };

    // Cambio de modo 0km: Carga marcas sin useEffect
    const handleToggleCeroKm = (checked: boolean) => {
        setEsCeroKm(checked);
        //quitar

        if (checked && marcas.length === 0) {
            startTransition(async () => {
                const res = await obtenerMarcasAction();
                if (res.success && res.marcas) setMarcas(res.marcas);
            });
        }
    };

    // Al seleccionar Marca
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

    // Al seleccionar Referencia/Línea
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

                {/* Selector de Tipo de Vehículo */}
                <div className="grid grid-cols-3 gap-3">
                    <SelectorVehiculo
                        id="carro"
                        label="Carro"
                        icon={<Car size={24} />}
                        isActive={tipoVehiculo === 'carro'}
                        onClick={() => handleTipoVehiculoChange('carro')}
                    />
                    <SelectorVehiculo
                        id="moto"
                        label="Moto"
                        icon={<Bike size={24} />}
                        isActive={tipoVehiculo === 'moto'}
                        onClick={() => handleTipoVehiculoChange('moto')}
                    />
                    <SelectorVehiculo
                        id="pesado"
                        label="Pesado"
                        icon={<Truck size={24} />}
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
                    </div>
                )}

                {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

                <Button type="submit" disabled={isPending} className="w-full  hover:bg-yellow-500 text-black rounded-full p-6">
                    {isPending ? 'Procesando...' : 'Ver ofertas disponibles'}
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
            className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all duration-200 ${isActive
                ? 'bg-[#222222] border-[#222222] text-white shadow-md'
                : 'bg-white border-gray-200 text-black hover:border-gray-300'
                }`}
        >
            <div className="mb-2">{icon}</div>
            <span className="font-semibold text-sm">{label}</span>
            {isActive && (
                <div className="absolute top-2 right-2 bg-[#FFCC00] text-black rounded-full p-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
        </button>
    );
}