---
title: Notes
description: General notes and documentation
---

# Notes

General notes, references, and documentation.

---

## Getting Started

To add a new note, create a `.md` file in this folder and add it to the `nav` section in `mkdocs.yml`.

### Example

Create a file `docs/notes/my-note.md`:

```markdown
---
title: My Note Title
---

# My Note Title

Write your content here using standard Markdown.
```

Then add it to `mkdocs.yml`:

```yaml
nav:
  - Notes:
    - notes/index.md
    - My Note: notes/my-note.md
```

---

!!! tip "Live Preview"
    Run `mkdocs serve` to see your changes in real-time at `http://127.0.0.1:8000`
