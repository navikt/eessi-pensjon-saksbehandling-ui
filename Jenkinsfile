#!/usr/bin/env groovy
@Library('jenkins-pipeline-lib') _

node {
    def commitHash
    try {
        cleanWs()

        stage("checkout") {
                appToken = github.generateAppToken()

                sh "git init"
                sh "git pull https://x-access-token:$appToken@github.com/navikt/eessi-pensjon-frontend-ui.git"
                sh "make bump-version"

                commitHash = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                github.commitStatus("pending", "navikt/eessi-pensjon-frontend-ui", appToken, commitHash)
        }

        stage("build") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} repo.adeo.no:5443"
            }
            sh "make"
        }

        stage("release") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} repo.adeo.no:5443"
            }

            sh "make release"
            sh "git push --tags https://x-access-token:$appToken@github.com/navikt/eessi-pensjon-frontend-ui HEAD:master"
        }

        stage("upload manifest") {
            withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
                sh "make manifest"
            }
        }

        stage("deploy T8") {
            parallel(
                deploy_to_fss: {
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
                },
                deploy_to_sbs:{
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
                },
                failFast: true
            )
        }

        stage("Cucumber tests") {
                         build([
                             job       : 'Automatiske tester',
                             wait      : true,
                             parameters: [
                                 string(name: 'environment', value: "autotest_env_T"),
                                 booleanParam(name: 'testsaksbehandler', value: false),
                                 booleanParam(name: 'testBorger', value: true),
                                 booleanParam(name: 'testKravAlder', value: false)
                             ]
                          ])
                }

        stage("deploy Q1") {
                parallel (
                    deploy_to_fss: {
                        def version = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
                        build([
                            job       : 'nais-deploy-pipeline',
                            wait      : true,
                            parameters: [
                                string(name: 'APP', value: "eessi-pensjon-frontend-ui-fss"),
                                string(name: 'REPO', value: "navikt/eessi-pensjon-frontend-ui-fss"),
                                string(name: 'VERSION', value: "${version}"),
                                string(name: 'DEPLOY_REF', value: "${version}"),
                                string(name: 'DEPLOY_ENV', value: 'q1'),
                                string(name: 'NAMESPACE', value: 'default'),
                                string(name: 'CLUSTER', value: 'fss'),
                                string(name: 'CONTEXT_ROOTS', value: '/callback')
                            ]
                        ])
                    },
                    deploy_to_sbs: {
                        def version = sh(script: 'git describe --abbrev=0', returnStdout: true).trim()
                        build([
                            job       : 'nais-deploy-pipeline',
                            wait      : true,
                            parameters: [
                                string(name: 'APP', value: "eessi-pensjon-frontend-ui-sbs"),
                                string(name: 'REPO', value: "navikt/eessi-pensjon-frontend-ui-sbs"),
                                string(name: 'VERSION', value: "${version}"),
                                string(name: 'DEPLOY_REF', value: "${version}"),
                                string(name: 'DEPLOY_ENV', value: 'q1'),
                                string(name: 'NAMESPACE', value: 'default'),
                                string(name: 'CLUSTER', value: 'sbs'),
                                string(name: 'CONTEXT_ROOTS', value: '/callback')
                            ]
                        ])
                    },
                    failFast: true
                )
            }

        github.commitStatus("success", "navikt/eessi-pensjon-frontend-ui", appToken, commitHash)
    } catch (err) {
        github.commitStatus("success", "navikt/eessi-pensjon-frontend-ui", appToken, commitHash)
        throw err
    }
}
