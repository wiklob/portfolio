# portfolio

One static page. No dependencies, no JavaScript served to the browser.

```
index.html      all the content
styles.css      all the styling
assets/         favicon
scripts/        the one build script: refreshes the essay list from RSS
netlify.toml    run that script, publish the repo root
_redirects      unknown paths go home; /old/* is not served
old/            the previous React + Vite portfolio, kept for reference
```

## Editing

Open `index.html` and edit the text. Every project is one `<article class="entry">`:

```html
<article class="entry">
  <p class="head">
    <a href="https://example.com" rel="noopener">example.com</a>
    <span class="dots" aria-hidden="true"></span>
    <span class="meta">what it is</span>
  </p>
  <p class="desc">A sentence or two.</p>
</article>
```

Copy that block, change the three fields, drop it in a section. For something
without a live link, swap the `<a>` for `<span class="name">…</span>`.

Colours, fonts and spacing are custom properties at the top of `styles.css`,
with a dark-mode override right below them.

## Essays

The essay list is generated from the Substack RSS feed, between the
`essays:begin` / `essays:end` markers in `index.html`. Don't edit it by hand:

```bash
node scripts/build-essays.mjs
```

It runs in three places: by hand, on every Netlify build, and once a day via
`.github/workflows/essays.yml`, which commits the result so the page updates
without a deploy. The feed URL, the pinned title and the item cap are the three
constants at the top of the script. If the feed is unreachable the script leaves
the file untouched and exits clean, so a bad network never blanks the section.

## Preview

Any static server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

Netlify runs `scripts/build-essays.mjs` and serves the repo root, so a push to
`main` is the deploy.
