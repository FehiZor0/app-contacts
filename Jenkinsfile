pipeline {
    agent any

    stages {

        stage('Verification') {
            steps {
                sh 'echo "Projet app-contacts récupéré avec succès"'
                sh 'ls -la'
            }
        }

        stage('Tests') {
            steps {
                sh 'test -f backend/Dockerfile'
                sh 'test -f frontend/Dockerfile'
                sh 'test -f docker-compose.yml'
                sh 'echo "Tests de structure réussis"'
            }
        }

    }
}