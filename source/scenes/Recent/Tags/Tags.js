import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Tags.render';
import methodMixin from './Tags.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Tags = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({ // eslint-disable-line
  sources: state.main.view.sources,
  fsources: state.main.view.fsources,
  channellist: state.main.view.channellist
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
