pipeline {
    agent any

    tools {
        nodejs 'node-20' 
    }

    environment {
        // YA NO NECESITAS PONER LOS IDs AQUÍ
        // Jenkins los inyectará automáticamente desde la configuración global
        
        // Solo definimos variables locales o herramientas
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        // ... (El resto de tus etapas igual) ...

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