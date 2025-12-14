const btnSiguiente = document.getElementById("logIn-btn");
const form = document.querySelector(".logIn");

// usuarios simulados. Esto fue reemplazado por la base de datos
const usuariosMock = [
    {
        id: 1,
        nombre: "Valentina",
        correo: "vale@test.com",
        contrasena: "1234",
        rol: "usuario"
    },
    {
        id: 2,
        nombre: "Admin",
        correo: "admin@test.com",
        contrasena: "admin",
        rol: "admin"
    }
];

btnSiguiente.addEventListener("click", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const correo = document.getElementById("logIn__inputs-name").value.trim();
    const contrasena = document.getElementById("logIn__inputs-password").value.trim();

    if (!correo || !contrasena) {
        alert("Por favor ingrese correo y contraseña");
        return;
    }

    const usuario = usuariosMock.find(
        u => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuario) {
        alert("Credenciales incorrectas");
        return;
    }

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Bienvenido " + usuario.nombre + "!");
    window.location.href = "optionsPerUser.html";
});
