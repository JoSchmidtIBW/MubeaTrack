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
MubeaTrack ist eine Web-Applikation, die auf einem node.js-Server mit dem Express-Framework basiert.  
Die Architektur folgt dem MVC (Model-View-Controller)-Muster und nutzt die Pug-Template-Engine sowie eine Datenbank namens MongoDB.

MubeaTrack dient als Grundgerüst für die Entwicklung einer ersten Web-Applikation. Es ermöglicht die Verwaltung von Benutzern, Maschinen und vorhandenen Abteilungen.

Implementierungen in MubeaTrack:  
**→ "ASMA"**

&nbsp;



**ASMA**    
ASMA steht für "Anlagespezifischer Stör-Meldungs-Absetzer" und ist ein Bestandteil von MubeaTrack.  
Mit ASMA besteht die Möglichkeit, Anlagespezifische- Störmeldungen abzusetzen.  
Diese Meldungen sind ausschließlich für das Unterhaltspersonal bestimmt und können auch nur von ihnen quittiert oder aufgehoben werden.




## Vorbereitung  
### Voraussetzungen
Bevor Sie dieses Projekt verwenden können, stellen Sie sicher, dass die folgenden Voraussetzungen erfüllt sind:

- Betriebssystem: Windows 11 (oder eine kompatible Version)
- Webbrowser: Unterstützt werden die neuesten Versionen von Google Chrome und Microsoft Edge.
- Node.js: Stellen Sie sicher, dass Sie Node.js in Version 10.0.0 oder höher installiert haben. Sie können Node.js von der offiziellen Website herunterladen und installieren: https://nodejs.org/en/.
- NPM: NPM (Node Package Manager) wird zusammen mit Node.js installiert und sollte automatisch verfügbar sein. Sie können überprüfen, ob NPM installiert ist, indem Sie den Befehl npm --version in Ihrer Befehlszeile ausführen. https://www.npmjs.com/
- MongoDB: Installieren Sie MongoDB in Version 10.10.2. Sie können MongoDB von der offiziellen Website herunterladen und entsprechend den Anweisungen installieren: https://www.mongodb.com/.

Stellen Sie sicher, dass alle Voraussetzungen erfüllt sind, bevor Sie mit dem Projekt fortfahren.

## Installation
Um das Projekt einzurichten, gehen Sie folgendermaßen vor:
1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Öffnen Sie die Befehlszeile (Command Prompt) oder das Terminal.
3. Installieren Sie alle erforderlichen Abhängigkeiten mit folgendem Befehl:
```bash
npm install
```

## Konfiguration
Um die Konfiguration vorzunehmen, befolgen Sie bitte die folgenden Schritte:
1. Navigieren Sie zum Hauptverzeichnis des Projekts.
2. Erstellen Sie eine Datei mit dem Namen 'config.env' im Hauptverzeichnis.
3. Fügen Sie die folgenden Zeilen in die config.env-Datei ein:

--------------------------------------------------  
```bash
#Development Environment Configuration  
NODE_ENV=development
#NODE_ENV=production

#Application Port Configuration  Development Port/Production Port  
DEV_PORT=7566    
PROD_PORT=7577  

#DB Configuration  
DATABASE_MONGODB=mongodb+srv://flnc85:<PASSWORD>@cluster0.vjw8xwh.mongodb.net/MubeaTrack?retryWrites=true&w=majority  
DATABASE_MONGODB_PASSWORD=r9v5lGxvQ27M06xZ  

#JWT Configuration  
JWT_SECRET=my-ultra-secure-and-ultra-long-secret32reMoNthianOmENAnIsiaLEGUIRPREnCT32  
JWT_EXPIRES_IN=90d #ablaufdatum 90d 10h, 5m, 3s, 5milisecond oder 5000 for 5s  
JWT_COOKIE_EXPIRES_IN=90 #nicht 90d um nicht in milliseconds umwandeln zu müssen  

#CRYPTOJS Configuration  
CRYPTOJS_SECRET_KEY=mySecretKey1  

#Email Configuration  
EMAIL_USERNAME=a4b25f94e4d47b#von MailTrap#your-gmail  
EMAIL_PASSWORD=5b28a613e35fe3#von MailTrap#your-password  
EMAIL_HOST=sandbox.smtp.mailtrap.io#von MailTrap  
EMAIL_PORT=2525#Swisscom25#von MailTrap  
```
-------------------------------------------------- 

Speichern Sie die 'config.env-Datei', nachdem Sie die Konfigurationseinstellungen vorgenommen haben.

## Benutzung (lokal)
Für die Verwendung der Web-Anwendung müssen sowohl der Bundler als auch der Server ausgeführt werden. Stellen Sie sicher, dass beide Komponenten ordnungsgemäß laufen.

Wenn Sie Tests durchführen möchten, muss der Server ebenfalls gestartet sein, da die Tests auf den laufenden Server zugreifen müssen.


### Bundler im Entwicklungs- Modus starten
Mit folgendem Befehl wird der Bundler gestartet:
```bash
npm run watch:js_dev
```

### Server im Entwicklungsmodus starten
Mit folgendem Befehl wird der Server im Entwicklungs- Modus gestartet:
```bash
npm run dev
```


### Gestarteter Prozess beenden
Mit folgendem Befehl kann ein gestarteter Prozess beendet werden:
```bash
crtl+c
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


--------------------------
## Produktions-Modus (Provisorisch)

### Bundler im Produktions- Modus starten
Mit folgendem Befehl wird der Bundler gestartet:
```bash
npm run build:js_prod
```

### Server im Produktions- Modus starten
Mit folgendem Befehl wird der Server im Produktions- Modus gestartet:
```bash
npm run start:prod
```
----------------------------


### Login als Admin

Um sich als Admin anzumelden, verwenden Sie bitte die folgenden Anmeldeinformationen:

- employeenumber:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**70220**
- password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**test1234**

Geben Sie diese Informationen im Browser ein, um sich als Admin anzumelden.

## Entwickler
John Schmidt, 2023


## Lizenz
&copy; by John Schmidt. All rights reserved.


## Quellen
Weitere Informationen sind in einer separaten Dokumentation vorhanden