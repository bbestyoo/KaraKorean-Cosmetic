"use client";

import Link from 'next/link';

const brands = [
    { src: '/images/logos/anua.webp', alt: 'Anua' },
    { src: '/images/logos/boj.webp', alt: 'BOJ' },
    { src: '/images/logos/isntree.webp', alt: 'Isntree' },
    { src: '/images/logos/cosrx.webp', alt: 'COSRX' },
    { src: '/images/logos/medicube.webp', alt: 'Medicube' },
    { src: '/images/logos/roundlab.webp', alt: 'Roundlab' },
    { src: '/images/logos/skin1004.webp', alt: 'Skin1004' },
    { src: '/images/logos/somebymi.webp', alt: 'Some By Mi' },
];

const slugify = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

export default function Brands() {
    return (
        <div className="w-full -mt-10 md:absolute md:bottom-0 relative overflow-hidden py-4 sm:py-5 lg:py-10 bg-white/5 z-10 border-t border-white/10 md:mt-0">
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marquee 25s linear infinite;
                    will-change: transform;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
                .brand-img {
                    transition: transform 150ms ease-in-out;
                    transform-origin: center;
                }
                .brand-img:hover {
                    transform: scale(1.05);
                }
            `}</style>
            <div className="relative overflow-hidden w-full">
                <div className="marquee-track">
                    {/* First set */}
                    {brands.map((brand, idx) => {
                        const slug = slugify(brand.alt);
                        return (
                            <div key={`a-${idx}`} className="flex-shrink-0 px-6 flex items-center">
                                <Link href={`/products?brands=${slug}`} aria-label={`View products for ${brand.alt}`}>
                                    <img
                                        src={brand.src}
                                        alt={brand.alt}
                                        className="brand-img cursor-pointer h-14 mb-3 sm:mb-0  sm:h-20 w-auto object-contain opacity-70 hover:opacity-100"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                    {/* Second set */}
                    {brands.map((brand, idx) => {
                        const slug = slugify(brand.alt);
                        return (
                            <div key={`b-${idx}`} className="flex-shrink-0 px-5 sm:px-16 flex items-center">
                                <Link href={`/products?brands=${slug}`} aria-label={`View products for ${brand.alt}`}>
                                    <img
                                        src={brand.src}
                                        alt={brand.alt}
                                        className="brand-img cursor-pointer h-14 mb-3 sm:mb-0 sm:h-20 w-auto object-contain opacity-70 hover:opacity-100"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}