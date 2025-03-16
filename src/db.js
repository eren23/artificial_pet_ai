const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class PetDB {
    constructor() {
        try {
            const dbPath = path.join(app.getPath('userData'), 'pet.db');
            console.log('Creating database at:', dbPath);
            this.db = new Database(dbPath);
            console.log('Database created successfully');
            this.initDB();
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    }

    initDB() {
        try {
            console.log('Initializing database tables...');
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS pet_state (
                    id INTEGER PRIMARY KEY,
                    happiness REAL,
                    hunger REAL,
                    cleanliness REAL,
                    health REAL,
                    last_updated INTEGER
                )
            `);

            // Insert initial state if not exists
            const state = this.db.prepare('SELECT * FROM pet_state WHERE id = 1').get();
            if (!state) {
                this.db.prepare(`
                    INSERT INTO pet_state (id, happiness, hunger, cleanliness, health, last_updated)
                    VALUES (1, 0.5, 0.5, 1.0, 1.0, ?)
                `).run(Date.now());
            }
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }

    saveState(state) {
        try {
            this.db.prepare(`
                UPDATE pet_state 
                SET happiness = ?, hunger = ?, cleanliness = ?, health = ?, last_updated = ?
                WHERE id = 1
            `).run(state.happiness, state.hunger, state.cleanliness, state.health, Date.now());
            console.log('State saved successfully');
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    loadState() {
        try {
            const state = this.db.prepare('SELECT * FROM pet_state WHERE id = 1').get();
            console.log('State loaded:', state);
            return state;
        } catch (error) {
            console.error('Error loading state:', error);
            // Return default state if loading fails
            return {
                happiness: 0.5,
                hunger: 0.5,
                cleanliness: 1.0,
                health: 1.0,
                last_updated: Date.now()
            };
        }
    }
}

module.exports = new PetDB();