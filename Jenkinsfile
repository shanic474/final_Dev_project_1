pipeline {
    agent any
    environment{
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        KUBECONFIG = "/etc/rancher/k3s/k3s.yaml"
    }

    stages {
        stage('Clean Workspace'){
            steps{
                deleteDir()
            }
        }
        
        stage('Load Apps Config'){
            steps{
                script {
                    // Read apps.json
                    apps = readJSON file: 'apps.json'
                }
            }
        }
        stage('Build, Push, Deploy Apps'){
            steps{
                script {
                    apps.each { app ->
                        echo "Processing app: ${app.name}"
                        stage ('git checkout'){
                            steps{
                                sh "git clone ${app.git_url} ${app.name}"
                            }
                        }
                        stage ('Build Docker image'){
                            steps{
                                sh "docker build --no-cache --build-arg APP_NAME=${app.name} -t ${app.docker_image}:latest ./"               
                            }
                        }
                        stage ('Docker tag'){
                            steps{
                                sh "docker tag ${app.docker_image}:latest ${app.docker_image}:${BUILD_NUMBER}"
                            }
                        }
                        stage ('Docker Push'){
                            steps{
                                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]){
                                    sh '''
                                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                                    docker push ${app.docker_image}:${BUILD_NUMBER} 
                                    '''
                                }
                            }
                        }
                       stage ('deploy image to Kubernetes'){
                            steps{
                                sh "sed -i 's|image:${IMAGE_NAME}:${BUILD_NUMBER}|g' proj1-deployment.yaml"
                                sh "kubectl apply -f proj1-deployment.yaml"
                                sh "kubectl rollout restart deployment proj1-deployment"
                                sh "sed -i 's|image: .*|image: ${app.docker_image}:${BUILD_NUMBER}|g' ${app.k8s_deployment}"
                                sh "kubectl apply -f ${app.k8s_deployment}"
                                sh "kubectl rollout restart deployment ${app.k8s_deployment.replace('.yaml','')}"
                
                            }
                        }
                         stage ('expose the deployment via service'){
                            steps{
                                 sh "kubectl apply -f proj1-service.yaml"
                            }
                        }
    }
}
