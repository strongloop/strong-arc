# devtools

This folder contains files that add Blink Developer Tools to Studio.

 - `frontend/` - a copy of DevTools frontend files with minimal modifications

 - `protocol.json` - Description of Chrome Remote Debugging Protocol
  used by the front-end.

 - `custom/` - front-end customization

 - `server/` - a websocket backend

Run `gulp pull-devtools` in the project root to update front-end files
to the latest version.

## Resources

Run Studio with `DEBUG=studio:devtools` to see the Chrome Remote Debugging
Protocol messages exchanged between the frontend and the backend.

Protocol documentation:
https://developer.chrome.com/devtools/docs/protocol/tot

Guide on how to debug protocol DevTools in Chrome Canary:
https://developer.chrome.com/devtools/docs/contributing#step-1-getting-set-up

