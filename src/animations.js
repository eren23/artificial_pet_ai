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
            <g class="pet-body">
                <circle cx="50" cy="50" r="40" fill="var(--pet-color, #f0f0f0)"/>
                <circle cx="35" cy="40" r="8" fill="var(--pet-eye-color, #000)"/>
                <circle cx="65" cy="40" r="8" fill="var(--pet-eye-color, #000)"/>
                <path d="M 45 60 Q 50 65 55 60" stroke="var(--pet-mouth-color, #000)" fill="none" stroke-width="2"/>
                <path d="M 20 20 L 35 35" stroke="var(--pet-color, #f0f0f0)" stroke-width="4"/>
                <path d="M 80 20 L 65 35" stroke="var(--pet-color, #f0f0f0)" stroke-width="4"/>
            </g>
        </svg>`,
        animations: {
            idle: '@keyframes idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }',
            happy: '@keyframes happy { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }',
            sad: '@keyframes sad { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }',
            sleeping: '@keyframes sleeping { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }',
            eating: '@keyframes eating { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.9); } }',
            sick: '@keyframes sick { 0%, 100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } }'
        }
    },
    dog: {
        base: `<svg width="100" height="100" viewBox="0 0 100 100">
            <g class="pet-body">
                <circle cx="50" cy="50" r="40" fill="var(--pet-color, #f0f0f0)"/>
                <circle cx="35" cy="40" r="8" fill="var(--pet-eye-color, #000)"/>
                <circle cx="65" cy="40" r="8" fill="var(--pet-eye-color, #000)"/>
                <path d="M 40 60 Q 50 70 60 60" stroke="var(--pet-mouth-color, #000)" fill="none" stroke-width="2"/>
                <path d="M 30 20 Q 40 10 50 20" fill="var(--pet-color, #f0f0f0)"/>
                <path d="M 70 20 Q 60 10 50 20" fill="var(--pet-color, #f0f0f0)"/>
            </g>
        </svg>`,
        animations: {
            idle: '@keyframes idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }',
            happy: '@keyframes happy { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }',
            sad: '@keyframes sad { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.9); } }',
            sleeping: '@keyframes sleeping { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }',
            eating: '@keyframes eating { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.9); } }',
            sick: '@keyframes sick { 0%, 100% { filter: grayscale(0); } 50% { filter: grayscale(1); } }'
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
        this.customizations = {
            color: '#f0f0f0',
            eyeColor: '#000000',
            mouthColor: '#000000'
        };
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
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        const container = document.getElementById('petIcon');
        if (!container) return;

        switch (this.style) {
            case 'ascii':
                this.setupAsciiAnimation(container);
                break;
            case 'svg':
                this.setupSvgAnimation(container);
                break;
            case 'emoji':
                this.setupEmojiAnimation(container);
                break;
        }
    }

    setupAsciiAnimation(container) {
        container.style.fontFamily = 'monospace';
        container.style.whiteSpace = 'pre';
        
        const frames = ASCII_ANIMATIONS[this.type][this.currentState];
        this.currentFrame = 0;

        this.animationInterval = setInterval(() => {
            container.textContent = frames[this.currentFrame];
            this.currentFrame = (this.currentFrame + 1) % frames.length;
        }, 500);
    }

    setupSvgAnimation(container) {
        const template = SVG_TEMPLATES[this.type].base;
        const animation = SVG_TEMPLATES[this.type].animations[this.currentState];
        
        // Create style element for animations
        const style = document.createElement('style');
        style.textContent = animation;
        document.head.appendChild(style);

        // Apply SVG with customizations
        container.innerHTML = template;
        container.querySelector('.pet-body').style.animation = `${this.currentState} 1s infinite`;
        
        // Apply custom colors
        container.style.setProperty('--pet-color', this.customizations.color);
        container.style.setProperty('--pet-eye-color', this.customizations.eyeColor);
        container.style.setProperty('--pet-mouth-color', this.customizations.mouthColor);
    }

    setupEmojiAnimation(container) {
        // Fallback to original emoji system
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
        }
    }
}

module.exports = PetAnimator; 