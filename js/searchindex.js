'use strict';

import endpoint from './search.js';
import searchData from './search.js';
import fetch from './search.js';
import fuzzyMatch from './search.js';
import transpositionMatch from './search.js';
import matchWords from './search.js';
import findMatches from './search.js';
import numberWithCommas from './search.js';
import applyHighlighting from './search.js';
import displayMatches from './search.js';

const searchInput = document.querySelector('.search-input');
const resultsContainer = document.querySelector('.suggestion-place');
// const suggestions = document.querySelector('.filter-suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
