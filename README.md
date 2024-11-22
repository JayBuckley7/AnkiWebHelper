# AnkiWebLookup Extension

AnkiWebLookup is a Chrome extension that enhances the AnkiWeb study experience by adding features like:
1. Clickable links to **jpdb.io** for kanji lookups.
2. A "Copy" button to copy processed kanji/word data.
3. Spacebar functionality to:
   - Open **jpdb.io** for the current content.
   - Flip the Anki card to reveal the answer.

---

## Features

- **jpdb.io Integration**: Quickly look up kanji or words on jpdb.io by clicking a link.
- **Copy Functionality**: Easily copy kanji/word content to your clipboard for further use.
- **Spacebar Shortcut**: Press the spacebar to flip the card and simultaneously open jpdb.io, streamlining your study process.
- **Automatic Updates**: The extension observes changes to the card content and processes new cards automatically.

---

## Installation

1. Clone or download the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the folder containing the extension files.
5. The extension is now installed and ready to use on AnkiWeb!

---

## Usage

1. Navigate to AnkiWeb (`ankiuser.net/study/*`) and start your study session.
2. Features include:
   - **Clickable Links**: Kanji/word content will display as a clickable link. Clicking it opens a jpdb.io search.
   - **Copy Button**: Click the copy button to save the content to your clipboard.
   - **Spacebar Shortcut**: Press the spacebar to both flip the card and open jpdb.io for the current card content.

---

## Files Overview

### Manifest File (`manifest.json`)

Defines the extension's metadata and permissions, including:
- `activeTab` and `tabs` permissions for interacting with the current tab.
- Host permissions for `ankiuser.net` and `jpdb.io`.

### Background Script (`background.js`)

Handles messages from the content script and ensures efficient jpdb.io integration:
- Opens or reloads a jpdb.io tab with the specified kanji/word content.

### Content Script (`contentScript.js`)

Processes the DOM on AnkiWeb:
- Extracts kanji and furigana from `<ruby>` tags.
- Adds a clickable link to jpdb.io and a copy button.
- Implements a spacebar shortcut to flip cards and open jpdb.io.

---

## Permissions

- `activeTab`: Allows interaction with the currently active tab.
- `tabs`: Enables querying and updating existing tabs.
- `host_permissions`: Grants access to:
  - `ankiuser.net/study/*` for interacting with AnkiWeb.
  - `jpdb.io/*` for kanji/word lookups.

---

## How It Works

1. The **Content Script** processes AnkiWeb's DOM to:
   - Add clickable links and copy buttons.
   - Detect and process `<ruby>` tags for kanji/furigana pairs.
   - Monitor card flips and dynamically update the content.

2. The **Background Script**:
   - Ensures that jpdb.io opens in an existing tab or creates a new one.
   - Reloads the jpdb.io tab with the current card's content.

3. The **Spacebar Shortcut**:
   - Triggers both the jpdb.io lookup and the card flip for a seamless study workflow.

---

## Development

### Requirements
- Google Chrome (or any Chromium-based browser).
- Basic knowledge of Chrome extensions.

### Steps to Modify
1. Edit the `contentScript.js` or `background.js` file as needed.
2. Reload the extension via `chrome://extensions/`.
3. Test changes on AnkiWeb (`ankiuser.net/study/*`).

---

## Troubleshooting

- **Extension Not Working**:
  - Ensure the extension is loaded and active via `chrome://extensions/`.
  - Verify that you're on a supported page (`ankiuser.net/study/*`).
- **jpdb.io Not Opening**:
  - Check if `jpdb.io` permissions are granted in the manifest file.
  - Make sure the URL matches `https://jpdb.io/`.

---

## License

This extension is free to use and modify. Attribution is appreciated if redistributed.

---

Enjoy your streamlined AnkiWeb study sessions with **AnkiWebLookup**! 🚀
