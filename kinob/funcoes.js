// Função para tornar os elementos collapsibles funcionais
document.addEventListener("DOMContentLoaded", function () {
    const collapsibles = document.querySelectorAll(".collapsible");

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener("click", function () {
            // Fecha outros elementos collapsibles no mesmo nível
            const parentContent = this.nextElementSibling;
            const isActive = this.classList.toggle("active");

            if (isActive) {
                parentContent.style.display = "block";
            } else {
                parentContent.style.display = "none";
            }

            // Fecha todos os outros collapsibles dentro do mesmo nível
            Array.from(collapsible.parentNode.children).forEach(child => {
                if (child !== this && child.classList.contains("collapsible")) {
                    child.classList.remove("active");
                    child.nextElementSibling.style.display = "none";
                }
            });
        });
    });

    // Funções para os carrosséis
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach(carousel => {
        const imagesContainer = carousel.querySelector(".carousel-images");
        const prevButton = carousel.querySelector(".carousel-button.prev");
        const nextButton = carousel.querySelector(".carousel-button.next");
        const totalImages = imagesContainer.children.length;
        let currentIndex = 0;

        // Função para atualizar o carrossel
        function updateCarousel() {
            const offset = -currentIndex * 200; // Calcula o deslocamento baseado na largura da imagem
            imagesContainer.style.transform = `translateX(${offset}px)`;
        }

        // Evento para o botão "Próximo"
        nextButton.addEventListener("click", () => {
            if (currentIndex < totalImages - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Volta ao início
            }
            updateCarousel();
        });

        // Evento para o botão "Anterior"
        prevButton.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalImages - 1; // Vai para o final
            }
            updateCarousel();
        });
    });
});