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

    function openModal(){
        darkLayer.classList.add("active");
        hiddenmodal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal(){
        darkLayer.classList.remove("active");
        hiddenmodal.classList.remove("open");
        document.body.style.overflow = "";
    }

    function openForm(){
        darkLayer.classList.add("active");
        hiddenmodal.classList.remove("open"); /*Cerrar el modal anterior*/ 
        hiddenForm.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeForm(){
        darkLayer.classList.remove("active");
        hiddenForm.classList.remove("open");
        document.body.style.overflow = "";
    }

    addNewBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    returnBtn.addEventListener("click", closeModal);

    addCreditCard.addEventListener("click", openForm);
    document.addEventListener("keydown", (e) =>{
        if(e.key === "Escape"){
            closeModal();
        }
    })




    // -----------DESPLEGABLE------------
    let paymentMethods = []; //esto es sin la base de datos--------

    const dropdown = document.querySelector(".dropdown-list");
    const selectHeader = document.querySelector(".method__select-value");
    const currentMethodDisplay = document.getElementById("actual-method");
    currentMethodDisplay.textContent = "Debe seleccionar un método de pago";
    currentMethodDisplay.style.color = '#363535c1';

    const saveCardBtn = document.querySelector(".payment__btn");



    //abrir y cerrar el dropdown
    selectHeader.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        selectHeader.classList.toggle("open"); //activa la rotación
    });

    function renderDropdown() {
        dropdown.innerHTML = "";

        paymentMethods.forEach((method, index) => {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.textContent = method;

            li.addEventListener("click", () => {
                currentMethodDisplay.textContent = method;
                dropdown.classList.remove("open");
            });

            dropdown.appendChild(li);
        });
    }


    //guardar el nuevo método de pago en el dropdown
    saveCardBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const cardNumber = document.querySelector("input[type='number']").value;
        if (!cardNumber) {
            return alert("Ingrese un número de tarjeta");
        }

        //Ocultar parte de la tarjeta
        const masked = "Tarjeta •••• " + cardNumber.slice(-4);

        // guardar en la lista local
        paymentMethods.push(masked);

        //actualizar dropdown y método actual
        renderDropdown();
        currentMethodDisplay.textContent = masked;
        currentMethodDisplay.style.color = '#212121';
        hiddenForm.reset();
        closeForm();
    });
});