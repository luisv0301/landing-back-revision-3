'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';


interface VehiculoData {
    brand?: string;
    line?: string;
    modelo?: string | number;
    referencePrice?: number | string;
    commercialPrice?: number | string;
    esCeroKm?: boolean;
}

interface Step2Props {
    vehiculo: VehiculoData;
    onNext: () => void;
}

export default function Step2Verifica({ vehiculo, onNext }: Step2Props) {

    const rawPrecio = vehiculo.esCeroKm
        ? vehiculo.commercialPrice || vehiculo.referencePrice
        : vehiculo.referencePrice || vehiculo.commercialPrice;


    const precioFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(Number(rawPrecio) || 0);

    const marca = vehiculo.brand || 'No especificada';
    const linea = vehiculo.line || 'No especificada';
    const modelo = vehiculo.modelo || '---';

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

            <div className="text-center mb-8">
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2'> ¡Lo encontramos!</h1>
                <p className="text-gray-600 font-medium text-base text-center">
                    Vamos a cotizar tu:{' '}
                    <span className="font-bold text-black">
                        {marca} {linea} {modelo}
                    </span>
                </p>
            </div>


            <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100">
                    <div className="flex flex-col items-center px-1">
                        <span className="text-xs text-gray-500 font-medium mb-1">Marca:</span>
                        <span className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                            {marca}
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-1">
                        <span className="text-xs text-gray-500 font-medium mb-1">Línea:</span>
                        <span className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                            {linea}
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-1">
                        <span className="text-xs text-gray-500 font-medium mb-1">Modelo:</span>
                        <span className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                            {modelo}
                        </span>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-center space-x-3 mb-8">
                <span className="text-gray-600 text-md font-medium">Valor Comercial:</span>
                <span className="text-md font-bold text-gray-900">
                    {precioFormateado}
                </span>
            </div>


            <Button
                onClick={onNext}
                className="w-full  hover:bg-yellow-500 text-black rounded-full p-6"
            >
                Avanza
            </Button>


        </motion.div>
    );
}