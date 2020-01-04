import React from 'react';
import { View } from 'react-native';
import { Navigators } from '@routes';
import { getNavigation } from 'react-navigation';
import DropdownAlert from 'react-native-dropdownalert';
import LoadingHud from '@components/hud'; // 'react-native-lyhud';
import { SongPopup, AddPopup } from '@scenes/Popup';
import Meteor from 'react-native-meteor';
import { connect } from 'react-redux';
import { actions, shallowEqual, bindActionCreators } from '@redux';
import { bs } from '@theme';
import gs from '@common/states';
import styles from './styles';
import config from './config';

Meteor.connect(config.meteor.url);

class App extends React.Component {
  componentDidUpdate(prevProps) {
    const { drop: newDrop, hud: newHud, drawer: newDrawer } = this.props;
    const { drop: oldDrop, hud: oldHud, drawer: oldDrawer } = prevProps;

    if (!shallowEqual(oldDrop, newDrop, 5)) {
      if (newDrop.visible) {
        this.dropAlert.alertWithType(newDrop.type, newDrop.title, newDrop.message);
      } else {
        // this.dropAlert.dismiss();
      }
    }
    if (newHud.visible !== oldHud.visible) {
      if (newHud.visible) {
        this.loadingHud.show(newHud.message);
      } else {
        this.loadingHud.close();
      }
    }
    if (newDrawer.visible !== oldDrawer.visible) {
      if (newDrawer.visible) {
        this._drawer.open();
      } else {
        this._drawer.close();
      }
    }
  }

  _onDrawerClose = () => {
    if (this.props.drawer.visible) {
      this.props.actions.drawer.hide();
    }
  }
  _onAlertClose = () => {
    if (this.props.drop.visible) {
      this.props.actions.drop.hide();
    }
  }

  render() {
    return (
      <View style={bs.match_parent} >
        { this._renderNavigator() }
        { this._renderSongPopup() }
        { this._renderAddPopup() }
        { this._renderHud() }
        { this._renderDropAlert() }
      </View>
    );
  }

  _renderDropAlert = () => (
    <DropdownAlert
      ref={(node) => { this.dropAlert = node; }}
      panResponderEnabled={false}
      titleStyle={styles.drop.title}
      messagesStyle={styles.drop.messages}
      onClose={this._onAlertClose}
    />
  )

  _renderHud = () => (
    <LoadingHud
      ref={(node) => { this.loadingHud = node; }}
    />
  )

  _renderNavigator = () => {
    const getCurrentNavigation = () => this.navProp;
    const subscribes = {
      add: () => {},
    };
    this.navProp = getNavigation(
      Navigators.App.router,
      this.props.navApp,
      this.props.dispatch,
      subscribes,
      () => {},
      getCurrentNavigation,
    );
    return (
      <Navigators.App navigation={this.navProp} />
    );
  }

  _renderSongPopup = () => (
    <SongPopup
      ref={(node) => { gs.handles.songPopup = node; }}
      buttonFlag={this.props.buttonFlag}
    />
  )
  _renderAddPopup = () => (
    <AddPopup ref={(node) => { gs.context.addPopup = node; }} />
  )
}

const mapStateToProps = state => ({
  navApp: state.navApp,
  drop: state.alert.drop,
  hud: state.alert.hud,
  drawer: state.alert.drawer,
  buttonFlag: state.main.buttonFlag,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    drop: bindActionCreators(actions.alert.drop, dispatch),
    hud: bindActionCreators(actions.alert.hud, dispatch),
    drawer: bindActionCreators(actions.alert.drawer, dispatch),
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
