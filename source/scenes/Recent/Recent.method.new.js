import { handler } from '@redux';
import { routes } from '@routes';
import { ViewType } from '@common/types';
import gs from '@common/states';
import apis from '@lib/apis';
import _ from 'lodash';
import setupSong from '@model/song';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      songs: [],
    };

    onPressClose = () => {
      navigation.navback();
    };

    onPressSong = (song) => {
      if (this.props.viewType === ViewType.profile) {
        handler.main.view.change(ViewType.player);
      }

      gs.loadSong(song, null, true);
      gs.playSong();
      navigation.navigate({ type: 'popTo', key: routes.keys.app.home });
    };

    onPressLive = () => {
      this.setState({ isRecent: !this.state.isRecent, isAlbum: false });
      navigation.navigate({ name: routes.names.app.livelist });
    };

    onLongPressSong = (song) => {
      gs.showSongPopup(song);
    };

    onPressAlbum = () => {
      this.setState({ isAlbum: true });
    };

    _onPressWallet = () => {
      gs.context.song = null;
      gs.context.playlistCb = () => {
        gs.requestPlaylists();
      };
      navigation.navigate({ name: routes.names.app.wallet });
    };
  };
}

export default methodMixin;