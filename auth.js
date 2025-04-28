const cognitoDomain = 'https://ap-southeast-2oe66r4s7y.auth.ap-southeast-2.amazoncognito.com';
const clientId = 'ieoovlck69k8r2h379lhqd5ch';
const redirectUri = 'https://stephan-parra.github.io/embed-metabase-poc/index.html';
const logoutUri = 'https://stephan-parra.github.io/embed-metabase-poc/index.html';

document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    const logoutButton = document.getElementById('logout-button');

    // Check if tokens are already stored
    const idToken = sessionStorage.getItem('id_token');
    const accessToken = sessionStorage.getItem('access_token');

    if (!idToken || !accessToken) {
        // Check if redirected back from Cognito with auth code
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            exchangeCodeForTokens(authCode);
        } else {
            redirectToCognitoLogin();
        }
    } else {
        // Already logged in
        dashboardContainer.style.display = 'flex';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }
});

function redirectToCognitoLogin() {
    const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
}

function exchangeCodeForTokens(code) {
    const tokenUrl = `${cognitoDomain}/oauth2/token`;

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: code,
        redirect_uri: redirectUri
    });

    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        if (data.id_token && data.access_token) {
            sessionStorage.setItem('id_token', data.id_token);
            sessionStorage.setItem('access_token', data.access_token);
            window.history.replaceState({}, document.title, redirectUri); // Clean up URL
            document.getElementById('dashboard-container').style.display = 'flex';
        } else {
            console.error('Token exchange failed:', data);
            redirectToCognitoLogin();
        }
    })
    .catch(err => {
        console.error('Error during token exchange:', err);
    });
}

function logout() {
    // Clear session tokens
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');

    // Redirect to Cognito logout
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    window.location.href = logoutUrl;
}