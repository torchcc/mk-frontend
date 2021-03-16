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
    sh "mv -f /home/ubuntu/docker_data/nginx/data/html/dist /home/ubuntu/docker_data/nginx/data/html/last_dist"
    sh "npm install"
    sh "rm -rf ./dist/*"
    sh "npm run build"
    sh "mv -f ./dist /home/ubuntu/docker_data/nginx/data/html/dist"
}

pipeline {
    agent any

    environment {
        scmVars = null
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Prepare Env') {
            steps {
                echo 'Preparing Env...'
                // need to install workspace plugin
                cleanWs()
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '47238156-6f3a-4339-9495-12d51b6c9577', url: 'git@github.com:Torchcc/mk-frontend.git']]])
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
