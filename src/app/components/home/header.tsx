
import { Button } from "@/components/ui/button";

export default function HomeHeader() {
    return (
        <header className="px-6 py-12 lg:flex lg:max-w-280 lg:mx-auto lg:items-center lg:gap-8 lg:py-24 lg:px-0">
            <div className="text-center lg:text-start lg:flex-[0.7] lg:space-y-5">
                <h1 className="text-4xl font-bold ">Protege tu carro con el mejor todo riesgo del mercado</h1>
                <p className="mt-4 max-w-[44ch]">Analizamos entre 13+ aseguradoras y te acompañamos hasta que tu carro quede protegido - <b>sin letra pequeña.</b> </p>
                <div className="hidden space-y-4 lg:block">
                    <div className="flex gap-2.5">
                        <Button className="py-3.5 px-5 rounded-2xl grow bg-black min-h-20 hover:text-black"><img src="/images/carro.svg" alt="" className="max-w-12" /> <span>Carro</span></Button>
                        <Button className="py-3.5 px-5 rounded-2xl grow bg-white text-black min-h-20"><img src="/images/moto.svg" alt="" className="max-w-12" /> <span>Moto</span></Button>
                    </div>
                    <Button className="py-5 px-6 rounded-full text-black w-full min-h-14 font-bold sm:text-lg transition-all duration-200 hover:bg-yellow-500 active:scale-[0.99]">Quiero cotizar mi seguro gratis</Button>
                    <p className="text-sm text-neutral-500 text-center">Sin costro sin compromiso. Te contactamos por WhatsApp</p>
                </div>
            </div>
            <div className="space-y-4 lg:flex-1">
                <img src="/images/header-img.webp" alt="" />
                <div className="hidden lg:grid lg:justify-center lg:space-y-2">
                    <svg width="175" height="35" viewBox="0 0 175 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                        <path d="M8.49611 30.6251L10.8659 20.3803L2.91797 13.4896L13.418 12.5782L17.5013 2.91669L21.5847 12.5782L32.0847 13.4896L24.1368 20.3803L26.5066 30.6251L17.5013 25.1928L8.49611 30.6251Z" fill="black" />
                        <path d="M43.4961 30.6251L45.8659 20.3803L37.918 13.4896L48.418 12.5782L52.5013 2.91669L56.5847 12.5782L67.0847 13.4896L59.1368 20.3803L61.5066 30.6251L52.5013 25.1928L43.4961 30.6251Z" fill="black" />
                        <path d="M78.4961 30.6251L80.8659 20.3803L72.918 13.4896L83.418 12.5782L87.5013 2.91669L91.5847 12.5782L102.085 13.4896L94.1368 20.3803L96.5066 30.6251L87.5013 25.1928L78.4961 30.6251Z" fill="black" />
                        <path d="M113.496 30.6251L115.866 20.3803L107.918 13.4896L118.418 12.5782L122.501 2.91669L126.585 12.5782L137.085 13.4896L129.137 20.3803L131.507 30.6251L122.501 25.1928L113.496 30.6251Z" fill="black" />
                        <path d="M148.496 30.6251L150.866 20.3803L142.918 13.4896L153.418 12.5782L157.501 2.91669L161.585 12.5782L172.085 13.4896L164.137 20.3803L166.507 30.6251L157.501 25.1928L148.496 30.6251Z" fill="#A2A2A2" />
                        <path d="M150.866 20.3803L148.496 30.6251L157.501 25.1928L157.748 3.49999L161.585 12.5782L157.501 2.91669L153.418 12.5782L142.918 13.4896L150.866 20.3803Z" fill="black" />
                    </svg>
                    <div className="flex gap-4 justify-between">
                        <span className="font-bold text-lg text-neutral-400">3.558 reviews</span>
                        <span className="font-bold text-lg">4.9 en Google</span>
                    </div>


                </div>
                <div className="flex gap-0.5 lg:hidden">
                    <Button className="py-3.5 px-5 rounded-2xl grow bg-black min-h-20"><img src="/images/carro.svg" alt="" className="max-w-12" /> <span>Carro</span></Button>
                    <Button className="py-3.5 px-5 rounded-2xl grow bg-white text-black min-h-20"><img src="/images/moto.svg" alt="" className="max-w-12" /> <span>Moto</span></Button>
                </div>
                <Button className="py-5 px-6 rounded-full text-black w-full min-h-14 lg:hidden">Quiero cotizar mi seguro gratis</Button>
                <p className="text-sm text-pretty text-neutral-500 text-center lg:hidden " >Sin costro sin compromiso. Te contactamos por WhatsApp</p>
                <div className="lg:hidden">
                    <div className="flex gap-4 justify-between items-center">
                        <span className="font-bold text-neutral-400 flex items-center gap-1">  <svg width="175" height="35" viewBox="0 0 175 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto max-w-24">
                            <path d="M8.49611 30.6251L10.8659 20.3803L2.91797 13.4896L13.418 12.5782L17.5013 2.91669L21.5847 12.5782L32.0847 13.4896L24.1368 20.3803L26.5066 30.6251L17.5013 25.1928L8.49611 30.6251Z" fill="black" />
                            <path d="M43.4961 30.6251L45.8659 20.3803L37.918 13.4896L48.418 12.5782L52.5013 2.91669L56.5847 12.5782L67.0847 13.4896L59.1368 20.3803L61.5066 30.6251L52.5013 25.1928L43.4961 30.6251Z" fill="black" />
                            <path d="M78.4961 30.6251L80.8659 20.3803L72.918 13.4896L83.418 12.5782L87.5013 2.91669L91.5847 12.5782L102.085 13.4896L94.1368 20.3803L96.5066 30.6251L87.5013 25.1928L78.4961 30.6251Z" fill="black" />
                            <path d="M113.496 30.6251L115.866 20.3803L107.918 13.4896L118.418 12.5782L122.501 2.91669L126.585 12.5782L137.085 13.4896L129.137 20.3803L131.507 30.6251L122.501 25.1928L113.496 30.6251Z" fill="black" />
                            <path d="M148.496 30.6251L150.866 20.3803L142.918 13.4896L153.418 12.5782L157.501 2.91669L161.585 12.5782L172.085 13.4896L164.137 20.3803L166.507 30.6251L157.501 25.1928L148.496 30.6251Z" fill="#A2A2A2" />
                            <path d="M150.866 20.3803L148.496 30.6251L157.501 25.1928L157.748 3.49999L161.585 12.5782L157.501 2.91669L153.418 12.5782L142.918 13.4896L150.866 20.3803Z" fill="black" />
                        </svg> 3.558 reviews</span>
                        <span className="font-bold ">4.9 en Google</span>
                    </div>
                </div>
            </div>
        </header>
    );
}