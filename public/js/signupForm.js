let signupPopupBtn = document.getElementById('signupPopupBtn');
let signupForm = document.getElementById('popupSignup');
let alertBox = document.getElementById('alert');
let nextSignUpBtn;
let signUpBtn;
let prevSignUpBtn;
let closeSignupPopupBtn;

signupPopupBtn.addEventListener('click', loadSignupPopup);

window.onload = (ev) => {
    sessionStorage.clear();
}

function loadSignupPopup(e) {
    e.preventDefault();
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/signup', true);

    xhttp.onprogress = function() {
        signupForm.style.visibility = 'visible';
        signupForm.style.opacity = 1;
        signupForm.innerHTML = '<div class="loader"></div>';
    }
    
    xhttp.onload = function() {
        signupForm.style.visibility = 'visible';
        signupForm.style.opacity = 1;
        signupForm.innerHTML = this.response;

        document.getElementById('emailInput').value = sessionStorage.getItem('SIGNUP_EMAIL');
        document.getElementById('passInput').value = sessionStorage.getItem('SIGNUP_PASS');
        document.getElementById('passConfirmInput').value = sessionStorage.getItem('SIGNUP_PASSCONFIRM');

        nextSignUpBtn = document.getElementById('nextSignUpBtn');
        nextSignUpBtn.addEventListener('click', nextBtnClicked);
        
        closeSignupPopupBtn = document.getElementById('closeSignupBtn');
        closeSignupPopupBtn.addEventListener('click', closeSignupPopup);
    }
    xhttp.send();
}

async function nextBtnClicked(e) {
    e.preventDefault();
    let data = {
        email : document.getElementById('emailInput').value,
        pass : document.getElementById('passInput').value,
        passConfirm : document.getElementById('passConfirmInput').value
    };

    /////////////////////


    fetch('/signupConfirm', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    })
    .then((response) => {
        console.log("response :", response.body);
    })
    .then(() => {
        /////////////////////////////////
        let xhttp = new XMLHttpRequest();
        let signupFormHtml = signupForm.innerHTML;
        let formData = {
            email : document.getElementById('emailInput').value,
            pass : document.getElementById('passInput').value,
            passConfirm : document.getElementById('passConfirmInput').value
        };

        xhttp.open('GET', '/signupConfirm', true);
        xhttp.onprogress = function() {
            signupForm.innerHTML = '<div class="loader"></div>';
        }
    
        xhttp.onload = function() {
            let data = JSON.parse(this.response);
            if (data.confirm) {
                // Store Values in Session Storage
                sessionStorage.setItem('SIGNUP_EMAIL', formData.email);
                sessionStorage.setItem('SIGNUP_PASS', formData.pass);
                sessionStorage.setItem('SIGNUP_PASSCONFIRM', formData.passConfirm);
                
                // Load Next Signup page
                signupForm.innerHTML = data.data;

                signUpBtn = document.getElementById('signupComplete');
                signUpBtn.addEventListener('click', loadHomePage);

                prevSignUpBtn = document.getElementById('prevSignupBtn');
                prevSignUpBtn.addEventListener('click', loadPrevPage);

                document.getElementById('nameInput').value = sessionStorage.getItem('SIGNUP_NAME');

            } else {
                
                sessionStorage.clear();
                signupForm.innerHTML = signupFormHtml;

                nextSignUpBtn = document.getElementById('nextSignUpBtn');
                nextSignUpBtn.addEventListener('click', nextBtnClicked);
                
                closeSignupPopupBtn = document.getElementById('closeSignupBtn');
                closeSignupPopupBtn.addEventListener('click', closeSignupPopup);

                alertBox.innerHTML = data.data;
                alertBox.style.visibility = 'visible';
                alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
                setTimeout(() => {
                    alertBox.style.visibility = 'hidden';
                    alertBox.style.animation = '';
                }, 5000);
            }
        }
        xhttp.send();   
        ///////////////////////////////////
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    ////////////////////



    
}


function loadPrevPage(e) {
    e.preventDefault();

    sessionStorage.setItem('SIGNUP_NAME', document.getElementById('nameInput').value);

    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/signup', true);

    xhttp.onprogress = function() {
        signupForm.innerHTML = '<div class="loader"></div>';
    }

    xhttp.onload = function() {
        signupForm.innerHTML = this.response;

        document.getElementById('emailInput').value = sessionStorage.getItem('SIGNUP_EMAIL');
        document.getElementById('passInput').value = sessionStorage.getItem('SIGNUP_PASS');
        document.getElementById('passConfirmInput').value = sessionStorage.getItem('SIGNUP_PASSCONFIRM');


        nextSignUpBtn = document.getElementById('nextSignUpBtn');
        nextSignUpBtn.addEventListener('click', nextBtnClicked);
        closeSignupPopupBtn = document.getElementById('closeSignupBtn');
        closeSignupPopupBtn.addEventListener('click', closeSignupPopup);
    }
    xhttp.send();   

}


function closeSignupPopup(e) {
    e.preventDefault();
    sessionStorage.clear();
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET','/', true);

    xhttp.onload = function() {
        signupForm.style.visibility = 'hidden';
        signupForm.style.opacity = 0;
        signupForm.innerHTML = '';
    }
    xhttp.send();
}

function loadHomePage(e) {
    e.preventDefault();

    sessionStorage.setItem('SIGNUP_NAME', document.getElementById('nameInput').value);

    let formData = {
        email: sessionStorage.getItem('SIGNUP_EMAIL'),
        pass: sessionStorage.getItem('SIGNUP_PASS'),
        passConfirm: sessionStorage.getItem('SIGNUP_PASSCONFIRM'),
        name: sessionStorage.getItem('SIGNUP_NAME')
      }
      

    fetch('/signupComplete', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response =>{
        console.log(response)
    }).then( () => {
        getHomePage();
    })
}

function getHomePage() {
    let signupFormHtml = signupForm.innerHTML;
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', '/homepage');
    xhttp.onprogress = function() {
        signupForm.innerHTML = '<div class="loader"></div>';
    }
    xhttp.onload =  function() {
        
        // JSON DATA ONLY SENT WHEN THERE IS AN ALERT OTHERWISE PAGE IS RE-DIRECTED
        try {
            let data = JSON.parse(this.response);

            signupForm.innerHTML = signupFormHtml;

            signUpBtn = document.getElementById('signupComplete');
            signUpBtn.addEventListener('click', loadHomePage);

            prevSignUpBtn = document.getElementById('prevSignupBtn');
            prevSignUpBtn.addEventListener('click', loadPrevPage);

            alertBox.innerHTML = data.data;
            alertBox.style.visibility = 'visible';
            alertBox.style.animation = 'showAlertLeft 5s ease-in-out';
            setTimeout(() => {
                alertBox.style.visibility = 'hidden';
                alertBox.style.animation = '';
            }, 5000);

            
        } catch (error) {
            // IF WE DONT HAVE A JSON ALERT THEN HTML IS SENT AND IT CANNOT BE CONVERTED TO JSON IN TRY BLOCK 
            // SO IT CAUSES A SYNTAXERROR SO WE REDIRECT PAGE
            if (error instanceof SyntaxError) {
                window.location = '/homepage';
            }
        }
    }
    xhttp.send();
}

