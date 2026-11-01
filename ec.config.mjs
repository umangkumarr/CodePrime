// Expressive Code options live here (not in astro.config) so the <Code> component can load them.
import {defineEcConfig} from '@astrojs/starlight/expressive-code';
import {pluginLineNumbers} from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  themes: ['github-dark-default', 'github-light-default'],
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: true,
    overridesByLang: {
      'bash,sh,shell,text,txt,plaintext': {showLineNumbers: false},
    },
  },
  styleOverrides: {
    borderRadius: '12px',
    borderColor: 'var(--cp-border)',
    codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
    codeFontSize: '0.86rem',
    uiFontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    frames: {
      shadowColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'var(--cp-accent)',
      editorActiveTabIndicatorBottomColor: 'transparent',
    },
  },
});
