# MubeaTrack    aka ASMA    aka MubeaChat   aka MubeaAA
It's a Web-application, a client- server- application
with a node.js- server with the framework express (and maybe with websocket / socketI/O, for real-time- data)

With a model-view-controller MVC- architectur
and maybe it will be a RESTful API with JSON...

maybe with MongoDB (for learning) or MariaDB

It will have a login and pages, 

In all, it would have the structur, for make pages for worker's and boss's, or pages for maschine's and maschine-specific things


but this will never have a programm-finish!
then with this !structur!, when it really works, it will be bigger and bigger
then there, i think it will have a digital Fahrtenschreiber for worker's, 
or pages with AA(Arbeitsanweisung) (not real-time)
or pages with Info's about maschineUpdate from the Constuction- department,
or info's from the Planung-department (real-time)

or it is like ASMA (Maschine- Error- message-send) (muss nicht real-time sein) (cookie log out in 8h)
or it is like a digital- "order" Programm, (Anlage 1, brauche ein Prüfmittel! Prüfmittelabteilung --> Anlage 1)

or it will be a dashboard for boss's to look if the maschine run etc. (real-time)

in the moment, in exist nothing like this in the company

## Project Setup
### Server
```
npm install
```




# config.env
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