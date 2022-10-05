let goBackBtn = document.getElementById('goBackBtn');
let logoutBtn = document.getElementById('logoutBtn');

goBackBtn.addEventListener('click', () => {
    window.location = '/';
})

logoutBtn.addEventListener('click', () => {

    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/logout', true);
    xhttp.onload = function() {
        window.location = '/';
    }
    xhttp.send();
})