const awsConfig = {
    Auth: {
        Cognito: {
            region: 'us-east-1', // sua região
            userPoolId: 'us-east-1_h48q7uFnQ', // ID do User Pool
            userPoolClientId: 'q902jjsdui59k28qk0g3s9o3v', // App Client ID
            loginWith: {
                email: true
            }
        }
    }
};

export default awsConfig;