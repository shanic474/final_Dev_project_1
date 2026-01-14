pipeline {
    agent any

    environment {
        IMAGE_NAME = "s10shani/proj1"
        IMAGE_TAG  = "${BUILD_NUMBER}"
        KUBECONFIG = "/etc/rancher/k3s/k3s.yaml"
    }

    stages {

        stage('Git Checkout') {
            steps {
                deleteDir()
                git branch: 'main',
                    url: 'https://github.com/shanic474/final_Dev_project_1.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                  docker build -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh """
                  docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                      echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                      docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes (Deployment)') {
            steps {
                sh """
                  kubectl set image deployment/proj1-deployment \
                  proj1-container=${IMAGE_NAME}:${IMAGE_TAG} --record || true

                  kubectl apply -f proj1-deployment.yaml
                  kubectl rollout status deployment proj1-deployment
                """
            }
        }

        stage('Expose via Service (NodePort)') {
            steps {
                sh """
                  kubectl apply -f proj1-service.yaml
                  kubectl get svc proj1-service
                """
            }
        }
    }
}
