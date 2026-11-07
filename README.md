# Mush's Birthday 💙

A personalised, mobile-first sky-blue birthday website for Mush, with animated clouds, balloons, gentle confetti, a heartfelt letter, and a mixed photo/video gallery.

## Listen first

The original voice recording and supplied birthday song have been joined into one browser-friendly MP3 (`public/media/mush-birthday-soundtrack.mp3`), keeping the personal message **first** and song **second**. This avoids autoplay blocks between two separate files. Playback starts only when the visitor taps a button; no unexpected audio on page load.

## Built with

Plain HTML, CSS and JavaScript. No npm install or build dependencies. All media is in `public/media/`. No trackers, cookies, analytics, external scripts or third-party fonts.

## Update the message or media

Edit `public/site-config.js` for birthday text, captions, or future gallery entries. Files are served from `public/media/`. The name `Mush` and sender signature are editable there. User-supplied music is included for the intended birthday surprise; ensure you have appropriate permission to publish/share the recording.

## Run locally

```sh
cd public
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy to Render

Create a **Static Site** connected to `adjotoriskiyat-hash/Mush-s-Birthday` (branch `main`) with:

- Build command: `echo "Ready for Mush's birthday"`
- Publish directory: `public`
- Auto-deploy: enabled

`render.yaml` provides equivalent configuration.
