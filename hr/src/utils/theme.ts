const collapse = computed(() => localStorage.getItem('collapse') || '1');

export const getDarkColor = (color: string, level: number) => {
  const rgbc: any = HexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

export const getLightColor = (color: string, level: number) => {
  const rgbc: any = HexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

export const HexToRgb = (str: string) => {
  str = str.replace("#", "");
  const hxs: any = str.match(/../g);
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
  return hxs;
}

export const RgbToHex = (a: any, b: any, c: any) => {
  const hexs = [a.toString(16), b.toString(16), c.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
  return "#" + hexs.join("");
}

export const setTheme = () => {
  const color_config: Object = {
    '--el-color-primary': '#0064ff',
    '--el-color-primary-light-3': '#327AED',
    '--el-color-primary-dark-2': '#004BC5',
    '--el-color-primary-light-7': '#0064FF',
    '--el-color-primary-light-9': '#fff',
    '--el-button-hover-bg-color': '#004bc51a',
    '--el-disabled-bg-color': '#f8f8f9',
    '--el-disabled-text-color': '#666666',
    '--el-disabled-border-color': '#e5e5e5',
    '--el-color-info': '#666666',
    '--el-fill-color-light': '#f8f8f9'
  };
  document.documentElement.style.setProperty('--left-menu-width', collapse.value === '1' ? '230px' : '60px');
  Object.keys(color_config).forEach((key: string) => {
    document.documentElement.style.setProperty(key, color_config[key]);
  });
};

export const setDarkTheme = (color: string) => {
  document.documentElement.style.setProperty('--menuFocus', getLightColor(color, 0.8) as string);
  document.documentElement.style.setProperty('--menuActived', getLightColor(color, 0.9) as string);
};

export const rSetDarkTheme = () => {
  document.documentElement.style.setProperty('--menuFocus', '#d4deec');
  document.documentElement.style.setProperty('--menuActived', '#f0f3f7');
};