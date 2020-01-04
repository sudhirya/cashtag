import { bs } from '@theme';

export default {
  container: {
    ...bs.match_parent,
  },

  drawer: {
    drawer: {
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
  },

  drop: {
    title: {
      fontSize: 16,
      textAlign: 'left',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: 'transparent',
    },
    messages: {
      fontSize: 14,
      textAlign: 'left',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: 'transparent',
    },
  },
};
