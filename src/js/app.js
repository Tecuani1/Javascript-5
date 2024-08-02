import { data } from '/src/data/data.js';

document.addEventListener('DOMContentLoaded', () => {
  const artist = data.artistUnion;
  const containerPrincipal = document.createElement('div');
  containerPrincipal.id = 'container-principal';

  // PERFIL ARTISTA
  const profile = document.createElement('div');
  profile.id = 'artist-profile';

  const profileImage = document.createElement('img');
  profileImage.src = artist.profile.imageUrl;
  profileImage.alt = `${artist.profile.name} profile picture`;

  const artistName = document.createElement('div');
  artistName.id = 'artist-name';
  artistName.textContent = artist.profile.name;

  profile.appendChild(profileImage);
  profile.appendChild(artistName);
  containerPrincipal.appendChild(profile);

  // ALBUMS
  const albumsContainer = document.createElement('div');
  albumsContainer.id = 'albums';

  artist.discography.albums.items.forEach((album) => {
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

      // CANCIONES
      const tracksContainer = document.createElement('div');
      tracksContainer.classList.add('tracks');

      release.tracks.items.forEach((track, index) => {
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
      albumsContainer.appendChild(albumCard);
    });
  });

  containerPrincipal.appendChild(albumsContainer);
  document.body.appendChild(containerPrincipal);
});

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
