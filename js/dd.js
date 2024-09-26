// JSON data point
const endpoint = 'https://animeroman.github.io/Source/json/search.json';

// Store the selected server type globally to remember it across episodes
let selectedServerType = localStorage.getItem('selectedServerType') || 'sub'; // Default to 'sub'
let selectedServerIndex = localStorage.getItem('selectedServerIndex') || 1; // Default to 'SUB-1' or 'DUB-1'
let selectedEpisode = localStorage.getItem('selectedEpisode') || 1; // Default to Episode 1

// Function to create the episode list
function createEpisodeList(data) {
  const detailInforContent = document.querySelector('.detail-infor-content');

  // Track the total number of episodes
  let totalEpisodes = 0;
  data.episodes.forEach(episode => {
    totalEpisodes = Math.max(totalEpisodes, episode.episodeNumber);
  });

  // Create the episode list container
  const ssList = `
        <div id="ss-list" class="ss-list"></div>
    `;
  detailInforContent.insertAdjacentHTML('beforeend', ssList);

  const container = document.querySelector('.ss-list');

  // Create the episode HTML dynamically
  data.episodes.forEach(episode => {
    const isActive = episode.episodeNumber == selectedEpisode ? 'active' : ''; // Mark active episode
    const episodeHTML = `
            <a
                title="Episode ${episode.episodeNumber}"
                class="ssl-item ep-item ${isActive}"
                data-number="${episode.episodeNumber}"
                data-subserver1="${episode.subServer1}"
                data-subserver2="${episode.subServer2}"
                data-dubserver1="${episode.dubServer1}"
                data-dubserver2="${episode.dubServer2}"
                href="javascript:;"
            >
                <div class="ssli-order">${episode.episodeNumber}</div>
                <div class="ssli-detail">
                    <div
                        class="ep-name e-dynamic-name"
                        data-jname="${data.animeOriginal}"
                        title="${data.animeEnglish}"
                    >
                        ${episode.title}
                    </div>
                </div>
                <div class="ssli-btn">
                    <div class="btn btn-circle">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="clearfix"></div>
            </a>
        `;
    container.insertAdjacentHTML('beforeend', episodeHTML);
  });

  // Add click event listener to each episode link
  const episodeLinks = container.querySelectorAll('.ep-item');
  episodeLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Get server URLs from the clicked element's data attributes
      const subServer1 = this.getAttribute('data-subserver1');
      const subServer2 = this.getAttribute('data-subserver2');
      const dubServer1 = this.getAttribute('data-dubserver1');
      const dubServer2 = this.getAttribute('data-dubserver2');
      const episodeNumber = this.getAttribute('data-number');

      if (!subServer1 || !subServer2 || !dubServer1 || !dubServer2) {
        console.error('Server URLs are missing!');
        return;
      }

      // Store the selected episode in localStorage
      localStorage.setItem('selectedEpisode', episodeNumber);

      // Remove 'active' class from previously selected episode
      container.querySelectorAll('.ep-item').forEach(ep => {
        ep.classList.remove('active');
      });

      // Add 'active' class to the clicked episode
      this.classList.add('active');

      // Update the server list based on the selected episode
      updateServerList(subServer1, subServer2, dubServer1, dubServer2);
    });
  });

  // Simulate click on the previously selected episode (or the first episode if none was selected)
  const selectedEpisodeElement = container.querySelector(
    `.ep-item[data-number="${selectedEpisode}"]`
  );
  if (selectedEpisodeElement) {
    selectedEpisodeElement.click();
  }
}

// Function to update the server list and handle server selection
function updateServerList(subServer1, subServer2, dubServer1, dubServer2) {
  const serversContent = document.querySelector('.player-servers');
  serversContent.innerHTML = `
    <div id="servers-content">
        <div class="ps_-status">
            <div class="content">
                <div class="server-notice">
                    If the current server doesn't work, please try other servers below.
                </div>
            </div>
        </div>

        <div class="ps_-block ps_-block-sub servers-sub">
            <div class="ps__-title">
                <i class="fas fa-closed-captioning mr-2"></i>SUB:
            </div>
            <div class="ps__-list">
                <div class="item server-item" data-src="${subServer1}">
                    <a href="javascript:;" class="btn" data-type="sub" data-index="1">SUB-1</a>
                </div>
                <div class="item server-item" data-src="${subServer2}">
                    <a href="javascript:;" class="btn" data-type="sub" data-index="2">SUB-2</a>
                </div>
            </div>
        </div>

        <div class="ps_-block ps_-block-sub servers-dub">
            <div class="ps__-title">
                <i class="fas fa-microphone-alt mr-2"></i>DUB:
            </div>
            <div class="ps__-list">
                <div class="item server-item" data-src="${dubServer1}">
                    <a href="javascript:;" class="btn" data-type="dub" data-index="1">DUB-1</a>
                </div>
                <div class="item server-item" data-src="${dubServer2}">
                    <a href="javascript:;" class="btn" data-type="dub" data-index="2">DUB-2</a>
                </div>
            </div>
        </div>
    </div>
    `;

  // Automatically select the server based on the last selected or default to the first server
  const defaultServerSelector = serversContent.querySelector(
    `.btn[data-type="${selectedServerType}"][data-index="${selectedServerIndex}"]`
  );
  if (defaultServerSelector) {
    defaultServerSelector.click(); // Trigger click to load the server
  }

  // Add event listeners for server buttons to update iframe's src and store server type/index
  const serverButtons = serversContent.querySelectorAll('.server-item a');
  serverButtons.forEach(button => {
    button.addEventListener('click', function() {
      const serverItem = this.parentElement; // Get the parent .server-item div
      const serverSrc = serverItem.getAttribute('data-src'); // Get the src from data-src

      // Update the iframe src with the selected server URL
      const playerIframe = document.getElementById('iframe-embed');
      playerIframe.src = serverSrc;

      // Remove 'active' class from any previously active button
      serversContent.querySelectorAll('.server-item a').forEach(btn => {
        btn.classList.remove('active');
      });

      // Add 'active' class to the clicked button
      this.classList.add('active');

      // Store the selected server type and index in localStorage
      selectedServerType = this.getAttribute('data-type');
      selectedServerIndex = this.getAttribute('data-index');
      localStorage.setItem('selectedServerType', selectedServerType);
      localStorage.setItem('selectedServerIndex', selectedServerIndex);
    });
  });
}

// Fetch the anime data from the endpoint and run the episode list creation
window.onload = function() {
  const currentPage = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');
  console.log(`Current page: ${currentPage}`); // Result: '0-firstsubfolder'

  // Fetch the anime data from the JSON endpoint
  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      const matchingAnime = data.filter(ani => ani.page === currentPage);
      if (matchingAnime.length > 0) {
        createEpisodeList(matchingAnime[0]);
      } else {
        console.error('No matching anime found for the current page');
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
};
