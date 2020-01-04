import React from 'react';
import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import { shallowEqual } from '@redux';
import { sizes } from '@theme';
import styles from './picker.styles';

const Option = ({
  option, optionStyle, optionTextStyle, onPress,
}) => (
  <TouchableHighlight
    style={[styles.optionStyle, optionStyle]}
    underlayColor="#ebebeb"
    onPress={onPress}
  >
    <Text style={[styles.optionTextStyle, optionTextStyle]}>{option}</Text>
  </TouchableHighlight>
);

export default class ModalPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      selected: this.props.initValue,
      height: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue !== this.props.initValue) {
      this.state.selected = nextProps.initValue;
    }
  }

  callback = null;
  item = null;
  index = null;
  changed = false;
  onChange = (item, index) => {
    this.changed = true;
    this.item = item;
    this.index = index;

    this.setState({ selected: item }, () => {
      this.close();
      this.props.onChange && this.props.onChange(item, index);
    });
  }
  onModalHide = () => {
    if (!this.changed) return;

    setTimeout(() => {
      this.callback && this.callback(this.item, this.index);
      this.props.onModalHide && this.props.onModalHide();
    }, 50);
  }

  close = () => {
    this.setState({
      modalVisible: false,
    });
  }

  open = (callback) => {
    this.callback = callback;
    this.changed = false;
    this.setState({
      modalVisible: true,
    });
  }

  onContentSizeChange = (w, h) => {
    if (this.state.height !== h) {
      this.setState({ height: h });
    }
  }

  renderOption = ({ item, index }) => (
    <Option
      option={item} index={index}
      optionStyle={this.props.optionStyle}
      optionTextStyle={this.props.optionTextStyle}
      onPress={this.onChange.bind(this, item, index)}
    />
  )

  renderOptionList() {
    const width = { width: this.props.width || sizes.em(320, 500) };
    const height = { height: this.state.height, maxHeight: this.props.height || sizes.em(480, 700) };
    const renderCancel = this.props.cancelVisible && (
      <TouchableHighlight
        style={[styles.cancelStyle, this.props.cancelStyle, width]}
        underlayColor="#ebebeb"
        onPress={this.close}
      >
        <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
      </TouchableHighlight>
    );
    const renderTitle = this.props.title && (
      <View style={[styles.titleStyle, this.props.titleStyle]} >
        <Text style={[styles.titleTextStyle, this.props.titleTextStyle]} >{this.props.title}</Text>
      </View>
    );

    return (
      <View style={[styles.modal, this.props.modalStyle]} >
        <View style={[styles.optionContainer, width]} >
          { renderTitle }

          <FlatList
            data={this.props.data}
            keyExtractor={(item, index) => `option_${index}`}
            renderItem={this.renderOption}
            style={[styles.optionList, height]}
            onContentSizeChange={this.onContentSizeChange}
            bounces={false}
          />
        </View>

        { renderCancel }
      </View>
    );
  }

  render() {
    const {
      data, onChange, onModalHide, initValue, title, titleStyle, titleTextStyle,
      modalStyle, optionStyle, optionTextStyle, cancelVisible,
      cancelStyle, cancelTextStyle, cancelText, style,
      ...otherProps
    } = this.props;

    return (
      <Modal
        isVisible={this.state.modalVisible}
        style={[styles.container, style]}
        onModalHide={this.onModalHide}
        {...otherProps}
      >
        {this.renderOptionList()}
      </Modal>
    );
  }
}

ModalPicker.defaultProps = {
  data: [],
  onChange: () => {},
  initValue: 'Select me!',
  title: 'Select',
  titleStyle: null,
  titleTextStyle: null,
  modalStyle: null,
  optionStyle: {},
  optionTextStyle: {},
  cancelVisible: true,
  cancelStyle: {},
  cancelTextStyle: {},
  cancelText: 'Cancel',
};
