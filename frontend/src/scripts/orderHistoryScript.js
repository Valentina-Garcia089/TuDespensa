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


    
    //SUGERENCIA DE CHATCITO PARA IMPLEMENTAR ESTA PANTALLA CON BASE DE DATOS:

    /* =============================
       EJEMPLO — REEMPLÁZALO POR FETCH
       ============================== */

    const pedidosUsuario = [
        {
            id: 1,
            fecha: "2024-11-10",
            proveedor: "Makro",
            total: 45000,
            productos: [
                { nombre: "Arroz", cantidad: 2, unidad: "kg", costo: 10000 },
                { nombre: "Leche", cantidad: 3, unidad: "unid", costo: 5000 },
            ]
        },
        {
            id: 2,
            fecha: "2024-11-05",
            proveedor: "Éxito",
            total: 28500,
            productos: [
                { nombre: "Huevos", cantidad: 30, unidad: "unid", costo: 15000 },
                { nombre: "Pan", cantidad: 1, unidad: "paquete", costo: 3500 },
            ]
        }
    ];

    /* =============================
       CARGAR HISTORIAL EN LA LISTA
       ============================== */
    function renderHistorial() {
        pedidosUsuario.forEach(pedido => {
            const li = document.createElement("li");
            li.classList.add("history__item");
            li.dataset.id = pedido.id;

            li.innerHTML = `
                <p class="date">📅 ${pedido.fecha}</p>
                <p><strong>Proveedor:</strong> ${pedido.proveedor}</p>
                <p><strong>Total:</strong> $${pedido.total}</p>
            `;

            li.addEventListener("click", () => openPedido(pedido));

            historyList.appendChild(li);
        });
    }

    


    //se abre la ventana modal con los datos de historial de compra
    function openPedido(pedido) {

        bodyContainer.innerHTML = "";

        pedido.productos.forEach(prod => {
            const row = document.createElement("div");
            row.classList.add("order__summary-row");

            row.innerHTML = `
                <span>${prod.nombre}</span>
                <span>${prod.cantidad}</span>
                <span>${prod.unidad}</span>
                <span>$${prod.costo}</span>
            `;
            bodyContainer.appendChild(row);
        });

        supplierName.textContent = pedido.proveedor;
        totalLabel.textContent = `$${pedido.total}`;

        darkLayer.classList.add("active");
        modal.classList.add("open");
    }

    //cierre del modal y del dark layer debajo

    function closeModal(){
        darkLayer.classList.remove("active");
        modal.classList.remove("open");
    }
    
    darkLayer.addEventListener("click", () => {
        closeModal();
    });

    document.addEventListener("keydown", (e) =>{
        if(e.key === "Escape"){
            closeModal();
        }
    })

    renderHistorial();
});
