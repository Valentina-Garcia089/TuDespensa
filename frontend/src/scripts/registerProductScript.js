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
        //Hay que indicarle al programa que hacer cuando se está editando y no creando un nuevo producto:
        if (productForm.dataset.editingId) {
            return;
        }

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
                <input type="checkbox" class="product-checkbox">
                <div>
                    <strong class="product__item-name">${escapeHtml(name)}</strong>
                    <span class="product__item-meta"> — ${escapeHtml(quantity)} ${escapeHtml(measurement)}</span>
                </div>
            </div>
        `;

        // Agregar al final
        listEl.appendChild(li);

        // Limpiar el formulario y cerrar modal
        productForm.reset();
        closeModal();
    });





    // BORRAR ELEMENTOS SELECCIONADOS:
    const deleteBtn = document.querySelector(".list__delete-button");

    function updateDeleteButtonVisibility() {
        const anyChecked = document.querySelectorAll(".product-checkbox:checked").length > 0;
        deleteBtn.style.display = anyChecked ? "block" : "none";
    }

    listEl.addEventListener("change", (e) => {
        if (e.target.classList.contains("product-checkbox")) {
            updateDeleteButtonVisibility();
        }
    });

    deleteBtn.addEventListener("click", () => {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        checkedBoxes.forEach(box => box.closest("li").remove());
        updateDeleteButtonVisibility();
    });






    //Editar productos:

    const editBtn = document.querySelector(".list__edit-button");

    function updateEditButtonVisibility() {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        editBtn.style.display = (checkedBoxes.length === 1) ? "block" : "none";
    }

    // Aprovechamos el listener existente en la lista
    listEl.addEventListener("change", (e) => {
        if (e.target.classList.contains("product-checkbox")) {
            updateEditButtonVisibility();
        }
    });

    //Hacer click en el botón de editar:
    editBtn.addEventListener("click", () => {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");

        const li = checkedBoxes[0].closest("li");
        const productId = li.dataset.id;
        const nameEl = li.querySelector(".product__item-name");
        const metaEl = li.querySelector(".product__item-meta");

        //simular consulta a base de datos:
        //Muchachos.... sugerencia de chat:
        // Ejemplo: const productData = await fetch(`/api/products/${productId}`).then(r => r.json());
        const [quantity, measurement] = metaEl.textContent.replace("—", "").trim().split(" ");
        const simulatedProductData = {
            id: productId,
            name: nameEl.textContent.trim(),
            brand: "Marca simulada", // ← Esto vendrá de la BD más adelante
            quantity: quantity || "",
            measurement: measurement || "",
            frequency: "7", // Simulado
            notes: "Sin notas" // Simulado
        };

        //"Prellenar" el formulario con los datos del producto (No sé cómo más decirle)
        document.getElementById("product-name").value = simulatedProductData.name;
        document.getElementById("porduct-brand").value = simulatedProductData.brand;
        document.getElementById("product-quantity").value = simulatedProductData.quantity;
        document.getElementById("product-measurement").value = simulatedProductData.measurement;
        document.getElementById("product-frequency").value = simulatedProductData.frequency;
        document.getElementById("product-notes").value = simulatedProductData.notes;

        //id del producto que se está editando
        productForm.dataset.editingId = productId;

        // Cambiamos el texto del botón
        const submitBtn = productForm.querySelector(".product__form-submit-button");
        submitBtn.textContent = "Guardar cambios";

        openModal();
    });

    // ---- Integrar edición con el submit existente ----
    productForm.addEventListener("submit", async (e) => {
        const editingId = productForm.dataset.editingId;
        if (!editingId){
            return;//Si no se está editando, no se hace nada
        }

        e.preventDefault(); // Evita crear un nuevo producto

        // Obtener valores del formulario
        const name = document.getElementById("product-name").value.trim();
        const brand = document.getElementById("porduct-brand").value.trim();
        const quantity = document.getElementById("product-quantity").value.trim();
        const measurement = document.getElementById("product-measurement").value.trim();
        const frequency = document.getElementById("product-frequency").value.trim();
        const notes = document.getElementById("product-notes").value.trim();

        // En el futuro: actualizar en la base de datos
        // await fetch(`/api/products/${editingId}`, {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name, brand, quantity, measurement, frequency, notes })
        // });

        //actualización de la lista en el dom
        const li = listEl.querySelector(`[data-id="${editingId}"]`);
        li.querySelector(".product__item-name").textContent = name;
        li.querySelector(".product__item-meta").textContent = ` — ${quantity} ${measurement}`;

        //limpiar el modo edición
        delete productForm.dataset.editingId;
        productForm.querySelector(".product__form-submit-button").textContent = "Agregar";
        productForm.reset();

        closeModal();
    });



});

