# JustStreamIt 🎬

Site web en français permettant de consulter une collection de films avec leurs informations détaillées via l'API OCMovies.


## ✨ Fonctionnalités

### Affichage des films
- **Film le mieux noté** : Mise en avant du film avec le meilleur score IMDb toutes catégories confondues
- **Films les mieux notés** : Section dédiée aux autres meilleurs films
- **Catégories spécifiques** : 
  - Films d'action triés par score IMDb
  - Films de comédie triés par score IMDb
  - Menu déroulant pour la sélection d'une catégorie spécifique


### Modal d'informations
Chaque film peut être consulté en détail via une fenêtre modale affichant :
- Image du film
- Titre
- Genre(s)
- Date de sortie
- Score IMDb
- Réalisateur(s)
- Acteurs principaux
- Durée
- Pays d'origine
- Recettes au box-office
- Résumé complet

### Interface utilisateur
- Design moderne avec Tailwind CSS
- Images de secours en cas d'échec de chargement
- Navigation intuitive
- Responsive design (adapté mobile/tablette/desktop)

---

## 🛠️ Technologies utilisées

- **HTML5** : Structure du site
- **Tailwind CSS 3** : Framework CSS utility-first pour le style
- **JavaScript** : Logique et interactions
- **API OCMovies** : Source des données de films
- **Node.js & npm** : Pour la compilation de Tailwind CSS

---

## 📦 Prérequis

- **Node.js** (version 14 ou supérieure)
- **npm** (inclus avec Node.js)
- **API OCMovies** en cours d'exécution sur `http://localhost:8000`

---

## 🚀 Installation

- Cloner le projet :
```bash
git clone https://github.com/votre-username/JustStreamIt.git
cd JustStreamIt
```
- Installer l'API depuis : https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR
- Installer les dépendances :
```bash
npm install
```
- Lancer l'API OCMovies depuis un terminal séparé :
```bash
cd chemin/vers/OCMovies-API
python manage.py runserver
```
- Compiler Tailwind CSS :
```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```
- Laissez cette commande tourner en arrière-plan pour recompiler automatiquement le CSS.
- Ouvrez `index.html` dans votre navigateur.



