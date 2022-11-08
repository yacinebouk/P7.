# PROJET N°7 - CREEZ UN RESEAU SOCIAL D'ENTREPRISE

## <u>INSTALLATION</u>

Pour utiliser l'application, il faudra installer sur votre machine:

- NodeJS 14.18.0 ou +
- React 18.2 ou +

## 1. <u>Copie des dossiers Frontend et Backend</u>

- Créer un dossier vide qui contiendra le projet, regroupé dans deux dossiers (un dossier frontend et un dossier backend).

- Ouvrez un terminal à partir du dossier nouvellement créé.

- Clonez les dossiers "frontend" et "backend" en exécutant la commande suivante:
<pre><code>git clone https://github.com/yacinebouk/P7 </code></pre>

## 2. <u>Installation du dossier Frontend</u>

- Ouvrez un terminal à partir du sous-répertoire **frontend** depuis votre IDE
- Exécutez la commande `npm install`

## 3. <u>Installation du dossier Backend</u>

- Ouvrez un terminal à partir du sous-répertoire **backend** et exécutez la commande `npm install` afin d'installer toutes les dépendances.

## 4. <u>Configuration des variables d'environnement</u>

A la racine du dossier "backend", veuillez créer un ficher `.env` (pour simplifié les test le fichier .env.exemple est fourni avec les informations correspondantes pour vous permettre de tester l'application, vous avez juste à le renommer en .env)

- Le fichier .env du back contient les variables d'environnement suivants :
```
DB_USERNAME=(username mongodb)
DB_PASSWORD=(mot de passe mongodb)
DB_CLUSTER=(cluster mongodb)
CRYPTOJS_KEY_EMAIL=(chaîne de caractères aléatoire)
JWT_KEY=(chaîne de caractères aléatoire)
SECRET_TOKEN=(chaîne de caractères aléatoire)
```
---
Même chose pour le front, un fichier .env doit être créé, pour les tests un fichier .env.exemple et fourni vous avez juste besoin de rebaptiser en .env

Le ficher `.env` à la racine du dossier "frontend", correspond à l'url du backend afin de faire des requêtes API. Cette application utilise l'url `http://localhost:5000` .

- Le fichier .env du front contient les variables d'environnement suivants :
```
REACT_APP_API_URL=(url de l'api back)
```

## 5. <u>Lancement des services</u>

Après avoir suivi les directives, vous pouvez effectuer un 'npm start dans un terminal ouvert sur le dossier backend et la même chose pour le dossier frontend

## 6. <u>Environnement de développement</u>

- Utilisation de **MongoDB** pour l'hébergement et la gestion de la base de données
- Utilisation du framework **Express**
- Utilisation du framework frontend **React**
- Utilisation du runtime **Node.js**

## 7. <u>Dépendances utilisées dans le frontend</u>

- **axios :** crypte et hashe les mots de passe
- **dotenv :** permet l'utilisation de variables d'environnement
- **js-cookie :** permet de gérer les cookies facilement
- **node-sass :** est une bibliothèque fournissant la liaison de Node.js à LibSass
- **react :** est une bibliothèque JavaScript pour créer des interfaces utilisateurs
- **react-dom :** est un package react pour travailler avec le DOM
- **react-redux :** permet l'utilisation de redux dans le cadre d'une application React
- **react-router-dom :** permet le routage pour les applications React
- **redux :** est une bibliothèque fournissant un conteneur d'état "predictable state container"
- **redux-thunk :** est un middleware pour Redux permettant d'envoyer des actions en faisant des dispatchs

## 8. <u>Dépendances utilisées dans le backend</u>

- **bcrypt :** crypte et hashe les mots de passe
- **body-parser :** analyse le corps des requêtes
- **cookie-parser :** fournit un middleware pour l'analyse des cookies
- **crypto-js :** crypte l'adresse email avant d'être envoyée à la base de données
- **dotenv :** permet l'utilisation de variables d'environnement
- **express :** construit des applications web basées sur Node.js grâce à son framework
- **express-rate-limit :** limite le nombre répété de requêtes
- **helmet :** sécurise les applications Express à l'aide de headers HTTP variés
- **jsonwebtoken :** crée et vérifie les tokens d'authentification
- **mongoose :** connecte l'application avec la base de données MongoDB
- **mongoose-unique-validator :** évite que deux utilisateurs ne s'inscrivent avec la même adresse email
- **multer :** permet la gestion des fichiers envoyés dans les requêtes
- **nodemon :** relance le serveur automatiquement à chaque modification
- **password-validator :** vérifie les mots de passe lors de l'inscription
- **validator :** est utilisé dans ce contexte pour vérifier la validation des adresses mail
