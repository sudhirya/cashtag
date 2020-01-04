import React from 'react';
import { View } from 'react-native';
import { Avatar, Text, Button, Icon } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { colors, sizes, bs, images } from '@theme';
import gs from '@common/states';
import styles from './Invite.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderContent() }
          { this._renderClose() }
        </View>
      );
    }

    _renderContent = () => {
      const { inviteUser } = gs.context;
      const avatar = inviteUser && inviteUser.avatar;
      return (
        <View style={styles.content} >
          <Avatar image={avatar} size={sizes.em(88)} style={styles.avatar} placeholder={images.ic_no_user} background="#EEE" />
          <Text bold center size={25} color="#fff" style={bs.mt_2x} >Invite</Text>
          <Text bold center size={25} color="#fff" style={bs.mt_2x} >{inviteUser && inviteUser.fullName}</Text>
          <Text bold center size={25} color="#fff" style={bs.mt_2x} >to Chilll</Text>
          <Button
            bwidth={sizes.em(320, 500)} bheight={44} bbackground="#fff" bradius={sizes.pad1} bstyle={[bs.mt_4x, bs.mb_3x, bs.center]}
            onPress={this.onPressInvite}
          >
            <Text transparent bold size={19} color="#C9A004" >Send Now</Text>
          </Button>
        </View>
      );
    }

    _renderClose = () => (
      <Button onPress={this.onPressClose} style={styles.btn_close} >
        <Icon name="io md-close" size={24} color={colors.text} />
      </Button>
    )
  };
}

export default renderMixin;
