import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Invite.render';
import methodMixin from './Invite.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Invite = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
