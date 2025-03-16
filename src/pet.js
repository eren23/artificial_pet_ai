class Pet {
    constructor() {
        this.maxValue = 1.0;
        this.minValue = 0.0;
        this.devSpeedMultiplier = 1;
        this.faces = {
            happy: '😺',
            neutral: '😸',
            sad: '😿',
            sick: '🙀',
            hungry: '😾',
            dirty: '🐱'
        };
        
        // Set default state immediately
        this.setDefaultState();
        
        // Then try to load from database
        setTimeout(() => {
            this.init();
        }, 100);
    }

    async init() {
        this.isDev = window.isDev;
        console.log('Dev mode:', this.isDev);
        
        try {
            await this.loadState();
        } catch (error) {
            console.error('Failed to load state:', error);
            // Keep using default state
        }
        
        this.startTimer();
        this.updateUI();
    }

    async loadState() {
        try {
            const state = await window.electron.ipcRenderer.invoke('load-state');
            if (state) {
                this.happiness = state.happiness;
                this.hunger = state.hunger;
                this.cleanliness = state.cleanliness;
                this.health = state.health;
                
                // Calculate stat decreases since last save
                const timePassed = (Date.now() - state.last_updated) / 1000;
                const decreases = Math.floor(timePassed / (this.isDev ? 2 : 300));
                
                if (decreases > 0) {
                    const decrease = this.isDev ? (0.1 * this.devSpeedMultiplier) : 0.1;
                    const totalDecrease = decrease * decreases;
                    
                    this.happiness = Math.max(this.minValue, this.happiness - totalDecrease);
                    this.hunger = Math.min(this.maxValue, this.hunger + totalDecrease);
                    this.cleanliness = Math.max(this.minValue, this.cleanliness - totalDecrease);
                    this.health = Math.max(this.minValue, Math.min(this.maxValue, this.health - (totalDecrease * 0.5)));
                }
            }
        } catch (error) {
            console.error('Error loading state:', error);
            this.setDefaultState();
        }
    }

    setDefaultState() {
        this.happiness = 0.5;
        this.hunger = 0.5;
        this.cleanliness = 1.0;
        this.health = 1.0;
    }

    async saveState() {
        try {
            await window.electron.ipcRenderer.invoke('save-state', {
                happiness: this.happiness,
                hunger: this.hunger,
                cleanliness: this.cleanliness,
                health: this.health
            });
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    feed() {
        this.hunger = Math.max(this.minValue, Math.min(this.maxValue, this.hunger - 0.3));
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
    }

    pet() {
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.2));
        this.updateUI();
    }

    clean() {
        this.cleanliness = this.maxValue;
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
    }

    wash() {
        this.cleanliness = this.maxValue;
        this.health = Math.max(this.minValue, Math.min(this.maxValue, this.health + 0.2));
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
    }

    startTimer() {
        const interval = this.isDev ? 2000 : 300000; // 2 seconds in dev, 5 minutes in prod
        setInterval(() => this.decreaseStats(true), interval);
    }

    decreaseStats(save = true) {
        // Reduce base decrease amount in dev mode
        const baseDecrease = this.isDev ? 0.05 : 0.1;  // Changed from 0.2 to 0.05 in dev mode
        const decrease = this.isDev ? (baseDecrease * this.devSpeedMultiplier) : baseDecrease;
        
        this.happiness = Math.max(this.minValue, this.happiness - decrease);
        this.hunger = Math.min(this.maxValue, this.hunger + decrease);
        this.cleanliness = Math.max(this.minValue, this.cleanliness - decrease);
        this.health = Math.max(this.minValue, Math.min(this.maxValue, this.health - (decrease * 0.5)));
        
        if (save) {
            this.saveState();
        }
        this.updateUI();
    }

    setDevSpeed(multiplier) {
        if (this.isDev) {
            this.devSpeedMultiplier = multiplier;
        }
    }

    getPetFace() {
        if (this.health < 0.3) return this.faces.sick;
        if (this.hunger > 0.8) return this.faces.hungry;
        if (this.cleanliness < 0.3) return this.faces.dirty;
        if (this.happiness < 0.3) return this.faces.sad;
        if (this.happiness > 0.7) return this.faces.happy;
        return this.faces.neutral;
    }

    updateUI() {
        // Ensure we have values before updating UI
        if (typeof this.happiness === 'undefined') {
            this.setDefaultState();
        }

        document.getElementById('happinessBar').style.width = `${this.happiness * 100}%`;
        document.getElementById('hungerBar').style.width = `${(1 - this.hunger) * 100}%`;
        document.getElementById('cleanlinessBar').style.width = `${this.cleanliness * 100}%`;
        document.getElementById('healthBar').style.width = `${this.health * 100}%`;

        const petIcon = document.getElementById('petIcon');
        petIcon.textContent = this.getPetFace();

        if (this.happiness < 0.3 || this.hunger > 0.8 || this.cleanliness < 0.2) {
            petIcon.style.color = 'red';
        } else if (this.happiness < 0.6 || this.hunger > 0.6 || this.cleanliness < 0.5) {
            petIcon.style.color = 'orange';
        } else {
            petIcon.style.color = 'green';
        }

        // Update debug info if in dev mode
        if (this.isDev) {
            document.getElementById('debugInfo').textContent = 
                `Speed Multiplier: ${this.devSpeedMultiplier}x\n` +
                `Happiness: ${this.happiness.toFixed(2)}\n` +
                `Hunger: ${this.hunger.toFixed(2)}\n` +
                `Cleanliness: ${this.cleanliness.toFixed(2)}\n` +
                `Health: ${this.health.toFixed(2)}`;
        }
    }
}

const pet = new Pet(); 