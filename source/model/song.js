import Random from 'react-native-meteor/lib/Random';
import g from '@common/global';
import youtube from '@components/youtube';
import { defineProperty } from './base';

function setupSong(v) {
  if (v.is_setup) return;

  const orgInfo = Object.assign({}, v);
  const file = g.findMDFileUrl(v.files);
  const isApple = !g.isEmpty(v.appleStoreId);
  const isSpotify = !isApple && !g.isEmpty(v.spotifyPlayableUri);
  const isYoutube = !isApple && !isSpotify && (youtube.isYoutubeUrl(file) || !g.isEmpty(v.youTubeId));
  const isVideo = !isApple && !isSpotify && (isYoutube || v.type === 'video');
  const youtubeId = g.ifEmpty(v.youTubeId, file);
  const type = isApple ? 'apple' :
    isSpotify ? 'spotify' :
    isVideo ? 'video' : 'audio';

  let albums = [];
  if (!g.isEmpty(v.albums)) albums = v.albums;
  else if (v.albums) albums = [v.albums];
  else if (!g.isEmpty(v.album)) albums = v.album;
  else if (v.album) albums = [v.album];

  let artists = [];
  if (!g.isEmpty(v.artists)) artists = v.artists;
  else if (v.artists) artists = [v.artists];
  else if (!g.isEmpty(v.artist)) artists = v.artist;
  else if (v.artist) artists = [v.artist];

  let images = [];
  if (!g.isEmpty(v.images)) {
    images = v.images.map(img => g.findMDFileUrl(img.files));
  } else if (albums.length && !g.isEmpty(albums[0].images)) {
    images = albums[0].images.map(img => g.findMDFileUrl(img));
  }
  images = images.filter(img => !!img);

  let artistNames = artists.map((artist) => {
    if (!g.isEmpty(artist.firstName) || !g.isEmpty(artist.lastName)) {
      return `${artist.firstName || ''} ${artist.lastName || ''}`.trim();
    } else if (!g.isEmpty(artist.stageName)) {
      return artist.stageName;
    }
    return '';
  });

  let title1 = v.songName || v.name || '';
  if (!isSpotify && !isApple) {
    const seps = title1.split('-');
    if (seps.length >= 2) {
      artistNames = seps[0].trim().split(/,|&/g);
      title1 = seps[1].trim();
    }
  }
  artistNames = artistNames.filter(el => !g.isEmpty(el));

  const channelName = v.playlistChannelTitle ? v.playlistChannelTitle : 'Unknown Artist';
  let artist = artistNames.length ? artistNames.join(', ') : channelName;
  let title = g.isEmpty(v.yearReleased) ? title1 : `${title1} (${v.yearReleased})`;
  const album = g.ifEmpty(albums.length && albums[0].name, 'Single');
  const social = g.deepValue(v, 'artist.social');

  //Do some fix on title and artist
  artist = g.escapeSpecialChars(artist);
  title = g.escapeSpecialChars(title);

  defineProperty(v, 'is_setup', () => true);
  defineProperty(v, 'songInfo', () => orgInfo);
  defineProperty(v, 'isYoutube', () => isYoutube);
  defineProperty(v, 'isVideo', () => isVideo);
  defineProperty(v, 'isAudio', () => !isVideo);
  defineProperty(v, 'isApple', () => isApple);
  defineProperty(v, 'isSpotify', () => isSpotify);
  defineProperty(v, 'images', () => images);
  defineProperty(v, 'thumbImage', () => images[0]);
  defineProperty(v, 'album', () => album);
  defineProperty(v, 'albums', () => albums);
  defineProperty(v, 'artist', () => artist);
  defineProperty(v, 'artists', () => artists);
  defineProperty(v, 'artistNames', () => artistNames);
  defineProperty(v, 'title', () => title);
  defineProperty(v, 'title1', () => title1);
  defineProperty(v, 'type', () => type);
  defineProperty(v, 'youtubeId', () => youtubeId);
  defineProperty(v, 'song_key', () => `song_${v._id}`);
  defineProperty(v, 'social', () => social);

  defineProperty(v, 'url', () => {
    if (isYoutube) return youtube.getMapped(v.song_key);
    if (isApple || isSpotify) return null;
    return file;
  });

  let playlist = null;
  v.checkPlaylist = function(name) {
    return (playlist || []).findIndex(p => p === name) >= 0;
  };
  defineProperty(v, 'playlist', () => playlist, (l) => { playlist = l; });
  defineProperty(v, 'isStreamPlaylist', () => v.checkPlaylist('#STREAM'));
  defineProperty(v, 'isDiscoPlaylist', () => v.checkPlaylist('#SHARED'));
  defineProperty(v, 'isFuegoPlaylist', () => v.checkPlaylist('#FIRE'));

  let authorized = false;
  defineProperty(v, 'authorized', () => authorized, (auth) => { authorized = auth; });

  let artistInfos = null;
  defineProperty(v, 'artistInfos', () => artistInfos, (infos) => {
    artistInfos = infos;

    (infos || []).forEach((info) => {
      let images = (info.images || []).map(img => g.findMDFileUrl(img.files));
      images = images.filter(img => !!img);
      if (!images.length) images = [images[0]];

      let artistName = 'Unknown Name';
      if (!g.isEmpty(info.firstName) || !g.isEmpty(info.lastName)) {
        artistName = `${info.firstName || ''} ${info.lastName || ''}`.trim();
      } else if (!g.isEmpty(info.stageName)) {
        artistName = info.stageName;
      }

      defineProperty(info, 'name', () => artistName);
      defineProperty(info, 'images', () => images);
    });
  });
}

export default function setupSongs(songs) {
  if (songs && songs.length) {
    songs.forEach(v => setupSong(v));
  } else if (songs) {
    setupSong(songs);
  }
  return songs;
}

export function appleSong(songs) {
  const apples = songs.map(song => ({
    _id: `ap${song.storeId}`,
    appleStoreId: song.storeId,
    type: 'apple',
    artists: song.artists,
    albums: song.albums,
    songName: song.title,
    duration: song.duration,
    images: g.isEmpty(song.thumb) ? undefined : [{
      files: [{
        url: song.thumb,
      }],
    }],
  }));
  return setupSongs(apples);
}

export function spotifySong(songs) {
  const spotifies = songs.map(song => ({
    _id: `sp${song.identifier}`,
    spotifyPlayableUri: song.playableUri,
    type: 'spotify',
    artists: song.artists,
    albums: song.albums,
    songName: song.title,
    duration: song.duration,
    images: g.isEmpty(song.thumb) ? undefined : [{
      files: [{
        url: song.thumb,
      }],
    }],
  }));
  return setupSongs(spotifies);
}

export function liveSong(url, duration) {
  const info = {
    _id: `live${Random.id()}`,
    type: 'video',
    songName: 'Live Stream',
    duration,
    files: [{
      url,
    }],
  };
  return setupSongs(info);
}