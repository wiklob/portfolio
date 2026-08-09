# portfolio

One static page. No build step, no dependencies, no JavaScript.

```
index.html      all the content
styles.css      all the styling
assets/         favicon
netlify.toml    publish the repo root as-is
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

## Preview

Any static server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

Netlify serves the repo root directly, so a push to `main` is the deploy.
