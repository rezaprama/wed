export const defaultTheme = {
  colors: { background: '#f7f1f9', text: '#3d1c47', accent: '#7b2f91' },
  fontSizes: { body: 16, heading: 28, title: 52 },
};

const luminance = hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
export function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + .05) / (dark + .05);
}

export function resolveTheme(config) {
  const provided = config.theme ?? {};
  const object = (value, path, keys) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path}: use an object.`);
    for (const key of Object.keys(value)) if (!keys.includes(key)) throw new Error(`${path}.${key}: unknown setting. Keep the three named settings.`);
  };
  if (config.theme === null) throw new Error('theme: use an object.');
  object(provided, 'theme', ['colors', 'fontSizes']);
  const result = {};
  for (const group of ['colors', 'fontSizes']) {
    const values = provided[group] ?? {};
    if (provided[group] === null) throw new Error(`theme.${group}: use an object.`);
    object(values, `theme.${group}`, Object.keys(defaultTheme[group]));
    result[group] = { ...defaultTheme[group], ...values };
  }
  for (const [key, color] of Object.entries(result.colors)) {
    if (typeof color !== 'string' || !/^#[a-f0-9]{6}$/i.test(color)) throw new Error(`theme.colors.${key}: use a six-digit color such as #7b2f91.`);
    result.colors[key] = color.toLowerCase();
  }
  for (const key of ['text', 'accent']) if (contrast(result.colors[key], result.colors.background) < 4.5) throw new Error(`theme.colors.${key}: too hard to read. Choose a darker color on a light background, or a lighter color on a dark background (contrast at least 4.5:1).`);
  const bounds = { body: [16, 20], heading: [24, 40], title: [40, 64] };
  for (const [key, [min, max]] of Object.entries(bounds)) {
    const value = result.fontSizes[key];
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`theme.fontSizes.${key}: enter a whole number from ${min} to ${max}, without px.`);
  }
  if (!(result.fontSizes.body < result.fontSizes.heading && result.fontSizes.heading < result.fontSizes.title)) throw new Error('theme.fontSizes: body must be smaller than heading, and heading smaller than title.');
  return result;
}

export function applyTheme(css, config) {
  const theme = resolveTheme(config);
  const tokens = { paper: theme.colors.background, ink: theme.colors.text, accent: theme.colors.accent, 'text-body': `${theme.fontSizes.body}px`, 'text-heading': `${theme.fontSizes.heading}px`, 'text-title': `${theme.fontSizes.title}px` };
  for (const [key, value] of Object.entries(tokens)) {
    const pattern = new RegExp(`(--${key}\\s*:)\\s*[^;]+;`, 'g');
    if ([...css.matchAll(pattern)].length !== 1) throw new Error(`Stylesheet must declare --${key} exactly once.`);
    css = css.replace(pattern, `$1 ${value};`);
  }
  return css;
}

export function themeSvg(svg, config) {
  if (!/<svg\b[^>]*data-wed-placeholder="true"/.test(svg)) return svg;
  const colors = resolveTheme(config).colors;
  const replacements = new Map(Object.entries(defaultTheme.colors).map(([key, value]) => [value, colors[key]]));
  return svg.replace(/#[a-f0-9]{6}\b/gi, color => replacements.get(color.toLowerCase()) || color);
}
