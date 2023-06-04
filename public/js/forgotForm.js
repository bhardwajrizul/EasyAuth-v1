let forgotForm = document.getElementById('popupForgot');
let resetPassBtn;


// EVENT DELEGATION 
document.body.addEventListener('click', function(event) {
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

        xhttp.onload = function() {
            let forgotFormHTML = this.response;
            forgotForm.innerHTML = forgotFormHTML;
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;

            resetPassBtn = document.getElementById('forgotBtn');
            resetPassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sendForgotEmail(forgotFormHTML);
            })


            let closeForgotBtn = document.getElementById('closeForgotBtn');
            closeForgotBtn.addEventListener('click', closeForgotPopUp);
        }
        xhttp.send();
    }
});


function sendForgotEmail(forgotFormHTML) {
    let email = document.getElementById('emailInput').value;
    let formData = {
        emailInput : email
    }
    fetch('/resetConfirm', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
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

    xhttp.onload = function() {
        // console.log(this.response)
        let data = JSON.parse(this.response);
        if (!data.confirm) {   
            forgotForm.innerHTML = forgotFormHTML;
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;

            resetPassBtn = document.getElementById('forgotBtn');
            resetPassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sendForgotEmail(forgotFormHTML);
            })


            let closeForgotBtn = document.getElementById('closeForgotBtn');
            closeForgotBtn.addEventListener('click', closeForgotPopUp);

            let alertBox = document.getElementById('alert');
            alertBox.innerHTML = data.data;
            alertBox.style.visibility = 'visible';
            alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
            setTimeout(() => {
                alertBox.style.visibility = 'hidden';
                alertBox.style.animation = '';
            }, 5000);
        }
        else if (data.confirm) {
            fetch('/resetConfirm', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
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
    xhttp.onload = function() {
        forgotForm.style.visibility = 'hidden';
        forgotForm.style.opacity = 0;
        forgotForm.innerHTML = '';

        let alertBox = document.getElementById('alert');
        alertBox.innerHTML = data.data;
        // ADD CLASS success-alert to alertbox
        alertBox.classList.add('success-alert');
        alertBox.style.visibility = 'visible';
        alertBox.style.animation = 'showAlertLeft 10s ease-in-out';
        setTimeout(() => {
            // Remove class 
            alertBox.classList.remove('success-alert');
            alertBox.style.visibility = 'hidden';
            alertBox.style.animation = '';
            
        }, 10000);
    }
    xhttp.send();
}

function closeForgotPopUp(e) {
    e.preventDefault();
    forgotForm.style.visibility = 'hidden';
    forgotForm.style.opacity = 0;
    forgotForm.innerHTML = '';
}