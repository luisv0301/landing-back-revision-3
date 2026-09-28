export interface FooterLink {
    label: string;
    href: string;
}

export interface SocialLink {
    name: string;
    href: string;
    icon: "instagram" | "facebook" | "tiktok";
}

export const FOOTER_NAV_LINKS: readonly FooterLink[] = [
    { label: "Solicitar Asistencia", href: "/solicitar-asistencia" },
    { label: "Nuestros Clientes", href: "/#testimonios" },
    { label: "Políticas", href: "/politicas" },
    { label: "Contáctanos", href: "/contacto" },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [
    { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { name: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
] as const;

export const CONTACT_INFO = {
    address: "Calle 16 # 19-35 Sur, Bogotá",
    whatsapp: {
        display: "+57 (322) 628-9504",
        href: "https://wa.me/573226289504",
    },
    phone: {
        display: "601 805 4560",
        href: "tel:+576018054560",
    },
} as const;

export default function Footer() {
    return (
        <footer className="w-full bg-[#232325] text-white py-12 px-5 sm:px-8 lg:py-16 lg:px-12 rounded-4xl">
            <div className="mx-auto max-w-7xl">
                {/* Main Grid Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12 items-start">

                    {/* Column 1: Brand & Socials */}
                    <div className="flex flex-col items-start gap-6">
                        <a href="/" className="inline-block mx-auto lg:mx-0" aria-label="Segurautos Inicio">
                            <picture>
                                <img
                                    src="/images/logo.png"
                                    alt="Segurautos - INTERCOL LTDA | Agencia de Seguros"
                                    loading="lazy"
                                    decoding="async"
                                    className="h-14 sm:h-16 w-auto object-contain select-none "
                                />
                            </picture>
                        </a>

                        {/* Social Icons (Desktop view layout) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <SocialIconList />
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <nav aria-label="Navegación del pie de página">
                        <ul className="flex flex-col gap-3.5 text-base font-normal text-neutral-200">
                            {FOOTER_NAV_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="transition-colors duration-200 hover:text-white hover:underline underline-offset-4"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Socials (Reordered to follow mobile mockup) */}
                    <div className="flex lg:hidden items-center gap-3">
                        <SocialIconList />
                    </div>

                    {/* Mobile Address Block (Positioned above CTA buttons in mobile) */}
                    <div className="flex lg:hidden items-center gap-3">
                        <AddressBadge address={CONTACT_INFO.address} />
                    </div>

                    {/* Column 3: Contact Actions & CTA */}
                    <div className="flex flex-col gap-3.5 w-full lg:max-w-md lg:ml-auto">
                        {/* WhatsApp Contact Button */}
                        <a
                            href={CONTACT_INFO.whatsapp.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 rounded-full border border-neutral-600 bg-transparent px-6 py-3.5 text-sm sm:text-base font-medium text-white transition-colors duration-200 hover:border-neutral-400 hover:bg-white/5"
                        >
                            <WhatsAppIcon className="h-6 w-6 " />
                            <span>{CONTACT_INFO.whatsapp.display}</span>
                        </a>

                        {/* Phone Contact Button */}
                        <a
                            href={CONTACT_INFO.phone.href}
                            className="flex items-center justify-center gap-3 rounded-full border border-neutral-600 bg-transparent px-6 py-3.5 text-sm sm:text-base font-medium text-white transition-colors duration-200 hover:border-neutral-400 hover:bg-white/5"
                        >
                            <PhoneIcon className="h-6 w-6 " />
                            <span>{CONTACT_INFO.phone.display}</span>
                        </a>

                        {/* Main Yellow CTA */}
                        <a
                            href="/formulario"
                            className="mt-1 flex items-center justify-center rounded-full bg-[#FFD000] px-6 py-4 text-center text-base sm:text-lg font-bold text-neutral-900 transition-all duration-200 hover:bg-yellow-500 active:scale-[0.99]"
                        >
                            Cotiza tu seguro
                        </a>
                    </div>
                </div>

                {/* Bottom Bar: Address (Desktop) & Copyright */}
                <div className="mt-12 sm:mt-16 pt-6 border-t border-neutral-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-neutral-400">
                    {/* Desktop Address */}
                    <div className="hidden lg:flex items-center gap-3">
                        <AddressBadge address={CONTACT_INFO.address} />
                    </div>

                    {/* Legal Copyright */}
                    <p className="text-center sm:text-right w-full lg:w-auto">
                        © 2025 Segurautos. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

// Subcomponents & Icons
function AddressBadge({ address }: { address: string }) {
    return (
        <address className="flex items-center gap-3 not-italic">
            <span className="flex h-9 px-4 items-center justify-center rounded-full border border-neutral-600 text-white">
                <LocationIcon className="h-6 w-6 " />
            </span>
            <span className="text-sm font-medium text-neutral-200">{address}</span>
        </address>
    );
}

function SocialIconList() {
    return (
        <>
            {SOCIAL_LINKS.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visita nuestro perfil de ${item.name}`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-900 transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                    {item.icon === "instagram" && <InstagramIcon className="h-8 w-8 lg:h-10 lg:w-10 fill-current" />}
                    {item.icon === "facebook" && <FacebookIcon className="h-8 w-8 lg:h-10 lg:w-10 fill-current" />}
                    {item.icon === "tiktok" && <TikTokIcon className="h-8 w-8 lg:h-10 lg:w-10 fill-current" />}
                </a>
            ))}
        </>
    );
}

function LocationIcon({ className }: { className?: string }) {
    return (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M13 14.625C12.1965 14.625 11.4111 14.3867 10.743 13.9403C10.0749 13.494 9.55422 12.8595 9.24674 12.1172C8.93926 11.3748 8.85881 10.558 9.01556 9.76995C9.17231 8.9819 9.55923 8.25803 10.1274 7.68988C10.6955 7.12173 11.4194 6.73481 12.2074 6.57806C12.9955 6.42131 13.8123 6.50176 14.5547 6.80924C15.297 7.11672 15.9315 7.63742 16.3778 8.3055C16.8242 8.97357 17.0625 9.75902 17.0625 10.5625C17.0612 11.6395 16.6328 12.6721 15.8712 13.4337C15.1096 14.1953 14.077 14.6237 13 14.625ZM13 8.125C12.5179 8.125 12.0466 8.26796 11.6458 8.53579C11.245 8.80363 10.9325 9.18432 10.748 9.62971C10.5636 10.0751 10.5153 10.5652 10.6093 11.038C10.7034 11.5109 10.9355 11.9452 11.2764 12.2861C11.6173 12.627 12.0516 12.8591 12.5245 12.9532C12.9973 13.0472 13.4874 12.9989 13.9328 12.8145C14.3782 12.63 14.7589 12.3175 15.0267 11.9167C15.2945 11.5159 15.4375 11.0446 15.4375 10.5625C15.4369 9.91623 15.1798 9.29662 14.7229 8.83964C14.2659 8.38266 13.6463 8.12565 13 8.125Z" fill="white" />
            <path d="M13 24.375L6.14576 16.2914C6.05051 16.1701 5.95626 16.0479 5.86301 15.925C4.69277 14.3824 4.06033 12.4988 4.06251 10.5625C4.06251 8.19213 5.00413 5.91884 6.68024 4.24273C8.35635 2.56663 10.6296 1.625 13 1.625C15.3704 1.625 17.6437 2.56663 19.3198 4.24273C20.9959 5.91884 21.9375 8.19213 21.9375 10.5625C21.9394 12.4978 21.3073 14.3805 20.1378 15.9226L20.137 15.925C20.137 15.925 19.8933 16.2451 19.8567 16.2882L13 24.375ZM7.16057 14.9459C7.16057 14.9459 7.34988 15.1962 7.39294 15.2498L13 21.8628L18.6144 15.2409C18.6501 15.1962 18.8403 14.9443 18.8411 14.9435C19.7976 13.6834 20.3144 12.1445 20.3125 10.5625C20.3125 8.6231 19.5421 6.76314 18.1707 5.39178C16.7994 4.02042 14.9394 3.25 13 3.25C11.0606 3.25 9.20065 4.02042 7.82929 5.39178C6.45793 6.76314 5.68751 8.6231 5.68751 10.5625C5.6855 12.1455 6.20299 13.6854 7.16057 14.9459Z" fill="white" />
        </svg>

    );
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M22.6667 3.88007C21.4441 2.64555 19.988 1.66669 18.3833 1.00056C16.7787 0.334417 15.0574 -0.00568423 13.32 7.18602e-05C6.04 7.18602e-05 0.106667 5.93341 0.106667 13.2134C0.106667 15.5467 0.72 17.8134 1.86667 19.8134L0 26.6667L7 24.8267C8.93333 25.8801 11.1067 26.4401 13.32 26.4401C20.6 26.4401 26.5333 20.5067 26.5333 13.2267C26.5333 9.69341 25.16 6.37341 22.6667 3.88007ZM13.32 24.2001C11.3467 24.2001 9.41333 23.6667 7.72 22.6667L7.32 22.4267L3.16 23.5201L4.26667 19.4667L4 19.0534C2.9034 17.3028 2.32123 15.2791 2.32 13.2134C2.32 7.16007 7.25333 2.22674 13.3067 2.22674C16.24 2.22674 19 3.37341 21.0667 5.45341C22.0902 6.47189 22.9012 7.68346 23.4528 9.01784C24.0044 10.3522 24.2856 11.7829 24.28 13.2267C24.3067 19.2801 19.3733 24.2001 13.32 24.2001ZM19.3467 15.9867C19.0133 15.8267 17.3867 15.0267 17.0933 14.9067C16.7867 14.8001 16.5733 14.7467 16.3467 15.0667C16.12 15.4001 15.4933 16.1467 15.3067 16.3601C15.12 16.5867 14.92 16.6134 14.5867 16.4401C14.2533 16.2801 13.1867 15.9201 11.9333 14.8001C10.9467 13.9201 10.2933 12.8401 10.0933 12.5067C9.90667 12.1734 10.0667 12.0001 10.24 11.8267C10.3867 11.6801 10.5733 11.4401 10.7333 11.2534C10.8933 11.0667 10.96 10.9201 11.0667 10.7067C11.1733 10.4801 11.12 10.2934 11.04 10.1334C10.96 9.97341 10.2933 8.34674 10.0267 7.68007C9.76 7.04007 9.48 7.12007 9.28 7.10674H8.64C8.41333 7.10674 8.06667 7.18674 7.76 7.52007C7.46667 7.85341 6.61333 8.65341 6.61333 10.2801C6.61333 11.9067 7.8 13.4801 7.96 13.6934C8.12 13.9201 10.2933 17.2534 13.6 18.6801C14.3867 19.0267 15 19.2267 15.48 19.3734C16.2667 19.6267 16.9867 19.5867 17.56 19.5067C18.2 19.4134 19.52 18.7067 19.7867 17.9334C20.0667 17.1601 20.0667 16.5067 19.9733 16.3601C19.88 16.2134 19.68 16.1467 19.3467 15.9867Z" fill="white" />
        </svg>

    );
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7.71344 2.85239C9.13432 3.92689 10.2098 5.43655 11.1256 6.82372L11.8433 7.91805C12.0662 8.25588 12.1682 8.66388 12.1316 9.07145C12.0951 9.47902 11.9222 9.86051 11.6431 10.1499L10.1176 11.7319L10.2784 12.0866C10.6722 12.9137 11.3517 14.1049 12.3743 15.1666C13.0816 15.8864 13.8775 16.5062 14.7413 17.0099L15.1542 17.2397L15.5221 17.4287L15.6863 17.5069L17.2107 15.9249C17.4906 15.6343 17.8602 15.4551 18.2546 15.4187C18.6491 15.3822 19.0434 15.4908 19.3684 15.7254L20.5092 16.5456C21.8052 17.4906 23.1586 18.5674 24.2104 19.9651C24.3923 20.2076 24.5079 20.4964 24.5453 20.8011C24.5827 21.1059 24.5405 21.4155 24.4231 21.6976C23.4814 23.9761 21.0987 25.9162 18.6203 25.8206L18.2828 25.8019L18.0207 25.7786L17.7304 25.7436L17.4143 25.6992L17.0712 25.6397L16.7044 25.5651L16.3152 25.4752L15.9034 25.3656L15.4703 25.2372L15.0181 25.0856C12.9413 24.3552 10.3054 22.9202 7.60094 20.1156C4.89644 17.3109 3.51382 14.5786 2.80957 12.4249L2.66332 11.9559L2.53957 11.5067L2.43382 11.0797L2.34607 10.6761C2.32075 10.5496 2.29713 10.4228 2.27519 10.2957L2.21894 9.93989L2.17394 9.61205L2.14132 9.31105L2.11882 9.03922L2.10082 8.68922C2.00969 6.12722 3.90082 3.63872 6.08782 2.66689C6.35104 2.54901 6.6393 2.50414 6.92429 2.53666C7.20929 2.56918 7.48123 2.67798 7.71344 2.85239ZM6.67057 4.96172C5.46457 5.61505 4.29682 7.10839 4.34969 8.60289L4.37219 8.98555L4.39694 9.22472L4.42957 9.49305L4.47457 9.78822L4.53194 10.1114L4.60507 10.4591L4.69507 10.8324L4.80307 11.2279L4.93132 11.6456C4.97857 11.7879 5.02882 11.9337 5.08207 12.0831L5.25532 12.5404L5.45332 13.0152C6.15982 14.6276 7.31182 16.5152 9.19394 18.4659C11.0749 20.4166 12.8952 21.6124 14.4499 22.3451L14.9078 22.5504L15.3488 22.7301C15.4928 22.7861 15.6334 22.8382 15.7707 22.8864L16.1734 23.0194L16.5559 23.1314L16.9148 23.2247L17.2501 23.3006L17.5617 23.3601L17.8474 23.4067L18.1062 23.4417L18.3357 23.4651L18.7047 23.4884C20.1267 23.5432 21.5779 22.3392 22.2057 21.1049C21.4047 20.1307 20.4102 19.3316 19.3133 18.5266L18.4718 17.9187L18.2581 18.1509L17.8013 18.6677L17.5594 18.9314C16.9002 19.6279 16.1307 20.2194 15.2082 19.8332L14.9539 19.7224L14.6434 19.5777L14.4702 19.4926L14.0899 19.2954L13.6726 19.0621C12.6173 18.4509 11.646 17.6955 10.7847 16.8162C9.9368 15.923 9.20841 14.9157 8.61907 13.8214L8.39407 13.3897L8.20282 12.9942L7.98232 12.4926L7.87432 12.2266C7.52444 11.3294 8.00594 10.5722 8.62132 9.91655L8.87332 9.65989L9.49994 9.06139L9.72495 8.83972L9.19282 8.03122C8.40194 6.84122 7.62907 5.76789 6.66944 4.96055L6.67057 4.96172ZM16.8664 7.04655L16.9969 7.06172C17.8158 7.21151 18.568 7.62632 19.1456 8.24668C19.7232 8.86704 20.0965 9.6611 20.2122 10.5151C20.2534 10.8104 20.1839 11.111 20.018 11.3548C19.8521 11.5987 19.6024 11.7673 19.3202 11.8261C19.038 11.8848 18.7449 11.8292 18.5011 11.6706C18.2573 11.512 18.0813 11.2626 18.0094 10.9736L17.9836 10.8394C17.9383 10.5047 17.8005 10.1907 17.5869 9.93543C17.3733 9.68016 17.093 9.4945 16.7798 9.40089L16.6054 9.36005C16.323 9.30813 16.0703 9.14624 15.8991 8.90751C15.7279 8.66877 15.6511 8.37123 15.6844 8.07572C15.7177 7.78022 15.8587 7.50909 16.0784 7.31778C16.2981 7.12648 16.58 7.02945 16.8664 7.04655ZM16.8743 3.49989C18.6645 3.49989 20.3814 4.23738 21.6473 5.55014C22.9132 6.86289 23.6243 8.64337 23.6243 10.4999C23.624 10.7972 23.5142 11.0833 23.3174 11.2995C23.1205 11.5157 22.8515 11.6458 22.5653 11.6633C22.279 11.6807 21.9971 11.5841 21.7773 11.3932C21.5574 11.2024 21.4161 10.9317 21.3822 10.6364L21.3743 10.4999C21.3742 9.3152 20.9396 8.17491 20.1587 7.31026C19.3778 6.4456 18.309 5.92132 17.1691 5.84372L16.8743 5.83322C16.576 5.83322 16.2898 5.7103 16.0788 5.49151C15.8678 5.27272 15.7493 4.97597 15.7493 4.66655C15.7493 4.35713 15.8678 4.06039 16.0788 3.84159C16.2898 3.6228 16.576 3.49989 16.8743 3.49989Z" fill="white" />
        </svg>

    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect width="41.2921" height="41.2921" rx="4" fill="#FFD000" />
            <circle cx="20.6459" cy="21.6293" r="9.83146" fill="#262525" />
            <circle cx="32.4436" cy="8.84836" r="2.94944" fill="#262525" />
            <circle cx="20.6469" cy="21.6293" r="5.89888" fill="#FFD000" />
        </svg>


    );
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M4 0C1.79086 0 0 1.79086 0 4V38C0 40.2091 1.79086 42 4 42H37C39.2091 42 41 40.2091 41 38V4C41 1.79086 39.2091 0 37 0H4ZM29.4938 5.48072C29.7915 5.47425 30.1016 5.48415 30.4222 5.50634C31.6001 5.50799 32.8303 5.61677 34.0507 5.72681L33.9181 10.7H30.6399C29.1028 10.6651 28.5477 11.2765 28.4978 13.0532V16.9599H34.0507L33.8305 22.2868H28.4978V37.1166H23.08V22.2869H19.3189V16.9599H23.08V12.3867C23.08 9.0894 24.4409 6.99062 27.1215 5.92676C27.8099 5.64928 28.6005 5.50015 29.4938 5.48072Z" fill="#FFD000" />
        </svg>


    );
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <rect width="42" height="42" rx="4" fill="#FFD000" />
            <path d="M27.5159 12.245C26.5477 11.1393 26.0141 9.71965 26.0142 8.25H21.6367V25.8167C21.6037 26.7675 21.2026 27.6684 20.518 28.3291C19.8335 28.9899 18.919 29.3589 17.9676 29.3583C15.9559 29.3583 14.2842 27.715 14.2842 25.675C14.2842 23.2383 16.6359 21.4108 19.0584 22.1617V17.685C14.1709 17.0333 9.89258 20.83 9.89258 25.675C9.89258 30.3925 13.8026 33.75 17.9534 33.75C22.4017 33.75 26.0142 30.1375 26.0142 25.675V16.7642C27.7893 18.039 29.9205 18.7229 32.1059 18.7192V14.3417C32.1059 14.3417 29.4426 14.4692 27.5159 12.245Z" fill="#262626" />
        </svg>

    );
}