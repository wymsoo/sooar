function loadNavbar() {
    fetch('/html/navbar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('nav').innerHTML = data;
        }).then(()=>{
            if (sessionStorage.getItem('login-status')=='true'){
                console.log('logged in')
                document.querySelector('#nav #login-user').innerText = "登出"
            } else {
                console.log('not logged in');
                document.querySelector('#nav #login-user').innerText = "登入"
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
        
}

document.addEventListener('DOMContentLoaded', loadNavbar);

function logout() {
    window.location.href = "/html/login.html";
    if (sessionStorage.getItem('login-status') == 'true') {
        sessionStorage.setItem('login-status', 'false');
    } 
};



