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
    monthlyListeners.textContent = `${stats.monthlyListeners} monthly listeners`;
  
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

      const albumTitle = document.createElement('div');
      albumTitle.classList.add('album-title');
      albumTitle.textContent = release.name;

      const albumYear = document.createElement('div');
      albumYear.classList.add('album-year');
      albumYear.textContent = release.date.year;

      albumHeader.appendChild(albumImage);
      albumHeader.appendChild(albumTitle);
      albumHeader.appendChild(albumYear);
      albumCard.appendChild(albumHeader);

      createTracks(release.tracks.items, albumCard);
      albumsContainer.appendChild(albumCard);
    });
  });

  container.appendChild(albumsContainer);
}

function createTracks(tracks, albumCard) {
  const tracksContainer = document.createElement('div');
  tracksContainer.classList.add('tracks');

  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.classList.add('track');

    const trackName = document.createElement('div');
    trackName.classList.add('track-name');
    trackName.textContent = `${index + 1}. ${track.track.name}`;

    const trackDuration = document.createElement('div');
    trackDuration.classList.add('track-duration');
    if (track.track.duration && track.track.duration.totalMilliseconds) {
      trackDuration.textContent = formatDuration(track.track.duration.totalMilliseconds);
    } else {
      trackDuration.textContent = 'N/A';
    }

    trackItem.appendChild(trackName);
    trackItem.appendChild(trackDuration);
    tracksContainer.appendChild(trackItem);
  });

  albumCard.appendChild(tracksContainer);
}

function formatDuration(ms) {
  const date = new Date(ms);
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
