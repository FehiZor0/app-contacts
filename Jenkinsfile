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
                sh 'docker compose run --rm backend pytest'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Test SSH VM') {
            steps {
                sshagent(credentials: ['vm-ssh-key']) {
                    sh 'ssh -o StrictHostKeyChecking=yes fehizoro@192.168.56.102 "echo Jenkins-connexion-OK"'
                }
            }   
        }

    }
}