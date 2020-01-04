import { handler, getState } from '@redux';
import { ViewType, SearchType } from '@common/types';
import { routes } from '@routes';
import gs from '@common/states';
import _ from 'lodash';
// import apis from '@lib/apis';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    _onPressSearch = () => {
      const state = getState();
      if (state.main.view.type === ViewType.profile) {
        if (this.props.search.type === SearchType.none) {
          // if (this.props.search.keyword.length) {
          //   handler.main.search.change(SearchType.search);
          // } else {
          //   handler.main.search.change(SearchType.focus);
          // }
        } else {
          handler.main.search.change(SearchType.none);
          return;
        }
      // } else {
      //   navigation.navigate({ name: routes.names.app.search, animation: 'horzinv' });
      }
      navigation.navigate({ name: routes.names.app.search, animation: 'horzinv' });
    }
    _onPressLongSearch = () => {
      const state = getState();
      if (state.main.view.type === ViewType.profile) {
        if (this.props.search.type === SearchType.none) {
          if (this.props.search.keyword.length) {
            handler.main.search.change(SearchType.search);
          } else {
            handler.main.search.change(SearchType.focus);
          }
        } else {
          handler.main.search.change(SearchType.none);
        }
      }
    }

    _onPressTV = () => {
      navigation.navigate({ name: routes.names.app.recent });
    }

    _onPressLiveAudio = () => {
      gs.toggleLiveAudio();
    }

    _onChangeSearch = (search) => {
      handler.main.search.keyword(search);
    }

    _onPressMenu = () => {
      if (this.props.viewType === ViewType.player) {
        handler.main.view.change(ViewType.profile);
      }
    }

    /*
    _onPressHandle = () => {
      gs.addRemoveSongOnStream(gs.player.song);
    }
    */

    _onPressHandle = () => {
      handler.main.view.change(ViewType.broadcast);
    }
  };
}

export default methodMixin;
