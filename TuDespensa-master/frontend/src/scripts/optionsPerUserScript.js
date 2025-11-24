const btnLista = document.getElementById("list-btn");
const btnHistorial = document.getElementById("order-history-btn");
const btnPayment = document.getElementById("payment-btn");

// Elementos de notificaciones
const notifBtn = document.getElementById("notification-btn");
const notifDropdown = document.getElementById("notification-dropdown");
const notifList = document.getElementById("notification-list");
const notifBadge = document.getElementById("notification-badge");

document.addEventListener("DOMContentLoaded", () => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        const greeting = document.querySelector("h1");
        if (greeting) {
            greeting.textContent = `👋Hola ${usuario.nombre}`;
        }
        loadNotifications(usuario.idUsuario);
    } else {
        // Si no hay usuario, redirigir a login o mostrar error
        // window.location.href = "logIn.html";
    }
});

btnLista.addEventListener("click", () => {
    window.location.href = "registerProducts.html";
})

btnHistorial.addEventListener("click", () => {
    window.location.href = "orderHistory.html";
})

btnPayment.addEventListener("click", () => {
    window.location.href = "addPaymetMet.html";
})

// Lógica de Notificaciones
if (notifBtn) {
    notifBtn.addEventListener("click", () => {
        const isVisible = notifDropdown.style.display === "block";
        notifDropdown.style.display = isVisible ? "none" : "block";
    });
}

// Cerrar dropdown si se hace click fuera
document.addEventListener("click", (e) => {
    if (notifDropdown && notifBtn && !notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.style.display = "none";
    }
});

function loadNotifications(usuarioId) {
    fetch(`http://localhost:8080/notificaciones?usuario_id=${usuarioId}`)
        .then(res => res.json())
        .then(notificaciones => {
            notifList.innerHTML = "";
            if (notificaciones.length === 0) {
                notifList.innerHTML = "<li style='padding: 10px; text-align: center; color: #888;'>No tienes notificaciones nuevas.</li>";
                notifBadge.style.display = "none";
            } else {
                notifBadge.textContent = notificaciones.length;
                notifBadge.style.display = "block";

                notificaciones.forEach(notif => {
                    const li = document.createElement("li");
                    li.style.padding = "10px";
                    li.style.borderBottom = "1px solid #eee";
                    li.style.fontSize = "0.9em";

                    const fecha = new Date(notif.fechaEnvio).toLocaleString();

                    li.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 3px;">${notif.mensaje}</div>
                        <div style="font-size: 0.8em; color: #aaa;">${fecha}</div>
                    `;
                    notifList.appendChild(li);
                });
            }
        })
        .catch(err => {
            console.error("Error cargando notificaciones:", err);
            notifList.innerHTML = "<li style='padding: 10px; text-align: center; color: red;'>Error al cargar.</li>";
        });
}