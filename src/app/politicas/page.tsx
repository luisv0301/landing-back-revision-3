
import type { Metadata } from "next";
import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";

export const metadata: Metadata = {
    title: "Política de Protección de Datos",
    description: "Política de Protección de Datos",
};

export default function PoliticasPage() {
    return (
        <div className="bg-[#FFFDEF]">
            <Navbar />
            <main className="w-full pt-6 pb-12 px-4 sm:px-6 lg:py-20 lg:px-8">
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
                                INTERCOL LTDA | Agencia de Seguros puede cambiar su Política de Privacidad sujeto a la ley de protección de datos vigente, para lo cual realziara la respcriva actualización por este mismo medio.
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
            <div className="px-4 pb-6">
                <Footer />
            </div>
        </div>

    );
}