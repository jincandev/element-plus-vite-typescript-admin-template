pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        bat(script: 'pnpm i', returnStatus: true, returnStdout: true)
      }
    }

  }
}