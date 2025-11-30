// ------------------------------------------------------------
// assets
// ------------------------------------------------------------

const ASSETS = {
  COLOR: {
    TAR: ["#959298", "#9c9a9d"],
    RUMBLE: ["#959298", "#f5f2f6"],
    GRASS: ["#eedccd", "#e6d4c5"],
  },

  IMAGE: {
    TREE: {
      src: "images/tree.png",
      width: 132,
      height: 192,
    },

    // --- UPDATED CAR DIMENSIONS FOR INDIVIDUAL IMAGES ---
    HERO_CENTER: {
      src: "images/hero_center.png",
      width: 800, 
      height: 471,
    },
    HERO_LEFT: {
        src: "images/hero_left.png",
        width: 1125, 
        height: 595,
    },
    HERO_RIGHT: {
        src: "images/hero_right.png",
        width: 1133, 
        height: 595,
    },
    
    // Keeping the old name HERO temporarily for compatibility if other parts use it
    HERO: { 
        src: "images/hero_center.png",
        width: 800, 
        height: 471
    }, 
    // -------------------------------------------------------------------------

    CAR: {
      src: "images/car04.png",
      width: 60,
      height: 46,
    },

    FINISH: {
      src: "images/finish.png",
      width: 339,
      height: 180,
      offset: -0.5,
    },

    SKY: {
      src: "images/cloud.jpg",
    },
  },

  AUDIO: {
    theme:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/theme.mp3",
    engine:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/engine.wav",
    honk: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/honk.wav",
    beep: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/beep.wav",
  },
};

// ------------------------------------------------------------
// helper functions
// ------------------------------------------------------------

Number.prototype.pad = function (numZeros, char = 0) {
  let n = Math.abs(this);
  let zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
  let zeroString = Math.pow(10, zeros)
    .toString()
    .substr(1)
    .replace(0, char);
  return zeroString + n;
};

Number.prototype.clamp = function (min, max) {
  return Math.max(min, Math.min(this, max));
};

const timestamp = (_) => new Date().getTime();
const accelerate = (v, accel, dt) => v + accel * dt;
const isCollide = (x1, w1, x2, w2) => (x1 - x2) ** 2 <= (w2 + w1) ** 2;

function getRand(min, max) {
  return (Math.random() * (max - min) + min) | 0;
}

function randomProperty(obj) {
  let keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}

function drawQuad(element, layer, color, x1, y1, w1, x2, y2, w2) {
  element.style.zIndex = layer;
  element.style.background = color;
  element.style.top = y2 + `px`;
  element.style.left = x1 - w1 / 2 - w1 + `px`;
  element.style.width = w1 * 3 + `px`;
  element.style.height = y1 - y2 + `px`;

  let leftOffset = w1 + x2 - x1 + Math.abs(w2 / 2 - w1 / 2);
  element.style.clipPath = `polygon(${leftOffset}px 0, ${
    leftOffset + w2
  }px 0, 66.66% 100%, 33.33% 100%)`;
}

const KEYS = {};
const keyUpdate = (e) => {
  KEYS[e.code] = e.type === `keydown`;
  e.preventDefault();
};
addEventListener(`keydown`, keyUpdate);
addEventListener(`keyup`, keyUpdate);

function sleep(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout((_) => resolve(), ms);
  });
}

// ------------------------------------------------------------
// objects
// ------------------------------------------------------------

class Line {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.X = 0;
    this.Y = 0;
    this.W = 0;

    this.curve = 0;
    this.scale = 0;

    this.elements = [];
    this.special = null;
  }

  project(camX, camY, camZ) {
    this.scale = camD / (this.z - camZ);
    this.X = (1 + this.scale * (this.x - camX)) * halfWidth;
    this.Y = Math.ceil(((1 - this.scale * (this.y - camY)) * height) / 2);
    this.W = this.scale * roadW * halfWidth;
  }

  clearSprites() {
    for (let e of this.elements) e.style.background = "transparent";
  }

  drawSprite(depth, layer, sprite, offset) {
    let destX = this.X + this.scale * halfWidth * offset;
    let destY = this.Y + 4;
    
    // Use scaled dimensions for sprites
    let destW = (sprite.width * this.W) / 265;
    let destH = (sprite.height * this.W) / 265;

    destX += destW * offset;
    destY += destH * -1;

    let obj = layer instanceof Element ? layer : this.elements[layer + 6];
    obj.style.background = `url('${sprite.src}') no-repeat`;
    obj.style.backgroundSize = `${destW}px ${destH}px`;
    obj.style.left = destX + `px`;
    obj.style.top = destY + `px`;
    obj.style.width = destW + `px`;
    obj.style.height = destH + `px`;
    obj.style.zIndex = depth;
  }
}

class Car {
  constructor(pos, type, lane) {
    this.pos = pos;
    this.type = type;
    this.lane = lane;

    var element = document.createElement("div");
    road.appendChild(element);
    this.element = element;
  }
}

class Audio {
  constructor() {
    this.audioCtx = new AudioContext();

    // volume
    this.destination = this.audioCtx.createGain();
    this.volume = 1;
    this.destination.connect(this.audioCtx.destination);

    this.files = {};

    let _self = this;
    this.load(ASSETS.AUDIO.theme, "theme", function (key) {
      let source = _self.audioCtx.createBufferSource();
      source.buffer = _self.files[key];

      let gainNode = _self.audioCtx.createGain();
      gainNode.gain.value = 0.6;
      source.connect(gainNode);
      gainNode.connect(_self.destination);

      source.loop = true;
      source.start(0);
    });
  }

  get volume() {
    return this.destination.gain.value;
  }

  set volume(level) {
    this.destination.gain.value = level;
  }

  play(key, pitch) {
    if (this.files[key]) {
      let source = this.audioCtx.createBufferSource();
      source.buffer = this.files[key];
      source.connect(this.destination);
      if (pitch) source.detune.value = pitch;
      source.start(0);
    } else this.load(key, () => this.play(key));
  }

  load(src, key, callback) {
    let _self = this;
    let request = new XMLHttpRequest();
    request.open("GET", src, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      _self.audioCtx.decodeAudioData(
        request.response,
        function (beatportBuffer) {
          _self.files[key] = beatportBuffer;
          callback(key);
        },
        function () {}
      );
    };
    request.send();
  }
}

// ------------------------------------------------------------
// global varriables
// ------------------------------------------------------------

// NOTE: width/height calculated from window are used for projection math, 
// while CSS handles the physical container size change (100% vs 90%)
const gameOffset = 10; 
const width = window.innerWidth;
const halfWidth = width / 2;
const height = window.innerHeight;

const roadW = 6000; 
const segL = 250; 
const camD = 0.3; 
const H = 2000; 
const N = 70; 

// --- Max Speed is 220 ---
const maxSpeed = 220; 
const accel = 45; 
const breaking = -80;
const decel = -30; 
const maxOffSpeed = 40;
const offDecel = -70;
const enemy_speed = 8;
const hitSpeed = 20;
// -------------------------------------------------------------------------

const LANE = {
  A: -2.3,
  B: -0.5,
  C: 1.2,
};

const mapLength = 15000;

// loop
let then = timestamp();
const targetFrameRate = 1000 / 25; 

let audio;

// game state variables
let inGame,
  start,
  playerX,
  speed,
  scoreVal,
  pos,
  cloudOffset,
  sectionProg,
  mapIndex,
  countDown;
let lines = [];
let cars = [];

// New global state variables
let viewMode = '3rd'; // Default view mode: '1st' or '3rd'
let sessionHighscores = []; // Array to store scores in this session

// ------------------------------------------------------------
// map
// ------------------------------------------------------------

function getFun(val) {
  return (i) => val;
}

function genMap() {
  let map = [];

  for (var i = 0; i < mapLength; i += getRand(0, 50)) {
    let section = {
      from: i,
      to: (i = i + getRand(300, 600)),
    };

    let randHeight = getRand(-5, 5);
    let randCurve = getRand(5, 30) * (Math.random() >= 0.5 ? 1 : -1);
    let randInterval = getRand(20, 40);

    if (Math.random() > 0.9) {
        Object.assign(section, {
          curve: (_) => randCurve,
          height: (_) => randHeight,
        });
    }
    else if (Math.random() > 0.8) {
        Object.assign(section, {
          curve: (_) => 0,
          height: (i) => Math.sin(i / randInterval) * 1000,
        });
    }
    else if (Math.random() > 0.8) {
        Object.assign(section, {
          curve: (_) => 0,
          height: (_) => randHeight,
        });
    }
    else {
        Object.assign(section, {
          curve: (_) => randCurve,
          height: (_) => 0,
        });
    }
    map.push(section);
  }

  map.push({
    from: i,
    to: i + N,
    curve: (_) => 0,
    height: (_) => 0,
    special: ASSETS.IMAGE.FINISH,
  });
  map.push({ from: Infinity });
  return map;
}

let map = genMap();

// ------------------------------------------------------------
// View Mode Handlers
// ------------------------------------------------------------

function setViewMode(mode) {
    viewMode = mode;
    const heroElement = document.getElementById('hero');
    const mode1stBtn = document.getElementById('mode-1st');
    const mode3rdBtn = document.getElementById('mode-3rd');
    const pressSpaceText = document.querySelector('#mode-selection > p:last-child');
    const gameElement = document.getElementById('game'); // Get game container

    // Update button styling
    mode1stBtn.classList.remove('selected');
    mode3rdBtn.classList.remove('selected');

    // --- UPDATED LOGIC (SWAPPED) ---
    if (mode === '1st') { // NEW 1ST PERSON: Car Visible, Window 100%
        heroElement.style.display = 'block'; 
        mode1stBtn.classList.add('selected');
        gameElement.classList.remove('third-person-view'); // 100% Full screen
    } else { // NEW 3RD PERSON: Car Hidden, Window 90%
        heroElement.style.display = 'none'; 
        mode3rdBtn.classList.add('selected');
        gameElement.classList.add('third-person-view'); // 90% window
    }
    
    // Show the 'Press Space' instruction
    pressSpaceText.style.display = 'block';
}

// ------------------------------------------------------------
// Score Handling
// ------------------------------------------------------------

function recordScore(lapTime) {
    // We only record times that are less than 9'59"999
    if (lapTime && lapTime !== `0'00"000`) {
        sessionHighscores.push(lapTime);
        // Sort scores (string comparison works for the format 0'00"000)
        sessionHighscores.sort(); 
        // Keep only the top 3
        sessionHighscores = sessionHighscores.slice(0, 3);
    }
    
    updateSessionHighscores();
}

function updateSessionHighscores() {
    const listElement = document.getElementById('top-scores-list');
    if (listElement) {
        listElement.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const score = sessionHighscores[i] || `0'00"000`;
            const p = document.createElement('p');
            p.innerHTML = `${(i + 1).pad(1, '&nbsp;')}. ${score}`;
            listElement.appendChild(p);
        }
    }
}


// ------------------------------------------------------------
// additional controls
// ------------------------------------------------------------

addEventListener(`keyup`, function (e) {
  if (e.code === "KeyM") {
    e.preventDefault();
    audio.volume = audio.volume === 0 ? 1 : 0;
    return;
  }

  if (e.code === "Space") { // Changed from KeyC to Space
    e.preventDefault();

    // Only start if a view mode has been selected (viewMode !== null)
    if (!viewMode || inGame) return; 

    sleep(0)
      .then((_) => {
        document.getElementById('text').classList.remove("blink");
        document.getElementById('text').innerText = 3;
        audio.play("beep");
        return sleep(1000);
      })
      .then((_) => {
        document.getElementById('text').innerText = 2;
        audio.play("beep");
        return sleep(1000);
      })
      .then((_) => {
        reset();

        document.getElementById('home').style.display = "none";
        document.getElementById('mode-selection').style.display = 'none'; // Hide mode selection
        
        document.getElementById('road').style.opacity = 1;
        
        // Apply selected view mode and car image
        document.getElementById('hero').style.display = viewMode === '1st' ? 'block' : 'none'; 
        document.getElementById('hero').style.backgroundImage = `url(${ASSETS.IMAGE.HERO_CENTER.src})`;

        document.getElementById('hud').style.display = "block";

        audio.play("beep", 500);

        inGame = true;
      });

    return;
  }

  if (e.code === "Escape") {
    e.preventDefault();

    reset();
  }
});

// ------------------------------------------------------------
// game loop
// ------------------------------------------------------------

function update(step) {
  // prepare this iteration
  pos += speed;
  while (pos >= N * segL) pos -= N * segL;
  while (pos < 0) pos += N * segL;

  var startPos = (pos / segL) | 0;
  let endPos = (startPos + N - 1) % N;

  scoreVal += speed * step;
  countDown -= step;

  // left / right position
  playerX -= (lines[startPos].curve / 5000) * step * speed;

    // --- Hero Car Turning Logic (using separate images) ---
    const heroElement = document.getElementById('hero');
    let heroSrc = ASSETS.IMAGE.HERO_CENTER.src;

  if (KEYS.ArrowRight) {
        heroSrc = ASSETS.IMAGE.HERO_RIGHT.src;
      (playerX += 0.007 * step * speed);
  }
  else if (KEYS.ArrowLeft) {
        heroSrc = ASSETS.IMAGE.HERO_LEFT.src;
      (playerX -= 0.007 * step * speed);
  }
    
    // Apply the correct image source only if in the new 1st person mode
    if (viewMode === '1st') {
        heroElement.style.backgroundImage = `url(${heroSrc})`;
    }
    // ----------------------------------------------------

  playerX = playerX.clamp(-3, 3);

  // speed

  if (inGame && KEYS.ArrowUp) speed = accelerate(speed, accel, step);
  else if (KEYS.ArrowDown) speed = accelerate(speed, breaking, step);
  else speed = accelerate(speed, decel, step);

  if (Math.abs(playerX) > 0.55 && speed >= maxOffSpeed) {
    speed = accelerate(speed, offDecel, step);
  }

  speed = speed.clamp(0, maxSpeed);

  // update map
  let current = map[mapIndex];
  let use = current.from < scoreVal && current.to > scoreVal;
  if (use) sectionProg += speed * step;
  lines[endPos].curve = use ? current.curve(sectionProg) : 0;
  lines[endPos].y = use ? current.height(sectionProg) : 0;
  lines[endPos].special = null;

  if (current.to <= scoreVal) {
    mapIndex++;
    sectionProg = 0;

    lines[endPos].special = map[mapIndex].special;
  }

  // win / lose + UI
  if (!inGame) {
    speed = accelerate(speed, breaking, step);
    speed = speed.clamp(0, maxSpeed);
  } else if (countDown <= 0 || lines[startPos].special) {
    
    // Game Over Logic
    const finalLapTime = document.getElementById('lap').innerText; // Get the final Lap Time
    recordScore(finalLapTime); 
    
    document.getElementById('tacho').style.display = "none";
    document.getElementById('home').style.display = "block";
    document.getElementById('road').style.opacity = 0.4;
    document.getElementById('text').innerText = "GAME OVER"; 
    
    document.getElementById('mode-selection').style.display = 'block'; 
    document.querySelector('#mode-selection > p:last-child').style.display = 'block'; 
    // Show hero car on home screen regardless of last mode for reset visual
    document.getElementById('hero').style.display = 'block'; 
    
    // Set hero back to center image on home screen
    heroElement.style.backgroundImage = `url(${ASSETS.IMAGE.HERO_CENTER.src})`;

    inGame = false;
  } else {
    
    // Calculate current lap time
    document.getElementById('time').innerText = (countDown | 0).pad(3);
    
    let cT = new Date(timestamp() - start);
    const currentLapTime = `${cT.getMinutes()}'${cT.getSeconds().pad(2)}"${cT.getMilliseconds().pad(3)}`;
    
    // Distance Score goes to SCORE, Lap Time goes to LAP
    document.getElementById('score').innerText = (scoreVal | 0).pad(8); // Distance Score -> SCORE
    document.getElementById('lap').innerText = currentLapTime; // Lap Time -> LAP
    
    document.getElementById('tacho').innerText = speed | 0;
  }

  // sound
  if (speed > 0) audio.play("engine", speed * 4);

  // draw cloud
  document.getElementById('cloud').style.backgroundPosition = `${
    (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0
  }px 0`;

  // other cars
  for (let car of cars) {
    car.pos = (car.pos + enemy_speed * step) % N;

    // respawn
    if ((car.pos | 0) === endPos) {
      if (speed < 30) car.pos = startPos;
      else car.pos = endPos - 2;
      car.lane = randomProperty(LANE);
    }

    // collision
    const offsetRatio = 5;
    if (
      (car.pos | 0) === startPos &&
      isCollide(playerX * offsetRatio + LANE.B, 0.5, car.lane, 0.5)
    ) {
      speed = Math.min(hitSpeed, speed);
      if (inGame) audio.play("honk");
    }
  }

  // draw road
  let maxy = height;
  let camH = H + lines[startPos].y;
  let x = 0;
  let dx = 0;

  for (let n = startPos; n < startPos + N; n++) {
    let l = lines[n % N];
    let level = N * 2 - n;

    // update view
    l.project(
      playerX * roadW - x,
      camH,
      startPos * segL - (n >= N ? N * segL : 0)
    );
    x += dx;
    dx += l.curve;

    // clear assets
    l.clearSprites();

    // first draw section assets
    if (n % 10 === 0) l.drawSprite(level, 0, ASSETS.IMAGE.TREE, -2);
    if ((n + 5) % 10 === 0)
      l.drawSprite(level, 0, ASSETS.IMAGE.TREE, 1.3);

    if (l.special)
      l.drawSprite(level, 0, l.special, l.special.offset || 0);

    for (let car of cars)
      if ((car.pos | 0) === n % N)
        l.drawSprite(level, car.element, car.type, car.lane);

    // update road

    if (l.Y >= maxy) continue;
    maxy = l.Y;

    let even = ((n / 2) | 0) % 2;
    let grass = ASSETS.COLOR.GRASS[even * 1];
    let rumble = ASSETS.COLOR.RUMBLE[even * 1];
    let tar = ASSETS.COLOR.TAR[even * 1];

    let p = lines[(n - 1) % N];

    drawQuad(
      l.elements[0],
      level,
      grass,
      width / 4,
      p.Y,
      halfWidth + 2,
      width / 4,
      l.Y,
      halfWidth
    );
    drawQuad(
      l.elements[1],
      level,
      grass,
      (width / 4) * 3,
      p.Y,
      halfWidth + 2,
      (width / 4) * 3,
      l.Y,
      halfWidth
    );

    drawQuad(
      l.elements[2],
      level,
      rumble,
      p.X,
      p.Y,
      p.W * 1.15,
      l.X,
      l.Y,
      l.W * 1.15
    );
    drawQuad(l.elements[3], level, tar, p.X, p.Y, p.W, l.X, l.Y, l.W);

    if (!even) {
      drawQuad(
        l.elements[4],
        level,
        ASSETS.COLOR.RUMBLE[1],
        p.X,
        p.Y,
        p.W * 0.4,
        l.X,
        l.Y,
        l.W * 0.4
      );
      drawQuad(
        l.elements[5],
        level,
        tar,
        p.X,
        p.Y,
        p.W * 0.35,
        l.X,
        l.Y,
        l.W * 0.35
      );
    }
  }
}

// ------------------------------------------------------------
// init
// ------------------------------------------------------------

function reset() {
  inGame = false;

  start = timestamp();
  countDown = map[map.length - 2].to / 130 + 10;

  playerX = 0;
  speed = 0;
  scoreVal = 0;

  for (let line of lines) line.curve = line.y = 0;

  pos = 0;
  cloudOffset = 0;
  sectionProg = 0;
  mapIndex = 0;

  // Initial screen text
  document.getElementById('mode-selection').style.display = 'block';
  document.querySelector('#mode-selection > p:last-child').style.display = 'none'; // Hide Press Space initially
  document.getElementById('text').innerText = "LET START"; // Default title when not counting down
  document.getElementById('text').classList.add("blink");
  
  document.getElementById('road').style.opacity = 0.4;
  document.getElementById('hud').style.display = "none";
  document.getElementById('home').style.display = "block";
  document.getElementById('tacho').style.display = "block";
}


function init() {
    // Event listeners for mode selection buttons
    document.getElementById('mode-1st').addEventListener('click', () => setViewMode('1st'));
    document.getElementById('mode-3rd').addEventListener('click', () => setViewMode('3rd'));
    
    // --- Hero Car sizing/positioning FIXED to fit road geometry ---
    const heroElement = document.getElementById('hero');
    const heroAsset = ASSETS.IMAGE.HERO_CENTER;
    
    // We want the car to occupy about 60% of the visible road lane width at the bottom of the screen.
    const heroWidthAtScreenBase = window.innerWidth * 0.30; 
    
    // Calculate vertical position (Top): Place car 40px up from the bottom of the viewport
    const verticalOffset = 40; 

    // Calculate proportional height based on the asset's aspect ratio
    const newHeroHeight = heroWidthAtScreenBase * (heroAsset.height / heroAsset.width);
    
    const newHeroTop = window.innerHeight - newHeroHeight - verticalOffset;
    
    // Apply final calculated dimensions and position
    heroElement.style.top = newHeroTop + "px"; 
    heroElement.style.left = (window.innerWidth / 2 - heroWidthAtScreenBase / 2) + "px";
    
    heroElement.style.background = `url(${heroAsset.src}) no-repeat`;
    heroElement.style.backgroundSize = `${heroWidthAtScreenBase}px ${newHeroHeight}px`;

    heroElement.style.width = `${heroWidthAtScreenBase}px`; 
    heroElement.style.height = `${newHeroHeight}px`;
    // ---------------------------------------------------------------------------------

    // Adjust enemy car size based on a consistent scaling factor for correct perspective
    const ENEMY_BASE_ASSET_WIDTH = 265; // A guess based on the '265' value used in drawSprite denominator
    const ENEMY_VISUAL_SCALE = heroWidthAtScreenBase / ENEMY_BASE_ASSET_WIDTH;

    const newCarWidth = ASSETS.IMAGE.CAR.width * ENEMY_VISUAL_SCALE * 0.5; // Scale enemy down slightly
    const newCarHeight = ASSETS.IMAGE.CAR.height * ENEMY_VISUAL_SCALE * 0.5;

    ASSETS.IMAGE.CAR.width = newCarWidth;
    ASSETS.IMAGE.CAR.height = newCarHeight;
    // NOTE: The `drawSprite` function will use these updated width/height values for enemy cars.
    
    document.getElementById('cloud').style.backgroundImage = `url(${ASSETS.IMAGE.SKY.src})`;

    audio = new Audio();
    Object.keys(ASSETS.AUDIO).forEach((key) =>
      audio.load(ASSETS.AUDIO[key], key, (_) => 0)
    );

    cars.push(new Car(0, ASSETS.IMAGE.CAR, LANE.C));
    cars.push(new Car(10, ASSETS.IMAGE.CAR, LANE.B));
    cars.push(new Car(20, ASSETS.IMAGE.CAR, LANE.C));
    cars.push(new Car(35, ASSETS.IMAGE.CAR, LANE.C));
    cars.push(new Car(50, ASSETS.IMAGE.CAR, LANE.A));
    cars.push(new Car(60, ASSETS.IMAGE.CAR, LANE.B));
    cars.push(new Car(70, ASSETS.IMAGE.CAR, LANE.A));

    for (let i = 0; i < N; i++) {
      var line = new Line();
      line.z = i * segL + 270;

      for (let j = 0; j < 6 + 2; j++) {
        var element = document.createElement("div");
        document.getElementById('road').appendChild(element);
        line.elements.push(element);
      }

      lines.push(line);
    }

    updateSessionHighscores();

    // Default to '3rd' person view (now means HIDDEN/90% screen)
    document.getElementById('mode-3rd').click(); 

    reset();

    // START GAME LOOP
    (function loop() {
      requestAnimationFrame(loop);

      let now = timestamp();
      let delta = now - then;

      if (delta > targetFrameRate) {
        then = now - (delta % targetFrameRate);
        update(delta / 1000);
      }
    })();
}

init();