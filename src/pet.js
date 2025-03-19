// Pet selection and creation functions
let selectedPetType = null;
let selectedStyle = 'emoji';
let previewAnimator = null;

class Pet {
    constructor() {
        this.maxValue = 1.0;
        this.minValue = 0.0;
        this.devSpeedMultiplier = 1;
        this.animator = null;
        this.animationStyle = 'emoji';
        
        // Add more stats
        this.stats = {
            happiness: 0.5,
            hunger: 0.5,
            cleanliness: 1.0,
            health: 1.0,
            energy: 1.0,
            social: 0.5,
            exercise: 0.5
        };

        this.activities = {
            feed: {
                name: 'Feed',
                effects: {
                    hunger: 0.3,
                    happiness: +0.1,
                    energy: +0.2
                },
                animation: 'bounce'
            },
            pet: {
                name: 'Pet',
                effects: {
                    happiness: +0.2,
                    social: +0.2,
                    stress: -0.1
                },
                animation: 'pulse'
            },
            play: {
                name: 'Play',
                effects: {
                    happiness: +0.3,
                    energy: -0.2,
                    exercise: +0.3,
                    social: +0.2,
                    hunger: +0.1
                },
                animation: 'bounce'
            },
            clean: {
                name: 'Groom',
                effects: {
                    cleanliness: +0.4,
                    happiness: +0.1,
                    social: +0.1
                },
                animation: 'shake'
            },
            nap: {
                name: 'Nap',
                effects: {
                    energy: +0.5,
                    health: +0.1,
                    hunger: +0.2
                },
                animation: 'pulse'
            },
            exercise: {
                name: 'Exercise',
                effects: {
                    exercise: +0.3,
                    energy: -0.2,
                    health: +0.2,
                    hunger: +0.2,
                    cleanliness: -0.1
                },
                animation: 'shake'
            },
            care: {
                name: 'Care',
                effects: {
                    health: +0.3,
                    cleanliness: +0.2,
                    happiness: +0.2
                },
                animation: 'spin'
            }
        };
        
        // Set default state immediately
        this.setDefaultState();
        
        // Then try to load from database
        setTimeout(() => {
            this.init();
        }, 100);

        this.isAnimating = false;
        this.deathCheckInterval = null;

        // Add event listeners for quick actions
        if (window.electron) {
            window.electron.ipcRenderer.on('quick-action', (action) => {
                this.performActivity(action);
            });

            window.electron.ipcRenderer.on('request-status-update', () => {
                window.electron.ipcRenderer.send('status-update', this.stats);
            });
        }
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
                this.death_time = state.death_time;
                this.animationStyle = state.animation_style || 'emoji';
                this.customizations = state.customizations ? JSON.parse(state.customizations) : null;
                this.created_at = state.created_at;
                
                // Load all stats from saved state
                if (state.stats) {
                    Object.keys(this.stats).forEach(stat => {
                        if (typeof state.stats[stat] !== 'undefined') {
                            this.stats[stat] = state.stats[stat];
                        }
                    });
                }
                
                // Calculate stat decreases since last save
                const timePassed = (Date.now() - state.last_updated) / 1000;
                const decreases = Math.floor(timePassed / (this.isDev ? 2 : 300));
                
                if (decreases > 0) {
                    const decrease = this.isDev ? (0.1 * this.devSpeedMultiplier) : 0.1;
                    const totalDecrease = decrease * decreases;
                    
                    Object.keys(this.stats).forEach(stat => {
                        if (stat === 'hunger') {
                            this.stats[stat] = Math.min(this.maxValue, this.stats[stat] + totalDecrease);
                        } else {
                            this.stats[stat] = Math.max(this.minValue, this.stats[stat] - totalDecrease);
                        }
                    });
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
        Object.keys(this.stats).forEach(stat => {
            this.stats[stat] = stat === 'cleanliness' || stat === 'health' ? 1.0 : 0.5;
        });
        this.death_time = null;
    }

    setInitialStats() {
        Object.keys(this.stats).forEach(stat => {
            this.stats[stat] = 1.0;
        });
        this.death_time = null;
    }

    async saveState() {
        try {
            await window.electron.ipcRenderer.invoke('save-state', {
                pet_type: this.pet_type,
                name: this.name,
                stats: { ...this.stats },  // Create a copy of stats
                death_time: this.death_time,
                animation_style: this.animationStyle,
                customizations: this.customizations ? JSON.stringify(this.customizations) : null,
                created_at: this.created_at
            });
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    showPetContainer() {
        document.getElementById('petSelection').style.display = 'none';
        document.getElementById('petContainer').style.display = 'flex';
        document.getElementById('deathScreen').style.display = 'none';
        
        // Create animator with saved style
        if (this.pet_type) {
            const petIcon = document.getElementById('petIcon');
            petIcon.textContent = ''; // Clear any existing content
            petIcon.className = `pet-icon ${this.animationStyle}-style`;
            
            this.animator = window.PetAnimatorFactory.create(this.pet_type, this.animationStyle);
            if (this.animator) {
                this.animator.setContainer(petIcon);
                if (this.animationStyle === 'svg' && this.customizations) {
                    this.animator.setCustomizations(this.customizations);
                }
            }
        }
        
        this.updateUI();
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

        // Dev mode: check every second, die after 20 seconds
        // Prod mode: check every minute, die after 1 day (86400000ms)
        const checkInterval = this.isDev ? 1000 : 60000;
        const deathTime = this.isDev ? 20000 : 86400000;

        this.deathCheckInterval = setInterval(() => {
            if (this.stats.health <= 0) {
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

    async performActivity(activityName) {
        if (this.death_time || this.isAnimating) return;

        const activity = this.activities[activityName];
        if (!activity) return;

        // Perform animation
        await this.animate(activity.animation);

        // Apply effects
        Object.entries(activity.effects).forEach(([stat, change]) => {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] = Math.max(this.minValue, Math.min(this.maxValue, this.stats[stat] + change));
            }
        });

        this.updateUI();
        this.saveState();
    }

    startTimer() {
        // Dev mode: 2 seconds
        // Prod mode: 15 minutes (900000ms) - 50 times slower than current 5 minutes
        const interval = this.isDev ? 2000 : 900000;
        setInterval(() => this.decreaseStats(true), interval);
    }

    decreaseStats(save = true) {
        if (this.death_time) return;

        // Dev mode: 0.05 base decrease
        // Prod mode: 0.002 base decrease (50 times smaller than current 0.1)
        const baseDecrease = this.isDev ? 0.05 : 0.002;
        const decrease = this.isDev ? (baseDecrease * this.devSpeedMultiplier) : baseDecrease;
        
        // Basic stats decrease
        this.stats.happiness = Math.max(this.minValue, this.stats.happiness - decrease);
        this.stats.hunger = Math.max(this.minValue, this.stats.hunger - decrease * 0.5);
        this.stats.cleanliness = Math.max(this.minValue, this.stats.cleanliness - decrease);
        this.stats.energy = Math.max(this.minValue, this.stats.energy - decrease * 0.5);
        this.stats.social = Math.max(this.minValue, this.stats.social - decrease);
        this.stats.exercise = Math.max(this.minValue, this.stats.exercise - decrease);
        
        // Complex health system - reworked
        let healthChange = 0;
        
        // Health decrease conditions
        if (this.stats.hunger < 0.2) healthChange -= decrease * 0.5;
        if (this.stats.cleanliness < 0.2) healthChange -= decrease * 0.3;
        if (this.stats.happiness < 0.2) healthChange -= decrease * 0.2;
        if (this.stats.exercise < 0.2) healthChange -= decrease * 0.2;
        if (this.stats.energy < 0.2) healthChange -= decrease * 0.3;
        
        // Very limited health regeneration
        if (this.stats.hunger > 0.8 && 
            this.stats.cleanliness > 0.8 && 
            this.stats.happiness > 0.8 && 
            this.stats.exercise > 0.7 && 
            this.stats.energy > 0.7) {
            healthChange += decrease * 0.1;
        }
        
        this.stats.health = Math.max(this.minValue, Math.min(this.maxValue, this.stats.health + healthChange));
        
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
        // Only reset if stats object is completely missing
        if (!this.stats || typeof this.stats !== 'object') {
            this.setDefaultState();
            return;
        }

        // Update pet name and age
        const petNameDisplay = document.getElementById('petNameDisplay');
        if (petNameDisplay && this.name && this.created_at) {
            const ageInDays = Math.floor((Date.now() - this.created_at) / (1000 * 60 * 60 * 24));
            const ageText = ageInDays === 0 ? 'Born today' : 
                          ageInDays === 1 ? '1 day old' : 
                          `${ageInDays} days old`;
            petNameDisplay.textContent = `${this.name} (${ageText})`;
        }

        // Update all stat bars
        Object.entries(this.stats).forEach(([stat, value]) => {
            const bar = document.getElementById(`${stat}Bar`);
            if (bar) {
                bar.style.width = `${value * 100}%`;
                bar.style.background = `linear-gradient(90deg, 
                    ${value > 0.5 ? '#4CAF50' : '#ff9800'}, 
                    ${value > 0.7 ? '#45a049' : '#f57c00'})`;
            }
        });

        // Update pet face and animation
        const petIcon = document.getElementById('petIcon');
        this.getPetFace();

        petIcon.className = 'pet-icon';
        if (selectedStyle === 'emoji') {
            petIcon.classList.add('emoji-style');
        }

        // Update status effects
        if (this.death_time) {
            petIcon.style.filter = 'grayscale(1)';
        } else if (this.stats.happiness < 0.3 || this.stats.hunger > 0.8 || this.stats.health < 0.3) {
            petIcon.style.filter = 'hue-rotate(180deg)';
        } else if (this.stats.happiness < 0.6 || this.stats.hunger > 0.6 || this.stats.health < 0.6) {
            petIcon.style.filter = 'hue-rotate(90deg)';
        } else {
            petIcon.style.filter = 'none';
        }

        // Update debug info
        if (this.isDev) {
            document.getElementById('debugInfo').textContent = 
                `Speed Multiplier: ${this.devSpeedMultiplier}x\n` +
                `Pet Type: ${this.pet_type}\n` +
                `Name: ${this.name}\n` +
                Object.entries(this.stats)
                    .map(([stat, value]) => `${stat}: ${value.toFixed(2)}`)
                    .join('\n') +
                `\nDeath Time: ${this.death_time ? new Date(this.death_time).toLocaleString() : 'N/A'}`;
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

function updatePreview() {
    const previewIcon = document.getElementById('previewIcon');
    if (!previewIcon) return;

    // Clean up previous animator if it exists
    if (previewAnimator) {
        previewAnimator.cleanup();
        previewAnimator = null;
    }

    if (!selectedPetType) {
        previewIcon.textContent = '❓';
        previewIcon.className = 'pet-icon preview-icon';
        return;
    }

    // Update preview icon class based on style
    previewIcon.className = `pet-icon preview-icon ${selectedStyle}-style`;
    previewIcon.textContent = '';  // Clear content first
    
    if (selectedStyle === 'emoji') {
        const emojis = {
            cat: '😺',
            dog: '🐶'
        };
        previewIcon.textContent = emojis[selectedPetType] || '❓';
        return;
    }

    // Create new animator for preview
    try {
        previewAnimator = window.PetAnimatorFactory.create(selectedPetType, selectedStyle);
        if (!previewAnimator) {
            console.error('Failed to create preview animator');
            previewIcon.textContent = '❓';
            return;
        }

        // Set the container for the animator
        previewAnimator.setContainer(previewIcon);

        // Apply customizations if using SVG style
        if (selectedStyle === 'svg') {
            previewAnimator.setCustomizations({
                color: document.getElementById('petColor').value || '#f0f0f0',
                eyeColor: document.getElementById('eyeColor').value || '#000000',
                mouthColor: document.getElementById('mouthColor').value || '#000000'
            });
        }

        // Initialize the preview animation
        previewAnimator.setState('idle');
        previewAnimator.updateAnimation();

        // Start animation loop for ASCII and SVG styles
        if (selectedStyle === 'ascii' || selectedStyle === 'svg') {
            if (window.previewAnimationInterval) {
                clearInterval(window.previewAnimationInterval);
            }
            window.previewAnimationInterval = setInterval(() => {
                if (previewAnimator) {
                    previewAnimator.updateAnimation();
                }
            }, 500);
        }
    } catch (error) {
        console.error('Error in preview animation:', error);
        previewIcon.textContent = '❓';
    }
}

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

    // Update preview
    updatePreview();
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
    pet.animationStyle = selectedStyle;
    pet.created_at = Date.now(); // Add creation timestamp
    
    // Store customizations if using SVG style
    if (selectedStyle === 'svg') {
        pet.customizations = {
            color: document.getElementById('petColor').value,
            eyeColor: document.getElementById('eyeColor').value,
            mouthColor: document.getElementById('mouthColor').value,
            noseColor: document.getElementById('noseColor').value,
            innerEarColor: document.getElementById('innerEarColor').value,
            whiskerColor: document.getElementById('whiskerColor').value,
            patternColor: document.getElementById('patternColor').value,
            eyeShape: document.getElementById('eyeShape').value,
            patternStyle: document.getElementById('patternStyle').value,
            patternOpacity: document.getElementById('patternOpacity').value / 100
        };
    }
    
    // Create animator with selected style using the exposed PetAnimator factory
    const animator = window.PetAnimatorFactory.create(selectedPetType, selectedStyle);
    if (!animator) {
        console.error('Failed to create animator');
        return;
    }
    pet.animator = animator;
    
    // Show pet container first so the elements exist
    pet.setInitialStats();
    pet.showPetContainer();
    
    // Set the container for the animator
    const petIcon = document.getElementById('petIcon');
    if (petIcon) {
        petIcon.textContent = ''; // Clear any existing content
        petIcon.className = `pet-icon ${selectedStyle}-style`;
        animator.setContainer(petIcon);
    }
    
    // Apply all customizations if using SVG style
    if (selectedStyle === 'svg') {
        try {
            animator.setCustomizations(pet.customizations);
        } catch (error) {
            console.error('Error setting customizations:', error);
        }
    }
    
    // Initialize the animation
    try {
        animator.setState('idle');
        animator.updateAnimation();
        
        // Start animation loop for ASCII and SVG styles
        if (selectedStyle === 'ascii' || selectedStyle === 'svg') {
            if (window.petAnimationInterval) {
                clearInterval(window.petAnimationInterval);
            }
            window.petAnimationInterval = setInterval(() => {
                if (animator) {
                    animator.updateAnimation();
                }
            }, 500);
        }
    } catch (error) {
        console.error('Error initializing animation:', error);
    }
    
    pet.saveState();
}

function showPetSelection() {
    if (pet.animator) {
        pet.animator.cleanup();
    }
    if (previewAnimator) {
        previewAnimator.cleanup();
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
    updatePreview();
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
            updatePreview();
        });
    });

    // Add event listeners for color customization
    ['petColor', 'eyeColor', 'mouthColor', 'noseColor', 'innerEarColor', 'whiskerColor', 'patternColor'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                if (previewAnimator) {
                    previewAnimator.setCustomizations({
                        color: document.getElementById('petColor').value,
                        eyeColor: document.getElementById('eyeColor').value,
                        mouthColor: document.getElementById('mouthColor').value,
                        noseColor: document.getElementById('noseColor').value,
                        innerEarColor: document.getElementById('innerEarColor').value,
                        whiskerColor: document.getElementById('whiskerColor').value,
                        patternColor: document.getElementById('patternColor').value,
                        eyeShape: document.getElementById('eyeShape').value,
                        patternStyle: document.getElementById('patternStyle').value,
                        patternOpacity: document.getElementById('patternOpacity').value / 100
                    });
                }
            });
        }
    });

    // Add event listeners for style options
    ['eyeShape', 'patternStyle'].forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.addEventListener('change', () => {
                if (previewAnimator) {
                    previewAnimator.setCustomizations({
                        color: document.getElementById('petColor').value,
                        eyeColor: document.getElementById('eyeColor').value,
                        mouthColor: document.getElementById('mouthColor').value,
                        noseColor: document.getElementById('noseColor').value,
                        innerEarColor: document.getElementById('innerEarColor').value,
                        whiskerColor: document.getElementById('whiskerColor').value,
                        patternColor: document.getElementById('patternColor').value,
                        eyeShape: document.getElementById('eyeShape').value,
                        patternStyle: document.getElementById('patternStyle').value,
                        patternOpacity: document.getElementById('patternOpacity').value / 100
                    });
                }
            });
        }
    });

    // Add event listener for pattern opacity
    const patternOpacity = document.getElementById('patternOpacity');
    if (patternOpacity) {
        patternOpacity.addEventListener('input', () => {
            if (previewAnimator) {
                previewAnimator.setCustomizations({
                    color: document.getElementById('petColor').value,
                    eyeColor: document.getElementById('eyeColor').value,
                    mouthColor: document.getElementById('mouthColor').value,
                    noseColor: document.getElementById('noseColor').value,
                    innerEarColor: document.getElementById('innerEarColor').value,
                    whiskerColor: document.getElementById('whiskerColor').value,
                    patternColor: document.getElementById('patternColor').value,
                    eyeShape: document.getElementById('eyeShape').value,
                    patternStyle: document.getElementById('patternStyle').value,
                    patternOpacity: document.getElementById('patternOpacity').value / 100
                });
            }
        });
    }

    // Add event listener for pet termination
    if (window.electron) {
        window.electron.ipcRenderer.on('terminate-pet', () => {
            if (confirm('Are you sure you want to give up your pet? Someone else will adopt them and give them a loving home.')) {
                if (pet.animator) {
                    pet.animator.cleanup();
                }
                if (previewAnimator) {
                    previewAnimator.cleanup();
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
                updatePreview();
                pet.saveState();
                alert('Your pet has found a new loving home! You can now adopt a new pet.');
            }
        });
    }
});

// Expose functions to window object
window.selectPetType = selectPetType;
window.createPet = createPet;
window.showPetSelection = showPetSelection; 