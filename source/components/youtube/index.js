import g from '@common/global';
import YoutubeParser from './YoutubeParser';

var common = require('./index-common');

function getYoutubeId(url) {
  if (!url) return null;

  const urlObj = common.URL.parseURL(url);
  if (urlObj) {
    return urlObj.hostname === 'youtu.be' ? urlObj.path.slice(1) : urlObj.query.v;
  }
  return url;
}

export function getYoutubeUrl(url) {
  const videoId = getYoutubeId(url);
  // console.log('getYoutubeUrl - ', videoId, ', url - ', url);
  return YoutubeParser.parseUrl(videoId);
}

export function isYoutubeUrl(url) {
  try {
    const isRelative = /^(ftp|file|gopher|https?|wss?)(:|$)/.test(url);
    if (isRelative) {
      const urlObj = common.URL.parseURL(url);
      if (urlObj && (urlObj.hostname === 'youtu.be' || urlObj.query.v)) {
        return true;
      }
      return false;
    }
    return true;
  } catch (ex) {
    console.log('isYoutubeUrl failed: ', ex);
    return false;
  }
}

class YoutubeUtil {
  mapping = {};

  getYoutubeId = (...args) => getYoutubeId(...args)
  isYoutubeUrl = (...args) => isYoutubeUrl(...args)

  isMapped = key => !g.isNull(this.mapping[key])
  getMapped = key => this.mapping[key]

  getYoutubeUrl = async (url, key) => {
    if (!isYoutubeUrl(url)) throw new Error('Invalid youtube url');

    if (g.isNull(key)) key = getYoutubeId(url);
    if (this.isMapped(key)) return this.getMapped(key);

    const youtubeUrl = await getYoutubeUrl(url);
    this.mapping[key] = youtubeUrl;

    return youtubeUrl;
  }
}

export default (new YoutubeUtil());
