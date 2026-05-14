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
        <div className="w-full absolute bottom-0 overflow-hidden py-6">
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marquee 20s linear infinite;
                    will-change: transform;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="relative overflow-hidden w-full">
                <div className="marquee-track">
                    {/* Original set */}
                    {brands.map((brand, idx) => (
                        <div key={`a-${idx}`} className="flex-shrink-0 px-10 flex items-center">
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                    {/* Exact duplicate — makes -50% land back at start */}
                    {brands.map((brand, idx) => (
                        <div key={`b-${idx}`} className="flex-shrink-0 px-10 flex items-center">
                            <img
                                src={brand.src}
                                alt={brand.alt}
                                className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}