'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { buscarCiudadesAction, consultarVehiculoAction, MunicipioDIVIPOLA } from '@/app/actions';
import { iniciarCotizacion0KmAction } from '@/app/actions/cotizaciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { USOS_VEHICULO_PESADO } from '@/lib/constantes';
import { DocumentType } from '@/lib/types/sunrise';
import {
    DatosTomadorFields,
    DatosAseguradoFields,
    CiudadCirculacionInput,
    CondicionesPolizaFields,
} from './shared/formFields';

interface Step1CotizaProps {
    onSuccess: (data: any) => void;
    onSuccess0Km?: (data: any) => void;
    initialTipo?: 'carro' | 'moto' | 'pesado';
}

export default function Step1Cotiza({
    onSuccess,
    onSuccess0Km,
    initialTipo = 'carro',
}: Step1CotizaProps) {
    const [esCeroKm, setEsCeroKm] = useState(false);
    const [tipoVehiculo, setTipoVehiculo] = useState<'carro' | 'moto' | 'pesado'>(initialTipo);
    const [usoPesado, setUsoPesado] = useState<string>('carga_transporte_mercancia_propia');

    // Estados para flujo 0 km
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState<DocumentType>('CC');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState<'M' | 'F'>('M');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [esMismoAsegurado, setEsMismoAsegurado] = useState(true);
    const [aseguradoNombre, setAseguradoNombre] = useState('');
    const [aseguradoEmail, setAseguradoEmail] = useState('');

    // Búsqueda de ciudad DIVIPOLA (para 0 km)
    const [queryCiudad, setQueryCiudad] = useState('');
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState<MunicipioDIVIPOLA | null>(null);
    const [listaCiudades, setListaCiudades] = useState<MunicipioDIVIPOLA[]>([]);
    const [, startTransitionCiudad] = useTransition();

    // Factura y validación (PDF, JPG, PNG, WEBP, máx 8 MB)
    const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
    const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ];
    const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
    const [errorFactura, setErrorFactura] = useState<string | null>(null);

    // Habeas Data
    const [aceptaHabeasData, setAceptaHabeasData] = useState(false);
    const [errorHabeasData, setErrorHabeasData] = useState(false);

    // useActionState para flujo con placa tradicional
    const [statePlaca, formActionPlaca, isPendingPlaca] = useActionState(
        async (prevState: any, formData: FormData) => {
            const res = await consultarVehiculoAction(prevState, formData);
            if (res.success && res.data) {
                onSuccess(res.data);
            }
            return res;
        },
        null
    );

    // useActionState para flujo 0 km con factura
    const [state0Km, formAction0Km, isPending0Km] = useActionState(
        async (prevState: any, formData: FormData) => {
            const res = await iniciarCotizacion0KmAction(prevState, formData);
            if (res.success) {
                if (onSuccess0Km) {
                    onSuccess0Km({
                        ticketId: res.ticketId,
                        status: res.status,
                        quoted: res.quoted,
                        message: res.message,
                        personales: res.personales,
                        vehiculo: {
                            tipoVehiculo,
                            esCeroKm: true,
                            brand: 'Vehículo 0 km',
                            line: '',
                            modelo: new Date().getFullYear(),
                        },
                    });
                } else {
                    onSuccess({
                        ticketId: res.ticketId,
                        status: res.status,
                        quoted: res.quoted,
                        personales: res.personales,
                        vehiculo: {
                            tipoVehiculo,
                            esCeroKm: true,
                        },
                    });
                }
            }
            return res;
        },
        null
    );

    const handleSearchCiudad = (text: string) => {
        setQueryCiudad(text);
        const cleanText = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
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

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setErrorFactura(null);
            return;
        }

        const fileName = file.name || '';
        const extension = '.' + fileName.split('.').pop()?.toLowerCase();
        const mimeType = file.type?.toLowerCase();

        const isMimeValid = mimeType ? ALLOWED_MIME_TYPES.includes(mimeType) : false;
        const isExtValid = ALLOWED_EXTENSIONS.includes(extension);

        if (!isMimeValid && !isExtValid) {
            setErrorFactura('Formato no permitido. Solo se aceptan archivos PDF, JPG, PNG o WEBP.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setErrorFactura('El archivo supera el tamaño máximo permitido de 8 MB.');
            e.target.value = '';
            return;
        }

        setErrorFactura(null);
    };

    const handleFormSubmitCheck = (e: React.FormEvent<HTMLFormElement>) => {
        if (!aceptaHabeasData) {
            e.preventDefault();
            setErrorHabeasData(true);
            return;
        }
        setErrorHabeasData(false);

        if (esCeroKm && errorFactura) {
            e.preventDefault();
            return;
        }
    };

    const isPending = esCeroKm ? isPending0Km : isPendingPlaca;
    const currentError = esCeroKm ? state0Km?.error : statePlaca?.error;

    return (
        <div className='w-full max-w-137.5'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-2'>Cotiza tu seguro todo riesgo</h1>
            <p className='text-center my-2 text-gray-600'>¿Qué tipo de vehículo quieres asegurar?</p>

            <form
                action={esCeroKm ? formAction0Km : formActionPlaca}
                onSubmit={handleFormSubmitCheck}
                className="w-full space-y-8 mt-8"
            >
                <input type="hidden" name="tipoVehiculo" value={tipoVehiculo} />
                <input type="hidden" name="esCeroKm" value={esCeroKm.toString()} />
                <input type="hidden" name="useType" value={tipoVehiculo === 'pesado' ? usoPesado : 'particular'} />

                {/* Selector de Tipo de Vehículo */}
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
                        onClick={() => setTipoVehiculo('carro')}
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
                        onClick={() => setTipoVehiculo('moto')}
                    />
                    <SelectorVehiculo
                        id="pesado"
                        label="Pesado"
                        icon={<Image
                            src="/images/carro.svg"
                            alt="Icono de vehículo pesado"
                            width={60}
                            height={60}
                        />}
                        isActive={tipoVehiculo === 'pesado'}
                        onClick={() => setTipoVehiculo('pesado')}
                    />
                </div>

                {/* Selector de Uso de Vehículo (SOLO PARA PESADOS) */}
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

                {/* Checkbox 0 km */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="ceroKm"
                        checked={esCeroKm}
                        onCheckedChange={(checked) => setEsCeroKm(Boolean(checked))}
                        className="rounded-full bg-white"
                    />
                    <Label htmlFor="ceroKm" className="cursor-pointer text-sm font-medium text-gray-700">
                        Mi vehículo es 0 kilómetros.
                    </Label>
                </div>

                {!esCeroKm ? (
                    /* FLUJO TRADICIONAL POR PLACA */
                    <div className="space-y-2">
                        <Label htmlFor="placa">Placa</Label>
                        <Input
                            id="placa"
                            name="placa"
                            placeholder="ABC123"
                            maxLength={6}
                            required={!esCeroKm}
                            autoComplete="off"
                            className="uppercase bg-white p-6 rounded-full font-bold tracking-wider"
                        />
                    </div>
                ) : (
                    /* NUEVO FLUJO 0 KM: DATOS PERSONALES + CARGA DE FACTURA DIRECTA */
                    <div className="space-y-6 pt-2">
                        <div className="text-center pb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Datos del Conductor y Factura
                            </h2>
                            <p className="text-xs text-gray-500">
                                Radicaremos tu cotización 0 km directamente con un asesor de Segurautos.
                            </p>
                        </div>

                        {/* Adjunto de Factura */}
                        <div className={`space-y-3 p-5 bg-white rounded-2xl border transition-colors ${errorFactura ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'}`}>
                            <Label htmlFor="invoice" className="font-semibold text-gray-900 text-sm">
                                Adjunta la foto o PDF de la factura del vehículo *
                            </Label>
                            <Input
                                id="invoice"
                                name="invoice"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                                onChange={handleInvoiceChange}
                                required={esCeroKm}
                                className="px-0 border-0 shadow-none file:mr-4 file:rounded-full file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-600 hover:file:bg-yellow-100 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500">
                                Formatos permitidos: PDF, JPG, PNG, WEBP (máx. 8 MB).
                            </p>
                            {errorFactura && (
                                <p className="text-xs text-red-500 font-medium">
                                    {errorFactura}
                                </p>
                            )}
                        </div>

                        {/* Datos del Tomador */}
                        <DatosTomadorFields
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

                        {/* Datos del Asegurado */}
                        <DatosAseguradoFields
                            esMismoAsegurado={esMismoAsegurado}
                            onChangeEsMismoAsegurado={setEsMismoAsegurado}
                            aseguradoNombre={aseguradoNombre}
                            onChangeAseguradoNombre={setAseguradoNombre}
                            aseguradoEmail={aseguradoEmail}
                            onChangeAseguradoEmail={setAseguradoEmail}
                        />

                        {/* Ciudad de Circulación */}
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
                            <Label htmlFor="fechaNacimiento0km">Fecha de Nacimiento *</Label>
                            <Input
                                id="fechaNacimiento0km"
                                name="fechaNacimiento"
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                required={esCeroKm}
                                className="uppercase bg-white p-6 rounded-full"
                            />
                        </div>


                    </div>
                )}

                {/* Aceptación de Habeas Data */}
                <div className="space-y-1 pt-2">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="habeasData"
                            name="consent"
                            checked={aceptaHabeasData}
                            onCheckedChange={(checked) => {
                                setAceptaHabeasData(Boolean(checked));
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

                {currentError && (
                    <p className="text-sm text-red-500 font-medium text-center">{currentError}</p>
                )}

                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full hover:bg-yellow-500 text-black rounded-full p-6 cursor-pointer font-semibold text-base"
                >
                    {isPending
                        ? (esCeroKm ? 'Radicando cotización con factura…' : 'Consultando vehículo…')
                        : (esCeroKm ? 'Radicar cotización con factura' : 'Ver ofertas disponibles')}
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