document.addEventListener("DOMContentLoaded", () => {
    function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/[&<>"']/g, function (m) {
            return ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[m];
        });
    }

    const addNewBtn = document.getElementById("add-method-btn");
    const hiddenmodal = document.getElementById("hidden-options");
    const returnBtn = document.querySelector(".return__button2");
    const darkLayer = document.querySelector(".dark__layer");

    const addCreditCard = document.getElementById("credit__card-btn");
    const hiddenForm = document.getElementById("hidden-method");
    const firstReturnBtn = document.getElementById("return-btn");

    firstReturnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    })

    function openModal() {
        darkLayer.classList.add("active");
        hiddenmodal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        darkLayer.classList.remove("active");
        hiddenmodal.classList.remove("open");
        document.body.style.overflow = "";
    }

    function openForm() {
        darkLayer.classList.add("active");
        hiddenmodal.classList.remove("open"); /*Cerrar el modal anterior*/
        hiddenForm.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeForm() {
        darkLayer.classList.remove("active");
        hiddenForm.classList.remove("open");
        document.body.style.overflow = "";
    }

    addNewBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    returnBtn.addEventListener("click", closeModal);

    addCreditCard.addEventListener("click", openForm);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    })

    // -----------DESPLEGABLE CON BACKEND------------
    const dropdown = document.querySelector(".dropdown-list");
    const selectHeader = document.querySelector(".method__select-value");
    const currentMethodDisplay = document.getElementById("actual-method");

    // CAMBIO: Ya no es "Método actual", sino solo visualización
    currentMethodDisplay.textContent = "Métodos disponibles";
    currentMethodDisplay.style.color = '#363535c1';

    const saveCardBtn = document.querySelector(".payment__btn");

    // Obtener usuario
    const usuarioStr = localStorage.getItem("usuario");
    let usuarioId = null;
    if (usuarioStr) {
        usuarioId = JSON.parse(usuarioStr).idUsuario;
    }

    // Cargar métodos de pago
    function loadPaymentMethods() {
        if (!usuarioId) return;

        fetch(`http://localhost:8080/metodos-pago?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(methods => {
                dropdown.innerHTML = "";

                // Opción por defecto: Efectivo
                const liCash = document.createElement("li");
                liCash.classList.add("dropdown-item");
                liCash.textContent = "Efectivo";
                liCash.addEventListener("click", () => {
                    currentMethodDisplay.textContent = "Efectivo";
                    currentMethodDisplay.style.color = '#212121';
                    dropdown.classList.remove("open");
                });
                dropdown.appendChild(liCash);

                // Métodos guardados
                if (methods.length > 0) {
                    methods.forEach(method => {
                        const li = document.createElement("li");
                        li.classList.add("dropdown-item");
                        const displayText = method.ultimosDigitos ? `Tarjeta •••• ${method.ultimosDigitos}` : method.tipoPago;
                        li.textContent = displayText;

                        // Restaurar selección
                        li.addEventListener("click", () => {
                            currentMethodDisplay.textContent = displayText;
                            currentMethodDisplay.style.color = '#212121';
                            dropdown.classList.remove("open");
                            // Aquí se podría guardar el ID del método seleccionado para eliminarlo después
                            currentMethodDisplay.dataset.selectedId = method.idMetodoPago;
                        });

                        dropdown.appendChild(li);
                    });
                }
            })
            .catch(err => {
                console.error("Error cargando métodos de pago:", err);
                dropdown.innerHTML = "";
                const liCash = document.createElement("li");
                liCash.classList.add("dropdown-item");
                liCash.textContent = "Efectivo";
                liCash.addEventListener("click", () => {
                    currentMethodDisplay.textContent = "Efectivo";
                    dropdown.classList.remove("open");
                });
                dropdown.appendChild(liCash);
            });
    }

    if (usuarioId) {
        loadPaymentMethods();
    }

    //abrir y cerrar el dropdown
    selectHeader.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        selectHeader.classList.toggle("open"); //activa la rotación
    });

    // Restaurar funcionalidad del botón Guardar
    saveCardBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const cardNumber = document.querySelector("input[type='number']").value;
        if (!cardNumber) {
            return alert("Ingrese un número de tarjeta");
        }

        if (cardNumber.length < 4) {
            return alert("El número de tarjeta debe tener al menos 4 dígitos");
        }

        if (!usuarioId) {
            return alert("Usuario no identificado");
        }

        // Usamos la función global para guardar
        window.guardarNuevoMetodoPago(usuarioId, cardNumber)
            .then(savedMethod => {
                loadPaymentMethods(); // Recargar lista
                currentMethodDisplay.textContent = savedMethod.ultimosDigitos ? `Tarjeta •••• ${savedMethod.ultimosDigitos}` : savedMethod.tipoPago;
                currentMethodDisplay.style.color = '#212121';
                // Assuming hiddenForm is a form element, reset it
                const cardInput = document.querySelector("#hidden-method input[type='number']");
                if (cardInput) {
                    cardInput.value = ''; // Clear the input field
                }
                closeForm();
            })
            .catch(err => {
                // El error ya se maneja en la función global, pero aquí podemos hacer algo extra si es necesario
                console.error("Error en listener:", err);
            });
    });
});

// Función global expuesta (se mantiene igual)
window.guardarNuevoMetodoPago = function (usuarioId, cardNumber) {
    console.log("Ejecutando guardarNuevoMetodoPago...", { usuarioId, cardNumber });

    if (!usuarioId) {
        console.error("Usuario no identificado");
        return Promise.reject(new Error("Usuario no identificado"));
    }

    if (!cardNumber || cardNumber.length < 4) {
        console.error("Número de tarjeta inválido");
        return Promise.reject(new Error("El número de tarjeta debe tener al menos 4 dígitos"));
    }

    const nuevoMetodo = {
        usuario: { idUsuario: usuarioId },
        tipoPago: "Tarjeta Crédito/Débito",
        ultimosDigitos: cardNumber.slice(-4),
        activo: true
    };

    return fetch("http://localhost:8080/metodos-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMetodo)
    })
        .then(res => {
            if (res.ok) return res.json();
            return res.json().then(err => { throw new Error(err.message || "Error guardando método de pago"); });
        })
        .then(savedMethod => {
            console.log("Método guardado exitosamente:", savedMethod);
            return savedMethod;
        })
        .catch(err => {
            console.error(err);
            if (err.message.includes("integridad de datos") || err.message.includes("usuario")) {
                alert("Error: No se pudo identificar al usuario. Por favor inicie sesión nuevamente.");
            } else {
                alert("Error al guardar el método de pago: " + err.message);
            }
            throw err;
        });
};