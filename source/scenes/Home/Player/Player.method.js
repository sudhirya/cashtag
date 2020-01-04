import { Animated } from 'react-native';
import { handler } from '@redux';
import Orientation from 'react-native-orientation';
import g from '@common/global';
// import { routes } from '@routes';
import gs from '@common/states';
import apis from '@lib/apis';
import { ViewType } from '@common/types';

// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      showControl: false,
      animCtrlFullOpacity: new Animated.Value(0),
    }

    onPressPrev = () => {
      gs.prevSong();
    }
    onPressNext = () => {
      gs.nextSong('Next');
    }
    onPressPlay = () => {
      gs.togglePlay();
      if (!gs.player.loading && gs.player.playing) {
        gs.saveListen(gs.player.song);
      }
    }

    onPressLiveAudio = () => {
      gs.toggleLiveAudio();
    }
    onPressDisco = () => {
      gs.addRemoveSongOnDisco(gs.player.song);
    }
    onPressFuego = () => {
      gs.addRemoveSongOnFuego(gs.player.song);
    }
    onPressAdd = () => {
      gs.context.addPopup.show(gs.player.song);
    }

    onSlidingStart = () => {
      gs.player.sliding = true;
    }
    onSlidingChange = (value) => {
      const time = value * gs.player.duration;
      gs.seekPlayer(time);
    }
    onSlidingComplete = () => {
      gs.player.sliding = false;
    }

    _onStreamPlay = () => {
      gs.playSong();
    }
    _onStreamPause = () => {
      gs.pauseSong();
    }
    _onStreamEvent = (evt) => {
      if (evt.status === 'STOPPED' && gs.player.loading) {
        if (gs.context.streamPlayer) {
          gs.context.streamPlayer.play();
        }
      } else if (evt.status === 'STREAMING') {
        const progress = parseInt(evt.progress || 0, 10);

        if (gs.player.loading) {
          gs.player.loading = false;
          gs.player.duration = 0;
          handler.main.update.player();
        }
        if (progress !== gs.player.currentTime) {
          gs.updatePlayTime(progress);
        }
      }
    }

    _onMediaLoad = (params) => {
      console.log('onMediaLoad', params);
      gs.player.duration = params.duration;
      gs.player.loading = false;
      gs.updatePlayTime(0);
      handler.main.update.player();

      if (gs.player.playing) {
        gs.saveListen(gs.player.song);
      }
    }
    _onMediaProgress = (params) => {
      if (!gs.player.sliding && gs.player.currentTime !== params.currentTime) {
        gs.updatePlayTime(params.currentTime);
      }
    }
    _onMediaEnd = () => {
      gs.nextSong('SongEnd');
    }

    _onPressFullscreen = () => {
      if (gs.player.fullani) return;

      console.log('onPressFullscreen');
      if (gs.player.fullscreen) {
        Orientation.lockToPortrait();
        gs.player.fullscreen = false;
        gs.player.fullani = true;
        Animated.timing(this.props.animFull, {
          delay: 100,
          toValue: 0,
          duration: 300,
        }).start(() => {
          gs.player.fullani = false;
          handler.main.update.player();
        });
      } else {
        gs.player.fullscreen = true;
        gs.player.fullani = true;
        Animated.timing(this.props.animFull, {
          toValue: 1,
          duration: 300,
        }).start(() => {
          gs.player.fullani = false;
          handler.main.update.player();
          Orientation.lockToLandscape();
          setTimeout(() => {
            Orientation.unlockAllOrientations();
          }, 300);
        });
      }
      handler.main.update.player();
    }

    _controlTimer = null;
    _onMediaShowControl = () => {
      if (this._controlTimer) {
        clearTimeout(this._controlTimer);
        this._controlTimer = null;
      }
      if (!gs.player.fullscreen) {
        if (this.state.showControl) {
          this.state.animCtrlFullOpacity.setValue(0);
          this.setState({ showControl: false });
        }
        return;
      }

      if (!this.state.showControl) {
        this._controlTimer = setTimeout(() => {
          if (this.state.showControl) {
            this._onMediaShowControl();
          }
        }, 5000);
      }

      this.setState({ showControl: !this.state.showControl }, () => {
        Animated.timing(this.state.animCtrlFullOpacity, {
          duration: 300,
          toValue: this.state.showControl ? 1 : 0,
        }).start();
      });
    }

    _onPressMenu = () => {
      if (this.props.viewType === ViewType.player) {
        handler.main.view.change(ViewType.profile);
      }
    }
  };
}

export default methodMixin;
