const btnSiguiente = document.getElementById("logIn-btn");
const form = document.querySelector(".logIn"); // Validar que los campos del register estén llenos (Lo mismo con la segunda pag)
btnSiguiente.addEventListener("click", () =>{
    if(!form.checkValidity()){
        form.reportValidity(); // Muestra el mensaje predeterminado
        return
    }

    window.location.href = "optionsPerUser.html";
})