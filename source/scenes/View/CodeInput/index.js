import React from 'react';
import PropTypes from 'prop-types';
import { View, TextInput } from 'react-native';
import { shallowEqual } from '@redux';
import { bs, sizes } from '@theme';
import g from '@common/global';
import _ from 'lodash';
import styles from './styles';

class CodeInput extends React.Component {
  static propTypes = {
    inputComponent: PropTypes.func,
		codeLength: PropTypes.number,
    autoFocus: PropTypes.bool,
    activeColor: PropTypes.string,
		inactiveColor: PropTypes.string,
    inputBorder: PropTypes.number,
    inputRadius: PropTypes.number,
    inputWidth: PropTypes.number,
		inputHeight: PropTypes.number,
    inputSize: PropTypes.number,
    inputSpace: PropTypes.number,
    inputStyle: PropTypes.object,

    onFullfill: PropTypes.func,
    onChange: PropTypes.func,
	}

	static defaultProps = {
    inputComponent: TextInput,
		codeLength: 6,
    autoFocus: false,
    activeColor: 'rgba(200, 200, 200, 1)',
		inactiveColor: 'rgba(150, 150, 150, 1)',
    inputBorder: sizes.em(3),
    inputRadius: sizes.em(18),
    inputWidth: sizes.em(45),
		inputHeight: sizes.em(90),
    inputSize: sizes.em(40),
    inputSpace: sizes.em(6),
    inputStyle: null,

    onFullfill: () => {},
    onChange: () => {},
	}

  constructor(props) {
		super(props);

		this.codeInputRefs = new Array(props.codeLength).fill(null);
		this.state = {
			codeArr: new Array(props.codeLength).fill(''),
			currentIndex: 0,
		};
	}

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, 4) || !shallowEqual(nextState, this.state, 4);
  }

  /**
   * helper functions
   */
  clear = () => {
    this._changeValue(new Array(this.props.codeLength).fill(''), 0);
    this._setFocus(0);
  }

  changeValue = (codeArr, currentIndex) => {
    this.props.onChange && this.props.onChange(codeArr.join(''));
    this.setState({ codeArr, currentIndex });
  }

  focus = () => this._setFocus(this.state.currentIndex)
  blur = () => this._blur(this.state.currentIndex)

  _setFocus = index => this.codeInputRefs[index].focus()
  _blur = index => this.codeInputRefs[index].blur()

  /**
   * action handlers
   */
  _onFocus = index => () => {
    const { codeArr } = this.state;
    const currentEmptyIndex = codeArr.findIndex(c => !c);
    if (currentEmptyIndex >= 0 && currentEmptyIndex < index) {
      return this._setFocus(currentEmptyIndex);
    }
    const newCodeArr = codeArr.map((v, i) => (i < index ? v : ''));

    this.changeValue(newCodeArr, index);
    return null;
  }
  _onInputCode = index => (character) => {
    const { codeLength, onFullfill } = this.props;
    const newCodeArr = this.state.codeArr.slice(0);
    newCodeArr[index] = character;

    if (index === codeLength - 1) {
      const code = newCodeArr.join('');
      onFullfill && onFullfill(code);
      this._blur(this.state.currentIndex);
    } else {
      this._setFocus(this.state.currentIndex + 1);
    }

    this.changeValue(newCodeArr, this.state.currentIndex + 1);
  }
  _onKeyPress = (e) => {
    const curTime = new Date().getTime();
    const befTime = this.keyTime;
    this.keyTime = curTime;
    if (curTime - befTime < 100) return;

    if (e.nativeEvent.key === 'Backspace') {
      const { currentIndex } = this.state;
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      this._setFocus(nextIndex);
    }
  }

  /**
   * render function
   */
  render () {
    const {
      style, codeLength, autoFocus, activeColor, inactiveColor,
      inputBorder, inputRadius, inputWidth, inputHeight, inputSize, inputSpace, inputStyle,
      ...otherProps
    } = this.props;
    const InputComponent = this.props.inputComponent;

    const codeInputs = _.range(codeLength).map(id => (
			<InputComponent
				key={id} ref={node => this.codeInputRefs[id] = node}
				selectionColor={activeColor} returnKeyType="done"
        style={[bs.f_borderRadius(inputRadius), bs.f_borderWidth(inputBorder),
          bs.f_borderColor(this.state.currentIndex === id ? activeColor : inactiveColor),
          bs.f_width(inputWidth || inputSize), bs.f_height(inputHeight || inputSize), bs.f_mh(inputSpace / 2),
          styles.codeInput, inputStyle,
        ]}
        {...otherProps}
        autoFocus={autoFocus && id === 0} maxLength={1} keyboardType="number-pad"
        value={g.ifEmpty(this.state.codeArr[id], '')}
				onFocus={this._onFocus(id)} onChangeText={this._onInputCode(id)} onKeyPress={this._onKeyPress}
			/>
		));

    return (
      <View style={[styles.container, style]} >
        { codeInputs }
      </View>
    );
  }
}

export default CodeInput;
