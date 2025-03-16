const { app, BrowserWindow, Tray, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.DEVELOPMENT === 'true';

let tray = null;
let window = null;
let storePath = null;

// Simple file-based storage
function initStorage() {
    try {
        storePath = path.join(app.getPath('userData'), 'pet-state.json');
        console.log('Storage path:', storePath);
        
        if (!fs.existsSync(storePath)) {
            const initialState = {
                happiness: 0.5,
                hunger: 0.5,
                cleanliness: 1.0,
                health: 1.0,
                last_updated: Date.now()
            };
            fs.writeFileSync(storePath, JSON.stringify(initialState));
        }
        console.log('Storage initialized successfully');
    } catch (error) {
        console.error('Storage initialization error:', error);
    }
}

app.whenReady().then(() => {
    initStorage();
    
    // Create the tray icon
    const icon = nativeImage.createFromNamedImage('NSImageNameStatusAvailable', [-1]);
    tray = new Tray(icon);

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
            devTools: true, // Enable DevTools
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

    // Handle tray clicks
    tray.on('click', (event, bounds) => {
        const { x, y } = bounds;
        const { height, width } = window.getBounds();
        
        if (window.isVisible()) {
            window.hide();
        } else {
            const yPosition = process.platform === 'darwin' ? y : y - height;
            window.setBounds({
                x: Math.round(x - width/2),
                y: Math.round(yPosition),
                width,
                height
            });
            window.show();
        }
    });
});

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
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error loading state:', error);
        return null;
    }
});

ipcMain.handle('save-state', (event, state) => {
    try {
        fs.writeFileSync(storePath, JSON.stringify({
            ...state,
            last_updated: Date.now()
        }));
        return true;
    } catch (error) {
        console.error('Error saving state:', error);
        return false;
    }
}); 