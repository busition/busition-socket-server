pipeline {
    agent any

    environment {
        imagename = "busition-socket-server"
        registryCredential = 'wookingwoo'
        version = '1.0'
        dockerImage = ''
    }

    stages {

        // old docker delete
        stage('Delete old Docker') {
          options {
<<<<<<< HEAD
                continueOnError true
=======
                continueOnError true 
>>>>>>> feature/CICD
            }
          steps {
            echo 'Delete Old Docker'
            sh "docker stop ${imagename}"
            sh "docker rm ${imagename}"
            sh "docker rmi ${imagename}:${version}"
            }

        }

        // docker build
        stage('Bulid Docker') {
          agent any
          steps {
            echo 'Bulid Docker'
            script {
                dockerImage = docker.build("${imagename}:${version}", "--no-cache .")
            }
          }
          post {
            failure {
              error 'This pipeline stops here...'
            }
          }
        }

        // docker run
        stage('Run Docker') {
          agent any
          steps {
            echo 'Run Docker '
            sh "docker run -d --name ${imagename} -p 3000:3000 --restart=unless-stopped ${imagename}:${version}"
          }
          post {
            failure {
              error 'This pipeline stops here...'
            }
          }
        }

        // docker Deploy
        // stage('Deploy Docker') {
        //   agent any
        //   steps {
        //     echo 'Deploy Docker '
        //     sh 'tag=${version} docker-compose -f ./docker/docker-compose.yml up -d'
        //   }
        //   post {
        //     failure {
        //       error 'This pipeline stops here...'
        //     }
        //   }
        // }

        // docker push
        // stage('Push Docker') {
        //   agent any
        //   steps {
        //     echo 'Push Docker'
        //     script {
        //         docker.withRegistry( '', registryCredential) {
        //             dockerImage.push(version)
        //         }
        //     }
        //   }
        //   post {
        //     failure {
        //       error 'This pipeline stops here...'
        //     }
        //   }
        // }
    }
}



