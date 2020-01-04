import React from 'react';
import { View } from 'react-native';
import { Text, Button, Icon } from '@components/controls';
import { bs, colors } from '@theme';
import gs from '@common/states';
import SongList from './List';
import styles from './Songlist2.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderTitle() }
          { this._renderList() }
        </View>
      );
    }

    _renderTitle = () => {
      const title = gs.context.playlist;

      return (
        <View style={styles.view_title} >
          <Text size={17} color={colors.text} style={[bs.flex, bs.ml_5x]} numberOfLines={1} >{title}</Text>
          <Button onPress={this._onPressClose} style={styles.btn_close} >
            <Icon name="io md-close" size={24} color={colors.text} />
          </Button>
        </View>
      );
    }

    _renderList = () => (
      <SongList
        data={gs.context.songs}
        onPressItem={this._onPressSong}
      />
    )
  };
}

export default renderMixin;
