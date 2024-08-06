import { data } from '/src/data/data.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
  const artist = data?.artistUnion;

  if (!artist) {
    console.log('No se encontraron datos del artista en el archivo.');
    return;
  }

  const containerPrincipal = document.createElement('div');
  containerPrincipal.id = 'container-principal';

  createArtistProfile(artist.profile, artist.stats, containerPrincipal);
  createAlbums(artist.discography?.albums?.items || [], artist.profile.name, containerPrincipal);

  document.body.appendChild(containerPrincipal);
}

function createArtistProfile(profile, stats, container) {
  if (!profile || !stats) {
    console.log('No se encontraron datos del perfil o estadísticas del artista.');
    return;
  }

  const profileDiv = document.createElement('div');
  profileDiv.id = 'artist-profile';
  profileDiv.style.backgroundImage = `url(${profile?.imageUrl})`;

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const artistInfo = document.createElement('div');
  artistInfo.classList.add('artist-info');

  const verifiedContainer = document.createElement('div');
  verifiedContainer.classList.add('verified-container');

  const verifiedIcon = document.createElement('img');
  verifiedIcon.src = '/src/img/icon-verificado.png';
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
  artistName.textContent = profile?.name || 'Unknown Artist';

  artistNameContainer.appendChild(artistName);

  const monthlyListeners = document.createElement('p');
  monthlyListeners.id = 'monthly-listeners';
  const formattedListeners = stats?.monthlyListeners?.toLocaleString() || 'N/A';
  monthlyListeners.textContent = `${formattedListeners} monthly listeners`;

  artistInfo.appendChild(verifiedContainer);
  artistInfo.appendChild(artistNameContainer);
  artistInfo.appendChild(monthlyListeners);
  overlay.appendChild(artistInfo);
  profileDiv.appendChild(overlay);
  container.appendChild(profileDiv);
}

function createAlbums(albums, artistName, container) {
  if (albums.length === 0) {
    console.log('No se encontraron álbumes.');
    return;
  }

  const albumsContainer = document.createElement('div');
  albumsContainer.id = 'albums';

  // Crear el contenedor de botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const playButton = createButton('/src/img/play.svg', 'Play', 'play-button', 'play-button');
  const followButton = createTextButton('Follow', 'follow-button');
  const moreButton = createButton('/src/img/more.svg', 'More', 'more-button', 'more-button');

  buttonsContainer.appendChild(playButton);
  buttonsContainer.appendChild(followButton);
  buttonsContainer.appendChild(moreButton);
  albumsContainer.appendChild(buttonsContainer);

  albums.forEach((album) => {
    album?.releases?.items?.forEach((release) => {
      const albumCard = document.createElement('div');
      albumCard.classList.add('album');

      const albumHeader = document.createElement('div');
      albumHeader.classList.add('album-header');

      const albumImage = document.createElement('img');
      albumImage.src = release?.coverArt?.sources?.[0]?.url || '';
      albumImage.alt = `${release?.name || 'Unknown Album'} cover`;
      albumImage.classList.add('album-image'); // Añadimos la clase para la imagen del álbum

      const albumInfo = document.createElement('div');
      albumInfo.classList.add('album-info');

      const albumTitle = document.createElement('div');
      albumTitle.classList.add('album-title');
      albumTitle.textContent = release?.name || 'Unknown Album';

      const albumYear = document.createElement('div');
      albumYear.classList.add('album-year');
      albumYear.textContent = `Album • ${release?.date?.year || 'Unknown Year'} • ${
        release?.tracks?.items?.length || 0
      } songs`;

      const albumActions = document.createElement('div');
      albumActions.classList.add('album-actions');

      const albumPlayButton = createImageButton('/src/img/play.svg', 'Play', 'album-play-button');
      const albumAddButton = createImageButton('/src/img/add.svg', 'Add', 'album-add-button');
      const albumMoreButton = createImageButton('/src/img/more.svg', 'More', 'album-more-button');

      albumActions.appendChild(albumPlayButton);
      albumActions.appendChild(albumAddButton);
      albumActions.appendChild(albumMoreButton);

      albumInfo.appendChild(albumTitle);
      albumInfo.appendChild(albumYear);
      albumInfo.appendChild(albumActions);

      albumHeader.appendChild(albumImage);
      albumHeader.appendChild(albumInfo);
      albumCard.appendChild(albumHeader);

      createTracks(release?.tracks?.items || [], albumCard, artistName);
      albumsContainer.appendChild(albumCard);
    });
  });

  container.appendChild(albumsContainer);
}

function createButton(imagePath, altText, id, cssClass) {
  const button = document.createElement('button');
  button.classList.add(cssClass);
  button.id = id;

  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = altText;
  button.appendChild(img);

  button.addEventListener('click', () => {
    console.log(`Button clicked: ${altText}`);
  });

  return button;
}

function createTextButton(text, id) {
  const button = document.createElement('button');
  button.textContent = text;
  button.id = id;
  button.classList.add('follow-button');

  button.addEventListener('click', () => {
    console.log(`Button clicked: ${text}`);
  });

  return button;
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

function createTracks(tracks, albumCard, artistName) {
  if (tracks.length === 0) {
    console.log('No se encontraron pistas.');
    return;
  }

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

  const img = document.createElement('img');
  img.src = '/src/img/time.svg';
  img.alt = 'Time Icon';

  headerDuration.appendChild(img);
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
    trackName.textContent = track?.track?.name || 'Unknown Track';

    const artistNameDiv = document.createElement('div');
    artistNameDiv.id = 'artist-name-track';
    artistNameDiv.textContent = artistName;

    trackTitle.appendChild(trackName);
    trackTitle.appendChild(artistNameDiv);

    const trackDuration = document.createElement('div');
    trackDuration.classList.add('track-duration');
    const durationMs = track?.track?.duration?.totalMilliseconds;
    trackDuration.textContent = durationMs ? formatDuration(durationMs) : 'N/A';

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
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

