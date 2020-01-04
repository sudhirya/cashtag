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
      console.log(this.props.fsources, 'fsources')
      const current = (this.props.channellist) ? this.props.channellist.slice(0) : []; //copy
      const _i = current.indexOf(playlist._id);
      if (_i >= 0) {
        current.splice(_i, 1);
      } else {
        current.push(playlist._id);
      }
      handler.main.view.channellist(current);

      console.log(current, 'current')
      ///////////////////////////////////////
      // SOURCES
      let selectedSources = [];

      _.each(this.props.fsources, function(val) {
        if (_.isEmpty(current)) {
          _.each(val.populationSource, function(obj) {
            selectedSources.push(obj)
          })
        } else {
          if (_.indexOf(current, val._id) > -1) {
            _.each(val.populationSource, function(obj) {
              selectedSources.push(obj)
            })
          }
        }
      })
      handler.main.view.sources(selectedSources);

      this.forceUpdate();
    };
  }
}

export default methodMixin;