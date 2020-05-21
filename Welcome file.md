## **Authorized login / signup server**

**Instructions how to quickly setup server**

To run server you can simply remix glitch project https://glitch.com/~cute-slime-longan and change some environment variables.

To connect to your mongo database change **username** and **password** environment variables to yours.

For data encryption generate your secret key and store it in **secret** environment variable.

Change allowed origins array in server.js file to protect your server from unwanted reqeuests.

For faster glitch server response keep server awake by sending get request "/" every 1-5 minutes.

**Files structure**
Start endpoint - **server.js**
Mongo database models are stored in **models** folder.
Verification functions for facebook / google access tokens and for verfiying jwt token are stored in folder **verifications**
All login / signup routes are stored in **routes** folder
