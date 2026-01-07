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

        stage('Build, Push, Deploy Apps in Parallel') {
            steps {
                script {
                    def branches = [:]

                    apps.each { app ->
                        branches[app.name] = {
                            echo "Processing app: ${app.name}"

                            sh "git clone ${app.git_url} ${app.name}"

                            sh "docker build --no-cache --build-arg APP_NAME=${app.name} -t ${app.docker_image}:latest ./"

                            sh "docker tag ${app.docker_image}:latest ${app.docker_image}:${BUILD_NUMBER}"

                            withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]){
                                sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin && docker push ${app.docker_image}:${BUILD_NUMBER}"
                            }

                            sh "sed -i 's|image: .*|image: ${app.docker_image}:${BUILD_NUMBER}|g' ${app.k3s_deployment}"
                            sh "kubectl apply -f ${app.k3s_deployment}"
                            sh "kubectl rollout restart deployment ${app.k3s_deployment.replace('.yaml','')}"

                            sh "kubectl apply -f ${app.k3s_service}"
                        }
                    }

                    // Run all apps in parallel
                    parallel branches
                }
            }
        }
    }
}
