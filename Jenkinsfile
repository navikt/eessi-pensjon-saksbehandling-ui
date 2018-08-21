#!/usr/bin/env groovy
@Library('jenkins-pipeline-lib') _

node {
    def commitHash
    try {
        cleanWs()

        stage("checkout") {
            withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'GITHUB_OAUTH_TOKEN')]) {
                sh "git init"
                sh "git pull https://${GITHUB_OAUTH_TOKEN}:x-oauth-basic@github.com/navikt/eessi-pensjon-fagmodul-frontend.git"
                sh "git fetch --tags https://${GITHUB_OAUTH_TOKEN}:x-oauth-basic@github.com/navikt/eessi-pensjon-fagmodul-frontend.git"
            }

            commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
            github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-fagmodul-frontend", 'continuous-integration/jenkins', commitHash, 'pending', "Build #${env.BUILD_NUMBER} has started")
        }

        stage("build") {
            try {
                sh "make"
            } catch (e) {
                junit('build/test-results/test/**/*.xml')
                publishHTML([
                        allowMissing         : false,
                        alwaysLinkToLastBuild: false,
                        keepAll              : true,
                        reportDir            : 'build/reports/tests/test',
                        reportFiles          : 'index.html',
                        reportName           : 'HTML Report',
                        reportTitles         : ''
                ])

                throw e
            }
        }

        stage("release") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} repo.adeo.no:5443"
            }

            sh "make release"

            withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'GITHUB_OAUTH_TOKEN')]) {
                sh "git push --tags https://${GITHUB_OAUTH_TOKEN}@github.com/navikt/eessi-pensjon-fagmodul-frontend HEAD:master"
            }
        }

        stage("upload manifest") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "make manifest"
            }
        }

        stage("deploy") {
            /*if (params.OPENAM_CONTEXT_ROOT) {
                if (params.CLUSTER == "fss") {
                    def namedBaseUrl = "https://named.nais.preprod.local"
                    if (params.DEPLOY_ENV == "p") {
                        namedBaseUrl = "https://named.nais.adeo.no"
                    }
                    deploy.registerToAMFSS(params.SERVICE_USER_CREDENTIALS_ID, namedBaseUrl, params.APP, params.VERSION, params.DEPLOY_ENV, params.CLUSTER, params.OPENAM_CONTEXT_ROOT)
                } else {
                    def namedBaseUrl = "https://named.nais.oera-q.local"
                    if (params.DEPLOY_ENV == "p") {
                        namedBaseUrl = "https://named.nais.oera.no"
                    }
                    deploy.registerToAMSBS(params.SERVICE_USER_CREDENTIALS_ID, namedBaseUrl, params.APP, params.VERSION, params.DEPLOY_ENV, params.CLUSTER)
                }
            }*/

            def version = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
            build([
                    job       : 'nais-deploy-pipeline',
                    wait      : true,
                    parameters: [
                            string(name: 'APP', value: "eessi-fagmodul-frontend"),
                            string(name: 'REPO', value: "navikt/eessi-pensjon-fagmodul-frontend"),
                            string(name: 'VERSION', value: version),
                            string(name: 'DEPLOY_REF', value: version),
                            string(name: 'DEPLOY_ENV', value: 't1')
                    ]
            ])
        }

        github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-fagmodul-frontend", 'continuous-integration/jenkins', commitHash, 'success', "Build #${env.BUILD_NUMBER} has finished")
    } catch (err) {
        github.commitStatus("navikt-ci-oauthtoken", "navikt/eessi-pensjon-fagmodul-frontend", 'continuous-integration/jenkins', commitHash, 'failure', "Build #${env.BUILD_NUMBER} has failed")

        throw err
    }
}
