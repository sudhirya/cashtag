import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Home.render';
import methodMixin from './Home.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Home = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  view: state.main.view,
  search: state.main.search,
  sizeFlag: state.main.sizeFlag,
  listFlag: state.main.listFlag,
  playerFlag: state.main.playerFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
