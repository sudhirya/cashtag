import React from 'react';
import { View } from 'react-native';
import SongGrid from '@scenes/SongGrid';
import { SearchType } from '@common/types';
// import { sizes, images } from '@theme';
import styles from './Search.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      const zIndex = { zIndex: this.props.search.type === SearchType.search ? 100 : null };

      return (
        <View style={[styles.container, zIndex]} >
          <SongGrid
            overlay songs={this.state.songs || []}
            onPressItem={this.onPressSong}
            onLongPressItem={this.onLongPressSong}
          />
        </View>
      );
    }
  };
}

export default renderMixin;
