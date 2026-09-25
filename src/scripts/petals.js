// src/scripts/petals.js - Click Burst Pop-Up Balloon & Love Hearts Animation

(function() {
    window.triggerBalloonAndLoveBurst = function(originX, originY) {
        const container = document.body;
        const items = ['🎈', '🌸', '✨', '🎈', '🌸', '✨', '🎈', '🌸'];
        const totalCount = 24;

        const startX = originX || window.innerWidth / 2;
        const startY = originY || window.innerHeight / 2;

        for (let i = 0; i < totalCount; i++) {
            const el = document.createElement('div');
            el.className = 'burst-item';
            el.innerText = items[Math.floor(Math.random() * items.length)];

            const size = Math.random() * 16 + 22; // 22px to 38px
            const targetX = (Math.random() - 0.5) * (window.innerWidth * 0.7);
            const targetY = -(Math.random() * 450 + 250); // Rise upward
            const rotation = (Math.random() - 0.5) * 90;
            const duration = Math.random() * 1.2 + 1.8; // 1.8s to 3.0s
            const delay = Math.random() * 0.3;

            el.style.position = 'fixed';
            el.style.left = `${startX}px`;
            el.style.top = `${startY}px`;
            el.style.fontSize = `${size}px`;
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9999';
            el.style.userSelect = 'none';
            el.style.transform = 'translate(-50%, -50%) scale(0)';
            el.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))';
            
            container.appendChild(el);

            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: targetX,
                    y: targetY,
                    scale: Math.random() * 0.6 + 1.2,
                    rotation: rotation,
                    opacity: 0,
                    duration: duration,
                    delay: delay,
                    ease: "power2.out",
                    onComplete: () => el.remove()
                });
            } else {
                // Fallback JS animation
                el.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1), opacity ${duration}s ease-in`;
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.5) rotate(${rotation}deg)`;
                    el.style.opacity = '0';
                });
                setTimeout(() => el.remove(), duration * 1000 + 100);
            }
        }
    };
})();
