'use strict';

const endpoint =
  'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data));

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

function transpositionMatch(input, target) {
  if (fuzzyMatch(input, target)) return true;

  for (let i = 0; i < input.length - 1; i++) {
    let transposed =
      input.slice(0, i) + input[i + 1] + input[i] + input.slice(i + 2);

    if (fuzzyMatch(transposed, target)) return true;
  }

  return false;
}

function matchWords(inputWords, target) {
  return inputWords.every(inputWord => {
    return target
      .split(' ')
      .some(targetWord => transpositionMatch(inputWord, targetWord));
  });
}

function findMatches(wordToMatch, cities) {
  const inputWords = wordToMatch.toLowerCase().split(' ');

  return cities.filter(place => {
    const cityWords = place.city.toLowerCase().split(' ');
    const stateWords = place.state.toLowerCase().split(' ');

    // Check if all input words match any part of the city or state
    return (
      matchWords(inputWords, place.city) ||
      matchWords(inputWords, place.state)
    );
  });
}
// Old find matches
/*function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    // here we need to figure out if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    // return place.city.match(regex) || place.state.match(regex);
    return (
      transpositionMatch(wordToMatch, place.city) ||
      transpositionMatch(wordToMatch, place.state)
    );
  });
}*/

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function applyHighlighting(text, input) {
  let highlightedText = '';
  let inputIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (
      inputIndex < input.length &&
      text[i].toLowerCase() === input[inputIndex].toLowerCase()
    ) {
      // Highlight the character and move to the next input character
      highlightedText += `<span class="hl">${text[i]}</span>`;
      inputIndex++;
    } else {
      highlightedText += text[i];
    }

    // If all input characters have been matched, append the rest of the text as is
    if (inputIndex === input.length) {
      highlightedText += text.slice(i + 1);
      break;
    }
  }

  // If input characters remain unmatched, just return the highlighted text
  return highlightedText;
}

function displayMatches() {
  const matchArray = findMatches(this.value, cities);
  const limitedResults = matchArray.slice(0, 5); // Limit results to 5
  const inputValue = this.value.toLowerCase();

  const html = limitedResults
    .map(place => {
      let cityName = place.city;
      let stateName = place.state;
      let population = place.population;

      // Apply fuzzy highlighting
      cityName = applyHighlighting(cityName, inputValue);
      stateName = applyHighlighting(stateName, inputValue);

      return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
        <span class="population">${numberWithCommas(population)}</span>
      </li>
    `;
    })
    .join('');

  suggestionsPlace.innerHTML = html;

  if (this.value === '') {
    suggestionsPlace.innerHTML = ''; // Clear the suggestions if input is empty
    return;
  }
}

const searchInput = document.querySelector('.search-input');
const suggestionsPlace = document.querySelector('.result');
// const suggestions = document.querySelector('.filter-suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);