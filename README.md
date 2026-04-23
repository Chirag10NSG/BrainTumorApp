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
- `content/tumors.json` - editable tumor entries
- `admin/` - Decap CMS admin interface

## Clinician editing setup

The site now includes a basic Decap CMS configuration so clinicians can edit content through `/admin`.

Before that works on a real site, you still need to:

1. Put the project in a GitHub repository.
2. Deploy it to Netlify.
3. Enable Netlify Identity and Git Gateway, or switch the Decap backend to GitHub in `admin/config.yml`.
4. Invite clinician editors.

Once deployed, clinicians can edit:

- site-wide copy like hero text, care guide questions, and source links
- tumor entries in the directory

## Good next steps

- Add a detail page for each tumor type
- Add a glossary for medical terms
- Add a symptom tracker or appointment notes section
- Add a clinician review workflow before publishing changes
