// Laadt fonts, alle thema's en de referentie-CSS; thema en kleurmodus via de toolbar.
import '@doubleup/fonts/archivo.css';
import '@doubleup/fonts/mona-sans.css';
import '@doubleup/fonts/bricolage-grotesque.css';
import '@doubleup/fonts/source-serif-4.css';
import '@doubleup/tokens/css/all-themes.css';
import '@doubleup/css';
import './preview.css';

const THEMES = ['doubleup', 'showcase-blauw', 'showcase-oranje', 'voorbeeld'];

/** @type { import('@storybook/html-vite').Preview } */
export default {
  globalTypes: {
    theme: {
      description: 'Thema',
      toolbar: { title: 'Thema', icon: 'paintbrush', items: THEMES, dynamicTitle: true },
    },
    mode: {
      description: 'Kleurmodus',
      toolbar: {
        title: 'Modus',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Licht', icon: 'sun' },
          { value: 'dark', title: 'Donker', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'doubleup', mode: 'light' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: { storySort: { order: ['Introductie', 'Componenten', 'Voorbeelden', '*'] } },
  },
  decorators: [
    (story, { globals }) => {
      const wrap = document.createElement('div');
      wrap.className = 'dup-document sb-dup-frame';
      wrap.dataset.theme = globals.theme ?? 'doubleup';
      wrap.dataset.colorScheme = globals.mode ?? 'light';
      const content = story();
      if (typeof content === 'string') wrap.innerHTML = content;
      else wrap.append(content);
      return wrap;
    },
  ],
};
