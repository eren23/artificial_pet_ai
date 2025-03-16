const { contextBridge, ipcRenderer } = require('electron');
const PetAnimator = require('./animations');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
    }
});

contextBridge.exposeInMainWorld('PetAnimatorFactory', {
    create: (type, style) => {
        try {
            const animator = new PetAnimator(type, style);
            // Return a proxy object that only exposes the methods we want to be available
            return {
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