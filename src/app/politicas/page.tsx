
import type { Metadata } from "next";
import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";

export const metadata: Metadata = {
    title: "Política de Protección de Datos",
    description:
        "Política de tratamiento y protección de datos personales de Segurautos e INTERCOL LTDA.",
};

export default function PoliticasPage() {
    return (
        <div className="bg-[#FFFDEF]">
            <Navbar />
            <main className="w-full pt-6 pb-12 px-4 sm:px-6 lg:py-20 lg:px-8 hidden">
                <article className="mx-auto max-w-4xl rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-12 lg:p-16 shadow-xs text-neutral-800 leading-relaxed">

                    <header className="border-b border-neutral-200 pb-6 mb-8">
                        <p className="text-sm font-bold text-neutral-500 uppercase tracking-wide">
                            POLITICA DE DATOS :
                        </p>
                        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-neutral-900">
                            Política de Protección de Datos
                        </h1>
                        <p className="mt-4 text-base font-semibold text-neutral-900">
                            Solicitar asistencia
                        </p>
                        <p className="mt-1 text-base text-neutral-700">
                            La privacidad de sus datos es esencial para nosotros.
                        </p>
                    </header>

                    <div className="space-y-8 text-sm sm:text-base">

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Nuestros principios:
                            </h2>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>No te solicitamos información personal a menos que sea realmente necesario.</li>
                                <li>INTERCOL LTDA | Agencia de Seguros, no comparte tu información personal con nadie, con excepción de un eventual requeriemiento de una autoridad judicial.</li>
                            </ol>
                            <p>
                                Segurautos es la marca comercial del servicio de seguros de autos de Intermediarios Colombianos de Seguros y Asistencias Intercol Ltda identificado con NIT 900.633.743-5 en adelante INTERCOL LTDA | Agencia de Seguros.
                            </p>
                            <p>
                                Este documento hace parte integral de los Términos y Condiciones, de INTERCOL LTDA | Agencia de Seguros y sus respectivas marcas, los cuales mediante la aceptación se ajustan a las políticas aquí contenidas.
                            </p>
                            <p>
                                Bajo el cumplimiento de la Ley 1581 de 2012 del Ministerio de las TICS, en el cual se regula el administración y protección de Datos en La Republica de Colombia: El titular de los datos acepta el tratamiento de sus datos personales y autoriza a INTERCOL LTDA | Agencia de Seguros, para su uso, administración y protección exclusiva de los datos, con objeto de asesorar, promocionar y colocar sus servicios de seguros y servicios conexos.
                            </p>
                            <p>
                                La fuentes de obtención de datos provienen de las páginas web, oficinas y puntos de venta presenciales.
                            </p>
                            <p>
                                Si usted tiene preguntas acerca de la eliminación o corrección de tus datos personales, contáctenos, uno de nuestros gestores de servicio atenderá su requermiento de manera oportuna.
                            </p>
                        </section>

                        <section className="rounded-2xl bg-neutral-50 p-6 border border-neutral-200/70">
                            <h2 className="text-lg font-bold text-neutral-900">
                                Contacto
                            </h2>
                            <address className="mt-2 not-italic space-y-1 text-neutral-700">
                                <p className="font-semibold text-neutral-900">Oficina Principal</p>
                                <p>Calle 16 # 19-35 Sur, Bogotá</p>
                                <p>CEL: +57 (322) 628-9504</p>
                                <p>PBX: (1) 555 4300</p>
                            </address>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Visitantes del sitio web
                            </h2>
                            <p>
                                Tomamos información disponible desde los navegadores web y servidores, tales como el tipo de navegador, idioma de preferencia, sitio de referencia, y la fecha y hora de cada visitante, con el propósito de conocer mejor el uso ede nuestro sitio web y mejorar nuestro servicios.
                            </p>
                        </section>

                        <section className="rounded-2xl bg-neutral-50 p-6 border border-neutral-200/70 space-y-3">
                            <h2 className="text-xl font-bold text-neutral-900">
                                SARLAFT
                            </h2>
                            <p className="font-semibold text-neutral-800">
                                Sistema de Administración contra el Lavado de Activos y Financiación del Terrorismo.
                            </p>
                            <p>
                                El Sistema de Administración del Riesgo de Lavado de Activos y de la Financiación del Terrorismo se compone de dos fases: la primera corresponde a la prevención del riesgo y cuyo objetivo es prevenir que se introduzcan al sistema financiero recursos provenientes de actividades relacionadas con el lavado de activos y/o de la financiación del terrorismo.
                            </p>
                            <p>
                                La segunda, que corresponde al control y cuyo propósito consiste en detectar y reportar las operaciones que se pretendan realizar o se hayan realizado, para intentar dar apariencia de legalidad a operaciones vinculadas al LA/FT. Ver circular Externa de Superfinanciera 026 de 2008.
                            </p>
                            <div>
                                <p className="font-bold text-neutral-900">Fuente:</p>
                                <a
                                    href="https://www.uiaf.gov.co/transparencia/informacion_interes/glosario/sarlaft"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all hover:text-blue-800"
                                >
                                    https://www.uiaf.gov.co/transparencia/informacion_interes/glosario/sarlaft
                                </a>
                            </div>
                            <p>
                                En cumplimiento a lo ordenado por la Superintendecia Financiera de Colombia respecto al conocimiento del cliente del cual se suscriben las compañoas de seguros y en efecto el asesor de seguros, INTERCOL LTDA | Agencia de Seguros esta en la obligación de solicitar a todos sus clientes el diligenciamiento del formulario SARLAFT.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Finalidades del tratamiento
                            </h2>
                            <p>
                                Si usted nos proporciona Datos Personales, nos autoriza para usar esta información para las finalidades señaladas en la respectiva solicitud en concordancia con lo previsto en esta Política de Tratamiento De Datos Personales, y no procederemos a transferir o divulgar la misma fuera de la Sociedad salvo que (i) usted nos autorice expresamente a hacerlo, (ii) sea necesario para permitir a nuestros contratistas, proveedores o agentes prestar los servicios que les hemos encomendado, (iii) la utilicemos para proporcionarle nuestros productos o servicios, (iv) sea entregada a las entidades que prestan servicios de marketing en nuestro nombre o a otras entidades con las cuales tenemos acuerdos de mercadeo conjunto, (v) tenga relación con una fusión, consolidación, adquisición, desinversión u otro proceso de restructuración, (vi) implementemos un contrato de transmisión de datos personales en los términos del Decreto 1377/13, o (vii) según sea requerido o permitido por la ley o para las finalidades desarrolladas en la presente Política de Tratamiento De Datos Personales.
                            </p>
                            <p>
                                Al aceptar esta Política de Tratamiento De Datos Personales, nos autoriza para hacer tratamiento de la información recolectada para procesar, confirmar, cumplir y proveer nuestros servicios y/o productos, así como para promocionar y publicitar nuestras actividades, productos y servicios, realizar transacciones, efectuar reportes a las distintas autoridades administrativas de control y vigilancia nacionales o internacionales, autoridades de policía o autoridades judiciales, entidades bancarias y/o compañías aseguradoras, para fines administrativos internos y/o comerciales tales como, actualizar sus datos, investigación de mercados, encuestas de calidad de nuestros servicios, auditorías, reportes contables, análisis estadísticos, facturación, y ofrecimiento y/o reconocimiento de beneficios y nuevos productos de nuestros aliados.
                            </p>
                            <p>
                                Con la aceptación de la presente Política de Tratamiento De Datos Personales, nuestros clientes, empleados y proveedores nos autorizan para hacerles llegar por distintos medios y vías (incluyendo correo electrónico, SMS o mensajes de texto, etc.) información de productos y servicios presentados en esta página web, y de ofertas de productos y servicios que creemos pueden serle de interés.
                            </p>
                            <p className="font-semibold text-neutral-900">
                                Adicionalmente, nuestros clientes en su calidad de titulares de los datos recolectados, al aceptar esta política de privacidad, nos autorizan para:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Utilizar la información recibida de ellos, para fines de mercadeo de sus productos y servicios, y de los productos y servicios de terceros con los que tengamos una relación de negocios.</li>
                                <li>Compartir los datos personales con compañías de seguros con el fin de garantizar la prestación de nuestros servicios, la cotización de seguros y la expedición de las pólizas de seguros, así como compartir su información personal con compañías de seguros para que estos puedan ofrecer productos de interés a nuestros clientes y campañas de ventas cruzadas. En algunos de estos eventos, nosotros actuamos como encargados del tratamiento, siendo las compañías de seguros los responsables de tratamiento.</li>
                                <li>Suministrar los datos personales a las autoridades de control y vigilancia de policía o judiciales, en virtud de un requerimiento legal o reglamentario y/o usar o revelar esta información y datos personales en defensa de sus derechos y/o su patrimonio en cuanto dicha defensa tenga relación con los productos y/o servicios contratados.</li>
                                <li>Permitir el acceso a la información y datos personales a los auditores o terceros contratados para llevar a cabo procesos de auditoría interna o externa propios de la actividad comercial que desarrollamos.</li>
                                <li>Consultar y actualizar los datos personales, en cualquier tiempo, con el fin de mantener actualizada dicha información.</li>
                                <li>Contratar con terceros el almacenamiento y/o procesamiento de la información y datos personales para la correcta ejecución de los contratos celebrados con nosotros, bajo los estándares de seguridad y confidencialidad a los cuales estamos obligados.</li>
                                <li>Transferir y transmitir los datos personales a países distintos de aquellos donde se recolecta la información, para lo cual procuraremos la protección de dichos datos conforme a los estándares de seguridad y confidencialidad establecidos en este documento.</li>
                                <li>Transferir los datos personales a un eventual comprador de una de nuestras unidades de negocio, para lo cual brindaremos información oportuna a los titulares de los datos personales, para que éstos ejerzan los derechos de actualización, modificación y supresión de datos personales que les asisten conforme a la ley aplicable.</li>
                                <li>En caso de venta, fusión, absorción, consolidación, cambio en el control societario, transferencia o cesión de activos a cualquier título, incluyendo pero sin limitarse a la base de datos en la que conste la Información, reorganización o liquidación de la Sociedad, el titular de los datos nos autoriza a transferir la información.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Seguridad y confidencialidad
                            </h2>
                            <p>
                                Tenemos establecidos políticas, procedimientos y estándares de seguridad de la información, cuyo objetivo es proteger y preservar la integridad, confidencialidad y disponibilidad de la información, independientemente del medio o formato donde se encuentre, de su ubicación temporal o permanente o de la forma en que ésta sea transmitida. En este sentido, nos apoyamos en herramientas tecnológicas de seguridad e implementamos prácticas de seguridad reconocidas en la industria, que incluyen: transmisión y almacenamiento de información sensible a través de mecanismos seguros, tales como cifrado, uso de protocolos seguros; aseguramiento de componentes tecnológicos, restricción de acceso a la información sólo a personal autorizado, respaldo de información, prácticas de desarrollo seguro de software, entre otros.
                            </p>
                            <p>
                                Los terceros contratados por nosotros están igualmente obligados a adherirse y dar cumplimiento a las políticas y manuales de seguridad de la información, así como a los protocolos de seguridad que aplicamos a todos nuestros procesos.
                            </p>
                            <p>
                                Todo contrato con terceros (contratistas, consultores externos, colaboradores temporales, etc.) que involucre el tratamiento de información y datos personales, incluye un acuerdo de confidencialidad que detalla sus compromisos para la protección, cuidado, seguridad y preservación de la confidencialidad, integridad y privacidad de la misma.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Derechos de los usuarios
                            </h2>
                            <p>
                                Con la aceptación de los Términos y Condiciones de los cuales hace parte integral esta Política de Tratamiento De Datos Personales, usted manifiesta libre, expresa y previamente haber sido informado sobre los derechos que la ley le concede como titular de sus datos personales y que se enuncian a continuación:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Conocer, actualizar y rectificar sus datos personales frente a la entidad responsable del tratamiento o encargada del tratamiento de sus datos personales.</li>
                                <li>Solicitar prueba de la autorización otorgada al responsable del tratamiento salvo cuando expresamente se exceptúe como requisito para el tratamiento.</li>
                                <li>Ser informado por el responsable del tratamiento o el encargado del tratamiento, previa solicitud, respecto del uso que le ha dado a los datos personales.</li>
                                <li>Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones al régimen de protección de datos personales.</li>
                                <li>Revocar la autorización y/o solicitar la supresión del dato personal en los términos de la Ley 1581 del 2012.</li>
                                <li>Acceder en forma gratuita una vez por mes a sus datos personales que hayan sido objeto de tratamiento, en los términos de la normatividad vigente.</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-neutral-900">
                                Cambios en Política de Privacidad
                            </h2>
                            <p>
                                INTERCOL LTDA | Agencia de Seguros puede cambiar su Política de Privacidad sujeto a la ley de protección de datos vigente, para lo cual realizará la respectiva actualización por este mismo medio.
                            </p>
                        </section>

                        <section className="border-t border-neutral-200 pt-6 space-y-3">
                            <h2 className="text-xl font-bold text-neutral-900">
                                LEY 1581 DEL 2012
                            </h2>
                            <p>
                                La presente ley tiene por objeto desarrollar el derecho constitucional que tienen todas las personas a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bases de datos o archivos, y los demás derechos, libertades y garantías constitucionales a que se refiere el artículo 15 de la Constitución Política; así como el derecho a la información consagrado en el artículo 20 de la misma.
                            </p>
                        </section>

                    </div>
                </article>
            </main>

            <div className="px-4">
                <article className="mx-auto mt-4 sm:mt-6 mb-8 sm:mb-16 max-w-4xl rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-12 lg:p-16 shadow-xs text-neutral-800 leading-relaxed space-y-6 sm:space-y-8">
                    <header className="border-b border-neutral-200/80 pb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                            Política de Tratamiento de Datos Personales
                        </h1>
                    </header>

                    {/* 1 */}
                    <section aria-labelledby="sec-1" className="space-y-4">
                        <h2 id="sec-1" className="text-2xl font-semibold text-neutral-900">
                            1. Responsable del tratamiento
                        </h2>
                        <p className="leading-relaxed">
                            SEGURAUTOS es la marca comercial del servicio de seguros de autos de{" "}
                            <strong>
                                Intermediarios Colombianos de Seguros y Asistencias Intercol Ltda.
                            </strong>
                            , en adelante "INTERCOL", sociedad responsable del tratamiento de los
                            datos personales que se recolectan a través de esta marca.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200/80">
                            <table className="min-w-full divide-y divide-neutral-200/80 text-sm">
                                <caption className="sr-only">
                                    Información del responsable del tratamiento
                                </caption>
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Dato
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Información
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Razón social</td>
                                        <td className="px-4 py-3">
                                            Intermediarios Colombianos de Seguros y Asistencias Intercol Ltda.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">NIT</td>
                                        <td className="px-4 py-3">900.633.743-5</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Domicilio principal</td>
                                        <td className="px-4 py-3">Calle 16 # 19-35 Sur, Bogotá D.C.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Sede</td>
                                        <td className="px-4 py-3">Fusagasugá, Cundinamarca</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Sitio web</td>
                                        <td className="px-4 py-3">segurautos.co</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Teléfono y WhatsApp</td>
                                        <td className="px-4 py-3">+57 322 628 9504</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">PBX</td>
                                        <td className="px-4 py-3">(601) 805 4750</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Área responsable de la atención de consultas y reclamos
                                        </td>
                                        <td className="px-4 py-3">
                                            Área Administrativa – intercolseguros@gmail.com
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Canales para ejercer derechos
                                        </td>
                                        <td className="px-4 py-3">
                                            intercolseguros@gmail.com, comunicaintercol@gmail.com,
                                            santiago.benavides@segurosintercol.com
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 2 */}
                    <section aria-labelledby="sec-2" className="space-y-4">
                        <h2 id="sec-2" className="text-2xl font-semibold text-neutral-900">
                            2. Alcance y marco legal
                        </h2>
                        <p className="leading-relaxed">
                            Esta política aplica a todos los datos personales que INTERCOL trata
                            bajo la marca SEGURAUTOS, de clientes, prospectos, visitantes del
                            sitio web y usuarios de sus canales digitales y presenciales. Se
                            expide en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de
                            2013 (compilado en el Decreto 1074 de 2015) y la Ley 2300 de 2023. La
                            autoridad de vigilancia en protección de datos personales es la
                            Superintendencia de Industria y Comercio (SIC).
                        </p>
                        <h3 className="text-lg font-semibold text-neutral-900 pt-2">
                            Definiciones
                        </h3>
                        <ul className="list-disc pl-6 space-y-1 leading-relaxed">
                            <li>
                                <strong>Titular:</strong> persona natural cuyos datos personales son
                                objeto de tratamiento.
                            </li>
                            <li>
                                <strong>Dato personal:</strong> información vinculada o que pueda
                                asociarse a una persona natural determinada o determinable.
                            </li>
                            <li>
                                <strong>Tratamiento:</strong> cualquier operación sobre datos
                                personales, como recolección, almacenamiento, uso, circulación o
                                supresión.
                            </li>
                            <li>
                                <strong>Responsable:</strong> quien decide sobre la base de datos y
                                su tratamiento; en este caso, INTERCOL.
                            </li>
                            <li>
                                <strong>Encargado:</strong> quien trata datos por cuenta del
                                responsable.
                            </li>
                            <li>
                                <strong>Autorización:</strong> consentimiento previo, expreso e
                                informado del titular para el tratamiento de sus datos.
                            </li>
                            <li>
                                <strong>Transmisión:</strong> comunicación de datos a un encargado,
                                dentro o fuera de Colombia, para que los trate por cuenta del
                                responsable.
                            </li>
                            <li>
                                <strong>Transferencia:</strong> envío de datos a otro responsable,
                                dentro o fuera de Colombia.
                            </li>
                        </ul>
                        <p className="leading-relaxed">
                            INTERCOL aplica los principios de legalidad, finalidad, libertad,
                            veracidad, transparencia, acceso y circulación restringida, seguridad
                            y confidencialidad establecidos en el artículo 4 de la Ley 1581 de
                            2012.
                        </p>
                    </section>

                    {/* 3 */}
                    <section aria-labelledby="sec-3" className="space-y-4">
                        <h2 id="sec-3" className="text-2xl font-semibold text-neutral-900">
                            3. Datos que tratamos y fuentes
                        </h2>
                        <p className="leading-relaxed">
                            INTERCOL solo solicita los datos necesarios para cotizar, asesorar,
                            emitir y renovar seguros de vehículos.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200/80">
                            <table className="min-w-full divide-y divide-neutral-200/80 text-sm">
                                <caption className="sr-only">
                                    Categorías y ejemplos de datos tratados
                                </caption>
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Categoría
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Ejemplos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Identificación y contacto
                                        </td>
                                        <td className="px-4 py-3">
                                            Nombre, número de documento, fecha de nacimiento, teléfono,
                                            WhatsApp, correo electrónico, ciudad
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Vehículo</td>
                                        <td className="px-4 py-3">
                                            Placa, marca, línea, modelo, uso (particular o público), valor
                                            comercial, factura de vehículos 0 km
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Póliza y relación comercial
                                        </td>
                                        <td className="px-4 py-3">
                                            Cotizaciones, aseguradora, fecha de vencimiento, renovaciones,
                                            siniestros reportados
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Conocimiento del cliente (SARLAFT)
                                        </td>
                                        <td className="px-4 py-3">
                                            Actividad económica, ingresos, origen de fondos y demás campos
                                            del formulario exigido por las aseguradoras
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Navegación
                                        </td>
                                        <td className="px-4 py-3">
                                            Dirección IP, tipo de navegador y dispositivo, páginas
                                            visitadas, fuente de la visita, parámetros de campaña (UTM)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed">
                            <strong>Fuentes de obtención:</strong> sitio web y cotizador en línea
                            de segurautos.co; formularios de anuncios en Meta (Facebook e
                            Instagram), Google y TikTok; WhatsApp; llamadas telefónicas; correo
                            electrónico; oficinas en Bogotá y Fusagasugá; y bases públicas de
                            información vehicular consultadas a partir de la placa (por ejemplo,
                            Fasecolda) para identificar el vehículo al cotizar.
                        </p>
                        <p className="leading-relaxed">
                            <strong>Datos sensibles y de menores:</strong> SEGURAUTOS no solicita
                            datos sensibles (como salud, biometría u orientación política o
                            religiosa) ni datos de niños, niñas o adolescentes. Si
                            excepcionalmente alguno fuera necesario, se pedirá una autorización
                            expresa, informando que su entrega es facultativa.
                        </p>
                    </section>

                    {/* 4 */}
                    <section aria-labelledby="sec-4" className="space-y-4">
                        <h2 id="sec-4" className="text-2xl font-semibold text-neutral-900">
                            4. Autorización
                        </h2>
                        <p className="leading-relaxed">
                            INTERCOL trata datos personales solo con autorización previa, expresa
                            e informada del titular, obtenida antes de recolectar sus datos por
                            cualquiera de estos medios:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 leading-relaxed">
                            <li>
                                <strong>Sitio web y cotizador:</strong> casilla de aceptación, no
                                marcada por defecto, con enlace a esta política, antes de ingresar
                                datos.
                            </li>
                            <li>
                                <strong>Formularios de anuncios (Meta, Google, TikTok):</strong>{" "}
                                aceptación expresa de esta política, enlazada en el formulario, al
                                enviarlo.
                            </li>
                            <li>
                                <strong>WhatsApp:</strong> aceptación de esta política antes de
                                iniciar la atención.
                            </li>
                            <li>
                                <strong>Llamadas y oficinas:</strong> aceptación verbal o escrita
                                registrada por el asesor.
                            </li>
                        </ul>
                        <p className="leading-relaxed">
                            INTERCOL conserva prueba de cada autorización (fecha, hora, canal y
                            versión de la política aceptada) y la entregará al titular que la
                            solicite. No se requiere autorización en los casos del artículo 10 de
                            la Ley 1581 de 2012, como un requerimiento de autoridad pública o
                            judicial.
                        </p>
                    </section>

                    {/* 5 */}
                    <section aria-labelledby="sec-5" className="space-y-4">
                        <h2 id="sec-5" className="text-2xl font-semibold text-neutral-900">
                            5. Finalidades del tratamiento
                        </h2>
                        <p className="leading-relaxed">
                            Los datos se usan exclusivamente para las siguientes finalidades:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>
                                Cotizar, comparar y asesorar sobre seguros de vehículos con las
                                aseguradoras aliadas.
                            </li>
                            <li>
                                Gestionar la expedición, modificación y administración de las
                                pólizas, y acompañar al titular en caso de siniestro.
                            </li>
                            <li>
                                <strong>
                                    Hacer seguimiento a solicitudes de cotización iniciadas y no
                                    finalizadas, y contactar nuevamente al titular
                                </strong>{" "}
                                para retomar el proceso de asesoría, informarle cambios en tarifas,
                                coberturas o condiciones, y ofrecerle alternativas, mientras la
                                autorización esté vigente y dentro del plazo de conservación de la
                                sección 9.
                            </li>
                            <li>
                                <strong>Gestionar la renovación de las pólizas vigentes</strong>,
                                contactando al titular antes de la fecha de vencimiento para
                                presentarle opciones de renovación.
                            </li>
                            <li>
                                Enviar recordatorios de pago y de vencimiento de la póliza. INTERCOL
                                no recauda dinero: los pagos se hacen directamente a la aseguradora.
                            </li>
                            <li>
                                Enviar información comercial y publicitaria sobre productos y
                                servicios de SEGURAUTOS e INTERCOL, por los canales autorizados.
                            </li>
                            <li>
                                Mostrar publicidad personalizada en plataformas digitales, incluidas
                                campañas de remarketing, según la sección 7.
                            </li>
                            <li>
                                Compartir los datos con las compañías de seguros para cotizar y
                                expedir pólizas. En esos casos, la aseguradora actúa como
                                responsable del tratamiento respecto de sus propios fines.
                            </li>
                            <li>
                                Cumplir las obligaciones de conocimiento del cliente y prevención de
                                lavado de activos y financiación del terrorismo (SARLAFT).
                            </li>
                            <li>
                                Medir la calidad del servicio, hacer encuestas de satisfacción,
                                análisis estadísticos y auditorías internas o externas.
                            </li>
                            <li>
                                Atender requerimientos de autoridades judiciales y administrativas
                                competentes.
                            </li>
                            <li>
                                Transferir los datos en caso de fusión, adquisición, escisión o
                                venta del negocio, informando previamente a los titulares.
                            </li>
                        </ol>
                        <p className="leading-relaxed">
                            INTERCOL no vende ni cede datos personales a terceros para que estos
                            los usen con fines propios distintos a los aquí descritos.
                        </p>
                    </section>

                    {/* 6 */}
                    <section aria-labelledby="sec-6" className="space-y-4">
                        <h2 id="sec-6" className="text-2xl font-semibold text-neutral-900">
                            6. Canales, horarios y frecuencia de contacto
                        </h2>
                        <p className="leading-relaxed">
                            INTERCOL contactará al titular solo por los canales que haya
                            autorizado: llamada telefónica, WhatsApp, correo electrónico y mensaje
                            de texto (SMS).
                        </p>
                        <p className="leading-relaxed">
                            En cumplimiento de la Ley 2300 de 2023, los contactos comerciales, de
                            seguimiento, de renovación y los recordatorios de pago:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 leading-relaxed">
                            <li>
                                Se hacen de lunes a viernes de 8:00 a. m. a 7:00 p. m. y sábados de
                                8:00 a. m. a 2:00 p. m., sin contacto los domingos ni festivos.
                            </li>
                            <li>No se hacen más de una vez en el mismo día.</li>
                            <li>
                                No se hacen por varios canales distintos dentro de una misma semana.
                            </li>
                            <li>
                                Se realizan de forma respetuosa y sin afectar la intimidad personal
                                o familiar del titular.
                            </li>
                        </ul>
                        <p className="leading-relaxed">
                            Las respuestas a solicitudes que el propio titular inicia, como una
                            conversación de WhatsApp o una cotización en curso, se atienden en el
                            mismo canal mientras dure la conversación.
                        </p>
                        <p className="leading-relaxed">
                            <strong>Darse de baja:</strong> el titular puede pedir en cualquier
                            momento que no se le contacte con fines comerciales, respondiendo "NO"
                            o "BAJA" en WhatsApp o SMS, o escribiendo a los correos de la sección
                            1. La baja no afecta las comunicaciones necesarias para administrar
                            una póliza vigente.
                        </p>
                    </section>

                    {/* 7 */}
                    <section aria-labelledby="sec-7" className="space-y-4">
                        <h2 id="sec-7" className="text-2xl font-semibold text-neutral-900">
                            7. Cookies, píxeles y publicidad digital
                        </h2>
                        <p className="leading-relaxed">
                            El sitio segurautos.co usa cookies y tecnologías similares para
                            funcionar, medir su uso y mostrar publicidad relevante.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200/80">
                            <table className="min-w-full divide-y divide-neutral-200/80 text-sm">
                                <caption className="sr-only">
                                    Herramientas de cookies y píxeles utilizadas
                                </caption>
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Herramienta
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Uso
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Google Analytics y Google Tag Manager
                                        </td>
                                        <td className="px-4 py-3">
                                            Medir visitas, fuentes de tráfico y uso del sitio
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Etiqueta de Google Ads
                                        </td>
                                        <td className="px-4 py-3">
                                            Medir conversiones y mostrar anuncios a quienes visitaron el
                                            sitio
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Píxel de Meta
                                        </td>
                                        <td className="px-4 py-3">
                                            Medir conversiones y mostrar anuncios en Facebook e Instagram
                                            a quienes visitaron el sitio o iniciaron una cotización
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Píxel de TikTok
                                        </td>
                                        <td className="px-4 py-3">
                                            Medir conversiones y mostrar anuncios en TikTok
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed">
                            <strong>Audiencias personalizadas:</strong> para mostrar anuncios a
                            personas que ya interactuaron con SEGURAUTOS, o para excluirlas,
                            INTERCOL puede cargar en Meta, Google o TikTok el teléfono o el correo
                            del titular en forma cifrada (hash). Las plataformas usan ese dato
                            solo para identificar coincidencias y no lo reciben en texto legible.
                        </p>
                        <p className="leading-relaxed">
                            El titular puede bloquear o borrar cookies desde la configuración de
                            su navegador y administrar sus preferencias de anuncios en cada
                            plataforma. Bloquear cookies puede afectar algunas funciones del
                            sitio.
                        </p>
                    </section>

                    {/* 8 */}
                    <section aria-labelledby="sec-8" className="space-y-4">
                        <h2 id="sec-8" className="text-2xl font-semibold text-neutral-900">
                            8. Asistente virtual, encargados y transferencias
                        </h2>
                        <p className="leading-relaxed">
                            <strong>Asistente virtual Victoria:</strong> SEGURAUTOS usa un
                            asistente virtual con inteligencia artificial, llamado Victoria, para
                            atender consultas, enviar recordatorios y dar seguimiento a
                            solicitudes. El titular siempre sabrá que habla con un asistente
                            virtual y podrá pedir en cualquier momento la atención de un asesor
                            humano. Ninguna decisión sobre la póliza se toma solo de forma
                            automatizada; la cotización final y la expedición la gestiona un
                            asesor.
                        </p>
                        <p className="leading-relaxed">
                            <strong>Encargados del tratamiento:</strong> INTERCOL comparte datos
                            con proveedores que los tratan por su cuenta, bajo contratos que los
                            obligan a guardar confidencialidad y seguridad y a usarlos solo para
                            el servicio contratado:
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200/80">
                            <table className="min-w-full divide-y divide-neutral-200/80 text-sm">
                                <caption className="sr-only">
                                    Encargados del tratamiento y servicios prestados
                                </caption>
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Proveedor o categoría
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Servicio
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">Botkers</td>
                                        <td className="px-4 py-3">
                                            Operación del asistente virtual y automatizaciones de atención
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Sistemas de gestión de clientes (CRM propio y Zoho)
                                        </td>
                                        <td className="px-4 py-3">
                                            Registro y seguimiento de clientes y solicitudes
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Plataformas de cotización y aseguradoras aliadas
                                        </td>
                                        <td className="px-4 py-3">
                                            Cotización, emisión y renovación de pólizas
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Meta (WhatsApp, Facebook, Instagram), Google y TikTok
                                        </td>
                                        <td className="px-4 py-3">
                                            Mensajería, formularios, medición y publicidad
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Proveedores de alojamiento web y almacenamiento en la nube
                                        </td>
                                        <td className="px-4 py-3">
                                            Operación del sitio y resguardo de la información
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed">
                            <strong>Transmisión internacional:</strong> algunos de estos
                            proveedores almacenan o procesan datos fuera de Colombia, por ejemplo
                            en Estados Unidos. En esos casos, INTERCOL exige estándares de
                            protección equivalentes a los de la ley colombiana, de acuerdo con el
                            Decreto 1074 de 2015.
                        </p>
                    </section>

                    {/* 9 */}
                    <section aria-labelledby="sec-9" className="space-y-4">
                        <h2 id="sec-9" className="text-2xl font-semibold text-neutral-900">
                            9. Seguridad y conservación
                        </h2>
                        <p className="leading-relaxed">
                            INTERCOL protege los datos con medidas técnicas, humanas y
                            administrativas: acceso restringido a personal autorizado,
                            transmisión cifrada, respaldo de la información y acuerdos de
                            confidencialidad con empleados y proveedores.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200/80">
                            <table className="min-w-full divide-y divide-neutral-200/80 text-sm">
                                <caption className="sr-only">
                                    Plazos de conservación por tipo de dato
                                </caption>
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Tipo de dato
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left font-semibold text-neutral-700">
                                            Plazo de conservación
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white">
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Solicitudes de cotización no convertidas en póliza
                                        </td>
                                        <td className="px-4 py-3">
                                            18 meses desde la última interacción
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Clientes con póliza
                                        </td>
                                        <td className="px-4 py-3">
                                            Mientras dure la relación comercial y 10 años más, por
                                            obligaciones legales y contables
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium text-neutral-700">
                                            Datos de navegación y cookies
                                        </td>
                                        <td className="px-4 py-3">
                                            Según la configuración de cada herramienta, sin superar 24
                                            meses
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed">
                            Vencido el plazo, o cuando el titular lo solicite y no exista un deber
                            legal de conservarlos, los datos se suprimen o anonimizan.
                        </p>
                    </section>

                    {/* 10 */}
                    <section aria-labelledby="sec-10" className="space-y-4">
                        <h2 id="sec-10" className="text-2xl font-semibold text-neutral-900">
                            10. Derechos del titular
                        </h2>
                        <p className="leading-relaxed">El titular tiene derecho a:</p>
                        <ul className="list-disc pl-6 space-y-1 leading-relaxed">
                            <li>Conocer, actualizar y rectificar sus datos.</li>
                            <li>Pedir prueba de la autorización otorgada.</li>
                            <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
                            <li>
                                Revocar la autorización o pedir la supresión de sus datos, cuando no
                                exista un deber legal o contractual de conservarlos.
                            </li>
                            <li>
                                Acceder gratuitamente a sus datos al menos una vez al mes y cada vez
                                que esta política cambie sustancialmente.
                            </li>
                            <li>
                                Presentar quejas ante la Superintendencia de Industria y Comercio,
                                después de agotar el trámite ante INTERCOL.
                            </li>
                        </ul>
                    </section>

                    {/* 11 */}
                    <section aria-labelledby="sec-11" className="space-y-4">
                        <h2 id="sec-11" className="text-2xl font-semibold text-neutral-900">
                            11. Procedimiento de consultas y reclamos
                        </h2>
                        <p className="leading-relaxed">
                            El titular, sus causahabientes o representantes pueden escribir a
                            segurosintercol@gmail.com, comunicaintercol@gmail.com o
                            santiago.benavides@segurosintercol.com, o acudir a las oficinas de la
                            sección 1, indicando nombre, documento, datos de contacto y la
                            solicitud.
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>
                                <strong>Consultas:</strong> se responden en máximo 10 días hábiles
                                desde su recibo. Si no es posible, se informará el motivo y se
                                responderá en máximo 5 días hábiles adicionales.
                            </li>
                            <li>
                                <strong>Reclamos</strong> (corrección, actualización, supresión o
                                incumplimiento): se responden en máximo 15 días hábiles desde su
                                recibo completo. Si no es posible, se informará el motivo y se
                                responderá en máximo 8 días hábiles adicionales. Si el reclamo está
                                incompleto, se pedirá completarlo dentro de los 5 días hábiles
                                siguientes. Si pasan 2 meses sin respuesta, se entenderá desistido.
                            </li>
                        </ol>
                    </section>

                    {/* 12 */}
                    <section aria-labelledby="sec-12" className="space-y-4">
                        <h2 id="sec-12" className="text-2xl font-semibold text-neutral-900">
                            12. SARLAFT
                        </h2>
                        <p className="leading-relaxed">
                            Por exigencia de las aseguradoras y de la Superintendencia Financiera
                            de Colombia, INTERCOL solicita a sus clientes el diligenciamiento del
                            formulario de conocimiento del cliente del Sistema de Administración
                            del Riesgo de Lavado de Activos y de la Financiación del Terrorismo
                            (SARLAFT). Esa información se usa solo para ese fin y se comparte con
                            la aseguradora correspondiente.
                        </p>
                    </section>

                    {/* 13 */}
                    <section aria-labelledby="sec-13" className="space-y-4">
                        <h2 id="sec-13" className="text-2xl font-semibold text-neutral-900">
                            13. Vigencia y cambios
                        </h2>
                        <p className="leading-relaxed">
                            Esta política rige desde el{" "}
                            <time dateTime="2026-09-29">29 de septiembre de 2026</time> y
                            reemplaza cualquier versión anterior. Las bases de datos estarán
                            vigentes mientras INTERCOL desarrolle su objeto social. Cualquier
                            cambio sustancial se publicará en segurautos.co y se comunicará a los
                            titulares antes de aplicarse.
                        </p>
                    </section>

                    <footer className="border-t border-neutral-200/80 pt-6 text-sm text-neutral-500">
                        <p>
                            Última actualización:{" "}
                            <time dateTime="2026-09-29">29 de septiembre de 2026</time>.
                        </p>
                    </footer>
                </article>

            </div>


            <div className="px-4 pb-6">
                <Footer />
            </div>
        </div>

    );


}