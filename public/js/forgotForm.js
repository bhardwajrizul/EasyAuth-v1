let forgotForm = document.getElementById('popupForgot');



// EVENT DELEGATION 
document.body.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'forgotPopupBtn') {
        console.log("Forgot Cliked")
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
            forgotForm.innerHTML = this.response;
            forgotForm.style.visibility = 'visible';
            forgotForm.style.opacity = 1;

            let closeForgotBtn = document.getElementById('closeForgotBtn');
            closeForgotBtn.addEventListener('click', closeForgotPopUp);
        }
        xhttp.send();
    }
});
  

function closeForgotPopUp(e) {
    e.preventDefault();
    forgotForm.style.visibility = 'hidden';
    forgotForm.style.opacity = 0;
    forgotForm.innerHTML = '';
}