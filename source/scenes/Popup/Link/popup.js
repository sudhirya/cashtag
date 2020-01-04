import React from 'react';
import { View, Keyboard } from 'react-native';
import { Button, Text, TextInput } from '@components/controls';
import PopupDialog from 'react-native-popup-dialog';
import { shallowEqual } from '@redux';
import gs from '@common/states';
import { sizes, bs } from '@theme';
import styles from './styles';

export default class Popup extends React.Component {
  state = {
    url: '',
    isRender: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  show(url) {
    gs.panMovable = false;
    this.setState({ url, isRender: true }, () => {
      this.popup.show();
    });
  }
  dismiss() {
    this.popup.dismiss();
  }

  _onDismissed = () => {
    gs.panMovable = true;
    Keyboard.dismiss();
    this.setState({ isRender: false });
  }

  _onPressDone = () => {
    this.dismiss();
  }

  render() {
    const width = sizes.em(340, 500);

    return (
      <PopupDialog
        width={width}
        height={null}
        dialogStyle={styles.dialog}
        onDismissed={this._onDismissed}
        ref={(node) => { this.popup = node; }}
      >
        { this.state.isRender && this._renderContent() }
      </PopupDialog>
    );
  }

  _renderContent = () => (
    <View style={[bs.self_stretch, bs.center]} >
      <Text center color="#000" size={17} numberOfLines={0} style={bs.m_2x} >
        Link URL
      </Text>
      <TextInput
        border bbackground="#000" bheight={sizes.em(40)} bpadding={sizes.pad1 * 2}
        size={15} color="#fff" value={this.state.url} bstyle={bs.mh_2x}
        keyboardAppearance="dark" readOnly
      />
      <Button bbackground="#DCAF00" bheight={sizes.em(40)} bstyle={[bs.mt_2x, bs.center]} onPress={this._onPressDone} >
        <Text color="#000" size={15} >DONE</Text>
      </Button>
    </View>
  )
}
