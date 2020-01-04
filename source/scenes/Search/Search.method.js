import { handler } from '@redux';
import { routes } from '@routes';
import { MDLiveSong } from '@model';
import setupSong from '@model/song';
import gs from '@common/states';
import c from '@common/consts';
import apis from '@lib/apis';
import {Animated} from "react-native";
import { sizes} from '@theme';

const { navigation } = handler;
const { hud, drop } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    songs = [];

    state = {
      searchText: '',
      userTags: [],

      tab: '#STREAM',
      holding: false,
      holdingtab: '',

      animScroll: new Animated.Value(0),
      contentSize: 0,
      listHeight: 0,
      listWidth: 0,
    }

    animScrollCB = Animated.event([{
      contentOffset: { y: this.state.animScroll },
    }]);


    /**
     * action handlers
     */
    _onPressClose = () => {
      navigation.navigate({ type: 'back', animation: 'horzinv' });
    }

    _onSearchKeyChanged = (text) => {
      this.setState({
        searchText: text,
        tab: '#SEARCH',
      }, () => {
        this._requestSearchMedia();
      });
    }

    _onPressChat = () => {
      gs.context.song = null;
      navigation.navigate({ name: routes.names.app.chatUsers, animation: 'horzinv' });
    }

    _onPressWallet = () => {
      gs.context.song = null;
      gs.context.playlistCb = () => {
        gs.requestPlaylists();
      };
      navigation.navigate({ name: routes.names.app.wallet });
    }

    _onPressTab = (tab) => {
      if (tab === '#DMS') {
        this._onPressChat();
        return;
      }
      if (this.state.holding) {
        const tick = new Date().getTime();
        if (tick - this.holdingTick > 1000) return;
      }

      this.setState({ tab }, () => {
        if (tab !== '#STREAM' && tab !== '#PLAYLIST') {
          this._requestSongsByPlaylist(tab);
        }
      });
    }

    _onLongPressSong = (info) => {
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

    _onPressSong = (info) => {
      hud.show('Requesting...');
      gs.saveSearchSong(info, (err) => {
        hud.hide();
        if (err) {
          drop.showError(c.appName, 'Failed to save song');
          return;
        }

        gs.loadSong(info);
        gs.addSongToSearch(info);
        navigation.navback();
      });
    }

    _onPressHolding = (tab) => {
      this._timerHold = setTimeout(() => {
        this.holdingTick = new Date().getTime();
        this._timerHold = null;
        this.setState({ holding: true, holdingtab: tab });
      }, 500);
    }
    _onPressHoldingOff = () => {
      if (this._timerHold) {
        clearTimeout(this._timerHold);
        this._timerHold = null;
      }

      this.setState({ holding: false });
    }

    /**
     * helper functions
     */
    roundNumber = (n, d) => {
      var x = 0;
      x = (`${n}`).length;
      d = 10 ** d;
      x -= x % 3;
      return Math.round(n * d / (10 ** x)) / d + (' kMGTPE'[x / 3]);
    }

    /**
     * api requests
     */
    _requestSongsByPlaylist = (playlist) => {
      this.songs = [];
      this.forceUpdate();

      apis.getPlaylistByName(playlist).then((res) => {
        this.songs = setupSong(res.results);
        this.forceUpdate();
      }).catch(() => { });
    }

    _requestLiveStreams = () => {
      this.songs = [];
      this.forceUpdate();

      apis.getAllStreams().then((res) => {
        this.songs = MDLiveSong.parseList(res);
        this.forceUpdate();
      }).catch(() => { });
    }

    _requestingMedia = false;
    _requestingMediaText = '';
    _requestSearchMedia() {
      var searchText = this.state.searchText.trim();
      if (this._requestingMedia || searchText === this._requestingMediaText) {
        return;
      }

      this._requestingMedia = true;
      apis.searchMedia(searchText).then((result) => {
        this._requestingMedia = false;
        this._requestingMediaText = searchText;

        if (result) {
          const userTags = result.userTags && result.userTags.length ? result.userTags : [];
          // const suggTags = result.suggestedTags && result.suggestedTags.length ? result.suggestedTags : [];
          const songList = result.searchResults && result.searchResults.length ? result.searchResults : [];

          this.state.userTags = userTags;
          this.songs = setupSong(songList);
          // this.updateSuggestedTags(suggTags);
          this.forceUpdate();
        }

        setTimeout(() => {
          this._requestSearchMedia();
        }, 10);
      }).catch(() => {
        this._requestingMedia = false;
      });
    }


    // From Flat List
    onPressItem = (item, row, index) => {
      const songIndex = row * sizes.song_in_row + index;
      this.props.onPressItem && this.props.onPressItem(item, songIndex);
    }

    onLongPressItem = (item, row, index) => {
      const songIndex = row * sizes.song_in_row + index;
      this.props.onLongPressItem && this.props.onLongPressItem(item, songIndex);
    }

    onEndReached = () => {
      this.props.onLoadMore && this.props.onLoadMore();
    }

    onScroll = ({ nativeEvent: ev }) => {
      this.animScrollCB(ev);
      this.props.onListPos && this.props.onListPos(ev.contentOffset.y);
    }
    onContentSizeChange = (w, h) => {
      if (this.state.contentSize !== h) {
        this.setState({ contentSize: h });
      }
    }
    onLayout = ({ nativeEvent: ev }) => {
      if (this.state.listWidth !== ev.layout.width || this.state.listHeight !== ev.layout.height) {
        this.setState({ listWidth: ev.layout.width, listHeight: ev.layout.height });
      }
    }

    _buildSongs = (songs) => {
      const itemInRow = sizes.flat_song_in_row;

      const chunk = (arr, n) =>
        Array.from(Array(Math.ceil(arr.length / n)), (temp, i) => arr.slice(i * n, (i * n) + n));
      const rows = chunk(songs, itemInRow);

      if (rows.length) {
        const lastRow = rows[rows.length - 1];
        for (let i = 0; lastRow.length < itemInRow; i += 1) {
          lastRow.push(null);
        }
      }
      return rows;
    }
  };
}

export default methodMixin;
