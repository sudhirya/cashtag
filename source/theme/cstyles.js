import colors from './colors';
import sizes from './sizes';
import bs from './styles';

const styles = {
  text: {
    bold23: {
      ...bs.font_avenir,
      ...bs.text_bold,
      fontSize: sizes.em(23, 41.4, false),
    },
    normal10: {
      ...bs.font_avenir,
      ...bs.text_normal,
      fontSize: sizes.em(10, 18, false),
    },
  },
};

export default styles;
