import React from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { Image } from '@components/controls';
import { bs, sizes, images } from '@theme';
import GridItem from './GridItem';
import styles from './SongGrid.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      const {
        style, overlay, songs, loading, ...otherProps
      } = this.props;

      const data = this._buildSongs(songs);
      return (
        <View style={style || styles.container} >
          <FlatList
            data={data}
            renderItem={this._renderRow}
            keyExtractor={(item, index) => `songrow_${this.compIndex}_${index}`}
            style={bs.match_parent}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            onScroll={this.onScroll}
            onContentSizeChange={this.onContentSizeChange}
            onLayout={this.onLayout}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={20}
            ListFooterComponent={this._renderFooter}
            removeClippedSubviews
            {...otherProps}
          />
          { this._renderOverlayTop() }
          { this._renderOverlayBottom() }
        </View>
      );
    }

    _renderRow = ({ item, index }) => (
      <GridItem
        data={item}
        row={index}
        contentSize={this.state.contentSize}
        listHeight={this.state.listHeight}
        animScroll={this.state.animScroll}
        compIndex={this.compIndex}
        onPressItem={this.onPressItem}
        onLongPressItem={this.onLongPressItem}
      />
    )

    _renderOverlayTop = () => {
      if (!this.props.overlay) return null;
      return (
        <Image
          stretch width={this.state.listWidth + 2} height={sizes.em(50)} source={images.bg_list_top_overlay} pointerEvents="none"
          style={styles.overlay_top}
        />
      );
    }
    _renderOverlayBottom = () => {
      if (!this.props.overlay) return null;
      return (
        <Image
          stretch width={this.state.listWidth + 2} height={sizes.em(50)} source={images.bg_list_bottom_overlay} pointerEvents="none"
          style={styles.overlay_bottom}
        />
      );
    }
    _renderFooter = () => {
      const height = { height: sizes.em(100) };

      if (!this.props.loading) {
        return (
          <View style={[bs.self_stretch, height]} />
        );
      }

      return (
        <View style={[bs.self_stretch, bs.center, bs.pb_4x, height]} >
          <ActivityIndicator size="small" color="white" animating />
        </View>
      );
    }
  };
}

export default renderMixin;
