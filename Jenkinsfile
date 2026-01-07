pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/etc/rancher/k3s/k3s.yaml"
    }

    stages {
        stage('Clean Workspace') {
            steps { deleteDir() }
        }

        stage('Load Apps Config') {
            steps {
                script { apps = readJSON file: 'apps.json' }
            }
        }

        stage('Git Checkout') {
            steps {
                script {
                    apps.each { app ->
                        echo "Cloning ${app.name}"
                        sh "git clone ${app.git_url} ${app.name}"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    apps.each { app ->
                        echo "Building Docker image for ${app.name}"
                        sh "docker build --no-cache --build-arg APP_NAME=${app.name} -t ${app.docker_image}:latest ./"
                    }
                }
            }
        }

        stage('Docker Tag') {
            steps {
                script {
                    apps.each { app ->
                        echo "Tagging ${app.name}"
                        sh "docker tag ${app.docker_image}:latest ${app.docker_image}:${BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]){
                        apps.each { app ->
                            echo "Pushing ${app.name}"
                            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin && docker push ${app.docker_image}:${BUILD_NUMBER}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    apps.each { app ->
                        echo "Deploying ${app.name}"
                        sh "sed -i 's|image: .*|image: ${app.docker_image}:${BUILD_NUMBER}|g' ${app.k3s_deployment}"
                        sh "kubectl apply -f ${app.k3s_deployment}"
                        sh "kubectl rollout restart deployment ${app.k3s_deployment.replace('.yaml','')}"
                    }
                }
            }
        }

        stage('Expose Services') {
            steps {
                script {
                    apps.each { app ->
                        echo "Applying service for ${app.name}"
                        sh "kubectl apply -f ${app.k3s_service}"
                    }
                }
            }
        }
    }
}
