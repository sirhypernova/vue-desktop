# vue-desktop

## Project setup
```
npm install
```

**Navigate to the backend folder:**
```
cd backend
PORT=8082 node index.js
```
**Now go to the src folder, and copy `config.example.js` to `config.js`**
**Once you are done with that, fill in the config with your IP and port of the backend server**

### xpra Setup
First, you need to install xpra. [Click here](https://xpra.org/trac/wiki/Download) for more information.

Once you install xpra, you must also [install websockify](https://github.com/novnc/websockify).

Now that you have `xpra` and `websockify` installed, edit `programs.js` in the `backend/instance` folder.
This is a **whitelist** for programs that you want to allow to be run through xpra.

Now, the rest is pretty simple. Open your desktop and log in, then right click on the desktop. Click `Add Shortcut`.
Open the `type` dropdown and select `xpra`. Fill in the xpra app field and click submit.

That's it! Now all you have to do is double click the icon on the desktop to launch your app.
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
