import { handler } from '@redux';
import { routes } from '@routes';
import setupSong from '@model/song';
import meteor from '@lib/meteor';
import apis from '@lib/apis';
import g from '@common/global';
import gs from '@common/states';
import _ from 'lodash';
import Meteor from 'react-native-meteor';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    /*
     *
     */
    state = {
      lists: [],
      allLists: [],
      selectedPlayLists: [],
    };

    /*
     *
     */
    componentDidMount(): void {
      this._requestTags();
    }

    /*
     *
     */
    _requestTags = async () => {
      // Retrieve lists
      let lists = [];
      let allLists = [];

      try {
        // await gs.requestPlaylists();
        lists = await apis.getChannels();
        allLists = lists
      } catch (ex) {

      }

      lists = _.filter(lists, u => (u.channels) ? u.channels.length > 0 : false)

      // SUB CATEGORIES (featured)
      let featured = [];
      _.each(lists, function(arr) {
        _.each(arr.channels, function(obj) {
          featured.push(_.find(allLists, { name: obj.name }))
        })
      })

      handler.main.view.fsources(featured);

      // SOURCES
      let sources = []
      _.each(allLists, function(val) {
        _.each(val.populationSource, function(obj) {
          sources.push(obj)
        })
      })

      handler.main.view.sources(sources);
      this.forceUpdate();

      this.setState({ lists })
      this.setState({ allLists })
    };

    /*
     *
     */
    _filterByPlaylist = async (playlist, index) => {
      const current = (this.state.selectedPlayLists) ? this.state.selectedPlayLists.slice(0) : []; //copy
      const _i = current.indexOf(index);
      if (_i >= 0) {
        current.splice(_i, 1);
      } else {
        current.push(index);
      }
      this.setState({ selectedPlayLists: current });

      ///////////////////////////////////////
      // SUB CATEGORIES (featured)
      let featured = [];
      var self = this;
      var selectedChannels = []
      var selectedSources = []

      let runThisList = (_.isEmpty(current)) ? _.filter(self.state.allLists, u => (u.channels) ? u.channels.length > 0 : false) : this.state.lists;
      let currents = (_.isEmpty(current)) ? _.map(_.keys(_.filter(self.state.allLists, u => (u.channels) ? u.channels.length > 0 : false)), Number) : current;

      _.each(runThisList, function(arry, key) {
        if (_.indexOf(currents, key) > -1) {
          _.each(arry.channels, function(obj) {
            featured.push(_.find(self.state.allLists, { name: obj.name }))
          })

          _.each(arry.populationSource, function(ps) {
            selectedSources.push(ps)
          })
        }
      })

      handler.main.view.fsources(featured);

      ///////////////////////////////////////
      // SOURCES
      _.each(featured, function(val) {
        _.each(val.populationSource, function(obj) {
          selectedSources.push(obj)
        })
      })

      handler.main.view.sources(selectedSources);

      this.forceUpdate();
    };
  };
}

export default methodMixin;