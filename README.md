# App Contacts

Application web de gestion de contacts développée dans le cadre d'un projet de mise en œuvre d'une plateforme d'intégration continue et de déploiement automatisés d'une application conteneurisée.

L'application permet de gérer des contacts à travers une interface web et une API REST. Elle est composée d'un frontend, d'un backend et d'une base de données PostgreSQL.

Le projet intègre également une chaîne d'automatisation permettant d'exécuter les tests, de construire les conteneurs et de déployer automatiquement l'application sur un serveur Ubuntu.

---

## 1. Fonctionnalités

L'application permet notamment de :

- consulter la liste des contacts ;
- rechercher un contact ;
- ajouter un contact ;
- modifier un contact ;
- supprimer un contact ;
- vérifier l'état de fonctionnement de l'API.

Le backend expose une API REST permettant au frontend de communiquer avec la base de données.

---

## 2. Architecture

L'application est organisée autour de trois services principaux :

```text
                    ┌─────────────────┐
                    │    Frontend     │
                    │   HTML / CSS /  │
                    │   JavaScript    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Backend     │
                    │     FastAPI     │
                    │     Python      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    PostgreSQL   │
                    │     Database    │
                    └─────────────────┘
```

Les services sont conteneurisés avec Docker et exécutés avec Docker Compose.

---

## 3. Technologies utilisées

### Application

- **Python** : langage utilisé pour le backend.
- **FastAPI** : framework utilisé pour développer l'API REST.
- **SQLAlchemy** : bibliothèque utilisée pour l'accès à la base de données.
- **PostgreSQL** : système de gestion de base de données.
- **HTML / CSS / JavaScript** : technologies utilisées pour le frontend.

### Conteneurisation

- **Docker** : création et exécution des conteneurs.
- **Docker Compose** : orchestration des différents services.

### Intégration et déploiement

- **Git** : gestion des versions du code source.
- **GitHub** : hébergement du dépôt et déclenchement du pipeline par webhook.
- **Jenkins** : automatisation des tests, de la construction et du déploiement.
- **Ansible** : automatisation de la configuration et du déploiement sur le serveur.
- **SSH** : communication sécurisée entre la machine d'administration et le serveur Ubuntu.
- **ngrok** : exposition temporaire de Jenkins sur Internet afin de permettre à GitHub d'envoyer les webhooks.

---

## 4. Structure du projet

```text
app-contacts/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── tests/
│   │   └── test_main.py
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── icons/
│
├── ansible/
│   ├── deploy.yml
│   └── inventory.ini
│
├── docker-compose.yml
├── Jenkinsfile
├── .gitignore
└── README.md
```

---

## 5. Prérequis

Pour exécuter le projet, les éléments suivants sont nécessaires :

- Git ;
- Docker ;
- Docker Compose ;
- Python 3.12 ou version compatible ;
- Ansible pour le déploiement ;
- un serveur Ubuntu accessible par SSH pour le déploiement distant.

---

## 6. Configuration des variables d'environnement

Les informations de connexion à PostgreSQL ne sont pas stockées directement dans le dépôt Git.

Créer un fichier `.env` à la racine du projet :

```env
POSTGRES_DB=contacts
POSTGRES_USER=contacts_user
POSTGRES_PASSWORD=<mot_de-passe-postgresql>

TEST_POSTGRES_DB=contacts_test
TEST_POSTGRES_USER=contacts_user
TEST_POSTGRES_PASSWORD=contacts_password
```

Le fichier `.env` est exclu du dépôt grâce au fichier `.gitignore`.

---

## 7. Lancement de l'application avec Docker Compose

Depuis la racine du projet :

```bash
docker compose up -d --build
```

Cette commande :

- construit les images Docker nécessaires ;
- démarre PostgreSQL ;
- démarre le backend FastAPI ;
- démarre le frontend ;
- crée les réseaux et volumes nécessaires.

Pour vérifier les conteneurs :

```bash
docker compose ps
```

Pour consulter les logs :

```bash
docker compose logs
```

Pour arrêter les services :

```bash
docker compose down
```

---

## 8. Accès à l'application

Une fois les conteneurs démarrés, l'application est accessible à :

```text
http://localhost:8081
```

L'API backend est accessible à :

```text
http://localhost:8000
```

L'état de fonctionnement du backend peut être vérifié avec :

```text
http://localhost:8000/health
```

Une réponse correcte est :

```json
{
  "status": "ok"
}
```

---

## 9. Exécution des tests

Les tests sont réalisés dans un environnement séparé de la base de données utilisée par l'application.

Pour démarrer la base de données de test :

```bash
docker compose up -d test-database
```

Puis exécuter les tests :

```bash
docker compose run --rm backend-test pytest
```

Les tests couvrent notamment :

- l'accès à l'API ;
- la vérification de l'état du backend ;
- la récupération des contacts ;
- la création d'un contact ;
- la modification d'un contact ;
- la suppression d'un contact ;
- la gestion des contacts inexistants.

---

## 10. Intégration continue et déploiement

Le projet utilise Jenkins pour automatiser le processus d'intégration et de déploiement.

Le fonctionnement général est le suivant :

```text
Développeur
     │
     │ git push
     ▼
   GitHub
     │
     │ webhook
     ▼
   Jenkins
     │
     ├── Tests
     │
     ├── Build Docker
     │
     └── Déploiement
             │
             ▼
          Ansible
             │
             │ SSH
             ▼
       Ubuntu Server
             │
             ▼
       Docker Compose
             │
             ▼
         Application
```

---

## 11. Pipeline Jenkins

Le pipeline est défini dans le fichier :

```text
Jenkinsfile
```

Il comporte principalement trois étapes.

### Tests

Jenkins démarre une base PostgreSQL dédiée aux tests puis exécute la suite de tests :

```bash
docker compose up -d test-database
docker compose run --rm backend-test pytest
```

Si un test échoue, le pipeline s'arrête.

### Build Docker

Lorsque les tests sont réussis, Jenkins construit les images Docker :

```bash
docker compose build
```

Cette étape permet notamment de vérifier que l'application peut être correctement construite à partir du code validé.

### Déploiement

Si le pipeline est exécuté sur la branche `main`, Jenkins lance Ansible :

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

Jenkins transmet également à Ansible le commit exact qui a été traité.

Cela permet de garantir que le serveur déploie la même version du code que celle validée par Jenkins.

---

## 12. Déploiement avec Ansible

Le déploiement est défini dans :

```text
ansible/deploy.yml
```

Ansible :

1. se connecte au serveur Ubuntu par SSH ;
2. récupère le projet depuis GitHub ;
3. sélectionne le commit demandé ;
4. vérifie le commit réellement récupéré ;
5. construit et démarre les services avec Docker Compose ;
6. vérifie la disponibilité du backend ;
7. vérifie la disponibilité du frontend.

Le serveur cible est défini dans :

```text
ansible/inventory.ini
```

Exemple :

```ini
[target]
app_server ansible_host=<adresse-ip-du-serveur> ansible_user=<utilisateur>
```

---

## 13. Vérification du commit déployé

Pour éviter qu'une version différente de celle validée par Jenkins soit déployée, Ansible vérifie le commit présent sur le serveur.

La commande utilisée est :

```bash
git rev-parse HEAD
```

Le résultat est comparé au commit transmis par Jenkins.

Si les deux commits sont identiques :

```text
Le commit déployé correspond au commit Jenkins
```

Dans le cas contraire, le déploiement est interrompu.

---

## 14. Vérification de l'application après déploiement

Après le démarrage des services, Ansible effectue automatiquement des vérifications.

### Backend

```text
http://localhost:8000/health
```

Le serveur doit retourner le code HTTP `200`.

### Frontend

```text
http://localhost:8081
```

Le serveur doit également retourner le code HTTP `200`.

Ces vérifications permettent de détecter un déploiement qui serait techniquement terminé mais dont l'application ne fonctionnerait pas correctement.

---

## 15. Gestion des informations sensibles

Les mots de passe de la base de données ne sont pas versionnés dans Git.

Le fichier :

```text
.env
```

est exclu du dépôt grâce à `.gitignore`.

Les variables nécessaires au pipeline Jenkins sont également configurées dans Jenkins Credentials plutôt que directement dans le `Jenkinsfile`.

Cette organisation évite d'inscrire les informations sensibles directement dans le code source.

---

## 16. Arrêt et nettoyage

Pour arrêter les services de l'environnement local :

```bash
docker compose down
```

Pour arrêter les services et supprimer également les volumes :

```bash
docker compose down -v
```

Attention : la suppression des volumes entraîne la suppression des données stockées dans les volumes concernés.

---

## 17. Objectif du projet

L'objectif principal du projet est de réduire les interventions manuelles lors de l'intégration et du déploiement de l'application.

Le processus permet ainsi de passer automatiquement :

```text
Modification du code
        ↓
Commit
        ↓
Push GitHub
        ↓
Tests automatisés
        ↓
Construction Docker
        ↓
Déploiement Ansible
        ↓
Démarrage avec Docker Compose
        ↓
Vérification de l'application
```

Cette automatisation permet d'obtenir un processus de déploiement plus reproductible, contrôlé et fiable.
