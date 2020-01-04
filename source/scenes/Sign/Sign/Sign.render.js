import React from 'react';
import { View } from 'react-native';
import Swiper from 'react-native-swiper';
import { Image } from '@components/controls';
import { bs, sizes, images } from '@theme';
import SignInView from '../SignIn';
import OnboardView from '../Onboard';
import ChannelsView from '../Channels';
import styles from './Sign.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderBg() }
          { this._renderSwiper() }
        </View>
      );
    }

    _renderBg = () => (
      <Image cover width={sizes.window.width} height={sizes.window.height} source={images.bg_splash} style={bs.absolute_full} />
    )

    _renderSwiper = () => {
      return (
        <Swiper
          ref={node => this._swiper = node}
          horizontal loop={false} showButtons={false}
          width={sizes.window.width} height={sizes.window.height}
          activeDotColor="#FFDE00" dotColor="#DBDBDB" paginationStyle={styles.pagination}
          index={this.state.page}
          onIndexChanged={index => {
            this.setState({ index }) }
          }
        >
          <OnboardView sizeFlag={this.props.sizeFlag} onPressLogin={this._onPressGotoLogin} />
          <SignInView sizeFlag={this.props.sizeFlag} />
          <ChannelsView sizeFlag={this.props.sizeFlag} />
        </Swiper>
      )
    }
  };
}

export default renderMixin;
