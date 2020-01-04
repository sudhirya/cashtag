import React from 'react';
import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import { shallowEqual } from '@redux';
import { sizes } from '@theme';
import styles from './picker.styles';

export default class ModalPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      selected: this.props.initValue,
      options: this.props.data || [],
      title: this.props.title || '',
      cancelText: this.props.cancelText || '',
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
  changed = false;
  item = null;
  index = null;
  open = (title, options, cancelText, callback) => {
    this.callback = callback;
    this.changed = false;
    this.setState({
      options,
      title,
      cancelText,
      modalVisible: true,
    });
  }
  close = () => {
    this.setState({
      modalVisible: false,
    });
  }

  onModalHide = () => {
    if (!this.changed) return;

    setTimeout(() => {
      this.callback && this.callback(this.item, this.index);
      this.props.onModalHide && this.props.onModalHide();
    }, 50);
  }

  onChange = (item, index) => {
    this.changed = true;
    this.item = item;
    this.index = index;

    this.setState({ selected: item }, () => {
      this.close();
      this.props.onChange && this.props.onChange(item, index);
    });
  }

  onContentSizeChange = (w, h) => {
    if (this.state.height !== h) {
      this.setState({ height: h });
    }
  }

  render() {
    const {
      data, onChange, onModalHide, initValue, title, titleStyle, titleTextStyle,
      modalStyle, optionStyle, optionTextStyle,
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

  renderOptionList() {
    const width = { width: this.props.width || sizes.em(320, 500) };
    const height = { height: this.state.height, maxHeight: this.props.height || sizes.em(480, 700) };
    const renderCancel = this.state.cancelText && this.state.cancelText.length ? this.renderCancel(width) : null;
    const renderTitle = this.state.title && this.state.title.length ? this.renderTitle() : null;

    return (
      <View style={[styles.modal, this.props.modalStyle]} >
        <View style={[styles.optionContainer, width]} >
          { renderTitle }

          <FlatList
            data={this.state.options}
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

  renderOption = ({ item, index }) => (
    <Option
      option={item} index={index}
      optionStyle={this.props.optionStyle} optionTextStyle={this.props.optionTextStyle}
      optionUnderlayColor={this.props.optionUnderlayColor}
      onPress={this.onChange.bind(this, item, index)}
    />
  )
  renderCancel = width => (
    <TouchableHighlight
      style={[styles.cancelStyle, this.props.cancelStyle, width]}
      underlayColor="#ebebeb"
      onPress={this.close}
    >
      <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
    </TouchableHighlight>
  )
  renderTitle = () => (
    <View style={[styles.titleStyle, this.props.titleStyle]} >
      <Text style={[styles.titleTextStyle, this.props.titleTextStyle]} >{this.state.title}</Text>
    </View>
  )
}

const Option = ({
  option, optionStyle, optionTextStyle, optionUnderlayColor, onPress,
}) => (
  <TouchableHighlight
    style={[styles.optionStyle, optionStyle]}
    underlayColor={optionUnderlayColor || '#ebebeb'}
    onPress={onPress}
  >
    <Text style={[styles.optionTextStyle, optionTextStyle]}>{option}</Text>
  </TouchableHighlight>
);

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
  optionUnderlayColor: '#ebebeb',
  cancelStyle: {},
  cancelTextStyle: {},
  cancelUnderlayColor: '#ebebeb',
  cancelText: 'Cancel',
};
