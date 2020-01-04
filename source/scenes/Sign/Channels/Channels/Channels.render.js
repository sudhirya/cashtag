import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import { bs, colors, sizes, images } from '@theme';
import styles from './Channels.styles';
import g from '@common/global';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.tags_view} height={sizes.em(375)}>
          <View style={bs.pt_2x}>
            <Text style={styles.btn_all_channels} size={13} color={'gray'}>CHANNELS</Text>
          </View>
          <ScrollView contentContainerStyle={styles.tags_scrollview}>
            {this._renderPlayListTags()}
            <View style={bs.ml_2x}/>
          </ScrollView>
        </View>
      );
    }

    _renderTag = (title, selected, onclick, key) => (
      <View style={bs.center} key={key} style={styles.tags_scrollview_item}>
        <Button onPress={onclick} style={selected ? styles.btn_tag_selected : styles.btn_tag}>
          <Text size={15} color={selected ? '#000' : colors.text} bold={selected}>{title}</Text>
        </Button>
      </View>
    );

    _renderPlayListTags = () => {
      const lists = this.props.sources;
      let channellist = this.props.channellist || []
      if(lists) {
        return lists.map((item, index) => {
          return this._renderTag(
            `${item.name}`, // (${count})
            channellist.indexOf(item.id) >= 0,
            () => {
              this._filterByPlaylist(item, index);
            },
            index)
        });
      }
    };

  };
}

export default renderMixin;
