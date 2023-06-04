let resetForm = document.getElementById('resetForm');
let alertBox = document.getElementById('alert');

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
                alertBox.innerHTML = data.data;
                alertBox.style.visibility = 'visible';
                alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
                setTimeout(() => {
                    alertBox.style.visibility = 'hidden';
                    alertBox.style.animation = '';
                    window.location = '/';
                }, 5000);
            } else {
                resetForm.style.visibility = 'visible';
                resetForm.style.opacity = 1;
                resetForm.innerHTML = data.data;
                let resetBtn = document.getElementById('resetBtn');
                resetBtn.addEventListener('click', () => {
                    resetPsswd();
                })
            }
        }
        xhttp.send();
    }

}).catch((err) => {
    alertBox.innerHTML = "Something went wrong. Please try again later.";
    alertBox.style.visibility = 'visible';
    alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
    setTimeout(() => {
        alertBox.style.visibility = 'hidden';
        alertBox.style.animation = '';
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
        alertBox.innerHTML = err;
        alertBox.style.visibility = 'visible';
        alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
        setTimeout(() => {
            alertBox.style.visibility = 'hidden';
            alertBox.style.animation = '';
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
        let alertBox = document.getElementById('alert');
        let data = JSON.parse(this.response);
        if (!data.confirm) {
            alertBox.innerHTML = data.data;
            alertBox.style.visibility = 'visible';
            alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
            setTimeout(() => {
                alertBox.style.visibility = 'hidden';
                alertBox.style.animation = '';
                window.location = '/';
            }, 5000);
        } else {
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
                window.location = '/';
            }, 5000);
        }
    }
    xhttp.send();
}