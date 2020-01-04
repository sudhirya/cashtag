import React from 'react';
import { View, Keyboard } from 'react-native';
import { Button, Text, TextInput } from '@components/controls';
import PopupDialog from 'react-native-popup-dialog';
import { handler, shallowEqual } from '@redux';
import gs from '@common/states';
import g from '@common/global';
import c from '@common/consts';
import apis from '@lib/apis';
import { sizes, bs } from '@theme';
import styles from './styles';

const { drop, hud } = handler.alert;

export default class Popup extends React.Component {
  state = {
    name: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  show() {
    gs.panMovable = false;
    this.popup.show();
  }
  dismiss() {
    this.popup.dismiss();
  }

  _onDismissed = () => {
    gs.panMovable = true;
    Keyboard.dismiss();
  }

  _onPressDone = () => {
    if (g.isEmpty(this.state.name)) {
      drop.showError(c.appName, 'Please enter a name of this device.');
      return;
    }

    hud.show('Requesting...');
    apis.nameDevice(this.state.name).then((res) => {
      hud.hide();

      if (res && res.error && res.error === 500) {
        drop.showError(c.appName, 'That name is already in use. Please use another name.');
        return;
      }

      // gs.setDeviceName(this.state.name);
      this.dismiss();
    }).catch((err) => {
      hud.hide();
      if (err && err.error === 500) {
        drop.showError(c.appName, 'That name is already in use. Please use another name.');
      } else {
        drop.showError(c.appName, 'Failed to name device.');
      }
    });
  }

  render() {
    const width = sizes.em(340, 500);

    return (
      <PopupDialog
        width={width}
        height={null}
        dialogStyle={styles.dialog}
        onDismissed={this._onDismissed}
        dismissOnHardwareBackPress={false}
        dismissOnTouchOutside={false}
        ref={(node) => { this.popup = node; }}
      >
        <View style={[bs.self_stretch, bs.center]} >
          <Text center color="#000" size={17} numberOfLines={0} style={bs.m_2x} >
            Please enter a name of this device
          </Text>
          <TextInput
            border bbackground="#000" bheight={sizes.em(40)} bpadding={sizes.pad1 * 2}
            size={15} color="#fff" value={this.state.name} bstyle={bs.mh_2x}
            onChangeText={name => this.setState({ name })}
            placeholderTextColor="#CDCDCD" placeholder="Enter name of this device..."
            keyboardAppearance="dark"
          />
          <Button bbackground="#DCAF00" bheight={sizes.em(40)} bstyle={[bs.mt_2x, bs.center]} onPress={this._onPressDone} >
            <Text color="#000" size={15} >DONE</Text>
          </Button>
        </View>
      </PopupDialog>
    );
  }
}
