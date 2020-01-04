import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Text, TextInput } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { bs, sizes, colors } from '@theme';
import UserList from './UserList';
import styles from './Users.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderSearch() }
          { this._renderUsers() }
          { this._renderBack() }
        </View>
      );
    }

    _renderSearch = () => (
      <View style={[styles.searchbar, bs.mb_2x]} >
        <Icon name="io md-search" size={24} color={colors.text} style={[bs.pl_3x,bs.pt_2x] }/>
        <TextInput
          border bunderline="#fff" bstyle={[bs.flex, bs.mt_2x, bs.mh_2x]}
          bpadding={1} bheight={sizes.em(35)}
          size={16} color="#fff" placeholder="CONTACTS" placeholderTextColor="#888"
          value={this.state.keyword} onChangeText={this._onChangedKeyword}
        />

        <Button onPress={this._onPressClose} style={styles.btn_close} >
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>
      </View>
    )

    _renderUsers = () => {
      if (!this.state.userlist.length) {
        return (
          <View style={styles.no_result} >
            <Text size={50} color="#A0A0A0" style={styles.txt_no_contact}>Connect</Text>
          </View>
        );
      }
      return (
        <UserList
          data={this.state.userlist}
          onPressItem={this._onPressItem}
        />
      );
    }

    _renderBack = () => (
      <Button style={styles.chat_button} onPress={this._onPressClose} >
        <Icon name="io ios-arrow-back" size={33} color='#0000FF' style={bs.bg_transparent} />
      </Button>
    )
  };
}

export default renderMixin;
