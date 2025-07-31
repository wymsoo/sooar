function loadNavbar() {
    if (sessionStorage.getItem("role") == "instructor") {
        fetch('/html/navbar_coach.html')
            .then(res => res.text())
            .then(data => {
                document.getElementById('newnav').innerHTML = data;
            }).then(() => {
                if (sessionStorage.getItem('login-status') == 'true') {
                    console.log('logged in')
                    document.querySelector('#newnav #login-user').innerText = "登出"
                } else {
                    console.log('not logged in');
                    document.querySelector('#newnav #login-user').innerText = "登入"
                }
            })
            .catch(error => console.error('Error loading navbar:', error));

    } else if (sessionStorage.getItem("role") == "student") {
        fetch('/html/navbar_student.html')
            .then(res => res.text())
            .then(data => {
                document.getElementById('newnav').innerHTML = data;
            }).then(() => {
                if (sessionStorage.getItem('login-status') == 'true') {
                    console.log('logged in')
                    document.querySelector('#newnav #login-user').innerText = "登出"
                } else {
                    console.log('not logged in');
                    document.querySelector('#newnav #login-user').innerText = "登入"
                }
            })
            .catch(error => console.error('Error loading navbar:', error));
    } else {
        fetch('/html/navbar.html')
            .then(res => res.text())
            .then(data => {
                document.getElementById('newnav').innerHTML = data;
            }).then(() => {
                if (sessionStorage.getItem('login-status') == 'true') {
                    console.log('logged in')
                    document.querySelector('#newnav #login-user').innerText = "登出"
                } else {
                    console.log('not logged in');
                    document.querySelector('#newnav #login-user').innerText = "登入"
                }
            })
            .catch(error => console.error('Error loading navbar:', error));

    }
}
document.addEventListener('DOMContentLoaded', loadNavbar);

function logout() {
    if (sessionStorage.getItem('login-status') == 'true') {
        sessionStorage.setItem('login-status', "false");
        sessionStorage.removeItem('current-user');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role')
        fetch('/auth/logout').then(res=>res.json()).then((data)=>{
            if(data.success){
                window.location.href = "/html/login.html";
                alert(data.message)
            }
        }).catch((e)=>console.error(e))
    } else {
        window.location.href="/html/login.html"
    }
};
