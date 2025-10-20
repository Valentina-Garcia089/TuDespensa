// Redireccionamiento del registro 1 al 2
const btnCancelar = document.getElementById("logIn__buttons-cancel");
btnCancelar.addEventListener("click", () =>{
    window.location.href = "landing.html";
})

const btnSiguiente = document.getElementById("logIn__buttons-next");
const form = document.querySelector(".logIn"); // Validar que los campos del LogIn estén llenos (Lo mismo con las egunda pag)
btnSiguiente.addEventListener("click", () =>{
    if(!form.checkValidity()){
        form.reportValidity(); // Muestra el mensaje predeterminado
        return
    }

    window.location.href = "register2.html";
})