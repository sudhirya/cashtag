// import { handler } from '@redux';
// import { routes } from '@routes';
// import gs from '@common/states';
// import g from '@common/global';
// import apis from '@lib/apis';

// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
  };
}

export default methodMixin;
