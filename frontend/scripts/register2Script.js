const formRegister = document.querySelector(".register");
const modal = document.getElementById("success-modal");
const btnCrearCuenta = document.getElementById("register-btn");
const inputEmail = document.getElementById("register__inputs-name");
const inputPassword = document.getElementById("register__inputs-password");

btnCrearCuenta.type = "button";

btnCrearCuenta.addEventListener("click", () => {

    if (!formRegister.checkValidity()) {
        formRegister.reportValidity();
        return;
    }

    // recuperar datos del paso anterior
    const partialUserStr = localStorage.getItem("partialUser");
    if (!partialUserStr) {
        alert("Error: Faltan datos del paso anterior. Vuelve a empezar.");
        window.location.href = "register.html";
        return;
    }

    const partialUser = JSON.parse(partialUserStr);

    //usuario
    const nuevoUsuario = {
        id: Date.now(), //simula id
        nombre: partialUser.nombre,
        apellido: partialUser.apellido,
        correo: inputEmail.value.trim(),
        contrasena: inputPassword.value,
        direccion: partialUser.direccion,
        rol: "CLIENTE"
    };

    //se simula la obtemción de una base de datos de los usuarios
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //verificación para el correo
    const existe = usuarios.some(u => u.correo === nuevoUsuario.correo);
    if (existe) {
        alert("Este correo ya está registrado");
        return;
    }

    //SE GUARDA UN NUEVO USUARIO
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    localStorage.removeItem("partialUser");

    modal.classList.add("active");

    setTimeout(() => {
        window.location.href = "logIn.html";
    }, 3000);
});
