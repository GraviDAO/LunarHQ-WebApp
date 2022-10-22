pipeline {
    agent any

    stages {
        stage('Deliver') {
            steps {
                echo 'Pulling to staging and deploying ...'
                sh """(cd /root/gravidao/LunarHQ-WebApp;git stash;git pull;git stash pop;npm run build;cp -r dist/lunar-hq-web-app/* ../LunarHQ/public/www/)"""
            }
        }
    }
}
