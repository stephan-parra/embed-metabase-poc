const cognitoDomain = 'ap-southeast-2oe66r4s7y.auth.ap-southeast-2.amazoncognito.com'; // Adjusted domain
const clientId = 'ieoovlck69k8r2h379lhqd5ch';
const redirectUri = 'https://stephan-parra.github.io/embed-metabase-poc/index.html';

document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    const reportContainer = document.getElementById('report-container');
    const navLinks = document.querySelectorAll('nav a');

    // Check if tokens already exist
    const idToken = sessionStorage.getItem('id_token');
    const accessToken = sessionStorage.getItem('access_token');

    if (!idToken || !accessToken) {
        // If redirected back from Cognito with auth code
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            exchangeCodeForTokens(authCode);
        } else {
            // Redirect to Cognito Hosted UI
            redirectToCognitoLogin();
        }
    } else {
        // Tokens already available
        initializeDashboard();
    }

    // Navigation link handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const reportId = e.target.getAttribute('data-report');
            if (reportUrls[reportId]) {
                if (reportUrls[reportId] === 'dynamic' && reportId === 'report8') {
                    fetchDynamicReport('https://ncknx15qsh.execute-api.ap-southeast-2.amazonaws.com/uat/embed-question?memberid=138');
                } else if (reportUrls[reportId] === 'dynamic' && reportId === 'report7') {
                    fetchDynamicReport('https://ncknx15qsh.execute-api.ap-southeast-2.amazonaws.com/uat/embed-question?memberid=11062');
                } else {
                    navLinks.forEach(l => l.classList.remove('clicked'));
                    e.target.classList.add('clicked');
                    loadReport(reportUrls[reportId]);
                    setTimeout(() => e.target.classList.remove('clicked'), 500);
                }
            }
        });
    });

    const reportUrls = {
        report1: 'https://reporting.pcges.uk/public/dashboard/035bc09d-9ff9-489d-8085-15e89abf4912',
        report2: 'https://metabase-hpr.safedigs.co.uk/public/dashboard/39496407-bb09-4df3-afa0-ab5d7fce2295',
        report3: 'https://reporting.pcges.us/public/dashboard/105d61ce-45f7-42ab-a3d4-ef018088c0bb',
        report4: 'https://metabase-hpr.safedigs.co.uk/public/question/dfd9c4af-5b56-4097-bc43-6f6e61cdf720',
        report5: 'https://reporting.pcges.us/public/dashboard/f79133e1-44d9-4fbc-8a1b-731b17ba79a0',
        report6: 'https://lsbud-kibana.kb.eu-west-2.aws.cloud.es.io:9243/s/test-space/app/dashboards#/view/be22d123-754a-4703-9c3d-621e26b4ad84?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-7d%2Fd%2Cto%3Anow))&hide-filter-bar=true',
        report7: 'dynamic',
        report8: 'dynamic'
    };

    function initializeDashboard() {
        dashboardContainer.style.display = 'flex';
    }

    function redirectToCognitoLogin() {
        const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
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
                initializeDashboard();
            } else {
                console.error('Failed to exchange code for tokens:', data);
            }
        })
        .catch(err => {
            console.error('Error exchanging auth code:', err);
        });
    }

    function loadReport(url) {
        reportContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.frameBorder = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.allowTransparency = true;
        reportContainer.appendChild(iframe);
    }

    function fetchDynamicReport(url) {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            console.error('No access token available.');
            return;
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            loadReport(data.iframeUrl);
        })
        .catch(err => {
            console.error('Error loading dynamic report', err);
            reportContainer.innerHTML = '<h2>Error loading dynamic report</h2>';
        });
    }
});