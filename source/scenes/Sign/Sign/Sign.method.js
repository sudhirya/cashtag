// import { handler } from '@redux';
// import { routes } from '@routes';
// import gs from '@common/states';
// import apis from '@lib/apis';

// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      page: this.props.swiperslidenumber || 0,
    }

    /**
     * action handlers
     */
    _onPressGotoLogin = () => {
      this._swiper && this._swiper.scrollBy(1, true);
    }
  };
}

export default methodMixin;