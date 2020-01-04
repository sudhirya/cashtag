import { handler } from '@redux';
// import { routeNames } from '@routes';
import gs from '@common/states';
import c from '@common/consts';
import apis from '@lib/apis';

const { navigation } = handler;
const { hud, drop } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    onPressClose = () => {
      navigation.navigate({ type: 'back', animation: 'horzinv' });
    }

    onPressInvite = async () => {
      const { inviteUser } = gs.context;

      hud.show('Inviting...');
      try {
        await apis.inviteContact(inviteUser.fullName, inviteUser.mobiles, inviteUser.emails);
        drop.showSuccess(c.appName, 'Invitation sent');
        this.onPressClose();

        apis.registerAction('Invite Contact', { contactInfo: inviteUser });

      } catch (err) {
        drop.showError(c.appName, 'Failed to invite user');
      }
      hud.hide();
    }
  };
}

export default methodMixin;
