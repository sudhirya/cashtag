import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Channels.render';
import methodMixin from './Channels.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Channels = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({ // eslint-disable-line
  sources: state.main.view.sources,
  channellist: state.main.view.channellist
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
