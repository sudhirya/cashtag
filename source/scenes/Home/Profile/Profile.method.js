import { handler } from '@redux';
// import { routeNames } from '@routes';
import gs from '@common/states';
// import apis from '@lib/apis';
import { ViewType } from '@common/types';
import { Animated } from 'react-native';

// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      thumb: 'cover',
      thumbFadeAnim: new Animated.Value(1)
    }

    /**
     * action handlers
     */
    _onChangeProfileZoom = () => {
      // if (this.state.thumb === 'cover') {
      //   this.setState({ thumb: 'contain' });
      // } else {
      //   this.setState({ thumb: 'cover' });
      // }
      if (!gs.player.song) return;
      gs.handles.songCardPopup && gs.handles.songCardPopup.show(gs.player.song, gs.handles.mainView);
    }

    _onPressArtist = () => {
      if (!gs.player.song) return;
      gs.handles.artistCardPopup && gs.handles.artistCardPopup.show(gs.player.song, gs.handles.mainView);
    }

    _onPressPrev = () => {
      gs.prevSong();
    }

    _onPressNext = () => {
      gs.nextSong('Next');
    }

    _onPressPlay = () => {
      if (!gs.player.playing) {
        handler.main.view.change(ViewType.player);
      }
      gs.togglePlay();
    }

    _onSlidingStart = () => {
      gs.player.sliding = true;
    }

    _onSlidingChange = (value) => {
      const time = value * gs.player.duration;
      gs.seekPlayer(time);
    }

    _onSlidingComplete = () => {
      gs.player.sliding = false;
    }

    _onPressMenu = () => {
      if (this.props.viewType === ViewType.profile) {
        handler.main.view.change(ViewType.player);
      }
    }

    /**
     * api requests
     */
    _onSwipeUp = (state) => {
      const player = gs.player;
      const previousSongThumbnail = player.song && player.song.thumbImage ? { uri: player.song.thumbImage } : images.img_def_song_thumb;
      gs.nextSong('next');
      this._startSwipeAnimation(previousSongThumbnail)
    }

    _onSwipeDown = (state) => {

      const player = gs.player;
      const previousSongThumbnail = player.song && player.song.thumbImage ? { uri: player.song.thumbImage } : images.img_def_song_thumb;
      gs.prevSong();
      this._startSwipeAnimation(previousSongThumbnail)
    }

    _startSwipeAnimation = (previousSongThumbnail) => {
      this.setState({previousSongThumbnail, thumbFadeAnim:new Animated.Value(0)});
    }

    componentDidUpdate(prevProps, prevState): void {
      if (prevState.previousSongThumbnail !== this.state.previousSongThumbnail && this.state.previousSongThumbnail) {
        Animated.timing(
          this.state.thumbFadeAnim, {
            toValue: 1
          }
        ).start(({finished}) => {
          this.setState({previousSongThumbnail: undefined});
        });
      }
    }
  };
}

export default methodMixin;
