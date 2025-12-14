document.addEventListener("DOMContentLoaded", () => {

    // Evita inyección de HTML cuando se muestra texto dinámico
    function escapeHtml(str) {
        if (!str) return "";
        return String(str).replace(/[&<>"']/g, m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[m]);
    }

    const addNewBtn = document.getElementById("add-method-btn");
    const hiddenModal = document.getElementById("hidden-options");
    const returnBtn = document.querySelector(".return__button2");
    const darkLayer = document.querySelector(".dark__layer");

    const addCreditCard = document.getElementById("credit__card-btn");
    const hiddenForm = document.getElementById("hidden-method");
    const firstReturnBtn = document.getElementById("return-btn");


    firstReturnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    });


    function openModal() {
        darkLayer.classList.add("active");
        hiddenModal.classList.add("open");
        document.body.style.overflow = "hidden";
    }


    function closeModal() {
        darkLayer.classList.remove("active");
        hiddenModal.classList.remove("open");
        document.body.style.overflow = "";
    }

    //formulario para agregar una tarjeta a la lista de metodos de pago
    function openForm() {
        darkLayer.classList.add("active");
        hiddenModal.classList.remove("open");
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

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

    //lista de métodos de pago
    const dropdown = document.querySelector(".dropdown-list");
    const selectHeader = document.querySelector(".method__select-value");
    const currentMethodDisplay = document.getElementById("actual-method");

    currentMethodDisplay.textContent = "Métodos disponibles";
    currentMethodDisplay.style.color = "#363535c1";

    const saveCardBtn = document.querySelector(".payment__btn");

    let paymentMethods = [
        { id: 1, tipo: "Tarjeta", ultimosDigitos: "1234" },
        { id: 2, tipo: "Tarjeta", ultimosDigitos: "5678" }
    ];

    function loadPaymentMethods() {
        dropdown.innerHTML = "";

        //efectivo será una opción fija
        const liCash = document.createElement("li");
        liCash.className = "dropdown-item";
        liCash.textContent = "Efectivo";
        liCash.addEventListener("click", () => {
            currentMethodDisplay.textContent = "Efectivo";
            currentMethodDisplay.style.color = "#212121";
            dropdown.classList.remove("open");
        });
        dropdown.appendChild(liCash);

        paymentMethods.forEach(method => {
            const li = document.createElement("li");
            li.className = "dropdown-item";
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";

            const text = document.createElement("span");
            text.textContent = `Tarjeta •••• ${method.ultimosDigitos}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Eliminar";
            deleteBtn.style.background = "#ff4444";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.borderRadius = "4px";
            deleteBtn.style.padding = "5px 10px";
            deleteBtn.style.cursor = "pointer";

            //eliminar metodo de pago
            deleteBtn.addEventListener("click", e => {
                e.stopPropagation();
                if (confirm("¿Eliminar método de pago?")) {
                    paymentMethods = paymentMethods.filter(m => m.id !== method.id);
                    loadPaymentMethods();

                    if (currentMethodDisplay.dataset.selectedId == method.id) {
                        currentMethodDisplay.textContent = "Métodos disponibles";
                        currentMethodDisplay.style.color = "#363535c1";
                        delete currentMethodDisplay.dataset.selectedId;
                    }
                }
            });

            li.addEventListener("click", () => {
                currentMethodDisplay.textContent = `Tarjeta •••• ${method.ultimosDigitos}`;
                currentMethodDisplay.style.color = "#212121";
                currentMethodDisplay.dataset.selectedId = method.id;
                dropdown.classList.remove("open");
            });

            li.appendChild(text);
            li.appendChild(deleteBtn);
            dropdown.appendChild(li);
        });
    }

    loadPaymentMethods();

    selectHeader.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        selectHeader.classList.toggle("open");
    });

    saveCardBtn.addEventListener("click", e => {
        e.preventDefault();

        const cardInput = document.querySelector("#hidden-method input[type='number']");
        const cardNumber = cardInput.value;

        if (!cardNumber || cardNumber.length < 4) {
            alert("Ingrese al menos 4 dígitos");
            return;
        }

        const newMethod = {
            id: Date.now(),
            tipo: "Tarjeta",
            ultimosDigitos: cardNumber.slice(-4)
        };

        paymentMethods.push(newMethod);
        loadPaymentMethods();

        currentMethodDisplay.textContent = `Tarjeta •••• ${newMethod.ultimosDigitos}`;
        currentMethodDisplay.style.color = "#212121";

        cardInput.value = "";
        closeForm();
    });

});
