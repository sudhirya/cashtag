import { handler } from '@redux';
// import { routeNames } from '@routes';
import gs from '@common/states';
import c from '@common/consts';
import apis from '@lib/apis';
import setupSong from '@model/song';
import { SearchType } from '@common/types';

// const { navigation } = handler;
const { hud, drop } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      songs: [],
    };

    componentWillReceiveProps(nextProps) {
      this._requestSearch(nextProps.search.keyword);
    }

    onLongPressSong = (info) => {
      hud.show('Requesting...');
      gs.saveSearchSong(info, (err) => {
        hud.hide();
        if (err) {
          drop.showError(c.appName, 'Failed to save song');
          return;
        }

        gs.showSongPopup(info);
      });
    }

    onPressSong = (info) => {
      hud.show('Requesting...');
      gs.saveSearchSong(info, (err) => {
        hud.hide();
        if (err) {
          drop.showError(c.appName, 'Failed to save song');
          return;
        }

        gs.loadSong(info);
        gs.addSongToSearch(info);
        handler.main.search.change(SearchType.none);
      });
    }

    _loading = false;
    _keyword = '';
    _requestSearch = (keyword) => {
      if (this._loading || this._keyword === keyword) return;

      this._loading = true;
      apis.searchMedia(keyword, gs.user.userId).then((res) => {
        this._loading = false;
        this._keyword = keyword;

        if (this.props.search.type === SearchType.none) return;

        const songs = setupSong(res.searchResults);
        if (this.props.search.type === SearchType.focus && songs.length) {
          handler.main.search.change(SearchType.search);
        }
        this.setState({ songs });

        if (this.props.search.keyword !== keyword) {
          this._requestSearch();
        }
      }).catch(() => {
        this._loading = false;
      });
    }
  };
}

export default methodMixin;
