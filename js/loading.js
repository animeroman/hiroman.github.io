document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const loadingSpinner = document.getElementById('search-loading');
    const suggestionsPlace = document.querySelector('.result');

    function showLoading() {
        loadingSpinner.style.display = 'block';
        suggestionsPlace.style.display = 'none';  // Hide results while loading
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
        if (suggestionsPlace.innerHTML.trim() !== '') {
            suggestionsPlace.style.display = 'block';  // Show results if there are any
        } else {
            suggestionsPlace.style.display = 'none';  // Keep hidden if no results
        }
    }

    // Show the loading spinner when typing
    searchInput.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            showLoading();
        } else {
            hideLoading();
        }
    });

    // Listen to custom event to hide loading after results are loaded
    document.addEventListener('resultsLoaded', hideLoading);
});
