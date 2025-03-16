// Animation configurations for different pet types and styles
const ASCII_ANIMATIONS = {
    cat: {
        idle: [
            ` /\\___/\\\n(  o o  )\n(  =^=  )\n  --^--`,
            ` /\\___/\\\n(  o o  )\n(  =^=  )\n  --~--`
        ],
        happy: [
            ` /\\___/\\\n(  ^ω^  )\n(  =^=  )\n  --^--`,
            ` /\\___/\\\n(  ^ω^  )\n(  =^=  )\n  --~--`
        ],
        sad: [
            ` /\\___/\\\n(  ;_;  )\n(  =^=  )\n  --^--`,
            ` /\\___/\\\n(  ;_;  )\n(  =^=  )\n  --~--`
        ],
        sleeping: [
            ` /\\___/\\\n(  -_-  )\n(  =^=  )\n  --z--`,
            ` /\\___/\\\n(  -_-  )\n(  =^=  )\n  --Z--`
        ],
        eating: [
            ` /\\___/\\\n(  o_o  )\n(  =^=  )\n  nom!`,
            ` /\\___/\\\n(  o_o  )\n(  =^=  )\n  NOM!`
        ],
        sick: [
            ` /\\___/\\\n(  x_x  )\n(  =^=  )\n  --*--`,
            ` /\\___/\\\n(  x_x  )\n(  =^=  )\n  --+--`
        ]
    },
    dog: {
        idle: [
            `  /\\____/\\\n (  ʘωʘ  )\n  |    |\n   \\__/\n   /  \\\n`,
            `  /\\____/\\\n (  ʘωʘ  )\n  |    |\n   \\__/\n  /    \\`
        ],
        happy: [
            `  /\\____/\\\n (  ^ω^  )\n  |    |\n   \\__/\n  /  \\\n   wag!`,
            `  /\\____/\\\n (  ^ω^  )\n  |    |\n   \\__/\n  /    \\\n    WAG!`
        ],
        sad: [
            `  /\\____/\\\n (  ╥﹏╥ )\n  |    |\n   \\__/\n  /    \\`,
            `  /\\____/\\\n (  ╥﹏╥ )\n  |    |\n   \\__/\n /      \\`
        ],
        sleeping: [
            `  /\\____/\\\n (  -_-  )\n  |    |\n   \\__/\n   zzz`,
            `  /\\____/\\\n (  -_-  )\n  |    |\n   \\__/\n    ZZZ`
        ],
        eating: [
            `  /\\____/\\\n (  ◕ω◕  )\n  |    |\n   \\__/\n   nom!`,
            `  /\\____/\\\n (  ◕ω◕  )\n  |    |\n   \\__/\n   NOM!`
        ],
        sick: [
            `  /\\____/\\\n (  ×_×  )\n  |    |\n   \\__/\n   *cough*`,
            `  /\\____/\\\n (  ×_×  )\n  |    |\n   \\__/\n   *wheeze*`
        ]
    }
};

const SVG_TEMPLATES = {
    cat: {
        base: `<svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="bodyGradient">
                    <stop offset="0%" stop-color="var(--pet-color-light, #ffffff)" />
                    <stop offset="100%" stop-color="var(--pet-color, #f0f0f0)" />
                </radialGradient>
                <radialGradient id="noseGradient">
                    <stop offset="0%" stop-color="var(--nose-color-light, #ffb3b3)" />
                    <stop offset="100%" stop-color="var(--nose-color, #ff9999)" />
                </radialGradient>
                <filter id="softShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <pattern id="furPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="var(--pattern-color)" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            <g class="pet-body" filter="url(#softShadow)">
                <!-- Body -->
                <ellipse cx="50" cy="60" rx="35" ry="30" fill="url(#bodyGradient)" />
                <circle cx="50" cy="40" r="25" fill="url(#bodyGradient)" />
                
                <!-- Fur Pattern -->
                <ellipse cx="50" cy="60" rx="35" ry="30" fill="url(#furPattern)" />
                <circle cx="50" cy="40" r="25" fill="url(#furPattern)" />
                
                <!-- Ears -->
                <g class="ears">
                    <path class="ear left-ear" d="M 30 20 L 40 35 L 25 35 Z" fill="var(--pet-color)" />
                    <path class="ear right-ear" d="M 70 20 L 75 35 L 60 35 Z" fill="var(--pet-color)" />
                    <path class="inner-ear" d="M 32 23 L 38 33 L 28 33 Z" fill="var(--inner-ear-color)" opacity="0.5" />
                    <path class="inner-ear" d="M 68 23 L 72 33 L 62 33 Z" fill="var(--inner-ear-color)" opacity="0.5" />
                </g>
                
                <!-- Face -->
                <g class="face">
                    <!-- Eyes -->
                    <g class="eyes">
                        <ellipse class="eye" cx="40" cy="40" rx="4" ry="var(--eye-height, 4)" fill="var(--pet-eye-color)" />
                        <ellipse class="eye" cx="60" cy="40" rx="4" ry="var(--eye-height, 4)" fill="var(--pet-eye-color)" />
                        <circle class="eye-shine" cx="38" cy="38" r="1.5" fill="#fff" />
                        <circle class="eye-shine" cx="58" cy="38" r="1.5" fill="#fff" />
                    </g>
                    
                    <!-- Nose -->
                    <path class="nose" d="M 48 45 L 52 45 L 50 48 Z" fill="url(#noseGradient)" />
                    
                    <!-- Mouth -->
                    <path class="mouth" d="M 45 50 Q 50 53 55 50" stroke="var(--pet-mouth-color)" fill="none" stroke-width="1.5" stroke-linecap="round" />
                    
                    <!-- Whiskers -->
                    <g class="whiskers" stroke="var(--whisker-color)" stroke-width="0.5">
                        <line x1="30" y1="45" x2="15" y2="40" />
                        <line x1="30" y1="48" x2="15" y2="48" />
                        <line x1="30" y1="51" x2="15" y2="56" />
                        <line x1="70" y1="45" x2="85" y2="40" />
                        <line x1="70" y1="48" x2="85" y2="48" />
                        <line x1="70" y1="51" x2="85" y2="56" />
                    </g>
                </g>
                
                <!-- Tail -->
                <path class="tail" d="M 80 60 Q 90 50 85 40" stroke="var(--pet-color)" stroke-width="8" fill="none" stroke-linecap="round" />
            </g>
        </svg>`,
        animations: {
            idle: `
                @keyframes idle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes eyeBlink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                .pet-body { animation: idle 3s ease-in-out infinite; }
                .eyes { animation: eyeBlink 4s infinite; }
            `,
            happy: `
                @keyframes happy {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-5deg); }
                    75% { transform: scale(1.1) rotate(5deg); }
                }
                @keyframes eyeHappy {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.7); }
                }
                .pet-body { animation: happy 1s infinite; }
                .eyes { animation: eyeHappy 1s infinite; }
                .mouth { d: path('M 45 60 Q 50 55 55 60'); }
            `,
            sad: `
                @keyframes sad {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(2px) rotate(-1deg); }
                    75% { transform: translateY(2px) rotate(1deg); }
                }
                .pet-body { animation: sad 2s infinite; }
                .mouth { d: path('M 45 65 Q 50 70 55 65'); }
            `,
            sleeping: `
                @keyframes sleeping {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                @keyframes snore {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1); }
                }
                .pet-body { animation: sleeping 2s infinite; }
                .eyes { transform: scaleY(0.1); }
                .mouth { d: path('M 45 60 Q 50 58 55 60'); }
            `,
            eating: `
                @keyframes eating {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                @keyframes mouthEat {
                    0%, 100% { d: path('M 45 60 Q 50 65 55 60'); }
                    50% { d: path('M 45 60 Q 50 62 55 60'); }
                }
                .pet-body { animation: eating 0.5s infinite; }
                .mouth { animation: mouthEat 0.5s infinite; }
            `,
            sick: `
                @keyframes sick {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-2px, 2px) rotate(-2deg); }
                    75% { transform: translate(2px, 2px) rotate(2deg); }
                }
                .pet-body {
                    animation: sick 2s infinite;
                    filter: hue-rotate(180deg);
                }
                .mouth { d: path('M 45 65 Q 50 70 55 65'); }
            `
        }
    },
    dog: {
        base: `<svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="bodyGradient">
                    <stop offset="0%" stop-color="var(--pet-color-light, #ffffff)" />
                    <stop offset="100%" stop-color="var(--pet-color, #f0f0f0)" />
                </radialGradient>
                <radialGradient id="noseGradient">
                    <stop offset="0%" stop-color="var(--nose-color-light, #333333)" />
                    <stop offset="100%" stop-color="var(--nose-color, #000000)" />
                </radialGradient>
                <filter id="softShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <pattern id="furPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="var(--pattern-color)" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            <g class="pet-body" filter="url(#softShadow)">
                <!-- Body -->
                <ellipse cx="50" cy="65" rx="35" ry="25" fill="url(#bodyGradient)" />
                <circle cx="50" cy="45" r="30" fill="url(#bodyGradient)" />
                
                <!-- Fur Pattern -->
                <ellipse cx="50" cy="65" rx="35" ry="25" fill="url(#furPattern)" />
                <circle cx="50" cy="45" r="30" fill="url(#furPattern)" />
                
                <!-- Ears -->
                <g class="ears">
                    <path class="ear left-ear" d="M 25 25 Q 20 15 30 10 Q 40 5 35 25" fill="var(--pet-color)" />
                    <path class="ear right-ear" d="M 75 25 Q 80 15 70 10 Q 60 5 65 25" fill="var(--pet-color)" />
                    <path class="inner-ear" d="M 28 22 Q 25 15 32 12" fill="var(--inner-ear-color)" opacity="0.5" />
                    <path class="inner-ear" d="M 72 22 Q 75 15 68 12" fill="var(--inner-ear-color)" opacity="0.5" />
                </g>
                
                <!-- Face -->
                <g class="face">
                    <!-- Eyes -->
                    <g class="eyes">
                        <ellipse class="eye" cx="40" cy="40" rx="4" ry="var(--eye-height, 4)" fill="var(--pet-eye-color)" />
                        <ellipse class="eye" cx="60" cy="40" rx="4" ry="var(--eye-height, 4)" fill="var(--pet-eye-color)" />
                        <circle class="eye-shine" cx="38" cy="38" r="1.5" fill="#fff" />
                        <circle class="eye-shine" cx="58" cy="38" r="1.5" fill="#fff" />
                    </g>
                    
                    <!-- Nose -->
                    <ellipse class="nose" cx="50" cy="48" rx="6" ry="4" fill="url(#noseGradient)" />
                    
                    <!-- Mouth -->
                    <path class="mouth" d="M 40 55 Q 50 60 60 55" stroke="var(--pet-mouth-color)" fill="none" stroke-width="1.5" stroke-linecap="round" />
                    
                    <!-- Spots (optional) -->
                    <g class="spots" fill="var(--spot-color)" opacity="0.3">
                        <circle cx="30" cy="60" r="8" />
                        <circle cx="70" cy="65" r="6" />
                    </g>
                </g>
                
                <!-- Tail -->
                <path class="tail" d="M 80 60 Q 90 55 85 45" stroke="var(--pet-color)" stroke-width="8" fill="none" stroke-linecap="round" />
            </g>
        </svg>`,
        animations: {
            idle: `
                @keyframes idle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes tailWag {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(10deg); }
                }
                @keyframes eyeBlink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                .pet-body { animation: idle 3s ease-in-out infinite; }
                .tail { animation: tailWag 2s infinite; }
                .eyes { animation: eyeBlink 4s infinite; }
            `,
            happy: `
                @keyframes happy {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-5deg); }
                    75% { transform: scale(1.1) rotate(5deg); }
                }
                @keyframes tailHappy {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(30deg); }
                }
                .pet-body { animation: happy 1s infinite; }
                .tail { animation: tailHappy 0.5s infinite; }
                .mouth { d: path('M 40 60 Q 50 55 60 60'); }
            `,
            sad: `
                @keyframes sad {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(2px) rotate(-1deg); }
                    75% { transform: translateY(2px) rotate(1deg); }
                }
                @keyframes tailSad {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-10deg); }
                }
                .pet-body { animation: sad 2s infinite; }
                .tail { animation: tailSad 2s infinite; }
                .mouth { d: path('M 40 65 Q 50 70 60 65'); }
            `,
            sleeping: `
                @keyframes sleeping {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                .pet-body { animation: sleeping 2s infinite; }
                .eyes { transform: scaleY(0.1); }
                .mouth { d: path('M 40 60 Q 50 58 60 60'); }
                .tail { transform: rotate(-10deg); }
            `,
            eating: `
                @keyframes eating {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                @keyframes mouthEat {
                    0%, 100% { d: path('M 40 60 Q 50 65 60 60'); }
                    50% { d: path('M 40 60 Q 50 62 60 60'); }
                }
                @keyframes tailEat {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(5deg); }
                }
                .pet-body { animation: eating 0.5s infinite; }
                .mouth { animation: mouthEat 0.5s infinite; }
                .tail { animation: tailEat 1s infinite; }
            `,
            sick: `
                @keyframes sick {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-2px, 2px) rotate(-2deg); }
                    75% { transform: translate(2px, 2px) rotate(2deg); }
                }
                .pet-body {
                    animation: sick 2s infinite;
                    filter: hue-rotate(180deg);
                }
                .mouth { d: path('M 40 65 Q 50 70 60 65'); }
                .tail { transform: rotate(-20deg); }
            `
        }
    }
};

class PetAnimator {
    constructor(type, style = 'emoji') {
        this.type = type;
        this.style = style;
        this.currentFrame = 0;
        this.animationInterval = null;
        this.currentState = 'idle';
        this.container = null;
        this.customizations = {
            color: '#f0f0f0',
            eyeColor: '#000000',
            mouthColor: '#000000',
            noseColor: this.type === 'cat' ? '#ff9999' : '#000000',
            innerEarColor: '#ffcccc',
            whiskerColor: '#cccccc',
            patternColor: '#666666',
            eyeShape: 'round',
            patternStyle: 'none',
            patternOpacity: 0.3
        };
    }

    setContainer(container) {
        this.container = container;
        if (this.container) {
            // Set appropriate class for the container
            this.container.className = `pet-icon ${this.style}-style`;
        }
        this.updateAnimation();
    }

    setStyle(style) {
        this.style = style;
        if (this.container) {
            this.container.className = `pet-icon ${this.style}-style`;
        }
        this.updateAnimation();
    }

    setCustomizations(customizations) {
        this.customizations = { ...this.customizations, ...customizations };
        
        // Update CSS variables
        if (this.container && this.style === 'svg') {
            this.container.style.setProperty('--pet-color', this.customizations.color);
            this.container.style.setProperty('--pet-eye-color', this.customizations.eyeColor);
            this.container.style.setProperty('--pet-mouth-color', this.customizations.mouthColor);
            this.container.style.setProperty('--nose-color', this.customizations.noseColor);
            this.container.style.setProperty('--inner-ear-color', this.customizations.innerEarColor);
            this.container.style.setProperty('--whisker-color', this.customizations.whiskerColor);
            this.container.style.setProperty('--pattern-color', this.customizations.patternColor);
            
            // Update eye shape
            const eyes = this.container.querySelectorAll('.eye');
            if (eyes) {
                let eyeHeight = 4;
                switch (this.customizations.eyeShape) {
                    case 'almond':
                        eyeHeight = 3;
                        break;
                    case 'sleepy':
                        eyeHeight = 2;
                        break;
                }
                this.container.style.setProperty('--eye-height', eyeHeight);
            }

            // Update pattern
            const furPattern = this.container.querySelector('#furPattern');
            if (furPattern) {
                furPattern.style.opacity = this.customizations.patternOpacity;
                switch (this.customizations.patternStyle) {
                    case 'none':
                        furPattern.style.display = 'none';
                        break;
                    case 'stripes':
                        furPattern.style.display = 'block';
                        furPattern.innerHTML = `
                            <path d="M 0 0 L 4 4 M 4 0 L 0 4" 
                                stroke="var(--pattern-color)" 
                                stroke-width="0.5" 
                                opacity="${this.customizations.patternOpacity}"/>
                        `;
                        break;
                    case 'spots':
                        furPattern.style.display = 'block';
                        furPattern.innerHTML = `
                            <circle cx="2" cy="2" r="1" 
                                fill="var(--pattern-color)" 
                                opacity="${this.customizations.patternOpacity}"/>
                        `;
                        break;
                }
            }
        }
        
        this.updateAnimation();
    }

    setState(state) {
        this.currentState = state;
        this.updateAnimation();
    }

    updateAnimation() {
        if (!this.container) return;

        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        switch (this.style) {
            case 'ascii':
                this.setupAsciiAnimation(this.container);
                break;
            case 'svg':
                this.setupSvgAnimation(this.container);
                break;
            case 'emoji':
                this.setupEmojiAnimation(this.container);
                break;
        }
    }

    setupAsciiAnimation(container) {
        container.style.fontFamily = 'monospace';
        container.style.whiteSpace = 'pre';
        
        const frames = ASCII_ANIMATIONS[this.type][this.currentState];
        this.currentFrame = 0;

        container.textContent = frames[this.currentFrame];
        this.currentFrame = (this.currentFrame + 1) % frames.length;
    }

    setupSvgAnimation(container) {
        const template = SVG_TEMPLATES[this.type].base;
        const animation = SVG_TEMPLATES[this.type].animations[this.currentState];
        
        // Create style element for animations
        const styleId = `pet-style-${Math.random().toString(36).substr(2, 9)}`;
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.textContent = animation;

        // Apply SVG with customizations
        container.innerHTML = template;
        
        // Apply custom colors
        container.style.setProperty('--pet-color', this.customizations.color);
        container.style.setProperty('--pet-eye-color', this.customizations.eyeColor);
        container.style.setProperty('--pet-mouth-color', this.customizations.mouthColor);
        
        // Apply animation
        const body = container.querySelector('.pet-body');
        if (body) {
            body.style.animation = `${this.currentState} 1s infinite`;
        }
    }

    setupEmojiAnimation(container) {
        const faces = {
            cat: {
                idle: '😺',
                happy: '😸',
                sad: '😿',
                sleeping: '😴',
                eating: '😋',
                sick: '🤒'
            },
            dog: {
                idle: '🐶',
                happy: '🐕',
                sad: '🐕',
                sleeping: '😴',
                eating: '🐕',
                sick: '🤒'
            }
        };

        container.textContent = faces[this.type][this.currentState];
    }

    cleanup() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.container) {
            this.container.textContent = '';
            this.container = null;
        }
    }
}

module.exports = PetAnimator; 