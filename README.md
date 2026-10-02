# opencode-quotes-tui

[![CI](https://github.com/Pettecco/opencode-quotes-tui/actions/workflows/ci.yml/badge.svg)](https://github.com/Pettecco/opencode-quotes-tui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/opencode-quotes-tui)](https://www.npmjs.com/package/opencode-quotes-tui)

**Open your terminal to a piece of timeless wisdom.** opencode-quotes-tui replaces OpenCode's built-in tips with a hand-picked quote. You get a new one every time you start OpenCode.

![OpenCode TUI home screen with a random quote in the footer](assets/example.png)

## Why you'll like it

- **A fresh quote every session:** philosophy, literature, science, art. A hand-curated list instead of a wall of tips.
- **Matches your theme:** renders in your current OpenCode theme's colors, with nothing to configure.
- **One command to install:** works out of the box, globally, in every project.

## Install

```bash
opencode plugin opencode-quotes-tui -g
```

Restart OpenCode. That's it. Every session from now on opens with a quote.

<details>
<summary>Alternative install routes</summary>

**In-app Plugin Manager:** command palette → **Plugins** → **install** → type `opencode-quotes-tui` → press **Tab** to select global scope.

**Manual config:** add the package to the plugin list in `~/.config/opencode/tui.json` and OpenCode downloads it automatically:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-quotes-tui"]
}
```

Use `"opencode-quotes-tui@1.0.0"` to pin a version.

**Single project only:** copy `src/tui.tsx`, `src/quotes.ts` and `tui.json` from this repo into your project root and OpenCode picks them up automatically.

</details>

## Uninstall

Remove `opencode-quotes-tui` from the plugin list in `~/.config/opencode/tui.json` and restart OpenCode.

One honest note: while active, the plugin hides OpenCode's built-in tips, which is the point. That preference outlives the plugin, so if you want the tips back afterwards, run the built-in `tips.toggle` command once.

## Make it yours

The quote list is a plain file: `src/quotes.ts`, an array of `{ quote, author }`. Fork it, edit it, rebuild with `npm run build`. An empty list is fine too. The plugin simply steps aside.

## Contributing a quote

Pull requests with new quotes are welcome:

- **Verifiable attribution:** cite the source or work in the PR; misattributed quotes are declined.
- **Terminal-friendly:** around 200 characters max.
- **Any language:** English and Portuguese today, more welcome.
- **Fit the shelf:** keep the section organization of `src/quotes.ts`.

## Compatibility

OpenCode 1.18 or newer.

<details>
<summary>Development</summary>

```bash
npm install
npm run typecheck
npm run build
```

Plain Node 22 + npm, no extra runtime needed.

</details>

## License

MIT
