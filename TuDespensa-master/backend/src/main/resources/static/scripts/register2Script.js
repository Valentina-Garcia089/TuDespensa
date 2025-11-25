
const formRegister = document.querySelector(".register");
const modal = document.getElementById("success-modal");
const btnCrearCuenta = document.getElementById("register-btn");
const inputEmail = document.getElementById("register__inputs-name"); // ID reutilizado en HTML
const inputPassword = document.getElementById("register__inputs-password");

btnCrearCuenta.type = "button";

btnCrearCuenta.addEventListener("click", () => {

    // Validación del form
    if (!formRegister.checkValidity()) {
        formRegister.reportValidity();
        return;
    }

    // Recuperar datos del paso anterior
    const partialUserStr = localStorage.getItem("partialUser");
    if (!partialUserStr) {
        alert("Error: Faltan datos del paso anterior. Vuelve a empezar.");
        window.location.href = "register.html";
        return;
    }

    const partialUser = JSON.parse(partialUserStr);

    // Construir objeto usuario completo
    const nuevoUsuario = {
        nombre: partialUser.nombre,
        apellido: partialUser.apellido,
        correo: inputEmail.value,
        contrasenaHash: inputPassword.value, // Se envía tal cual, backend debería hashear pero por ahora guardamos así
        direccion: partialUser.direccion,
        rol: "CLIENTE" // Default
    };

    console.log("Enviando registro:", nuevoUsuario);

    // Enviar al backend
    fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.message || "Error al registrar"); });
            }
            return res.json();
        })
        .then(data => {
            console.log("Registro exitoso:", data);

            // Limpiar datos temporales
            localStorage.removeItem("partialUser");

            modal.classList.add("active");

            // Redirección a Login
            setTimeout(() => {
                window.location.href = "logIn.html";
            }, 3000);
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error en el registro: " + err.message);
        });
});