pipeline {
    agent any
    environment{
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_NAME = "s10shani/proj1"
        KUBECONFIG = "/etc/rancher/k3s/k3s.yaml"
    }

    stages {
        
        stage ('git checkout'){
            steps{
                deleteDir()
                git url: 'https://github.com/shanic474/final_Dev_project_1.git', branch: 'main'
            }
        }
        stage ('Build Docker image'){
            steps{
                sh "docker build --no-cache -t ${IMAGE_NAME}:latest ."

            }
        }
        stage ('Docker tag'){
            steps{
                 sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }
        stage ('Docker Push'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]){
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER} 
                    '''
                }
            }
        }
       stage ('deploy image to Kubernetes'){
            steps{
                sh "sed -i 's|image: s10shani/proj1:.*|image: ${IMAGE_NAME}:${BUILD_NUMBER}|g' proj1-deployment.yaml"
                sh "kubectl apply -f proj1-deployment.yaml"
                sh "kubectl rollout restart deployment proj1-deployment"

            }
        }
         stage ('expose the deployment via service'){
            steps{
                 sh "kubectl apply -f proj1-service.yaml"
            }
        }
    }
}
