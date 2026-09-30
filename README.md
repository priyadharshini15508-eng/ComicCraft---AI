# ComicCraft AI

A beginner-friendly comic story creator built with Flask, HTML, CSS, and JavaScript.

## Features
- Enter a story prompt and choose an art genre and panel count
- Generate a starter comic outline using transparent, rule-based story logic
- Edit panel captions and dialogue directly in the preview
- Download the panel storyboard as a PNG
- Responsive layout for desktop and mobile

**Note:** The included generator is a local rule-based prototype, not a connected generative AI model or image generator. You can later connect an approved language/image model API.

## Run
1. Install Python 3.10+
2. Open terminal in this folder
3. Optional virtual environment: `python -m venv .venv`
4. Activate it on Windows: `.venv\\Scripts\\activate` (macOS/Linux: `source .venv/bin/activate`)
5. Install: `pip install -r requirements.txt`
6. Run: `python app.py`
7. Visit `http://127.0.0.1:5000`

The PNG export creates a storyboard layout with stylized placeholder panel art; it does not generate finished comic illustrations.
