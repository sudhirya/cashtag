import { handler } from '@redux';
import { routes } from '@routes';
import setupSong from '@model/song';
import meteor from '@lib/meteor';
import apis from '@lib/apis';
import gs from '@common/states';
import _ from 'lodash';
import Meteor from 'react-native-meteor';
import { shallowEqual } from '@redux';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {

    /*
     *
     */
    _filterByPlaylist = async (playlist, index) => {
      const current = (this.props.channellist) ? this.props.channellist.slice(0) : []; //copy
      // const tags = []
      const _i = current.indexOf(playlist.id);
      if (_i >= 0) {
        current.splice(_i, 1);
      } else {
        current.push(playlist.id);
      }

      gs.loadSongs(current);

      handler.main.view.channellist(current);
      this.forceUpdate();
    };
  }
}

export default methodMixin;