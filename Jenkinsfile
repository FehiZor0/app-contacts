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

        stage('Deploy') {
            steps {
                sshagent(credentials: ['vm-ssh-key']) {
                    sh '''
                        ansible-playbook \
                        -i ansible/inventory.ini \
                        ansible/deploy.yml
                    '''
                }
            }
        }

    }
}