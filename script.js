document.addEventListener('DOMContentLoaded', () => {
    const reportFrame = document.getElementById('report-frame');
    const navLinks = document.querySelectorAll('nav a');

    // Object to store Metabase report URLs
    const reportUrls = {
        report1: '',
        report2: '',
        report3: '',
        report4: ''
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const reportId = e.target.getAttribute('data-report');
            if (reportUrls[reportId]) {
                reportFrame.src = reportUrls[reportId];
            } else {
                reportFrame.src = '';
                reportFrame.srcdoc = '<h2>Report not available</h2>';
            }
        });
    });
});