import { Animated } from 'react-native';
// import { handler } from '@redux';
// import { routeNames } from '@routes';
// import gs from '@common/states';
// import apis from '@lib/apis';
import { sizes } from '@theme';
// const { navigation } = handler;

function methodMixin(Component) {
  return class Method extends Component {
    state = {
      animScroll: new Animated.Value(0),
      contentSize: 0,
      listHeight: 0,
      listWidth: 0,
    }
    animScrollCB = Animated.event([{
      contentOffset: { y: this.state.animScroll },
    }]);

    onPressItem = (item, row, index) => {
      const songIndex = row * sizes.song_in_row + index;
      this.props.onPressItem && this.props.onPressItem(item, songIndex);
    }
    onLongPressItem = (item, row, index) => {
      const songIndex = row * sizes.song_in_row + index;
      this.props.onLongPressItem && this.props.onLongPressItem(item, songIndex);
    }

    onEndReached = () => {
      this.props.onLoadMore && this.props.onLoadMore();
    }

    onScroll = ({ nativeEvent: ev }) => {
      this.animScrollCB(ev);
      this.props.onListPos && this.props.onListPos(ev.contentOffset.y);
    }
    onContentSizeChange = (w, h) => {
      if (this.state.contentSize !== h) {
        this.setState({ contentSize: h });
      }
    }
    onLayout = ({ nativeEvent: ev }) => {
      if (this.state.listWidth !== ev.layout.width || this.state.listHeight !== ev.layout.height) {
        this.setState({ listWidth: ev.layout.width, listHeight: ev.layout.height });
      }
    }

    _buildSongs = () => {
      const itemInRow = sizes.song_in_row;

      const chunk = (arr, n) =>
        Array.from(Array(Math.ceil(arr.length / n)), (temp, i) => arr.slice(i * n, (i * n) + n));
      const rows = chunk(this.props.songs, itemInRow);

      if (rows.length) {
        const lastRow = rows[rows.length - 1];
        for (let i = 0; lastRow.length < itemInRow; i += 1) {
          lastRow.push(null);
        }
      }
      return rows;
    }
  };
}

export default methodMixin;
