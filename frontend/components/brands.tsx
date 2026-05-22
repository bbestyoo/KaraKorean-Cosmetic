'use client';

const brands = [
    { src: '/images/logos/anua.png', alt: 'Anua' },
    { src: '/images/logos/boj.png', alt: 'BOJ' },
    { src: '/images/logos/isntree.png', alt: 'Isntree' },
    { src: '/images/logos/cosrx.png', alt: 'COSRX' },
    { src: '/images/logos/medicube.png', alt: 'Medicube' },
    { src: '/images/logos/roundlab.png', alt: 'Roundlab' },
    { src: '/images/logos/skin1004.png', alt: 'Skin1004' },
    { src: '/images/logos/somebymi.png', alt: 'Some By Mi' },
];

export default function Brands() {
    return (
        <div className="w-full absolute bottom-0 overflow-hidden py-10 bg-white/5  z-10 border-t border-white/10">
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
            `}</style>
            <div className="relative overflow-hidden w-full">
                <div className="marquee-track">
                    {/* First set */}
                    {brands.map((brand, idx) => (
                        <div key={`a-${idx}`} className="flex-shrink-0 px-16 flex items-center">
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className="h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                    {/* Second set */}
                    {brands.map((brand, idx) => (
                        <div key={`b-${idx}`} className="flex-shrink-0 px-16 flex items-center">
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className="h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}