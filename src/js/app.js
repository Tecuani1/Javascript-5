import { data } from '/src/data/data.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
  const { artistUnion: artist } = data || {};
  if (!artist) {
    console.error('No se encontraron datos del artista en el archivo.');
    return;
  }
  
  const containerPrincipal = createElementWithAttributes('div', {
    className: 'principal-container',
  });
  
  createArtistProfile(artist.profile, artist.stats, containerPrincipal);
  createAlbums(artist.discography?.albums?.items || [], artist.profile.name, containerPrincipal);
  
  document.body.appendChild(containerPrincipal);
}

function createElementWithAttributes(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.classList.add(...value.split(' '));
    } else {
      element[key] = value;
    }
  });
  
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
    className: 'artist-profile',
  });
  
  const profileImage = createElementWithAttributes('img', {
    src: profile.imageUrl,
    alt:`${profile.name} profile picture`,
    className: 'profile-image',
  });
  
  const overlay = createElementWithAttributes('div', { className: 'overlay' });
  const artistInfo = createElementWithAttributes('div', { className: 'artist-info' });
  
  if (profile.verified) {
    const verifiedContainer = createElementWithAttributes('div', {
      className: 'verified-container',
    }, [
      createElementWithAttributes('img', {
        src: '/src/img/icon-verificado.png',
        alt: 'Artista verificado',
      }),
      createElementWithAttributes('span', {}, ['Verified Artist']),
    ]);
    
    artistInfo.appendChild(verifiedContainer);
  }
  
  const artistName = createElementWithAttributes('h1', {
    className: 'artist-name',
    textContent: profile.name || 'Unknown Artist',
  });
  
  const formattedListeners = stats.monthlyListeners?.toLocaleString();
  const monthlyListeners = createElementWithAttributes('p', {
    className: 'monthly-listeners',
    textContent: formattedListeners ? `${formattedListeners} monthly listeners` : '',
  });
  
  artistInfo.appendChild(createElementWithAttributes('div', { className: 'artist-name-container' }, [artistName]));
  artistInfo.appendChild(monthlyListeners);
  
  overlay.appendChild(artistInfo);
  profileDiv.appendChild(profileImage); 
  profileDiv.appendChild(overlay);
  
  container.appendChild(profileDiv);
}

function createAlbums(albums, artistName, container) {
  if (!albums.length) {
    showEmptyState(container, 'No se encontraron álbumes.');
    return;
  }
  
  const albumsContainer = createElementWithAttributes('div', { className: 'albums' });
  albumsContainer.appendChild(createButtonsContainer());
  
  albums.forEach((album) => {
    album?.releases?.items.forEach((release) => {
      const releaseName = release?.name || 'Unknown Album';
      const albumImage = createElementWithAttributes('img', {
        src: release?.coverArt?.sources?.[0]?.url || '',
        alt: `${releaseName} cover`,
        className: 'album-image',
      });
      
      const albumInfo = createElementWithAttributes('div', { className: 'album-info' }, [
        createElementWithAttributes('div', { className: 'album-title', textContent: releaseName }),
        createElementWithAttributes('div', {
          className: 'album-year',
          textContent: `Album • ${release?.date?.year || 'Unknown Year'} • ${release?.tracks?.items?.length || 0} songs`,
        }),
        createAlbumActions(),
      ]);
      
      const albumCard = createElementWithAttributes('div', { className: 'album' }, [
        createElementWithAttributes('div', { className: 'album-header' }, [albumImage, albumInfo]),
      ]);
      
      createTracks(release?.tracks?.items || [], albumCard, artistName);
      albumsContainer.appendChild(albumCard);
    });
  });
  
  container.appendChild(albumsContainer);
}

function createAlbumActions() {
  return createElementWithAttributes('div', { className: 'album-actions' }, [
    createButtonUnified({
      imagePath: '/src/img/play.svg',
      altText: 'Play',
      cssClass: 'album-action-button',
      type: 'image',
    }),
    createButtonUnified({
      imagePath: '/src/img/add.svg',
      altText: 'Add',
      cssClass: 'album-action-button',
      type: 'image',
    }),
    createButtonUnified({
      imagePath: '/src/img/more.svg',
      altText: 'More',
      cssClass: 'album-action-button',
      type: 'image',
    }),
  ]);
}

function createTracks(tracks, albumCard, artistName) {
  if (!tracks.length) {
    console.warn('No se encontraron pistas.');
    return;
  }
  
  const headerRow = createElementWithAttributes('div', { className: 'track track-header' }, [
    createElementWithAttributes('div', { className: 'track-number', textContent: '#' }),
    createElementWithAttributes('div', { className: 'track-title', textContent: 'Título' }),
    createElementWithAttributes('div', { className: 'track-duration' }, [
      createElementWithAttributes('img', { src: '/src/img/time.svg', alt: 'Time Icon' }),
    ]),
  ]);
  
  const tracksTable = createElementWithAttributes('div', { className: 'tracks-table' }, [headerRow]);
  
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
  
  const tracksContainer = createElementWithAttributes('div', { className: 'tracks' }, [tracksTable]);
  albumCard.appendChild(tracksContainer);
}

function createButtonsContainer() {
  const buttonsContainer = createElementWithAttributes('div', { className: 'buttons-container' });
  
  buttonsContainer.appendChild(createButtonUnified({
    imagePath: '/src/img/play.svg',
    altText: 'Play',
    id: 'play-button',
    cssClass: 'play-button',
    type: 'image',
  }));
  
  buttonsContainer.appendChild(createButtonUnified({
    text: 'Follow',
    id: 'follow-button',
    cssClass: 'follow-button',
    type: 'text',
  }));
  
  buttonsContainer.appendChild(createButtonUnified({
    imagePath: '/src/img/more.svg',
    altText: 'More',
    id: 'more-button',
    cssClass: 'more-button',
    type: 'image',
  }));
  
  return buttonsContainer;
}

function createButtonUnified({ text, imagePath, altText, id, cssClass, type }) {
  const button = createElementWithAttributes(
    'button',
    { id, className: cssClass },
    type === 'image'
      ? [createElementWithAttributes('img', { src: imagePath, alt: altText })]
      : [text],
  );
  
  button.addEventListener('click', () => {
    console.log(`Button clicked: ${text || altText}`);
  });
  
  return button;
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function showEmptyState(container, message) {
  const emptyStateMessage = createElementWithAttributes('p', {
    className: 'empty-state-message',
    textContent: message,
  });
  
  container.appendChild(emptyStateMessage);
}