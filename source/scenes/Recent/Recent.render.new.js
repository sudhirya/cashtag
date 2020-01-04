import React from 'react';
import { View } from 'react-native';
import { Button, Image, Text, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
// import SongGrid from '@scenes/SongGrid';
import FlatSongGrid from '@scenes/FlatSongGrid';
import { PlayList } from '@scenes/List';
import { bs, sizes, images, colors } from '@theme';
import styles from './Recent.styles';
import {Tags} from './Tags';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderTitle() }
          <Tags/>
          { this._renderSongs() }

          <Button style={styles.wallet_button} onPress={this._onPressWallet} >
            <Image width={36} height={28} source={images.ic_wallet} />
          </Button>
        </View>
      );
    }

    _renderTitle = () => (
      <View style={styles.view_title} >
        <Button onPress={this.onPressLive} style={styles.btn_live} >
          <Image contain width={sizes.em(28)} height={sizes.em(28)} source={images.ic_header_tv} />
          <Text color={colors.text} size={17} style={bs.ml_1x} >STREAM</Text>
          {/*<Icon name={this.state.isRecent ? 'fa caret-down' : 'fa caret-up'} color="#fff" size={25} style={bs.ml_1x} />*/}
          <FIcon name={this.state.isRecent ? 'chevron-down' : 'chevron-down'} color="#fff" size={25} style={bs.ml_1x} />
        </Button>

        <Button onPress={this.onPressClose} style={styles.btn_close} >
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>
      </View>
    );

    _renderSongs = () => (
      <FlatSongGrid
        overlay songs={this.state.songs || []}
        onPressItem={this.onPressSong}
        onLongPressItem={this.onLongPressSong}
      />
    );

    // _renderList = () => (
    //   <SongGrid
    //     overlay songs={this.props.songs || []}
    //     onPressItem={this.onPressSong}
    //     onLongPressItem={this.onLongPressSong}
    //   />
    // )
  };
}

export default renderMixin;
