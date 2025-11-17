
const formRegister = document.querySelector(".register");
const modal = document.getElementById("success-modal");

//evita que el botón envie el form
const btnCrearCuenta = document.getElementById("register-btn");
btnCrearCuenta.type = "button";

btnCrearCuenta.addEventListener("click", () => {

    // Validación del form
    if (!formRegister.checkValidity()) {
        formRegister.reportValidity();
        return;
    }

    modal.classList.add("active");

    // Redirección automática
    setTimeout(() => {
        window.location.href = "optionsPerUser.html";
    }, 4000); //4 seg
});