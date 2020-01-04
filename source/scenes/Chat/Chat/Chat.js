import React from 'react';
import { connect } from 'react-redux';
import { createContainer } from 'react-native-meteor';
import { shallowEqual } from '@redux';
import meteor from '@lib/meteor';
import renderMixin from './Chat.render';
import methodMixin from './Chat.method';

class Component extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }
}

const Chat = renderMixin(methodMixin(Component));

const mapStateToProps = state => ({
  sizeFlag: state.main.sizeFlag,
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

const ChatMeteor = createContainer(() => ({
  messages: meteor.roomMessages(),
  isTyping: meteor.roomTyping(),
}), Chat);

export default connect(mapStateToProps, mapDispatchToProps)(ChatMeteor);
