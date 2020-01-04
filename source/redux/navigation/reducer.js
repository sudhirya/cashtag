import { navigationReducer } from '@components/navigation';
import { Navigators, routes } from '@routes';

function generateReducer(Navigator, routeName, routeKey, navkey) {
  const getState = Navigator.router.getStateForAction;
  const initState = getState(Navigator.router.getActionForPathAndParams(routeName));

  if (routeKey) initState.routes[0].key = routeKey;

  return navigationReducer({ ...initState, navkey }, getState);
}

const navApp = generateReducer(Navigators.App, routes.names.app.splash, routes.keys.app.splash, routes.navkeys.app);

export default {
  navApp,
};
