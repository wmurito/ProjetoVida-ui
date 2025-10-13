const awsConfig = {
    Auth: {
        Cognito: {
            region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
            userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
            loginWith: {
                email: true
            }
        }
    }
};

export default awsConfig;