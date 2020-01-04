import AppleMusic from '@components/applemusic';
import Spotify from '@components/spotify';
import { handler } from '@redux';
import { appleSong, spotifySong } from '@model/song';
import { Braintree } from '@components/braintree';
import { routes } from '@routes';
import apis from '@lib/apis';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import AppConfig from '@app/config';
import _ from 'lodash';

const { navigation } = handler;
const { drop, hud } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      card: gs.user.cards[0]._id,
      tab: '#APPS',
    };
    mounted = false;
    wallets = [];

    /**
     * components life cycle
     */
    componentDidMount() {
      this.mounted = true;
      this._requestWallets();
    }
    componentWillUnmount() {
      this.mounted = false;
    }

    /**
     * action handlers
     */
    _onPressClose = () => {
      navigation.navback();
    }

    _onPressCloseCard = (item) => {
      this.setState({ card: item._id });

      if (item._id === 'spotify') {
        this._checkSpotifyAuth(item);
      } else if (item._id === 'apple') {
        this._checkAppleMusicAuth(item);
      } else if (item._id === 'chilll') {
        this._checkChilllAuth(item);
      } else if (item._id === 'audiomack') {
        this._checkSoundCloudAuth(item);
      }
    }
    _onPressOpenCard = (item) => {
      console.log(item);
    }

    _onPressTab = (tab) => {
      this.setState({ tab }, () => {
        // do something
      });
    }

    /**
     * authorization
     */
    getWallet = item => this.wallets.find(el => el.card === item._id)
    getWalletPoints = (item) => {
      const wallet = this.getWallet(item);
      if (!wallet) return '#';
      return `#${wallet._id.substring(0, 5).toUpperCase()}`;
    }

    _checkSpotifyAuth = async (card) => {
      hud.show();
      try {
        await Spotify.authorize(AppConfig.spotify);
        await this._requestAddCard(card);

        let playlists = await Spotify.requestPlaylists(true);
        playlists = _.filter(playlists || [], p => p.songs && p.songs.length);

        const mylists = await gs.requestPlaylists();
        const mynames = gs.playlists || [];

        for (let i = 0; i < playlists.length; i += 1) {
          const playlist = playlists[i];
          const myname = _.find(mynames, name => name.name === playlist.name); // eslint-disable-line
          const mylist = g.isEmpty(myname) ? [] : mylists[myname];
          let songs = spotifySong(playlist.songs);
          songs = _.filter(songs, song => _.findIndex(mylist, ls => ls._id === song._id) < 0);
          // songs = songs.splice(0, 50);

          if (songs.length) {
            songs = _.map(songs, song => song.songInfo);
            await apis.addBatchSongsToPlaylist(songs, playlist.name, 'spotify'); // eslint-disable-line
          }
        }

        gs.context.playlistCb && gs.context.playlistCb();
        drop.showSuccess(c.appName, 'Sync Completed');
      } catch (err) {
        console.log('Spotify authentication failed: ', err);
        drop.showError(c.appName, 'Failed to authorize spotify app');
      }
      hud.hide();
    }

    _checkAppleMusicAuth = async (card) => {
      console.log('Authorizing Apple Music...')
      hud.show();
      try {
        const authAppleMusic = await AppleMusic.authorize();
        console.log(authAppleMusic, 'Apple Music authorized...')
        await AppleMusic.userToken();
        console.log('Apple Music user token...')
        await this._requestAddCard(card);

        let playlists = await AppleMusic.requestPlaylists(true);
        playlists = _.filter(playlists || [], p => p.songs && p.songs.length);

        const mylists = await gs.requestPlaylists();
        const mynames = gs.playlists || [];

        for (let i = 0; i < playlists.length; i += 1) {
          const playlist = playlists[i];
          const myname = _.find(mynames, name => name.name === playlist.name); // eslint-disable-line
          const mylist = g.isEmpty(myname) ? [] : mylists[myname.name];
          let songs = appleSong(playlist.songs);
          songs = _.filter(songs, song => _.findIndex(mylist, ls => ls._id === song._id) < 0);
          // songs = songs.splice(0, 50);

          if (songs.length) {
            songs = _.map(songs, song => song.songInfo);
            for (let k = 0; k < songs.length; k += 1) {
              const song = songs[k];
              const thumb = g.deepValue(song, 'images.0.files.0.url');
              if (!g.isEmpty(thumb)) {
                try {
                  // const s3url = await apis.updateSongThumb(song._id, thumb); //eslint-disable-line
                  // song.images[0].files[0].url = s3url;
                  song.images = undefined;
                } catch (ex) {
                  ex;
                  song.images = undefined;
                }
              }
            }
            await apis.addBatchSongsToPlaylist(songs, playlist.name, 'apple'); // eslint-disable-line
          }
        }

        gs.context.playlistCb && gs.context.playlistCb();
        drop.showSuccess(c.appName, 'Sync Completed');
      } catch (err) {
        console.log('Apple Music authentication failed: ', err);
        drop.showError(c.appName, 'Failed to authorize apple music app');
      }
      hud.hide();
    }

    _checkChilllAuth = async (card) => {
      await this._requestAddCard(card, true);
    }
    _checkSoundCloudAuth = async (card) => {
      card;
      // await this._requestAddCard(card, true);
    }

    /**
     * api requests
     */
    _requestWallets = async () => {
      try {
        this.wallets = await apis.getWallets();
        if (this.mounted) this.forceUpdate();
      } catch (ex) {
        console.log('Wallet::_requestWallets failed: ', ex);
      }
    }

    _requestAddCard = async (card, showhud) => {
      const index = this.wallets.findIndex(el => el.card === card._id);
      if (index >= 0) return;

      if (showhud) hud.show();
      try {
        const res = await apis.addCardToWallet(card._id);
        this.wallets.push(res);
      } catch (ex) {
        console.log('Wallet::_requestAddCard failed: ', ex);
      }
      if (showhud) hud.hide();
    }

    _onPressLogout = async () => {
      await apis.logout();
      navigation.navigate({ name: routes.names.app.sign, key: routes.keys.app.sign, animation: 'fade' });

      handler.main.view.swiperslidenumber(1);
      this.forceUpdate();
    }

    _onPressCash = async () => {
      try {
        console.log(gs.user.info.userId, 'gs.user.customerId')
        let token = await apis.generateBraintreeToken(gs.user.info.userId)
        await Braintree.showDropIn(token);
      } catch (exception) {
        console.log(exception);
      }
    }
  };
}

export default methodMixin;
