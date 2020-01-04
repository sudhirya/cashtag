import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Featured.render';
import methodMixin from './Featured.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Featured = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({ // eslint-disable-line
  fsources: state.main.view.fsources,
  channellist: state.main.view.channellist
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Featured);
