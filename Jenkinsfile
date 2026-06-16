pipeline {
    agent any;
    
    stages {
        
        stage('Cloning project from GitHub') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Ophidev/FitFlow.git'
            }
        }
        
        stage('Verify Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'ls -la Backend'
            }
        }
        
        stage('Build Backend image') {
            steps {
                sh 'docker build -t fitflow-backend:latest ./Backend'
            }
        }
        
        stage('Tag and Push build Backend image in DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId:"dockerHubCreds",
                    usernameVariable:"dockerHubUser",
                    passwordVariable:"dockerHubPass"
                    )]){
                    // Using double quotes allows Jenkins to safely substitute the variables before executing the shell
                    sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                    sh "docker image tag fitflow-backend:latest ${env.dockerHubUser}/fitflow-backend:latest"
                    sh "docker push ${env.dockerHubUser}/fitflow-backend:latest"
                }   
            }
        }
        
    }
}