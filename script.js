document.addEventListener('DOMContentLoaded', () => {
    const reportContainer = document.getElementById('report-container');
    const navLinks = document.querySelectorAll('nav a');

    // Object to store Metabase report URLs
    const reportUrls = {
        report1: 'https://reporting.pcges.us/public/question/a49ef778-c317-4a67-9c86-6b7377cbb739',
        report2: '', // Add URLs for other reports as needed
        report3: '',
        report4: ''
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const reportId = e.target.getAttribute('data-report');
            if (reportUrls[reportId]) {
                loadReport(reportUrls[reportId]);
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