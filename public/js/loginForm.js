

let loginPopBtn = document.getElementById('loginPopupBtn');
let loginForm = document.getElementById('popupLogin');


loginPopBtn.addEventListener('click', loadLoginForm);

function loadLoginForm(e) {
    e.preventDefault();
    let loginFormHTML = '';
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', '/getLoginForm', true);

    xhttp.onprogress = () => {
        loginForm.style.visibility = 'visible';
        loginForm.style.opacity = 1;
        loginForm.innerHTML = '<div class="loader"></div>';
    }

    xhttp.onload = function () {
        loginFormHTML = this.response;
        validateLogin(loginFormHTML);
    }
    xhttp.send();
}

function validateLogin(loginFormHTML) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', '/login', true);

    xhttp.onprogress = () => {
        loginForm.style.visibility = 'visible';
        loginForm.style.opacity = 1;
        loginForm.innerHTML = '<div class="loader"></div>';
    }
    xhttp.onload = function () {
        let data = JSON.parse(this.response);
        if (!data.token) {
            loginForm.innerHTML = loginFormHTML;
            let closeLoginBtn = document.getElementById('closeLoginBtn');
            let loginBtn = document.getElementById('loginBtn');

            loginBtn.addEventListener('click', function (e) {
                e.preventDefault();
                sendLoginDetails(loginFormHTML);
            });
            closeLoginBtn.addEventListener('click', closeLoginPopUp);

        }
        else if (data.token) {
            window.location = '/homepage';
        }
    }
    xhttp.send();
}

function sendLoginDetails(loginFormHTML) {

    let formData = {
        emailInput: document.getElementById('emailInput').value,
        passInput: document.getElementById('passInput').value
    }
    fetch('/loginData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        // console.log(response)
        getHomePageviaLogin(loginFormHTML);
    });
}

function getHomePageviaLogin(loginFormHTML) {

    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/homepage', true);
    xhttp.onprogress = () => {
        loginForm.style.visibility = 'visible';
        loginForm.style.opacity = 1;
        loginForm.innerHTML = '<div class="loader"></div>';
    }
    xhttp.onload = function () {
        let contentType = xhttp.getResponseHeader('Content-Type');
        if (contentType === "application/json") {
            try {
                let data = JSON.parse(this.response);
                if (!data.confirm) {
                    loginForm.innerHTML = loginFormHTML;
                    let closeLoginBtn = document.getElementById('closeLoginBtn');
                    let loginBtn = document.getElementById('loginBtn');
                    let alertBox = document.getElementById('alert-box');


                    loginBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        sendLoginDetails(loginFormHTML)
                    });
                    closeLoginBtn.addEventListener('click', closeLoginPopUp);

                    createAndDisplayAlert(alertBox, data.data);

                }
            }
            catch (err) {
                console.log(err);
                window.location = '/homepage'
            }
        }
        else {
            window.location = '/homepage'
        }
    }
    xhttp.send();
}


function closeLoginPopUp(e) {
    e.preventDefault();
    sessionStorage.clear();
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/', true);

    xhttp.onload = function () {
        loginForm.style.visibility = 'hidden';
        loginForm.style.opacity = 0;
        loginForm.innerHTML = '';
    }
    xhttp.send();
}

function createAndDisplayAlert(alertContainer, alertData) {
    let alert = document.createElement('div');
    alertContainer.appendChild(alert);
    alert.innerHTML = alertData;
    alert.id = 'alert';
    alert.classList.add("alert", "danger-alert")
    alert.style.visibility = 'visible';
    alert.style.animation = 'showAlertLeft 5s ease-in-out';

    errArr.unshift(alert);
    errArr.map((currentAlert, index) => {
        currentAlert.style.top = (index * 100) + "px";
    })

    setTimeout(() => {
        alertContainer.removeChild(alert)
        errArr.pop();
    }, 5000);
}