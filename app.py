from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

STYLE_OPTIONS = {"Anime", "Superhero", "Funny", "Fantasy", "Sci-Fi"}

def make_panels(prompt, genre="Anime", count=4):
    """Create a starter comic outline using lightweight, editable story rules."""
    prompt = re.sub(r"\s+", " ", (prompt or "").strip())
    if not prompt:
        prompt = "A curious student discovers a mysterious glowing notebook"
    hero = "the hero"
    match = re.search(r"\b(?:about|with|featuring|where)\s+([^,.!?]{2,35})", prompt, re.I)
    if match:
        hero = match.group(1).strip()
    beats = [
        ("The Setup", f"Meet {hero}. An ordinary day is about to become extraordinary."),
        ("The Discovery", "A strange clue appears, and curiosity takes over."),
        ("The Twist", "An unexpected obstacle changes the plan."),
        ("The Big Moment", "The hero makes a brave choice and takes action."),
        ("The Resolution", "The mystery settles, but a new possibility appears."),
        ("A New Beginning", "One last surprise hints at the next adventure.")
    ]
    # Use the user's idea as the central story seed without pretending to call a model.
    if any(k in prompt.lower() for k in ["space", "planet", "alien", "galaxy"]):
        beats[1] = ("The Signal", "A mysterious signal arrives from a distant world.")
        beats[2] = ("Unknown Visitor", "An unexpected visitor appears on the ship's monitor.")
    elif any(k in prompt.lower() for k in ["dragon", "magic", "kingdom", "wizard"]):
        beats[1] = ("The Enchanted Clue", "A magical symbol glows with an ancient secret.")
        beats[2] = ("The Guardian", "A powerful guardian blocks the path forward.")
    elif any(k in prompt.lower() for k in ["school", "student", "class"]):
        beats[1] = ("A Curious Discovery", "A forgotten note reveals a surprising clue.")
        beats[2] = ("The Challenge", "A school-day problem becomes an unexpected adventure.")
    selected = beats[:max(3, min(6, int(count)))]
    panels = []
    for i, (title, caption) in enumerate(selected, 1):
        panels.append({
            "number": i,
            "title": title,
            "caption": caption,
            "visual": f"{genre} comic scene inspired by: {prompt}",
            "dialogue": [
                "What is that?",
                "This could change everything!",
                "We need a new plan.",
                "Let's do this!",
                "We did it!",
                "The story isn't over..."
            ][i-1]
        })
    return panels

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    prompt = str(data.get("prompt", ""))[:500]
    genre = str(data.get("genre", "Anime"))
    if genre not in STYLE_OPTIONS:
        genre = "Anime"
    try:
        count = int(data.get("count", 4))
    except (TypeError, ValueError):
        count = 4
    return jsonify({"title": "Your Comic Story", "genre": genre, "panels": make_panels(prompt, genre, count)})

if __name__ == "__main__":
    app.run(debug=True)
