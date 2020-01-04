import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon } from '@components/controls';
import { bs, sizes, colors } from '@theme';
import gs from '@common/states';
import _ from 'lodash';
import styles from './Wallet.styles';

function renderMixin(Component) {
  return class Render extends Component {
    render() {
      return (
        <View style={styles.container} >
          { this._renderHeader() }
          { this._renderContent() }
        </View>
      );
    }

    _renderHeader = () => (
      <View style={styles.headerbar}>
        <View style={styles.sidebar}>
          <Button onPress={this._onPressCash} style={styles.btn_cash}>
            <Text>WALLET</Text>
          </Button>
        </View>

        <Button onPress={this._onPressClose} style={styles.btn_close}>
          <Icon name="io md-close" size={24} color={colors.text} />
        </Button>

        <View style={styles.sidebar}>
          <Button onPress={this._onPressLogout} style={styles.btn_logout}>
            <Text>LOGOUT</Text>
          </Button>
        </View>
      </View>
    )

    _renderContent = () => (
      <View style={styles.content} >
        {this._renderOpenCards()}
        {this._renderNewWalletHeader()}
        {this._renderCloseTabs()}
        {this._renderTabContent()}
      </View>
    )

    _renderOpenCards = () => {
      const { cards } = gs.user;
      const openCard = _.find(cards, card => card._id === this.state.card);
      if (!openCard) return null;

      const bgColor = { backgroundColor: openCard.color };

      if(openCard.name === 'CASHGRAM') {
        return (
          <Button style={[styles.open_card, bgColor]} onPress={this._onPressOpenCard.bind(this, openCard)} >
            <View style={styles.open_card_head} >
              <View flexDirection="row" height={90}>
                <Text style={[bs.font_stink]} color="#fff" size={62} >Cas</Text>
                <View marginLeft={-3}>
                  <Text style={[bs.font_stink]} color="#fff" size={62} >hgram</Text>
                </View>
              </View>
              <View style={[bs.center]} >
                <Icon name="io md-card" size={34} color={colors.text} />
                <Text size={14} color={colors.text} style={styles.semi_bold}>{' '}{this.getWalletPoints(openCard)}</Text>
              </View>
            </View>
            <View style={styles.open_card_foot}>
              <View style={[bs.flex_row]}>
                <Text medium size={20} color={colors.text} >••••{'   '}••••{'   '}••••{'  '}</Text>
                <Text medium size={20} color={colors.text} >{openCard.number}</Text>
              </View>
              <Text semibold size={22} color={colors.text} >{openCard.type}</Text>
            </View>
          </Button>
        );

      } else {
        return (
          <Button style={[styles.open_card, bgColor]} onPress={this._onPressOpenCard.bind(this, openCard)} >
            <View style={styles.open_card_head} >
              <Text size={22} color={colors.text} style={styles.semi_bold}>
                {openCard.name}
              </Text>
              <View style={[bs.center]} >
                <Icon name="io md-card" size={34} color={colors.text} />
                <Text size={14} color={colors.text} style={styles.semi_bold}>{' '}{this.getWalletPoints(openCard)}</Text>
              </View>
            </View>
            <View style={styles.open_card_foot}>
              <View style={[bs.flex_row]}>
                <Text medium size={20} color={colors.text} >••••{'   '}••••{'   '}••••{'  '}</Text>
                <Text medium size={20} color={colors.text} >{openCard.number}</Text>
              </View>
              <Text semibold size={22} color={colors.text} >{openCard.type}</Text>
            </View>
          </Button>
        );
      }
    }

    _renderNewWalletHeader = () => (
      <View style={styles.add_wallet}>
        <View style={styles.add_wallet_left}>
          <Text size={18} color={colors.text} >Wallets</Text>
        </View>
        <Button style={styles.add_wallet_right} >
          <Icon name="io md-add-circle" size={36} color="#ddd" />
        </Button>
      </View>
    );

    _renderCloseTabs = () => {
      return (
        <View style={styles.tabbar} >
          { this._renderTabButton('#SOCIAL', 'SOCIAL') }
          { this._renderTabButton('#FINANCE', 'FINANCE') }
          { this._renderTabButton('#APPS', 'APPS') }
        </View>
      );
    }

    _renderTabContent = () => {
      // const isStream = this.state.tab === '#SHARED';
      // const isDMS = this.state.tab === '#DMS';
      // const isPlaylist = this.state.tab === '#PLAYLIST';
      // const isSonglist = !isStream && !isPlaylist;
      // const isFire = this.state.tab === '#FIRE';

      return (
        <View style={[styles.content]} >
          { this._renderCloseCards() }
        </View>
      );
    }

    _renderTabButton = (tab, text) => {
      // let renderImage = null;
      // if (tab === '#STREAM') {
      //   renderImage = (
      //     <View width={sizes.em(26)} height={sizes.em(26)}><Text bold size={sizes.em(26)}>#</Text></View>
      //   );
      // } else if (tab === '#DMS') {
      //   renderImage = <FIcon name="send" color={colors.text} size={22} onPress={this._onPressChat} />;
      // } else if (tab === '#SHARED') {
      //   renderImage = <Image contain width={sizes.em(26)} height={sizes.em(25)} source={images.ic_live_audio_on} />;
      // } else if (tab === '#FIRE') {
      //   renderImage = <Image contain width={sizes.em(26)} height={sizes.em(25)} source={images.ic_fuego} />;
      // } else if (tab === '#PLAYLIST') {
      //   renderImage = <FIcon name="server" size={22} color="#fff" />;
      // }
      return (
        <Button
          style={styles.btn_tab}
          onPress={this._onPressTab.bind(this, tab)} >
            { /* renderImage */ }
            <View style={[styles.line_tab_active, bs.mt_1x, { opacity: this.state.tab === tab ? 1 : 0 }]} />
            <Text size={15} color="#fff" style={bs.mt_1x}>{text}</Text>
        </Button>
      )
    }

    _renderCloseCards = () => {
      if(this.state.tab === '#APPS') var { cards } = gs.user;
      else if (this.state.tab === '#FINANCE') {
        var cards = [{
          color: "#00D86C",
          name: "BTC",
          number: 8157,
          points: 0,
          type: "CRYPTO",
          _id: "btc"
        },
        {
          color: "#29A9D0",
          name: "ETH",
          number: 8157,
          points: 0,
          type: "CRYPTO",
          _id: "eth"
        },
        {
          color: "#F44336",
          name: "TEZOS",
          number: 8157,
          points: 0,
          type: "CRYPTO",
          _id: "tezos"
        },
        {
          color: "#FF7C30",
          name: "TRON",
          number: 8157,
          points: 0,
          type: "CRYPTO",
          _id: "tron"
        },
        {
          color: "#00D86C",
          name: "CELER",
          number: 8157,
          points: 0,
          type: "DAPP",
          _id: "celer"
        }]
      } else if (this.state.tab === '#SOCIAL') {
        var cards = [{
          color: "#00D86C",
          name: "INSTAGRAM",
          number: 8157,
          points: 0,
          type: "SOCIAL",
          _id: "instaram"
        },
        {
          color: "#29A9D0",
          name: "TWITTER",
          number: 8157,
          points: 0,
          type: "SOCIAL",
          _id: "twitter"
        },
        {
          color: "yellow",
          textColor: 'black',
          name: "SNAPCHAT",
          number: 8157,
          points: 0,
          type: "SOCIAL",
          _id: "snapchat"
        }]
      }
      console.log(cards, 'cards')
      const viewCards = _.map(_.filter(cards, card => card._id !== this.state.card), (card, i) => {
        const bgColor = { backgroundColor: card.color };
        const style = (i === 0) ? styles.close_card : styles.close_card2;
        return (
          <Button key={card._id} style={[style, bgColor]} onPress={this._onPressCloseCard.bind(this, card)}>
            <View style={styles.close_card_head}>
              <View >
                <Icon name="io md-card" size={24} color={card.textColor ? card.textColor : colors.text} />
              </View>
              <View style={[bs.absolute_full, bs.center]}>
                <Text size={18} color={card.textColor ? card.textColor : colors.text} style={styles.semi_bold}>{card.name}</Text>
              </View>
              <View style={[bs.start_end]} marginTop={-14}>
                <Text size={14} color={card.textColor ? card.textColor : colors.text} style={styles.semi_bold}></Text>
                <Text size={18} color={card.textColor ? card.textColor : colors.text} style={styles.semi_bold}>{this.getWalletPoints(card)}</Text>
              </View>
            </View>
          </Button>
        );
      });

      return (
        <View style={styles.close_card_main}>
          { viewCards }
        </View>
      );
    }
  };
}

export default renderMixin;
