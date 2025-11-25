document.addEventListener("DOMContentLoaded", () => {
    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        // Convertir a string primero
        str = String(str);
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
    const returnBtn = document.getElementById("return-btn");

    // Obtener usuario
    const usuarioStr = localStorage.getItem("usuario");
    let usuarioId = null;
    if (usuarioStr) {
        usuarioId = JSON.parse(usuarioStr).idUsuario;
    }

    returnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    })

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
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    })

    // Cargar productos
    function loadProducts() {
        console.log("=== CARGANDO PRODUCTOS ===");
        console.log("Usuario ID:", usuarioId);
        console.log("LocalStorage usuario:", localStorage.getItem("usuario"));

        if (!usuarioId) {
            console.error("No se encontró ID de usuario en localStorage");
            listEl.innerHTML = "<li class='product__item-empty' style='padding: 20px; text-align: center; color: #ff0000;'>Error: Usuario no identificado. Por favor inicie sesión nuevamente.</li>";
            return;
        }

        const url = `http://localhost:8080/productos?usuario_id=${usuarioId}`;
        console.log("Fetching URL:", url);

        fetch(url)
            .then(res => {
                console.log("Respuesta recibida - Status:", res.status);
                console.log("Respuesta OK:", res.ok);
                console.log("Headers:", res.headers);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(products => {
                console.log("Productos parseados:", products);
                console.log("Cantidad de productos:", products.length);
                console.log("Tipo de datos:", typeof products, Array.isArray(products));

                listEl.innerHTML = "";
                if (products.length === 0) {
                    listEl.innerHTML = "<li class='product__item-empty' style='padding: 20px; text-align: center; color: #666;'>No hay productos registrados. ¡Agrega uno!</li>";
                } else {
                    console.log("Renderizando", products.length, "productos");
                    products.forEach((product, index) => {
                        console.log(`Producto ${index}:`, product);
                        renderProduct(product);
                    });
                }
            })
            .catch(err => {
                console.error("!!! ERROR EN FETCH !!!");
                console.error("Error completo:", err);
                console.error("Mensaje:", err.message);
                console.error("Stack:", err.stack);
                listEl.innerHTML = `<li class='product__item-empty' style='padding: 20px; text-align: center; color: #ff0000;'>Error: ${err.message}<br>Verifique: 1) Backend en puerto 8080, 2) CORS habilitado, 3) Consola (F12) para más detalles</li>`;
            });
    }

    function renderProduct(product) {
        const li = document.createElement("li");
        li.className = "product__item";
        li.dataset.id = product.idProductoUsuario;
        li.dataset.product = JSON.stringify(product); // Guardar objeto completo para edición/pedido

        li.innerHTML = `
            <div class="product__item-content">
                <input type="checkbox" class="product-checkbox">
                <div>
                    <strong class="product__item-name">${escapeHtml(product.nombreProducto)}</strong>
                    <span class="product__item-meta"> — ${escapeHtml(product.cantidad || "")} ${escapeHtml(product.unidadMedida || "")}</span>
                </div>
            </div>
        `;
        listEl.appendChild(li);
    }

    // Añadir/Editar productos
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!usuarioId) return alert("Usuario no identificado");

        const name = document.getElementById("product-name").value.trim();
        const brand = document.getElementById("porduct-brand").value.trim();
        const quantity = document.getElementById("product-quantity").value.trim();
        const measurement = document.getElementById("product-measurement").value.trim();
        const frequency = document.getElementById("product-frequency").value.trim();
        const notes = document.getElementById("product-notes").value.trim();

        const productData = {
            usuario: { idUsuario: usuarioId },
            categoria: { idCategoria: 1 }, // Default
            nombreProducto: name,
            marca: brand,
            cantidad: parseFloat(quantity) || 0,
            unidadMedida: measurement,
            frecuenciaReposicion: parseInt(frequency) || 7,
            notas: notes,
            activo: true
        };

        const editingId = productForm.dataset.editingId;
        if (editingId) {
            productData.idProductoUsuario = parseInt(editingId);
        }

        fetch("http://localhost:8080/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData)
        })
            .then(res => {
                if (res.ok) return res.json();
                return res.json().then(err => { throw new Error(err.message || "Error guardando producto"); });
            })
            .then(() => {
                loadProducts();
                closeModal();
            })
            .catch(err => {
                console.error(err);
                alert("Error al guardar el producto: " + err.message);
            });
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
            updateEditButtonVisibility();
        }
    });

    deleteBtn.addEventListener("click", () => {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        const promises = [];

        checkedBoxes.forEach(box => {
            const li = box.closest("li");
            const id = li.dataset.id;
            promises.push(
                fetch(`http://localhost:8080/productos/${id}`, { method: "DELETE" })
            );
        });

        Promise.all(promises)
            .then(() => {
                loadProducts();
                updateDeleteButtonVisibility();
            })
            .catch(err => {
                console.error(err);
                alert("Error al eliminar productos");
            });
    });

    //Editar productos:
    const editBtn = document.querySelector(".list__edit-button");

    function updateEditButtonVisibility() {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        editBtn.style.display = (checkedBoxes.length === 1) ? "block" : "none";
    }

    editBtn.addEventListener("click", () => {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        if (checkedBoxes.length !== 1) return;

        const li = checkedBoxes[0].closest("li");
        const product = JSON.parse(li.dataset.product);

        document.getElementById("product-name").value = product.nombreProducto || "";
        document.getElementById("porduct-brand").value = product.marca || "";
        document.getElementById("product-quantity").value = product.cantidad || "";
        document.getElementById("product-measurement").value = product.unidadMedida || "";
        document.getElementById("product-frequency").value = product.frecuenciaReposicion || "";
        document.getElementById("product-notes").value = product.notas || "";

        productForm.dataset.editingId = product.idProductoUsuario;
        productForm.querySelector(".product__form-submit-button").textContent = "Guardar cambios";

        openModal();
    });

    if (usuarioId) {
        loadProducts();
    }
});

