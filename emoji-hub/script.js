const apiUrl = 'https://emojihub.yurace.pro/api/all';
const emojiListContainer = document.getElementById('emojiList');
const categoryFilter = document.getElementById('category');
const paginationContainer = document.getElementById('pagination');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');

let emojis = [];
let currentPage = 1;
const emojisPerPage = 10;

async function fetchAndExtractCategories() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const categories = [...new Set(data.map(emoji => emoji.category))];

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', filterAndDisplayEmojis);

    emojis = data;
    filterAndDisplayEmojis();
  } catch (error) {
    console.error('Error fetching emojis:', error);
  }
}

function filterAndDisplayEmojis() {
  const selectedCategory = categoryFilter.value;
  const filteredEmojis = selectedCategory ? emojis.filter(emoji => emoji.category === selectedCategory) : emojis;

  displayEmojis(filteredEmojis);
  renderPagination(filteredEmojis.length);
}

function displayEmojis(emojisToDisplay) {
  emojiListContainer.innerHTML = '';

  const startIndex = (currentPage - 1) * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const emojisToShow = emojisToDisplay.slice(startIndex, endIndex);

  emojisToShow.forEach(emoji => {
    const emojiCard = document.createElement('div');
    emojiCard.classList.add('emojiCard');

    const emojiHTML = document.createElement('p');
    emojiHTML.innerHTML = emoji.htmlCode;

    const emojiDetails = document.createElement('p');
    emojiDetails.innerHTML = `
      Name: ${emoji.name}<br>
      Category: ${emoji.category}<br>
      Group: ${emoji.group}
    `;

    emojiCard.appendChild(emojiHTML);
    emojiCard.appendChild(emojiDetails);

    emojiListContainer.appendChild(emojiCard);
  });
}

function renderPagination(totalEmojis) {
  const totalPages = Math.ceil(totalEmojis / emojisPerPage);
  paginationContainer.innerHTML = '';

  const firstButtonIndex = Math.max(currentPage - 5, 1);
  const lastButtonIndex = Math.min(currentPage + 4, totalPages);

  if (firstButtonIndex > 1) {
    const previousButton = createPaginationButton(1, '<<');
    paginationContainer.appendChild(previousButton);
    paginationContainer.appendChild(document.createTextNode('...'));
  }

  for (let i = firstButtonIndex; i <= lastButtonIndex; i++) {
    const pageLink = createPaginationButton(i, i);
    if (i === currentPage) {
      pageLink.classList.add('active');
    }
    paginationContainer.appendChild(pageLink);
  }

  if (lastButtonIndex < totalPages) {
    paginationContainer.appendChild(document.createTextNode('...'));
    const nextButton = createPaginationButton(totalPages, '>>');
    paginationContainer.appendChild(nextButton);
  }
}

function createPaginationButton(page, text) {
  const pageLink = document.createElement('a');
  pageLink.classList.add('paginationButton');
  pageLink.href = '#';
  pageLink.textContent = text;
  pageLink.addEventListener('click', () => {
    currentPage = page;
    filterAndDisplayEmojis();
  });
  return pageLink;
}

previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    filterAndDisplayEmojis();
  }
});

nextButton.addEventListener('click', () => {
  const totalEmojis = categoryFilter.value ? emojis.filter(emoji => emoji.category === categoryFilter.value).length : emojis.length;
  const totalPages = Math.ceil(totalEmojis / emojisPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    filterAndDisplayEmojis();
  }
});

fetchAndExtractCategories();
