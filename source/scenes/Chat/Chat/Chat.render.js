import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Picker2 } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather'
import { GiftedChat } from '@components/chat';
import gs from '@common/states';
import { bs } from '@theme';
import styles from './Chat.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderNavbar() }
          { this._renderChat() }
          { this._renderPicker() }
        </View>
      );
    }

    _renderNavbar = () => (
      <View style={styles.navbar} >
        <Button style={styles.btn_back} onPress={this._onPressBack} >
          <Icon name="et chevron-thin-left" size={24} color="#000" />
        </Button>
        <Text medium color="#000" size={16} >{this.chatWith.name || this.chatWith.fullName || this.chatWith.username || ''}</Text>
      </View>
    )

    _renderChat = () => (
      <View style={styles.content} >
        <GiftedChat
          ref={node => this._gifted = node}
          style={styles.chat} placeholder="Say something..."
          showUserAvatar user={this.chatMe} messages={this.state.messages}
          renderSend={this._renderSend}
          onSend={this._onSend}
          onLongPress={this._onLongPressMessage}
          onInputTextChanged={this._onChatChanged}
        />
      </View>
    )
    _renderSend = props => (
      <View style={[bs.flex_row, bs.self_stretch]} >
        <Button bnowide bstyle={[bs.self_stretch, bs.mh_2x]} onPress={this._onPressClip} >
          {/*<Icon name="fa paperclip" color="#000" size={20} />*/}
          <FIcon name="paperclip" color="#000" size={20} />
        </Button>
        <Button bnowide bstyle={[bs.self_stretch, bs.mh_2x]} onPress={this._onPressSend.bind(this, props)} >
          <Icon name="sl paper-plane" color="#000" size={20} />
        </Button>
      </View>
    )

    _renderPicker = () => (
      <Picker2 ref={(node) => { this._picker = node; }} />
    )
  };
}

export default renderMixin;
