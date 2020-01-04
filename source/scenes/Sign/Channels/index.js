import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Image } from '@components/controls';
import FIcon from 'react-native-vector-icons/Feather';
import { shallowEqual, handler } from '@redux';
import { bs, sizes, images } from '@theme';
import styles from './styles';
import {ChannelCategories} from './Categories';
import {Featured} from './Featured';
import {Channels} from './Channels';
import g from '@common/global';
import gs from '@common/states';
const { navigation } = handler;
import { routes } from '@routes';

class ChannelsView extends React.Component {

  /*
   *
   */
  _goToProfile = async () => {
    if (g.isEmpty(gs.user.handle)) {
      handler.main.view.swiperslidenumber(2);
      this.forceUpdate();
    } else navigation.navigate({ name: routes.names.app.home, key: routes.keys.app.home, animation: 'fade' });
  }

  /*
  *
  */
  render () {
    const clrBolt = '#000';
    const szIcon = sizes.em(16);
    const imageBolt = images.ic_live_video_on;

    return (
      <View style={styles.container} >
        <ChannelCategories/>
        <Featured/>
        <Channels/>

          <Button bheight={sizes.em(40)} bbackground="yellow" bradius={sizes.pad1}
            bstyle={[bs.center, bs.ml_2x, bs.mr_2x]} onPress={this._goToProfile} >
            <Text semibold color="#000000" size={16} >GO
              <Image contain width={szIcon} height={szIcon} tint={clrBolt} source={imageBolt} />
            </Text>
          </Button>

      </View>
    );
  }
}

export default ChannelsView;
