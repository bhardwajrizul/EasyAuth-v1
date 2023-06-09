let resetForm = document.getElementById('resetForm');
let alertBox = document.getElementById('alert-box');
let errArr = [];

fetch('/checkResetUrl', {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain'
    },
    body: String(window.location.href)
}).then((res) => {
    if (res) {
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/checkResetUrl', true);
        xhttp.onprogress = () => {
            resetForm.style.visibility = 'visible';
            resetForm.style.opacity = 1;
            resetForm.innerHTML = '<div class="loader"></div>';
        }
        xhttp.onload = function () {
            let data = JSON.parse(this.response);
            if (!data.confirm) {
                
                createAndDisplayAlert(alertBox, data.data)

                setTimeout(() => {
                    resetForm.innerHTML = '<a href="/" class="u-float-none u-center signup-pop-btn">Go to Home Page</a>';
                }, 5000);
            } else {
                let resetHTML = data.data;
                resetForm.style.visibility = 'visible';
                resetForm.style.opacity = 1;
                resetForm.innerHTML = resetHTML;
                let resetBtn = document.getElementById('resetBtn');
                resetBtn.addEventListener('click', () => {
                    resetPsswd();
                })
            }
        }
        xhttp.send();
    }

}).catch((err) => {
    console.log(err);
    let alertData = "Something went wrong. Please try again later.";
    createAndDisplayAlert(alertBox, alertData)
    setTimeout(() => {
        window.location = '/';
    }, 5000);
});


function resetPsswd() {
    let resetData = {
        pass: document.getElementById('passInput').value,
        passConfirm: document.getElementById('passConfirmInput').value,
        url: window.location.href
    }
    fetch('/resetComplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetData)
    }).then((res) => {
        if (res) { 
            displaySuccessAlert();
        }
    }).catch((err) => {
        console.log(err);
        let alertData = "Something went wrong. Please try again later.";
        createAndDisplayAlert(alertBox, alertData)
        setTimeout(() => {
            window.location = '/';
        }, 5000);
    });
}

function displaySuccessAlert() {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/resetComplete', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onprogress = () => {
        resetForm.style.visibility = 'visible';
        resetForm.style.opacity = 1;
        resetForm.innerHTML = '<div class="loader"></div>';
    }
    xhttp.onload = function () {
        let alertBox = document.getElementById('alert-box');
        let data = JSON.parse(this.response);
        if (!data.confirm) {
            createAndDisplayAlert(alertBox, data.data)
            setTimeout(() => {
                window.location = window.location.href;
            }, 5000);
        } else {
            createSuccessAlert(alertBox, data.data)
            setTimeout(() => {
                window.location = '/';
            }, 5000);
        }
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

function createSuccessAlert(alertContainer, alertData) {

    let alert = document.createElement('div');
    alertContainer.appendChild(alert);
    alert.innerHTML = alertData;
    alert.id = 'alert';
    alert.classList.add("alert", "success-alert")
    alert.style.visibility = 'visible';
    alert.style.animation = 'showAlertLeft 5s ease-in-out';

    setTimeout(() => {
        alertContainer.removeChild(alert);
    }, 5000)
}