import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
import meteor from '@lib/meteor';
import renderMixin from './Users.render';
import methodMixin from './Users.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Users = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

const UsersMeteor = createContainer(() => ({
  subscriptions: meteor.subscriptions(),
}), Users);

export default connect(mapStateToProps, mapDispatchToProps)(UsersMeteor);
