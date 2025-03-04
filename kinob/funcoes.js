// função para acessar google sheets

const URL_DO_WEB_APP='https://script.google.com/macros/s/AKfycbwmaU2Wf69_J8OGTZ6l8inxn2dCsm0CWsvgYmbghfgd2KyyyVgFa30j7TzID6XYUKjuTg/exec';

async function enviarRegistro() {
    const rotulo = document.getElementById("rotulo").value;
    const log = document.getElementById("log").value;

    const response = await fetch("URL_DO_WEB_APP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rotulo, log }),
    });

    const result = await response.json();
    if (result.status === "sucesso") {
      alert("Registro salvo com sucesso!");
    } else {
      alert("Erro ao salvar o registro.");
    }
  }

async function carregarHistorico() {
  const response = await fetch("URL_DO_WEB_APP");
  const historico = await response.json();

  const lista = document.getElementById("historico-lista");
  lista.innerHTML = ""; // Limpar a lista

  historico.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.timestamp} - ${item.rotulo}: ${item.log}`;
    lista.appendChild(li);
  });
}

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