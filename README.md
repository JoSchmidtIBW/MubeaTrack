# MubeaTrack    aka ASMA
It's a Web-application, a client- server- application
with a node.js- server with the framework express (and maybe with websocket / socketI/O, for real-time- data)

With a model-view-controller MVC- architectur
and maybe it will be a RESTful API with JSON...

maybe with MongoDB (for learning) or MariaDB

It will have a login and pages...



## Project Setup


### Server
```
npm install
```
#MongoDB dev-data....
--> in userModel müssen dafür zuerst die Pre- Save- Middleware auskommentiert werden, damit das Passwort funktioniert.
ansonsten kann man in Postman mit signup eigene user erzeugen

postman:
POST     http://127.0.0.1:7566/api/v1/users/signup
{
"name": "john4",
"email": "john4@admin.io",
"password": "test1234",
"passwordConfirm": "test1234",
"role": "admin",
"active": true,
"photo": "user-1.jpg"
}

DB erzeugen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --import
DB löschen: neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --delete

#
`npm run dev`


### config.env
NODE_ENV=development

#Development port
DEV_PORT=7566
#Production port
PROD_PORT=7577

#DB CONFIG (MariaDB)
DB_HOST_db=localhost
DB_USER_db=root
DB_PASSWORD_db=Mubea2020!
DB_DATABASE_db=mubeaVerkaufDataBase

#DB CONFIG (MongoDB)
DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
#   funktioniert    DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
#//flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/Mubea?retryWrites=true&w=majority
#for Database_MONGODB_Local, mongoDBserver need to run in CMD!
DATABASE_MONGODB_LOCAL=mongodb://localhost:27017/natours
DATABASE_MONGODB_PASSWORD=Mubea2022!
#ixR6bfBeBo88Ngdj
#r9v5lGxvQ27M06xZ


#------------------------------------------------------------------------------DOWN-----------------
### config.env
NODE_ENV=development

#Development port
DEV_PORT=7566
#Production port
PROD_PORT=7577

#DB CONFIG
DB_HOST_db=localhost
DB_USER_db=root
DB_PASSWORD_db=Mubea2020!
DB_DATABASE_db=mubeaVerkaufDataBase

DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/MubeaTrack?retryWrites=true&w=majority
#DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
#   funktioniert    DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vn3fp56.mongodb.net/MubeaTrack?retryWrites=true&w=majority
#//flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/Mubea?retryWrites=true&w=majority
#for Database_MONGODB_Local, mongoDBserver need to run in CMD!
DATABASE_MONGODB_LOCAL=mongodb://localhost:27017/natours
DATABASE_MONGODB_PASSWORD=r9v5lGxvQ27M06xZ
#Mubea2022!
#ixR6bfBeBo88Ngdj
#r9v5lGxvQ27M06xZ


#secret-str sollte 32 zeichen lang sein
JWT_SECRET=my-ultra-secure-and-ultra-long-secret32reMoNthianOmENAnIsiaLEGUIRPREnCT32
#ablaufdatum 90d 10h, 5m , 3s   , 5milisecond oder 5000 for 5s
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90 #nicht 90d um nicht in milliseconds umwandeln zu müssen




#email
EMAIL_USERNAME=a4b25f94e4d47b#von MailTrap#your-gmail
EMAIL_PASSWORD=5b28a613e35fe3#von MailTrap#your-password
EMAIL_HOST=sandbox.smtp.mailtrap.io#von MailTrap
EMAIL_PORT=2525#Swisscom25#von MailTrap