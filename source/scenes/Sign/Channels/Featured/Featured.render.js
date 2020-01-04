import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import { bs, colors, sizes, images } from '@theme';
import styles from './Featured.styles';
import g from '@common/global';
import { shallowEqual } from '@redux';

function renderMixin(Component) {
  return class Render extends Component {

    /*
    *
    */
    render() {
      return (
        <View style={styles.tags_view} height={sizes.em(150)}>
          <View style={bs.pt_2x}>
            <Text style={bs.pl_2x} size={13} color={'gray'}>FEEDS</Text>
          </View>
          <ScrollView horizontal style={styles.tags_scrollview} >
            {this._renderPlayListTags()}
            <View style={bs.ml_2x}/>
          </ScrollView>
        </View>
      );
    }

    /*
    *
    */
    _renderTag = (title, selected, onclick, key) => (
      <View style={bs.center} key={key}>
        <Button onPress={onclick} style={selected ? styles.btn_tag_selected : styles.btn_tag}>
          <Text size={15} color={selected ? '#000' : colors.text} bold={selected}>{title}</Text>
        </Button>
      </View>
    );

    /*
    *
    */
    _renderPlayListTags = () => {
      const lists = this.props.fsources;
      let channellist = this.props.channellist || []
      if(lists) {
        return lists.map((item, index) => {
          return this._renderTag(
            `${item.name}`, // (${count})
            channellist.indexOf(item._id) >= 0,
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
