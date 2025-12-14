//Redireccionamiento del registro 1 al 2
const btnCancelar = document.getElementById("register__buttons-cancel");
btnCancelar.addEventListener("click", () => {
    window.location.href = "landing.html";
})

const btnSiguiente = document.getElementById("register__buttons-next");
const form = document.querySelector(".register");
const inputNombre = document.getElementById("register__inputs-name");
const inputApellido = document.getElementById("register__inputs-LastName");
const inputDireccion = document.getElementById("register__inputs-direction");

btnSiguiente.addEventListener("click", () => {
    if (!form.checkValidity()) {
        form.reportValidity();
        return
    }

    // Guardar datos en localStorage para el siguiente paso
    const partialUser = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        direccion: inputDireccion.value
    };
    localStorage.setItem("partialUser", JSON.stringify(partialUser));

    window.location.href = "register2.html";
})
