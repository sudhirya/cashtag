import React from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from '@redux';
import renderMixin from './Header.render';
import methodMixin from './Header.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Header = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  viewType: state.main.view.type,
  search: state.main.search,
  buttonFlag: state.main.buttonFlag,
  playerFlag: state.main.playerFlag
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
