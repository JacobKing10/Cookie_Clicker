let cookies = 0;

let clickValue = 1;

let owned = {};

let baseStats = {};

let multipliers = {};


const cookieEl = document.getElementById("clicker-cookie");

const countEl = document.getElementById("cookie-count");

const cpsEl = document.getElementById("cps-display");


// 1. HELPER FUNCTIONS (Defined outside everything)

function spawnFloatingCookieText(x, y, value) {
  

    const container = document.createElement("div");

    container.className = "floating-text";

    

    const offsetX = (Math.random() - 0.5) * 50;

    const offsetY = (Math.random() - 0.5) * 50;

    container.style.left = (x + offsetX) + "px";

    container.style.top = (y + offsetY) + "px";


    const img = document.createElement("img");

    img.src = "https://pngimg.com/d/cookie_PNG13683.png";

    img.style.width = "20px";

    img.style.marginRight = "5px";


    const text = document.createElement("span");

    text.textContent = "+" + value;


    container.appendChild(img);

    container.appendChild(text);

    document.body.appendChild(container);

    setTimeout(() => container.remove(), 1000);

}


function updateUI() {

  let totalCPS = 0;

  for (let key in owned) {

    totalCPS += (owned[key] * baseStats[key]) * multipliers[key];

  }

  countEl.textContent = `Cookies: ${Math.floor(cookies)}`;

  cpsEl.textContent = `Cookies Per Second: ${totalCPS.toFixed(1)}`;


  document.querySelectorAll(".upgrade").forEach(u => {

    const priceEl = u.querySelector(".price");

    if (!priceEl) return;

    const price = parseInt(priceEl.textContent);

    const req = u.getAttribute("data-req");

    const target = u.getAttribute("data-target");

    

    u.classList.toggle("affordable", cookies >= price);

    u.classList.toggle("too-expensive", cookies < price);

    

    if (target && owned[target] >= req && u.getAttribute("data-bought") !== "true") {

      u.style.display = "block";

    }

  });

}


function buyBuilding(el, name) {

  const priceTag = el.querySelector(".price");

  const price = parseInt(priceTag.textContent);

  if (cookies < price) return;

  cookies -= price;

  owned[name]++;

  priceTag.textContent = Math.ceil(price * 1.15);

  if (el.getAttribute("data-is-cursor") === "true") spawnCursor();

  updateUI();

}


function buyUpgrade(el, target) {

  const priceTag = el.querySelector(".price");

  const price = parseInt(priceTag.textContent);

  if (cookies < price) return;

  cookies -= price;

  multipliers[target] *= parseFloat(el.getAttribute("data-mult"));

  if (target === "Cursor") clickValue *= 2;

  el.setAttribute("data-bought", "true");

  el.style.display = "none";

  updateUI();

}


function spawnCursor() {

  const img = document.createElement("img");

  img.src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/484f349b-77d6-4cbe-a4d3-ec11a1558bee/dd6k4xq-2fbd4b16-303a-486c-ab4c-9074cd728529.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi80ODRmMzQ5Yi03N2Q2LTRjYmUtYTRkMy1lYzExYTE1NThiZWUvZGQ2azR4cS0yZmJkNGIxNi0zMDNhLTQ4NmMtYWI0Yy05MDc0Y2Q3Mjg1MjkuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.KDYPREN7NdM5xzeYpCxjL91QpTcH-nhr9NPGjYbMuzA";

  img.className = "floating-cursor";

  document.getElementById("cursor-layer").appendChild(img);

  const all = document.querySelectorAll(".floating-cursor");

  all.forEach((c, i) => {

    const angle = (i / all.length) * Math.PI * 2;

    c.style.left = (150 * Math.cos(angle)) + "px";

    c.style.top = (150 * Math.sin(angle)) + "px";

    c.style.transform = `rotate(${angle + 4.8}rad)`;

  });

}


// 2. INITIALIZATION

function scanHTML() {

  document.querySelectorAll(".upgrade").forEach(el => {

    const name = el.getAttribute("data-name");

    const target = el.getAttribute("data-target");

    if (name) {

      owned[name] = 0;

      multipliers[name] = 1;

      baseStats[name] = parseFloat(el.getAttribute("data-cps")) || 0;

      el.onclick = () => buyBuilding(el, name);

    } else if (target) {

      el.onclick = () => buyUpgrade(el, target);

    }

  });

}


// 3. EVENT LISTENERS

cookieEl.onclick = (e) => {

  cookies += clickValue;

  spawnFloatingCookieText(e.pageX, e.pageY, clickValue);

  updateUI();

};


// 4. START THE GAME

scanHTML();

setInterval(() => {

  let totalCPS = 0;

  for (let key in owned) totalCPS += (owned[key] * baseStats[key]) * multipliers[key];

  cookies += totalCPS / 10;

  updateUI();

}, 100);



