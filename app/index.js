const app = require('app');
const BrowserWindow = require('browser-window');
const path = require('path');
const spawn = require('child_process').spawn;
const Menu = require('menu');

let mainWindow = null;

if (process.platform === 'win32') {
  const cmd = process.argv[ 1 ];
  const target = path.basename(process.execPath);
  if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
    run([ '--createShortcut=' + target + '' ], app.quit);
  } else if (cmd === '--squirrel-uninstall') {
    run([ '--removeShortcut=' + target + '' ], app.quit);
  }
  else if (cmd === '--squirrel-obsolete') {
    app.quit();
  }
}

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL('file://' + __dirname + '/generated/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  var applicationMenu = {
      label: "Application",
      submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        {
          label: "Quit", accelerator: "Command+Q",
          click() {
            app.quit();
          }
        }
      ]
    };

  var editMenu = {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  };

  var viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
        click(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    ]
  };

  if (process.env.NODE_ENV === 'development') {
    viewMenu.submenu.push({
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.webContents.toggleDevTools();
      }
    });
  }

  var windowMenu = {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  };

  var helpMenu = {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          require('electron').shell.openExternal('https://github.com/Mercateo/dwatch');
        }
      }
    ]
  };

  Menu.setApplicationMenu(Menu.buildFromTemplate([ applicationMenu, editMenu, viewMenu, windowMenu, helpMenu ]));
});

function run (args, done) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  spawn(updateExe, args, {
    detached: true
  })
    .on('close', done)
}
