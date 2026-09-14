"use client"
import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HomeHeader() {
    const [tipoSeleccionado, setTipoSeleccionado] = useState<"carro" | "moto">("carro");

    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out", duration: 0.45 },
            });

            tl.to(titleRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)"
            }).to(
                textRef.current,
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)"
                },
                "-=0.25"
            );
        },
        { scope: containerRef }
    );

    return (
        <div className="relative w-full overflow-x-clip">
            <header className="px-6 pb-12 pt-9 lg:flex lg:max-w-280 lg:mx-auto lg:items-center lg:gap-8 lg:py-24 lg:px-0" ref={containerRef}>
                <div className="text-center lg:text-start lg:flex-[0.7] lg:space-y-7">
                    <h1 className="text-4xl text-pretty font-bold tracking-tight opacity-0 translate-y-6 blur-sm scale-[0.98] will-change-[transform,filter,opacity,scale]" ref={titleRef}>Protege tu carro con el mejor seguro todo riesgo del mercado</h1>
                    <p className="mt-4 text-center lg:text-start mx-auto lg:mx-0 max-w-[44ch] opacity-0 translate-y-6 blur-sm scale-[0.98] will-change-[transform,filter,opacity,scale]" ref={textRef}>Nuestro equipo analiza entre 13+ aseguradoras y construye una <b>solución</b> para garantizar <b>tu protección</b> y la de tu vehículo.</p>
                    <div className="hidden space-y-4 lg:block">
                        <div className="relative flex gap-2.5 p-1 bg-white rounded-3xl border border-neutral-200">
                            <button
                                type="button"
                                onClick={() => setTipoSeleccionado("carro")}
                                className={`relative z-10 flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl grow min-h-20 font-semibold transition-colors duration-200 cursor-pointer ${tipoSeleccionado === "carro" ? "text-white" : "text-black hover:text-neutral-700"
                                    }`}
                            >
                                {tipoSeleccionado === "carro" && (
                                    <motion.div
                                        layoutId="headerVehicleTabDesktop"
                                        className="absolute inset-0 rounded-2xl bg-black shadow-md z-[-1]"
                                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                    />
                                )}
                                <img src="/images/carro.svg" alt="" className="max-w-12" />
                                <span>Carro</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTipoSeleccionado("moto")}
                                className={`relative z-10 flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl grow min-h-20 font-semibold transition-colors duration-200 cursor-pointer ${tipoSeleccionado === "moto" ? "text-white" : "text-black hover:text-neutral-700"
                                    }`}
                            >
                                {tipoSeleccionado === "moto" && (
                                    <motion.div
                                        layoutId="headerVehicleTabDesktop"
                                        className="absolute inset-0 rounded-2xl bg-black shadow-md z-[-1]"
                                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                    />
                                )}
                                <img src="/images/moto.svg" alt="" className="max-w-12" />
                                <span>Moto</span>
                            </button>
                        </div>

                        <Link href={`/formulario?tipo=${tipoSeleccionado}`} className="hidden lg:block">
                            <Button
                                className="py-5 px-6 rounded-full text-black w-full min-h-14 font-bold sm:text-lg transition-all duration-200 hover:bg-yellow-500 active:scale-[0.98] cursor-pointer shadow-xs hover:shadow-md"
                            >
                                Cotizar
                            </Button>
                        </Link>

                        <p className="text-sm text-neutral-500 text-center">La mejor cobertura, por el mejor precio</p>
                    </div>
                </div>
                <div className="space-y-4 lg:flex-1">
                    <picture className="relative block h-full w-full">
                        <source
                            media="(min-width: 64rem)"
                            srcSet="/images/header-img-desktop.webp"
                        />
                        <img src="/images/header-img.webp" alt="" className="mx-auto lg:mx-0 lg:scale-[1.2] lg:translate-y-[-2.5%] lg:translate-x-[25%]" />
                    </picture>
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

                    <div className="relative flex gap-1 p-1 bg-neutral-100 rounded-3xl border border-neutral-200 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setTipoSeleccionado("carro")}
                            className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl grow min-h-16 font-semibold transition-colors duration-200 cursor-pointer ${tipoSeleccionado === "carro" ? "text-white" : "text-black hover:text-neutral-700"
                                }`}
                        >
                            {tipoSeleccionado === "carro" && (
                                <motion.div
                                    layoutId="headerVehicleTabMobile"
                                    className="absolute inset-0 rounded-2xl bg-black shadow-md z-[-1]"
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                            )}
                            <img src="/images/carro.svg" alt="" className="max-w-10" />
                            <span>Carro</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipoSeleccionado("moto")}
                            className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl grow min-h-16 font-semibold transition-colors duration-200 cursor-pointer ${tipoSeleccionado === "moto" ? "text-white" : "text-black hover:text-neutral-700"
                                }`}
                        >
                            {tipoSeleccionado === "moto" && (
                                <motion.div
                                    layoutId="headerVehicleTabMobile"
                                    className="absolute inset-0 rounded-2xl bg-black shadow-md z-[-1]"
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                            )}
                            <img src="/images/moto.svg" alt="" className="max-w-10" />
                            <span>Moto</span>
                        </button>
                    </div>

                    <Link href={`/formulario?tipo=${tipoSeleccionado}`} className="lg:hidden">
                        <Button
                            className="py-5 px-6 rounded-full text-black w-full min-h-14 font-bold transition-all duration-200 hover:bg-yellow-500 active:scale-[0.98] cursor-pointer shadow-xs"
                        >Cotizar</Button>
                    </Link>


                    <p className="text-[12px] text-pretty text-neutral-500 text-center lg:hidden mt-4" >La mejor cobertura, por el mejor precio</p>
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

            <svg width="220" height="93" viewBox="0 0 220 93" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 translate-x-[-30%] hidden xl:block">
                <path d="M7.32568 70.5C-1.68452 75.0217 -1.17461 92.5 5.35487 92.5H210.895C215.551 92.5 219.326 88.7257 219.326 84.0699V75.5238C219.326 63.023 209.192 52.889 196.691 52.889H193.247H188.965C176.927 52.889 167.169 62.6476 167.169 74.6855C167.169 66.099 170.176 50.704 156.661 41.6606C143.145 32.6172 125.889 37.8925 121.196 41.6606C119.319 23.7621 105.393 -2.09044 64.0596 0.709672C25.06 3.35166 19.4286 52.935 25.06 72.7175C23.1844 70.8335 16.3359 65.9782 7.32568 70.5Z" stroke="#262626" />
                <path d="M110.326 64.4999C110.326 58.5284 113.128 47.1182 122.326 41" stroke="black" />
            </svg>


            <svg width="189" height="210" viewBox="0 0 189 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 bottom-0 hidden xl:block scale-[0.85]">
                <path d="M6.29395 109.183C6.29395 109.183 6.43608 104.362 11.5527 107.198C11.5527 107.198 12.1212 99.6827 17.5221 101.951C22.923 104.22 22.7098 108.19 22.7098 108.19C22.7098 108.19 21.786 86.921 27.2579 86.921C32.7299 86.921 33.3694 99.9663 34.5775 100.817C35.7856 101.668 33.5826 90.6786 40.5469 89.686C47.5112 88.7644 47.9376 110.601 51.4198 112.373C54.8308 114.146 53.7649 98.9028 55.8968 98.6192C58.0287 98.3356 58.9526 103.795 60.6581 103.369C62.4347 102.944 61.4398 94.0817 64.7798 94.2944C68.1199 94.5071 68.9016 98.6192 69.1858 100.959C69.1858 100.959 75.1552 98.4774 78.1399 103.086C81.1246 107.765 70.8203 120.668 72.5258 122.37C74.3024 124.142 81.1957 112.09 87.6625 112.019C94.0583 112.019 92.8502 116.273 90.5051 121.732C88.16 127.191 98.6064 117.336 101.804 117.194C105.073 117.053 107.347 120.739 103.226 125.135C99.1039 129.531 97.1851 132.934 100.667 131.02C104.149 129.105 110.403 122.016 113.032 125.064C115.733 128.113 103.083 141.442 103.083 141.442C103.083 141.442 117.225 142.434 122.342 148.886C127.387 155.338 122.697 158.386 122.697 158.386H156.5" stroke="black" strokeMiterlimit="10" />
                <path d="M15.8162 148.177C15.8162 148.177 4.87233 134.706 9.77576 134.706C14.6792 134.706 21.5014 144.136 21.5014 144.136C21.5014 144.136 8.28341 117.62 15.3188 115.209C22.3541 112.799 27.3286 130.027 27.3286 130.027L30.3133 118.471" stroke="black" strokeMiterlimit="10" />
                <path d="M52.77 127.971L56.039 139.953C56.039 139.953 58.5973 126.128 61.6531 123.504C64.7088 120.881 62.2216 133.997 62.2216 133.997" stroke="black" strokeMiterlimit="10" />
                <path d="M65.4194 141.654C66.059 141.654 70.3939 138.18 70.5361 132.154" stroke="black" strokeMiterlimit="10" />
                <path d="M73.6626 156.756C73.6626 156.756 79.4188 144.986 88.2308 143.143C97.0427 141.3 96.0478 153.565 87.5201 155.338" stroke="black" strokeMiterlimit="10" />
            </svg>

        </div>
    );
}