import { handler } from '@redux';
import { routes } from '@routes';
import setupSong from '@model/song';
import apis from '@lib/apis';
import gs from '@common/states';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      isChannel: false,
    };
    songs = null;
    streams = null;
    handleSongs = null;

    onPressItem = (item) => {
      gs.loadSong(item);
      navigation.popTo(routes.keys.app.home);
    };

    onLongPressSong = () => {};

    onPressClose = () => {
      navigation.navback();
    };

    onPressLive = () => {
      this.setState({ isChannel: !this.state.isChannel });

      if (!this.songs) {
        apis.getPlaylistByName('#FIRE').then((res) => {
          this.songs = setupSong(res.results);
          this.forceUpdate();
        }).catch(() => {});
      }

      if (!this.streams) {
        apis.getPlaylistByName('#FIRE').then((res) => {
          this.streams = setupSong(res.results);
          this.forceUpdate();
        }).catch(() => {});
      }

      if (!this.handleSongs) {
        apis.getPlaylistByName('#FIRE').then((res) => {
          this.handleSongs = setupSong(res.results);
          this.forceUpdate();
        }).catch(() => {});
      }
    }
  };
}

export default methodMixin;
