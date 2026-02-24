// src/main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const { exec } = require('child_process');

const backendApp = express();

// Start backend server
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');
exec(`node ${serverPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting backend server: ${error}`);
    return;
  }
  console.log(`Backend server output: ${stdout}`);
  if (stderr) {
    console.error(`Backend server errors: ${stderr}`);
  }
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the React app
  mainWindow.loadURL('http://localhost:3000'); // Ensure React app runs on this port
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
