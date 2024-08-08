import { data } from '/src/data/data.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
  const artist = data?.artistUnion;

  if (!artist) {
    console.log('No se encontraron datos del artista en el archivo.');
    return;
  }

  const containerPrincipal = createElementWithAttributes('div', {
    id: 'container-principal',
  });

  createArtistProfile(artist.profile, artist.stats, containerPrincipal);
  createAlbums(artist.discography?.albums?.items || [], artist.profile.name, containerPrincipal);

  document.body.appendChild(containerPrincipal);
}

function createElementWithAttributes(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'style') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data-')) {
      element.dataset[key.slice(5)] = value;
    } else {
      element[key] = value;
    }
  }

  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

function createArtistProfile(profile, stats, container) {
  if (!profile || !stats) {
    showEmptyState(container, 'No se encontraron datos del perfil o estadísticas del artista.');
    return;
  }

  const profileDiv = createElementWithAttributes('div', {
    id: 'artist-profile',
    style: { backgroundImage: `url(${profile?.imageUrl})` },
  });

  const overlay = createElementWithAttributes('div', { className: 'overlay' });
  const artistInfo = createElementWithAttributes('div', { className: 'artist-info' });

  if (profile.verified) {
    const verifiedIcon = createElementWithAttributes('img', {
      src: '/src/img/icon-verificado.png',
      alt: 'Artista verificado',
    });

    const verifiedText = createElementWithAttributes('span', {}, ['Verified Artist']);
    const verifiedContainer = createElementWithAttributes(
      'div',
      { className: 'verified-container' },
      [verifiedIcon, verifiedText],
    );

    artistInfo.appendChild(verifiedContainer);
  }

  const artistName = createElementWithAttributes('h1', {
    id: 'artist-name',
    textContent: profile?.name || 'Unknown Artist',
  });
  const artistNameContainer = createElementWithAttributes(
    'div',
    { className: 'artist-name-container' },
    [artistName],
  );

  const formattedListeners = stats?.monthlyListeners?.toLocaleString();
  const monthlyListeners = createElementWithAttributes('p', {
    id: 'monthly-listeners',
    textContent: formattedListeners ? `${formattedListeners} monthly listeners` : '',
    style: { display: formattedListeners ? 'block' : 'none' },
  });

  artistInfo.appendChild(artistNameContainer);
  artistInfo.appendChild(monthlyListeners);
  overlay.appendChild(artistInfo);
  profileDiv.appendChild(overlay);
  container.appendChild(profileDiv);
}

function createAlbums(albums, artistName, container) {
  if (albums.length === 0) {
    showEmptyState(container, 'No se encontraron álbumes.');
    return;
  }

  const albumsContainer = createElementWithAttributes('div', { id: 'albums' });
  const buttonsContainer = createButtonsContainer();
  albumsContainer.appendChild(buttonsContainer);

  albums.forEach((album) => {
    album?.releases?.items?.forEach((release) => {
      const releaseName = release?.name || 'Unknown Album';

      const albumImage = createElementWithAttributes('img', {
        src: release?.coverArt?.sources?.[0]?.url || '',
        alt: `${releaseName} cover`,
        className: 'album-image',
      });

      const albumTitle = createElementWithAttributes('div', {
        className: 'album-title',
        textContent: releaseName,
      });
      const albumYear = createElementWithAttributes('div', {
        className: 'album-year',
        textContent: `Album • ${release?.date?.year || 'Unknown Year'} • ${
          release?.tracks?.items?.length || 0
        } songs`,
      });

      const albumPlayButton = createButtonUnified({
        imagePath: '/src/img/play.svg',
        altText: 'Play',
        cssClass: 'album-action-button',
        type: 'image',
      });

      const albumAddButton = createButtonUnified({
        imagePath: '/src/img/add.svg',
        altText: 'Add',
        cssClass: 'album-action-button',
        type: 'image',
      });

      const albumMoreButton = createButtonUnified({
        imagePath: '/src/img/more.svg',
        altText: 'More',
        cssClass: 'album-action-button',
        type: 'image',
      });

      const albumActions = createElementWithAttributes('div', { className: 'album-actions' }, [
        albumPlayButton,
        albumAddButton,
        albumMoreButton,
      ]);
      const albumInfo = createElementWithAttributes('div', { className: 'album-info' }, [
        albumTitle,
        albumYear,
        albumActions,
      ]);
      const albumHeader = createElementWithAttributes('div', { className: 'album-header' }, [
        albumImage,
        albumInfo,
      ]);

      const albumCard = createElementWithAttributes('div', { className: 'album' }, [albumHeader]);

      createTracks(release?.tracks?.items || [], albumCard, artistName);
      albumsContainer.appendChild(albumCard);
    });
  });

  container.appendChild(albumsContainer);
}

function createTracks(tracks, albumCard, artistName) {
  if (tracks.length === 0) {
    console.log('No se encontraron pistas.');
    return;
  }

  const headerNumber = createElementWithAttributes('div', {
    className: 'track-number',
    textContent: '#',
  });
  const headerTitle = createElementWithAttributes('div', {
    className: 'track-title',
    textContent: 'Título',
  });
  const headerDuration = createElementWithAttributes('div', { className: 'track-duration' }, [
    createElementWithAttributes('img', { src: '/src/img/time.svg', alt: 'Time Icon' }),
  ]);

  const headerRow = createElementWithAttributes('div', { className: 'track track-header' }, [
    headerNumber,
    headerTitle,
    headerDuration,
  ]);
  const tracksTable = createElementWithAttributes('div', { className: 'tracks-table' }, [
    headerRow,
  ]);

  tracks.forEach((track, index) => {
    const trackNumber = createElementWithAttributes('div', {
      className: 'track-number',
      textContent: `${index + 1}`,
    });
    const trackName = createElementWithAttributes('div', {
      className: 'track-name',
      textContent: track?.track?.name || 'Unknown Track',
    });
    const artistNameDiv = createElementWithAttributes('div', {
      id: 'artist-name-track',
      textContent: artistName,
    });
    const trackTitle = createElementWithAttributes('div', { className: 'track-title' }, [
      trackName,
      artistNameDiv,
    ]);

    const durationMs = track?.track?.duration?.totalMilliseconds;
    const trackDuration = createElementWithAttributes('div', {
      className: 'track-duration',
      textContent: durationMs ? formatDuration(durationMs) : 'N/A',
    });

    const trackItem = createElementWithAttributes('div', { className: 'track' }, [
      trackNumber,
      trackTitle,
      trackDuration,
    ]);
    tracksTable.appendChild(trackItem);
  });

  const tracksContainer = createElementWithAttributes('div', { className: 'tracks' }, [
    tracksTable,
  ]);
  albumCard.appendChild(tracksContainer);
}

function createButtonsContainer() {
  const buttonsContainer = createElementWithAttributes('div', { className: 'buttons-container' });

  const playButton = createButtonUnified({
    imagePath: '/src/img/play.svg',
    altText: 'Play',
    id: 'play-button',
    cssClass: 'play-button',
    type: 'image',
  });

  const followButton = createButtonUnified({
    text: 'Follow',
    id: 'follow-button',
    cssClass: 'follow-button',
    type: 'text',
  });

  const moreButton = createButtonUnified({
    imagePath: '/src/img/more.svg',
    altText: 'More',
    id: 'more-button',
    cssClass: 'more-button',
    type: 'image',
  });

  buttonsContainer.appendChild(playButton);
  buttonsContainer.appendChild(followButton);
  buttonsContainer.appendChild(moreButton);

  return buttonsContainer;
}

function createButtonUnified({ text, imagePath, altText, id, cssClass, type }) {
  let button;

  if (type === 'image') {
    button = createElementWithAttributes('button', { className: cssClass, id: id }, [
      createElementWithAttributes('img', { src: imagePath, alt: altText }),
    ]);
  } else if (type === 'text') {
    button = createElementWithAttributes('button', {
      textContent: text,
      id: id,
      className: cssClass,
    });
  }

  button.addEventListener('click', () => {
    console.log(`Button clicked: ${text || altText}`);
  });

  return button;
}

function formatDuration(ms) {
  const date = new Date(ms);
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function showEmptyState(container, message) {
  const emptyStateDiv = createElementWithAttributes('div', { className: 'empty-state' }, [
    createElementWithAttributes('p', { textContent: message }),
  ]);

  container.appendChild(emptyStateDiv);
}
