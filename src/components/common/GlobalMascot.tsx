import { useEffect, useState, useRef } from 'react';

const GlobalMascot = () => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [mascotSrc, setMascotSrc] = useState<string>("/mascot.png");
    
    // Timer ref to prevent flickering
    const hoverTimer = useRef<number | null>(null);

    // Advanced Client-Side Background Removal
    useEffect(() => {
        let mounted = true;
        const removeBlackBg = () => {
            const img = new window.Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] < 15 && data[i + 1] < 15 && data[i + 2] < 15) {
                        data[i + 3] = 0; 
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                if(mounted) setMascotSrc(canvas.toDataURL("image/png"));
            };
            img.src = "/mascot.png";
        };
        removeBlackBg();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Listen to ALL buttons, links, inputs, and interactive cards/groups across the ENTIRE site
            const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .group, .cursor-pointer');
            
            if (interactiveEl) {
                const rect = interactiveEl.getBoundingClientRect();
                
                // Don't show on massive layout wrappers (e.g. full-width sections)
                if (rect.height > 600 || rect.width > window.innerWidth * 0.9) return;
                
                setTargetRect(rect);
                
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => {
                    setIsHovered(true);
                }, 50); // slight debounce
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isHovered || !targetRect) return;
            const x = ((e.clientX - targetRect.left) / targetRect.width - 0.5) * 2;
            const y = ((e.clientY - targetRect.top) / targetRect.height - 0.5) * 2;
            setMousePos({ x, y });
        };

        const handleMouseOut = (e: MouseEvent) => {
             const target = e.target as HTMLElement;
             const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .group, .cursor-pointer');
             if(!interactiveEl) return;
             
             // Check if we are actually leaving the interactive element completely (not just entering a child)
             const rect = interactiveEl.getBoundingClientRect();
             if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                 if (hoverTimer.current) clearTimeout(hoverTimer.current);
                 setIsHovered(false);
             }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseout', handleMouseOut);
        
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isHovered, targetRect]);

    if (!targetRect) return null;

    return (
        <div 
            className="fixed pointer-events-none z-[9999]"
            style={{
                top: targetRect.top - 120, // Sit purely above the element
                left: targetRect.left + (targetRect.width / 2),
                transform: `translateX(-50%)`,
                width: '6rem', 
                height: '120px',
                overflow: 'hidden', // The magic illusion of emerging from behind
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transition: 'left 0.3s ease-out, top 0.3s ease-out'
            }}
        >
            <div 
                className="w-full flex-grow flex flex-col items-center justify-end pb-1"
                style={{
                    transform: `translateY(${isHovered ? '0%' : '100%'}) scale(${isHovered ? 1 : 0.8})`,
                    opacity: isHovered ? 1 : 0,
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s'
                }}
            >
                <div 
                    className="w-full flex-grow flex items-center justify-center transition-transform"
                    style={{ 
                        transform: `perspective(400px) rotateY(${mousePos.x * 45}deg) rotateX(${mousePos.y * -20}deg) translateX(${mousePos.x * 12}px)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                >
                    <img 
                      src={mascotSrc} 
                      alt="Mascot" 
                      className="w-full h-full object-contain drop-shadow-lg origin-bottom"
                      style={{
                          animation: isHovered ? 'mascotBreathe 1.8s ease-in-out infinite' : 'none',
                      }}
                    />
                </div>
                {/* Animated pointing arrow resting right at the edge of the card */}
                <div className={`text-2xl mt-1 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100 animate-[bounce_1s_infinite]' : ''}`}>
                   👇
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes mascotBreathe {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.05, 0.95) translateY(4px); }
                }
            `}} />
        </div>
    );
};

export default GlobalMascot;
