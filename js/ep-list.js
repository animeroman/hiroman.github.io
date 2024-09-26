// Function to update the episode list and create the dropdown structure
const updateList = totalEpisodes => {
  const seasonsBlock = document.querySelector('.seasons-block');
  const detailSsList = document.querySelector('#detail-ss-list');

  // If total episodes exceed 100, add 'seasons-block-max' to the class
  if (totalEpisodes > 100) {
    seasonsBlock.classList.add('seasons-block-max');
  }

  const numPages = Math.ceil(totalEpisodes / 100); // Calculate number of pages

  // Loop through the number of episode groups (100 each)
  for (let i = 0; i < numPages; i++) {
    const start = i * 100 + 1;
    const end = Math.min((i + 1) * 100, totalEpisodes); // Ensure it doesn't exceed total episodes

    // Create the ssc-name div
    const sscNameDiv = document.createElement('div');
    sscNameDiv.className = 'ssc-name';
    sscNameDiv.setAttribute('data-toggle', 'dropdown');
    sscNameDiv.setAttribute('aria-haspopup', 'true');
    sscNameDiv.setAttribute('aria-expanded', 'false');
    sscNameDiv.innerHTML = `
                <i class="fas fa-list mr-3"></i>
                <span id="current-page">EPS: ${start}-${end}</span>
                <i class="fas fa-angle-down ml-2"></i>
            `;

    // Create the dropdown menu div (empty for now)
    const dropdownMenuDiv = document.createElement('div');
    dropdownMenuDiv.className = 'dropdown-menu dropdown-menu-model';
    dropdownMenuDiv.setAttribute('aria-labelledby', 'ssc-list');

    // Append both the ssc-name div and the empty dropdown menu div to #detail-ss-list
    detailSsList.appendChild(sscNameDiv);
    detailSsList.appendChild(dropdownMenuDiv);
  }

  // Call attachEvents after updating the list to populate the dropdown items
  attachEvents(totalEpisodes);
};

// Function to attach event listeners and populate the dropdown items
const attachEvents = totalEpisodes => {
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');

  const numPages = Math.ceil(totalEpisodes / 100);

  // Loop through each dropdown menu and add the appropriate <a> elements inside
  dropdownMenus.forEach((dropdownMenu, i) => {
    for (let j = 0; j <= i; j++) {
      const pageStart = j * 100 + 1;
      const pageEnd = Math.min((j + 1) * 100, totalEpisodes);

      // Create the <a> dropdown item
      const dropdownLink = document.createElement('a');
      dropdownLink.className = 'dropdown-item ep-page-item';
      dropdownLink.setAttribute('data-page', j + 1);
      dropdownLink.setAttribute('href', 'javascript:;');
      dropdownLink.innerHTML = `
                    EPS: ${pageStart
                      .toString()
                      .padStart(3, '0')}-${pageEnd.toString().padStart(3, '0')}
                    <i style="display: none;" class="fas fa-check ic-active ml-2"></i>
                `;

      // Append the <a> element to the dropdown menu
      dropdownMenu.appendChild(dropdownLink);
    }
  });

  // Now attach click event listeners to the newly created dropdown items
  const dropdownItems = document.querySelectorAll(
    '.dropdown-item.ep-page-item'
  );

  dropdownItems.forEach(item => {
    item.addEventListener('click', event => {
      const target = event.currentTarget;
      const dataPage = target.getAttribute('data-page');

      // Handle the click event, e.g., load the episodes for the selected range
      console.log(
        `Page ${dataPage} clicked: Loading episodes ${target.textContent}`
      );

      // Update the UI or perform other necessary actions (e.g., highlight selected)
      dropdownItems.forEach(dropItem => {
        const checkIcon = dropItem.querySelector('.ic-active');
        if (dropItem === target) {
          checkIcon.style.display = 'inline-block';
        } else {
          checkIcon.style.display = 'none';
        }
      });
    });
  });
};

// Example: Call updateList with the total number of episodes
document.addEventListener('DOMContentLoaded', () => {
  const totalEpisodes = 500; // Dynamically set this based on your data
  updateList(totalEpisodes); // Update the list with episode navigation
});
