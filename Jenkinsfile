pipeline {
    agent any

    tools {
        nodejs 'node-20' 
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        // --- ETAPA 1: INSTALAR ---
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm install'
            }
        }

        // --- ETAPA 2: TEST ---
        stage('Unit Tests') {
            steps {
                echo 'Ejecutando tests...'
                // sh 'npm run test' <--- Descomenta si tienes tests reales
                sh 'echo "Simulando tests unitarios..."' 
            }
        }

        // --- ETAPA 3: SONARQUBE ---
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarServer') { 
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=poke-devops \
                    -Dsonar.sources=src \
                    -Dsonar.host.url=http://sonarqube:9000 \
                    -Dsonar.login=\$SONAR_TOKEN
                    """
                }
            }
        }

        // --- ETAPA 4: QUALITY GATE ---
        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // --- ETAPA 5: DEPLOY (Solo main) ---
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                    sh """
                        npm install -g vercel
                        vercel pull --yes --environment=production --token=\$VERCEL_TOKEN
                        vercel build --prod --token=\$VERCEL_TOKEN
                        vercel deploy --prebuilt --prod --token=\$VERCEL_TOKEN --yes
                    """ 
                }
            }
        }
    }
}