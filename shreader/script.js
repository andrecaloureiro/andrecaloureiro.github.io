document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos da UI ---
  const textInput = document.getElementById('text-input');
  const goBtn = document.getElementById('go-btn');
  const readerContent = document.getElementById('reader-content');
  const readerWrapper = document.getElementById('reader-content-wrapper');
  
  // Controles Colapsáveis
  const toggleControlsBtn = document.getElementById('toggle-controls-btn');
  const controlsPanel = document.getElementById('controls-panel');
  
  // Botões de Controle
  const playPauseBtn = document.getElementById('play-pause-btn');
  const increaseFontBtn = document.getElementById('increase-font-btn');
  const decreaseFontBtn = document.getElementById('decrease-font-btn');
  const increaseSpeedBtn = document.getElementById('increase-speed-btn');
  const decreaseSpeedBtn = document.getElementById('decrease-speed-btn');
  const increaseScrollBtn = document.getElementById('increase-scroll-btn');
  const decreaseScrollBtn = document.getElementById('decrease-scroll-btn');
  
  // ePub
  const epubFileInput = document.getElementById('epub-file');
  const epubToc = document.getElementById('epub-toc');
  const epubTocTitle = document.getElementById('epub-toc-title');
  const loadingIndicator = document.getElementById('loading-indicator');

  // --- Variáveis de Estado ---
  let words = [];
  let currentWordIndex = 0;
  let isPlaying = false;
  let readInterval;
  let scrollInterval;
  
  // --- Configurações Iniciais ---
  let readingSpeed = 300;
  let fontSize = 22;
  let scrollSpeed = 0;

  // --- LÓGICA DOS CONTROLES COLAPSÁVEIS ---
  toggleControlsBtn.addEventListener('click', () => {
      controlsPanel.classList.toggle('collapsed');
      toggleControlsBtn.textContent = controlsPanel.classList.contains('collapsed') 
          ? 'Controles ☰' 
          : 'Fechar Controles X';
  });

  // --- LÓGICA PRINCIPAL DE LEITURA ---
  goBtn.addEventListener('click', setupReader);
  playPauseBtn.addEventListener('click', togglePlayPause);

  function setupReader() {
      const text = textInput.value.trim();
      if (text) {
          words = text.split(/\s+/).filter(word => word.length > 0);
          renderText();
          resetState();
      }
  }

  function renderText() {
      readerContent.innerHTML = words.map((word, index) => 
          `<span id="word-${index}">${word}</span>`
      ).join(' ');
  }
  
  function resetState() {
      if (isPlaying) togglePlayPause();
      currentWordIndex = 0;
      readerWrapper.scrollTop = 0;
      highlightWord(null);
  }

  function togglePlayPause() {
      if (words.length === 0) return;
      isPlaying = !isPlaying;
      playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
      if (isPlaying) {
          play();
          if (scrollSpeed > 0) startScrolling();
      } else {
          clearInterval(readInterval);
          clearInterval(scrollInterval);
      }
  }

  function play() {
      clearInterval(readInterval);
      readInterval = setInterval(() => {
          if (currentWordIndex < words.length) {
              highlightWord(currentWordIndex);
              currentWordIndex++;
          } else {
              togglePlayPause();
          }
      }, readingSpeed);
  }

  function highlightWord(index) {
      document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
      if (index !== null) {
          const wordEl = document.getElementById(`word-${index}`);
          if (wordEl) {
              wordEl.classList.add('highlight');
              if (!isElementInView(wordEl)) {
                  wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }
      }
  }
  
  function isElementInView(el) {
      const rect = el.getBoundingClientRect();
      const wrapperRect = readerWrapper.getBoundingClientRect();
      return rect.top >= wrapperRect.top && rect.bottom <= wrapperRect.bottom;
  }

  // --- CONTROLES DE FONTE, VELOCIDADE E ROLAGEM ---
  increaseFontBtn.addEventListener('click', () => {
      fontSize += 2;
      readerContent.style.fontSize = `${fontSize}px`;
  });

  decreaseFontBtn.addEventListener('click', () => {
      if (fontSize > 10) {
          fontSize -= 2;
          readerContent.style.fontSize = `${fontSize}px`;
      }
  });

  increaseSpeedBtn.addEventListener('click', () => {
      if (readingSpeed > 50) {
          readingSpeed -= 25;
          if (isPlaying) play();
      }
  });

  decreaseSpeedBtn.addEventListener('click', () => {
      readingSpeed += 25;
      if (isPlaying) play();
  });
  
  increaseScrollBtn.addEventListener('click', () => {
      scrollSpeed += 1;
      if (isPlaying) startScrolling();
  });

  decreaseScrollBtn.addEventListener('click', () => {
      if (scrollSpeed > 0) scrollSpeed -= 1;
      if (scrollSpeed === 0) stopScrolling();
  });

  function startScrolling() {
      stopScrolling();
      if (scrollSpeed > 0 && isPlaying) {
          scrollInterval = setInterval(() => readerWrapper.scrollBy(0, 1), 50 / scrollSpeed);
      }
  }

  function stopScrolling() {
      clearInterval(scrollInterval);
  }
  
  // --- LÓGICA DO EPUB (TOTALMENTE REESCRITA PARA MAIOR CONFIABILIDADE) ---
  epubFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      showLoading('Carregando ePub...');
      const reader = new FileReader();
      
      reader.onload = e => {
          try {
              const book = ePub(e.target.result);
              displayEpubToc(book);
          } catch (error) {
              console.error("Erro ao processar o arquivo ePub:", error);
              showLoading("Erro: Não foi possível ler este arquivo ePub.");
          }
      };

      reader.onerror = () => {
          console.error("Erro ao ler o arquivo.");
          showLoading("Erro ao ler o arquivo.");
      };

      reader.readAsArrayBuffer(file);
  });

  function showLoading(message) {
      loadingIndicator.textContent = message;
      loadingIndicator.classList.remove('hidden');
      epubToc.innerHTML = '';
      epubTocTitle.innerHTML = '';
  }

  function hideLoading() {
      loadingIndicator.classList.add('hidden');
  }

  async function displayEpubToc(book) {
      try {
          const tocItems = await book.loaded.navigation;
          hideLoading();
          epubTocTitle.textContent = 'Capítulos:';
          const tocList = document.createElement('ul');

          tocItems.forEach(chapter => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.textContent = chapter.label.trim();
              a.href = chapter.href;

              a.addEventListener('click', async e => {
                  e.preventDefault();
                  showLoading(`Carregando "${chapter.label.trim()}"...`);
                  
                  try {
                      const section = book.spine.get(chapter.href);
                      const loadedContent = await section.load(book.load.bind(book));
                      
                      // Extrai o texto do corpo (body) do HTML do capítulo
                      const text = loadedContent.body.innerText || loadedContent.body.textContent;
                      
                      textInput.value = text.replace(/\s+/g, ' ').trim();
                      goBtn.click();
                      hideLoading();
                      window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a página para o topo

                  } catch (error) {
                      console.error("Erro ao carregar o capítulo:", error);
                      showLoading(`Erro ao carregar o capítulo: ${chapter.label.trim()}`);
                  }
              });
              li.appendChild(a);
              tocList.appendChild(li);
          });
          epubToc.innerHTML = '';
          epubToc.appendChild(tocList);

      } catch (error) {
          console.error("Erro ao carregar o índice do ePub:", error);
          showLoading("Erro: Não foi possível carregar o índice deste ePub.");
      }
  }
});