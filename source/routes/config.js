import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
import { NavigationInterpolator } from '@components/navigation';
import { Splash } from '@scenes/Splash';
import * as Sign from '@scenes/Sign';
import * as Chat from '@scenes/Chat';
import { Home } from '@scenes/Home';
import { Recent } from '@scenes/Recent';
import { Livelist } from '@scenes/Livelist';
import { Songlist } from '@scenes/Songlist';
import { Songlist2 } from '@scenes/Songlist2';
import { Search } from '@scenes/Search';
import { Wallet } from '@scenes/Wallet';
import { sizes } from '@theme';
import routes from './routes';
import Navigators from './navigator';

function addNavigation(name, key) {
  routes.configs[name] = {};
  routes.names[name] = {};
  routes.keys[name] = {};
  routes.options[name] = {};

  routes.navkeys[name] = key;
  routes.states[routes.navkeys[name]] = {};
}

addNavigation('app', 'root');

function addRoute(collection, name, Scene, routeopt, navopts) {
  const configs = routes.configs[collection];
  configs[name] = {
    screen: Scene,
    navigationOptions: navopts,
  };

  const options = routes.options[collection];
  options[name] = {
    status: 'light-content',
    ...routeopt,
  };

  const names = routes.names[collection];
  names[name] = name;

  const keys = routes.keys[collection];
  keys[name] = `${collection}.${name}`;
}

const optLight = {
  status: 'light-content',
};
const optDark = {
  status: 'dark-content',
};

addRoute('app', 'splash', Splash, optDark);
addRoute('app', 'sign', Sign.Sign, optLight);
addRoute('app', 'home', Home, optDark);
addRoute('app', 'recent', Recent, optLight);
addRoute('app', 'livelist', Livelist, optLight);
addRoute('app', 'songlist', Songlist, optLight);
addRoute('app', 'songlist2', Songlist2, optLight);
addRoute('app', 'search', Search, optLight);
addRoute('app', 'wallet', Wallet, optLight);
addRoute('app', 'chat', Chat.Chat, optDark);
addRoute('app', 'chatUsers', Chat.Users, optLight);
addRoute('app', 'chatInvite', Chat.Invite, optLight);

const transition = (navkey, otherProps) => () => ({
  screenInterpolator: (screenProps) => {
    const { animation } = routes.states[navkey];

    if (animation === 'fade') {
      return NavigationInterpolator.forFade(screenProps);
    } else if (animation === 'vertical') {
      return CardStackStyleInterpolator.forVertical(screenProps);
    } else if (animation === 'horzinv') {
      return NavigationInterpolator.forHorizontalInverse(screenProps);
    } else if (animation === 'vertinv') {
      return NavigationInterpolator.forVerticalInverse(screenProps);
    } else if (animation === 'slidehorz') {
      return NavigationInterpolator.forSlideHorz(screenProps);
    } else if (animation === 'slidehorzinv') {
      return NavigationInterpolator.forSlideHorzInverse(screenProps);
    } else if (animation === 'slidevert') {
      return NavigationInterpolator.forSlideVert(screenProps);
    } else if (animation === 'slidevertinv') {
      return NavigationInterpolator.forSlideVertInverse(screenProps);
    } else if (animation === 'noanim') {
      return NavigationInterpolator.forNoAnim(screenProps);
    }
    return CardStackStyleInterpolator.forHorizontal(screenProps);
  },
  ...otherProps,
});

Navigators.App = createStackNavigator(routes.configs.app, {
  headerMode: 'none',
  transitionConfig: transition(routes.navkeys.app),
  navigationOptions: { gesturesEnabled: false },
  onTransitionStart: (t) => {
    const { route } = t.scene;
    route.params && route.params.onTransitionStart && route.params.onTransitionStart();

    const opt = routes.options.app[route.routeName];
    if (opt && opt.status && sizes.is_ios) StatusBar.setBarStyle(opt.status);
  },
  onTransitionEnd: (t) => {
    const { route } = t.scene;
    route.params && route.params.onTransitionEnd && route.params.onTransitionEnd();

    const opt = routes.options.app[route.routeName];
    if (opt && opt.status && sizes.is_ios) StatusBar.setBarStyle(opt.status);
  },
});

StatusBar.setBarStyle('dark-content');

export default {
  app: routes.configs.app,
};
