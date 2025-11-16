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

    const addNewBtn = document.getElementById("add-method-btn");
    const hiddenmodal = document.getElementById("hidden-options");
    const returnBtn = document.querySelector(".return__button2");
    const darkLayer = document.querySelector(".dark__layer");

    const addCreditCard = document.getElementById("credit__card-btn");
    const hiddenForm = document.getElementById("hidden-method");

    function openModal(){
        darkLayer.classList.add("active");
        hiddenmodal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal(){
        darkLayer.classList.remove("active");
        hiddenmodal.classList.remove("open");
        document.body.style.overflow = "";
    }

    function openForm(){
        darkLayer.classList.add("active");
        hiddenmodal.classList.remove("open"); /*Cerrar el modal anterior*/ 
        hiddenForm.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeForm(){
        darkLayer.classList.remove("active");
        hiddenForm.classList.remove("open");
        document.body.style.overflow = "";
    }

    addNewBtn.addEventListener("click", openModal);
    darkLayer.addEventListener("click", closeModal);
    returnBtn.addEventListener("click", closeModal);

    addCreditCard.addEventListener("click", openForm);
    document.addEventListener("keydown", (e) =>{
        if(e.key === "Escape"){
            closeModal();
        }
    })
});