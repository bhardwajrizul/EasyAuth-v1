
let forgotForm = document.getElementById('popupForgot');
let resetPassBtn;


// EVENT DELEGATION 
document.body.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'forgotPopupBtn') {
        // console.log("Forgot Cliked")
        event.preventDefault();
        // Close Login Form
        // No need to declare loginForm variable as it is already open and inside it we are opening forgotForm
        loginForm.style.visibility = 'hidden';
        loginForm.style.opacity = 0;
        loginForm.innerHTML = '';

        forgotForm.style.visibility = 'visible';
        forgotForm.style.opacity = 1;
        forgotForm.innerHTML = '<div class="loader"></div>';

        // Open Forgot Form
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/getForgotForm', true);

        xhttp.onProgress = () => {
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;
            forgotForm.innerHTML = '<div class="loader"></div>';
        }

        xhttp.onload = function () {
            let forgotFormHTML = this.response;
            forgotForm.innerHTML = forgotFormHTML;
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;

            resetPassBtn = document.getElementById('forgotBtn');
            resetPassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                //
                let emailInput = document.getElementById('emailInput').value;
                forgotForm.style.visibility = 'visible';
                forgotForm.style.opacity = 1;
                forgotForm.innerHTML = '<div class="loader"></div>';
                //
                sendForgotEmail(forgotFormHTML, emailInput);
            })


            let closeForgotBtn = document.getElementById('closeForgotBtn');
            closeForgotBtn.addEventListener('click', closeForgotPopUp);
        }
        xhttp.send();
    }
});


function sendForgotEmail(forgotFormHTML, emailInput) {
    let email = emailInput.trim();
    let formData = {
        emailInput: email
    }
    fetch('/resetConfirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.status === 200) {
            getResetToken(forgotFormHTML, formData);
        }
    });
}

function getResetToken(forgotFormHTML, formData) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/getResetToken', true);

    xhttp.onProgress = () => {
        forgotForm.style.visibility = 'visible';
        forgotForm.style.opacity = 1;
        forgotForm.innerHTML = '<div class="loader"></div>';
    }

    xhttp.onload = function () {
        // console.log(this.response)
        let data = JSON.parse(this.response);
        if (!data.confirm) {
            forgotForm.innerHTML = forgotFormHTML;
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;

            resetPassBtn = document.getElementById('forgotBtn');
            resetPassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                //
                let emailInput = document.getElementById('emailInput').value;
                forgotForm.style.visibility = 'visible';
                forgotForm.style.opacity = 1;
                forgotForm.innerHTML = '<div class="loader"></div>';
                //
                sendForgotEmail(forgotFormHTML, emailInput);
            })


            let closeForgotBtn = document.getElementById('closeForgotBtn');
            closeForgotBtn.addEventListener('click', closeForgotPopUp);

            let alertBox = document.getElementById('alert-box');
            createAndDisplayAlert(alertBox, data.data);

        }
        else if (data.confirm) {
            fetch('/resetConfirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)

            }).then(response => {
                if (response.status === 200) {
                    displaySuccessAlert(data);
                }
            })
        }
    }
    xhttp.send();
}

function displaySuccessAlert(data) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/', true);
    xhttp.onProgress = () => {
        forgotForm.style.visibility = 'visible';
        forgotForm.style.opacity = 1;
        forgotForm.innerHTML = '<div class="loader"></div>';
    }
    xhttp.onload = function () {
        forgotForm.style.visibility = 'hidden';
        forgotForm.style.opacity = 0;
        forgotForm.innerHTML = '';

        let alertBox = document.getElementById('alert-box');
        createSuccessAlert(alertBox, data.data)
    }
    xhttp.send();
}

function closeForgotPopUp(e) {
    e.preventDefault();
    forgotForm.style.visibility = 'hidden';
    forgotForm.style.opacity = 0;
    forgotForm.innerHTML = '';
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

function createSuccessAlert(alertContainer, alertData) {

    let alert = document.createElement('div');
    alertContainer.appendChild(alert);
    alert.innerHTML = alertData;
    alert.id = 'alert';
    alert.classList.add("alert", "success-alert")
    alert.style.visibility = 'visible';
    alert.style.animation = 'showAlertLeft 12s ease-in-out';

    setTimeout(() => {
        alertContainer.removeChild(alert);
    }, 12000)
}