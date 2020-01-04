import { StyleSheet } from 'react-native';
import _ from 'lodash';
import { bs, sizes } from '@theme';

const szborder = StyleSheet.hairlineWidth;

function extendStyle(styles, styleex) {
  if (!Array.isArray(styles)) return;

  if (styleex) {
    if (Array.isArray(styleex)) {
      _.each(styleex, st => styles.push(st));
    } else {
      styles.push(styleex);
    }
  }
}

function getTextProps(props) {
  const {
    embeded, bold, medium, heavy, semibold, light, italic, underline, midline, doubleline, size, sizeem, color,
    center, left, right, justify, transparent, line, fontos, fontav,
    ...textOtherProps
  } = props;
  return {
    textProps: {
      embeded, bold, medium, heavy, semibold, light, italic, underline, midline, doubleline, size, sizeem, color, // eslint-disable-line
      center, left, right, justify, transparent, line, fontos, fontav, // eslint-disable-line
    },
    textOtherProps,
  };
}

function buildTextStyle(props, basestyle) {
  const {
    embeded, bold, medium, heavy, semibold, light, italic, underline, midline, doubleline, size, sizeem, color,
    center, left, right, justify, transparent, line, fontos,
  } = props;

  const newStyle = [];
  if (!embeded) newStyle.push(basestyle);
  if (bold) newStyle.push(bs.text_bold);
  if (heavy) newStyle.push(bs.text_heavy);
  if (medium) newStyle.push(bs.text_medium);
  if (semibold) newStyle.push(bs.text_semibold);
  if (light) newStyle.push(bs.text_light);
  if (italic) newStyle.push(bs.text_italic);
  if (underline) newStyle.push(bs.text_underline);
  if (midline) newStyle.push(bs.text_midline);
  if (doubleline) newStyle.push(bs.text_doubleline);
  if (center) newStyle.push(bs.text_center);
  if (left) newStyle.push(bs.text_left);
  if (right) newStyle.push(bs.text_right);
  if (justify) newStyle.push(bs.text_justify);
  if (size) newStyle.push({ fontSize: sizes.em(size, null, false) });
  if (sizeem) newStyle.push({ fontSize: sizeem });
  if (color) newStyle.push({ color });
  if (line) newStyle.push({ lineHeight: sizes.em(line, null, false) });
  if (transparent) newStyle.push(bs.bg_transparent);
  if (fontos) newStyle.push(bs.font_os);
  return newStyle;
}

function getBorderProps(props) {
  const {
    bstyle, btransparent, bwidth, bheight, bpadding, bradius, brow, bnowide, binrow, bcircle,
    bunderline, btopline, bleftline, brightline, bhorzline, bvertline, bborder, bborderWidth, bbackground,
    ...borderOtherProps
  } = props;
  return {
    borderProps: {
      bstyle, btransparent, bwidth, bheight, bpadding, bradius, brow, bnowide, binrow, bcircle, // eslint-disable-line
      bunderline, btopline, bleftline, brightline, bhorzline, bvertline, bborder, bborderWidth, bbackground, // eslint-disable-line
    },
    borderOtherProps,
  };
}

function buildBorderStyle(props, basestyle) {
  const {
    bstyle, btransparent, bwidth, bheight, bpadding, bradius, brow, bnowide, binrow, bcircle,
    bunderline, btopline, bleftline, brightline, bhorzline, bvertline, bborder, bborderWidth, bbackground,
  } = props;
  const newstyle = [basestyle];
  const borderWidth = bborderWidth || szborder;

  if (bunderline) newstyle.push({ borderBottomWidth: borderWidth, borderBottomColor: bunderline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (btopline) newstyle.push({ borderTopWidth: borderWidth, borderTopColor: btopline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (bhorzline) newstyle.push({ borderBottomWidth: borderWidth, borderTopWidth: borderWidth, borderTopColor: bhorzline, borderBottomColor: bhorzline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (bvertline) newstyle.push({ borderLeftWidth: borderWidth, borderRightWidth: borderWidth, borderLeftColor: bvertline, borderRightColor: bvertline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (bleftline) newstyle.push({ borderLeftWidth: borderWidth, borderLeftColor: bleftline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (brightline) newstyle.push({ borderRightWidth: borderWidth, borderRightColor: brightline, borderColor: null, borderWidth: null }); // eslint-disable-line
  if (bborder) newstyle.push({ borderWidth: borderWidth, borderColor: bborder, borderTopWidth: null, borderTopColor: null, borderBottomWidth: null, borderBottomColor: null }); // eslint-disable-line
  if (bbackground) newstyle.push({ backgroundColor: bbackground });

  if (bradius) newstyle.push({ borderRadius: bradius });
  if (bcircle && bheight) newstyle.push({ borderRadius: bheight / 2 });
  if (btransparent) newstyle.push({ backgroundColor: 'transparent' });
  if (bpadding) newstyle.push({ paddingHorizontal: bpadding });
  if (brow) newstyle.push({ flexDirection: 'row' });
  if (bheight) newstyle.push({ height: bheight });
  if (bwidth) newstyle.push({ width: bwidth });
  else if (!bnowide && !binrow) newstyle.push(bs.self_stretch);
  else if (!bnowide) newstyle.push(bs.flex);

  extendStyle(newstyle, bstyle);

  return newstyle;
}

export {
  extendStyle,
  getBorderProps,
  getTextProps,
  buildTextStyle,
  buildBorderStyle,
};
