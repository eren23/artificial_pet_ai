const { app, BrowserWindow, Tray, nativeImage, ipcMain, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.DEVELOPMENT === 'true';

let tray = null;
let window = null;
let storePath = null;
let trayContextMenu = null;

// Create a default icon for the tray
function createTrayIcon() {
    try {
        const iconPath = path.join(__dirname, 'assets', 'icon.png');
        if (!fs.existsSync(iconPath)) {
            console.error('Icon not found at:', iconPath);
            return nativeImage.createEmpty();
        }
        
        const icon = nativeImage.createFromPath(iconPath);
        if (process.platform === 'darwin') {
            icon.setTemplateImage(true);
        }
        return icon.resize({ width: 16, height: 16 });
    } catch (error) {
        console.error('Failed to load icon:', error);
        return nativeImage.createEmpty();
    }
}

// Refresh tray icon
function refreshTrayIcon() {
    if (tray && !tray.isDestroyed()) {
        const icon = createTrayIcon();
        tray.setImage(icon);
    }
}

function initTray() {
    try {
        const icon = createTrayIcon();
        tray = new Tray(icon);

        // Create and store context menu
        trayContextMenu = createTrayMenu();
        tray.setContextMenu(trayContextMenu);

        // Handle tray clicks
        tray.on('click', (event, bounds) => {
            const { x, y } = bounds;
            const { height, width } = window.getBounds();
            
            if (window.isVisible()) {
                window.hide();
            } else {
                // Position window near tray icon
                const yPosition = process.platform === 'darwin' ? y : y - height;
                window.setBounds({
                    x: Math.round(x - width/2),
                    y: Math.round(yPosition),
                    width,
                    height
                });
                window.show();
                window.focus();
            }
        });

        // Handle right click
        tray.on('right-click', () => {
            tray.popUpContextMenu(trayContextMenu);
        });

        // Ensure tray icon remains visible
        tray.setIgnoreDoubleClickEvents(true);
    } catch (error) {
        console.error('Failed to initialize tray:', error);
    }
}

// Simple file-based storage
function initStorage() {
    try {
        storePath = path.join(app.getPath('userData'), 'pet-state.json');
        console.log('Storage path:', storePath);
        
        if (!fs.existsSync(storePath)) {
            const initialState = {
                pet_type: null,
                name: null,
                stats: {
                    happiness: 0.5,
                    hunger: 0.5,
                    cleanliness: 1.0,
                    health: 1.0,
                    energy: 1.0,
                    social: 0.5,
                    exercise: 0.5
                },
                animation_style: 'emoji',
                customizations: null,
                created_at: null,
                death_time: null,
                last_updated: Date.now()
            };
            fs.writeFileSync(storePath, JSON.stringify(initialState, null, 2));
        } else {
            // Read existing state and ensure all required properties exist
            try {
                const currentState = JSON.parse(fs.readFileSync(storePath, 'utf8'));
                const defaultStats = {
                    happiness: 0.5,
                    hunger: 0.5,
                    cleanliness: 1.0,
                    health: 1.0,
                    energy: 1.0,
                    social: 0.5,
                    exercise: 0.5
                };

                // Ensure stats object exists and has all required properties
                if (!currentState.stats) {
                    currentState.stats = defaultStats;
                } else {
                    // Add any missing stats with default values
                    Object.keys(defaultStats).forEach(stat => {
                        if (typeof currentState.stats[stat] === 'undefined') {
                            currentState.stats[stat] = defaultStats[stat];
                        }
                    });
                }

                // Ensure other required properties exist
                if (!currentState.animation_style) currentState.animation_style = 'emoji';
                if (!currentState.last_updated) currentState.last_updated = Date.now();

                // Save the updated state back to file
                fs.writeFileSync(storePath, JSON.stringify(currentState, null, 2));
            } catch (error) {
                console.error('Error updating existing state:', error);
            }
        }
        console.log('Storage initialized successfully');
    } catch (error) {
        console.error('Storage initialization error:', error);
    }
}

function createTrayMenu() {
    return Menu.buildFromTemplate([
        { 
            label: 'Show Pet',
            click: () => {
                window.show();
                window.focus();
            }
        },
        { type: 'separator' },
        {
            label: 'Pet Status',
            submenu: [
                { label: 'Happy', enabled: false },
                { label: 'Healthy', enabled: false },
                { label: 'Clean', enabled: false }
            ]
        },
        { type: 'separator' },
        {
            label: 'Quick Actions',
            submenu: [
                { 
                    label: 'Feed Pet',
                    click: () => window.webContents.send('quick-action', 'feed')
                },
                { 
                    label: 'Pet',
                    click: () => window.webContents.send('quick-action', 'pet')
                },
                { 
                    label: 'Care',
                    click: () => window.webContents.send('quick-action', 'care')
                }
            ]
        },
        { type: 'separator' },
        {
            label: 'Settings',
            submenu: [
                { 
                    label: 'Notifications',
                    type: 'checkbox',
                    checked: true,
                    click: (menuItem) => window.webContents.send('toggle-notifications', menuItem.checked)
                },
                { type: 'separator' },
                { 
                    label: 'Reset Pet',
                    click: () => {
                        window.webContents.send('reset-pet');
                        window.show();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Give Up Pet',
                    click: () => {
                        window.webContents.send('terminate-pet');
                        window.show();
                    }
                }
            ]
        },
        { type: 'separator' },
        { 
            label: 'Quit',
            click: () => app.quit()
        }
    ]);
}

app.whenReady().then(() => {
    initStorage();
    initTray();

    // Update menu status periodically
    setInterval(() => {
        if (window && window.webContents) {
            window.webContents.send('request-status-update');
        }
    }, 10000); // Update every 10 seconds

    // Create the browser window
    window = new BrowserWindow({
        width: 300,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Enable DevTools in development mode
    if (isDev) {
        window.webContents.openDevTools({ mode: 'detach' });
    }

    // Pass isDev to renderer process
    window.webContents.on('did-finish-load', () => {
        window.webContents.executeJavaScript(`window.isDev = ${isDev};`);
    });

    window.loadFile('src/index.html');

    // Hide window when clicking outside
    window.on('blur', () => {
        window.hide();
    });

    // Handle display changes
    screen.on('display-added', refreshTrayIcon);
    screen.on('display-removed', refreshTrayIcon);
});

// Handle app activation
app.on('activate', refreshTrayIcon);

// Add keyboard shortcut to open DevTools
app.on('web-contents-created', (e, contents) => {
    if (isDev) {
        contents.on('before-input-event', (event, input) => {
            if (input.control && input.key.toLowerCase() === 'i') {
                contents.toggleDevTools();
            }
        });
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Add IPC handlers for main process
ipcMain.on('quit-app', () => {
    app.quit();
});

// Handle IPC messages for storage operations
ipcMain.handle('load-state', () => {
    try {
        if (fs.existsSync(storePath)) {
            const data = fs.readFileSync(storePath, 'utf8');
            const state = JSON.parse(data);
            
            // Ensure stats object exists
            if (!state.stats) {
                state.stats = {
                    happiness: 0.5,
                    hunger: 0.5,
                    cleanliness: 1.0,
                    health: 1.0,
                    energy: 1.0,
                    social: 0.5,
                    exercise: 0.5
                };
            }
            
            return state;
        }
        return null;
    } catch (error) {
        console.error('Error loading state:', error);
        return null;
    }
});

ipcMain.handle('save-state', (event, state) => {
    try {
        // Ensure we're not overwriting with empty stats
        if (!state.stats || Object.keys(state.stats).length === 0) {
            const currentState = JSON.parse(fs.readFileSync(storePath, 'utf8'));
            state.stats = currentState.stats;
        }
        
        // Update last_updated timestamp
        state.last_updated = Date.now();
        
        fs.writeFileSync(storePath, JSON.stringify(state, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving state:', error);
        return false;
    }
});

// Add IPC handlers for status updates
ipcMain.on('status-update', (event, status) => {
    // Create a new menu with updated status
    const statusSubmenu = trayContextMenu.items[2].submenu;
    
    statusSubmenu.items[0].label = `Happiness: ${Math.round(status.happiness * 100)}%`;
    statusSubmenu.items[1].label = `Health: ${Math.round(status.health * 100)}%`;
    statusSubmenu.items[2].label = `Cleanliness: ${Math.round(status.cleanliness * 100)}%`;
    
    // Update the tray's context menu
    tray.setContextMenu(trayContextMenu);
}); 