const { app, BrowserWindow, ipcMain, nativeTheme, globalShortcut } = require('electron');
const { spawn } = require('child_process');
const client = require('discord-rich-presence')('1056199295168159814');
client.updatePresence({
  details: 'Currently in the Bot menu',
  largeImageKey: 'bigimg',
  instance: true,
});
const path = require('path');
const fs = require('fs');
var globalBot;

async function getValueJSON(file, value) {
  var json = null;
  var val = null;
  var jsonString = await fs.promises.readFile(file, 'utf8');
  try {
    json = JSON.parse(jsonString);
  } catch (err) {
    console.log(`Error getting "${value}" from "${file}", the file is not a valid JSON file.`);
  }
  try {
    val = json[value];
  } catch (err) {
    console.log(`Error getting "${value}" from "${file}", that value does not exist in the JSON file.`);
  }
  return val;
}

async function getJSON(file) {
  var json = null;
  var jsonString = await fs.promises.readFile(file, 'utf8');
  try {
    json = JSON.parse(jsonString);
  } catch (err) {
    console.log(`Error getting "${file}", the file is not a valid JSON file.`);
  }
  return json;
}

async function setValueJSON(file, value, data) {
  var json = null;
  var jsonString = await fs.promises.readFile(file, 'utf8');
  try {
    json = JSON.parse(jsonString);
  } catch (err) {
    console.log(`Error setting "${value}" in "${file}", the file is not a valid JSON file.`);
  }
  json[value] = data;
  fs.promises.writeFile(file, JSON.stringify(json, null, 4))
  return json;
}

function consoleWindow() {
  const console = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    icon: __dirname + '/guiassets/crimsonsimplelogo.ico',
    webPreferences: {
      preload: path.join(__dirname, 'consolepreload.js'),
    },
    show: false,
  })
  console.once('ready-to-show', () => {
    console.show()
  })
  console.loadFile(path.join(__dirname, 'console.html'))
  console.setMenuBarVisibility(false)
  console.webContents.setZoomFactor(1.0);
  return console
}

function createWindow() {
  if (nativeTheme.shouldUseDarkColors) {
    var color = '#333'
  } else {
    var color = '#F6F0F9'
  }
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    icon: __dirname + '/guiassets/crimsonsimplelogo.ico',
    backgroundColor: color,
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  ipcMain.on('getDir', (event, arg) => {
    event.returnValue = fs.readdirSync(arg)
  })

  ipcMain.on('require', (event, arg) => {
    if (arg.startsWith("./") && arg.endsWith(".json")) {
      event.returnValue = require(arg)
    } else if (arg.startsWith("../") && arg.endsWith(".json")) {
      event.returnValue = require(arg)
    } else {
      event.returnValue = "Must be a JSON file"
    }
  })

  ipcMain.handle('jsonRequest', async (event, arg) => {
    if (arg[0] === "setVal") {
      var result = await setValueJSON(arg[1], arg[2], arg[3])
    } else if (arg[0] === "getVal") {
      if (arg[3] === "speed") {
        var json = require(arg[1])
        var result = json.enabled
      } else {
        var result = await getValueJSON(arg[1], arg[2])
      }
    } else if (arg[0] === "getJSON") {
      if (arg[3] === "speed") {
        var result = require(arg[1])
      } else {
        var result = await getJSON(arg[1])
      }
    }
    event.returnValue = result
  })

  if (process.argv.includes("--debugcrim")) {
    win.webContents.openDevTools();
  }

  win.loadFile(path.join(__dirname, 'index.html'))
  win.setMenuBarVisibility(false)
  win.webContents.setZoomFactor(1.0);

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('clientChange', (event, args) => {
    var status = {
      details: args[0],
      largeImageKey: args[1],
      instance: true
    }
    client.updatePresence(status);
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  ipcMain.on('message', (event, data) => {
    console.log('Received message:', data);
  });

  win.webContents.on('did-finish-load', () => {
    fs.readFile('../Bot/version.txt', 'utf8', function (err, data) {
      if (err) {data = "No Version File Found"};
      win.webContents.executeJavaScript(`document.getElementById("botver").innerHTML = "Bot Version - ${data}";0`)
    });

    if (process.argv.includes('--debugcrim')) {
      win.webContents.executeJavaScript(`document.getElementById("debug").setAttribute('style', 'display: block;');0`)
    }
  })
  return win;
}

app.whenReady().then(() => {
  var win = createWindow();
  const ret = globalShortcut.register('CommandOrControl+Shift+J', () => {
    win.webContents.send('--DEBUG--', null)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', function (err) {
  console.log(err);
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

var consolewin;

ipcMain.handle('OpenConsole', (event, args) => {
  consolewin = consoleWindow()
})

ipcMain.handle('BotStart', (event, arg) => {
  console.log("Bot Started")
  globalBot = spawn('node ' + __dirname + '/../Bot/index.mjs', ["--gui"], {cwd: 'Bot', shell: true, stdio: ['pipe', 'pipe', 'pipe', 'ipc']});
  globalBot.stdout.setEncoding('utf8');
  globalBot.stdout.on('data', (data) => {
    if (data === 'STPSCD') {
      consolewin.webContents.send('STP')
    } else if (data.startsWith("prompt:")) {
      var e;
    } else {
      consolewin.webContents.send('botstdout', data)
    }
  })
  globalBot.stderr.setEncoding('utf8');
  globalBot.stderr.on('data', (data) => {
    consolewin.webContents.send('botstdout', data)
  })
  globalBot.stdin.setEncoding('utf-8');
})

ipcMain.handle('BotStop', (event, arg) => {
  globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n');
  consolewin.webContents.send('STP')
})

ipcMain.handle('BotRC', (event, arg) => {
  globalBot.stdin.write(JSON.stringify({ type: 'RC' }) + '\n');
})

process.on('exit', function (){
  try {
    globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n');
  } catch(err) {
    var e;
  }
});