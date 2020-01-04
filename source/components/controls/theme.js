import standard from './themes/standard';

function style(name) {
  return this[name] || standard[name];
}

function getTheme(type) {
  let theme = standard;

  if (type === 'std' || type === 'standard') {
    theme = standard;
  }

  theme.style = style.bind(theme);
  return theme;
}

export {
  getTheme,
};
