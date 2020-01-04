import { handler } from '@redux';
import { routes } from '@routes';
import gs from '@common/states';
// import apis from '@lib/apis';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    _onPressClose = () => {
      navigation.navback();
    }

    _onPressSong = (song) => {
      console.log(song);
      gs.loadPlaylistSongs(gs.context.songs, song);
      gs.playSong();
      navigation.popTo(routes.keys.app.home);
    }
  };
}

export default methodMixin;
