const COLORS = {
  'default-theme': '#1a237e',
  'mobi-theme': '#9b0000',
  'deeppurple-amber-theme': '#320b86',
  'pink-bluegrey-theme': '#b0003a',
  'purple-green-theme': '#6a0080'
};

function _setMetaContent(metaName: string, content: string) {
  const meta = document.querySelector(`meta[name=${metaName}]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    setTimeout(() => _setMetaContent(metaName, content), 1000);
  }
}

export function setMetaContent(metaName: string, theme: string) {
  const color = COLORS[theme];
  if (color) {
    setTimeout(() => setMetaContent(metaName, color), 1);
  }
}
