document.addEventListener("DOMContentLoaded", () => {
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

    const historyList = document.getElementById("history-list");
    const modal = document.getElementById("order-summary");
    const darkLayer = document.querySelector(".dark__layer");
    const bodyContainer = document.getElementById("order-summary-body");
    const supplierName = document.getElementById("supplier-name");
    const totalLabel = document.getElementById("order-total");
    const returnBtn = document.getElementById("return-btn");

    returnBtn.addEventListener("click", () => {
        window.location.href = "optionsPerUser.html";
    });

    //pedidos sin backend
    const pedidosMock = [
        {
            idPedido: 1,
            fechaPedido: "2025-02-10",
            total: 28500,
            estadoPedido: "Entregado",
            supermercado: { nombreSupermercado: "Éxito" },
            detalles: [
                {
                    cantidad: 2,
                    precioUnitario: 4500,
                    productoSupermercado: {
                        nombreProducto: "Arroz",
                        unidadMedida: "kg"
                    }
                },
                {
                    cantidad: 1,
                    precioUnitario: 19500,
                    productoSupermercado: {
                        nombreProducto: "Aceite",
                        unidadMedida: "L"
                    }
                }
            ]
        },
        {
            idPedido: 2,
            fechaPedido: "2025-02-25",
            total: 13200,
            estadoPedido: "Pendiente",
            supermercado: { nombreSupermercado: "Carulla" },
            detalles: [
                {
                    cantidad: 3,
                    precioUnitario: 4400,
                    productoSupermercado: {
                        nombreProducto: "Leche",
                        unidadMedida: "L"
                    }
                }
            ]
        }
    ];

    function loadOrders() {
        historyList.innerHTML = "";

        pedidosMock.forEach(renderPedido);
    }

    function renderPedido(pedido) {
        const li = document.createElement("li");
        li.classList.add("history__item");
        li.dataset.id = pedido.idPedido;

        const fecha = new Date(pedido.fechaPedido).toLocaleDateString();
        const proveedor = pedido.supermercado?.nombreSupermercado || "Desconocido";

        li.innerHTML = `
            <p class="date">📅 ${fecha}</p>
            <p><strong>Proveedor:</strong> ${escapeHtml(proveedor)}</p>
            <p><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
            <p><strong>Estado:</strong> ${escapeHtml(pedido.estadoPedido)}</p>
        `;

        li.addEventListener("click", () => openPedido(pedido));

        historyList.appendChild(li);
    }

    //reutilización de un modal para el detalle de un pedido
    function openPedido(pedido) {
        bodyContainer.innerHTML = "";

        pedido.detalles.forEach(det => {
            const row = document.createElement("div");
            row.classList.add("order__summary-row");

            row.innerHTML = `
                <span>${escapeHtml(det.productoSupermercado.nombreProducto)}</span>
                <span>${det.cantidad}</span>
                <span>${escapeHtml(det.productoSupermercado.unidadMedida)}</span>
                <span>$${det.precioUnitario.toLocaleString()}</span>
            `;

            bodyContainer.appendChild(row);
        });

        supplierName.textContent = pedido.supermercado.nombreSupermercado;
        totalLabel.textContent = `$${pedido.total.toLocaleString()}`;

        const existingBtn = document.getElementById("download-invoice-btn");
        if (existingBtn) existingBtn.remove();

        //posible botón para descargar cuando se integre la base de datos ///
        const downloadBtn = document.createElement("button");
        downloadBtn.id = "download-invoice-btn";
        downloadBtn.textContent = "Descargar Factura";
        downloadBtn.style.marginTop = "10px";
        downloadBtn.style.fontWeight = "bold";

        downloadBtn.addEventListener("click", () => {
            alert("Descarga de factura simulada");
        });

        bodyContainer.parentElement.appendChild(downloadBtn);

        darkLayer.classList.add("active");
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        darkLayer.classList.remove("active");
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    darkLayer.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

    loadOrders();

});
