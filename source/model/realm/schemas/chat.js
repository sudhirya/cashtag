export const ServerSchema = {
  name: 'Server',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    current: 'bool',
  },
};

export const SettingSchema = {
  name: 'Setting',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _server: 'Server',
    valueAsString: { type: 'string', optional: true },
    valueAsBoolean: { type: 'bool', optional: true },
    valueAsNumber: { type: 'int', optional: true },
  },
};

export const UserSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _server: 'Server',
    username: 'string',
    name: { type: 'string', optional: true },
    avatar: { type: 'string', optional: true },
    drink: { type: 'string', optional: true },
  },
};

export const SubscriptionSchema = {
  name: 'Subscription',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _server: 'Server',
    t: 'string',
    ts: { type: 'date', optional: true },
    ls: { type: 'date', optional: true },
    u: 'User',
    name: 'string',
    fname: { type: 'string', optional: true },
    rid: 'string',
    open: { type: 'bool', optional: true },
    alert: { type: 'bool', optional: true },
    unread: { type: 'int', optional: true },
    _updatedAt: { type: 'date', optional: true },
  },
};

export const MessageSchema = {
  name: 'Message',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    _server: 'Server',
    msg: { type: 'string', optional: true },
    image: { type: 'string', optional: true },
    rid: 'string',
    ts: 'date',
    u: 'User',
    alias: { type: 'string', optional: true },
    parseUrls: { type: 'bool', optional: true },
    groupable: { type: 'bool', optional: true },
    avatar: { type: 'string', optional: true },
    attachments: { type: 'list', objectType: 'Attachment' },
    _updatedAt: { type: 'date', optional: true },
    temp: { type: 'bool', optional: true },
  },
};

export const AttachmentSchema = {
  name: 'Attachment',
  properties: {
    description: { type: 'string', optional: true },

    image_size: { type: 'int', optional: true },

    image_type: { type: 'string', optional: true },

    image_url: { type: 'string', optional: true },
    title: { type: 'string', optional: true },

    title_link: { type: 'string', optional: true },
    title_link_download: { type: 'bool', optional: true },
    type: { type: 'string', optional: true },
  },
};
