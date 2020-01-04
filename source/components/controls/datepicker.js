import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { shallowEqual } from '@redux';

export default class DatePicker extends React.Component {
  state = {
    visible: false,
    date: new Date(),
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  callback = null;
  date = null;
  open = (date, callback) => {
    this.callback = callback;
    this.state.date = new Date();
    this.setState({ date: date || this.state.date, visible: true });
  }

  close = () => {
    this.setState({ visible: false });
  }

  onConfirm = (date) => {
    this.date = date;
    this.close();
    this.props.onConfirm && this.props.onConfirm(date);
  }
  onHideConfirm = () => {
    this.callback && this.callback(this.date);
  }
  onCancel = () => {
    this.close();
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    const { isVisible, onConfirm, onCancel, ...otherProps } = this.props;

    return (
      <DateTimePicker
        isVisible={this.state.visible}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        onHideAfterConfirm={this.onHideConfirm}
        date={this.state.date}
        {...otherProps}
      />
    );
  }
}
