import React from 'react';
import { View } from 'react-native';
import { Button, Text, Image, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { bs, colors, sizes, images } from '@theme';
import { LiveList } from '@scenes/List';
import SongGrid from '@scenes/SongGrid';
import styles from './Livelist.styles';
import gs from '@common/states';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderTitle() }
          { !this.state.isChannel ? this._renderLiveList() : this._renderChannels() }
        </View>
      );
    }

    _renderTitle = () => (
      <View style={styles.view_title} >
        { !this.state.isChannel
          ? (
            <Button onPress={this.onPressLive} style={styles.btn_live} >
              {/* <Image contain width={sizes.em(28)} height={sizes.em(28)} source={images.ic_live_video_on} />
              <Text color={colors.text} size={17} style={bs.ml_1x} >LIVESTREAMS</Text> */}
              <Image contain width={sizes.em(24)} height={sizes.em(24)} source={images.ic_fuego} />
              {/* <Text color={colors.text} size={17} style={bs.ml_1x} >#TRENDING</Text> */}
              <Text color={colors.text} size={17} style={bs.ml_1x} >LIVE FEEDS</Text>
              <Text color={colors.text} size={25} style={bs.ml_1x} >+</Text>
            </Button>
          )
          : (
            <Button onPress={this.onPressLive} style={styles.btn_live} >
              <Image contain width={sizes.em(28)} height={sizes.em(28)} source={images.ic_header_tv} />
              <Text color={colors.text} size={17} style={bs.ml_1x} >{gs.user.meteorInfo.profile.handle}</Text>
            </Button>
          )
        }
        <Button onPress={this.onPressClose} style={styles.btn_close} >
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>
      </View>
    )

    _renderLiveList = () => {
      return (
        <LiveList onPressItem={this.onPressItem} />
      )
    }

    _renderChannels = () => (
      <SongGrid
        overlay
        songs={this.songs || []}
        onPressItem={this.onPressItem}
        onLongPressItem={this.onLongPressSong}
      />
    )
  };
}

export default renderMixin;
