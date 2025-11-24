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

    const historyList = document.getElementById("history-list");
    const modal = document.getElementById("order-summary");
    const darkLayer = document.querySelector(".dark__layer");
    const bodyContainer = document.getElementById("order-summary-body");
    const supplierName = document.getElementById("supplier-name");
    const totalLabel = document.getElementById("order-total");
    const returnBtn = document.getElementById("return-btn");

    returnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    })

    // Obtener usuario
    const usuarioStr = localStorage.getItem("usuario");
    let usuarioId = null;
    if (usuarioStr) {
        usuarioId = JSON.parse(usuarioStr).idUsuario;
    }

    function loadOrders() {
        if (!usuarioId) {
            historyList.innerHTML = "<li class='history__item'>Error: Usuario no identificado.</li>";
            return;
        }

        fetch(`http://localhost:8080/pedidos?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(pedidos => {
                historyList.innerHTML = "";
                if (pedidos.length === 0) {
                    historyList.innerHTML = "<li class='history__item'>No tienes pedidos registrados.</li>";
                } else {
                    pedidos.forEach(renderPedido);
                }
            })
            .catch(err => {
                console.error("Error cargando historial:", err);
                historyList.innerHTML = "<li class='history__item'>Error al cargar historial.</li>";
            });
    }

    function renderPedido(pedido) {
        const li = document.createElement("li");
        li.classList.add("history__item");
        li.dataset.id = pedido.idPedido;

        const fecha = new Date(pedido.fechaPedido).toLocaleDateString();
        const proveedor = pedido.supermercado ? pedido.supermercado.nombreSupermercado : "Desconocido";
        const total = pedido.total || 0;

        li.innerHTML = `
            <p class="date">📅 ${fecha}</p>
            <p><strong>Proveedor:</strong> ${escapeHtml(proveedor)}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Estado:</strong> ${escapeHtml(pedido.estadoPedido || "Pendiente")}</p>
        `;

        li.addEventListener("click", () => openPedido(pedido));

        historyList.appendChild(li);
    }

    function openPedido(pedido) {
        bodyContainer.innerHTML = "";

        if (pedido.detalles) {
            pedido.detalles.forEach(det => {
                const row = document.createElement("div");
                row.classList.add("order__summary-row");

                const nombreProd = det.productoSupermercado ? det.productoSupermercado.nombreProducto : "Producto";
                const unidad = det.productoSupermercado ? det.productoSupermercado.unidadMedida : "unid";
                const precio = det.precioUnitario || 0;

                row.innerHTML = `
                    <span>${escapeHtml(nombreProd)}</span>
                    <span>${det.cantidad}</span>
                    <span>${escapeHtml(unidad)}</span>
                    <span>$${precio}</span>
                `;
                bodyContainer.appendChild(row);
            });
        }

        supplierName.textContent = pedido.supermercado ? pedido.supermercado.nombreSupermercado : "Desconocido";
        totalLabel.textContent = `$${pedido.total || 0}`;

        // Botón de descarga de factura
        const existingBtn = document.getElementById("download-invoice-btn");
        if (existingBtn) existingBtn.remove();

        const downloadBtn = document.createElement("a");
        downloadBtn.href = `http://localhost:8080/facturas/${pedido.idPedido}/descargar`;
        downloadBtn.target = "_blank";
        downloadBtn.textContent = "Descargar Factura";
        downloadBtn.style.display = "block";
        downloadBtn.style.marginTop = "10px";
        downloadBtn.style.textAlign = "center";
        downloadBtn.style.color = "#3498db";
        downloadBtn.style.textDecoration = "none";
        downloadBtn.style.fontWeight = "bold";
        downloadBtn.id = "download-invoice-btn";
        bodyContainer.parentElement.appendChild(downloadBtn);


        darkLayer.classList.add("active");
        modal.classList.add("open");
    }

    function closeModal() {
        darkLayer.classList.remove("active");
        modal.classList.remove("open");
    }

    darkLayer.addEventListener("click", () => {
        closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    })

    if (usuarioId) {
        loadOrders();
    }
});
