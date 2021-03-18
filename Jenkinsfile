#!/usr/bin/env groovy
// Declarative //

def getLatestVersion(branch) {
    if (branch == 'release') {
        return 'RELEASE-LATEST'
    } else {
        return 'SNAPSHOT'
    }
}

def build(branch) {
    echo '****************************** vue start... ******************************'
    echo 'going to build branch ' + branch
    sh "if [ -d /home/ubuntu/docker_data/nginx/data/html/dist ]; then mv /home/ubuntu/docker_data/nginx/data/html/dist /home/ubuntu/docker_data/nginx/data/html/last_dist; fi"
    sh "cnpm install"
    sh "if [ -d ./dist ]; then rm -r ./dist/*; fi"
    sh "npm run build"
    sh "mv ./dist /home/ubuntu/docker_data/nginx/data/html/dist"
}

pipeline {
    agent any

    environment {
        scmVars = null
    }
    tools {
       nodejs 'nodejs-15'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Prepare Env') {
            steps {
                echo 'Preparing Env...'
                // need to install workspace plugin
//                 cleanWs()
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'Troy-personal-git-private', url: 'git@github.com:Torchcc/mk-frontend.git']]])
                echo "checkout to path ${env.WORKSPACE}"
            }
        }
        stage('Build') {
            steps {
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
                build('master')
            }
        }
    }
    post {
        always {
            emailext(
                subject: '构建通知：${PROJECT_NAME} - Build # ${BUILD_NUMBER} -${BUILD_STATUS}!',
                body: '${FILE,path="email.html"}',
                to: 'troymm@163.com'
            )
        }
    }
}
