import React from 'react';
import { View } from 'react-native';
// import { Button, Avatar, Text, Icon } from '@components/controls';
// import { bs, sizes, images } from '@theme';
// import numeral from 'numeral';
// import gs from '@common/states';
// import g from '@common/global';
import styles from './SideMenu.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
        </View>
      );
    }
  };
}

export default renderMixin;
