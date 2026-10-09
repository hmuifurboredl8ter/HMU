# You Found It

A small, mobile-first, single-page interactive experience. It uses plain HTML, CSS, and JavaScript and has no build step or dependencies.

## Files

- `index.html` - the page and all 29 scenes
- `style.css` - full-screen visuals, typography, transitions, and mobile styling
- `script.js` - scene timing, entry, and restart behavior

## Run locally

Open `index.html` in a browser. For local development, you can also use VS Code's Live Server extension or any simple static file server.

## Publish free with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under the build/deployment section, choose **Deploy from a branch**.
5. Select your main branch and the root (`/`) folder, then save.
6. Wait for GitHub Pages to publish the site and open the URL shown there.

## Customize

- Change the displayed words in `index.html`.
- Adjust scene pacing in `script.js` using `sceneDurations`. The last scene is intentionally held until the visitor touches the screen.
- Adjust colors and styling near the top of `style.css`.

## Notes

- The email link opens the visitor's default email app using `mailto:`.
- Google Fonts are loaded from the internet. If unavailable, local fallback fonts are used.
- The `noindex, nofollow` metadata asks search engines not to index the page, but it is not a privacy or access-control mechanism.
- Use the sign only where placing it is permitted, and avoid leaving it where it obstructs access or creates litter.
