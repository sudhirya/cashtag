// import { Animated } from 'react-native';
import { GiftedChat } from '@components/chat';
import ImagePicker from 'react-native-image-crop-picker';
import Realm from '@model/realm';
import { handler } from '@redux';
// import { routes } from '@routes';
import gs from '@common/states';
import g from '@common/global';
import apis from '@lib/apis';

const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);

      this.state = {
        messages: [],
        total: 0,
        loaded: 20,
      }
      gs.chat.isChatting = true;
    }
    mounted = false;
    prevTyping = false;

    get chatWith() {
      return gs.chat.chatWith;
    }
    get chatMe() {
      return gs.chat.chatMe;
    }

    componentDidMount() {
      this.mounted = true;
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    UNSAFE_componentWillReceiveProps() {
      this._updateMessages();
    }

    /**
     * action handlers
     */
    _onPressBack = () => {
      gs.chat.isChatting = false;
      navigation.navigate({ type: 'back', animation: 'horzinv' });
      this._requestClose();
    }

    _onPressClip = () => {
      const buttons = ['Take New Photo', 'Photo Library'];
      this._picker.open(null, buttons, 'Cancel', async (item, index) => {
        const options = {
          cropping: false,
          mediaType: 'photo',
        };

        try {
          let picked = null;
          if (index === 1) {
            picked = await ImagePicker.openPicker(options);
          } else if (index === 0) {
            picked = await ImagePicker.openCamera(options);
          }
          if (picked) {
            this._gifted.onSend({ image: picked.path }, true);
          }
        } catch (e) {
          console.log('UserSetting::_onPressAvatar failed: ', e);
        }
      });
    }

    _onPressSend = (props) => {
      this._gifted.onSend({ text: props.text }, true);
    }

    _onChatChanged = (text) => {
      this._requestTyping(text);
    }

    _onSend = async (msgs) => {
      const msg = msgs && msgs[0];
      if (!msg) return;
      this._requestSend(msg);
    }

    /**
     * helper functions
     */
    _loadChat = () => {
      this.state.messages = [];
      this.state.total = 0;
      this.state.loaded = 20;
      this._updateMessages();
    }

    _updateMessages = () => {
      const totalmsgs = Realm.chat.findMessages(gs.chat.rid) || [];
      const chatmsgs = totalmsgs.filter(el => this.state.messages.findIndex(u => u._id === el._id) < 0);

      this.state.total = totalmsgs.length;
      if (chatmsgs.length) {
        let messages = chatmsgs.map(el => Realm.chat.messageToGifted(el));
        messages = messages.sort((el1, el2) => el1.createdAt < el2.createdAt);
        messages.forEach((el) => {
          el.user = Realm.chat.findUser(el.user._id);
        });

        this._addMessages(this.state.messages, messages);
        return true;
      } else if (this.prevTyping !== this.props.isTyping) {
        const messages = this.state.messages.slice(0);
        this._setMessages(messages);
      }
      return false;
    }

    _addMessages = (cur, add) => {
      let messages = cur.map(el => (!el.sent ? el : { ...el, sent: undefined }));
      messages = messages.filter(el => el.text || el.image);
      messages = GiftedChat.append(messages, add);
      this._setMessages(messages);
    }
    _setMessages = (cur) => {
      let messages = [];
      if (this.props.isTyping) {
        messages.push({
          _id: '0',
          user: this.chatWith,
          typing: true,
        });
      }

      messages = messages.concat(cur.filter(el => el.text || el.image));
      this.prevTyping = this.props.isTyping;
      this.state.messages = messages;console.log('messages: ', messages);
      if (this.mounted) this.forceUpdate();
    }

    /**
     * api requests
     */
    _requestClose = async () => {
      try {
        await apis.readMessages(gs.chat.rid);
        await apis.stopTyping(gs.chat.rid, this.chatMe._id);
      } catch (ex) {
        console.log('chat::_requestClose failed: ', ex);
      }
    }

    _typing = false;
    _timerTyping = null;
    _requestTyping = async (text) => {
      try {
        if (this._timerTyping) {
          clearTimeout(this._timerTyping);
          this._timerTyping = null;
        }

        if (g.isEmpty(text)) {
          this._typing = false;
          await apis.stopTyping(gs.chat.rid, this.chatMe._id);
        } else {
          if (!this._typing) {
            this._typing = true;
            await apis.startTyping(gs.chat.rid, this.chatMe._id);
          }

          this._timerTyping = setTimeout(() => {
            this._requestTyping('');
          }, 5000);
        }
      } catch (ex) {
        console.log('Chat::_onChatChanged failed: ', ex);
      }
    }

    _requestSend = async (msg) => {
      const isText = msg.text && msg.text.length;
      const isImage = msg.image && msg.image.length;
      if (!isText && !isImage) return;

      const chatmsg = Realm.chat.generateMessage(gs.chat.rid, msg.text);
      let giftmsg = Realm.chat.messageToGifted(chatmsg);
      giftmsg.sending = true;
      if (isImage) giftmsg.image = msg.image;

      this._addMessages(this.state.messages, giftmsg);

      let sent = true;
      try {
        if (isText) {
          await apis.sendMessage(chatmsg);
        } else {
          await apis.sendImageMessage(chatmsg, msg.image);
        }
      } catch (e) {
        sent = false;
      }

      const index = this.state.messages.findIndex(el => el._id === chatmsg._id);
      if (index === -1) return;

      const messages = this.state.messages.slice(0);
      giftmsg = {
        ...messages[index],
        sending: undefined,
      };

      if (sent) giftmsg.sent = true;
      else giftmsg.failed = true;
      messages[index] = giftmsg;
      this._setMessages(messages);
    }
  };
}

export default methodMixin;
