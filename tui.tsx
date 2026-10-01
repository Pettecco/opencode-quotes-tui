import type { TuiPluginModule } from '@opencode-ai/plugin/tui';
import { QUOTES } from './quotes';

function pickQuote() {
  if (QUOTES.length === 0) return undefined;
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index];
}

export default {
  id: 'quotes',
  tui: async api => {
    api.kv.set('tips_hidden', true);

    const quote = pickQuote();
    if (!quote) return;

    api.slots.register({
      order: 0,
      slots: {
        home_footer: () => {
          const theme = api.theme.current;
          return (
            <box
              flexDirection="column"
              alignItems="center"
              width="100%"
              paddingTop={1}
              paddingBottom={3}
            >
              <box
                flexDirection="column"
                alignItems="center"
                maxWidth={75}
                paddingLeft={2}
                paddingRight={2}
              >
                <text fg={theme.text} wrapMode="word">
                  {quote.quote}
                </text>
                <text fg={theme.primary} marginTop={1}>
                  {quote.author}
                </text>
              </box>
            </box>
          );
        },
      },
    });
  },
} satisfies TuiPluginModule;
