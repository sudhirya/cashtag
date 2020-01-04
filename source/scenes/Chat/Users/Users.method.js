import { handler } from '@redux';
import Contacts from 'react-native-contacts';
import Realm from '@model/realm';
import { routes } from '@routes';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import apis from '@lib/apis';

const { navigation } = handler;
const { hud, drop } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      keyword: '',
      userlist: [],
    }
    contacts = [];
    contacts2 = [];
    users = [];
    deleted = [];
    requestedUserIds = [];
    mounted = false;

    componentDidMount() {
      this.mounted = true;
      this._requestContacts();
    }
    componentWillUnmount() {
      this.mounted = false;
    }

    componentDidUpdate(prevProps) {
      if (this.props.subscriptions.length !== prevProps.subscriptions.length) {
        this._loadUsers();
      }
    }

    /**
     * action handlers
     */
    _onPressClose = () => {
      navigation.navigate({ type: 'back', animation: 'horzinv' });
    }

    _onPressItem = async (item) => {
      this._requestChat(item);
    }

    _onChangedKeyword = (text) => {
      this.state.keyword = text;
      this._filterUsers(text);
    }

    /**
     * helper functions
     */
    _filterUsers = (keyword) => {
      keyword = (keyword || '').trim().toLowerCase();
      let contacts = this.contacts2;
      let users = this.users;

      if (!g.isEmpty(keyword)) {
        contacts = this.contacts2.filter((contact) => {
          if (contact.fullName && contact.fullName.toLowerCase().indexOf(keyword) >= 0) return true;
          if (contact.mobile && contact.mobile.toLowerCase().indexOf(keyword) >= 0) return true;
          const found = (contact.mobileEscapes || []).findIndex(m => m.toLowerCase().indexOf(keyword) >= 0) >= 0;
          return found;
        });
        users = this.users.filter((u) => {
          if (u.name && u.name.toLowerCase().indexOf(keyword) >= 0) return true;
          if (u.username && u.username.toLowerCase().indexOf(keyword) >= 0) return true;
          return false;
        });
      }

      const userlist = [];
      if (users.length > 0) {
        userlist.push({ section: 'OPEN CONVERSATIONS' });
        users.forEach((u) => { userlist.push(u); });
      }
      if (contacts.length > 0) {
        userlist.push({ section: 'PHONE #’s' });
        contacts.forEach((contact) => { userlist.push(contact); });
      }

      this.state.userlist = userlist;
      this.forceUpdate();
    }

    _loadUsers = (fromReq) => {
      if (!this.mounted) return;

      let needProfile = false;
      const users = this.props.subscriptions.map((s) => {
        const isDeleted = this.deleted.findIndex(el => el === s._id) >= 0;
        if (isDeleted) return null;

        const userId = s.name.replace(gs.user.userId, '').replace('_', '');
        if (userId === gs.user.userId) return null;

        const user = Realm.chat.findUser(userId);
        if (!user) {
          needProfile = true;
          return null;
        }

        return {
          ...user,
          unread: s.unread,
        };
      });

      this.users = users.filter((u, i) => u && u._id &&
        users.findIndex(el => el && el._id === u._id) === i);
      this.contacts2 = this.contacts.filter(contact => this.users.findIndex(u =>
        contact.mobileEscapes.findIndex(m => u.username === m) >= 0) < 0);

      this._filterUsers(this.state.keyword);
      if (!fromReq && needProfile) {
        this._requestUsers();
      }
    }

    /**
     * api requests
     */
    _requestChat = async (item) => {
      hud.show('Requesting...');
      try {
        let chatWith = item;
        if (chatWith.isContact) {
          const number = (item.mobile || '').replace(/\D+/g, '');
          chatWith = await apis.findUserByNumberOrEmail(number, item.email);
          if (!chatWith) {
            gs.context.inviteUser = item;
            hud.hide();
            navigation.navigate({ name: routes.names.app.chatInvite, animation: 'horzinv' });
            return;
          }

          chatWith.avatar = item.avatar;
          chatWith.fullName = item.fullName;
        }

        await gs.setupChat(null, chatWith);
        navigation.navigate({ name: routes.names.app.chat, animation: 'horzinv' });
      } catch (e) {
        console.log('setupChat failed: ', e);
        drop.showError(c.appName, 'Failed to setup chat');
      }
      hud.hide();
    }


    _requestUsers = async () => {
      let userIds = this.props.subscriptions.map(el => el.name.replace(gs.user.userId, '').replace('_', ''));
      userIds = userIds.filter((id, i) => userIds.findIndex(el => el === id) === i);
      userIds = userIds.filter(id => this.users.findIndex(el => el._id === id) < 0);
      userIds = userIds.filter(id => this.requestedUserIds.findIndex(el => el === id) < 0);
      console.log('requestUsers: ', userIds, this.props.subscriptions);
      if (!userIds.length) return;

      try {
        userIds.forEach(el => this.requestedUserIds.push(el));

        const users = await apis.getUserProfiles(userIds);
        for (let i = 0; i < (users && users.length) || 0; i += 1) {
          const user = users[i];
          // eslint-disable-next-line
          const found = this.contacts.find(contact =>
            (contact.mobileEscapes || []).findIndex(m => m === user.username) >= 0);
          if (found) {
            user.fullName = found.fullName;
            user.avatar = found.avatar;
          }
          await Realm.chat.addWebUser(user); // eslint-disable-line
        }
      } catch (ex) {
        console.log('Users::_requestUsers failed: ', ex);
      }

      userIds.forEach((el) => {
        const index = this.requestedUserIds.findIndex(r => r === el);
        if (index >= 0) this.requestedUserIds.splice(index, 1);
      });

      this._loadUsers(true);
    }

    _requestContacts = async () => {
      try {
        this.contacts = await gs.getContacts();
        this.contacts2 = this.contacts;

        this.contacts.forEach((contact) => {
          (contact.mobileEscapes || []).forEach((m) => {
            const user = Realm.chat.findUserByName(m);
            if (user) {
              Realm.chat.addWebUser({
                userId: user._id,
                username: user.username,
                fullName: contact.fullName || user.name,
                avatar: contact.avatar || user.avatar,
              });
            }
          });
        });
      } catch (ex) { ex; }
      this._loadUsers();
    }
  };
}

export default methodMixin;
