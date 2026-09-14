// src/scripts/interactions.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Envelope Interaction ---
    const btnOpenEnvelope = document.getElementById('btn-open-envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const flap = document.querySelector('.flap');
    const letter = document.querySelector('.letter-peek');
    const seal = document.querySelector('.heart-seal');
    let isEnvelopeOpened = false;



    // Mouse Parallax Effect for Envelope
    document.addEventListener('mousemove', (e) => {
        if (isEnvelopeOpened || !envelopeWrapper || typeof gsap === 'undefined' || currentSceneIndex !== 0) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        // Base rotation from CSS is rotateX(15deg) rotateY(-10deg)
        gsap.to(envelopeWrapper, {
            rotationY: -10 - xAxis,
            rotationX: 15 + yAxis,
            duration: 0.5,
            ease: "power1.out"
        });
    });

    // Reset when mouse leaves window
    document.addEventListener('mouseleave', () => {
        if (isEnvelopeOpened || !envelopeWrapper || typeof gsap === 'undefined' || currentSceneIndex !== 0) return;
        gsap.to(envelopeWrapper, {
            rotationY: -10,
            rotationX: 15,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Click envelope wrapper directly to open
    envelopeWrapper?.addEventListener('click', () => {
        if (!isEnvelopeOpened && btnOpenEnvelope) {
            btnOpenEnvelope.click();
        }
    });

    btnOpenEnvelope?.addEventListener('click', (e) => {
        if (!envelopeWrapper || typeof gsap === 'undefined') return;
        
        // Auto play Happy Birthday Music on envelope open / button press!
        playHappyBirthdayMusic();

        // Trigger Pop-Up Burst of Balloons & Love Hearts!
        if (typeof window.triggerBalloonAndLoveBurst === 'function') {
            const rect = btnOpenEnvelope.getBoundingClientRect();
            const clickX = e.clientX || (rect.left + rect.width / 2);
            const clickY = e.clientY || rect.top;
            window.triggerBalloonAndLoveBurst(clickX, clickY);
        }

        isEnvelopeOpened = true;
        btnOpenEnvelope.style.visibility = 'hidden';
        btnOpenEnvelope.style.opacity = '0';
        btnOpenEnvelope.style.pointerEvents = 'none';
        
        // Helper function for typing animation
        function startTypingEffect(element, textToType, speed = 90) {
            if (!element) return;
            element.innerHTML = '<span class="typing-cursor">|</span>';
            let i = 0;
            const timer = setInterval(() => {
                if (i < textToType.length) {
                    element.innerHTML = textToType.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
                    i++;
                } else {
                    clearInterval(timer);
                    element.innerHTML = textToType;
                }
            }, speed);
        }

        const envelopeHeader = document.querySelector('.envelope-header');

        // GSAP Timeline for Envelope
        const tl = gsap.timeline({
            onComplete: () => {
                // Wait briefly then go to next scene
                setTimeout(() => goToScene(1), 600);
            }
        });

        // 0. Header text smoothly moves up & fades out to clear space for opening flap & letter
        if (envelopeHeader) {
            tl.to(envelopeHeader, {
                y: -60,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut"
            }, 0);
        }

        // 1. Envelope stands up
        tl.to(envelopeWrapper, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "power2.inOut"
        }, 0)
        // 2. Seal fades out
        .to(seal, {
            opacity: 0,
            duration: 0.3
        }, 0.2)
        // 3. Flap opens backward & start typing text
        .to(flap, {
            rotationX: 180,
            z: 3,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function() {
                const prog = this.progress();
                flap.style.filter = `drop-shadow(0 ${5 - (10 * prog)}px 8px rgba(0,0,0,0.1))`;
            }
        }, 0.2)
        .add(() => {
            const letterTextEl = document.getElementById('letter-peek-text');
            startTypingEffect(letterTextEl, 'For Chiquita', 85);
        }, 0.4)
        // 4. Letter slides up and pops forward
        .to(letter, {
            y: -70,
            z: 5,
            rotationX: -5,
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            duration: 1,
            ease: "back.out(1.2)"
        }, 0.6);
    });


    // --- 2. Candle Blow Interaction ---
    const cake = document.querySelector('.cake');
    const btnEnableMic = document.getElementById('btn-enable-mic');
    let audioContext;
    let microphone;
    let analyser;

    const btnBlowCandles = document.getElementById('btn-blow-candles');

    function createSmokeParticles() {
        const wicks = document.querySelectorAll('.wick');
        wicks.forEach(wick => {
            for (let i = 0; i < 2; i++) {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-particle';
                smoke.style.animationDelay = `${i * 0.15}s`;
                wick.appendChild(smoke);
                setTimeout(() => smoke.remove(), 1600);
            }
        });
    }

    const btnCutCake = document.getElementById('btn-cut-cake');
    const cakeKnife = document.getElementById('cake-knife');
    const cutSeam = document.getElementById('cut-seam');
    const cakeSliceItem = document.getElementById('cake-slice-item');
    const blowIndicator = document.getElementById('blow-indicator');

    function revealCutCakeButton() {
        // Hide blow button & mic indicator
        if (btnBlowCandles) {
            btnBlowCandles.style.display = 'none';
        }
        if (blowIndicator) {
            blowIndicator.style.display = 'none';
        }

        // Hide countdown box ("Waktu yang ditunggu telah tiba!!") on potong kue page
        const countdownContainer = document.getElementById('countdown-container');
        if (countdownContainer) {
            if (typeof gsap !== 'undefined') {
                gsap.to(countdownContainer, {
                    opacity: 0,
                    y: 20,
                    duration: 0.4,
                    onComplete: () => {
                        countdownContainer.style.display = 'none';
                    }
                });
            } else {
                countdownContainer.style.display = 'none';
            }
        }

        // Show Potong Kue button
        if (btnCutCake) {
            btnCutCake.classList.remove('hidden');
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btnCutCake, 
                    { scale: 0, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
                );
            }
        }
    }

    function extinguishCandle() {
        const flames = document.querySelectorAll('.flame');
        if (flames.length === 0) return;
        
        if (cake.dataset.extinguished === 'true') return;
        cake.dataset.extinguished = 'true';

        if (typeof gsap !== 'undefined') {
            gsap.to(flames, {
                rotation: -35,
                skewX: -20,
                scaleX: 1.3,
                duration: 0.2,
                ease: "power1.out",
                onComplete: () => {
                    createSmokeParticles();
                    gsap.to(flames, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.35,
                        stagger: 0.08,
                        ease: "back.in(2)",
                        onComplete: () => {
                            setTimeout(revealCutCakeButton, 300);
                        }
                    });
                }
            });
        } else {
            createSmokeParticles();
            flames.forEach(f => f.classList.add('extinguished'));
            setTimeout(revealCutCakeButton, 500);
        }
        
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
    }

    // Cut Cake Button Interaction (Splitting Cake Body Animation)
    btnCutCake?.addEventListener('click', () => {
        btnCutCake.disabled = true;

        const cakeKnife = document.getElementById('cake-knife');
        const cutSeam = document.getElementById('cut-seam');
        const cakeWhole = document.getElementById('cake-whole');
        const cakeCandles = document.getElementById('cake-candles');
        const cakeBodyContainer = document.getElementById('cake-body-container');
        const cakeHalfLeft = document.getElementById('cake-half-left');
        const cakeHalfRight = document.getElementById('cake-half-right');
        const cutWallLeft = document.getElementById('cut-wall-left');
        const cutWallRight = document.getElementById('cut-wall-right');
        const cakeSliceAssembly = document.getElementById('cake-slice-assembly');

        if (typeof gsap !== 'undefined') {
            const tlCut = gsap.timeline({
                onComplete: () => {
                    // Confetti burst on cake cut!
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 80,
                            spread: 90,
                            origin: { y: 0.6 },
                            colors: ['#f8a6c1', '#ffd54f', '#64b5f6', '#ffffff', '#ff80ab']
                        });
                    }
                    // Advance to Scene 3 (Happy Birthday)
                    setTimeout(() => goToScene(2), 1500);
                }
            });

            // 1. Knife lowers and slices straight down through the center of cake body
            tlCut.fromTo(cakeKnife, 
                { opacity: 0, y: -45, rotation: 25 },
                { opacity: 1, y: 35, rotation: 0, duration: 0.5, ease: "power2.in" }
            )
            // 2. Cut seam appears down through center
            .to(cutSeam, {
                height: 110,
                duration: 0.35,
                ease: "power1.inOut"
            }, "-=0.2")
            // 3. Switch from seamless whole cake & top candles to splitting body halves with attached candles
            .add(() => {
                if (cakeWhole) cakeWhole.classList.add('hidden');
                if (cakeCandles) cakeCandles.classList.add('hidden');
                if (cakeBodyContainer) cakeBodyContainer.classList.remove('hidden');
                if (cutWallLeft) cutWallLeft.classList.add('visible');
                if (cutWallRight) cutWallRight.classList.add('visible');
            })
            // 4. Cake body halves AND attached candles physically split open left and right!
            .fromTo(cakeHalfLeft, 
                { x: 0, rotation: 0 },
                { x: -10, rotation: -1.5, duration: 0.7, ease: "back.out(1.4)" }
            )
            .fromTo(cakeHalfRight, 
                { x: 0, rotation: 0 },
                { x: 10, rotation: 1.5, duration: 0.7, ease: "back.out(1.4)" },
                "-=0.7"
            )
            // 5. Knife lifts away smoothly
            .to(cakeKnife, {
                y: -35,
                opacity: 0,
                rotation: -15,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.4")
            // 6. Lifted cake slice assembly (porcelain plate + slice + cherry + crumbs) glides out to the right!
            .fromTo(cakeSliceAssembly,
                { opacity: 0, x: "-50%", y: 0, rotation: 0 },
                { opacity: 1, x: "75px", y: -15, rotation: 10, duration: 0.8, ease: "back.out(1.4)" },
                "-=0.5"
            );
        } else {
            if (cakeWhole) cakeWhole.classList.add('hidden');
            if (cakeCandles) cakeCandles.classList.add('hidden');
            if (cakeBodyContainer) cakeBodyContainer.classList.remove('hidden');
            if (cutSeam) cutSeam.style.height = '110px';
            if (cutWallLeft) cutWallLeft.classList.add('visible');
            if (cutWallRight) cutWallRight.classList.add('visible');
            if (cakeHalfLeft) cakeHalfLeft.style.transform = 'translateX(-10px) rotate(-1.5deg)';
            if (cakeHalfRight) cakeHalfRight.style.transform = 'translateX(10px) rotate(1.5deg)';
            if (cakeSliceAssembly) {
                cakeSliceAssembly.style.opacity = '1';
                cakeSliceAssembly.style.transform = 'translate(75px, -15px) rotate(10deg)';
            }
            setTimeout(() => goToScene(2), 1500);
        }
    });

    // Floating blow button click
    btnBlowCandles?.addEventListener('click', () => {
        extinguishCandle();
    });

    // Tap cake to extinguish
    cake?.addEventListener('click', () => {
        extinguishCandle();
    });

    // Mic to extinguish (Stretch Goal)
    btnEnableMic?.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            
            microphone.connect(analyser);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            btnEnableMic.innerText = 'Mendengarkan... Tiup!';
            btnEnableMic.disabled = true;

            function checkBlow() {
                if (cake.dataset.extinguished === 'true') return;
                
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                let highFreqSum = 0;
                for(let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                    if (i > bufferLength * 0.3) {
                        highFreqSum += dataArray[i];
                    }
                }
                const average = sum / bufferLength;
                const highFreqAverage = highFreqSum / (bufferLength * 0.7);

                // Sensitive threshold (40) suitable for earphone Mics, Bluetooth headsets, and mobile Mics
                if (average > 40 || highFreqAverage > 45) {
                    extinguishCandle();
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }
            
            checkBlow();
        } catch (err) {
            console.error('Mic access denied or error:', err);
            btnEnableMic.innerText = 'Gagal akses Mic (Tap kue saja)';
        }
    });


    // --- 3. Music Player & Dual Track Controller ---
    const bgMusic = document.getElementById('bgMusic');          // Track 1: Happy Birthday
    const audioRemaja = document.getElementById('audioRemaja');  // Track 2: HIVI! - Remaja
    
    const floatingWidget = document.getElementById('floating-music-widget');
    const widgetSongTitle = document.getElementById('widget-song-title');
    const btnFloatingToggle = document.getElementById('btn-floating-toggle');
    const floatingPlayIcon = document.getElementById('floating-play-icon');

    const btnTogglePlay = document.getElementById('btn-toggle-play');
    const vinyl = document.getElementById('vinyl-record');
    const soundWave = document.getElementById('sound-wave');
    const btnNextMusic = document.getElementById('btn-next-music');

    let currentTrack = 'birthday'; // 'birthday' or 'remaja'

    let vinylTween;
    if (typeof gsap !== 'undefined' && vinyl) {
        vinylTween = gsap.to(vinyl, {
            rotation: 360,
            duration: 4,
            repeat: -1,
            ease: "none",
            paused: true
        });
    }

    function getActiveAudio() {
        return currentTrack === 'birthday' ? bgMusic : audioRemaja;
    }

    function updateAudioUI() {
        const activeAudio = getActiveAudio();
        const isPlaying = activeAudio && !activeAudio.paused;

        // Floating widget sync
        if (floatingWidget) {
            if (isPlaying) {
                floatingWidget.classList.add('playing');
                if (floatingPlayIcon) floatingPlayIcon.innerText = '⏸️';
            } else {
                floatingWidget.classList.remove('playing');
                if (floatingPlayIcon) floatingPlayIcon.innerText = '▶️';
            }
        }

        // Scene 4 vinyl & controls sync
        if (isPlaying) {
            vinyl?.classList.add('playing');
            soundWave?.classList.add('playing');
            if (vinylTween) vinylTween.play();
            if (btnTogglePlay) btnTogglePlay.innerText = 'Pause';
        } else {
            vinyl?.classList.remove('playing');
            soundWave?.classList.remove('playing');
            if (vinylTween) vinylTween.pause();
            if (btnTogglePlay) btnTogglePlay.innerText = 'Play';
        }
    }

    function playHappyBirthdayMusic() {
        currentTrack = 'birthday';
        
        if (audioRemaja) {
            audioRemaja.pause();
        }

        if (floatingWidget) {
            floatingWidget.classList.remove('hidden');
        }
        if (widgetSongTitle) {
            widgetSongTitle.innerText = 'Happy Birthday';
        }

        if (bgMusic) {
            bgMusic.play().then(() => {
                updateAudioUI();
            }).catch(e => {
                console.log('Autoplay prevented:', e);
                updateAudioUI();
            });
        }
    }

    window.switchToRemajaSong = function() {
        currentTrack = 'remaja';

        // Stop Happy Birthday
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }

        // Show floating widget and update title
        if (floatingWidget) {
            floatingWidget.classList.remove('hidden');
        }
        if (widgetSongTitle) {
            widgetSongTitle.innerText = 'HIVI! - Remaja';
        }

        // Play HIVI! - Remaja
        if (audioRemaja) {
            audioRemaja.play().then(() => {
                updateAudioUI();
            }).catch(e => {
                console.log('Autoplay prevented for Remaja:', e);
                updateAudioUI();
            });
        }
    };

    function toggleActiveAudio() {
        const activeAudio = getActiveAudio();
        if (!activeAudio) return;

        if (activeAudio.paused) {
            activeAudio.play().then(() => updateAudioUI()).catch(e => updateAudioUI());
        } else {
            activeAudio.pause();
            updateAudioUI();
        }
    }

    btnFloatingToggle?.addEventListener('click', toggleActiveAudio);
    btnTogglePlay?.addEventListener('click', toggleActiveAudio);

    bgMusic?.addEventListener('play', updateAudioUI);
    bgMusic?.addEventListener('pause', updateAudioUI);
    audioRemaja?.addEventListener('play', updateAudioUI);
    audioRemaja?.addEventListener('pause', updateAudioUI);


    // --- 4. Gallery & Scrapbook Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    document.addEventListener('click', (e) => {
        const targetCard = e.target.closest('.hanging-polaroid, .scrapbook-photo');
        if (!targetCard) return;

        // Ignore clicks directly on close button or lightbox itself
        if (e.target.closest('#lightbox')) return;

        if (lightbox) {
            lightbox.classList.remove('hidden');
            
            // Get caption from polaroid or scrapbook
            const captionEl = targetCard.querySelector('.polaroid-caption, .scrapbook-caption');
            const lbCaption = document.getElementById('lightbox-caption');
            if (lbCaption) {
                lbCaption.innerText = targetCard.dataset.caption || (captionEl ? captionEl.innerText : '');
            }

            // Get actual photo image (specifically target photo image, NEVER the clip image)
            const imgEl = targetCard.querySelector('.polaroid-img, .scrapbook-img') || targetCard.querySelector('img.polaroid-img');
            const lbImgPlaceholder = document.getElementById('lightbox-img');
            if (imgEl && lbImgPlaceholder) {
                lbImgPlaceholder.innerHTML = `<img src="${imgEl.src}" class="lightbox-img">`;
            }
        }
    });

    closeLightbox?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lightbox) {
            lightbox.classList.add('hidden');
        }
    });
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });

    // --- 5. Custom Bouquet Flower Cursor Setup ---
    function setupAutoCustomCursor() {
        const cursorUrl = './assets/images/bucket_bunga_cursor_64.png';
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                cursor: url("${cursorUrl}") 32 32, auto !important;
            }
            button, a, .polaroid, .cake, .envelope-wrapper, .btn-primary, .btn-secondary, .btn-icon, .close-lightbox, .widget-play-btn {
                cursor: url("${cursorUrl}") 32 32, pointer !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAutoCustomCursor();

});

