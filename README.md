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