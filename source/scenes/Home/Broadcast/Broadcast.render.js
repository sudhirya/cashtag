import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Image } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import BroadcastView from 'react-native-wowza-gocoder';
import Camera from 'react-native-camera';
import { ViewType } from '@common/types';
import appconfig from '@app/config';
import gs from '@common/states';
import { bs, sizes, colors, images } from '@theme';
import styles from './Broadcast.styles';

const { wowza: config } = appconfig;

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} {...this.props.pan.panHandlers}>
          { this._renderBroadcast() }
          { this._renderLiveButton() }
          { this._renderCaptureButton() }
          { this._renderArtist() }
        </View>
      );
    }

    _renderBroadcast = () => {
      // return null;
      if (this.props.viewType === ViewType.broadcast || gs.player.streamLiveVideo) {
        const opacity = { opacity: this.props.viewType === ViewType.broadcast ? 1.0 : 0.0 };
        return (
          <BroadcastView
            sdkLicenseKey={config.sdkLicenseKey}
            hostAddress={config.hostAddress}
            applicationName={config.applicationName || 'unknown'}
            broadcastName={config.streamName}
            username={config.username}
            password={config.password}
            port={config.port}
            sizePreset={3}
            muted={false}
            flashOn={false}
            frontCamera={this.state.front}
            broadcasting={gs.player.streamLiveVideo}
            style={[styles.broadcast, opacity]}
            onBroadcastStart={this.onBroadcastStart}
            onBroadcastFail={this.onBroadcastFail}
            onBroadcastStop={this.onBroadcastStop}
            onBroadcastStatusChange={this.onBroadcastStatusChange}
            onBroadcastEventReceive={this.onBroadcastEventReceive}
            onBroadcastErrorReceive={this.onBroadcastErrorReceive}
            onBroadcastVideoEncoded={this.onBroadcastVideoEncoded}
          />
        );
      }
      return null;
    }
    _renderCamera = () => {
      // if (this.props.viewType !== ViewType.boardcast && !gs.player.streamLiveVideo) return null;
      if (this.props.viewType !== ViewType.boardcast && !this.state.recording) return null;

      return (
        <Camera
          ref={(node) => { this.camera = node; }}
          captureTarget={Camera.constants.CaptureTarget.disk} aspect={Camera.constants.Aspect.fill}
          type={this.state.front ? Camera.constants.Type.front : Camera.constants.Type.back}
          style={styles.absolute_full} orientation="portrait"
        />
      );
    }

    _renderLiveButton = () => (
      <Button lock onPress={this._onPressGoLive} style={styles.btn_golive} >
        <Text color="#fff" size={16} >{gs.player.streamLiveVideo ? 'STOP LIVE' : 'LIVESTREAM'}</Text>
      </Button>
    )

    _renderArtist = () => {
      return (
        <View style={styles.artist_bottom} onPress={this._onPressArtist}>
          <Text>@Artist</Text>
        </View>
      )
    }

    _renderCaptureButton = () => {
      const { player } = gs;
      const playImage = player.playing && !player.loading ? images.ic_player_pause_sm : images.ic_player_play_sm;
      const clrButton = 'rgba(255,255,255,0.9)';
      const clrCaptureButton = 'rgba(255,222,0,0.9)';
      const bgCapture = { backgroundColor: gs.player.streamLiveVideo ? colors.alternative : clrCaptureButton };
      return (
        <View style={styles.view_bottom} >
          <Button lock onPress={this._onPressPlane} style={styles.btn_bottom} >
            {/*<Icon name="fa paper-plane" size={24} color={clrButton} />*/}
            <FIcon name="send" size={24} color={clrButton} />
          </Button>

          <Button lock onPress={this._onPressPlay} style={styles.btn_bottom} >
            <Image stretch width={sizes.em(28)} height={sizes.em(28)} tint={clrCaptureButton} source={playImage} />
          </Button>

          <Button
            lock style={[styles.btn_capture, bgCapture]}
            onPressIn={this._onPressStartCapture}
            onPressOut={this._onPressStopCapture}
            onPress={this._onPressCapture}
          >
            <View style={styles.btn_capture_inner} />
          </Button>

          <Button lock onPress={this._onPressLink} style={styles.btn_bottom} >
            <Icon name="et link" size={28} color={clrButton} />
          </Button>
          <Button lock onPress={this._onPressSwitch} style={styles.btn_bottom} >
            <Icon name="io md-reverse-camera" size={28} color={clrButton} />
          </Button>
        </View>
      );
    }

    _renderButton = (style, onPress, render) => (
      <Button
        onPress={onPress}
        onPressIn={gs.actions.onButtonPressIn}
        onPressOut={gs.actions.onButtonPressOut}
        style={style}
      >
        { render() }
      </Button>
    )
  };
}

export default renderMixin;
