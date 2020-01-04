import { Dimensions } from 'react-native';
import { handler } from '@redux';
import dim from './dimension';

const pdph = 1.5;

function em(ph, pd = null, floor = true) {
  var res = (dim.is_phone ? ph : (((pd === 0 || pd) ? pd : null) || ph * pdph)) * dim.rate;
  if (floor) res = Math.floor(res);
  return res;
}
function em1(ph, pd = null, floor = true) {
  var res = (dim.is_phone ? ph : (((pd === 0 || pd) ? pd : null) || ph * pdph)) * dim.rate1;
  if (floor) res = Math.floor(res);
  return res;
}

const sizes = {
  ...dim,
  is_portrait: true,
  is_landscape: false,
  em,
  em1,

  screen: {
    width: dim.screenWidth,
    height: dim.screenHeight,
  },

  pad: em(8),
  pad1: em(5),
  statusbar: dim.is_ios ? (dim.is_iphonexx ? 44 : 20) : 0, // eslint-disable-line
  safeb: dim.is_ios && dim.is_iphonexx ? 34 : 0,
  safeb1: dim.is_ios && dim.is_iphonexx ? 24 : 0,
};

sizes.song_in_row = dim.is_phone ? 3 : 5;
sizes.song_size = Math.floor(dim.screenWidth / sizes.song_in_row);

sizes.flat_song_in_row = 1;
sizes.flat_song_size = em(270);

sizes.header = {
  height1: sizes.statusbar + em(80),
  height2: sizes.statusbar + em(50),
};

sizes.profile = {
  titleHeight: em(60),
  sliderHeight: em(40) + sizes.safeb,
  height: () => sizes.window.height - sizes.header.height1,
  thumbHeight: () => sizes.profile.height() - sizes.profile.titleHeight - sizes.profile.sliderHeight,
};

sizes.player = {
  titleHeight: em(70),
  controlHeight: em(90),
  sliderHeight: em(20),
  thumbHeight: () => {
    const temp = sizes.header.height2 + sizes.player.titleHeight + sizes.player.controlHeight;
    if (temp + sizes.window.width > sizes.window.height - em(100)) {
      return sizes.window.height - em(100) - temp;
    }
    if (sizes.window.width < sizes.window.height / 3) {
      return Math.floor(sizes.window.height / 3);
    }
    return sizes.window.width;
  },
  height: () => sizes.player.titleHeight + sizes.player.controlHeight + sizes.player.thumbHeight(),
};

sizes.songlist = {
  thumbSize: sizes.em(74),
  height: () => sizes.window.height - sizes.header.height2 - sizes.songlist.thumbSize,
};

function updateWindow(size) {
  sizes.window = size;
  sizes.is_portrait = size.width < size.height;
  sizes.is_landscape = size.width > size.height;
}
updateWindow(Dimensions.get('window'));

Dimensions.addEventListener('change', (size) => {
  if (size.window) updateWindow(size.window);
  else updateWindow(size);
  handler.main.update.size();
});

export default sizes;
