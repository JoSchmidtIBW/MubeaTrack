# MubeaTrack - aka ASMA
It's a Web-application, with a node.js- server and the framework express.
A client-server program with an MVC (Model-View-Controller) architecture.
And a MongoDB database.

The web application is designed to allow for facility-specific error reports to be submitted. 
These reports can only be resolved by maintenance personnel.


## Project Setup
To set up the server for this project, follow these steps:

1. Run `npm install` in the server directory to install the required dependencies.
   (in Terminal vielleicht cd mubea TAP....)
2. Create a file named config.env in the server directory.
3. In the config.env file, add the following lines:

### config.env
####----------------------------copy to config.env-------------DOWN---------------------------------
NODE_ENV=development

####Development port
DEV_PORT=7566
####Production port
PROD_PORT=7577

####DB CONFIG
DB_HOST_db=localhost
DB_USER_db=root
DB_PASSWORD_db=Mubea2020!
DB_DATABASE_db=mubeaVerkaufDataBase

DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/MubeaTrack?retryWrites=true&w=majority
####DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
####   funktioniert    DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
####//flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/Mubea?retryWrites=true&w=majority
####for Database_MONGODB_Local, mongoDBserver need to run in CMD!
DATABASE_MONGODB_LOCAL=mongodb://localhost:27017/natours
DATABASE_MONGODB_PASSWORD=r9v5lGxvQ27M06xZ
####Mubea2022!
####ixR6bfBeBo88Ngdj
####r9v5lGxvQ27M06xZ


####secret-str sollte 32 zeichen lang sein
JWT_SECRET=my-ultra-secure-and-ultra-long-secret32reMoNthianOmENAnIsiaLEGUIRPREnCT32
####ablaufdatum 90d 10h, 5m , 3s   , 5milisecond oder 5000 for 5s
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90 #nicht 90d um nicht in milliseconds umwandeln zu müssen


####email
EMAIL_USERNAME=a4b25f94e4d47b#von MailTrap#your-gmail
EMAIL_PASSWORD=5b28a613e35fe3#von MailTrap#your-password
EMAIL_HOST=sandbox.smtp.mailtrap.io#von MailTrap
EMAIL_PORT=2525#Swisscom25#von MailTrap

####----------------------------copy to config.env-------------UP---------------------------------


## Server
```
npm install
config.env
```

#Run in dev:
`npm run watch:js` (bundler)
`npm run dev`
nicht url mit localhost nehmen, sonder http://127.0.0.1:7566

Login:
employeeNumber:     70220   (admin)
password:           test1234




####MongoDB dev-data, sofern online keine Datenbank existiert:
--> in userModel müssen dafür zuerst eventuell die Pre- Save- Middleware auskommentiert werden...
im moment muss nichts gemacht werden

DB erzeugen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --import
DB löschen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --delete



