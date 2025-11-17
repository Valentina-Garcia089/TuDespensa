const btnLista = document.getElementById("list-btn");
const btnHistorial = document.getElementById("order-history-btn");
const btnPayment = document.getElementById("payment-btn");

btnLista.addEventListener("click", () => {
    window.location.href = "registerProducts.html";
})

btnHistorial.addEventListener("click", () => {
    window.location.href = "orderHistory.html";
})

btnPayment.addEventListener("click", () => {
    window.location.href = "addPaymetMet.html";
})