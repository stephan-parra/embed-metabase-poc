document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const reportContainer = document.getElementById('report-container');
    const navLinks = document.querySelectorAll('nav a');

    // Hardcoded credentials
    const validCredentials = {
        username: 'admin',
        password: 'password123'
    };

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === validCredentials.username && password === validCredentials.password) {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    // Object to store Metabase report URLs
    const reportUrls = {
        report1: 'https://reporting.pcges.uk/public/dashboard/035bc09d-9ff9-489d-8085-15e89abf4912',
        report2: 'https://metabase-hpr.safedigs.co.uk/public/dashboard/39496407-bb09-4df3-afa0-ab5d7fce2295',
        report3: 'https://reporting.pcges.us/public/dashboard/105d61ce-45f7-42ab-a3d4-ef018088c0bb',
        report4: 'https://metabase-hpr.safedigs.co.uk/public/question/dfd9c4af-5b56-4097-bc43-6f6e61cdf720',
        report5: 'https://reporting.pcges.us/public/dashboard/f79133e1-44d9-4fbc-8a1b-731b17ba79a0',
        report6: 'https://lsbud-kibana.kb.eu-west-2.aws.cloud.es.io:9243/s/test-space/app/dashboards#/view/be22d123-754a-4703-9c3d-621e26b4ad84?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-7d%2Fd%2Cto%3Anow))&hide-filter-bar=true'
    };


    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const reportId = e.target.getAttribute('data-report');
            if (reportUrls[reportId]) {
                // Remove 'clicked' class from all links
                navLinks.forEach(l => l.classList.remove('clicked'));
                // Add 'clicked' class to the clicked link
                e.target.classList.add('clicked');
                loadReport(reportUrls[reportId]);
                // Remove the 'clicked' class after the animation duration
                setTimeout(() => {
                    e.target.classList.remove('clicked');
                }, 500);
            } else {
                reportContainer.innerHTML = '<h2>Report not available</h2>';
            }
        });
    });


    function loadReport(url) {
        // Clear previous content
        reportContainer.innerHTML = '';

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.frameBorder = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.allowTransparency = true;

        // Append iframe to container
        reportContainer.appendChild(iframe);
    }
});