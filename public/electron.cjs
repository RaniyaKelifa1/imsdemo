const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
// const serverPath = path.join(__dirname, 'server', 'server.js'); // Path to your server script

// Function to create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html file from the build folder
  win.loadFile(path.join(__dirname, 'index.html'));
}

// Function to start the Express server
// function startServer() {
//   const server = fork(serverPath, [], {
//     stdio: 'inherit', // This will log server output to the main process console
//   });

//   server.on('error', (err) => {
//     console.error('Failed to start the server:', err);
//   });

//   server.on('exit', (code) => {
//     console.log('Server process exited with code:', code);
//   });
// }

// Start the server when Electron is ready
app.whenReady().then(() => {
  // startServer();  // Start the server
  createWindow(); // Create the Electron window

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
