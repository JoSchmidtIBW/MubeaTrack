# MubeaTrack
## ASMA
### Diplomarbeit von John Schmidt
#### NDS HF Applikationsentwickler 2023

Git Repository zu meiner Diplomarbeit "MubeaTrack" als NDS HF Applikationsentwickler



## Inhaltsverzeichnis
- [Einleitung](#einleitung)
- [Vorbereitung](#vorbereitung)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Benutzung](#benutzung)
- [Entwickler](#entwickler)
- [Lizenz](#lizenz)
- [Quellen](#quellen)



## Einleitung
MubeaTrack:  
MubeaTrack ist eine Web-Applikation, mit einem node.js- Server und dem Framework Express.  
Ein Client-Server-Programm mit einer MVC (Model-View-Controller) Architektur. Und einer Datenbank namens MongoDB.  
MubeaTrack dient als Grundgerüst (für eine erste Webapplication) zur Verwaltung von Benutzern, Maschinen und schon vorhandenen Abteilungen.
Durch dieses Grundgerüst ist es möglich, zukünftig spezifische Fähigkeiten und Funktionen für jede einzelne Abteilung zu implementieren.  
Ein Beispiel hierfür wäre die Implementierung  von einer elektronische Übermittlung der aktuellen Auftragsliste von der Abteilung Planung an die Benutzer der Maschinen.

Durch die Nutzung von MubeaTrack würde dann der Informationsaustausch zwischen der Planungsabteilung und den Anlagenbedienern vereinfacht und effizienter gestaltet, wodurch auch Zeit und Papier eingespart werden könnte.
Diese Web-Applikation legt den Grundstein für eine erfolgreiche Digitalisierung und Prozessoptimierung in der Firma Mubea. Ermöglicht die Optimierung von Arbeitsabläufen und verbessert den Einsatz von Ressourcen, und würde somit auch die Produktivität steigern und die Firma dabei unterstützen, ihre betrieblichen Abläufe zu modernisieren und den Weg in eine zukunftsorientierte, digitalisierte Arbeitsumgebung zu ebnen.  
→ Implementiert in MubeaTrack ist "ASMA"


ASMA:  
ASMA steht für "Anlagespezifischer Stör-Meldungs-Absetzer" und ist ein Bestandteil von MubeaTrack.  
Mit ASMA besteht die Möglichkeit, anlagespezifische Störmeldungen abzusetzen. Diese Meldungen sind ausschließlich für das Unterhaltspersonal bestimmt und können auch nur von ihnen quittiert oder aufgehoben werden.
Durch die Integration von ASMA in MubeaTrack wird der Prozess der Störmeldung verbessert und eine effiziente Kommunikation zwischen den Anlagenbedienern und dem Unterhaltspersonal ermöglicht.
Durch die klare Zuweisung und Auflistung der Störmeldungen wird der Informationsaustausch beschleunigt und die Daten können für Auswertungen und Statistiken benutzt werden.
Die Implementierung von ASMA erweitert die Funktionalität von MubeaTrack und trägt dazu bei, die Effizienz, Produktivität und Qualität in der Firma Mubea weiter zu verbessern."



## Vorbereitung
Node.js muss installiert sein…
MongoDB sollte installiert sein…

### Voraussetzungen
Die Applikation wurde mit folgenden Versionen getestet:

- [MariaDB 10.10.2](https://mariadb.org/)
- MongoDB...
- [NodeJS 18.13.0](https://nodejs.org/en/)
- [NPM 8.19.3](https://www.npmjs.com/)
  mongoDB
  node
  Windows 11


## Installation
To set up the server for this project, follow these steps:
1.	Run npm install in the server directory to install the required dependencies. (in Terminal vielleicht cd mubea TAP....)
2.	Create a file named config.env in the server directory.
3.	In the config.env file, add the following lines:


### NodeJS und NPM
installation...
### Datenbank
installation...




## Konfiguration
1.	In the config.env file, add the following lines:

Mache config.env - datei

####----------------------------copy to config.env-------------DOWN--------------------------------- NODE_ENV=development
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


## Benutzung
Run in dev: npm run watch:js (bundler) npm run dev nicht url mit localhost nehmen, sonder http://127.0.0.1:7566

Login: employeeNumber: 70220 (admin) password: test1234

MongoDB dev-data, sofern online keine Datenbank existiert: --> in userModel müssen dafür zuerst eventuell die Pre- Save- Middleware auskommentiert werden... im moment muss nichts gemacht werden

DB erzeugen:
neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --import

DB löschen:
neues Terminal und eingeben: node .\dev-data\data\import-dev-data.mjs --delete



Test:
Unit-test:
Npm run test…. (ev npr run dev schliessen falls lauft)
Npm run seleneium…. (ev npr run dev schliessen falls lauft)


Debug:
Npm run debug….

Npm run prod (optional ob das geht)


## Entwickler
John Schmidt, 2023


## Lizenz
&copy; © by John Schmidt. All rights reserved. Feel free to use this project for your own purposes, EXPECT producing your own course or tutorials!


## Quellen
Siehe in der richtigen (abgegebenen) Dokumentation unter quellen…. Bei der ibW