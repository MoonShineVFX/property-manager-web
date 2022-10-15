pipeline {
    environment {
        WEB_FOLDER = 'property'
        API_URL = "${PROPERTY_API_URL}"
        PUBLIC_URL = "${PROPERTY_PUBLIC_URL}"
    }
    agent {
        docker {
            image 'node:16-alpine'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                sh "rm -rf /var/web/${WEB_FOLDER}"
                sh "mv ./build /var/web/${WEB_FOLDER}"
                sh "chmod -R 755 /var/web/${WEB_FOLDER}"
            }
        }
    }
}
