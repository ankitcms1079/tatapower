# Tata Power Touch Screen Web App

Fixed-size kiosk web app (`1920x1080`) that controls video playback on a second/extended display.

## Behavior implemented

- Default video loops whenever no category video is active.
- Tapping a category button immediately plays its mapped video.
- If another button is tapped while a video is running, playback switches immediately to the newly selected video.
- After a selected video ends, playback returns to the default looping video.
- Includes a dedicated **Open Player on Extended Screen** action to launch the second-screen player window.

## Setup

1. Put your videos in `videos/` and keep/update filenames used in `app.js` (`VIDEO_LIBRARY`).
2. Start the Node static server:

```bash
npm start
```

3. Open `http://localhost:8080` on the touch screen.
4. Tap **Open Player on Extended Screen** and move that player window to the extended monitor (or kiosk browser assigned to second display).

## Notes for kiosk use

- For strict kiosk deployments, configure browser/system startup to auto-open two windows (controller + player).
- Some browsers require user interaction before fullscreen or autoplay can start.
- Server host/port can be overridden with `HOST` and `PORT` environment variables.

## Background artwork

- For exact visual matching, place the provided design file at `assets/kiosk-background.jpg` (1920x1080).
- The app uses `assets/kiosk-background.svg` only as a fallback when the JPG is missing.
