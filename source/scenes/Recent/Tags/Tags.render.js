import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import { bs, colors, sizes, images } from '@theme';
import styles from './Tags.styles';
import g from '@common/global';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.tags_view} height={sizes.em(60)}>
          <ScrollView horizontal style={styles.tags_scrollview} >
            {/*this._renderAlbumsTag()*/}
            {this._renderPlayListTags()}
            <View style={bs.ml_2x}/>
          </ScrollView>
        </View>
      );
    }

    _renderTag = (title, selected, onclick, key) => (
      <View style={bs.center} key={key}>
        <Button onPress={onclick} style={selected ? styles.btn_tag_selected : styles.btn_tag}>
          <Text size={15} color={selected ? '#000' : colors.text} bold={selected}>{title}</Text>
        </Button>
      </View>
    );

    _renderAlbumsTag = () => {
      const albums = this.state.albums;
      return this._renderTag(
        `#ALBUMS (${albums.length})`,
        this.state.isAlbumTagSelected,
        this._filterByAlbumsTag
      )
    };

    _renderPlayListTags = () => {
      // const lists = this.state.lists;
      // const lists = this.props.sources;
      // const lists = this.props.fsources;
      const lists = this.props.sources;
      return lists.map((item, index) => {
        const count = g.ifNull(item.count, g.deepValue(item, 'songs.length'));
        return this._renderTag(
          `${item.name}`, // (${count})
          this.state.selectedPlayLists.indexOf(index) >= 0,
          () => {
            this._filterByPlaylist(item, index);
          },
          index)
      });
    };

  };
}

export default renderMixin;
