document.addEventListener('DOMContentLoaded', () => {
    const reportContainer = document.getElementById('report-container');
    const navLinks = document.querySelectorAll('nav a');

    // Object to store Metabase report URLs
    const reportUrls = {
        report1: 'https://reporting.pcges.us/public/question/a49ef778-c317-4a67-9c86-6b7377cbb739',
        report2: 'http://metabase-hpr.safedigs.co.uk/public/dashboard/39496407-bb09-4df3-afa0-ab5d7fce2295', // Add URLs for other reports as needed
        report3: 'https://reporting.pcges.us/public/dashboard/105d61ce-45f7-42ab-a3d4-ef018088c0bb',
        report4: 'http://metabase-hpr.safedigs.co.uk/public/question/dfd9c4af-5b56-4097-bc43-6f6e61cdf720'
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