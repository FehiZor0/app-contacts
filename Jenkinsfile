pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Tests') {
            steps {
                sh '''
                    docker compose up -d test-database

                    echo "Attente de la base de données de test..."
                    sleep 5

                    docker compose run --rm backend-test pytest
                '''
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            when {
                expression {
                    env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main'
                }
            }

            steps {
                sshagent(credentials: ['vm-ssh-key']) {
                    sh "ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -e git_commit=${env.GIT_COMMIT}"
                }
            }
        }
    }

    post {
        always {
            sh 'docker compose down -v --remove-orphans || true'
        }

        success {
            echo 'Pipeline terminé avec succès'
        }

        failure {
            echo 'Pipeline en échec : consulter les logs du stage concerné'
        }
    }
}