import { NavigationActions } from '@components/navigation';
import { routes as routeConfig } from '@routes';

const defnav = 'root';

export default {
  pushRoute: (route, params, navkey = defnav) =>
    NavigationActions.pushRoute(route, navkey),

  popRoute: (navkey = defnav) =>
    NavigationActions.popRoute(navkey),

  popToIndex: (routeIndex, navkey = defnav) =>
    NavigationActions.popToIndex(routeIndex, navkey),

  popTo: (routeKey, navkey = defnav) =>
    NavigationActions.popTo(routeKey, navkey),

  popN: (count, navkey = defnav) =>
    NavigationActions.popN(count, navkey),

  jumpToIndex: (routeIndex, navkey = defnav) =>
    NavigationActions.jumpToIndex(routeIndex, navkey),

  jumpTo: (routeKey, navkey = defnav) =>
    NavigationActions.jumpTo(routeKey, navkey),

  reset: (routes, index, navkey = defnav) =>
    NavigationActions.reset(routes, index, navkey),

  replace: (route, params, navkey = defnav) =>
    NavigationActions.replace(route, navkey),

  replaceAt: (routeKey, replaceRoute, params, navkey = defnav) =>
    NavigationActions.replaceAt(routeKey, replaceRoute, navkey),

  replaceAtIndex: (index, replaceRoute, params, navkey = defnav) =>
    NavigationActions.replaceAtIndex(index, replaceRoute, navkey),

  back: (navkey = defnav) =>
    NavigationActions.back(navkey),

  forward: (navkey = defnav) =>
    NavigationActions.forward(navkey),

  // navigate: (payload, navkey = defnav) =>
  //   NavigationActions.navigate(payload, navkey),
  navback: (payload, navkey = defnav) =>
    NavigationActions.navback(payload, navkey),
  navinit: (payload, navkey = defnav) =>
    NavigationActions.navinit(payload, navkey),
  navreset: (payload, navkey = defnav) =>
    NavigationActions.navreset(payload, navkey),
  navuri: (payload, navkey = defnav) =>
    NavigationActions.navuri(payload, navkey),
  navSetParams: (payload, navkey = defnav) =>
    NavigationActions.setParams(payload, navkey),

  navigate: ({
    type, name, key, route, index, params, routes, navkey, animation,
    routeName, routeKey, ...payload
  }) => {
    routeConfig.states[navkey || defnav].animation = animation;

    switch (type || 'navigate') {
      case 'navigate':
        return NavigationActions.navigate({
          routeName: name || routeName,
          key: key || routeKey,
          params,
          ...payload,
        }, navkey);

      case 'push':
        if (route) {
          return NavigationActions.pushRoute(route, navkey);
        } else if (name || routeName) {
          return NavigationActions.pushRoute({
            routeName: name || routeName, key: key || routeKey, ...payload,
          }, navkey);
        }
        break;
      case 'pop':
        if (typeof index !== 'undefined' && index !== null) {
          return NavigationActions.popToIndex(index, navkey);
        }
        return NavigationActions.popRoute(navkey);
      case 'popTo':
        return NavigationActions.popTo(key || routeKey, navkey);
      case 'back':
        return NavigationActions.navback(payload, navkey);

      case 'reset':
        if (routes && index) {
          return NavigationActions.reset(routes, index, navkey);
        } else if ((name || routeName) && (key || routeKey)) {
          return NavigationActions.reset([{ routeName: name || routeName, key: key || routeKey }], 0, navkey);
        }
        break;

      default:
        break;
    }

    return {
      type: 'Unknown',
      payload: {},
    };
  },
};
