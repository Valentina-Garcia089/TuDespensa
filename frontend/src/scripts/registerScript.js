// Redireccionamiento del registro 1 al 2
const btnCancelar = document.getElementById("register__buttons-cancel");
btnCancelar.addEventListener("click", () =>{
    window.location.href = "landing.html";
})

const btnSiguiente = document.getElementById("register__buttons-next");
const form = document.querySelector(".register");
btnSiguiente.addEventListener("click", () =>{
    if(!form.checkValidity()){
        form.reportValidity();
        return
    }

    window.location.href = "register2.html";
})
