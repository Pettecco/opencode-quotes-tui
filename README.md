# opencode-quotes-tui

[OpenCode](https://opencode.ai) TUI plugin that replaces the home screen tips with a random quote from a local list.

```text
       OpenCode

       "There is no substitute for hard work."

       Thomas Edison
```

## How it works

The plugin registers a `home_footer` slot (rendered with `single_winner` mode) that displays one quote — quote in the theme's text color, author in the theme's primary color. It also sets the TUI kv key `tips_hidden` (the same mechanism as the built-in `tips.toggle` command), so the original tips don't show.

A new quote is picked randomly (single `Math.random()` call) every time the TUI initializes.

## Install

### Per project

Copy `tui.tsx`, `quotes.ts` and `tui.json` to your project root. OpenCode picks up the `tui.json` `plugin` entry automatically.

### Global

1. Clone this repo somewhere (e.g. `~/.config/opencode/quotes-tui`)
2. Point the global TUI config at the plugin file — `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["/absolute/path/to/quotes-tui/tui.tsx"]
}
```

3. Restart OpenCode.

## Customizing

Edit `quotes.ts` — a plain array of `{ quote, author }`. The plugin handles an empty array gracefully (nothing renders, no crash).

## Typechecking

```bash
npm install
npm run typecheck
```

Requires `typescript` (dev dependency) plus `@opencode-ai/plugin` and `@opentui/*` type packages for full strict checks — OpenCode itself transpiles the plugin at load time, so none of these are needed to _run_ it.

## Status

Experimental / private. Built against opencode 1.18.x (`@opencode-ai/plugin` 1.14+ TUI plugin API).

## License

MIT
