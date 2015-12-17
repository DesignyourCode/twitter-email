Setting up project
==================

Start by copying .env.dist and renaming to .env

Then go to http://app.twitter.com and create a new app.
Next generate the tokens and add them to the .env file.

Run 'npm install' to install all node dependencies.


To run project
==============

Make sure .env file has correct permissions: -rwxr--r--

This may help: chmod u+x .env

Start server for project:

source ./.env; node app.js