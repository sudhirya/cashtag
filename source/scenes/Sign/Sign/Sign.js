import React from 'react';
import { connect } from 'react-redux';
import { handler } from '@redux';
// import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
// import meteor from '@lib/meteor';
import renderMixin from './Sign.render';
import methodMixin from './Sign.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.swiperslidenumber >= 0) {
      this._swiper && this._swiper.scrollBy((nextProps.swiperslidenumber - 1) - this._swiper.state.index, true);
      handler.main.view.swiperslidenumber(-1);
      this.forceUpdate();
    }

    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Sign = renderMixin(methodMixin(Component));

const mapStateToProps = state => {
  return ({
    sizeFlag: state.main.sizeFlag,
    swiperslidenumber: state.main.view.swiperslidenumber
  });
}

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

// const SignMeteor = createContainer(() => ({
// }), Sign);

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
