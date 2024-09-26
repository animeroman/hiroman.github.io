'use strict';

const resultsPerPage = 36;
let currentPage = 1; // Keep track of the current page
let totalPages = 0; // Total pages based on the number of results

// const endpoint = 'json/search.json';
const endpoint = 'https://animeroman.github.io/Source/json/search.json';

const searchData = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    searchData.push(...data);
    const keyword = getQueryParam('keyword');
    if (keyword) {
      displayMatches(keyword, currentPage); // Trigger search with the keyword and current page
    }
  });

// Function to get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fuzzy match function
function fuzzyMatch(input, target) {
  input = input.toLowerCase();
  target = target.toLowerCase();

  let inputIndex = 0;
  let targetIndex = 0;

  while (inputIndex < input.length && targetIndex < target.length) {
    if (input[inputIndex] === target[targetIndex]) {
      inputIndex++;
    }
    targetIndex++;
  }

  return inputIndex === input.length; // Return true if all characters in input are matched in target
}

// Transposition match function (for input character swaps)
function transpositionMatch(input, target) {
  if (fuzzyMatch(input, target)) return true;

  for (let i = 0; i < input.length - 1; i++) {
    let transposed =
      input.slice(0, i) + input[i + 1] + input[i] + input.slice(i + 2);

    if (fuzzyMatch(transposed, target)) return true;
  }

  return false;
}

// Match words with transposition
function matchWords(inputWords, target) {
  return inputWords.every(inputWord => {
    return target
      .split(' ')
      .some(targetWord => transpositionMatch(inputWord, targetWord));
  });
}

// Find matches based on the input word
function findMatches(wordToMatch, searchData) {
  const inputWords = wordToMatch.toLowerCase().split(' ');

  return searchData.filter(place => {
    const animeEnglishWords = place.animeEnglish.toLowerCase().split(' ');
    const animeOriginalWords = place.animeOriginal.toLowerCase().split(' ');

    // Check if all input words match any part of the animeEnglish or animeOriginal
    return (
      matchWords(inputWords, place.animeEnglish) ||
      matchWords(inputWords, place.animeOriginal)
    );
  });
}

// Display matches for the search input with pagination
function displayMatches(inputValue, page) {
  const matchArray = findMatches(inputValue, searchData);

  totalPages = Math.ceil(matchArray.length / resultsPerPage); // Calculate total pages
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = matchArray.slice(startIndex, endIndex); // Get results for the current page

  const html = paginatedResults
    .map(place => {
      let animeEnglishName = place.animeEnglish;
      let animeOriginalName = place.animeOriginal;
      let animeDuration = place.duration;
      let animeType = place.type;
      let animeDate = place.date;
      let posterLink = place.poster;
      let pageLink = place.page;

      return `
      <div class="flw-item flw-item-big">
        <div class="film-poster">
          <div class="tick ltr">
            <div class="tick-item tick-sub">
              <i class="fas fa-closed-captioning mr-1"></i>${place.subCount}
            </div>
            <div class="tick-item tick-dub">
              <i class="fas fa-microphone mr-1"></i>${place.dubCount}
            </div>
          </div>
          <img data-src="${posterLink}" class="film-poster-img lazyload" />
          <a href="${pageLink}" class="film-poster-ahref item-qtip"><i class="fas fa-play"></i></a>
        </div>
        <div class="film-detail">
          <h3 class="film-name">
            <a href="${pageLink}" class="dynamic-name" data-jname="${animeOriginalName}">
              ${animeEnglishName}
            </a>
          </h3>
          <div class="description"></div>
          <div class="fd-infor">
            <span class="fdi-item">${animeType}</span>
            <span class="dot"></span>
            <span class="fdi-item fdi-duration">${animeDuration}</span>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    `;
    })
    .join('');

  resultsContainer.innerHTML = html;

  if (inputValue === '') {
    resultsContainer.innerHTML = ''; // Clear the suggestions if input is empty
  }

  updatePagination(page); // Update pagination controls
}

// Update pagination controls
function updatePagination(currentPage) {
  const paginationPlace = document.querySelector('.pagination-pages');
  let paginationHTML = '';

  // Calculate the starting and ending page numbers for pagination
  let startPage = Math.max(currentPage - 1, 1); // Start 1 page before current, minimum 1
  let endPage = Math.min(currentPage + 1, totalPages); // End 1 page after current, maximum totalPages

  // Ensure that there are exactly 3 pages displayed (if possible)
  if (endPage - startPage < 2) {
    if (startPage === 1) {
      endPage = Math.min(3, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(totalPages - 2, 1);
    }
  }

  // First page button
  if (currentPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a title="First" class="page-link" href="#" onclick="goToPage(1)">&laquo;</a>
      </li>`;
  }

  // Previous page button
  if (currentPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a title="Previous" class="page-link" href="#" onclick="goToPage(${currentPage -
          1})">&lsaquo;</a>
      </li>`;
  }

  // Page numbers (display only 3 pages)
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <li class="page-item active"><a class="page-link">${i}</a></li>`;
    } else {
      paginationHTML += `
        <li class="page-item"><a class="page-link" href="#" onclick="goToPage(${i})">${i}</a></li>`;
    }
  }

  // Next page button
  if (currentPage < totalPages) {
    paginationHTML += `
      <li class="page-item">
        <a title="Next" class="page-link" href="#" onclick="goToPage(${currentPage +
          1})">&rsaquo;</a>
      </li>`;
  }

  // Last page button
  if (currentPage < totalPages) {
    paginationHTML += `
      <li class="page-item">
        <a title="Last" class="page-link" href="#" onclick="goToPage(${totalPages})">&raquo;</a>
      </li>`;
  }

  paginationPlace.innerHTML = paginationHTML;
}

// Go to the specified page
function goToPage(page) {
  currentPage = page;
  const keyword = getQueryParam('keyword'); // Get the current search keyword
  if (keyword) {
    displayMatches(keyword, page); // Display matches for the new page
  }
}

// Initialize search with keyword from URL if present
window.onload = function() {
  const keyword = getQueryParam('keyword'); // Get the keyword from the URL
  if (keyword) {
    displayMatches(keyword, currentPage); // Trigger search with the keyword and current page
  }
};

// Event listeners for input changes
/*
const searchInput = document.querySelector('.search-input');
*/
const resultsContainer = document.querySelector('.film_list-wrap');
/*
searchInput.addEventListener('change', function() {
  displayMatches(this.value, currentPage);
});
searchInput.addEventListener('keyup', function() {
  displayMatches(this.value, currentPage);
});
*/
