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

    stage('Nais') {
      steps {
        script {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexus-user', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD']]) {
            sh('nais validate')
//                        sh "nais upload --app ${app_name} -v ${version}"
          }
        }
      }
    }

//        stage('deploy to nais') {
//            steps {
//                script {
//                    def postBody = [
//                            fields: [
//                                    project          : [key: "DEPLOY"],
//                                    issuetype        : [id: "14302"],
//                                    customfield_14811: [value: "${env.FASIT_ENV}"],
//                                    customfield_14812: "${applicationFullName}",
//                                    customfield_17410: "${env.BUILD_URL}input/Deploy/",
//                                    customfield_19015: [id: "22707", value: "Yes"],
//                                    customfield_19413: "${env.APPLICATION_NAMESPACE}",
//                                    customfield_19610: [value: "${env.ZONE}"],
//                                    summary          : "Automatisk deploy av ${applicationFullName} til ${env.FASIT_ENV}"
//                            ]
//                    ]
//
//                    def jiraPayload = groovy.json.JsonOutput.toJson(postBody)
//
//                    echo jiraPayload
//
//                    def response = httpRequest([
//                            url                   : "https://jira.adeo.no/rest/api/2/issue/",
//                            authentication        : "nais-user",
//                            consoleLogResponseBody: true,
//                            contentType           : "APPLICATION_JSON",
//                            httpMode              : "POST",
//                            requestBody           : jiraPayload
//                    ])
//
//                    def jiraIssueId = readJSON([text: response.content])["key"]
//                    currentBuild.description = "Waiting for <a href=\"https://jira.adeo.no/browse/$jiraIssueId\">${jiraIssueId}</a>"
//                }
//            }
//        }
  }
}
