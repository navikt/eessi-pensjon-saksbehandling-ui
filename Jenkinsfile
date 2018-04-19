import groovy.json.JsonOutput

pipeline {
  agent any
  tools {
    maven('Maven 3.3.9')
  }

  environment {
    repo = "docker.adeo.no:5000"
    FASIT_ENV = 't1'
    APPLICATION_NAMESPACE = 't1'
    ZONE = 'fss'
  }

  stages {
    stage('Initialize') {
      steps {
        script {
          packagejson = readJSON(file: 'package.json')
          app_name = packagejson['name']
          version = packagejson['version']
          if (version.endsWith("-SNAPSHOT")) {
            commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
            version = "${version}.${env.BUILD_ID}-${commitHashShort}"
          }
          applicationFullName = "${app_name}:${version}"
          branchName = "${env.BRANCH_NAME}"
        }
      }
    }

    stage('Build') {
      steps {
        withEnv(["NPM_CONFIG_LOGLEVEL=warn"]) {
          ansiColor('xterm') {
            sh 'npm install'
            sh 'npm run build'
          }
        }
      }
    }

    stage('Test') {
      steps {
        withEnv(["CHROME_BIN=/bin/google-chrome"]) {
          ansiColor('xterm') {
            sh 'ng test --single-run --code-coverage --progress=false --watch false --browsers ChromeHeadless'
          }
        }
        publishHTML([
          allowMissing         : false,
          alwaysLinkToLastBuild: false,
          keepAll              : true,
          reportDir            : 'coverage',
          reportFiles          : 'index.html',
          reportName           : 'HTML Report',
          reportTitles         : ''
        ])
      }
    }

    stage('Docker') {
      steps {
        script {
          docker.withRegistry("https://${repo}") {
            image = docker.build("${applicationFullName}", "--build-arg GIT_COMMIT_ID=${commitHashShort} .")
            image.push()
            image.push('latest')
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          echo "Deploy '${branchName}'?"
          if (branchName.startsWith('feature')) {
            echo "\tdeploying to u89"
            deploy.naisDeploy(app_name, version, 'u89', 'u89', 'fss')
          } else if (branchName == 'master') {
            echo "\tdeploying to t1"
            deploy.naisDeploy(app_name, version, 't1', 't1', 'fss')
          } else {
            echo "Skipping deploy"
          }
        }
      }
    }
  }
}
