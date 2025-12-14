document.addEventListener("DOMContentLoaded", () => {
    function escapeHtml(str) {
        if (str == null) return "";
        return String(str).replace(/[&<>"']/g, m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[m]);
    }

    const addBtn = document.getElementById("add-button");
    const formContainer = document.getElementById("hidden_form");
    const darkLayer = document.querySelector(".dark__layer");
    const closeBtn = document.querySelector(".product__form-close-button");
    const productForm = document.querySelector(".product__form");
    const listEl = document.querySelector(".listOfProducts");
    const returnBtn = document.getElementById("return-btn");

    const deleteBtn = document.querySelector(".list__delete-button");
    const editBtn = document.querySelector(".list__edit-button");

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    returnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    });

    function openModal() {
        darkLayer.classList.add("active");
        formContainer.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        darkLayer.classList.remove("active");
        formContainer.classList.remove("open");
        document.body.style.overflow = "";
        productForm.reset();
        delete productForm.dataset.editingId;
        productForm.querySelector(".product__form-submit-button").textContent = "Agregar";
    }

    addBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", e => e.key === "Escape" && closeModal());

    function getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    function saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    function loadProducts() {
        const products = getProducts();
        listEl.innerHTML = "";

        products.forEach(renderProduct);
    }

    function renderProduct(product) {
        const li = document.createElement("li");
        li.className = "product__item";
        li.dataset.id = product.id;
        li.dataset.product = JSON.stringify(product);

        li.innerHTML = `
            <div class="product__item-content">
                <input type="checkbox" class="product-checkbox">
                <div>
                    <strong>${escapeHtml(product.nombreProducto)}</strong>
                    <span class="product__item-meta">
                        — ${escapeHtml(product.cantidad)} ${escapeHtml(product.unidadMedida)}
                    </span>
                </div>
            </div>
        `;

        listEl.appendChild(li);
    }

    productForm.addEventListener("submit", e => {
        e.preventDefault();

        const products = getProducts();

        const productData = {
            id: productForm.dataset.editingId || Date.now(),
            nombreProducto: document.getElementById("product-name").value.trim(),
            marca: document.getElementById("product-brand").value.trim(),
            cantidad: document.getElementById("product-quantity").value.trim(),
            unidadMedida: document.getElementById("product-measurement").value.trim(),
            frecuenciaReposicion: document.getElementById("product-frequency").value.trim(),
            notas: document.getElementById("product-notes").value.trim(),
            usuario: usuario?.nombre || "Demo"
        };

        if (productForm.dataset.editingId) {
            const index = products.findIndex(p => p.id == productData.id);
            products[index] = productData;
        } else {
            products.push(productData);
        }

        saveProducts(products);
        loadProducts();
        closeModal();
    });

    function updateButtons() {
        const checked = document.querySelectorAll(".product-checkbox:checked");
        deleteBtn.style.display = checked.length ? "block" : "none";
        editBtn.style.display = checked.length === 1 ? "block" : "none";
    }

    listEl.addEventListener("change", e => {
        if (e.target.classList.contains("product-checkbox")) updateButtons();
    });

    deleteBtn.addEventListener("click", () => {
        let products = getProducts();
        const checked = document.querySelectorAll(".product-checkbox:checked");

        checked.forEach(box => {
            const id = box.closest("li").dataset.id;
            products = products.filter(p => p.id != id);
        });

        saveProducts(products);
        loadProducts();
        updateButtons();
    });

    editBtn.addEventListener("click", () => {
        const checked = document.querySelector(".product-checkbox:checked");
        if (!checked) return;

        const product = JSON.parse(checked.closest("li").dataset.product);

        document.getElementById("product-name").value = product.nombreProducto || "";
        document.getElementById("product-brand").value = product.marca || "";
        document.getElementById("product-quantity").value = product.cantidad || "";
        document.getElementById("product-measurement").value = product.unidadMedida || "";
        document.getElementById("product-frequency").value = product.frecuenciaReposicion || "";
        document.getElementById("product-notes").value = product.notas || "";

        productForm.dataset.editingId = product.id;
        productForm.querySelector(".product__form-submit-button").textContent = "Guardar cambios";
        openModal();
    });

    loadProducts();
});
