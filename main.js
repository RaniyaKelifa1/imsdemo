// const { app, BrowserWindow } = require('electron');
// const { exec } = require('child_process');
// const path = require('path');

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   mainWindow.loadURL('http://localhost:3000'); // React app URL
// }

// app.whenReady().then(() => {
//   // Start the server
//   exec('node server.js', {
//     cwd: path.join(__dirname, 'serversese', 'server.js'),
//   });

//   createWindow();

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit();
// });
