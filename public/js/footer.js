function loadFooter() {
    fetch('/html/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footerHTML').innerHTML = data;
        }).catch(error => console.error('Error loading footer:', error));
        
}

document.addEventListener('DOMContentLoaded', loadFooter);