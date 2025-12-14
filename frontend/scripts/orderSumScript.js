document.addEventListener("DOMContentLoaded", () => {

    // Escapa texto para evitar problemas de inyección o HTML roto
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

    //supermercados simulados para mostrar el resumen
    const supermarkets = {
        "1": { name: "Éxito", phone: "3001234567" },
        "2": { name: "Carulla", phone: "3109876543" },
        "3": { name: "Jumbo", phone: "6012345678" }
    };

    //se tendrán metodos de pago ya creados para el resumen
    function loadPaymentMethods() {
        paymentSelect.innerHTML = "";

        const cashOption = document.createElement("option");
        cashOption.value = "EFECTIVO";
        cashOption.textContent = "Efectivo";
        paymentSelect.appendChild(cashOption);

        const cardOption = document.createElement("option");
        cardOption.value = "TARJETA";
        cardOption.textContent = "Tarjeta (*1234)";
        paymentSelect.appendChild(cardOption);
    }

    loadPaymentMethods();

    //Se calcula subtotal, IVA y total a partir de los productos seleccionados
    function calculateTotals(products) {
        let subtotal = 0;

        products.forEach(product => {
            const precio = product.precio || 2500;
            const cantidad = parseInt(product.cantidad) || 1;
            subtotal += precio * cantidad;
        });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        return { subtotal, iva, total };
    }

    //abrir el modal y construye el resumen del pedido
    function openModal() {
        const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");

        //no permitir abrir si no hay productos seleccionados de la lista
        if (checkedBoxes.length === 0) {
            alert("Selecciona al menos un producto.");
            return;
        }

        summaryBody.innerHTML = "";
        const products = [];

        checkedBoxes.forEach(box => {
            const li = box.closest("li");
            const product = JSON.parse(li.dataset.product);

            if (!product.precio) product.precio = 2500;
            products.push(product);

            const row = document.createElement("div");
            row.className = "order__summary-row";
            row.innerHTML = `
                <span>${escapeHtml(product.nombreProducto)}</span>
                <span>${product.cantidad || 1}</span>
                <span>${escapeHtml(product.unidadMedida || "unid")}</span>
                <span>$${product.precio.toLocaleString()}</span>
            `;
            summaryBody.appendChild(row);
        });

        const totals = calculateTotals(products);
        subtotalLabel.textContent = `$${totals.subtotal.toLocaleString()}`;
        ivaLabel.textContent = `$${totals.iva.toLocaleString()}`;
        totalLabel.textContent = `$${totals.total.toLocaleString()}`;

        darkLayer.classList.add("active");
        summContainer.classList.add("open");
        document.body.style.overflow = "hidden";
    }


    function closeModal() {
        darkLayer.classList.remove("active");
        summContainer.classList.remove("open");
        document.body.style.overflow = "";
    }

    supermarketSelect.addEventListener("change", e => {
        const data = supermarkets[e.target.value];
        if (data) {
            supermarketPhone.textContent = data.phone;
            supplierName.textContent = data.name;
        }
    });


    summBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

    //mensaje de simulacion de confirmación de pedido
    confirmBtn.addEventListener("click", () => {
        alert("Pedido confirmado ✔️\nGracias por usar TuDespensa");

        document.querySelectorAll(".product-checkbox").forEach(cb => cb.checked = false);

        closeModal();
    });

});
