const promptBox = document.getElementById("prompt");
const charCount = document.getElementById("char-count");
const panelsBox = document.getElementById("panels");
const titleBox = document.getElementById("comic-title");
const panelCount = document.getElementById("page-count");
const generateBtn = document.getElementById("generate");

promptBox.addEventListener("input", () => {
  charCount.textContent = `${promptBox.value.length} / 500`;
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

async function generateComic() {
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span>✦</span> Creating your story...';
  try {
    const response = await fetch("/generate", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        prompt: promptBox.value,
        genre: document.getElementById("genre").value,
        count: Number(document.getElementById("count").value)
      })
    });
    const data = await response.json();
    titleBox.textContent = promptBox.value.trim().split(/[.!?]/)[0].slice(0, 42) || "Your Comic Story";
    panelCount.textContent = `PAGE 01 · ${data.panels.length} PANELS`;
    panelsBox.innerHTML = data.panels.map((p, i) => `
      <article class="comic-panel">
        <div class="panel-art ${["art-one","art-two","art-three","art-four"][i%4]}">
          ${i%4===0?'<span class="scene-sun"></span>':''}
          <span class="${i%4===1?'mystery':i%4===2?'burst':i%4===3?'hero-star':'scene-person'}">${i%4===1?'✧':i%4===2?'!':i%4===3?'✦':'♟'}</span>
          <span class="scene-cloud">${escapeHtml(p.title)}</span>
        </div>
        <div class="panel-copy"><b>${String(p.number).padStart(2,"0")} · ${escapeHtml(p.title.toUpperCase())}</b>
        <p contenteditable="true" spellcheck="true">${escapeHtml(p.caption)}</p>
        <span class="speech" contenteditable="true">${escapeHtml(p.dialogue)}</span></div>
      </article>`).join("");
  } catch (e) {
    alert("Could not generate the outline. Please check that the Flask app is running.");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>✦</span> Generate comic outline <b>→</b>';
  }
}
generateBtn.addEventListener("click", generateComic);
document.getElementById("regenerate").addEventListener("click", generateComic);

document.getElementById("download").addEventListener("click", () => {
  const cards = [...document.querySelectorAll(".comic-panel")];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const cols = 2, cellW = 520, cellH = 330, gap = 24, pad = 40;
  const rows = Math.ceil(cards.length/cols);
  canvas.width = pad*2 + cols*cellW + gap;
  canvas.height = 140 + pad + rows*cellH + (rows-1)*gap;
  ctx.fillStyle = "#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#262747"; ctx.font = "bold 32px sans-serif";
  ctx.fillText(titleBox.textContent, pad, 65);
  ctx.font = "16px sans-serif"; ctx.fillStyle="#858ba5";
  ctx.fillText("Created with ComicCraft AI",pad,96);
  cards.forEach((card,i)=>{
    const x=pad+(i%cols)*(cellW+gap), y=140+Math.floor(i/cols)*(cellH+gap);
    const bg=["#d7eaff","#ffedc9","#d3d4ff","#c9f2e7"][i%4];
    ctx.fillStyle=bg;ctx.fillRect(x,y,cellW,190);
    ctx.strokeStyle="#252744";ctx.lineWidth=5;ctx.strokeRect(x,y,cellW,cellH);
    ctx.fillStyle="#6358d4";ctx.font="bold 17px sans-serif";
    ctx.fillText(card.querySelector("b").textContent.slice(0,48),x+18,y+220);
    ctx.fillStyle="#353b58";ctx.font="17px sans-serif";
    wrapText(ctx,card.querySelector(".panel-copy p").textContent,x+18,y+252,cellW-36,24);
    ctx.font="bold 16px sans-serif";ctx.fillText(card.querySelector(".speech").textContent.slice(0,55),x+18,y+310);
    ctx.fillStyle="#6358d4";ctx.font="bold 70px sans-serif";
    ctx.fillText(["♟","✧","!","✦"][i%4],x+cellW/2-20,y+125);
  });
  const a=document.createElement("a");a.download="comiccraft-story.png";a.href=canvas.toDataURL("image/png");a.click();
});
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  let line="", words=text.split(" ");
  words.forEach((word,i)=>{const test=line+word+" ";if(ctx.measureText(test).width>maxWidth&&i>0){ctx.fillText(line,x,y);line=word+" ";y+=lineHeight;}else line=test;});
  ctx.fillText(line,x,y);
}
