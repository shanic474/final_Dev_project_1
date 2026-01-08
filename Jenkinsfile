pipeline {
    agent any

    environment {
        IMAGE_NAME = "s10shani/proj1"
        KUBECONFIG = "/etc/rancher/k3s/k3s.yaml"
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                git url: 'https://github.com/shanic474/final_Dev_project_1.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build \
                  --no-cache \
                  --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
                  -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                sed -i 's|image: .*|image: ${IMAGE_NAME}:${BUILD_NUMBER}|' proj1-deployment.yaml
                kubectl apply -f proj1-deployment.yaml
                kubectl rollout status deployment proj1-deployment
                """
            }
        }

        stage('Expose Service') {
            steps {
                sh "kubectl apply -f proj1-service.yaml"
            }
        }
    }
}
