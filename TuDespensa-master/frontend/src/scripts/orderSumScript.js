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
    const totalLabel = document.getElementById("order-total");
    const paymentSelect = document.getElementById("payment-method-select");

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
                if (methods.length === 0) {
                    paymentSelect.innerHTML = '<option value="">No hay métodos de pago disponibles</option>';
                } else {
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

        checkedBoxes.forEach((box, index) => {
            const li = box.closest("li");
            const product = JSON.parse(li.dataset.product);

            const row = document.createElement("div");
            row.classList.add("order__summary-row");

            row.innerHTML = `
                <span>${escapeHtml(product.nombreProducto)}</span>
                <span>${parseInt(product.cantidad) || 1}</span>
                <span>${escapeHtml(product.unidadMedida || "unid")}</span>
                <span>Ver en confirmación</span>
            `;
            summaryBody.appendChild(row);
        });

        // Mostrar proveedor (Makro por defecto)
        const supplierNameElement = document.getElementById("supplier-name");
        if (supplierNameElement) {
            supplierNameElement.textContent = "Makro";
        }

        totalLabel.textContent = "Ver en confirmación";

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
            const selectedPaymentId = parseInt(paymentSelect.value);
            if (!selectedPaymentId) {
                alert("Por favor seleccione un método de pago");
                return;
            }

            const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
            console.log("Productos seleccionados:", checkedBoxes.length);

            if (checkedBoxes.length === 0) {
                alert("No hay productos seleccionados");
                return;
            }

            const detalles = [];

            checkedBoxes.forEach((box, index) => {
                const li = box.closest("li");
                const product = JSON.parse(li.dataset.product);
                console.log(`Agregando producto ${index}:`, product);

                detalles.push({
                    idProducto: product.idProductoUsuario,
                    cantidad: parseInt(product.cantidad) || 1
                });
            });

            const pedidoData = {
                idUsuario: usuarioId,
                idSupermercado: 1, // Default - Makro
                idMetodoPago: selectedPaymentId, // Usar el método seleccionado
                detalles: detalles
            };

            console.log("Datos del pedido a enviar:", pedidoData);

            fetch("http://localhost:8080/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedidoData)
            })
                .then(res => {
                    console.log("Respuesta del servidor:", res.status);
                    console.log("Content-Type:", res.headers.get("content-type"));

                    // Si no es 200, intentar leer el error
                    if (!res.ok) {
                        // Intentar leer como texto primero
                        return res.text().then(text => {
                            console.log("Respuesta del servidor (texto):", text);

                            // Intentar parsear como JSON
                            try {
                                const json = JSON.parse(text);
                                throw new Error(json.message || `Error HTTP ${res.status}`);
                            } catch (e) {
                                // Si no es JSON, es probablemente HTML de error
                                throw new Error(`Error del servidor (${res.status}). Revisa la consola de IntelliJ para más detalles.`);
                            }
                        });
                    }

                    return res.json();
                })
                .then(pedido => {
                    console.log("Pedido creado:", pedido);

                    // Actualizar el modal con los precios reales del backend
                    summaryBody.innerHTML = "";
                    let totalReal = 0;

                    if (pedido.detalles && pedido.detalles.length > 0) {
                        pedido.detalles.forEach(detalle => {
                            const row = document.createElement("div");
                            row.classList.add("order__summary-row");

                            const nombreProd = detalle.productoSupermercado ? detalle.productoSupermercado.nombreProducto : "Producto";
                            const unidad = detalle.productoSupermercado ? detalle.productoSupermercado.unidadMedida : "unid";
                            const precio = detalle.precioUnitario || 0;
                            const subtotal = precio * detalle.cantidad;
                            totalReal += subtotal;

                            row.innerHTML = `
                                <span>${escapeHtml(nombreProd)}</span>
                                <span>${detalle.cantidad}</span>
                                <span>${escapeHtml(unidad)}</span>
                                <span>$${precio}</span>
                            `;
                            summaryBody.appendChild(row);
                        });
                    }

                    // Actualizar proveedor
                    const supplierNameElement = document.getElementById("supplier-name");
                    if (supplierNameElement && pedido.supermercado) {
                        supplierNameElement.textContent = pedido.supermercado.nombreSupermercado;
                    }

                    // Actualizar total
                    totalLabel.textContent = `$${pedido.total || totalReal}`;

                    alert(`¡Pedido creado exitosamente! Total: $${pedido.total || totalReal}`);

                    // Desmarcar checkboxes después de un delay
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
        console.log("Event listener agregado al botón Confirmar");
    } else {
        console.error("No se encontró el botón confirm");
    }
});