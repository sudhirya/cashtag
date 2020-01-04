import Camera from 'react-native-camera';
import { handler } from '@redux';
import { routes } from '@routes';
import { sizes } from '@theme';
import { liveSong } from '@model/song';
import { ViewType } from '@common/types';
import gs from '@common/states';
import apis from '@lib/apis';

const { navigation } = handler;
const { hud } = handler.alert;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      front: false,
      recording: false,
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.viewType === ViewType.broadcast && nextProps.viewType !== ViewType.broadcast) {
        if (this.state.recording) {
          this._stopRecord(false);
        }
      }
    }

    onBroadcastStart = () => {
    }
    onBroadcastFail = () => {
    }
    onBroadcastStop = () => {
    }
    onBroadcastStatusChange = () => {
    }
    onBroadcastEventReceive = () => {
    }
    onBroadcastErrorReceive = () => {
    }
    onBroadcastVideoEncoded = () => {
    }

    _onPressSwitch = () => {
      this.setState({ front: !this.state.front });
    }

    _onPressPlay = () => {
      gs.togglePlay();
    }

    _onPressPlane = () => {
      navigation.navigate({ name: routes.names.app.chatUsers, animation: 'horzinv' });
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //   if (nextProps.view.type !== this.props.view.type) {
    //     this.pan.changeView(nextProps.view.type);
    //   }
    // }

    _onPressArtist = () => {
      console.log(gs.handles)
      // handler.main.view.change(ViewType.player);

    }

    _onPressLink = () => {
      if (gs.player.streamLiveVideo && this.props.user) {
        if (!this.props.user.wowzaStreamUrl) return;

        const url = sizes.is_iphone
          ? this.props.user.wowzaStreamUrl.ios
          : this.props.user.wowzaStreamUrl.android;

        gs.handles.linkPopup.show(url);
      }
    }

    _onPressGoLive = () => {
      if (this.state.recording) {
        this._stopRecord(true);
      } else {
        this._startRecord(true);
      }
      // if (!gs.player.streamLiveVideo) {
      //   gs.startLiveVideo();
      // } else {
      //   gs.stopLiveVideo();
      // }
    }

    _onPressStartCapture = () => {
      // this._startRecord(true);
      // if (!gs.player.streamLiveVideo) {
      //   gs.startLiveVideo();
      // }
    }
    _onPressStopCapture = () => {
      // this._stopRecord(true);
      // if (gs.player.streamLiveVideo) {
      //   gs.stopLiveVideo();
      // }
    }
    _onPressCapture = () => {

    }

    _startRecord = async (update) => {
      this.state.startTime = new Date().getTime();
      this.state.recording = true;
      if (update) this.forceUpdate();

      try {
        const data = await this.camera.capture({ mode: Camera.constants.CaptureMode.video });
        const endTime = new Date().getTime();
        const duration = parseInt(endTime - this.state.startTime, 10);
        const capturePath = data.path;

        hud.show();
        try {
          const videoUrl = await apis.uploadLiveVideo(capturePath);
          const song = liveSong(videoUrl, duration);
          apis.addSongToLive(song);
        } catch (ex) {
          console.log('BroadCase::_startRecord failed: ', ex);
        }
        hud.hide();
      } catch (ex) {
        console.log('BroadCase::_startRecord failed: ', ex);
      }
      this.state.recording = false;
      if (update) this.forceUpdate();
    }
    _stopRecord = () => {
      this.camera.stopCapture();
    }
  };
}

export default methodMixin;
