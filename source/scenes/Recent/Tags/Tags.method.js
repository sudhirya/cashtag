import { handler } from '@redux';
import { routes } from '@routes';
import setupSong from '@model/song';
import meteor from '@lib/meteor';
import apis from '@lib/apis';
import gs from '@common/states';
import _ from 'lodash';
import Meteor from 'react-native-meteor';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {

    state = {
      lists: [],
      albums: [],
      isAlbumTagSelected: false,
      selectedPlayLists: [],
    };

    componentDidMount(): void {
      this._requestTags();
    }

    _requestTags = async () => {
      // Retrieve lists
      let albums = [];
      let lists = [];

      try {
        // await gs.requestPlaylists();
        lists = await apis.getTopTags();
      } catch (ex) {

      }

      try {
        albums = await apis.getAlbums();
      } catch (ex) {

      }

      // merge and build tags
      // const lists = gs.playlists.filter(el => el.type === 'chilll');
      // console.log("Lists", lists);

      const listens = await apis.getRecentListens({});
      let songInfos = _.filter(listens, u => u.songObject);
      songInfos = _.map(songInfos, u => u.songObject);
      const songs = setupSong(songInfos);
      handler.main.view.songs(songs);
      this.forceUpdate();

      this.setState({ lists, albums })
    };

    _filterByAlbumsTag = () => {
      const isAlbumTagSelected = !this.state.isAlbumTagSelected;
      this.setState({ isAlbumTagSelected })
      setTimeout(() => console.log(this.state.isAlbumTagSelected), 0);
    };

    _filterByPlaylist = async (playlist, index) => {
      const current = this.state.selectedPlayLists.slice(0); //copy
      const _i = current.indexOf(index);
      if (_i >= 0) {
        current.splice(_i, 1);
      } else {
        current.push(index);
      }
      let selectedList = [];
      for (let i = 0; i < this.state.lists.length; i++) {
        for (let j = 0; j < current.length; j++) {
          if (i === current[j]) {
            selectedList.push(this.state.lists[i].name);
          }
        }
      }

      let query = {}
      if (!_.isEmpty(selectedList)) query = { tags: selectedList }
      const listens = await apis.getRecentListens(query);
      let songInfos = _.filter(listens, u => u.songObject);
      songInfos = _.map(songInfos, u => u.songObject);
      const songs = setupSong(songInfos);
      handler.main.view.songs(songs);
      this.forceUpdate();
      this.setState({ selectedPlayLists: current });
    };
  };
}

export default methodMixin;