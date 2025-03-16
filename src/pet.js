// Pet selection and creation functions
let selectedPetType = null;
let selectedStyle = 'emoji';

class Pet {
    constructor() {
        this.maxValue = 1.0;
        this.minValue = 0.0;
        this.devSpeedMultiplier = 1;
        this.animator = null;
        this.faces = {
            cat: {
                happy: '😺',
                neutral: '😸',
                sad: '😿',
                sick: '🙀',
                hungry: '😾',
                dirty: '🐱',
                dead: '💀'
            },
            dog: {
                happy: '🐶',
                neutral: '🐕',
                sad: '🐕',
                sick: '🤒',
                hungry: '🐕',
                dirty: '🦮',
                dead: '💀'
            }
        };
        
        // Set default state immediately
        this.setDefaultState();
        
        // Then try to load from database
        setTimeout(() => {
            this.init();
        }, 100);

        // Add animation cooldown
        this.isAnimating = false;
        this.deathCheckInterval = null;
    }

    async init() {
        this.isDev = window.isDev;
        console.log('Dev mode:', this.isDev);
        
        try {
            await this.loadState();
            if (!this.pet_type || !this.name) {
                document.getElementById('petSelection').style.display = 'flex';
                document.getElementById('petContainer').style.display = 'none';
            } else {
                this.showPetContainer();
            }
        } catch (error) {
            console.error('Failed to load state:', error);
            // Keep using default state
            document.getElementById('petSelection').style.display = 'flex';
            document.getElementById('petContainer').style.display = 'none';
        }
        
        this.startTimer();
        this.updateUI();
    }

    async loadState() {
        try {
            const state = await window.electron.ipcRenderer.invoke('load-state');
            if (state) {
                // Only set default state if we don't have a pet type and name
                if (!state.pet_type || !state.name) {
                    this.setDefaultState();
                    return;
                }

                this.pet_type = state.pet_type;
                this.name = state.name;
                this.happiness = state.happiness;
                this.hunger = state.hunger;
                this.cleanliness = state.cleanliness;
                this.health = state.health;
                this.death_time = state.death_time;
                
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

                // Check if pet was dead
                if (this.death_time) {
                    this.showDeathScreen();
                }
            } else {
                this.setDefaultState();
            }
        } catch (error) {
            console.error('Error loading state:', error);
            this.setDefaultState();
        }
    }

    setDefaultState() {
        this.pet_type = null;
        this.name = null;
        this.happiness = 0.5;
        this.hunger = 0.5;
        this.cleanliness = 1.0;
        this.health = 1.0;
        this.death_time = null;
    }

    setInitialStats() {
        this.happiness = 1.0;
        this.hunger = 0.0;
        this.cleanliness = 1.0;
        this.health = 1.0;
        this.death_time = null;
    }

    async saveState() {
        try {
            await window.electron.ipcRenderer.invoke('save-state', {
                pet_type: this.pet_type,
                name: this.name,
                happiness: this.happiness,
                hunger: this.hunger,
                cleanliness: this.cleanliness,
                health: this.health,
                death_time: this.death_time
            });
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    showPetContainer() {
        document.getElementById('petSelection').style.display = 'none';
        document.getElementById('petContainer').style.display = 'flex';
        document.getElementById('deathScreen').style.display = 'none';
        document.getElementById('petNameDisplay').textContent = this.name;
        this.startDeathCheck();
    }

    showDeathScreen() {
        document.getElementById('petSelection').style.display = 'none';
        document.getElementById('petContainer').style.display = 'none';
        document.getElementById('deathScreen').style.display = 'block';
        
        const timeOfDeath = new Date(this.death_time);
        document.getElementById('deathMessage').textContent = 
            `${this.name} lived a happy life until ${timeOfDeath.toLocaleString()}`;
        
        if (this.deathCheckInterval) {
            clearInterval(this.deathCheckInterval);
            this.deathCheckInterval = null;
        }
    }

    startDeathCheck() {
        if (this.deathCheckInterval) {
            clearInterval(this.deathCheckInterval);
        }

        const checkInterval = this.isDev ? 1000 : 10000; // Check every second in dev, every 10 seconds in prod
        const deathTime = this.isDev ? 10000 : 7200000; // 10 seconds in dev, 2 hours in prod

        this.deathCheckInterval = setInterval(() => {
            if (this.health <= 0) {
                if (!this.death_time) {
                    this.death_time = Date.now();
                    this.saveState();
                }
                
                const timeSinceDeath = Date.now() - this.death_time;
                if (timeSinceDeath >= deathTime) {
                    this.showDeathScreen();
                }
            } else if (this.death_time) {
                // Reset death time if health goes above 0
                this.death_time = null;
                this.saveState();
            }
        }, checkInterval);
    }

    async animate(animation) {
        if (this.isAnimating) return;
        
        const petIcon = document.getElementById('petIcon');
        this.isAnimating = true;
        
        petIcon.classList.add(animation);
        await new Promise(resolve => setTimeout(resolve, 500));
        petIcon.classList.remove(animation);
        
        this.isAnimating = false;
    }

    async feed() {
        if (this.death_time) return;
        await this.animate('bounce');
        this.hunger = Math.max(this.minValue, Math.min(this.maxValue, this.hunger - 0.3));
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
        this.saveState();
    }

    async pet() {
        if (this.death_time) return;
        await this.animate('pulse');
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.2));
        this.updateUI();
        this.saveState();
    }

    async clean() {
        if (this.death_time) return;
        await this.animate('shake');
        this.cleanliness = this.maxValue;
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
        this.saveState();
    }

    async wash() {
        if (this.death_time) return;
        await this.animate('spin');
        this.cleanliness = this.maxValue;
        this.health = Math.max(this.minValue, Math.min(this.maxValue, this.health + 0.2));
        this.happiness = Math.max(this.minValue, Math.min(this.maxValue, this.happiness + 0.1));
        this.updateUI();
        this.saveState();
    }

    startTimer() {
        const interval = this.isDev ? 2000 : 300000; // 2 seconds in dev, 5 minutes in prod
        setInterval(() => this.decreaseStats(true), interval);
    }

    decreaseStats(save = true) {
        if (this.death_time) return;

        // Reduce base decrease amount in dev mode
        const baseDecrease = this.isDev ? 0.05 : 0.1;
        const decrease = this.isDev ? (baseDecrease * this.devSpeedMultiplier) : baseDecrease;
        
        // Basic stats decrease over time
        this.happiness = Math.max(this.minValue, this.happiness - decrease);
        this.hunger = Math.min(this.maxValue, this.hunger + decrease);
        this.cleanliness = Math.max(this.minValue, this.cleanliness - decrease);
        
        // Health system that depends on other stats
        let healthChange = 0;
        
        // Health decreases when hunger is high (> 0.7)
        if (this.hunger > 0.7) {
            healthChange -= (this.hunger - 0.7) * decrease;
        }
        
        // Health decreases when cleanliness is low (< 0.3)
        if (this.cleanliness < 0.3) {
            healthChange -= (0.3 - this.cleanliness) * decrease;
        }
        
        // Health decreases when happiness is very low (< 0.2)
        if (this.happiness < 0.2) {
            healthChange -= (0.2 - this.happiness) * decrease * 0.5;
        }
        
        // Health slowly regenerates when all conditions are good
        if (this.hunger < 0.5 && this.cleanliness > 0.7 && this.happiness > 0.7) {
            healthChange += decrease * 0.25;
        }
        
        // Apply health change with limits
        this.health = Math.max(this.minValue, Math.min(this.maxValue, this.health + healthChange));
        
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
        if (!this.pet_type) return '❓';
        
        let state = 'idle';
        if (this.death_time) {
            state = 'dead';
        } else if (this.health < 0.3) {
            state = 'sick';
        } else if (this.hunger > 0.8) {
            state = 'eating';
        } else if (this.cleanliness < 0.3) {
            state = 'sad';
        } else if (this.happiness < 0.3) {
            state = 'sad';
        } else if (this.happiness > 0.7) {
            state = 'happy';
        }

        if (this.animator) {
            try {
                this.animator.setState(state);
                this.animator.updateAnimation();
            } catch (error) {
                console.error('Error updating pet state:', error);
                return '❓';
            }
        }
        return ''; // The animator will handle the display
    }

    updateUI() {
        // Ensure we have values before updating UI
        if (typeof this.happiness === 'undefined') {
            this.setDefaultState();
        }

        // Update progress bars
        const happinessBar = document.getElementById('happinessBar');
        const hungerBar = document.getElementById('hungerBar');
        const cleanlinessBar = document.getElementById('cleanlinessBar');
        const healthBar = document.getElementById('healthBar');

        happinessBar.style.width = `${this.happiness * 100}%`;
        hungerBar.style.width = `${(1 - this.hunger) * 100}%`;
        cleanlinessBar.style.width = `${this.cleanliness * 100}%`;
        healthBar.style.width = `${this.health * 100}%`;

        // Update pet face and animation
        const petIcon = document.getElementById('petIcon');
        this.getPetFace(); // This will update the animator state

        // Update icon class based on style
        petIcon.className = 'pet-icon';
        if (selectedStyle === 'emoji') {
            petIcon.classList.add('emoji-style');
        }

        // Update status effects
        if (this.death_time) {
            petIcon.style.filter = 'grayscale(1)';
        } else if (this.happiness < 0.3 || this.hunger > 0.8 || this.cleanliness < 0.2) {
            petIcon.style.filter = 'hue-rotate(180deg)';
        } else if (this.happiness < 0.6 || this.hunger > 0.6 || this.cleanliness < 0.5) {
            petIcon.style.filter = 'hue-rotate(90deg)';
        } else {
            petIcon.style.filter = 'none';
        }

        // Update progress bar colors
        happinessBar.style.background = `linear-gradient(90deg, 
            ${this.happiness > 0.5 ? '#4CAF50' : '#ff9800'}, 
            ${this.happiness > 0.7 ? '#45a049' : '#f57c00'})`;
        
        hungerBar.style.background = `linear-gradient(90deg, 
            ${this.hunger < 0.5 ? '#4CAF50' : '#ff9800'}, 
            ${this.hunger < 0.3 ? '#45a049' : '#f57c00'})`;
        
        cleanlinessBar.style.background = `linear-gradient(90deg, 
            ${this.cleanliness > 0.5 ? '#4CAF50' : '#ff9800'}, 
            ${this.cleanliness > 0.7 ? '#45a049' : '#f57c00'})`;
        
        healthBar.style.background = `linear-gradient(90deg, 
            ${this.health > 0.5 ? '#4CAF50' : '#ff9800'}, 
            ${this.health > 0.7 ? '#45a049' : '#f57c00'})`;

        // Update debug info if in dev mode
        if (this.isDev) {
            document.getElementById('debugInfo').textContent = 
                `Speed Multiplier: ${this.devSpeedMultiplier}x\n` +
                `Pet Type: ${this.pet_type}\n` +
                `Name: ${this.name}\n` +
                `Happiness: ${this.happiness.toFixed(2)}\n` +
                `Hunger: ${this.hunger.toFixed(2)}\n` +
                `Cleanliness: ${this.cleanliness.toFixed(2)}\n` +
                `Health: ${this.health.toFixed(2)}\n` +
                `Death Time: ${this.death_time ? new Date(this.death_time).toLocaleString() : 'N/A'}`;
        }
    }
}

// Create the pet instance
const pet = new Pet();

// Add click animation to pet icon when it exists
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('petIcon')?.addEventListener('click', () => {
        pet.pet();
    });
});

// Define the global functions
function selectPetType(type) {
    selectedPetType = type;
    document.querySelectorAll('.pet-option').forEach(option => {
        option.classList.remove('selected');
        if (option.querySelector('h3').textContent.toLowerCase() === type) {
            option.classList.add('selected');
        }
    });

    // Show customization options only for SVG style
    const customizationOptions = document.querySelector('.customization-options');
    customizationOptions.style.display = selectedStyle === 'svg' ? 'block' : 'none';
}

function createPet() {
    const nameInput = document.getElementById('petName');
    const name = nameInput.value.trim();
    
    if (!selectedPetType) {
        alert('Please select a pet type!');
        return;
    }
    
    if (!name) {
        alert('Please enter a name for your pet!');
        return;
    }
    
    pet.pet_type = selectedPetType;
    pet.name = name;
    
    // Create animator with selected style using the exposed PetAnimator factory
    const animator = window.PetAnimatorFactory.create(selectedPetType, selectedStyle);
    if (!animator) {
        console.error('Failed to create animator');
        return;
    }
    pet.animator = animator;
    
    // Apply customizations if using SVG style
    if (selectedStyle === 'svg') {
        try {
            pet.animator.setCustomizations({
                color: document.getElementById('petColor').value || '#f0f0f0',
                eyeColor: document.getElementById('eyeColor').value || '#000000',
                mouthColor: document.getElementById('mouthColor').value || '#000000'
            });
        } catch (error) {
            console.error('Error setting customizations:', error);
        }
    }
    
    // Initialize the animation
    try {
        pet.animator.setState('idle');
        pet.animator.updateAnimation();
    } catch (error) {
        console.error('Error initializing animation:', error);
    }
    
    pet.setInitialStats();
    pet.showPetContainer();
    pet.saveState();
}

function showPetSelection() {
    if (pet.animator) {
        pet.animator.cleanup();
    }
    pet.setDefaultState();
    selectedPetType = null;
    selectedStyle = 'emoji';
    document.getElementById('petName').value = '';
    document.querySelectorAll('.pet-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('input[name="animStyle"]').forEach(radio => {
        radio.checked = radio.value === 'emoji';
    });
    document.querySelector('.customization-options').style.display = 'none';
    document.getElementById('petSelection').style.display = 'flex';
    document.getElementById('deathScreen').style.display = 'none';
    document.getElementById('petContainer').style.display = 'none';
    pet.saveState();
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for animation style selection
    document.querySelectorAll('input[name="animStyle"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectedStyle = e.target.value;
            const customizationOptions = document.querySelector('.customization-options');
            customizationOptions.style.display = selectedStyle === 'svg' ? 'block' : 'none';
        });
    });
});

// Expose functions to window object
window.selectPetType = selectPetType;
window.createPet = createPet;
window.showPetSelection = showPetSelection; 