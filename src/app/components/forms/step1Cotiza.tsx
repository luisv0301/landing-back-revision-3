'use client';

import { useState, useTransition } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import {
    buscarCiudadesAction,
    consultarVehiculoAction,
    MunicipioDIVIPOLA,
    obtenerMarcasAction,
    obtenerReferenciasAction,
    obtenerVersionesAction,
} from '@/app/actions';
import { iniciarCotizacion0KmAction } from '@/app/actions/cotizaciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType, SunriseVehicleFeatureItem } from '@/lib/types/sunrise';
import {
    DatosTomadorFields,
    CiudadCirculacionInput,
    OfertaAwaitingAdvisorCard,
} from './shared/formFields';
import { HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';

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
    const [modo0Km, setModo0Km] = useState<'catalogo' | 'factura'>('catalogo');
    const [tipoVehiculo, setTipoVehiculo] = useState<'carro' | 'moto' | 'pesado'>(initialTipo);
    const [submittedTicketId, setSubmittedTicketId] = useState<number | string | null>(null);

    // Estados para Catálogo 0 km
    const anioActual = new Date().getFullYear();
    const aniosDisponibles = [anioActual + 1, anioActual, anioActual - 1];
    const [modelo0Km, setModelo0Km] = useState<string>(anioActual.toString());
    const [marca0Km, setMarca0Km] = useState<string>('');
    const [referencia0Km, setReferencia0Km] = useState<string>('');
    const [version0Km, setVersion0Km] = useState<SunriseVehicleFeatureItem | null>(null);
    const [precioComercial0Km, setPrecioComercial0Km] = useState<string>('');

    const [listaMarcas, setListaMarcas] = useState<string[]>([]);
    const [listaReferencias, setListaReferencias] = useState<string[]>([]);
    const [listaVersiones, setListaVersiones] = useState<SunriseVehicleFeatureItem[]>([]);

    const [cargandoMarcas, setCargandoMarcas] = useState(false);
    const [cargandoReferencias, setCargandoReferencias] = useState(false);
    const [cargandoVersiones, setCargandoVersiones] = useState(false);
    const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null);
    const [, startTransitionCatalogo] = useTransition();

    // Estados para flujo de Factura 0 km
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState<DocumentType>('CC');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState<'M' | 'F'>('M');
    const [fechaNacimiento, setFechaNacimiento] = useState('');

    // Búsqueda de ciudad DIVIPOLA (para 0 km factura)
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
            if (res.success && res.ticketId) {
                setSubmittedTicketId(res.ticketId);
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
                }
            }
            return res;
        },
        null
    );

    const handleToggle0Km = (checked: boolean) => {
        setEsCeroKm(checked);
        if (checked && listaMarcas.length === 0) {
            setCargandoMarcas(true);
            startTransitionCatalogo(async () => {
                const res = await obtenerMarcasAction();
                if (res.success && res.marcas) {
                    setListaMarcas(res.marcas);
                }
                setCargandoMarcas(false);
            });
        }
    };

    const handleSelectModelo = (val: string | null) => {
        const safeVal = val ?? '';
        setModelo0Km(safeVal);
        setReferencia0Km('');
        setVersion0Km(null);
        setListaVersiones([]);
        setErrorCatalogo(null);
        if (marca0Km && safeVal) {
            setCargandoReferencias(true);
            startTransitionCatalogo(async () => {
                const res = await obtenerReferenciasAction(marca0Km, safeVal);
                if (res.success && res.referencias) {
                    setListaReferencias(res.referencias);
                }
                setCargandoReferencias(false);
            });
        }
    };

    const handleSelectMarca = (val: string | null) => {
        const safeVal = val ?? '';
        setMarca0Km(safeVal);
        setReferencia0Km('');
        setVersion0Km(null);
        setListaReferencias([]);
        setListaVersiones([]);
        setErrorCatalogo(null);
        if (safeVal) {
            console.log("safeVal brand  ", safeVal);
            console.log("modelo0Km   ", modelo0Km);
            setCargandoReferencias(true);
            startTransitionCatalogo(async () => {
                const res = await obtenerReferenciasAction(safeVal, modelo0Km);
                console.log("referencias   ", res);
                if (res.success && res.referencias) {
                    setListaReferencias(res.referencias);
                }
                setCargandoReferencias(false);
            });
        }
    };

    const handleSelectReferencia = (val: string | null) => {
        const safeVal = val ?? '';
        setReferencia0Km(safeVal);
        setVersion0Km(null);
        setListaVersiones([]);
        setErrorCatalogo(null);
        if (safeVal) {
            setCargandoVersiones(true);
            startTransitionCatalogo(async () => {
                const res = await obtenerVersionesAction(marca0Km, modelo0Km, safeVal);
                if (res.success && res.versiones) {
                    setListaVersiones(res.versiones);
                    if (res.versiones.length === 1) {
                        setVersion0Km(res.versiones[0]);
                        setPrecioComercial0Km(res.versiones[0].commercial_value?.toString() || '0');
                    }
                }
                setCargandoVersiones(false);
            });
        }
    };

    const handleSelectVersion = (val: string | null) => {
        const fasecoldaCode = val ?? '';
        const selected = listaVersiones.find((v) => v.fasecolda_code === fasecoldaCode);
        if (selected) {
            setVersion0Km(selected);
            setPrecioComercial0Km(selected.commercial_value?.toString() || '0');
            setErrorCatalogo(null);
        } else {
            setVersion0Km(null);
        }
    };

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


        // Cotizacion 0km sin factura, se avanza directo al paso 2
        if (esCeroKm) {
            if (modo0Km === 'catalogo') {
                e.preventDefault();
                if (!marca0Km || !referencia0Km || !version0Km) {
                    setErrorCatalogo('Por favor selecciona la marca, línea y versión del vehículo para continuar.');
                    return;
                }
                setErrorCatalogo(null);
                onSuccess({
                    placa: '',
                    tipoVehiculo,
                    useType: 'particular',
                    esCeroKm: true,
                    fasecoldaCode: version0Km.fasecolda_code,
                    brand: version0Km.brand || marca0Km,
                    line: version0Km.line || version0Km.reference || referencia0Km,
                    modelo: modelo0Km,
                    commercialPrice: Number(precioComercial0Km || version0Km.commercial_value || 0),
                    referencePrice: Number(version0Km.commercial_value || 0),
                    versionData: version0Km,
                });
                return;
            }

            if (modo0Km === 'factura' && errorFactura) {
                e.preventDefault();
                return;
            }
        }
    };

    const handleReset0Km = () => {
        setSubmittedTicketId(null);
        setEsCeroKm(false);
        setModo0Km('catalogo');
        setErrorFactura(null);
        setAceptaHabeasData(false);
        setMarca0Km('');
        setReferencia0Km('');
        setVersion0Km(null);
        setErrorCatalogo(null);
    };

    const isPending = esCeroKm ? (modo0Km === 'factura' ? isPending0Km : false) : isPendingPlaca;
    const currentError = esCeroKm ? (modo0Km === 'factura' ? state0Km?.error : errorCatalogo) : statePlaca?.error;

    // Si ya se radicó exitosamente la cotización 0 km, mostramos la tarjeta de espera de asesor
    if (submittedTicketId) {
        return (
            <div className="w-full max-w-137.5 py-4">
                <OfertaAwaitingAdvisorCard
                    ticketId={submittedTicketId}
                    onReset={handleReset0Km}
                />
            </div>
        );
    }

    console.log("listado de versiones", listaVersiones)
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
                <input type="hidden" name="useType" value="particular" />

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

                {/* Checkbox 0 km */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="ceroKm"
                        checked={esCeroKm}
                        onCheckedChange={(checked) => handleToggle0Km(Boolean(checked))}
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
                ) : modo0Km === 'catalogo' ? (
                    /* NUEVO FLUJO 0 KM: CATÁLOGO SECUENCIAL FASECOLDA */
                    <div className="space-y-5 pt-2">
                        <div className="text-center pb-1">
                            <h2 className="text-xl font-bold text-gray-900">
                                Selecciona tu vehículo 0 km
                            </h2>
                            <p className="text-xs text-gray-500">
                                Elige la marca, línea y versión para cotizar automáticamente con Fasecolda.
                            </p>
                        </div>

                        {/* 1. Año / Modelo */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Año del Modelo</Label>
                            <Select value={modelo0Km} onValueChange={handleSelectModelo}>
                                <SelectTrigger className="bg-white p-6 rounded-full w-full border-gray-200">
                                    <SelectValue placeholder="Selecciona el año modelo" />
                                </SelectTrigger>
                                <SelectContent side="bottom" sideOffset={6}>
                                    {aniosDisponibles.map((anio) => (
                                        <SelectItem key={anio} value={anio.toString()}>
                                            {anio}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 2. Marca */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Marca</Label>
                            <Select value={marca0Km} onValueChange={handleSelectMarca} disabled={cargandoMarcas}>
                                <SelectTrigger className="bg-white p-6 rounded-full w-full border-gray-200">
                                    <SelectValue placeholder={cargandoMarcas ? 'Cargando marcas...' : 'Selecciona la marca'} />
                                </SelectTrigger>
                                <SelectContent side="bottom" sideOffset={6} className="max-h-60">
                                    {listaMarcas.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 3. Línea / Referencia */}
                        {marca0Km && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                <Label className="text-sm font-medium text-gray-700">Línea o Referencia</Label>
                                <Select value={referencia0Km} onValueChange={handleSelectReferencia} disabled={cargandoReferencias}>
                                    <SelectTrigger className="bg-white p-6 rounded-full w-full border-gray-200">
                                        <SelectValue placeholder={cargandoReferencias ? 'Cargando líneas...' : (listaReferencias.length === 0 ? 'No hay líneas disponibles' : 'Selecciona la línea')} />
                                    </SelectTrigger>
                                    <SelectContent side="bottom" sideOffset={6} className="max-h-60">
                                        {listaReferencias.map((ref) => (
                                            <SelectItem key={ref} value={ref}>
                                                {ref}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* 4. Versión / Características */}
                        {referencia0Km && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                <Label className="text-sm font-medium text-gray-700">Versión / Características</Label>
                                <Select
                                    value={version0Km?.fasecolda_code || ''}
                                    onValueChange={handleSelectVersion}
                                    disabled={cargandoVersiones}
                                >
                                    <SelectTrigger className="bg-white p-6 rounded-full w-full border-gray-200">
                                        <SelectValue placeholder={cargandoVersiones ? 'Cargando versiones...' : (listaVersiones.length === 0 ? 'No hay versiones disponibles' : 'Selecciona la versión')} />
                                    </SelectTrigger>
                                    <SelectContent side="bottom" sideOffset={6} className="max-h-60">
                                        {listaVersiones.map((v) => (
                                            <SelectItem key={v.fasecolda_code} value={v.fasecolda_code}>
                                                {v.line} {v.commercial_value ? `($${new Intl.NumberFormat('es-CO').format(v.commercial_value)})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* 5. Valor Comercial (Confirmación) */}
                        {version0Km && (
                            <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200 space-y-1 animate-in fade-in duration-150">
                                <span className="text-xs text-yellow-800 font-semibold uppercase tracking-wider block">
                                    Valor Comercial de Referencia
                                </span>
                                <span className="text-xl font-bold text-gray-900 tabular-nums">
                                    ${new Intl.NumberFormat('es-CO').format(Number(precioComercial0Km || version0Km.commercial_value || 0))}
                                </span>
                                <p className="text-xs text-yellow-700">
                                    Código Fasecolda: {version0Km.fasecolda_code}
                                </p>
                            </div>
                        )}

                        {/* Enlace alternativo: No encuentras tu vehículo */}
                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                onClick={() => setModo0Km('factura')}
                                className="text-xs font-semibold text-gray-700 underline hover:text-black transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                                <HelpCircle size={14} className="text-gray-500" />
                                ¿No encuentras tu vehículo? Haz clic aquí para adjuntar tu factura
                            </button>
                        </div>
                    </div>
                ) : (
                    /* MODO ALTERNATIVO 0 KM: FORMULARIO DE FACTURA Y DATOS PERSONALES */
                    <div className="space-y-6 pt-2 animate-in fade-in duration-150">
                        <div>
                            <button
                                type="button"
                                onClick={() => setModo0Km('catalogo')}
                                className="mb-4 text-xs font-semibold text-yellow-700 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                                <ArrowLeft size={12} />
                                Volver al catálogo
                            </button>
                            <h2 className="text-lg font-bold text-gray-900">
                                Datos del Conductor y Factura
                            </h2>
                            <p className="text-xs text-gray-500">
                                Radicaremos tu cotización 0 km para atención personalizada por un asesor.
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
                                required={esCeroKm && modo0Km === 'factura'}
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
                                required={esCeroKm && modo0Km === 'factura'}
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
                        ? (esCeroKm && modo0Km === 'factura' ? 'Radicando cotización con factura…' : 'Consultando…')
                        : esCeroKm
                            ? (modo0Km === 'catalogo' ? 'Continuar' : 'Radicar cotización con factura')
                            : 'Ver ofertas disponibles'}
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