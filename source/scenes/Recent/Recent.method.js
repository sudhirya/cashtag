import { handler } from '@redux';
import { routes } from '@routes';
import { ViewType } from '@common/types';
import gs from '@common/states';
// import apis from '@lib/apis';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      isRecent: true,
      isAlbum: false,
    }

    onPressClose = () => {
      if (this.state.isAlbum) {
        this.setState({ isAlbum: false });
      } else {
        navigation.navback();
      }
    }
    onPressLive = () => {
      this.setState({ isRecent: !this.state.isRecent, isAlbum: false });
      // navigation.navigate({ name: routes.names.app.livelist });
    }

    onPressSong = (song) => {
      if (this.props.viewType === ViewType.profile) {
        handler.main.view.change(ViewType.player);
      }

      gs.loadSong(song, null, true);
      gs.playSong();
      navigation.navigate({ type: 'popTo', key: routes.keys.app.home });
    }

    onLongPressSong = (song) => {
      gs.showSongPopup(song);
    }

    onPressAlbum = () => {
      this.setState({ isAlbum: true });
    }
  };
}

export default methodMixin;
