document.addEventListener("DOMContentLoaded", () => {
    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
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

    const summBtn = document.getElementById("order-summary-btn");
    const summContainer = document.getElementById("order-summary");
    const darkLayer = document.querySelector(".dark__layer");
    const cancelBtn = document.querySelector(".cancel");
    const confirmBtn = document.querySelector(".confirm");
    const summaryBody = document.getElementById("order-summary-body");


    const subtotalLabel = document.getElementById("order-subtotal");
    const ivaLabel = document.getElementById("order-iva");
    const totalLabel = document.getElementById("order-total");

    const paymentSelect = document.getElementById("payment-method-select");
    const supermarketSelect = document.getElementById("supermarket-select");
    const supermarketPhone = document.getElementById("supermarket-phone");
    const supplierName = document.getElementById("supplier-name");

    // Datos de supermercados
    const supermarkets = {
        "1": { name: "Éxito", phone: "3001234567" },
        "2": { name: "Carulla", phone: "3109876543" },
        "3": { name: "Jumbo", phone: "6012345678" }
    };

    //función para actualizar precios según supermercado
    async function updatePricesForSupermarket(supermercadoId) {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        if (checkedBoxes.length === 0) return;

        console.log(`Actualizando precios para supermercado ${supermercadoId}`);

        for (const box of checkedBoxes) {
            const li = box.closest("li");
            const product = JSON.parse(li.dataset.product);

            try {
                //Buscar el producto en el supermercado seleccionado
                const response = await fetch(`http://localhost:8080/productos-supermercado/buscar?supermercado_id=${supermercadoId}&nombre=${encodeURIComponent(product.nombreProducto)}&marca=`);

                if (response.ok) {
                    const productosSupermercado = await response.json();
                    if (productosSupermercado.length > 0) {
                        // actualizar el precio en el objeto del producto
                        product.precio = productosSupermercado[0].precio;
                        //actualizar el dataset
                        li.dataset.product = JSON.stringify(product);
                        console.log(`Precio actualizado para ${product.nombreProducto}: $${product.precio}`);
                    }
                }
            } catch (error) {
                console.error(`Error obteniendo precio para ${product.nombreProducto}:`, error);
            }
        }

        // Recalcular y actualizar los totales si el modal está abierto
        if (summContainer.classList.contains("open")) {
            updateModalPrices();
        }
    }

    // Función para actualizar precios en el modal abierto
    function updateModalPrices() {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        const productsList = [];

        summaryBody.innerHTML = "";

        checkedBoxes.forEach((box) => {
            const li = box.closest("li");
            const product = JSON.parse(li.dataset.product);

            // Asignar precio simulado si no existe
            if (!product.precio) product.precio = 2500;

            productsList.push(product);

            const row = document.createElement("div");
            row.classList.add("order__summary-row");

            const cantidad = parseInt(product.cantidad) || 1;
            const precioTotal = product.precio * cantidad;

            row.innerHTML = `
                <span>${escapeHtml(product.nombreProducto)}</span>
                <span>${cantidad}</span>
                <span>${escapeHtml(product.unidadMedida || "unid")}</span>
                <span>$${product.precio.toLocaleString()}</span>
            `;
            summaryBody.appendChild(row);
        });

        // Recalcular totales
        const totals = calculateTotals(productsList);

        if (subtotalLabel) subtotalLabel.textContent = `$${totals.subtotal.toLocaleString()}`;
        if (ivaLabel) ivaLabel.textContent = `$${totals.iva.toLocaleString()}`;
        if (totalLabel) totalLabel.textContent = `$${totals.total.toLocaleString()}`;
    }

    // Evento cambio de supermercado
    if (supermarketSelect) {
        supermarketSelect.addEventListener("change", async (e) => {
            const selectedId = e.target.value;
            const superData = supermarkets[selectedId];
            if (superData) {
                if (supermarketPhone) supermarketPhone.textContent = superData.phone;
                if (supplierName) supplierName.textContent = superData.name;
            }

            // Actualizar precios cuando cambia el supermercado
            await updatePricesForSupermarket(selectedId);
        });
    }

    // Obtener usuario
    const usuarioStr = localStorage.getItem("usuario");
    let usuarioId = null;
    if (usuarioStr) {
        usuarioId = JSON.parse(usuarioStr).idUsuario;
    }

    console.log("OrderSumScript cargado - Usuario ID:", usuarioId);

    // Cargar métodos de pago
    let paymentMethods = [];
    function loadPaymentMethods() {
        if (!usuarioId) return;

        fetch(`http://localhost:8080/metodos-pago?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(methods => {
                paymentMethods = methods;
                console.log("Métodos de pago cargados:", methods);

                paymentSelect.innerHTML = "";

                // Agregar opción de Efectivo siempre
                const cashOption = document.createElement("option");
                cashOption.value = "EFECTIVO"; // Valor especial para efectivo
                cashOption.textContent = "Efectivo";
                paymentSelect.appendChild(cashOption);

                if (methods.length > 0) {
                    methods.forEach(method => {
                        const option = document.createElement("option");
                        option.value = method.idMetodoPago;
                        option.textContent = method.tipoPago + (method.ultimosDigitos ? ` (*${method.ultimosDigitos})` : "");
                        paymentSelect.appendChild(option);
                    });
                }
            })
            .catch(err => {
                console.error("Error cargando métodos de pago:", err);
                paymentSelect.innerHTML = '<option value="">Error cargando métodos de pago</option>';
            });
    }

    // Cargar métodos al inicio
    loadPaymentMethods();

    function calculateTotals(products) {
        let subtotal = 0;

        products.forEach(product => {
            // Simulamos un precio aleatorio si no viene del backend, o usamos un precio base
            // En una app real, esto vendría de la base de datos
            const precioUnitario = product.precio || 2500;
            const cantidad = parseInt(product.cantidad) || 1;
            subtotal += precioUnitario * cantidad;
        });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        return { subtotal, iva, total };
    }

    function openModal() {
        console.log("=== ABRIENDO MODAL DE PEDIDO ===");

        // Obtener productos seleccionados
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
        console.log("Checkboxes encontrados:", checkedBoxes.length);

        if (checkedBoxes.length === 0) {
            alert("Selecciona al menos un producto para hacer un pedido.");
            return;
        }

        summaryBody.innerHTML = "";

        let productsList = [];

        checkedBoxes.forEach((box, index) => {
            const li = box.closest("li");
            const product = JSON.parse(li.dataset.product);

            // Asignar precio simulado si no existe
            if (!product.precio) product.precio = 2500;

            productsList.push(product);

            const row = document.createElement("div");
            row.classList.add("order__summary-row");

            const cantidad = parseInt(product.cantidad) || 1;
            const precioTotal = product.precio * cantidad;

            row.innerHTML = `
                <span>${escapeHtml(product.nombreProducto)}</span>
                <span>${cantidad}</span>
                <span>${escapeHtml(product.unidadMedida || "unid")}</span>
                <span>$${product.precio}</span>
            `;
            summaryBody.appendChild(row);
        });

        // Calcular totales
        const totals = calculateTotals(productsList);

        if (subtotalLabel) subtotalLabel.textContent = `$${totals.subtotal.toLocaleString()}`;
        if (ivaLabel) ivaLabel.textContent = `$${totals.iva.toLocaleString()}`;
        if (totalLabel) totalLabel.textContent = `$${totals.total.toLocaleString()}`;

        darkLayer.classList.add("active");
        summContainer.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        console.log("Cerrando modal");
        darkLayer.classList.remove("active");
        summContainer.classList.remove("open");
        document.body.style.overflow = "";
    }

    if (summBtn) {
        summBtn.addEventListener("click", openModal);
        console.log("Event listener agregado al botón Pedido");
    } else {
        console.error("No se encontró el botón order-summary-btn");
    }

    darkLayer.addEventListener("click", closeModal);

    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    })

    // Confirmar Pedido
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            console.log("=== CONFIRMANDO PEDIDO ===");

            if (!usuarioId) {
                alert("Usuario no identificado");
                return;
            }

            // Validar método de pago seleccionado
            const selectedPaymentValue = paymentSelect.value;
            if (!selectedPaymentValue) {
                alert("Por favor seleccione un método de pago");
                return;
            }

            const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");

            if (checkedBoxes.length === 0) {
                alert("No hay productos seleccionados");
                return;
            }

            const detalles = [];

            checkedBoxes.forEach((box, index) => {
                const li = box.closest("li");
                const product = JSON.parse(li.dataset.product);

                detalles.push({
                    idProducto: product.idProductoUsuario,
                    cantidad: parseInt(product.cantidad) || 1
                });
            });

            const pedidoData = {
                idUsuario: usuarioId,
                idSupermercado: parseInt(supermarketSelect.value) || 1,
                idMetodoPago: selectedPaymentValue === "EFECTIVO" ? null : parseInt(selectedPaymentValue),
                detalles: detalles,
                notas: selectedPaymentValue === "EFECTIVO" ? "Pago en Efectivo" : null
            };

            console.log("Datos del pedido a enviar:", pedidoData);

            fetch("http://localhost:8080/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoData)
            })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(text => {
                            try {
                                const json = JSON.parse(text);
                                throw new Error(json.message || `Error HTTP ${res.status}`);
                            } catch (e) {
                                throw new Error(`Error del servidor (${res.status}).`);
                            }
                        });
                    }
                    return res.json();
                })
                .then(pedido => {
                    console.log("Pedido creado:", pedido);
                    alert(`¡Pedido creado exitosamente! Total: $${pedido.total}`);

                    setTimeout(() => {
                        closeModal();
                        checkedBoxes.forEach(box => box.checked = false);
                    }, 2000);
                })
                .catch(err => {
                    console.error("Error al crear pedido:", err);
                    alert("Error al crear el pedido: " + err.message);
                });
        });
    } else {
        console.error("No se encontró el botón confirm");
    }
});
