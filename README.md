Getting started.

git clone this codebase onto your personal computer
populate your gmail api machine credentials
    These steps will ensure /Users/<username>/.credentials/gmail-nodejs-quickstart.json has a value
    See "Getting the emailer working with Alchemie" in the "Alchemie" Google Doc

create a .env file from the .env.copy file in the root directory and fill in values for each of its variables -- this needs documentation
Run npm install to install the node modules required for the project
Run node pair-emailer in the root directory of the codebase
Add the 'public' folder to your operating system path
Change the ajax url in public/js/app to the correct url for this deployment
Ensure 'var host = "http://localhost:4000";' in server/two-factor-authenticator.js is set up correctly
git clone the 2fa codebase and run npm start in its root repository