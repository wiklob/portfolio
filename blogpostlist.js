fetch('https://wiktorloboda.substack.com/feed')
    .then(response => response.text())
    .then(data => {
        console.print(data)
    })