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



    const addBtn = document.getElementById("add-button");
    const formContainer = document.getElementById("hidden_form");
    const darkLayer = document.querySelector(".dark__layer");
    const closeBtn = document.querySelector(".product__form-close-button");
    const productForm = document.querySelector(".product__form");
    const listEl = document.querySelector(".listOfProducts");

    function openModal(){
        darkLayer.classList.add("active");
        formContainer.classList.add("open");
        document.body.style.overflow = "hidden";
    }
    
    function closeModal(){
        darkLayer.classList.remove("active");
        formContainer.classList.remove("open");
        document.body.style.overflow = "";
    }

    addBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) =>{
        if(e.key === "Escape"){
            closeModal();
        }
    })



    // Añadir productos a la lista cuando presionen el botón de tipo submit
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Obtener valores (usa los ids que tienes en el HTML)
        const nameInput = document.getElementById("product-name");
        const quantityInput = document.getElementById("product-quantity");
        const measurementInput = document.getElementById("product-measurement");

        const name = nameInput.value.trim();
        const quantity = quantityInput.value.trim();
        const measurement = measurementInput.value.trim();

        // Crear el elemento de lista
        const itemId = `prod-${Date.now()}`; // id simple y único
        const li = document.createElement("li");
        li.className = "product__item";
        li.dataset.id = itemId;

        li.innerHTML = `
        <div class="product__item-content">
            <strong class="product__item-name">${escapeHtml(name)}</strong>
            <span class="product__item-meta"> — ${escapeHtml(quantity)} ${escapeHtml(measurement)}</span>
        </div>
        `;

        // Agregar al final
        listEl.appendChild(li);

        // Limpiar el formulario y cerrar modal
        productForm.reset();
        closeModal();
    });


});