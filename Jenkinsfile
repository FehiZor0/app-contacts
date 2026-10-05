pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

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
            // Déploiement uniquement depuis la branche main
            when {
                expression {
                    env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main'
                }
            }
            steps {
                sshagent(credentials: ['vm-ssh-key']) {
                    // Le commit testé par Jenkins est celui qui sera déployé
                    sh "ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -e git_commit=${env.GIT_COMMIT}"
                }
            }
        }
    }

    post {
        always {
            // Arrête et supprime la base et les conteneurs lancés pour les tests
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