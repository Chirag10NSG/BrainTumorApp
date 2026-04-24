[README.md](https://github.com/user-attachments/files/27035287/README.md)
# Brain Tumor Guide

A small patient-friendly starter web app for learning about different brain tumor types.

## What it includes

- Plain-language summaries for several brain tumor diagnoses
- Search and filter controls
- Questions patients can bring to appointments
- Source links to government medical references

## Run it locally

This version loads editable JSON content files, so it should be run through a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- `index.html` - page structure
- `styles.css` - visual design and responsive layout
- `app.js` - dynamic rendering and search/filter behavior
- `content/site.json` - editable site copy and source links
- `content/tumors.json` - editable tumor entries managed through the CMS
- `admin/` - Decap CMS admin interface

## GitHub Pages and CMS setup

This project can be hosted as a static site on GitHub Pages.

Content editing is configured through Pages CMS using the root `.pages.yml` file. Editors sign in with GitHub at `https://pagescms.org` and Pages CMS reads the repository configuration directly.

Main editable files:

- `content/site.json` - site-wide copy and links
- `content/tumors.json` - tumor entries shown in the directory

The old `admin/` folder is now just a pointer page for editors and is no longer a live Netlify CMS app.

Once deployed, clinicians can edit:

- site-wide copy like hero text, care guide questions, and source links
- tumor entries in the directory

## Good next steps

- Add a detail page for each tumor type
- Add a glossary for medical terms
- Add a symptom tracker or appointment notes section
- Add a clinician review workflow before publishing changes
