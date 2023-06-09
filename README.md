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
**MubeaTrack**    
MubeaTrack ist eine Web-Applikation, mit einem node.js- Server und dem Framework Express.  
Ein Client-Server-Programm mit einer MVC (Model-View-Controller) Architektur. Und einer Datenbank namens MongoDB.  
MubeaTrack dient als Grundgerüst (für eine erste Webapplication) zur Verwaltung von Benutzern, Maschinen und schon vorhandenen Abteilungen.

**→ Implementiert in MubeaTrack ist "ASMA"**

&nbsp;



**ASMA**    
ASMA steht für "Anlagespezifischer Stör-Meldungs-Absetzer" und ist ein Bestandteil von MubeaTrack.  
Mit ASMA besteht die Möglichkeit, anlagespezifische Störmeldungen abzusetzen. Diese Meldungen sind ausschließlich für das Unterhaltspersonal bestimmt und können auch nur von ihnen quittiert oder aufgehoben werden.




## Vorbereitung  
### Voraussetzungen
Bevor Sie dieses Projekt verwenden können, stellen Sie sicher, dass die folgenden Voraussetzungen erfüllt sind:

- Betriebssystem: Windows 11 (oder eine kompatible Version)
- Webbrowser: Unterstützt werden die neuesten Versionen von Google Chrome und Microsoft Edge.
- Node.js: Version 10.0.0 oder höher. (https://nodejs.org/en/)
- NPM: NPM wird zusammen mit Node.js installiert und sollte automatisch verfügbar sein. (https://www.npmjs.com/)
- MongoDB: Version 10.10.2. (https://www.mongodb.com/)


## Installation
Um das Projekt einzurichten, gehen Sie folgendermaßen vor:
1. Führen Sie npm install im hauptverzeichnis aus, um die erforderlichen Abhängigkeiten zu installieren.
Mit folgendem Befehl werden alle Abhängigkeiten installiert:
```bash
npm install
```

## Konfiguration
1. Erstellen Sie eine Datei namens config.env im Hauptverzeichnis.
2. Fügen Sie in der Datei config.env die folgenden Zeilen hinzu:



####----------------------------copy to config.env--------------------------------------------------
####Development Environment Configuration
NODE_ENV=development

####Application Port Configuration  Development Port/Production Port
DEV_PORT=7566  
PROD_PORT=7577

####DB Configuration
DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/MubeaTrack?retryWrites=true&w=majority
DATABASE_MONGODB_PASSWORD=r9v5lGxvQ27M06xZ

####JWT Configuration
JWT_SECRET=my-ultra-secure-and-ultra-long-secret32reMoNthianOmENAnIsiaLEGUIRPREnCT32
JWT_EXPIRES_IN=90d #ablaufdatum 90d 10h, 5m, 3s, 5milisecond oder 5000 for 5s
JWT_COOKIE_EXPIRES_IN=90 #nicht 90d um nicht in milliseconds umwandeln zu müssen

####Email Configuration
EMAIL_USERNAME=a4b25f94e4d47b#von MailTrap#your-gmail
EMAIL_PASSWORD=5b28a613e35fe3#von MailTrap#your-password
EMAIL_HOST=sandbox.smtp.mailtrap.io#von MailTrap
EMAIL_PORT=2525#Swisscom25#von MailTrap
####----------------------------copy to config.env------------------------------------------------


## Benutzung
Bundler und Server müssen für die Web-Anwendung laufen. 
für Tests, muss der Server beendet sein.

### Bundler starten
Mit folgendem Befehl wird der Bundler gestartet:
```bash
npm run watch:js
```

### Server starten im Development Mode
Mit folgendem Befehl wird der Server (im Development Mode) gestartet:
```bash
npm run dev
```

### Server beenden
Mit folgendem Befehl kann der Server beendet werden:
```bash
crtl+c
```

### Server starten im Produktions Mode
Mit folgendem Befehl wird der Server (im Produktions Mode) gestartet:
```bash
npm run start:prod
```

### Debugger starten
Mit folgendem Befehl wird der Debugger gestartet:
```bash
npm run debug
```

### Unit- Test's starten
Mit folgendem Befehl werden die Unit- Tests gestartet:
```bash
npm run test
```

### Selenium- Test's starten
Mit folgendem Befehl werden die Selenium- Tests gestartet:
```bash
npm run test:Selenium
```

### Datenbank erzeugen:
Mit folgendem Befehl wird die Datenbank erzeugt:
```bash
node .\dev-data\data\import-dev-data.mjs --import
```

### Datenbank löschen:
Mit folgendem Befehl wird die Datenbank gelöscht:
```bash
node .\dev-data\data\import-dev-data.mjs --delete
```

### Login als Admin

Um sich als Admin anzumelden, verwenden Sie bitte die folgenden Anmeldeinformationen:

- employeenumber:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**70220**
- password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**test1234**

Geben Sie diese Informationen im Browser ein, um sich als Admin anzumelden.

## Entwickler
John Schmidt, 2023


## Lizenz
&copy; by John Schmidt. All rights reserved.


## Quellen
Siehe in der richtigen (abgegebenen) Dokumentation unter quellen…. Bei der ibW