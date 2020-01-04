import React from 'react';
import { View } from 'react-native';
import { Image, Text } from '@components/controls';
import { sizes, images, bs } from '@theme';
import styles from './Splash.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderLogo() }
        </View>
      );
    }

    _renderBg = () => (
      <Text fontmont bold size={sizes.em(75)}>#</Text>
    )

    _renderLogo = () => (
      <Image contain source={images.ic_splash_logo} width={90} style={{flex:1}}/>
    )
  };
}

export default renderMixin;
