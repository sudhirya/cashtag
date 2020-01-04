import { Animated, PanResponder } from 'react-native';
import gs from '@common/states';
import { ViewType, SearchType } from '@common/types';
import { handler } from '@redux';
import { sizes } from '@theme';

const duration = 500;

export default class PanHandler {
  main = null;
  animating = false;
  panResponder = null;
  panStartPos: Number = 0;
  viewType: Number = ViewType.profile;

  constructor(comp) {
    this.main = comp;

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: this._onMoveShouldSetResponderCapture,
      onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate: this._onPanResponderRelease,
    });

    this.panMoveCb = Animated.event([{
      toValue: comp.state.animView,
    }]);
  }

  get panHandlers() {
    return this.panResponder.panHandlers;
  }

  // want to allow MOVEMENT of the view weâ€™ll attach this panresponder to.
  _onMoveShouldSetResponderCapture = () => true;

  // want to allow DRAGGING of the view weâ€™ll attach this panresponder to.
  _onMoveShouldSetPanResponderCapture = (event, gesture) => {
    if (!gs.panMovable || this.main.props.search.type === SearchType.search ||
        gs.player.fullscreen || this.animating) {
      return false;
    }

    const viewType = this.main.props.view.type;

    // SWIPE UP
    // can't do swipe up when in Player Collapsed state
    if (gesture.dy < 0 && viewType === ViewType.songlist) {
      return false;
    } else if (gesture.dy > 0 && viewType === ViewType.songlist) {
      // SWIPE DOWN
      if (gesture.vy <= 3 &&
          gesture.moveY > sizes.window.height - sizes.songlist.height() &&
          gs.context.listPos > 10) {
        return false;
      }
    }
    return true;
  }

  // invoked when we got ACCESS to the movement of the element
  _onPanResponderGrant = () => {
    const poses = this._getPanPoses();
    const vs = this._view2pos(this.main.props.view.type);

    if (this.main.props.search.type === SearchType.focus) {
      handler.main.search.change(SearchType.none);
    }

    this.panStartPos = poses[vs];
  }

  // invoked when we MOVE the element, which we can use to calculate the next value for the object
  _onPanResponderMove = (event, gesture) => {
    const multiplier = 1.5;
    const dy = gesture.dy * multiplier;
    const panpos = this.panStartPos - dy;
    const newpos = this._calcNewPos(panpos);

    this.panMoveCb({ toValue: newpos });
  }

  // invoked when we RELEASE the view
  _onPanResponderRelease = (event, gesture) => {
    const multiplier = 1.5;
    const dy = gesture.dy * multiplier;
    const panpos = this.panStartPos - dy;
    const newpos = this._calcNewPos(panpos);
    let newvs;

    for (let k = 0; k < 4; k += 1) {
      if (newpos < k + 0.5) {
        newvs = k;
        break;
      }
    }
    if (newvs === this.main.props.view.type) {
      if (gesture.vy > 1) {
        newvs = Math.min(Math.max(newvs - 1, 0), 3);
      } else if (gesture.vy < -1) {
        newvs = Math.min(Math.max(newvs + 1, 0), 3);
      }
    }

    this.changeView(newvs, true);
  }

  changeView = (vs, force = false, animate = true) => {
    const prev = this.main.props.view.type;
    if (force === false && vs === prev) {
      return;
    }

    const newpos = this._view2pos(vs);

    this.animating = true;
    Animated.timing(this.main.state.animView, {
      duration: animate ? duration : 0,
      toValue: newpos,
      // useNativeDriver: true,
    }).start(() => {
      this.animating = false;

      if (prev !== vs) {
        handler.main.view.change(vs);
      }
    });
  }

  _calcNewPos = (panpos) => {
    const count = ViewType.count;
    const poses = this._getPanPoses();
    let newpos = 0;

    if (panpos < 0) {
      panpos = 0;
    } else if (panpos > poses[count - 1]) {
      panpos = poses[count - 1];
    }

    for (let i = 0; i < count; i += 1) {
      if (panpos > poses[i] && panpos <= poses[i + 1]) {
        newpos = i + (panpos - poses[i]) / (poses[i + 1] - poses[i]);
        newpos = Math.min(Math.max(newpos, 0), count - 1);
        break;
      }
    }
    return newpos;
  }

  _getPanPoses = () => {
    const poses = [];
    let pos = 0;

    // selfie
    poses.push(pos);
    pos += sizes.profile.height();

    // profle
    poses.push(pos);
    pos += sizes.window.height - sizes.header.height2;

    // expanded
    poses.push(pos);
    pos += sizes.player.height() - sizes.songlist.thumbSize;

    // collapsed
    poses.push(pos);
    pos += sizes.window.height;

    // dummy
    poses.push(pos);
    return poses;
  }

  _view2pos = (vs) => {
    switch (vs) {
      case ViewType.broadcast:
        return 0;
      case ViewType.profile:
        return 1;
      case ViewType.player:
        return 2;
      case ViewType.songlist:
        return 3;
      default:
        break;
    }
    return 1;
  }

  _pos2view = (pos) => {
    if (pos >= 0 && pos < 1) {
      return ViewType.broadcast;
    } else if (pos >= 1 && pos < 2) {
      return ViewType.profile;
    } else if (pos >= 2 && pos < 3) {
      return ViewType.player;
    } else if (pos >= 3) {
      return ViewType.songlist;
    }
    return ViewType.profile;
  }
}
