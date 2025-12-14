const btnLista = document.getElementById("list-btn");
const btnHistorial = document.getElementById("order-history-btn");
const btnPayment = document.getElementById("payment-btn");

const notifBtn = document.getElementById("notification-btn");
const notifDropdown = document.getElementById("notification-dropdown");
const notifList = document.getElementById("notification-list");
const notifBadge = document.getElementById("notification-badge");

document.addEventListener("DOMContentLoaded", () => {
    const usuarioStr = localStorage.getItem("usuario");

    if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        const greeting = document.querySelector("h1");
        if (greeting) greeting.textContent = `👋Hola ${usuario.nombre}`;
        loadNotifications();
    }
});

btnLista.addEventListener("click", () => {
    window.location.href = "registerProducts.html";
});

btnHistorial.addEventListener("click", () => {
    window.location.href = "orderHistory.html";
});

btnPayment.addEventListener("click", () => {
    window.location.href = "addPaymetMet.html";
});

if (notifBtn) {
    notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.style.display =
            notifDropdown.style.display === "block" ? "none" : "block";
    });
}

document.addEventListener("click", (e) => {
    if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.style.display = "none";
    }
});

function loadNotifications() {
    const notificaciones = [
        {
            mensaje: "Tu lista de compras fue guardada",
            fechaEnvio: "2024-05-01T10:30:00"
        },
        {
            mensaje: "Recuerda agregar un método de pago",
            fechaEnvio: "2024-05-02T14:15:00"
        }
    ];

    notifList.innerHTML = "";

    if (notificaciones.length === 0) {
        notifBadge.style.display = "none";
        return;
    }

    notifBadge.textContent = notificaciones.length;
    notifBadge.style.display = "block";

    notificaciones.forEach(n => {
        const li = document.createElement("li");
        const fecha = new Date(n.fechaEnvio).toLocaleString();

        li.innerHTML = `
            <div>${n.mensaje}</div>
            <div style="font-size: 0.8em; color: #aaa;">${fecha}</div>
        `;
        notifList.appendChild(li);
    });
}
