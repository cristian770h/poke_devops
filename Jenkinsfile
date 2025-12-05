pipeline {
    agent any

    tools {
        nodejs 'node-20' // Debe coincidir con el nombre que pusiste en Jenkins
    }

    environment {
        // Pon aquí los IDs que sacaste del archivo .vercel/project.json
        VERCEL_ORG_ID = ''
        VERCEL_PROJECT_ID = 'TU_PROJECT_ID_AQUI' 
        
        // Definir scanner
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                // Aquí podrías correr 'npm run test', pero asegurate de tener tests
                // Si no tienes tests creados, crea un script dummy en package.json o comenta esto
                sh 'echo "Running tests..."' 
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarServer') {
                    // Análisis estático conectado al contenedor de Sonar
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

        stage('Quality Gate') {
            steps {
                // Espera respuesta de Sonar. Si falla (Bugs > 0), el pipeline se detiene [cite: 32]
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                // Inyectamos SOLO el token secreto
                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                    sh """
                        npm install -g vercel
                        
                        # Al no pasar los IDs explícitamente aquí, Vercel los buscará 
                        # en las variables de entorno que configuraste en el Paso A.
                        # El PDF pide pasar IDs para evitar interactividad [cite: 52]
                        # Vercel CLI detecta automáticamente VERCEL_ORG_ID y VERCEL_PROJECT_ID si existen como variables.
                        
                        vercel pull --yes --environment=production --token=\$VERCEL_TOKEN
                        vercel build --prod --token=\$VERCEL_TOKEN
                        vercel deploy --prebuilt --prod --token=\$VERCEL_TOKEN --yes
                    """ 
                }
            }
        }
    }
}