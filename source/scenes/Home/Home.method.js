import { Animated } from 'react-native';
import { images} from '@theme';
// import { handler } from '@redux';
// import { routeNames } from '@routes';
import { ViewType } from '@common/types';
import gs from '@common/states';
// import g from '@common/global';
// import c from '@common/consts';
import apis from '@lib/apis';
import HomePanHandler from './Home.pan';
// const { navigation } = handler;

// const { hud } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      animView: new Animated.Value(1),
      animFull: new Animated.Value(0),
    }
    pan = new HomePanHandler(this);

    componentDidMount() {
      this._checkLoad();

      // gs.handles.songCardPopup.show(c.dummy.song);
      // gs.handles.artistCardPopup.show(c.dummy.song);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.view.type !== this.props.view.type) {
        this.pan.changeView(nextProps.view.type);
      }
    }

    /**
     * action handlers
     */
    onPressSong = (song) => {
      gs.loadSong(song);
    }

    onLongPressSong = (song) => {
      gs.showSongPopup(song);
    }

    onLoadMore = () => {
      if (this.props.view.type === ViewType.songlist) {
        gs.loadMoreSongs();
      }
    }

    /**
     * helper functions
     */
    _checkLoad = () => {
      setTimeout(() => {
        gs.loadSongs();
      }, 500);
    }
  };
}

export default methodMixin;
