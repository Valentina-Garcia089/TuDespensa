const btnSiguiente = document.getElementById("logIn-btn");
const form = document.querySelector(".logIn");

btnSiguiente.addEventListener("click", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Los IDs correctos del HTML
    const correo = document.getElementById("logIn__inputs-name").value.trim();
    const contrasena = document.getElementById("logIn__inputs-password").value.trim();

    if (!correo || !contrasena) {
        alert("Por favor ingrese correo y contraseña");
        return;
    }

    console.log("Intentando login con correo:", correo);

    // Realizar login con el backend
    fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
    })
        .then(res => {
            console.log("Respuesta del servidor:", res.status);
            if (res.ok) return res.json();
            if (res.status === 401) {
                throw new Error("Credenciales incorrectas");
            }
            throw new Error("Error al iniciar sesión");
        })
        .then(usuario => {
            // Guardar usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify(usuario));
            console.log("Usuario autenticado y guardado:", usuario);
            alert("Bienvenido " + usuario.nombre + "!");
            window.location.href = "optionsPerUser.html";
        })
        .catch(err => {
            console.error("Error en login:", err);
            alert(err.message || "Error al iniciar sesión. Verifique sus credenciales.");
        });
})