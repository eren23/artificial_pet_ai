const { contextBridge, ipcRenderer } = require('electron');
const PetAnimator = require('./animations');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        on: (channel, func) => {
            const subscription = (_event, ...args) => func(...args);
            ipcRenderer.on(channel, subscription);
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once: (channel, func) => {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        removeListener: (channel, func) => {
            ipcRenderer.removeListener(channel, func);
        },
        removeAllListeners: (channel) => {
            ipcRenderer.removeAllListeners(channel);
        },
        send: (channel, ...args) => {
            ipcRenderer.send(channel, ...args);
        }
    }
});

contextBridge.exposeInMainWorld('PetAnimatorFactory', {
    create: (type, style) => {
        try {
            const animator = new PetAnimator(type, style);
            // Return a proxy object that only exposes the methods we want to be available
            return {
                setContainer: (container) => animator.setContainer(container),
                setCustomizations: (customizations) => animator.setCustomizations(customizations),
                setState: (state) => animator.setState(state),
                cleanup: () => animator.cleanup(),
                updateAnimation: () => animator.updateAnimation()
            };
        } catch (error) {
            console.error('Error creating PetAnimator:', error);
            return null;
        }
    }
}); 