# Convertools Pro — Browser Tools Expansion Plan

## Non-negotiable requirements

- No mandatory paid APIs, API keys, or remote file-processing services.
- Prefer browser-native JavaScript, Web APIs, and WebAssembly.
- Keep uploaded files on the user's device unless a future feature clearly discloses an optional remote service.
- Preserve the current React + TypeScript + Vite application and existing routes.
- Keep tools lazy-loaded; load large WASM/model assets only when the relevant tool is opened.
- Keep AdSense placements clearly labeled and visually separate from tool controls.
- Do not treat an AdSense placeholder as a real ad unit. Production rendering requires a numeric slot ID.
- Test on mobile browsers, especially low-memory Android devices.

## Repository strategy

Do not wholesale-copy another product or replace the current application. Reuse small, isolated modules only after checking the source license, transitive dependencies, bundled assets, fonts, and model licenses.

| Source project | Intended use | License status |
| --- | --- | --- |
| https://github.com/aniruddhaadak80/OpenFile | Reference and selectively reviewed browser-based image, media, PDF and utility implementations | MIT at source repository; retain notices for copied portions |
| https://github.com/kingrishabdugar/fizzdoc | PDF/document processing architecture and selected browser-only modules | Apache-2.0; preserve required notices and modification notices |
| https://github.com/GoogleChromeLabs/squoosh | Image compression and codec implementation reference | Apache-2.0 at repository package metadata; verify individual codec and dependency licenses |
| https://github.com/iib0011/omni-tools | Selected utility UX and implementation references | Verify repository and dependency licenses before copying code |
| https://github.com/CorentinTh/it-tools | Feature ideas only until GPL-3.0 obligations are reviewed | GPL-3.0; do not merge code casually |
| https://github.com/Stirling-Tools/Stirling-PDF | Feature reference only; not a default Vercel/browser-only integration | Review current license and server requirements before any use |

## Delivery phases

1. Audit existing tools and fix incorrect claims or incomplete processing before adding more features.
2. PDF: reliable merge, page-range split, rotate, watermark, metadata, and clearly scoped conversion support.
3. Images: compression, resize, crop, format conversion, and safe file handling.
4. Developer/text: lightweight utilities that run synchronously or in small workers.
5. Audio/video: evaluate WebAssembly and browser codec support; implement strict size limits, progress, cancellation, and memory safeguards.
6. SEO, accessibility, mobile layout, AdSense configuration, and deployment checks.

## Quality gates

- `npm ci`
- `npm run lint`
- `npm run build`
- Add unit and browser tests alongside each new tool.
- Test valid, invalid, empty, oversized, and unsupported files.
- Verify downloads, object URL cleanup, error states, keyboard access, and mobile layout.
- Check that no tool claims encryption, unlocking, OCR, compression, or conversion unless the output is genuinely produced and verified.

## Known limitations

- Browser processing is not unlimited. Large PDFs, videos, audio files, and ML models can exceed mobile memory or CPU limits.
- Some formats require large WASM/model downloads and may not be supported by every browser.
- Adding ad code does not guarantee AdSense approval, ad serving, or revenue.
- The footer ad unit must remain disabled in production until a real numeric slot ID is configured.
