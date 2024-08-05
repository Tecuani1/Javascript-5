import { data } from '/src/data/data.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
  const artist = data.artistUnion;
  const containerPrincipal = document.createElement('div');
  containerPrincipal.id = 'container-principal';

  createArtistProfile(artist.profile, artist.stats, containerPrincipal);
  createAlbums(artist.discography.albums.items, containerPrincipal);

  document.body.appendChild(containerPrincipal);
}

function createArtistProfile(profile, stats, container) {
  const profileDiv = document.createElement('div');
  profileDiv.id = 'artist-profile';
  profileDiv.style.backgroundImage = `url(${profile.imageUrl})`;

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const artistInfo = document.createElement('div');
  artistInfo.classList.add('artist-info');

  const verifiedContainer = document.createElement('div');
  verifiedContainer.classList.add('verified-container');

  const verifiedIcon = document.createElement('img');
  verifiedIcon.src = '/src/img/icon-verificado.png'; // Ruta local a la imagen del ícono de verificación
  verifiedIcon.alt = 'Artista verificado';
  verifiedIcon.classList.add('verified-icon');

  const verifiedText = document.createElement('span');
  verifiedText.textContent = 'Verified Artist';

  verifiedContainer.appendChild(verifiedIcon);
  verifiedContainer.appendChild(verifiedText);

  const artistNameContainer = document.createElement('div');
  artistNameContainer.classList.add('artist-name-container');

  const artistName = document.createElement('h1');
  artistName.id = 'artist-name';
  artistName.textContent = profile.name;

  artistNameContainer.appendChild(artistName);

  const monthlyListeners = document.createElement('p');
  monthlyListeners.id = 'monthly-listeners';
  monthlyListeners.textContent = `${stats.monthlyListeners} monthly listeners`;//Duda formato de oyentes

  artistInfo.appendChild(verifiedContainer);
  artistInfo.appendChild(artistNameContainer);
  artistInfo.appendChild(monthlyListeners);
  overlay.appendChild(artistInfo);
  profileDiv.appendChild(overlay);
  container.appendChild(profileDiv);
}

function createAlbums(albums, container) {
  const albumsContainer = document.createElement('div');
  albumsContainer.id = 'albums';

  albums.forEach((album) => {
    album.releases.items.forEach((release) => {
      const albumCard = document.createElement('div');
      albumCard.classList.add('album');

      const albumHeader = document.createElement('div');
      albumHeader.classList.add('album-header');

      const albumImage = document.createElement('img');
      albumImage.src = release.coverArt.sources[0].url;
      albumImage.alt = `${release.name} cover`;

      const albumInfo = document.createElement('div');
      albumInfo.classList.add('album-info');

      const albumTitle = document.createElement('div');
      albumTitle.classList.add('album-title');
      albumTitle.textContent = release.name;

      const albumYear = document.createElement('div');
      albumYear.classList.add('album-year');
      albumYear.textContent = `Album • ${release.date.year} • ${release.tracks.items.length} songs`;

      const albumActions = document.createElement('div');
      albumActions.classList.add('album-actions');

      const playButton = createImageButton('/src/img/play.svg', 'Play', 'play-button');
      const addButton = createImageButton('/src/img/add.svg', 'Add', 'add-button');
      const moreButton = createImageButton('/src/img/more.svg', 'More', 'more-button');

      albumActions.appendChild(playButton);
      albumActions.appendChild(addButton);
      albumActions.appendChild(moreButton);

      albumInfo.appendChild(albumTitle);
      albumInfo.appendChild(albumYear);
      albumInfo.appendChild(albumActions);

      albumHeader.appendChild(albumImage);
      albumHeader.appendChild(albumInfo);
      albumCard.appendChild(albumHeader);

      createTracks(release.tracks.items, albumCard);
      albumsContainer.appendChild(albumCard);
    });
  });

  container.appendChild(albumsContainer);
}

function createImageButton(imagePath, altText, id) {
  const button = document.createElement('button');
  button.classList.add('album-action-button');

  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = altText;
  img.id = id;

  button.appendChild(img);
  button.addEventListener('click', () => {
    console.log(`Button clicked: ${altText}`);
  });

  return button;
}

function createTracks(tracks, albumCard) {
  const tracksContainer = document.createElement('div');
  tracksContainer.classList.add('tracks');

  const tracksTable = document.createElement('div');
  tracksTable.classList.add('tracks-table');

  // Crear el encabezado de la tabla
  const headerRow = document.createElement('div');
  headerRow.classList.add('track', 'track-header');

  const headerNumber = document.createElement('div');
  headerNumber.classList.add('track-number');
  headerNumber.textContent = '#';

  const headerTitle = document.createElement('div');
  headerTitle.classList.add('track-title');
  headerTitle.textContent = 'Título';

  const headerDuration = document.createElement('div');
  headerDuration.classList.add('track-duration');
  headerDuration.textContent = 'Duración';

  headerRow.appendChild(headerNumber);
  headerRow.appendChild(headerTitle);
  headerRow.appendChild(headerDuration);
  tracksTable.appendChild(headerRow);

  // Crear las filas de las canciones
  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.classList.add('track');

    const trackNumber = document.createElement('div');
    trackNumber.classList.add('track-number');
    trackNumber.textContent = `${index + 1}`;

    const trackTitle = document.createElement('div');
    trackTitle.classList.add('track-title');

    const trackName = document.createElement('div');
    trackName.classList.add('track-name');
    trackName.textContent = track.track.name;

    const artistName = document.createElement('div');
    artistName.id = 'Artist-name';
    artistName.textContent = 'Artic Monkeys'; //Duda: como pasar el profile:name

    trackTitle.appendChild(trackName);
    trackTitle.appendChild(artistName);

    const trackDuration = document.createElement('div');
    trackDuration.classList.add('track-duration');
    if (track.track.duration && track.track.duration.totalMilliseconds) {
      trackDuration.textContent = formatDuration(track.track.duration.totalMilliseconds);
    } else {
      trackDuration.textContent = 'N/A';
    }

    trackItem.appendChild(trackNumber);
    trackItem.appendChild(trackTitle);
    trackItem.appendChild(trackDuration);
    tracksTable.appendChild(trackItem);
  });

  tracksContainer.appendChild(tracksTable);
  albumCard.appendChild(tracksContainer);
}

function formatDuration(ms) {
  const date = new Date(ms);
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
