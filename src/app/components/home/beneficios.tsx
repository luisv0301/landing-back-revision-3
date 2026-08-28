export default function Beneficios() {
    return (
        <div className="px-6 py-12 lg:py-24 lg:max-w-280 lg:mx-auto">
            <h2 className="text-4xl text-center font-bold lg:text-5xl tracking-tight">Doble Respaldo </h2>
            <p className="text-center mt-3">No solo vendemos pólizas: te acompañamos en todo el proceso </p>
            <div className="lg:flex lg:gap-3 flex-row-reverse mt-12">
                <img src="/images/respaldo.webp" alt="" className="rounded-t-4xl lg:max-w-[50%] lg:rounded-4xl lg:object-cover w-full lg:w-auto" />
                <ul className="space-y-0.5 lg:space-y-3 bg-[#FFF7CF] py-7 rounded-b-4xl lg:py-0 lg:bg-transparent">
                    <li className="py-8 px-5 bg-white rounded-t-4xl lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF]">
                        <div className="flex gap-3 items-center">
                            <img src="images/analizamos-icon.svg" alt="" />
                            <p className="text-2xl font-bold lg:text-3xl">Analizamos </p>
                        </div>
                        <p>
                            Comparamos coberturas, deducibles y tarifas entre más de 13 aseguradoras aliadas para encontrar la póliza que de verdad se ajuste a ti.
                        </p>
                    </li>
                    <li className="py-8 px-5 bg-white lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF]">
                        <div className="flex gap-3 items-center">
                            <img src="images/gestionamos-icon.svg" alt="" />
                            <p className="text-2xl lg:text-3xl font-bold">Gestionamos </p>
                        </div>
                        <p>
                            Nos encargamos de toda la documentación y trámites con la aseguradora. Tú solo firmas.
                        </p>
                    </li>
                    <li className="py-8 px-5 bg-white rounded-b-4xl lg:rounded-4xl lg:shadow-[-12px_0_0_#FFF7CF]">
                        <div className="flex gap-3 items-center">
                            <img src="images/acompanamos-icon.svg" alt="" />
                            <p className="text-2xl font-bold lg:text-3xl">Acompañamos</p>
                        </div>
                        <p>
                            Seguimos contigo durante toda la vigencia de tu póliza, incluyendo el proceso de un siniestro o reclamación.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}   