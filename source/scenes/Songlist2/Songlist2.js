import React from 'react';
import { connect } from 'react-redux';
// import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
// import meteor from '@lib/meteor';
import renderMixin from './Songlist2.render';
import methodMixin from './Songlist2.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Songlist2 = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

// const HomeMeteor = createContainer((props) => {
//
//   return {
//   };
// }, Home);

export default connect(mapStateToProps, mapDispatchToProps)(Songlist2);
