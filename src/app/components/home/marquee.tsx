"use client";

import { motion } from "framer-motion";
import { INSURERS_DATA, InsurerItem } from "./aseguradoras";

interface InsurersMarqueeProps {
    speed?: number; // Duración de una vuelta completa en segundos
    pauseOnHover?: boolean;
}

export default function Marquee({
    speed = 35,
    pauseOnHover = true,
}: InsurersMarqueeProps) {
    return (
        <section
            aria-label="Aseguradoras aliadas"
            className="relative w-full overflow-hidden border-y border-neutral-200/80"
        >

            <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <motion.div
                    className={`flex w-max items-center ${pauseOnHover ? "hover:paused" : ""
                        }`}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: speed,
                    }}
                >

                    <LogoTrack items={INSURERS_DATA} />


                    <LogoTrack items={INSURERS_DATA} isDuplicate />
                </motion.div>
            </div>
        </section>
    );
}

interface LogoTrackProps {
    items: readonly InsurerItem[];
    isDuplicate?: boolean;
}

function LogoTrack({ items, isDuplicate = false }: LogoTrackProps) {
    return (
        <ul
            className="flex shrink-0 items-center"
            aria-hidden={isDuplicate ? "true" : undefined}
        >
            {items.map((insurer) => (
                <li
                    key={isDuplicate ? `dup-${insurer.id}` : insurer.id}
                    className="flex h-20 w-44 shrink-0 items-center justify-center  px-6 sm:h-24 sm:w-52"
                >
                    <img
                        src={insurer.logo}
                        alt={isDuplicate ? "" : `Logo de ${insurer.name}`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-9 w-auto max-w-[80%] object-contain select-none opacity-90 transition-opacity duration-200 hover:opacity-100 scale-150"
                    />
                </li>
            ))}
        </ul>
    );
}