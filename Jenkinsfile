#!/usr/bin/env groovy
@Library('jenkins-pipeline-lib') _

node {
    def commitHash
    try {
        cleanWs()

        stage("checkout") {
            withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'GITHUB_OAUTH_TOKEN')]) {
                sh "git init"
                sh "git pull https://${GITHUB_OAUTH_TOKEN}:x-oauth-basic@github.com/navikt/eessi-pensjon-frontend-ui.git"
                sh "git fetch --tags https://${GITHUB_OAUTH_TOKEN}:x-oauth-basic@github.com/navikt/eessi-pensjon-frontend-ui.git"
            }
            commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
            github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-frontend-ui", 'continuous-integration/jenkins', commitHash, 'pending', "Build #${env.BUILD_NUMBER} has started")
        }

        stage("build") {
            sh "make"
        }

        stage("release") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} repo.adeo.no:5443"
            }

            sh "make release"

            withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'GITHUB_OAUTH_TOKEN')]) {
                sh "git push --tags https://${GITHUB_OAUTH_TOKEN}@github.com/navikt/eessi-pensjon-frontend-ui HEAD:master"
            }
        }

        stage("upload manifest") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "make manifest"
            }
        }

        stage("deploy FSS") {
            def version = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
            build([
                    job       : 'nais-deploy-pipeline',
                    wait      : true,
                    parameters: [
                            string(name: 'APP', value: "eessi-pensjon-frontend-ui-fss"),
                            string(name: 'REPO', value: "navikt/eessi-pensjon-frontend-ui"),
                            string(name: 'VERSION', value: version),
                            string(name: 'DEPLOY_REF', value: version),
                            string(name: 'DEPLOY_ENV', value: 't8'),
                            string(name: 'NAMESPACE', value: 't8'),
                            string(name: 'CLUSTER', value: 'fss')
                    ]
            ])
        }

        stage("deploy SBS") {
            def version = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
            build([
                job       : 'nais-deploy-pipeline',
                wait      : true,
                parameters: [
                    string(name: 'APP', value: "eessi-pensjon-frontend-ui-sbs"),
                    string(name: 'REPO', value: "navikt/eessi-pensjon-frontend-ui"),
                    string(name: 'VERSION', value: version),
                    string(name: 'DEPLOY_REF', value: version),
                    string(name: 'DEPLOY_ENV', value: 't8'),
                    string(name: 'NAMESPACE', value: 't8'),
                    string(name: 'CLUSTER', value: 'sbs')
                ]
            ])
        }

        github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-frontend-ui", 'continuous-integration/jenkins', commitHash, 'success', "Build #${env.BUILD_NUMBER} has finished")
    } catch (err) {
        github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-frontend-ui", 'continuous-integration/jenkins', commitHash, 'failure', "Build #${env.BUILD_NUMBER} has failed")
        throw err
    }
}
