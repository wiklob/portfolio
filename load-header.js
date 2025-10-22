fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-call').innerHTML = data;
        const links = document.querySelectorAll('nav a');
        const whichpage = window.location.pathname.split('/').pop() || 'index.html';
        links.forEach(link => {
            if(link.getAttribute('href') === whichpage) {
                link.classList.add('active')
            }
        })
    })

    .catch(error => console.error('error when loading header:', error))
