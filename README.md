# phoneDirectory
## Description
This is a CRUD Pure API beginner project, phoneDirectory which includes Authentication and Authorization using JWT token
User can create their account and can find contacts and details of any registered user.
Contact details will be automatically stored in the databse after a new registration and will be accessible by all other users.
User can update their contact details if they have move to different location or switched to different cell number let say.
Admin can delete user detials and contacts too.
User can logout from its session too.
All the urls first verify and authenticate the privledge of user and admin.

Note: For the love of god don't use this in production!! 😂

## Installing
### 1. Dependencies
You must have the below installed on your machine in order to run this applicaion. If you are missing any of the following please use the provided links to install.

* Install Node.js with npm
* Install MongoDB
To confirm you have successfully installed the above run the follwoing commands:
```
  // Note version numbers may differ

  $ node --version    // should print v0.10.13
  
  $ mongo --version   // should print MongoDB shell version: 2.6.3
```
### 2. Clone git repo
```
  $ git clone https://github.com/whatcool/phoneDirectory.git
```

### 3. Install packages
Make sure you are in the root of the project directory that contains the `package.json` file before running below commands. This may take a while as there are quite a few packages, but once everything is done you should now see a `node_modules` and `bower_components` folder.

Note: This assumes that you don't have bower or grunt installed globally. If you do you can exclude the node_modules/.bin/ path in the last two commands.

	$ cd nodejs-addressbook
  $ npm install
	$ node_modules/.bin/bower install
	$ node_modules/.bin/grunt

### 4. Start MongoDB
For this application I am using the mongoDB default address `mongodb://localhost/` and port `27017`. If for any reason you have changed your local mongo config you may have issues connecting to the DB.

	$ mongod

### 5. Start Application
  $ cd server/
	$ node index.js

Once this is complete you should be able to visit the application in your browser by visiting `http://localhost:5000`.

Note: Make sure you are not already running any other node apps on port `5000`. Same goes if you are running apache or any other web server.

## Usage
The app was built on a RESTFUL API that the client side uses to interact with the backend.

### users route
```
/POST       /login
/POST       /add-contact
/POST       /add-bulk-contacts
/GET        /find-contact
/PATCH      /update-contact
/POST       /delete-contact
/GET        /search
/POST       /logout
```
### Requiremnet for login
```
user     - admin
password - admin
```
After login you will get the token and have to pass the same token in body with all other urls.

## Run app
```
node index.js
```






