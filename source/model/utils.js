import moment from 'moment';

export default class utils {
  static getTodayPriceFromVenue(venue) {
    const specials = (venue.Specials && venue.Specials[0]) || {};
    const amount = specials.amount || [];
    const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dow = dows[moment(new Date()).format('e')] || 'Mon';
    return amount[dow];
  }
}
