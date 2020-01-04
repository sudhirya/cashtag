import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import { bs, colors, sizes, images } from '@theme';
import styles from './ChannelCategories.styles';
import g from '@common/global';
import gs from '@common/states';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.tags_view} height={sizes.em(120)}>
          <View style={[bs.pt_9x, styles.row]}>
            <View width="85%">
              <Text size='27' semibold style={bs.pl_2x} >{(gs && gs.user && gs.user.meteorInfo && gs.user.meteorInfo.profile.handle) ? gs.user.meteorInfo.profile.handle.toUpperCase() : ''}</Text>
            </View>
            <View width="15%">
              <View style={styles.circle_btn} onPress={this._goToProfile}>
                <Text size={34} color="#FFFFFF" style={styles.circle_plus_btn}>+</Text>
              </View>
            </View>
          </View>

          <ScrollView horizontal style={styles.tags_scrollview} >
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

    _renderPlayListTags = () => {
      const lists = this.state.lists;
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
