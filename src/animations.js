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
            </defs>
            <g class="pet-body" filter="url(#softShadow)">
                <circle cx="50" cy="50" r="40" fill="url(#bodyGradient)" />
                <g class="eyes">
                    <circle cx="35" cy="40" r="8" fill="var(--pet-eye-color, #000)" />
                    <circle cx="65" cy="40" r="8" fill="var(--pet-eye-color, #000)" />
                    <circle class="eye-shine" cx="33" cy="38" r="3" fill="#fff" />
                    <circle class="eye-shine" cx="63" cy="38" r="3" fill="#fff" />
                </g>
                <path class="mouth" d="M 45 60 Q 50 65 55 60" stroke="var(--pet-mouth-color, #000)" fill="none" stroke-width="2" stroke-linecap="round" />
                <g class="ears">
                    <path d="M 20 20 L 35 35" stroke="var(--pet-color, #f0f0f0)" stroke-width="4" stroke-linecap="round" />
                    <path d="M 80 20 L 65 35" stroke="var(--pet-color, #f0f0f0)" stroke-width="4" stroke-linecap="round" />
                </g>
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
            </defs>
            <g class="pet-body" filter="url(#softShadow)">
                <circle cx="50" cy="50" r="40" fill="url(#bodyGradient)" />
                <g class="eyes">
                    <circle cx="35" cy="40" r="8" fill="var(--pet-eye-color, #000)" />
                    <circle cx="65" cy="40" r="8" fill="var(--pet-eye-color, #000)" />
                    <circle class="eye-shine" cx="33" cy="38" r="3" fill="#fff" />
                    <circle class="eye-shine" cx="63" cy="38" r="3" fill="#fff" />
                </g>
                <path class="mouth" d="M 40 60 Q 50 70 60 60" stroke="var(--pet-mouth-color, #000)" fill="none" stroke-width="2" stroke-linecap="round" />
                <g class="ears">
                    <path d="M 30 20 Q 40 10 50 20" fill="var(--pet-color, #f0f0f0)" />
                    <path d="M 70 20 Q 60 10 50 20" fill="var(--pet-color, #f0f0f0)" />
                </g>
                <g class="tail">
                    <path d="M 85 50 Q 95 45 90 40" stroke="var(--pet-color, #f0f0f0)" stroke-width="4" fill="none" stroke-linecap="round" />
                </g>
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
            mouthColor: '#000000'
        };
    }

    setContainer(container) {
        this.container = container;
        this.updateAnimation();
    }

    setStyle(style) {
        this.style = style;
        this.updateAnimation();
    }

    setCustomizations(customizations) {
        this.customizations = { ...this.customizations, ...customizations };
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