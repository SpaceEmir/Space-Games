const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gameLibrary = document.getElementById("game-library");
const storeGrid = document.getElementById("store-grid");
const deviceModeButton = document.getElementById("device-mode-button");
const scoreValue = document.querySelector("[data-score]");
const bestValue = document.querySelector("[data-best]");
const bankValue = document.querySelector("[data-bank]");
const bankNote = document.querySelector("[data-bank-note]");
const primaryLabel = document.querySelector("[data-primary-label]");
const primaryValue = document.querySelector("[data-primary-value]");
const secondaryLabel = document.querySelector("[data-secondary-label]");
const secondaryValue = document.querySelector("[data-secondary-value]");
const modeNameValue = document.querySelector("[data-mode-name]");
const statusValue = document.querySelector("[data-status]");
const selectedTag = document.querySelector("[data-selected-tag]");
const rulebookTitle = document.querySelector("[data-rulebook-title]");
const modeSummary = document.querySelector("[data-mode-summary]");
const modeObjective = document.querySelector("[data-mode-objective]");
const modeControls = document.querySelector("[data-mode-controls]");
const stageTitle = document.querySelector("[data-stage-title]");

const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlay-tag");
const overlayTitle = document.getElementById("overlay-title");
const overlayBody = document.getElementById("overlay-body");
const overlayButton = document.getElementById("overlay-button");
const overlayPanelButton = document.getElementById("overlay-panel-button");
const sidebarButton = document.getElementById("sidebar-button");
const panelButton = document.getElementById("panel-button");
const stagePanelButton = document.getElementById("stage-panel-button");

const TAU = Math.PI * 2;
const CENTER = canvas.width / 2;
const PLAYER_RADIUS = 312;
const ARENA_RADIUS = 362;
const HUB_RADIUS = 104;
const STORAGE_PREFIX = "arcade-panel-best";
const CREDIT_STORAGE_KEY = "arcade-panel-bank";
const UPGRADE_STORAGE_KEY = "arcade-panel-upgrades";
const DEVICE_MODE_STORAGE_KEY = "arcade-panel-device-mode";
const numberFormat = new Intl.NumberFormat("en-US");

const GAME_MODES = [
  {
    id: "signal-loop",
    name: "Signal Loop",
    cardTag: "Orbit",
    teaser: "Catch clean pulses on a reactor ring and slip past red glitches.",
    summary:
      "Timing-focused orbit game built around rhythm, streaks, and shield management.",
    objective:
      "Blue pulses score. Red glitches burn your shield. Every 12-streak restores one shield segment.",
    controls:
      "Keyboard: use A, D, or arrow keys. Touch or mouse: drag around the arena ring to steer.",
    readyTag: "Arcade Panel",
    gameOverTag: "Loop Collapsed",
    startLabel: "Launch Signal Loop",
    readyBody:
      "Signal Loop is the orbit cabinet. Keep the ring clean, build long streaks, and hold the reactor together.",
    idlePrompt: "Catch pulses, dodge glitches",
    activePrompt: "Ride the ring",
    hud: {
      primaryLabel: "Shield",
      secondaryLabel: "Streak",
    },
    maxLives: 3,
    pulseWindow: 0.25,
    glitchWindow: 0.19,
    glitchBaseChance: 0.22,
    glitchChanceRamp: 0.028,
    glitchChanceMax: 0.5,
    spawnBase: 0.95,
    spawnRamp: 0.055,
    spawnFloor: 0.22,
    speedBonus: 16,
    pulseSpeedMin: 210,
    pulseSpeedMax: 270,
    glitchSpeedMin: 195,
    glitchSpeedMax: 255,
    extraPulseDifficulty: 5,
    extraPulseChance: 0.18,
    extraPulseSpeedMin: 225,
    extraPulseSpeedMax: 290,
    pulseSize: 13,
    glitchSize: 15,
    streakPatchEvery: 12,
    scoreBase: 12,
    streakBonus: 3,
    scoreBonusCap: 48,
    pulseColor: "#84f6ea",
    pulseCore: "#dffff8",
    glitchColor: "#ff7c65",
    accent: "#f4c96d",
    ringColor: "rgba(132, 246, 234, 0.22)",
    haloColor: "rgba(132, 246, 234, 0.18)",
    gridColor: "rgba(255, 255, 255, 0.05)",
    coreInner: "rgba(244, 201, 109, 0.95)",
    coreMid: "rgba(255, 124, 101, 0.82)",
    coreOuter: "rgba(255, 124, 101, 0.08)",
    bgStart: "#071018",
    bgMid: "#112538",
    bgEnd: "#1b3042",
    cockpitColor: "#0c5662",
  },
  {
    id: "meteor-drift",
    name: "Meteor Drift",
    cardTag: "Dodger",
    teaser: "Free-fly through a live debris field, collect shards, and avoid heavy rock.",
    summary:
      "Open-movement survival game where you drift through space, chase score pickups, and dodge incoming meteors.",
    objective:
      "Collect bright shards to score. Asteroids strip hull. Survive longer to push the wave count higher.",
    controls:
      "Keyboard: use W A S D or arrow keys. Touch or mouse: drag anywhere on the stage to pull the ship.",
    readyTag: "Deep Field",
    gameOverTag: "Hull Lost",
    startLabel: "Launch Meteor Drift",
    readyBody:
      "Meteor Drift is the free-flight cabinet. Pull your ship through the field, grab shards, and avoid direct impacts.",
    idlePrompt: "Collect shards, dodge meteors",
    activePrompt: "Drift the field",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#8effd8",
    pulseCore: "#f2fff9",
    glitchColor: "#ff7b64",
    accent: "#ffe17a",
    haloColor: "rgba(142, 255, 216, 0.18)",
    bgStart: "#071117",
    bgMid: "#0f2a32",
    bgEnd: "#153f47",
    cockpitColor: "#0d5561",
  },
  {
    id: "brick-burst",
    name: "Brick Burst",
    cardTag: "Breaker",
    teaser: "Slide a paddle, keep the orb alive, and crack a full wall of neon bricks.",
    summary:
      "Fast brick-breaker cabinet with wave-based walls, ball recovery windows, and score bursts on every break.",
    objective:
      "Break bricks to score. Clear the wall to advance waves. Dropping the orb costs a life.",
    controls:
      "Keyboard: use A, D, or arrow keys. Touch or mouse: drag horizontally to steer the paddle.",
    readyTag: "Wall Sweep",
    gameOverTag: "Cabinet Cold",
    startLabel: "Launch Brick Burst",
    readyBody:
      "Brick Burst is the paddle cabinet. Keep the orb in play, carve through the wall, and push into higher waves.",
    idlePrompt: "Clear every block",
    activePrompt: "Break the grid",
    hud: {
      primaryLabel: "Lives",
      secondaryLabel: "Bricks",
    },
    maxLives: 3,
    pulseColor: "#82d8ff",
    pulseCore: "#eef9ff",
    glitchColor: "#ff8f63",
    accent: "#ffd86f",
    haloColor: "rgba(130, 216, 255, 0.18)",
    bgStart: "#081019",
    bgMid: "#11253f",
    bgEnd: "#1b3557",
    cockpitColor: "#1f5e7d",
  },
  {
    id: "neon-drop",
    name: "Neon Drop",
    cardTag: "Lane",
    teaser: "Slide across bright lanes, catch score pods, and avoid falling mines.",
    summary:
      "Lane-based dodger where you ride a hover sled through dense traffic and collect score drops.",
    objective:
      "Catch bright pods to score. Red mines damage your hull. Later waves fall faster and crowd more lanes.",
    controls:
      "Keyboard: use A, D, or arrow keys. Touch or mouse: drag horizontally to move the sled.",
    readyTag: "Traffic Core",
    gameOverTag: "Drop Failed",
    startLabel: "Launch Neon Drop",
    readyBody:
      "Neon Drop is the lane cabinet. Slide between channels, harvest the good cargo, and keep mines off the sled.",
    idlePrompt: "Catch pods, dodge mines",
    activePrompt: "Hold the lanes",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#89ffcf",
    pulseCore: "#f1fff8",
    glitchColor: "#ff6e67",
    accent: "#ffe372",
    haloColor: "rgba(137, 255, 207, 0.18)",
    bgStart: "#091018",
    bgMid: "#14253a",
    bgEnd: "#20384f",
    cockpitColor: "#18556a",
  },
  {
    id: "wire-snake",
    name: "Wire Snake",
    cardTag: "Grid",
    teaser: "Guide a live signal snake across a board and keep it from tangling itself.",
    summary:
      "Grid snake cabinet with rising speed, clean directional control, and score pickups that grow your chain.",
    objective:
      "Eat glowing nodes to grow and score. Hitting the wall or your own wire ends the run immediately.",
    controls:
      "Keyboard: use W A S D or arrow keys. Touch or mouse: drag around the board to steer the next turn.",
    readyTag: "Grid Nest",
    gameOverTag: "Signal Cut",
    startLabel: "Launch Wire Snake",
    readyBody:
      "Wire Snake is the grid cabinet. Feed the chain, turn cleanly, and keep your own body from boxing you in.",
    idlePrompt: "Feed the chain",
    activePrompt: "Grow the wire",
    hud: {
      primaryLabel: "Length",
      secondaryLabel: "Speed",
    },
    maxLives: 1,
    pulseColor: "#9afc7f",
    pulseCore: "#f3ffe9",
    glitchColor: "#ff856b",
    accent: "#d8ff6d",
    haloColor: "rgba(154, 252, 127, 0.18)",
    bgStart: "#08110a",
    bgMid: "#12301b",
    bgEnd: "#1b4a2a",
    cockpitColor: "#1d6332",
  },
  {
    id: "turret-bloom",
    name: "Turret Bloom",
    cardTag: "Shooter",
    teaser: "Sweep a defense cannon across drone swarms and keep them off the core.",
    summary:
      "Auto-firing defense cabinet where you steer a bloom cannon and cut through incoming waves before they breach the base.",
    objective:
      "Aim the barrel, destroy drones for score, and stop anything from reaching the lower core.",
    controls:
      "Keyboard: use A, D, or arrow keys to rotate the cannon. Touch or mouse: drag anywhere on the arena to aim.",
    readyTag: "Bloom Forge",
    gameOverTag: "Core Breached",
    startLabel: "Launch Turret Bloom",
    readyBody:
      "Turret Bloom is the defense cabinet. Sweep the barrel, auto-fire, and keep the swarm away from the reactor.",
    idlePrompt: "Aim the bloom cannon",
    activePrompt: "Hold the line",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#94ccff",
    pulseCore: "#eef8ff",
    glitchColor: "#ff7c72",
    accent: "#ffd46a",
    haloColor: "rgba(148, 204, 255, 0.18)",
    bgStart: "#071019",
    bgMid: "#14243a",
    bgEnd: "#1d3452",
    cockpitColor: "#1f536f",
  },
  {
    id: "tunnel-rush",
    name: "Tunnel Rush",
    cardTag: "Runner",
    teaser: "Thread a slipstream glider through moving gates and harvest charge rings.",
    summary:
      "Side-scrolling tunnel runner where you ride a glider through shifting gate walls and skim rings for extra score.",
    objective:
      "Clear gate gaps to push the sector count higher. Charge rings score big, but clipping the wall burns hull.",
    controls:
      "Keyboard: use W, S, or arrow keys to climb and dive. Touch or mouse: drag vertically to steer the glider.",
    readyTag: "Slipstream",
    gameOverTag: "Tunnel Lost",
    startLabel: "Launch Tunnel Rush",
    readyBody:
      "Tunnel Rush is the glide cabinet. Hold the line through the corridor, hit the gaps cleanly, and collect the rings.",
    idlePrompt: "Thread the gates",
    activePrompt: "Ride the slipstream",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Sector",
    },
    maxLives: 3,
    pulseColor: "#9bffda",
    pulseCore: "#effff9",
    glitchColor: "#ff8472",
    accent: "#ffe27b",
    haloColor: "rgba(155, 255, 218, 0.17)",
    bgStart: "#071018",
    bgMid: "#11303a",
    bgEnd: "#1c4b54",
    cockpitColor: "#1a5961",
  },
  {
    id: "circuit-pong",
    name: "Circuit Pong",
    cardTag: "Duel",
    teaser: "Defend the left rail, break the AI return, and push the rally higher.",
    summary:
      "Neon pong cabinet with rising volley speed, score bursts on clean breaks, and survival tied to your missed returns.",
    objective:
      "Keep the orb alive, beat the right paddle, and avoid misses on your side of the field.",
    controls:
      "Keyboard: use W, S, or arrow keys to move the paddle. Touch or mouse: drag vertically on the stage to track the ball.",
    readyTag: "Duel Rail",
    gameOverTag: "Left Rail Lost",
    startLabel: "Launch Circuit Pong",
    readyBody:
      "Circuit Pong is the duel cabinet. Track the orb, win the exchange, and stop the AI from forcing a clean past.",
    idlePrompt: "Hold the left rail",
    activePrompt: "Break the return",
    hud: {
      primaryLabel: "Lives",
      secondaryLabel: "Rally",
    },
    maxLives: 3,
    pulseColor: "#97e6ff",
    pulseCore: "#f0fbff",
    glitchColor: "#ff8f74",
    accent: "#ffe07c",
    haloColor: "rgba(151, 230, 255, 0.18)",
    bgStart: "#07111a",
    bgMid: "#14253d",
    bgEnd: "#1d3654",
    cockpitColor: "#225c77",
  },
  {
    id: "crosswalk-flux",
    name: "Crosswalk Flux",
    cardTag: "Hopper",
    teaser: "Cut through flowing traffic lanes and reach the top gate before the next hit.",
    summary:
      "Traffic-dodging crossing cabinet where you weave a courier sled through live lanes and bank score on every clean run.",
    objective:
      "Move from the lower dock to the top gate. Cars cost hull, and each successful crossing makes the stream faster.",
    controls:
      "Keyboard: use W A S D or arrow keys to move. Touch or mouse: drag anywhere on the arena to steer the courier.",
    readyTag: "Flux Crossing",
    gameOverTag: "Courier Down",
    startLabel: "Launch Crosswalk Flux",
    readyBody:
      "Crosswalk Flux is the lane-crossing cabinet. Cut through traffic, hit the upper gate, and survive the faster cycles.",
    idlePrompt: "Cross the lanes",
    activePrompt: "Beat the stream",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Crossings",
    },
    maxLives: 3,
    pulseColor: "#97ffd2",
    pulseCore: "#effff8",
    glitchColor: "#ff756e",
    accent: "#ffe46f",
    haloColor: "rgba(151, 255, 210, 0.18)",
    bgStart: "#081118",
    bgMid: "#13323d",
    bgEnd: "#214b55",
    cockpitColor: "#1e6067",
  },
  {
    id: "beacon-climb",
    name: "Beacon Climb",
    cardTag: "Climb",
    teaser: "Ride rebound pads upward, catch star beacons, and keep the fall from swallowing the run.",
    summary:
      "Vertical climbing cabinet built around momentum bounces, platform reading, and altitude-driven score pressure.",
    objective:
      "Land on platforms to bounce higher. Star beacons score big, and falling below the frame costs a life.",
    controls:
      "Keyboard: use A, D, or arrow keys to drift sideways. Touch or mouse: drag horizontally to slide under the next pad.",
    readyTag: "Sky Shaft",
    gameOverTag: "Signal Dropped",
    startLabel: "Launch Beacon Climb",
    readyBody:
      "Beacon Climb is the ascent cabinet. Chain clean landings, catch the stars, and push the shaft higher.",
    idlePrompt: "Climb the shaft",
    activePrompt: "Ride the rebound",
    hud: {
      primaryLabel: "Lives",
      secondaryLabel: "Height",
    },
    maxLives: 3,
    pulseColor: "#a8d8ff",
    pulseCore: "#f5fbff",
    glitchColor: "#ff8a6f",
    accent: "#ffe06c",
    haloColor: "rgba(168, 216, 255, 0.16)",
    bgStart: "#07101a",
    bgMid: "#16314e",
    bgEnd: "#21476a",
    cockpitColor: "#2b5c82",
  },
  {
    id: "gem-digger",
    name: "Gem Digger",
    cardTag: "Miner",
    teaser: "Cut tunnels through soft earth, strip the cave of gems, and outstep the beetles.",
    summary:
      "Grid miner cabinet with fast route planning, cave clears, and enemy pressure that tightens each round.",
    objective:
      "Collect every gem in the cave. Beetles cost hull on contact. Clear a cave to advance to a denser one.",
    controls:
      "Keyboard: use W A S D or arrow keys to move cell by cell. Touch or mouse: drag around the miner to queue the next step.",
    readyTag: "Deep Cut",
    gameOverTag: "Miner Lost",
    startLabel: "Launch Gem Digger",
    readyBody:
      "Gem Digger is the cave cabinet. Open routes, grab the haul, and stay out of the beetles' line.",
    idlePrompt: "Strip the cave",
    activePrompt: "Cut the tunnel",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Gems",
    },
    maxLives: 3,
    pulseColor: "#95ffb7",
    pulseCore: "#f2fff5",
    glitchColor: "#ff7c68",
    accent: "#ffd96b",
    haloColor: "rgba(149, 255, 183, 0.16)",
    bgStart: "#0a110d",
    bgMid: "#1a3423",
    bgEnd: "#285136",
    cockpitColor: "#295c3c",
  },
  {
    id: "blade-halo",
    name: "Blade Halo",
    cardTag: "Spin",
    teaser: "Move through a rotating blade ring, skim the cores, and survive the faster halo.",
    summary:
      "Arena survival cabinet where spinning arms sweep the field while collectible cores lure you into narrow timing windows.",
    objective:
      "Collect bright cores for score and stay clear of the rotating blades. Later waves add more arms and speed.",
    controls:
      "Keyboard: use W A S D or arrow keys to move. Touch or mouse: drag anywhere inside the arena to guide the skimmer.",
    readyTag: "Halo Field",
    gameOverTag: "Ring Breach",
    startLabel: "Launch Blade Halo",
    readyBody:
      "Blade Halo is the spin cabinet. Work the gaps, cut through the ring, and take the cores without losing the skimmer.",
    idlePrompt: "Work the gaps",
    activePrompt: "Survive the halo",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#9fd6ff",
    pulseCore: "#eef8ff",
    glitchColor: "#ff7a72",
    accent: "#ffe37a",
    haloColor: "rgba(159, 214, 255, 0.16)",
    bgStart: "#071019",
    bgMid: "#163044",
    bgEnd: "#203f59",
    cockpitColor: "#26586f",
  },
  {
    id: "pulse-invaders",
    name: "Pulse Invaders",
    cardTag: "Blast",
    teaser: "Sweep a bottom rail, auto-fire upward, and clear the descending formation.",
    summary:
      "Fixed-lane shooter cabinet built around wave clears, enemy volleys, and formation pressure as the line drops lower.",
    objective:
      "Destroy the invader grid, dodge enemy fire, and stop the formation before it reaches the lower rail.",
    controls:
      "Keyboard: use A, D, or arrow keys to move. Touch or mouse: drag horizontally to slide the ship.",
    readyTag: "Pulse Front",
    gameOverTag: "Front Broken",
    startLabel: "Launch Pulse Invaders",
    readyBody:
      "Pulse Invaders is the fixed shooter cabinet. Hold the line, cut through the formation, and survive the return fire.",
    idlePrompt: "Break the formation",
    activePrompt: "Hold the front",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#9be2ff",
    pulseCore: "#f2fbff",
    glitchColor: "#ff8372",
    accent: "#ffe577",
    haloColor: "rgba(155, 226, 255, 0.16)",
    bgStart: "#06101a",
    bgMid: "#16283d",
    bgEnd: "#20395a",
    cockpitColor: "#285a77",
  },
  {
    id: "drone-siege",
    name: "Drone Siege",
    cardTag: "Siege",
    teaser: "Trade fire with heavier drones and stop the breach before the wall collapses.",
    summary:
      "Dense siege shooter with sturdier drones, harder volleys, and slower but more punishing formation drops.",
    objective:
      "Burn through the drone wall, survive incoming bolts, and keep the siege line off the base.",
    controls:
      "Keyboard: use A, D, or arrow keys to move. Touch or mouse: drag horizontally to steer the interceptor.",
    readyTag: "Siege Grid",
    gameOverTag: "Wall Folded",
    startLabel: "Launch Drone Siege",
    readyBody:
      "Drone Siege is the pressure shooter cabinet. The wall is heavier, the shots hit harder, and the grid keeps falling.",
    idlePrompt: "Break the siege wall",
    activePrompt: "Trade the volleys",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Wave",
    },
    maxLives: 3,
    pulseColor: "#98d2ff",
    pulseCore: "#eef7ff",
    glitchColor: "#ff7b68",
    accent: "#ffd86f",
    haloColor: "rgba(152, 210, 255, 0.16)",
    bgStart: "#071019",
    bgMid: "#1a2840",
    bgEnd: "#263a57",
    cockpitColor: "#305a74",
  },
  {
    id: "star-lander",
    name: "Star Lander",
    cardTag: "Lander",
    teaser: "Feather the thrusters, settle onto the pad, and chain clean touchdowns.",
    summary:
      "Arcade lander cabinet centered on thrust control, safe descent windows, and repeated precision landings.",
    objective:
      "Touch down softly on the pad. Hard impacts or missed landings cost hull.",
    controls:
      "Keyboard: use A, D, or arrow keys to drift. Hold W, up, or drag upward to fire the main thruster.",
    readyTag: "Landing Bay",
    gameOverTag: "Hull Crumpled",
    startLabel: "Launch Star Lander",
    readyBody:
      "Star Lander is the descent cabinet. Trim the fall, line up on the pad, and keep every touchdown clean.",
    idlePrompt: "Trim the descent",
    activePrompt: "Find the pad",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Landings",
    },
    maxLives: 3,
    pulseColor: "#9ff3dd",
    pulseCore: "#f4fff9",
    glitchColor: "#ff826f",
    accent: "#ffe47a",
    haloColor: "rgba(159, 243, 221, 0.16)",
    bgStart: "#071118",
    bgMid: "#15313a",
    bgEnd: "#234c56",
    cockpitColor: "#275f67",
  },
  {
    id: "cargo-drop",
    name: "Cargo Drop",
    cardTag: "Dock",
    teaser: "Land on a moving deck, fight the heavier drift, and keep the cargo intact.",
    summary:
      "Harder moving-pad lander where the dock slides under you and the ship has to absorb stronger descent pressure.",
    objective:
      "Land softly on the moving barge. Missing the deck or hitting too hard costs hull.",
    controls:
      "Keyboard: use A, D, or arrow keys to drift. Hold W, up, or drag upward to burn the main thruster.",
    readyTag: "Cargo Bay",
    gameOverTag: "Drop Failed",
    startLabel: "Launch Cargo Drop",
    readyBody:
      "Cargo Drop is the moving-pad cabinet. The dock shifts under pressure, so every descent needs a cleaner approach.",
    idlePrompt: "Meet the moving deck",
    activePrompt: "Set it down clean",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Docks",
    },
    maxLives: 3,
    pulseColor: "#a0e8ff",
    pulseCore: "#f1fbff",
    glitchColor: "#ff8a71",
    accent: "#ffe070",
    haloColor: "rgba(160, 232, 255, 0.16)",
    bgStart: "#06101a",
    bgMid: "#1b2b40",
    bgEnd: "#27415d",
    cockpitColor: "#2d6079",
  },
  {
    id: "maze-chase",
    name: "Maze Chase",
    cardTag: "Maze",
    teaser: "Sweep the corridors, clear the node field, and stay ahead of the wardens.",
    summary:
      "Grid maze cabinet with pathing pressure, full-board clears, and enemy pursuit that tightens each round.",
    objective:
      "Collect every node in the maze. Warden contact costs hull.",
    controls:
      "Keyboard: use W A S D or arrow keys to move cell by cell. Touch or mouse: drag from the courier to queue turns.",
    readyTag: "Node Maze",
    gameOverTag: "Maze Sealed",
    startLabel: "Launch Maze Chase",
    readyBody:
      "Maze Chase is the corridor cabinet. Sweep the board, keep the route clean, and stay away from the wardens.",
    idlePrompt: "Sweep the nodes",
    activePrompt: "Stay ahead of the wardens",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Nodes",
    },
    maxLives: 3,
    pulseColor: "#9effbe",
    pulseCore: "#f3fff6",
    glitchColor: "#ff7d6b",
    accent: "#ffe278",
    haloColor: "rgba(158, 255, 190, 0.16)",
    bgStart: "#07100d",
    bgMid: "#173324",
    bgEnd: "#25513a",
    cockpitColor: "#2d6446",
  },
  {
    id: "vault-run",
    name: "Vault Run",
    cardTag: "Vault",
    teaser: "Strip keycards from the halls, cut around sentries, and clear the whole vault.",
    summary:
      "Sharper maze-clear cabinet with tighter corridors, faster sentries, and full-room clears to open the next vault.",
    objective:
      "Collect every keycard in the vault. Getting tagged by a sentry costs hull.",
    controls:
      "Keyboard: use W A S D or arrow keys to move cell by cell. Touch or mouse: drag from the runner to set the next turn.",
    readyTag: "Cold Vault",
    gameOverTag: "Vault Locked",
    startLabel: "Launch Vault Run",
    readyBody:
      "Vault Run is the tighter maze cabinet. Strip the room, route around the sentries, and unlock the next vault.",
    idlePrompt: "Strip the vault",
    activePrompt: "Route the heist",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Cards",
    },
    maxLives: 3,
    pulseColor: "#a6ffcc",
    pulseCore: "#f4fff8",
    glitchColor: "#ff866d",
    accent: "#ffe06f",
    haloColor: "rgba(166, 255, 204, 0.16)",
    bgStart: "#08100d",
    bgMid: "#203426",
    bgEnd: "#2e513b",
    cockpitColor: "#355b47",
  },
  {
    id: "rail-jumper",
    name: "Rail Jumper",
    cardTag: "Jump",
    teaser: "Sprint a live rail line, clear the barriers, and keep the run from clipping out.",
    summary:
      "Auto-run jumper cabinet built around clean hop timing, distance pressure, and quick score pickups between barriers.",
    objective:
      "Jump the barriers, keep the run alive, and push the distance counter higher.",
    controls:
      "Keyboard: use W, up, or tap above the runner to jump. A and D make short air adjustments.",
    readyTag: "Rail Line",
    gameOverTag: "Run Broken",
    startLabel: "Launch Rail Jumper",
    readyBody:
      "Rail Jumper is the sprint cabinet. Read the rail, hit the jumps on time, and keep the line alive.",
    idlePrompt: "Clear the barriers",
    activePrompt: "Ride the rail",
    hud: {
      primaryLabel: "Lives",
      secondaryLabel: "Distance",
    },
    maxLives: 3,
    pulseColor: "#a7d8ff",
    pulseCore: "#f4fbff",
    glitchColor: "#ff7d71",
    accent: "#ffe36f",
    haloColor: "rgba(167, 216, 255, 0.16)",
    bgStart: "#071019",
    bgMid: "#183149",
    bgEnd: "#234767",
    cockpitColor: "#2a5d82",
  },
  {
    id: "roof-runner",
    name: "Roof Runner",
    cardTag: "Sprint",
    teaser: "Cross fast rooftops, jump the vents, and duck the hanging signs.",
    summary:
      "Faster endless runner with mixed obstacle heights, duck timing, and longer sections between safe resets.",
    objective:
      "Jump low obstacles, duck under signs, and keep the rooftop route intact.",
    controls:
      "Keyboard: use W or up to jump, S or down to duck. Touch or mouse: drag above to jump and below to duck.",
    readyTag: "Roofline",
    gameOverTag: "Roofline Lost",
    startLabel: "Launch Roof Runner",
    readyBody:
      "Roof Runner is the mixed-obstacle sprint cabinet. The signs sit low, the vents sit high, and the line never slows down.",
    idlePrompt: "Read the skyline",
    activePrompt: "Jump and duck clean",
    hud: {
      primaryLabel: "Lives",
      secondaryLabel: "Distance",
    },
    maxLives: 3,
    pulseColor: "#9fd0ff",
    pulseCore: "#eff8ff",
    glitchColor: "#ff846f",
    accent: "#ffd96d",
    haloColor: "rgba(159, 208, 255, 0.16)",
    bgStart: "#071018",
    bgMid: "#1d2b43",
    bgEnd: "#293d5d",
    cockpitColor: "#31576f",
  },
  {
    id: "astro-rescue",
    name: "Astro Rescue",
    cardTag: "Rescue",
    teaser: "Pick up stranded pods, drag them back to the core, and keep the swarm off the lane.",
    summary:
      "Delivery arena cabinet where you recover pods from open space, tow them back to the hub, and dodge interceptors.",
    objective:
      "Grab stranded pods and return them to the hub. Interceptor contact costs hull and drops the payload.",
    controls:
      "Keyboard: use W A S D or arrow keys to move. Touch or mouse: drag anywhere in the arena to steer.",
    readyTag: "Beacon Net",
    gameOverTag: "Rescue Lost",
    startLabel: "Launch Astro Rescue",
    readyBody:
      "Astro Rescue is the recovery cabinet. Reach the pod, bring it home, and keep the interceptors off your hull.",
    idlePrompt: "Bring the pods home",
    activePrompt: "Tow the rescue",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Rescues",
    },
    maxLives: 3,
    pulseColor: "#9cf2de",
    pulseCore: "#f1fff9",
    glitchColor: "#ff7d6f",
    accent: "#ffe479",
    haloColor: "rgba(156, 242, 222, 0.16)",
    bgStart: "#071118",
    bgMid: "#15303c",
    bgEnd: "#214857",
    cockpitColor: "#285f69",
  },
  {
    id: "shock-swarm",
    name: "Shock Swarm",
    cardTag: "Swarm",
    teaser: "Carry volatile cells back to the hub while faster hunters close in from every side.",
    summary:
      "Harder delivery-survival cabinet with heavier swarm pressure, faster hunters, and tighter routes back to the core.",
    objective:
      "Recover charge cells and bank them at the hub. Hunter contact costs hull and drops the cell.",
    controls:
      "Keyboard: use W A S D or arrow keys to move. Touch or mouse: drag anywhere in the arena to guide the skimmer.",
    readyTag: "Shock Net",
    gameOverTag: "Swarm Closed",
    startLabel: "Launch Shock Swarm",
    readyBody:
      "Shock Swarm is the hostile recovery cabinet. Grab the cell, break through the hunters, and get it back to core.",
    idlePrompt: "Break the swarm",
    activePrompt: "Bank the cells",
    hud: {
      primaryLabel: "Hull",
      secondaryLabel: "Deliveries",
    },
    maxLives: 3,
    pulseColor: "#a3ebff",
    pulseCore: "#f3fbff",
    glitchColor: "#ff846d",
    accent: "#ffe170",
    haloColor: "rgba(163, 235, 255, 0.16)",
    bgStart: "#071019",
    bgMid: "#1a2e44",
    bgEnd: "#284661",
    cockpitColor: "#315e73",
  },
];

const STORE_ITEMS = [
  {
    id: "thruster_tune",
    name: "Thruster Tune",
    description: "Faster ships, sleds, and paddles in movement-based cabinets.",
    baseCost: 140,
    stepCost: 110,
    maxLevel: 5,
    getEffect: (level) => `Move speed +${level * 10}%`,
  },
  {
    id: "armor_plating",
    name: "Armor Plating",
    description: "Extra starting durability for life-based cabinets and longer wire starts.",
    baseCost: 220,
    stepCost: 160,
    maxLevel: 3,
    getEffect: (level) =>
      level === 0 ? "No bonus yet" : `Extra start buffer +${level}`,
  },
  {
    id: "prize_uplink",
    name: "Prize Uplink",
    description: "Raises score gained across every cabinet.",
    baseCost: 180,
    stepCost: 140,
    maxLevel: 5,
    getEffect: (level) => `Score bonus +${level * 12}%`,
  },
  {
    id: "credit_cache",
    name: "Credit Cache",
    description: "Banks more credits from each completed run.",
    baseCost: 170,
    stepCost: 130,
    maxLevel: 5,
    getEffect: (level) => `Credit gain +${level * 15}%`,
  },
];

const DEFAULT_UPGRADES = Object.fromEntries(
  STORE_ITEMS.map((item) => [item.id, 0]),
);

const stars = Array.from({ length: 90 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: randomBetween(1, 3.4),
  alpha: randomBetween(0.14, 0.5),
  phase: Math.random() * TAU,
}));

const state = {
  mode: GAME_MODES[0],
  deviceMode: readDeviceMode(),
  running: false,
  ended: false,
  visualTime: 0,
  best: readBestScore(GAME_MODES[0].id),
  bank: readCredits(),
  runtime: null,
  flash: 0,
  shake: 0,
  lastReward: 0,
  upgrades: readUpgrades(),
  input: {
    pointerActive: false,
    pointerX: CENTER,
    pointerY: CENTER,
    left: false,
    right: false,
    up: false,
    down: false,
  },
};

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wrapAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function angleDelta(target, current) {
  return wrapAngle(target - current);
}

function polarToCartesian(angle, radius) {
  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function distancePointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return distance(px, py, x1, y1);
  }

  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  const nearestX = x1 + dx * t;
  const nearestY = y1 + dy * t;
  return distance(px, py, nearestX, nearestY);
}

function getStorageKey(modeId) {
  return `${STORAGE_PREFIX}-${modeId}`;
}

function getDefaultDeviceMode() {
  return window.matchMedia("(max-width: 820px)").matches ? "phone" : "desktop";
}

function readDeviceMode() {
  try {
    const stored = localStorage.getItem(DEVICE_MODE_STORAGE_KEY);
    return stored === "phone" || stored === "desktop" ? stored : getDefaultDeviceMode();
  } catch {
    return getDefaultDeviceMode();
  }
}

function writeDeviceMode() {
  try {
    localStorage.setItem(DEVICE_MODE_STORAGE_KEY, state.deviceMode);
  } catch {
    return;
  }
}

function readCredits() {
  try {
    return Number.parseInt(localStorage.getItem(CREDIT_STORAGE_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function writeCredits() {
  try {
    localStorage.setItem(CREDIT_STORAGE_KEY, String(state.bank));
  } catch {
    return;
  }
}

function readUpgrades() {
  try {
    const raw = localStorage.getItem(UPGRADE_STORAGE_KEY);

    if (!raw) {
      return { ...DEFAULT_UPGRADES };
    }

    const parsed = JSON.parse(raw);
    return { ...DEFAULT_UPGRADES, ...parsed };
  } catch {
    return { ...DEFAULT_UPGRADES };
  }
}

function writeUpgrades() {
  try {
    localStorage.setItem(UPGRADE_STORAGE_KEY, JSON.stringify(state.upgrades));
  } catch {
    return;
  }
}

function readBestScore(modeId) {
  try {
    return Number.parseInt(localStorage.getItem(getStorageKey(modeId)) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(modeId, score) {
  try {
    localStorage.setItem(getStorageKey(modeId), String(score));
  } catch {
    return;
  }
}

function getUpgradeLevel(id) {
  return state.upgrades[id] || 0;
}

function getUpgradeCost(item, level = getUpgradeLevel(item.id)) {
  return item.baseCost + item.stepCost * level;
}

function getControlMultiplier(mode = state.mode) {
  if (mode.id === "wire-snake") {
    return 1;
  }

  return 1 + getUpgradeLevel("thruster_tune") * 0.1;
}

function getScoreMultiplier() {
  return 1 + getUpgradeLevel("prize_uplink") * 0.12;
}

function getCreditMultiplier() {
  return 1 + getUpgradeLevel("credit_cache") * 0.15;
}

function getLifeCap(mode = state.mode) {
  if (mode.id === "wire-snake") {
    return mode.maxLives;
  }

  return mode.maxLives + getUpgradeLevel("armor_plating");
}

function getSnakeStartLength() {
  return 3 + getUpgradeLevel("armor_plating");
}

function addScore(runtime, basePoints) {
  const awarded = Math.max(1, Math.round(basePoints * getScoreMultiplier()));
  runtime.score += awarded;
  state.best = Math.max(state.best, runtime.score);
  return awarded;
}

function updateBankUi() {
  bankValue.textContent = `${numberFormat.format(state.bank)} credits`;

  if (state.lastReward > 0) {
    bankNote.textContent = `Last run banked +${numberFormat.format(state.lastReward)} credits.`;
    return;
  }

  bankNote.textContent = "Earn score in any cabinet and spend it on permanent upgrades.";
}

function getModeControlsText(mode = state.mode) {
  const touchMarker = "Touch or mouse:";
  const touchIndex = mode.controls.indexOf(touchMarker);

  if (state.deviceMode === "phone") {
    if (touchIndex >= 0) {
      return `Phone mode. ${mode.controls.slice(touchIndex).trim()}`;
    }

    return `Phone mode. ${mode.controls}`;
  }

  if (touchIndex >= 0) {
    return `Computer mode. ${mode.controls.slice(0, touchIndex).trim()}`;
  }

  return `Computer mode. ${mode.controls}`;
}

function updateDeviceModeButton() {
  const label = state.deviceMode === "phone" ? "Phone" : "Computer";
  const pressed = state.deviceMode === "phone";

  deviceModeButton.textContent = `Mode: ${label}`;
  deviceModeButton.setAttribute("aria-pressed", pressed ? "true" : "false");
}

function applyDeviceMode() {
  document.body.dataset.deviceMode = state.deviceMode;
  updateDeviceModeButton();
}

function toggleDeviceMode() {
  state.deviceMode = state.deviceMode === "phone" ? "desktop" : "phone";
  writeDeviceMode();
  applyDeviceMode();
  updateModeUi();
}

function syncTheme() {
  document.documentElement.style.setProperty("--mode-accent", state.mode.accent);
  document.documentElement.style.setProperty("--mode-pulse", state.mode.pulseColor);
  document.documentElement.style.setProperty("--mode-glitch", state.mode.glitchColor);
}

function renderLibrary() {
  gameLibrary.innerHTML = GAME_MODES.map(
    (mode) => `
      <button
        class="game-card${mode.id === state.mode.id ? " is-selected" : ""}"
        type="button"
        data-mode-id="${mode.id}"
        aria-pressed="${mode.id === state.mode.id ? "true" : "false"}"
        style="--card-accent: ${mode.accent}; --card-pulse: ${mode.pulseColor};"
      >
        <span class="game-card-tag">${mode.cardTag}</span>
        <strong class="game-card-title">${mode.name}</strong>
        <span class="game-card-copy">${mode.teaser}</span>
      </button>
    `,
  ).join("");
}

function renderStore() {
  updateBankUi();

  storeGrid.innerHTML = STORE_ITEMS.map((item) => {
    const level = getUpgradeLevel(item.id);
    const maxed = level >= item.maxLevel;
    const cost = getUpgradeCost(item, level);
    const canAfford = state.bank >= cost;
    const label = maxed
      ? "Maxed"
      : canAfford
        ? `Buy ${numberFormat.format(cost)}`
        : `Need ${numberFormat.format(cost)}`;

    return `
      <article class="store-card${maxed ? " is-maxed" : ""}">
        <div>
          <div class="store-level">
            <span>Level ${level} / ${item.maxLevel}</span>
            <span>${maxed ? "Complete" : `Next ${numberFormat.format(cost)}`}</span>
          </div>
          <strong class="store-title">${item.name}</strong>
          <p class="store-copy">${item.description}</p>
          <p class="store-effect">${item.getEffect(level)}</p>
        </div>
        <button
          class="store-button"
          type="button"
          data-upgrade-id="${item.id}"
          ${maxed || !canAfford ? "disabled" : ""}
        >
          ${label}
        </button>
      </article>
    `;
  }).join("");
}

function buyUpgrade(upgradeId) {
  const item = STORE_ITEMS.find((candidate) => candidate.id === upgradeId);

  if (!item) {
    return;
  }

  const currentLevel = getUpgradeLevel(item.id);
  if (currentLevel >= item.maxLevel) {
    return;
  }

  const cost = getUpgradeCost(item, currentLevel);
  if (state.bank < cost) {
    return;
  }

  state.bank -= cost;
  state.upgrades[item.id] = currentLevel + 1;
  state.lastReward = 0;
  writeCredits();
  writeUpgrades();
  renderStore();

  if (!state.running) {
    state.runtime = createRuntimeForMode(state.mode);
    updateHud();
    render();
  }
}

function updateModeUi() {
  syncTheme();
  renderLibrary();
  renderStore();
  selectedTag.textContent = `Selected: ${state.mode.name}`;
  modeNameValue.textContent = state.mode.name;
  stageTitle.textContent = state.mode.name;
  primaryLabel.textContent = state.mode.hud.primaryLabel;
  secondaryLabel.textContent = state.mode.hud.secondaryLabel;
  rulebookTitle.textContent = `${state.mode.name} Brief`;
  modeSummary.textContent = state.mode.summary;
  modeObjective.textContent = state.mode.objective;
  modeControls.textContent = getModeControlsText(state.mode);
}

function setOverlay(tag, title, body, buttonLabel) {
  overlayTag.textContent = tag;
  overlayTitle.textContent = title;
  overlayBody.textContent = body;
  overlayButton.textContent = buttonLabel;
}

function setPreviewOverlay() {
  setOverlay(
    state.mode.readyTag,
    state.mode.name,
    state.mode.readyBody,
    state.mode.startLabel,
  );
  overlayPanelButton.hidden = true;
}

function showOverlay() {
  overlay.classList.remove("is-hidden");
}

function hideOverlay() {
  overlay.classList.add("is-hidden");
}

function updateButtons() {
  const launchLabel = state.running
    ? `Restart ${state.mode.name}`
    : state.ended
      ? `Play ${state.mode.name} Again`
      : state.mode.startLabel;

  sidebarButton.textContent = launchLabel;
  overlayButton.textContent = launchLabel;

  const showPanelControls = state.running || state.ended;
  panelButton.hidden = !showPanelControls;
  stagePanelButton.hidden = !showPanelControls;
}

function getHud() {
  switch (state.mode.id) {
    case "meteor-drift":
      return getMeteorDriftHud(state.runtime);
    case "brick-burst":
      return getBrickBurstHud(state.runtime);
    case "neon-drop":
      return getNeonDropHud(state.runtime);
    case "wire-snake":
      return getWireSnakeHud(state.runtime);
    case "turret-bloom":
      return getTurretBloomHud(state.runtime);
    case "tunnel-rush":
      return getTunnelRushHud(state.runtime);
    case "circuit-pong":
      return getCircuitPongHud(state.runtime);
    case "crosswalk-flux":
      return getCrosswalkFluxHud(state.runtime);
    case "beacon-climb":
      return getBeaconClimbHud(state.runtime);
    case "gem-digger":
      return getGemDiggerHud(state.runtime);
    case "blade-halo":
      return getBladeHaloHud(state.runtime);
    case "pulse-invaders":
    case "drone-siege":
      return getPulseInvadersHud(state.runtime);
    case "star-lander":
    case "cargo-drop":
      return getStarLanderHud(state.runtime);
    case "maze-chase":
    case "vault-run":
      return getMazeChaseHud(state.runtime);
    case "rail-jumper":
    case "roof-runner":
      return getRailJumperHud(state.runtime);
    case "astro-rescue":
    case "shock-swarm":
      return getAstroRescueHud(state.runtime);
    case "signal-loop":
    default:
      return getSignalLoopHud(state.runtime);
  }
}

function updateHud() {
  const hud = getHud();
  scoreValue.textContent = numberFormat.format(hud.score);
  bestValue.textContent = numberFormat.format(state.best);
  primaryValue.textContent = hud.primaryValue;
  secondaryValue.textContent = hud.secondaryValue;
  statusValue.textContent = hud.status;
}

function createRuntimeForMode(mode) {
  switch (mode.id) {
    case "meteor-drift":
      return createMeteorDriftRuntime(mode);
    case "brick-burst":
      return createBrickBurstRuntime(mode);
    case "neon-drop":
      return createNeonDropRuntime(mode);
    case "wire-snake":
      return createWireSnakeRuntime(mode);
    case "turret-bloom":
      return createTurretBloomRuntime(mode);
    case "tunnel-rush":
      return createTunnelRushRuntime(mode);
    case "circuit-pong":
      return createCircuitPongRuntime(mode);
    case "crosswalk-flux":
      return createCrosswalkFluxRuntime(mode);
    case "beacon-climb":
      return createBeaconClimbRuntime(mode);
    case "gem-digger":
      return createGemDiggerRuntime(mode);
    case "blade-halo":
      return createBladeHaloRuntime(mode);
    case "pulse-invaders":
    case "drone-siege":
      return createPulseInvadersRuntime(mode);
    case "star-lander":
    case "cargo-drop":
      return createStarLanderRuntime(mode);
    case "maze-chase":
    case "vault-run":
      return createMazeChaseRuntime(mode);
    case "rail-jumper":
    case "roof-runner":
      return createRailJumperRuntime(mode);
    case "astro-rescue":
    case "shock-swarm":
      return createAstroRescueRuntime(mode);
    case "signal-loop":
    default:
      return createSignalLoopRuntime(mode);
  }
}

function handleRoundEnd() {
  state.running = false;
  state.ended = true;

  const finalScore = getHud().score;
  const reward = Math.max(0, Math.round(finalScore * getCreditMultiplier()));
  state.lastReward = reward;

  if (reward > 0) {
    state.bank += reward;
    writeCredits();
  }

  const storedBest = readBestScore(state.mode.id);
  if (state.best > storedBest) {
    writeBestScore(state.mode.id, state.best);
  }

  renderStore();

  setOverlay(
    state.mode.gameOverTag,
    state.mode.name,
    `${getGameOverBody()} Banked ${numberFormat.format(reward)} credits.`,
    `Play ${state.mode.name} Again`,
  );
  overlayPanelButton.hidden = false;
  showOverlay();
  updateButtons();
  updateHud();
}

function getGameOverBody() {
  switch (state.mode.id) {
    case "meteor-drift":
      return getMeteorDriftGameOverBody(state.runtime);
    case "brick-burst":
      return getBrickBurstGameOverBody(state.runtime);
    case "neon-drop":
      return getNeonDropGameOverBody(state.runtime);
    case "wire-snake":
      return getWireSnakeGameOverBody(state.runtime);
    case "turret-bloom":
      return getTurretBloomGameOverBody(state.runtime);
    case "tunnel-rush":
      return getTunnelRushGameOverBody(state.runtime);
    case "circuit-pong":
      return getCircuitPongGameOverBody(state.runtime);
    case "crosswalk-flux":
      return getCrosswalkFluxGameOverBody(state.runtime);
    case "beacon-climb":
      return getBeaconClimbGameOverBody(state.runtime);
    case "gem-digger":
      return getGemDiggerGameOverBody(state.runtime);
    case "blade-halo":
      return getBladeHaloGameOverBody(state.runtime);
    case "pulse-invaders":
    case "drone-siege":
      return getPulseInvadersGameOverBody(state.runtime);
    case "star-lander":
    case "cargo-drop":
      return getStarLanderGameOverBody(state.runtime);
    case "maze-chase":
    case "vault-run":
      return getMazeChaseGameOverBody(state.runtime);
    case "rail-jumper":
    case "roof-runner":
      return getRailJumperGameOverBody(state.runtime);
    case "astro-rescue":
    case "shock-swarm":
      return getAstroRescueGameOverBody(state.runtime);
    case "signal-loop":
    default:
      return getSignalLoopGameOverBody(state.runtime);
  }
}

function launchCurrentMode() {
  state.best = readBestScore(state.mode.id);
  state.runtime = createRuntimeForMode(state.mode);
  state.running = true;
  state.ended = false;
  state.flash = 0;
  state.shake = 0;
  state.input.pointerActive = false;
  hideOverlay();
  updateButtons();
  updateHud();
}

function returnToPanel() {
  state.best = readBestScore(state.mode.id);
  state.runtime = createRuntimeForMode(state.mode);
  state.running = false;
  state.ended = false;
  state.flash = 0;
  state.shake = 0;
  state.input.pointerActive = false;
  setPreviewOverlay();
  showOverlay();
  updateModeUi();
  updateButtons();
  updateHud();
}

function selectMode(modeId) {
  const nextMode = GAME_MODES.find((mode) => mode.id === modeId);

  if (!nextMode) {
    return;
  }

  state.mode = nextMode;
  returnToPanel();
}

function emitParticles(target, x, y, color, amount, minSpeed, maxSpeed) {
  for (let index = 0; index < amount; index += 1) {
    const angle = Math.random() * TAU;
    const speed = randomBetween(minSpeed, maxSpeed);
    const life = randomBetween(0.35, 0.9);

    target.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randomBetween(2, 6),
      life,
      maxLife: life,
      color,
    });
  }
}

function updateParticles(particles, dt) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.life -= dt;

    if (particle.life <= 0) {
      particles.splice(index, 1);
      continue;
    }

    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.985 ** (dt * 60);
    particle.vy *= 0.985 ** (dt * 60);
  }
}

function drawParticles(particles) {
  for (const particle of particles) {
    ctx.globalAlpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawBackdrop() {
  const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, state.mode.bgStart);
  background.addColorStop(0.45, state.mode.bgMid);
  background.addColorStop(1, state.mode.bgEnd);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const halo = ctx.createRadialGradient(CENTER, CENTER, 30, CENTER, CENTER, 520);
  halo.addColorStop(0, state.mode.haloColor);
  halo.addColorStop(0.32, "rgba(255, 255, 255, 0.06)");
  halo.addColorStop(1, "rgba(7, 16, 24, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 520, 0, TAU);
  ctx.fill();
}

function drawStars() {
  for (const star of stars) {
    const alpha = star.alpha + Math.sin(state.visualTime * 0.7 + star.phase) * 0.08;
    ctx.fillStyle = `rgba(255, 245, 212, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, TAU);
    ctx.fill();
  }
}

function updateCurrentGame(dt) {
  switch (state.mode.id) {
    case "meteor-drift":
      updateMeteorDrift(dt, state.runtime);
      break;
    case "brick-burst":
      updateBrickBurst(dt, state.runtime);
      break;
    case "neon-drop":
      updateNeonDrop(dt, state.runtime);
      break;
    case "wire-snake":
      updateWireSnake(dt, state.runtime);
      break;
    case "turret-bloom":
      updateTurretBloom(dt, state.runtime);
      break;
    case "tunnel-rush":
      updateTunnelRush(dt, state.runtime);
      break;
    case "circuit-pong":
      updateCircuitPong(dt, state.runtime);
      break;
    case "crosswalk-flux":
      updateCrosswalkFlux(dt, state.runtime);
      break;
    case "beacon-climb":
      updateBeaconClimb(dt, state.runtime);
      break;
    case "gem-digger":
      updateGemDigger(dt, state.runtime);
      break;
    case "blade-halo":
      updateBladeHalo(dt, state.runtime);
      break;
    case "pulse-invaders":
    case "drone-siege":
      updatePulseInvaders(dt, state.runtime);
      break;
    case "star-lander":
    case "cargo-drop":
      updateStarLander(dt, state.runtime);
      break;
    case "maze-chase":
    case "vault-run":
      updateMazeChase(dt, state.runtime);
      break;
    case "rail-jumper":
    case "roof-runner":
      updateRailJumper(dt, state.runtime);
      break;
    case "astro-rescue":
    case "shock-swarm":
      updateAstroRescue(dt, state.runtime);
      break;
    case "signal-loop":
    default:
      updateSignalLoop(dt, state.runtime);
      break;
  }

  if (state.runtime.gameOver) {
    handleRoundEnd();
  }
}

function renderCurrentGame() {
  switch (state.mode.id) {
    case "meteor-drift":
      renderMeteorDrift(state.runtime);
      break;
    case "brick-burst":
      renderBrickBurst(state.runtime);
      break;
    case "neon-drop":
      renderNeonDrop(state.runtime);
      break;
    case "wire-snake":
      renderWireSnake(state.runtime);
      break;
    case "turret-bloom":
      renderTurretBloom(state.runtime);
      break;
    case "tunnel-rush":
      renderTunnelRush(state.runtime);
      break;
    case "circuit-pong":
      renderCircuitPong(state.runtime);
      break;
    case "crosswalk-flux":
      renderCrosswalkFlux(state.runtime);
      break;
    case "beacon-climb":
      renderBeaconClimb(state.runtime);
      break;
    case "gem-digger":
      renderGemDigger(state.runtime);
      break;
    case "blade-halo":
      renderBladeHalo(state.runtime);
      break;
    case "pulse-invaders":
    case "drone-siege":
      renderPulseInvaders(state.runtime);
      break;
    case "star-lander":
    case "cargo-drop":
      renderStarLander(state.runtime);
      break;
    case "maze-chase":
    case "vault-run":
      renderMazeChase(state.runtime);
      break;
    case "rail-jumper":
    case "roof-runner":
      renderRailJumper(state.runtime);
      break;
    case "astro-rescue":
    case "shock-swarm":
      renderAstroRescue(state.runtime);
      break;
    case "signal-loop":
    default:
      renderSignalLoop(state.runtime);
      break;
  }
}

function createSignalLoopRuntime(mode) {
  const lifeCap = getLifeCap(mode);

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    streak: 0,
    peakStreak: 0,
    level: 1,
    elapsed: 0,
    playerAngle: -Math.PI / 2,
    playerVelocity: 0,
    spawnTimer: mode.spawnBase,
    items: [],
    particles: [],
    gameOver: false,
  };
}

function getSignalLoopHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.streak),
    status: state.running ? `Level ${runtime.level}` : state.ended ? "Finished" : "Ready",
  };
}

function getSignalLoopGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Peak streak ${numberFormat.format(runtime.peakStreak)}.`;
}

function catchSignalPulse(runtime, item) {
  runtime.streak += 1;
  runtime.peakStreak = Math.max(runtime.peakStreak, runtime.streak);

  const points =
    state.mode.scoreBase +
    Math.min(state.mode.scoreBonusCap, runtime.streak * state.mode.streakBonus);
  addScore(runtime, points);

  if (runtime.streak % state.mode.streakPatchEvery === 0 && runtime.lives < runtime.lifeCap) {
    runtime.lives += 1;
    const patch = polarToCartesian(runtime.playerAngle, PLAYER_RADIUS);
    emitParticles(runtime.particles, patch.x, patch.y, state.mode.accent, 28, 120, 240);
  }

  const position = polarToCartesian(item.angle, PLAYER_RADIUS);
  emitParticles(runtime.particles, position.x, position.y, state.mode.pulseColor, 22, 80, 220);
}

function hitSignalGlitch(runtime, item) {
  runtime.streak = 0;
  runtime.lives -= 1;
  state.flash = 0.95;
  state.shake = 12;

  const position = polarToCartesian(item.angle, PLAYER_RADIUS);
  emitParticles(runtime.particles, position.x, position.y, state.mode.glitchColor, 30, 110, 320);

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
  }
}

function missSignalPulse(runtime, item) {
  runtime.streak = 0;
  const position = polarToCartesian(item.angle, PLAYER_RADIUS + 12);
  emitParticles(runtime.particles, position.x, position.y, "rgba(255, 255, 255, 0.35)", 12, 30, 90);
}

function spawnSignalItem(runtime, difficulty) {
  const mode = state.mode;
  const glitchChance = clamp(
    mode.glitchBaseChance + difficulty * mode.glitchChanceRamp,
    mode.glitchBaseChance,
    mode.glitchChanceMax,
  );
  const type = Math.random() < glitchChance ? "glitch" : "pulse";

  runtime.items.push({
    type,
    angle: Math.random() * TAU,
    radius: HUB_RADIUS - 12,
    speed:
      (type === "pulse"
        ? randomBetween(mode.pulseSpeedMin, mode.pulseSpeedMax)
        : randomBetween(mode.glitchSpeedMin, mode.glitchSpeedMax)) +
      difficulty * mode.speedBonus,
    size: type === "pulse" ? mode.pulseSize : mode.glitchSize,
    rotation: Math.random() * TAU,
    spin: randomBetween(-2.8, 2.8),
  });

  if (difficulty > mode.extraPulseDifficulty && Math.random() < mode.extraPulseChance) {
    runtime.items.push({
      type: "pulse",
      angle: Math.random() * TAU,
      radius: HUB_RADIUS - 12,
      speed:
        randomBetween(mode.extraPulseSpeedMin, mode.extraPulseSpeedMax) +
        difficulty * mode.speedBonus * 0.85,
      size: Math.max(11, mode.pulseSize - 1),
      rotation: Math.random() * TAU,
      spin: randomBetween(-3.2, 3.2),
    });
  }
}

function updateSignalLoop(dt, runtime) {
  runtime.elapsed += dt;
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    const pointerAngle = Math.atan2(
      state.input.pointerY - CENTER,
      state.input.pointerX - CENTER,
    );
    runtime.playerVelocity += angleDelta(pointerAngle, runtime.playerAngle) * dt * 11 * controlMultiplier;
  }

  if (state.input.left) {
    runtime.playerVelocity -= dt * 8.2 * controlMultiplier;
  }

  if (state.input.right) {
    runtime.playerVelocity += dt * 8.2 * controlMultiplier;
  }

  runtime.playerVelocity *= 0.9 ** (dt * 60);
  runtime.playerVelocity = clamp(
    runtime.playerVelocity,
    -4.4 * controlMultiplier,
    4.4 * controlMultiplier,
  );
  runtime.playerAngle = wrapAngle(runtime.playerAngle + runtime.playerVelocity * dt);

  const difficulty = 1 + runtime.elapsed * 0.18 + runtime.score * 0.009;
  runtime.level = Math.max(1, Math.floor(difficulty));

  runtime.spawnTimer -= dt;
  while (runtime.spawnTimer <= 0) {
    spawnSignalItem(runtime, difficulty);
    runtime.spawnTimer += Math.max(
      state.mode.spawnFloor,
      state.mode.spawnBase - difficulty * state.mode.spawnRamp + Math.random() * 0.16,
    );
  }

  for (let index = runtime.items.length - 1; index >= 0; index -= 1) {
    const item = runtime.items[index];
    item.radius += item.speed * dt;
    item.rotation += item.spin * dt;

    if (item.radius >= PLAYER_RADIUS) {
      const delta = Math.abs(angleDelta(item.angle, runtime.playerAngle));
      const windowSize =
        item.type === "glitch" ? state.mode.glitchWindow : state.mode.pulseWindow;

      if (delta <= windowSize) {
        if (item.type === "pulse") {
          catchSignalPulse(runtime, item);
        } else {
          hitSignalGlitch(runtime, item);
        }
      } else if (item.type === "pulse") {
        missSignalPulse(runtime, item);
      }

      runtime.items.splice(index, 1);
      continue;
    }

    if (item.radius > ARENA_RADIUS + 24) {
      runtime.items.splice(index, 1);
    }
  }

  updateParticles(runtime.particles, dt);
}

function drawSignalLoopArena(runtime) {
  ctx.save();

  ctx.strokeStyle = state.mode.ringColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, ARENA_RADIUS, 0, TAU);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.setLineDash([10, 20]);
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, PLAYER_RADIUS, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(255, 245, 212, 0.14)";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, HUB_RADIUS + 36, 0, TAU);
  ctx.stroke();

  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * TAU + state.visualTime * 0.05;
    const inner = polarToCartesian(angle, HUB_RADIUS + 20);
    const outer = polarToCartesian(angle, ARENA_RADIUS);
    ctx.strokeStyle = state.mode.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(inner.x, inner.y);
    ctx.lineTo(outer.x, outer.y);
    ctx.stroke();
  }

  const core = ctx.createRadialGradient(CENTER, CENTER, 12, CENTER, CENTER, HUB_RADIUS);
  core.addColorStop(0, state.mode.coreInner);
  core.addColorStop(0.38, state.mode.coreMid);
  core.addColorStop(1, state.mode.coreOuter);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, HUB_RADIUS, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 245, 212, 0.38)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(
    CENTER,
    CENTER,
    HUB_RADIUS - 22,
    state.visualTime * 0.7,
    state.visualTime * 0.7 + Math.PI * 1.45,
  );
  ctx.stroke();

  ctx.restore();
}

function drawSignalPulse(item, position) {
  const tail = polarToCartesian(item.angle, Math.max(HUB_RADIUS, item.radius - 34));
  ctx.strokeStyle = `${state.mode.pulseColor}66`;
  ctx.lineWidth = item.size * 0.76;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();

  ctx.save();
  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 26;
  ctx.fillStyle = state.mode.pulseColor;
  ctx.beginPath();
  ctx.arc(position.x, position.y, item.size, 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = state.mode.pulseCore;
  ctx.beginPath();
  ctx.arc(position.x, position.y, item.size * 0.44, 0, TAU);
  ctx.fill();
}

function drawSignalGlitch(item, position) {
  const tail = polarToCartesian(item.angle, Math.max(HUB_RADIUS, item.radius - 38));
  ctx.strokeStyle = `${state.mode.glitchColor}55`;
  ctx.lineWidth = item.size * 0.7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tail.x, tail.y);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();

  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(item.rotation);
  ctx.shadowColor = state.mode.glitchColor;
  ctx.shadowBlur = 30;
  ctx.fillStyle = state.mode.glitchColor;
  ctx.beginPath();

  for (let point = 0; point < 8; point += 1) {
    const radius = point % 2 === 0 ? item.size + 7 : item.size * 0.48;
    const angle = (point / 8) * TAU;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (point === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSignalPlayer(runtime) {
  ctx.save();

  ctx.strokeStyle = "rgba(255, 245, 212, 0.28)";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, PLAYER_RADIUS, runtime.playerAngle - 0.28, runtime.playerAngle + 0.28);
  ctx.stroke();

  const position = polarToCartesian(runtime.playerAngle, PLAYER_RADIUS);

  ctx.translate(position.x, position.y);
  ctx.rotate(runtime.playerAngle + Math.PI / 2);

  const exhaust = ctx.createLinearGradient(0, 26, 0, 56);
  exhaust.addColorStop(0, `${state.mode.accent}cc`);
  exhaust.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = exhaust;
  ctx.beginPath();
  ctx.moveTo(-9, 18);
  ctx.lineTo(0, 18);
  ctx.lineTo(9, 18);
  ctx.lineTo(0, 52 + Math.sin(state.visualTime * 16) * 7);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 28;
  ctx.fillStyle = "#fff2c6";
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(15, 9);
  ctx.lineTo(0, 20);
  ctx.lineTo(-15, 9);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.lineTo(6, 5);
  ctx.lineTo(0, 10);
  ctx.lineTo(-6, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawSignalLoopText(runtime) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(246, 240, 217, 0.88)";

  if (state.running) {
    ctx.font = "600 22px Trebuchet MS";
    ctx.fillText(`LEVEL ${runtime.level}`, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.activePrompt, CENTER, CENTER + 24);
  } else {
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function renderSignalLoop(runtime) {
  drawSignalLoopArena(runtime);

  for (const item of runtime.items) {
    const position = polarToCartesian(item.angle, item.radius);

    if (item.type === "pulse") {
      drawSignalPulse(item, position);
    } else {
      drawSignalGlitch(item, position);
    }
  }

  drawParticles(runtime.particles);
  drawSignalPlayer(runtime);
  drawSignalLoopText(runtime);
}

function createMeteorDriftRuntime(mode) {
  const lifeCap = getLifeCap(mode);

  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    peakWave: 1,
    elapsed: 0,
    player: {
      x: CENTER,
      y: CENTER + 170,
      vx: 0,
      vy: 0,
      radius: 18,
      invulnerable: 0,
      heading: -Math.PI / 2,
    },
    asteroids: [],
    shards: [],
    particles: [],
    asteroidTimer: 0.8,
    shardTimer: 0.25,
    gameOver: false,
  };

  spawnMeteorShard(runtime);
  spawnMeteorShard(runtime);
  return runtime;
}

function getMeteorDriftHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.wave),
    status: state.running ? `Field ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getMeteorDriftGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Peak wave ${numberFormat.format(runtime.peakWave)}.`;
}

function spawnMeteorShard(runtime) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const x = randomBetween(130, 770);
    const y = randomBetween(130, 770);

    if (distance(x, y, runtime.player.x, runtime.player.y) > 120) {
      runtime.shards.push({
        x,
        y,
        radius: randomBetween(11, 16),
        phase: Math.random() * TAU,
      });
      return;
    }
  }
}

function spawnMeteorAsteroid(runtime) {
  const edge = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (edge === 0) {
    x = randomBetween(90, 810);
    y = -40;
  } else if (edge === 1) {
    x = 940;
    y = randomBetween(90, 810);
  } else if (edge === 2) {
    x = randomBetween(90, 810);
    y = 940;
  } else {
    x = -40;
    y = randomBetween(90, 810);
  }

  const targetX = CENTER + randomBetween(-180, 180);
  const targetY = CENTER + randomBetween(-180, 180);
  const angle = Math.atan2(targetY - y, targetX - x) + randomBetween(-0.32, 0.32);
  const speed = randomBetween(120, 190) + runtime.wave * 14;

  runtime.asteroids.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(18, 34),
    rotation: Math.random() * TAU,
    spin: randomBetween(-1.4, 1.4),
    shape: Array.from({ length: 10 }, () => randomBetween(0.72, 1.05)),
  });
}

function updateMeteorDrift(dt, runtime) {
  runtime.elapsed += dt;
  runtime.wave = 1 + Math.floor(runtime.elapsed / 12 + runtime.score / 220);
  runtime.peakWave = Math.max(runtime.peakWave, runtime.wave);
  runtime.player.invulnerable = Math.max(0, runtime.player.invulnerable - dt);
  const controlMultiplier = getControlMultiplier();

  let ax = 0;
  let ay = 0;

  if (state.input.left) {
    ax -= 1;
  }

  if (state.input.right) {
    ax += 1;
  }

  if (state.input.up) {
    ay -= 1;
  }

  if (state.input.down) {
    ay += 1;
  }

  if (state.input.pointerActive) {
    const dx = state.input.pointerX - runtime.player.x;
    const dy = state.input.pointerY - runtime.player.y;
    const length = Math.hypot(dx, dy);

    if (length > 8) {
      ax += (dx / length) * 0.9;
      ay += (dy / length) * 0.9;
    }
  }

  const axisLength = Math.hypot(ax, ay);
  if (axisLength > 0) {
    ax /= axisLength;
    ay /= axisLength;
  }

  runtime.player.vx += ax * 430 * controlMultiplier * dt;
  runtime.player.vy += ay * 430 * controlMultiplier * dt;
  runtime.player.vx *= 0.92 ** (dt * 60);
  runtime.player.vy *= 0.92 ** (dt * 60);

  const speed = Math.hypot(runtime.player.vx, runtime.player.vy);
  const maxSpeed = 330 * controlMultiplier;
  if (speed > maxSpeed) {
    runtime.player.vx = (runtime.player.vx / speed) * maxSpeed;
    runtime.player.vy = (runtime.player.vy / speed) * maxSpeed;
  }

  runtime.player.x = clamp(runtime.player.x + runtime.player.vx * dt, 90, 810);
  runtime.player.y = clamp(runtime.player.y + runtime.player.vy * dt, 90, 810);

  if (speed > 8) {
    runtime.player.heading = Math.atan2(runtime.player.vy, runtime.player.vx) + Math.PI / 2;
  }

  runtime.shardTimer -= dt;
  while (runtime.shardTimer <= 0 && runtime.shards.length < 3) {
    spawnMeteorShard(runtime);
    runtime.shardTimer += Math.max(0.5, 1.3 - runtime.wave * 0.04 + Math.random() * 0.2);
  }

  runtime.asteroidTimer -= dt;
  while (runtime.asteroidTimer <= 0) {
    spawnMeteorAsteroid(runtime);
    runtime.asteroidTimer += Math.max(0.28, 1.02 - runtime.wave * 0.07 + Math.random() * 0.18);
  }

  for (let index = runtime.shards.length - 1; index >= 0; index -= 1) {
    const shard = runtime.shards[index];
    shard.phase += dt * 2.2;

    if (distance(shard.x, shard.y, runtime.player.x, runtime.player.y) <= shard.radius + runtime.player.radius) {
      addScore(runtime, 22 + runtime.wave * 4);
      emitParticles(runtime.particles, shard.x, shard.y, state.mode.pulseColor, 18, 90, 220);
      runtime.shards.splice(index, 1);
    }
  }

  for (let index = runtime.asteroids.length - 1; index >= 0; index -= 1) {
    const asteroid = runtime.asteroids[index];
    asteroid.x += asteroid.vx * dt;
    asteroid.y += asteroid.vy * dt;
    asteroid.rotation += asteroid.spin * dt;

    if (
      asteroid.x < -120 ||
      asteroid.x > 1020 ||
      asteroid.y < -120 ||
      asteroid.y > 1020
    ) {
      runtime.asteroids.splice(index, 1);
      continue;
    }

    if (
      runtime.player.invulnerable <= 0 &&
      distance(asteroid.x, asteroid.y, runtime.player.x, runtime.player.y) <=
        asteroid.radius + runtime.player.radius
    ) {
      runtime.lives -= 1;
      runtime.player.invulnerable = 1.1;
      state.flash = 0.88;
      state.shake = 10;
      emitParticles(runtime.particles, asteroid.x, asteroid.y, state.mode.glitchColor, 26, 100, 260);
      runtime.asteroids.splice(index, 1);

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
      }
    }
  }

  updateParticles(runtime.particles, dt);
}

function drawMeteorField(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(92, 92, 716, 716);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(92, 92, 716, 716);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let line = 0; line < 7; line += 1) {
    const offset = 182 + line * 90;
    ctx.beginPath();
    ctx.moveTo(offset, 92);
    ctx.lineTo(offset, 808);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(92, offset);
    ctx.lineTo(808, offset);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 245, 212, 0.08)";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 240, 0, TAU);
  ctx.stroke();

  for (const shard of runtime.shards) {
    ctx.save();
    ctx.translate(shard.x, shard.y);
    ctx.rotate(shard.phase);
    ctx.shadowColor = state.mode.pulseColor;
    ctx.shadowBlur = 24;
    ctx.fillStyle = state.mode.pulseColor;
    ctx.beginPath();
    ctx.moveTo(0, -shard.radius);
    ctx.lineTo(shard.radius * 0.72, 0);
    ctx.lineTo(0, shard.radius);
    ctx.lineTo(-shard.radius * 0.72, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = state.mode.pulseCore;
    ctx.beginPath();
    ctx.arc(shard.x, shard.y, shard.radius * 0.22, 0, TAU);
    ctx.fill();
  }

  for (const asteroid of runtime.asteroids) {
    ctx.save();
    ctx.translate(asteroid.x, asteroid.y);
    ctx.rotate(asteroid.rotation);
    ctx.fillStyle = "rgba(255, 179, 159, 0.86)";
    ctx.beginPath();

    for (let point = 0; point < 10; point += 1) {
      const radius = asteroid.radius * asteroid.shape[point];
      const angle = (point / 10) * TAU;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (point === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(120, 41, 28, 0.28)";
    ctx.beginPath();
    ctx.arc(asteroid.radius * 0.18, -asteroid.radius * 0.12, asteroid.radius * 0.24, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  drawParticles(runtime.particles);

  ctx.save();
  if (runtime.player.invulnerable > 0 && Math.sin(state.visualTime * 30) > 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.translate(runtime.player.x, runtime.player.y);
  ctx.rotate(runtime.player.heading);

  const exhaust = ctx.createLinearGradient(0, 14, 0, 54);
  exhaust.addColorStop(0, `${state.mode.accent}cc`);
  exhaust.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = exhaust;
  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.lineTo(0, 48 + Math.sin(state.visualTime * 18) * 6);
  ctx.lineTo(8, 10);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#fff3c9";
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(14, 12);
  ctx.lineTo(0, 16);
  ctx.lineTo(-14, 12);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(5, 5);
  ctx.lineTo(0, 9);
  ctx.lineTo(-5, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
    ctx.restore();
  }

  ctx.restore();
}

function renderMeteorDrift(runtime) {
  drawMeteorField(runtime);
}

function createNeonDropRuntime(mode) {
  const laneCount = 5;
  const laneWidth = 118;
  const laneGap = 22;
  const boardWidth = laneCount * laneWidth + (laneCount - 1) * laneGap;
  const boardLeft = (canvas.width - boardWidth) / 2;
  const lifeCap = getLifeCap(mode);
  const laneCenters = Array.from({ length: laneCount }, (_, index) => (
    boardLeft + laneWidth / 2 + index * (laneWidth + laneGap)
  ));

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    elapsed: 0,
    boardLeft,
    boardTop: 108,
    boardWidth,
    boardHeight: 684,
    laneWidth,
    laneGap,
    laneCenters,
    playerX: laneCenters[2],
    playerY: 750,
    playerRadius: 24,
    playerInvulnerable: 0,
    items: [],
    particles: [],
    spawnTimer: 0.7,
    gameOver: false,
  };
}

function getNeonDropHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.wave),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getNeonDropGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached wave ${numberFormat.format(runtime.wave)}.`;
}

function spawnNeonDropItem(runtime) {
  const laneIndex = Math.floor(Math.random() * runtime.laneCenters.length);
  const isPod = Math.random() < 0.62;

  runtime.items.push({
    x: runtime.laneCenters[laneIndex],
    y: runtime.boardTop - 36,
    type: isPod ? "pod" : "mine",
    radius: isPod ? 15 : 18,
    speed: randomBetween(230, 320) + runtime.wave * 18,
    phase: Math.random() * TAU,
    rotation: Math.random() * TAU,
  });
}

function updateNeonDrop(dt, runtime) {
  runtime.elapsed += dt;
  runtime.wave = 1 + Math.floor(runtime.elapsed / 10 + runtime.score / 220);
  runtime.playerInvulnerable = Math.max(0, runtime.playerInvulnerable - dt);
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.playerX +=
      (state.input.pointerX - runtime.playerX) *
      Math.min(1, dt * 16 * controlMultiplier);
  } else {
    const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    runtime.playerX += horizontal * 520 * controlMultiplier * dt;
  }

  runtime.playerX = clamp(
    runtime.playerX,
    runtime.boardLeft + runtime.playerRadius,
    runtime.boardLeft + runtime.boardWidth - runtime.playerRadius,
  );

  runtime.spawnTimer -= dt;
  while (runtime.spawnTimer <= 0) {
    spawnNeonDropItem(runtime);

    if (runtime.wave > 4 && Math.random() < 0.22) {
      spawnNeonDropItem(runtime);
    }

    runtime.spawnTimer += Math.max(0.22, 0.88 - runtime.wave * 0.06 + Math.random() * 0.14);
  }

  for (let index = runtime.items.length - 1; index >= 0; index -= 1) {
    const item = runtime.items[index];
    item.y += item.speed * dt;
    item.phase += dt * 3.2;
    item.rotation += dt * 2.1;

    const hitDistance = distance(item.x, item.y, runtime.playerX, runtime.playerY);
    if (hitDistance <= item.radius + runtime.playerRadius) {
      if (item.type === "pod") {
        addScore(runtime, 18 + runtime.wave * 4);
        emitParticles(runtime.particles, item.x, item.y, state.mode.pulseColor, 18, 80, 220);
      } else if (runtime.playerInvulnerable <= 0) {
        runtime.lives -= 1;
        runtime.playerInvulnerable = 0.9;
        state.flash = 0.82;
        state.shake = 9;
        emitParticles(runtime.particles, item.x, item.y, state.mode.glitchColor, 24, 90, 240);

        if (runtime.lives <= 0) {
          runtime.gameOver = true;
        }
      }

      runtime.items.splice(index, 1);
      continue;
    }

    if (item.y - item.radius > runtime.boardTop + runtime.boardHeight + 26) {
      runtime.items.splice(index, 1);
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderNeonDrop(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(runtime.boardLeft, runtime.boardTop, runtime.boardWidth, runtime.boardHeight);

  for (let lane = 0; lane < runtime.laneCenters.length; lane += 1) {
    const x = runtime.boardLeft + lane * (runtime.laneWidth + runtime.laneGap);
    ctx.fillStyle = lane % 2 === 0 ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(x, runtime.boardTop, runtime.laneWidth, runtime.boardHeight);
  }

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(runtime.boardLeft, runtime.boardTop, runtime.boardWidth, runtime.boardHeight);

  for (const item of runtime.items) {
    if (item.type === "pod") {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.shadowColor = state.mode.pulseColor;
      ctx.shadowBlur = 24;
      ctx.fillStyle = state.mode.pulseColor;
      ctx.beginPath();
      ctx.moveTo(0, -item.radius);
      ctx.lineTo(item.radius * 0.78, 0);
      ctx.lineTo(0, item.radius);
      ctx.lineTo(-item.radius * 0.78, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = state.mode.pulseCore;
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.radius * 0.22, 0, TAU);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      ctx.shadowColor = state.mode.glitchColor;
      ctx.shadowBlur = 18;
      ctx.fillStyle = state.mode.glitchColor;
      ctx.beginPath();

      for (let point = 0; point < 8; point += 1) {
        const radius = point % 2 === 0 ? item.radius : item.radius * 0.46;
        const angle = (point / 8) * TAU;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (point === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  drawParticles(runtime.particles);

  ctx.save();
  if (runtime.playerInvulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.46;
  }

  ctx.translate(runtime.playerX, runtime.playerY);

  const skid = ctx.createLinearGradient(0, -8, 0, 34);
  skid.addColorStop(0, `${state.mode.accent}dd`);
  skid.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = skid;
  ctx.beginPath();
  ctx.ellipse(0, 22, 14, 34 + Math.sin(state.visualTime * 14) * 4, 0, 0, TAU);
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#fff4d0";
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(28, 4);
  ctx.lineTo(18, 20);
  ctx.lineTo(-18, 20);
  ctx.lineTo(-28, 4);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(10, 2);
  ctx.lineTo(0, 11);
  ctx.lineTo(-10, 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
    ctx.restore();
  }

  ctx.restore();
}

function createWireSnakeRuntime() {
  const cols = 18;
  const rows = 18;
  const cell = 36;
  const boardX = (canvas.width - cols * cell) / 2;
  const boardY = (canvas.height - rows * cell) / 2;
  const startLength = getSnakeStartLength();
  const headX = 7 + Math.floor(startLength / 2);
  const segments = Array.from({ length: startLength }, (_, index) => ({
    x: headX - index,
    y: 10,
  }));

  const runtime = {
    score: 0,
    foods: 0,
    speed: 1,
    cols,
    rows,
    cell,
    boardX,
    boardY,
    segments,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: null,
    stepTimer: 0.18,
    stepInterval: 0.18,
    particles: [],
    gameOver: false,
  };

  runtime.food = spawnWireSnakeFood(runtime);
  return runtime;
}

function getWireSnakeHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: numberFormat.format(runtime.segments.length),
    secondaryValue: numberFormat.format(runtime.speed),
    status: state.running ? `Speed ${runtime.speed}` : state.ended ? "Finished" : "Ready",
  };
}

function getWireSnakeGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Final length ${numberFormat.format(runtime.segments.length)}.`;
}

function spawnWireSnakeFood(runtime) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const candidate = {
      x: Math.floor(Math.random() * runtime.cols),
      y: Math.floor(Math.random() * runtime.rows),
    };

    const occupied = runtime.segments.some(
      (segment) => segment.x === candidate.x && segment.y === candidate.y,
    );

    if (!occupied) {
      return candidate;
    }
  }

  return { x: 2, y: 2 };
}

function setWireSnakeDirection(runtime, dx, dy) {
  if (dx === -runtime.direction.x && dy === -runtime.direction.y) {
    return;
  }

  runtime.nextDirection = { x: dx, y: dy };
}

function updateWireSnake(dt, runtime) {
  if (state.input.left) {
    setWireSnakeDirection(runtime, -1, 0);
  } else if (state.input.right) {
    setWireSnakeDirection(runtime, 1, 0);
  } else if (state.input.up) {
    setWireSnakeDirection(runtime, 0, -1);
  } else if (state.input.down) {
    setWireSnakeDirection(runtime, 0, 1);
  }

  if (state.input.pointerActive) {
    const head = runtime.segments[0];
    const headX = runtime.boardX + head.x * runtime.cell + runtime.cell / 2;
    const headY = runtime.boardY + head.y * runtime.cell + runtime.cell / 2;
    const dx = state.input.pointerX - headX;
    const dy = state.input.pointerY - headY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > runtime.cell * 0.35) {
      setWireSnakeDirection(runtime, dx > 0 ? 1 : -1, 0);
    } else if (Math.abs(dy) > runtime.cell * 0.35) {
      setWireSnakeDirection(runtime, 0, dy > 0 ? 1 : -1);
    }
  }

  runtime.stepTimer -= dt;

  while (runtime.stepTimer <= 0 && !runtime.gameOver) {
    runtime.direction = { ...runtime.nextDirection };

    const head = runtime.segments[0];
    const nextHead = {
      x: head.x + runtime.direction.x,
      y: head.y + runtime.direction.y,
    };

    if (
      nextHead.x < 0 ||
      nextHead.x >= runtime.cols ||
      nextHead.y < 0 ||
      nextHead.y >= runtime.rows
    ) {
      runtime.gameOver = true;
      break;
    }

    const willEat = nextHead.x === runtime.food.x && nextHead.y === runtime.food.y;
    const bodyToCheck = willEat ? runtime.segments : runtime.segments.slice(0, -1);
    const hitSelf = bodyToCheck.some(
      (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
    );

    if (hitSelf) {
      runtime.gameOver = true;
      break;
    }

    runtime.segments.unshift(nextHead);

    if (willEat) {
      runtime.foods += 1;
      addScore(runtime, 25 + runtime.speed * 5);

      const fx = runtime.boardX + runtime.food.x * runtime.cell + runtime.cell / 2;
      const fy = runtime.boardY + runtime.food.y * runtime.cell + runtime.cell / 2;
      emitParticles(runtime.particles, fx, fy, state.mode.pulseColor, 18, 80, 200);

      if (runtime.foods % 4 === 0) {
        runtime.speed += 1;
      }

      runtime.stepInterval = Math.max(0.075, 0.18 - (runtime.speed - 1) * 0.012);
      runtime.food = spawnWireSnakeFood(runtime);
    } else {
      runtime.segments.pop();
    }

    runtime.stepTimer += runtime.stepInterval;
  }

  updateParticles(runtime.particles, dt);
}

function renderWireSnake(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(runtime.boardX, runtime.boardY, runtime.cols * runtime.cell, runtime.rows * runtime.cell);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(runtime.boardX, runtime.boardY, runtime.cols * runtime.cell, runtime.rows * runtime.cell);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let col = 1; col < runtime.cols; col += 1) {
    const x = runtime.boardX + col * runtime.cell;
    ctx.beginPath();
    ctx.moveTo(x, runtime.boardY);
    ctx.lineTo(x, runtime.boardY + runtime.rows * runtime.cell);
    ctx.stroke();
  }

  for (let row = 1; row < runtime.rows; row += 1) {
    const y = runtime.boardY + row * runtime.cell;
    ctx.beginPath();
    ctx.moveTo(runtime.boardX, y);
    ctx.lineTo(runtime.boardX + runtime.cols * runtime.cell, y);
    ctx.stroke();
  }

  const foodX = runtime.boardX + runtime.food.x * runtime.cell + runtime.cell / 2;
  const foodY = runtime.boardY + runtime.food.y * runtime.cell + runtime.cell / 2;
  const pulse = 10 + Math.sin(state.visualTime * 7) * 2.5;

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 22;
  ctx.fillStyle = state.mode.accent;
  ctx.beginPath();
  ctx.arc(foodX, foodY, pulse, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.pulseCore;
  ctx.beginPath();
  ctx.arc(foodX, foodY, 4.5, 0, TAU);
  ctx.fill();

  runtime.segments.forEach((segment, index) => {
    const x = runtime.boardX + segment.x * runtime.cell + 3;
    const y = runtime.boardY + segment.y * runtime.cell + 3;
    const size = runtime.cell - 6;

    ctx.fillStyle = index === 0 ? state.mode.accent : state.mode.pulseColor;
    ctx.fillRect(x, y, size, size);

    if (index === 0) {
      ctx.fillStyle = "#0b1910";
      ctx.beginPath();
      ctx.arc(x + size * 0.34, y + size * 0.36, 3, 0, TAU);
      ctx.arc(x + size * 0.66, y + size * 0.36, 3, 0, TAU);
      ctx.fill();
    }
  });

  drawParticles(runtime.particles);

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function buildBrickWall(wave) {
  const rows = 5 + Math.min(2, wave - 1);
  const cols = 8;
  const width = 78;
  const height = 26;
  const gap = 10;
  const totalWidth = cols * width + (cols - 1) * gap;
  const startX = (canvas.width - totalWidth) / 2;
  const startY = 118;
  const palette = ["#82d8ff", "#a6f0ff", "#ffd86f", "#ffb56b", "#ff8f63", "#f4a5ff"];
  const bricks = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      bricks.push({
        x: startX + col * (width + gap),
        y: startY + row * (height + gap),
        width,
        height,
        color: palette[row % palette.length],
        alive: true,
      });
    }
  }

  return bricks;
}

function createBrickBurstRuntime(mode) {
  const bricks = buildBrickWall(1);
  const lifeCap = getLifeCap(mode);

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    bricks,
    bricksLeft: bricks.length,
    paddleX: CENTER,
    paddleY: 782,
    paddleWidth: 148,
    paddleHeight: 18,
    ballX: CENTER,
    ballY: 744,
    ballVX: 0,
    ballVY: -340,
    ballRadius: 10,
    serveTimer: 0.55,
    particles: [],
    gameOver: false,
  };
}

function getBrickBurstHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.bricksLeft),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getBrickBurstGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached wave ${numberFormat.format(runtime.wave)}.`;
}

function resetBrickBall(runtime) {
  runtime.paddleX = CENTER;
  runtime.ballX = CENTER;
  runtime.ballY = 744;
  runtime.ballVX = 0;
  runtime.ballVY = -340;
  runtime.serveTimer = 0.7;
}

function updateBrickBurst(dt, runtime) {
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.paddleX +=
      (state.input.pointerX - runtime.paddleX) *
      Math.min(1, dt * 18 * controlMultiplier);
  } else {
    const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    runtime.paddleX += horizontal * 520 * controlMultiplier * dt;
  }

  runtime.paddleX = clamp(
    runtime.paddleX,
    110 + runtime.paddleWidth / 2,
    790 - runtime.paddleWidth / 2,
  );

  if (runtime.serveTimer > 0) {
    runtime.serveTimer -= dt;
    runtime.ballX = runtime.paddleX;
    runtime.ballY = runtime.paddleY - runtime.ballRadius - 4;

    if (runtime.serveTimer <= 0) {
      const launchAngle = randomBetween(-0.8, 0.8);
      const speed = 360 + runtime.wave * 14;
      runtime.ballVX = Math.sin(launchAngle) * speed;
      runtime.ballVY = -Math.cos(launchAngle) * speed;
    }
  } else {
    runtime.ballX += runtime.ballVX * dt;
    runtime.ballY += runtime.ballVY * dt;

    if (runtime.ballX - runtime.ballRadius <= 88) {
      runtime.ballX = 88 + runtime.ballRadius;
      runtime.ballVX *= -1;
    }

    if (runtime.ballX + runtime.ballRadius >= 812) {
      runtime.ballX = 812 - runtime.ballRadius;
      runtime.ballVX *= -1;
    }

    if (runtime.ballY - runtime.ballRadius <= 88) {
      runtime.ballY = 88 + runtime.ballRadius;
      runtime.ballVY *= -1;
    }

    const paddleLeft = runtime.paddleX - runtime.paddleWidth / 2;
    const paddleRight = runtime.paddleX + runtime.paddleWidth / 2;
    const paddleTop = runtime.paddleY;
    const paddleBottom = runtime.paddleY + runtime.paddleHeight;

    if (
      runtime.ballVY > 0 &&
      runtime.ballY + runtime.ballRadius >= paddleTop &&
      runtime.ballY - runtime.ballRadius <= paddleBottom &&
      runtime.ballX >= paddleLeft - runtime.ballRadius &&
      runtime.ballX <= paddleRight + runtime.ballRadius
    ) {
      const offset = clamp(
        (runtime.ballX - runtime.paddleX) / (runtime.paddleWidth / 2),
        -1,
        1,
      );
      const speed = Math.min(560, Math.hypot(runtime.ballVX, runtime.ballVY) + 18);
      runtime.ballVX = speed * offset * 0.96;
      runtime.ballVY = -Math.sqrt(Math.max(26000, speed * speed - runtime.ballVX * runtime.ballVX));
      runtime.ballY = paddleTop - runtime.ballRadius - 1;
    }

    for (let index = 0; index < runtime.bricks.length; index += 1) {
      const brick = runtime.bricks[index];

      if (!brick.alive) {
        continue;
      }

      const nearestX = clamp(runtime.ballX, brick.x, brick.x + brick.width);
      const nearestY = clamp(runtime.ballY, brick.y, brick.y + brick.height);
      const dx = runtime.ballX - nearestX;
      const dy = runtime.ballY - nearestY;

      if (dx * dx + dy * dy <= runtime.ballRadius * runtime.ballRadius) {
        brick.alive = false;
        runtime.bricksLeft -= 1;
        addScore(runtime, 15);
        emitParticles(
          runtime.particles,
          brick.x + brick.width / 2,
          brick.y + brick.height / 2,
          brick.color,
          16,
          70,
          210,
        );

        if (Math.abs(dx) > Math.abs(dy)) {
          runtime.ballVX *= -1;
        } else {
          runtime.ballVY *= -1;
        }

        break;
      }
    }

    if (runtime.ballY - runtime.ballRadius > canvas.height + 18) {
      runtime.lives -= 1;
      state.flash = 0.65;
      state.shake = 7;

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
      } else {
        resetBrickBall(runtime);
      }
    }
  }

  if (runtime.bricksLeft <= 0) {
    runtime.wave += 1;
    runtime.bricks = buildBrickWall(runtime.wave);
    runtime.bricksLeft = runtime.bricks.length;
    emitParticles(runtime.particles, CENTER, 250, state.mode.accent, 42, 90, 260);
    resetBrickBall(runtime);
  }

  updateParticles(runtime.particles, dt);
}

function renderBrickBurst(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.beginPath();
  ctx.moveTo(88, 690);
  ctx.lineTo(812, 690);
  ctx.stroke();

  for (const brick of runtime.bricks) {
    if (!brick.alive) {
      continue;
    }

    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(brick.x, brick.y, brick.width, 5);
  }

  drawParticles(runtime.particles);

  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = state.mode.pulseColor;
  ctx.fillRect(
    runtime.paddleX - runtime.paddleWidth / 2,
    runtime.paddleY,
    runtime.paddleWidth,
    runtime.paddleHeight,
  );
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.pulseColor;
  ctx.beginPath();
  ctx.arc(runtime.ballX, runtime.ballY, runtime.ballRadius, 0, TAU);
  ctx.fill();

  ctx.fillStyle = state.mode.pulseCore;
  ctx.beginPath();
  ctx.arc(runtime.ballX, runtime.ballY, runtime.ballRadius * 0.42, 0, TAU);
  ctx.fill();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER + 80);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 108);
  }

  ctx.restore();
}

function createTurretBloomRuntime(mode) {
  const lifeCap = getLifeCap(mode);

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    peakWave: 1,
    elapsed: 0,
    baseX: CENTER,
    baseY: 784,
    turretAngle: -Math.PI / 2,
    fireTimer: 0.08,
    spawnTimer: 0.72,
    bullets: [],
    enemies: [],
    particles: [],
    gameOver: false,
  };
}

function getTurretBloomHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.wave),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getTurretBloomGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Peak wave ${numberFormat.format(runtime.peakWave)}.`;
}

function spawnTurretBloomEnemy(runtime) {
  const edge = Math.floor(Math.random() * 3);
  let x = CENTER;
  let y = 80;

  if (edge === 0) {
    x = randomBetween(110, 790);
    y = -36;
  } else if (edge === 1) {
    x = -36;
    y = randomBetween(110, 440);
  } else {
    x = 936;
    y = randomBetween(110, 440);
  }

  const heavyChance = Math.min(0.36, 0.08 + runtime.wave * 0.018);
  const type = Math.random() < heavyChance ? "brute" : "drone";
  const targetX = runtime.baseX + randomBetween(-150, 150);
  const targetY = runtime.baseY - randomBetween(92, 154);
  const travelAngle = Math.atan2(targetY - y, targetX - x) + randomBetween(-0.12, 0.12);
  const speed =
    type === "brute"
      ? randomBetween(108, 144) + runtime.wave * 8
      : randomBetween(152, 192) + runtime.wave * 11;

  runtime.enemies.push({
    type,
    x,
    y,
    vx: Math.cos(travelAngle) * speed,
    vy: Math.sin(travelAngle) * speed,
    radius: type === "brute" ? 25 : 16,
    health: type === "brute" ? 2 + Math.floor(runtime.wave / 7) : 1,
    wobble: type === "brute" ? randomBetween(8, 16) : randomBetween(18, 32),
    wobbleSpeed: randomBetween(2.4, 3.8),
    wobblePhase: Math.random() * TAU,
    rotation: Math.random() * TAU,
    spin: randomBetween(-2.1, 2.1),
  });
}

function updateTurretBloom(dt, runtime) {
  runtime.elapsed += dt;
  runtime.wave = 1 + Math.floor(runtime.elapsed / 11 + runtime.score / 260);
  runtime.peakWave = Math.max(runtime.peakWave, runtime.wave);

  const controlMultiplier = getControlMultiplier();
  const minAngle = -Math.PI + 0.25;
  const maxAngle = -0.25;

  if (state.input.pointerActive) {
    runtime.turretAngle = clamp(
      Math.atan2(state.input.pointerY - runtime.baseY, state.input.pointerX - runtime.baseX),
      minAngle,
      maxAngle,
    );
  } else {
    const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    runtime.turretAngle = clamp(
      runtime.turretAngle + horizontal * dt * 2.9 * controlMultiplier,
      minAngle,
      maxAngle,
    );
  }

  runtime.fireTimer -= dt;
  while (runtime.fireTimer <= 0) {
    const muzzleX = runtime.baseX + Math.cos(runtime.turretAngle) * 62;
    const muzzleY = runtime.baseY + Math.sin(runtime.turretAngle) * 62;
    const speed = 620 + runtime.wave * 12;

    runtime.bullets.push({
      x: muzzleX,
      y: muzzleY,
      vx: Math.cos(runtime.turretAngle) * speed,
      vy: Math.sin(runtime.turretAngle) * speed,
      radius: 6,
      life: 1.25,
    });

    runtime.fireTimer += Math.max(0.085, 0.22 - runtime.wave * 0.0055);
  }

  runtime.spawnTimer -= dt;
  while (runtime.spawnTimer <= 0) {
    spawnTurretBloomEnemy(runtime);

    if (runtime.wave > 4 && Math.random() < 0.18) {
      spawnTurretBloomEnemy(runtime);
    }

    runtime.spawnTimer += Math.max(0.22, 0.9 - runtime.wave * 0.05 + Math.random() * 0.12);
  }

  for (let bulletIndex = runtime.bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = runtime.bullets[bulletIndex];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    let consumed = false;

    for (let enemyIndex = runtime.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
      const enemy = runtime.enemies[enemyIndex];

      if (distance(bullet.x, bullet.y, enemy.x, enemy.y) > bullet.radius + enemy.radius) {
        continue;
      }

      consumed = true;
      enemy.health -= 1;
      emitParticles(runtime.particles, bullet.x, bullet.y, state.mode.pulseColor, 8, 60, 160);

      if (enemy.health <= 0) {
        addScore(runtime, enemy.type === "brute" ? 34 + runtime.wave * 4 : 16 + runtime.wave * 3);
        emitParticles(
          runtime.particles,
          enemy.x,
          enemy.y,
          enemy.type === "brute" ? state.mode.accent : state.mode.glitchColor,
          enemy.type === "brute" ? 26 : 18,
          90,
          240,
        );
        runtime.enemies.splice(enemyIndex, 1);
      }

      break;
    }

    if (
      consumed ||
      bullet.life <= 0 ||
      bullet.x < -40 ||
      bullet.x > canvas.width + 40 ||
      bullet.y < -40 ||
      bullet.y > canvas.height + 40
    ) {
      runtime.bullets.splice(bulletIndex, 1);
    }
  }

  for (let enemyIndex = runtime.enemies.length - 1; enemyIndex >= 0; enemyIndex -= 1) {
    const enemy = runtime.enemies[enemyIndex];
    enemy.wobblePhase += dt * enemy.wobbleSpeed;
    enemy.rotation += dt * enemy.spin;
    enemy.x += enemy.vx * dt + Math.cos(enemy.wobblePhase) * enemy.wobble * dt;
    enemy.y += enemy.vy * dt;

    if (
      distance(enemy.x, enemy.y, runtime.baseX, runtime.baseY - 16) <= enemy.radius + 56 ||
      enemy.y > canvas.height + 40
    ) {
      runtime.lives -= 1;
      state.flash = 0.84;
      state.shake = 10;
      emitParticles(
        runtime.particles,
        clamp(enemy.x, 110, 790),
        clamp(enemy.y, 180, 780),
        state.mode.glitchColor,
        28,
        100,
        260,
      );
      runtime.enemies.splice(enemyIndex, 1);

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
        break;
      }
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderTurretBloom(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(84, 84, 732, 732);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(84, 84, 732, 732);

  for (let ring = 0; ring < 4; ring += 1) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 + ring * 0.015})`;
    ctx.beginPath();
    ctx.arc(runtime.baseX, runtime.baseY, 112 + ring * 92, Math.PI, TAU);
    ctx.stroke();
  }

  for (let line = 0; line < 6; line += 1) {
    const spread = -0.9 + line * 0.36;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.beginPath();
    ctx.moveTo(runtime.baseX, runtime.baseY - 12);
    ctx.lineTo(runtime.baseX + Math.sin(spread) * 290, 120);
    ctx.stroke();
  }

  const coreGlow = ctx.createRadialGradient(
    runtime.baseX,
    runtime.baseY - 8,
    24,
    runtime.baseX,
    runtime.baseY - 8,
    160,
  );
  coreGlow.addColorStop(0, `${state.mode.accent}88`);
  coreGlow.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(runtime.baseX, runtime.baseY - 8, 160, 0, TAU);
  ctx.fill();

  for (const enemy of runtime.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rotation);
    ctx.shadowColor = enemy.type === "brute" ? state.mode.accent : state.mode.glitchColor;
    ctx.shadowBlur = enemy.type === "brute" ? 18 : 14;
    ctx.fillStyle = enemy.type === "brute" ? state.mode.accent : state.mode.glitchColor;
    ctx.beginPath();

    const points = enemy.type === "brute" ? 6 : 8;
    for (let point = 0; point < points; point += 1) {
      const radius =
        enemy.type === "brute"
          ? enemy.radius * (point % 2 === 0 ? 1.04 : 0.74)
          : point % 2 === 0
            ? enemy.radius + 5
            : enemy.radius * 0.38;
      const angle = (point / points) * TAU;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (point === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(10, 20, 31, 0.45)";
    ctx.beginPath();
    ctx.arc(0, 0, enemy.type === "brute" ? 8 : 5, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  for (const bullet of runtime.bullets) {
    const angle = Math.atan2(bullet.vy, bullet.vx);
    ctx.strokeStyle = `${state.mode.pulseColor}cc`;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(
      bullet.x - Math.cos(angle) * 16,
      bullet.y - Math.sin(angle) * 16,
    );
    ctx.lineTo(bullet.x, bullet.y);
    ctx.stroke();

    ctx.fillStyle = state.mode.pulseCore;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius * 0.78, 0, TAU);
    ctx.fill();
  }

  drawParticles(runtime.particles);

  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  ctx.beginPath();
  ctx.arc(runtime.baseX, runtime.baseY + 10, 152, Math.PI, TAU);
  ctx.fill();

  ctx.save();
  ctx.translate(runtime.baseX, runtime.baseY);
  ctx.rotate(runtime.turretAngle);
  ctx.fillStyle = state.mode.pulseColor;
  ctx.fillRect(0, -12, 74, 24);
  ctx.fillStyle = state.mode.pulseCore;
  ctx.fillRect(36, -7, 26, 14);
  ctx.restore();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 28;
  ctx.fillStyle = state.mode.accent;
  ctx.beginPath();
  ctx.arc(runtime.baseX, runtime.baseY, 36, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.arc(runtime.baseX, runtime.baseY, 18, 0, TAU);
  ctx.fill();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function createTunnelRushRuntime(mode) {
  const lifeCap = getLifeCap(mode);

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    sector: 1,
    peakSector: 1,
    gatesCleared: 0,
    elapsed: 0,
    corridorX: 96,
    corridorY: 118,
    corridorWidth: 708,
    corridorHeight: 664,
    playerX: 228,
    playerY: CENTER,
    playerRadius: 19,
    playerVelocity: 0,
    playerInvulnerable: 0,
    gates: [],
    particles: [],
    spawnTimer: 0.9,
    gameOver: false,
  };
}

function getTunnelRushHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.sector),
    status: state.running ? `Sector ${runtime.sector}` : state.ended ? "Finished" : "Ready",
  };
}

function getTunnelRushGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Cleared ${numberFormat.format(runtime.gatesCleared)} gates.`;
}

function spawnTunnelRushGate(runtime) {
  const gapSize = clamp(248 - runtime.sector * 10, 138, 248);
  const minCenter = runtime.corridorY + gapSize / 2 + 24;
  const maxCenter = runtime.corridorY + runtime.corridorHeight - gapSize / 2 - 24;
  const ringChance = Math.min(0.9, 0.58 + runtime.sector * 0.03);

  runtime.gates.push({
    x: runtime.corridorX + runtime.corridorWidth + 80,
    width: randomBetween(54, 76),
    gapY: randomBetween(minCenter, maxCenter),
    gapSize,
    speed: 250 + runtime.sector * 18,
    gapVelocity: randomBetween(-36, 36) * Math.min(1.8, 0.7 + runtime.sector * 0.08),
    ring:
      Math.random() < ringChance
        ? {
            offsetY: randomBetween(-gapSize * 0.18, gapSize * 0.18),
            radius: 17,
            collected: false,
          }
        : null,
    passed: false,
  });
}

function updateTunnelRush(dt, runtime) {
  runtime.elapsed += dt;
  runtime.sector = 1 + Math.floor(runtime.elapsed / 12 + runtime.gatesCleared / 5);
  runtime.peakSector = Math.max(runtime.peakSector, runtime.sector);
  runtime.playerInvulnerable = Math.max(0, runtime.playerInvulnerable - dt);

  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.playerVelocity = 0;
    runtime.playerY +=
      (state.input.pointerY - runtime.playerY) * Math.min(1, dt * 11 * controlMultiplier);
  } else {
    const vertical = (state.input.down ? 1 : 0) - (state.input.up ? 1 : 0);
    runtime.playerVelocity += vertical * 560 * controlMultiplier * dt;
    runtime.playerVelocity *= 0.9 ** (dt * 60);
    runtime.playerY += runtime.playerVelocity * dt;
  }

  runtime.playerY = clamp(
    runtime.playerY,
    runtime.corridorY + runtime.playerRadius,
    runtime.corridorY + runtime.corridorHeight - runtime.playerRadius,
  );

  runtime.spawnTimer -= dt;
  while (runtime.spawnTimer <= 0) {
    spawnTunnelRushGate(runtime);

    if (runtime.sector > 5 && Math.random() < 0.16) {
      spawnTunnelRushGate(runtime);
    }

    runtime.spawnTimer += Math.max(0.5, 1.26 - runtime.sector * 0.05 + Math.random() * 0.12);
  }

  for (let gateIndex = runtime.gates.length - 1; gateIndex >= 0; gateIndex -= 1) {
    const gate = runtime.gates[gateIndex];
    gate.x -= gate.speed * dt;
    gate.gapY += gate.gapVelocity * dt;

    const minCenter = runtime.corridorY + gate.gapSize / 2 + 18;
    const maxCenter = runtime.corridorY + runtime.corridorHeight - gate.gapSize / 2 - 18;

    if (gate.gapY <= minCenter || gate.gapY >= maxCenter) {
      gate.gapY = clamp(gate.gapY, minCenter, maxCenter);
      gate.gapVelocity *= -1;
    }

    if (!gate.passed && gate.x + gate.width < runtime.playerX - runtime.playerRadius) {
      gate.passed = true;
      runtime.gatesCleared += 1;
      addScore(runtime, 12 + runtime.sector * 2);
      emitParticles(
        runtime.particles,
        runtime.playerX - 18,
        runtime.playerY,
        state.mode.pulseColor,
        10,
        30,
        110,
      );
    }

    if (
      runtime.playerInvulnerable <= 0 &&
      runtime.playerX + runtime.playerRadius >= gate.x &&
      runtime.playerX - runtime.playerRadius <= gate.x + gate.width
    ) {
      const safeTop = gate.gapY - gate.gapSize / 2;
      const safeBottom = gate.gapY + gate.gapSize / 2;
      const clipped = runtime.playerY - runtime.playerRadius < safeTop ||
        runtime.playerY + runtime.playerRadius > safeBottom;

      if (clipped) {
        gate.passed = true;
        runtime.lives -= 1;
        runtime.playerInvulnerable = 0.95;
        runtime.playerVelocity = 0;
        runtime.playerY = clamp(
          gate.gapY,
          runtime.corridorY + runtime.playerRadius,
          runtime.corridorY + runtime.corridorHeight - runtime.playerRadius,
        );
        state.flash = 0.78;
        state.shake = 8;
        emitParticles(runtime.particles, runtime.playerX, runtime.playerY, state.mode.glitchColor, 24, 90, 220);

        if (runtime.lives <= 0) {
          runtime.gameOver = true;
        }
      }
    }

    if (gate.ring && !gate.ring.collected) {
      const ringX = gate.x + gate.width / 2;
      const ringY = gate.gapY + gate.ring.offsetY;

      if (distance(ringX, ringY, runtime.playerX, runtime.playerY) <= gate.ring.radius + runtime.playerRadius) {
        gate.ring.collected = true;
        addScore(runtime, 22 + runtime.sector * 4);
        emitParticles(runtime.particles, ringX, ringY, state.mode.accent, 20, 80, 200);
      }
    }

    if (gate.x + gate.width < runtime.corridorX - 120) {
      runtime.gates.splice(gateIndex, 1);
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderTunnelRush(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(
    runtime.corridorX,
    runtime.corridorY,
    runtime.corridorWidth,
    runtime.corridorHeight,
  );

  ctx.save();
  ctx.beginPath();
  ctx.rect(runtime.corridorX, runtime.corridorY, runtime.corridorWidth, runtime.corridorHeight);
  ctx.clip();

  for (let streak = 0; streak < 18; streak += 1) {
    const offset = (state.visualTime * (140 + streak * 12) + streak * 54) % 1040;
    const x = runtime.corridorX + runtime.corridorWidth - offset;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + (streak % 4) * 0.01})`;
    ctx.lineWidth = streak % 3 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, runtime.corridorY);
    ctx.lineTo(x + 210, runtime.corridorY + runtime.corridorHeight);
    ctx.stroke();
  }

  for (let lane = 0; lane < 6; lane += 1) {
    const y = runtime.corridorY + 60 + lane * 98;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
    ctx.beginPath();
    ctx.moveTo(runtime.corridorX, y);
    ctx.lineTo(runtime.corridorX + runtime.corridorWidth, y);
    ctx.stroke();
  }

  ctx.restore();

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    runtime.corridorX,
    runtime.corridorY,
    runtime.corridorWidth,
    runtime.corridorHeight,
  );

  for (const gate of runtime.gates) {
    const safeTop = gate.gapY - gate.gapSize / 2;
    const safeBottom = gate.gapY + gate.gapSize / 2;
    const topHeight = safeTop - runtime.corridorY;
    const bottomY = safeBottom;
    const bottomHeight = runtime.corridorY + runtime.corridorHeight - safeBottom;

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(gate.x, runtime.corridorY, gate.width, topHeight);
    ctx.fillRect(gate.x, bottomY, gate.width, bottomHeight);

    ctx.fillStyle = `${state.mode.glitchColor}88`;
    ctx.fillRect(gate.x, safeTop - 6, gate.width, 6);
    ctx.fillRect(gate.x, safeBottom, gate.width, 6);

    if (gate.ring && !gate.ring.collected) {
      const ringX = gate.x + gate.width / 2;
      const ringY = gate.gapY + gate.ring.offsetY;
      const wobble = Math.sin(state.visualTime * 8 + ringX * 0.01) * 2;

      ctx.shadowColor = state.mode.accent;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = state.mode.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ringX, ringY, gate.ring.radius + wobble, 0, TAU);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = state.mode.pulseCore;
      ctx.beginPath();
      ctx.arc(ringX, ringY, 4, 0, TAU);
      ctx.fill();
    }
  }

  drawParticles(runtime.particles);

  ctx.save();
  if (runtime.playerInvulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.translate(runtime.playerX, runtime.playerY);
  ctx.rotate(clamp(runtime.playerVelocity / 440, -0.45, 0.45));

  const trail = ctx.createLinearGradient(-60, 0, 20, 0);
  trail.addColorStop(0, `${state.mode.accent}00`);
  trail.addColorStop(1, `${state.mode.accent}cc`);
  ctx.fillStyle = trail;
  ctx.beginPath();
  ctx.moveTo(-72, 0);
  ctx.lineTo(-12, -10);
  ctx.lineTo(-12, 10);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#fff4d2";
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(-6, -20);
  ctx.lineTo(-16, -9);
  ctx.lineTo(-26, -9);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-26, 9);
  ctx.lineTo(-16, 9);
  ctx.lineTo(-6, 20);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-10, -7);
  ctx.lineTo(-10, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function createCircuitPongRuntime(mode) {
  const lifeCap = getLifeCap(mode);

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    rally: 0,
    bestRally: 0,
    volley: 1,
    paddleWidth: 18,
    paddleHeight: 120,
    playerY: CENTER,
    aiY: CENTER,
    ballX: CENTER,
    ballY: CENTER,
    ballVX: 0,
    ballVY: 0,
    ballRadius: 10,
    serveTimer: 0.75,
    serveDirection: 1,
    particles: [],
    gameOver: false,
  };
}

function getCircuitPongHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.rally),
    status: state.running ? `Volley ${runtime.volley}` : state.ended ? "Finished" : "Ready",
  };
}

function getCircuitPongGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Best rally ${numberFormat.format(runtime.bestRally)}.`;
}

function resetCircuitPongBall(runtime, direction = Math.random() < 0.5 ? -1 : 1) {
  runtime.ballX = CENTER;
  runtime.ballY = CENTER;
  runtime.ballVX = 0;
  runtime.ballVY = 0;
  runtime.serveTimer = 0.75;
  runtime.serveDirection = direction;
  runtime.rally = 0;
}

function updateCircuitPong(dt, runtime) {
  const fieldTop = 88;
  const fieldBottom = 812;
  const playerX = 118;
  const aiX = 782;
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.playerY +=
      (state.input.pointerY - runtime.playerY) * Math.min(1, dt * 12 * controlMultiplier);
  } else {
    const vertical = (state.input.down ? 1 : 0) - (state.input.up ? 1 : 0);
    runtime.playerY += vertical * 540 * controlMultiplier * dt;
  }

  runtime.playerY = clamp(
    runtime.playerY,
    fieldTop + runtime.paddleHeight / 2,
    fieldBottom - runtime.paddleHeight / 2,
  );

  const aiTarget = runtime.ballY + runtime.ballVY * 0.08;
  const aiStep = clamp(aiTarget - runtime.aiY, -1, 1);
  runtime.aiY += aiStep * (300 + runtime.volley * 20) * dt;
  runtime.aiY = clamp(
    runtime.aiY,
    fieldTop + runtime.paddleHeight / 2,
    fieldBottom - runtime.paddleHeight / 2,
  );

  if (runtime.serveTimer > 0) {
    runtime.serveTimer -= dt;
    runtime.ballX = CENTER;
    runtime.ballY = CENTER;

    if (runtime.serveTimer <= 0) {
      const angle = randomBetween(-0.72, 0.72);
      const speed = 340 + runtime.volley * 18;
      runtime.ballVX = Math.cos(angle) * speed * runtime.serveDirection;
      runtime.ballVY = Math.sin(angle) * speed;
    }
  } else {
    runtime.ballX += runtime.ballVX * dt;
    runtime.ballY += runtime.ballVY * dt;

    if (runtime.ballY - runtime.ballRadius <= fieldTop) {
      runtime.ballY = fieldTop + runtime.ballRadius;
      runtime.ballVY *= -1;
    }

    if (runtime.ballY + runtime.ballRadius >= fieldBottom) {
      runtime.ballY = fieldBottom - runtime.ballRadius;
      runtime.ballVY *= -1;
    }

    if (
      runtime.ballVX < 0 &&
      runtime.ballX - runtime.ballRadius <= playerX + runtime.paddleWidth / 2 &&
      runtime.ballX >= playerX &&
      runtime.ballY + runtime.ballRadius >= runtime.playerY - runtime.paddleHeight / 2 &&
      runtime.ballY - runtime.ballRadius <= runtime.playerY + runtime.paddleHeight / 2
    ) {
      const offset = clamp(
        (runtime.ballY - runtime.playerY) / (runtime.paddleHeight / 2),
        -1,
        1,
      );
      const speed = Math.min(720, Math.hypot(runtime.ballVX, runtime.ballVY) + 18);
      runtime.ballVX = Math.abs(speed * 0.92);
      runtime.ballVY = speed * offset * 0.82;
      runtime.ballX = playerX + runtime.paddleWidth / 2 + runtime.ballRadius + 1;
      runtime.rally += 1;
      runtime.bestRally = Math.max(runtime.bestRally, runtime.rally);
      addScore(runtime, 2 + Math.floor(runtime.rally / 4));
      emitParticles(runtime.particles, runtime.ballX, runtime.ballY, state.mode.pulseColor, 10, 50, 140);
    }

    if (
      runtime.ballVX > 0 &&
      runtime.ballX + runtime.ballRadius >= aiX - runtime.paddleWidth / 2 &&
      runtime.ballX <= aiX &&
      runtime.ballY + runtime.ballRadius >= runtime.aiY - runtime.paddleHeight / 2 &&
      runtime.ballY - runtime.ballRadius <= runtime.aiY + runtime.paddleHeight / 2
    ) {
      const offset = clamp(
        (runtime.ballY - runtime.aiY) / (runtime.paddleHeight / 2),
        -1,
        1,
      );
      const speed = Math.min(720, Math.hypot(runtime.ballVX, runtime.ballVY) + 18);
      runtime.ballVX = -Math.abs(speed * 0.92);
      runtime.ballVY = speed * offset * 0.82;
      runtime.ballX = aiX - runtime.paddleWidth / 2 - runtime.ballRadius - 1;
      runtime.rally += 1;
      runtime.bestRally = Math.max(runtime.bestRally, runtime.rally);
      emitParticles(runtime.particles, runtime.ballX, runtime.ballY, state.mode.glitchColor, 8, 40, 120);
    }

    if (runtime.ballX + runtime.ballRadius > 840) {
      addScore(runtime, 28 + runtime.volley * 5);
      emitParticles(runtime.particles, 824, runtime.ballY, state.mode.accent, 20, 80, 220);
      runtime.volley += 1;
      resetCircuitPongBall(runtime, Math.random() < 0.5 ? -1 : 1);
    }

    if (runtime.ballX - runtime.ballRadius < 60) {
      runtime.lives -= 1;
      state.flash = 0.74;
      state.shake = 8;
      emitParticles(runtime.particles, 76, runtime.ballY, state.mode.glitchColor, 22, 90, 220);

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
      } else {
        resetCircuitPongBall(runtime, 1);
      }
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderCircuitPong(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.setLineDash([18, 18]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(CENTER, 104);
  ctx.lineTo(CENTER, 796);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 58, 724);
  ctx.fillRect(754, 88, 58, 724);

  drawParticles(runtime.particles);

  ctx.fillStyle = state.mode.pulseColor;
  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillRect(109, runtime.playerY - runtime.paddleHeight / 2, runtime.paddleWidth, runtime.paddleHeight);

  ctx.fillStyle = `${state.mode.glitchColor}dd`;
  ctx.shadowColor = state.mode.glitchColor;
  ctx.fillRect(773, runtime.aiY - runtime.paddleHeight / 2, runtime.paddleWidth, runtime.paddleHeight);
  ctx.shadowBlur = 0;

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 20;
  ctx.fillStyle = state.mode.accent;
  ctx.beginPath();
  ctx.arc(runtime.ballX, runtime.ballY, runtime.ballRadius, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.pulseCore;
  ctx.beginPath();
  ctx.arc(runtime.ballX, runtime.ballY, runtime.ballRadius * 0.42, 0, TAU);
  ctx.fill();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function createCrosswalkFluxRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const boardLeft = 92;
  const boardTop = 88;
  const boardWidth = 716;
  const boardHeight = 724;
  const laneCenters = Array.from({ length: 6 }, (_, index) => 194 + index * 86);
  const lanes = laneCenters.map((y, index) => ({
    y,
    height: 52,
    direction: index % 2 === 0 ? 1 : -1,
    baseSpeed: 120 + index * 20,
    cars: Array.from({ length: 3 + (index % 2) }, (_, carIndex) => ({
      x: boardLeft + 60 + carIndex * 220 + randomBetween(-26, 26),
      width: randomBetween(72, 122),
      height: 34 + (index % 2) * 6,
      color:
        index % 3 === 0 ? "#a4ecff" : index % 3 === 1 ? "#ffe07a" : "#ff9274",
    })),
  }));

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    crossings: 0,
    wave: 1,
    boardLeft,
    boardTop,
    boardWidth,
    boardHeight,
    lanes,
    playerX: CENTER,
    playerY: 760,
    playerRadius: 18,
    playerInvulnerable: 0,
    particles: [],
    gameOver: false,
  };
}

function getCrosswalkFluxHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.crossings),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getCrosswalkFluxGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Crossings ${numberFormat.format(runtime.crossings)}.`;
}

function resetCrosswalkFluxPlayer(runtime) {
  runtime.playerX = CENTER;
  runtime.playerY = 760;
}

function updateCrosswalkFlux(dt, runtime) {
  runtime.wave = 1 + Math.floor(runtime.crossings / 3);
  runtime.playerInvulnerable = Math.max(0, runtime.playerInvulnerable - dt);
  const controlMultiplier = getControlMultiplier();

  let dx = 0;
  let dy = 0;

  if (state.input.left) {
    dx -= 1;
  }

  if (state.input.right) {
    dx += 1;
  }

  if (state.input.up) {
    dy -= 1;
  }

  if (state.input.down) {
    dy += 1;
  }

  if (state.input.pointerActive) {
    const vectorX = state.input.pointerX - runtime.playerX;
    const vectorY = state.input.pointerY - runtime.playerY;
    const pointerLength = Math.hypot(vectorX, vectorY);

    if (pointerLength > 8) {
      dx += vectorX / pointerLength;
      dy += vectorY / pointerLength;
    }
  }

  const moveLength = Math.hypot(dx, dy);
  if (moveLength > 0) {
    dx /= moveLength;
    dy /= moveLength;
  }

  const moveSpeed = 280 * controlMultiplier;
  runtime.playerX += dx * moveSpeed * dt;
  runtime.playerY += dy * moveSpeed * dt;

  runtime.playerX = clamp(
    runtime.playerX,
    runtime.boardLeft + runtime.playerRadius,
    runtime.boardLeft + runtime.boardWidth - runtime.playerRadius,
  );
  runtime.playerY = clamp(
    runtime.playerY,
    runtime.boardTop + runtime.playerRadius,
    runtime.boardTop + runtime.boardHeight - runtime.playerRadius,
  );

  const laneScale = 1 + (runtime.wave - 1) * 0.14;
  for (const lane of runtime.lanes) {
    for (const car of lane.cars) {
      car.x += lane.direction * lane.baseSpeed * laneScale * dt;

      if (lane.direction > 0 && car.x - car.width / 2 > runtime.boardLeft + runtime.boardWidth + 90) {
        car.x = runtime.boardLeft - car.width / 2 - randomBetween(60, 180);
      }

      if (lane.direction < 0 && car.x + car.width / 2 < runtime.boardLeft - 90) {
        car.x = runtime.boardLeft + runtime.boardWidth + car.width / 2 + randomBetween(60, 180);
      }

      if (runtime.playerInvulnerable <= 0) {
        const nearestX = clamp(
          runtime.playerX,
          car.x - car.width / 2,
          car.x + car.width / 2,
        );
        const nearestY = clamp(
          runtime.playerY,
          lane.y - lane.height / 2,
          lane.y + lane.height / 2,
        );

        if (
          distance(runtime.playerX, runtime.playerY, nearestX, nearestY) <=
          runtime.playerRadius
        ) {
          runtime.lives -= 1;
          runtime.playerInvulnerable = 1;
          state.flash = 0.8;
          state.shake = 8;
          emitParticles(runtime.particles, runtime.playerX, runtime.playerY, state.mode.glitchColor, 22, 90, 220);

          if (runtime.lives <= 0) {
            runtime.gameOver = true;
          } else {
            resetCrosswalkFluxPlayer(runtime);
          }

          break;
        }
      }
    }

    if (runtime.gameOver || runtime.playerInvulnerable > 0) {
      continue;
    }
  }

  if (!runtime.gameOver && runtime.playerY <= runtime.boardTop + 48) {
    runtime.crossings += 1;
    addScore(runtime, 30 + runtime.wave * 7);
    emitParticles(runtime.particles, runtime.playerX, runtime.playerY, state.mode.accent, 24, 80, 220);
    resetCrosswalkFluxPlayer(runtime);
  }

  updateParticles(runtime.particles, dt);
}

function renderCrosswalkFlux(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(runtime.boardLeft, runtime.boardTop, runtime.boardWidth, runtime.boardHeight);

  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fillRect(runtime.boardLeft, runtime.boardTop, runtime.boardWidth, 72);
  ctx.fillRect(runtime.boardLeft, runtime.boardTop + runtime.boardHeight - 86, runtime.boardWidth, 86);

  for (let laneIndex = 0; laneIndex < runtime.lanes.length; laneIndex += 1) {
    const lane = runtime.lanes[laneIndex];
    ctx.fillStyle = laneIndex % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(runtime.boardLeft, lane.y - 38, runtime.boardWidth, 76);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.setLineDash([26, 18]);
    ctx.beginPath();
    ctx.moveTo(runtime.boardLeft + 18, lane.y);
    ctx.lineTo(runtime.boardLeft + runtime.boardWidth - 18, lane.y);
    ctx.stroke();
    ctx.setLineDash([]);

    for (const car of lane.cars) {
      ctx.shadowColor = car.color;
      ctx.shadowBlur = 14;
      ctx.fillStyle = car.color;
      ctx.fillRect(
        car.x - car.width / 2,
        lane.y - car.height / 2,
        car.width,
        car.height,
      );
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
      ctx.fillRect(
        car.x - car.width / 2,
        lane.y - car.height / 2,
        car.width,
        5,
      );
    }
  }

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(runtime.boardLeft, runtime.boardTop, runtime.boardWidth, runtime.boardHeight);

  drawParticles(runtime.particles);

  ctx.save();
  if (runtime.playerInvulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.44;
  }

  ctx.translate(runtime.playerX, runtime.playerY);
  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#fff4cf";
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(18, 2);
  ctx.lineTo(11, 20);
  ctx.lineTo(-11, 20);
  ctx.lineTo(-18, 2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(7, 4);
  ctx.lineTo(0, 10);
  ctx.lineTo(-7, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function spawnBeaconClimbPlatform(runtime, y, safe = false) {
  const width = safe ? 180 : randomBetween(100, 160);
  const x = safe
    ? CENTER
    : randomBetween(92 + width / 2, 808 - width / 2);
  const boost = !safe && Math.random() < Math.min(0.24, 0.08 + runtime.stage * 0.025);

  runtime.platforms.push({
    x,
    y,
    width,
    height: 14,
    boost,
  });

  if (!safe && Math.random() < 0.34) {
    runtime.stars.push({
      x: x + randomBetween(-width * 0.22, width * 0.22),
      y: y - 28,
      radius: 10,
      spin: Math.random() * TAU,
      speed: randomBetween(1.8, 3.6),
    });
  }
}

function refillBeaconClimb(runtime) {
  let topY = runtime.platforms.reduce((min, platform) => Math.min(min, platform.y), canvas.height);

  while (topY > -80) {
    topY -= randomBetween(74, 108);
    spawnBeaconClimbPlatform(runtime, topY);
  }
}

function resetBeaconClimbPlayer(runtime) {
  runtime.player.x = CENTER;
  runtime.player.y = 700;
  runtime.player.vy = -620;
}

function createBeaconClimbRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    height: 0,
    peakHeight: 0,
    stage: 1,
    heightBank: 0,
    player: {
      x: CENTER,
      y: 700,
      radius: 18,
      vy: -620,
    },
    platforms: [],
    stars: [],
    particles: [],
    gameOver: false,
  };

  spawnBeaconClimbPlatform(runtime, 786, true);
  for (let y = 706; y > 40; y -= 94) {
    spawnBeaconClimbPlatform(runtime, y);
  }
  refillBeaconClimb(runtime);
  return runtime;
}

function getBeaconClimbHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(Math.floor(runtime.peakHeight)),
    status: state.running ? `Stage ${runtime.stage}` : state.ended ? "Finished" : "Ready",
  };
}

function getBeaconClimbGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Peak height ${numberFormat.format(Math.floor(runtime.peakHeight))}.`;
}

function updateBeaconClimb(dt, runtime) {
  runtime.stage = 1 + Math.floor(runtime.height / 700);
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.player.x +=
      (state.input.pointerX - runtime.player.x) * Math.min(1, dt * 9 * controlMultiplier);
  } else {
    const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    runtime.player.x += horizontal * 340 * controlMultiplier * dt;
  }

  if (runtime.player.x < -runtime.player.radius) {
    runtime.player.x = canvas.width + runtime.player.radius;
  }

  if (runtime.player.x > canvas.width + runtime.player.radius) {
    runtime.player.x = -runtime.player.radius;
  }

  const previousY = runtime.player.y;
  runtime.player.vy += 980 * dt;
  runtime.player.y += runtime.player.vy * dt;

  if (runtime.player.vy > 0) {
    for (const platform of runtime.platforms) {
      const landed =
        previousY + runtime.player.radius <= platform.y &&
        runtime.player.y + runtime.player.radius >= platform.y &&
        Math.abs(runtime.player.x - platform.x) <= platform.width / 2 + runtime.player.radius;

      if (!landed) {
        continue;
      }

      runtime.player.y = platform.y - runtime.player.radius;
      runtime.player.vy = platform.boost ? -920 - runtime.stage * 12 : -700 - runtime.stage * 10;
      addScore(runtime, platform.boost ? 9 : 4);
      emitParticles(
        runtime.particles,
        runtime.player.x,
        platform.y,
        platform.boost ? state.mode.accent : state.mode.pulseColor,
        platform.boost ? 18 : 10,
        70,
        180,
      );
      break;
    }
  }

  for (let index = runtime.stars.length - 1; index >= 0; index -= 1) {
    const star = runtime.stars[index];
    star.spin += dt * star.speed;

    if (distance(runtime.player.x, runtime.player.y, star.x, star.y) <= star.radius + runtime.player.radius) {
      addScore(runtime, 24 + runtime.stage * 4);
      emitParticles(runtime.particles, star.x, star.y, state.mode.accent, 18, 80, 220);
      runtime.stars.splice(index, 1);
    }
  }

  if (runtime.player.y < 290 && runtime.player.vy < 0) {
    const delta = 290 - runtime.player.y;
    runtime.player.y = 290;
    runtime.height += delta;
    runtime.peakHeight = Math.max(runtime.peakHeight, runtime.height);
    runtime.heightBank += delta;

    while (runtime.heightBank >= 140) {
      addScore(runtime, 10);
      runtime.heightBank -= 140;
    }

    for (const platform of runtime.platforms) {
      platform.y += delta;
    }

    for (const star of runtime.stars) {
      star.y += delta;
    }

    for (const particle of runtime.particles) {
      particle.y += delta;
    }
  }

  runtime.platforms = runtime.platforms.filter((platform) => platform.y < canvas.height + 40);
  runtime.stars = runtime.stars.filter((star) => star.y < canvas.height + 40);
  refillBeaconClimb(runtime);

  if (runtime.player.y - runtime.player.radius > canvas.height + 48) {
    runtime.lives -= 1;
    state.flash = 0.72;
    state.shake = 8;
    emitParticles(runtime.particles, clamp(runtime.player.x, 80, 820), 790, state.mode.glitchColor, 20, 90, 220);

    if (runtime.lives <= 0) {
      runtime.gameOver = true;
    } else {
      resetBeaconClimbPlayer(runtime);
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderBeaconClimb(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  for (let line = 0; line < 8; line += 1) {
    const y = 114 + line * 86 + (state.visualTime * 24) % 86;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
    ctx.beginPath();
    ctx.moveTo(118, y);
    ctx.lineTo(782, y);
    ctx.stroke();
  }

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  for (const platform of runtime.platforms) {
    ctx.shadowColor = platform.boost ? state.mode.accent : state.mode.pulseColor;
    ctx.shadowBlur = platform.boost ? 18 : 12;
    ctx.fillStyle = platform.boost ? state.mode.accent : state.mode.pulseColor;
    ctx.fillRect(platform.x - platform.width / 2, platform.y - platform.height / 2, platform.width, platform.height);
    ctx.shadowBlur = 0;
  }

  for (const star of runtime.stars) {
    ctx.save();
    ctx.translate(star.x, star.y);
    ctx.rotate(star.spin);
    ctx.shadowColor = state.mode.accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = state.mode.accent;
    ctx.beginPath();

    for (let point = 0; point < 8; point += 1) {
      const radius = point % 2 === 0 ? star.radius : star.radius * 0.42;
      const angle = (point / 8) * TAU;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (point === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawParticles(runtime.particles);

  ctx.save();
  ctx.translate(runtime.player.x, runtime.player.y);

  const trail = ctx.createLinearGradient(0, 12, 0, 54);
  trail.addColorStop(0, `${state.mode.accent}cc`);
  trail.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = trail;
  ctx.beginPath();
  ctx.moveTo(-8, 12);
  ctx.lineTo(0, 50 + Math.sin(state.visualTime * 14) * 5);
  ctx.lineTo(8, 12);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#fff5d2";
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(16, 12);
  ctx.lineTo(0, 18);
  ctx.lineTo(-16, 12);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(6, 4);
  ctx.lineTo(0, 10);
  ctx.lineTo(-6, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function spawnGemDiggerEnemy(runtime, taken) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const x = Math.floor(Math.random() * runtime.cols);
    const y = Math.floor(Math.random() * runtime.rows);
    const key = `${x},${y}`;

    if (taken.has(key) || Math.abs(x - 1) + Math.abs(y - 1) < 7) {
      continue;
    }

    taken.add(key);
    return {
      x,
      y,
      pulse: Math.random() * TAU,
    };
  }

  taken.add(`${runtime.cols - 2},${runtime.rows - 2}`);
  return {
    x: runtime.cols - 2,
    y: runtime.rows - 2,
    pulse: Math.random() * TAU,
  };
}

function setupGemDiggerCave(runtime) {
  runtime.cleared = Array.from({ length: runtime.rows }, () =>
    Array.from({ length: runtime.cols }, () => false),
  );
  runtime.player = { x: 1, y: 1 };
  runtime.cleared[1][1] = true;
  runtime.moveTimer = 0;
  runtime.enemyTimer = Math.max(0.16, 0.38 - runtime.wave * 0.012);
  runtime.queuedDirection = { x: 0, y: 0 };

  const taken = new Set(["1,1"]);
  runtime.gems = [];

  const gemCount = Math.min(runtime.cols * runtime.rows - 12, 12 + runtime.wave * 3);
  while (runtime.gems.length < gemCount) {
    const x = Math.floor(Math.random() * runtime.cols);
    const y = Math.floor(Math.random() * runtime.rows);
    const key = `${x},${y}`;

    if (taken.has(key) || Math.abs(x - 1) + Math.abs(y - 1) < 3) {
      continue;
    }

    taken.add(key);
    runtime.gems.push({
      x,
      y,
      pulse: Math.random() * TAU,
    });
  }

  runtime.enemies = Array.from(
    { length: Math.min(5, 2 + Math.floor(runtime.wave / 2)) },
    () => spawnGemDiggerEnemy(runtime, taken),
  );
}

function resetGemDiggerPositions(runtime) {
  runtime.player = { x: 1, y: 1 };
  runtime.moveTimer = 0.08;
  runtime.enemyTimer = 0.38;
  runtime.queuedDirection = { x: 0, y: 0 };

  const taken = new Set(["1,1"]);
  runtime.enemies = runtime.enemies.map(() => spawnGemDiggerEnemy(runtime, taken));
}

function hitGemDiggerPlayer(runtime) {
  const hitX = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
  const hitY = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;
  runtime.lives -= 1;
  state.flash = 0.82;
  state.shake = 9;
  emitParticles(runtime.particles, hitX, hitY, state.mode.glitchColor, 24, 90, 220);

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
  } else {
    resetGemDiggerPositions(runtime);
  }
}

function createGemDiggerRuntime(mode) {
  const cell = 46;
  const cols = 13;
  const rows = 13;
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    cols,
    rows,
    cell,
    boardX: (canvas.width - cols * cell) / 2,
    boardY: (canvas.height - rows * cell) / 2,
    cleared: [],
    gems: [],
    enemies: [],
    particles: [],
    player: { x: 1, y: 1 },
    moveTimer: 0,
    enemyTimer: 0.34,
    queuedDirection: { x: 0, y: 0 },
    gameOver: false,
  };

  setupGemDiggerCave(runtime);
  return runtime;
}

function getGemDiggerHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.gems.length),
    status: state.running ? `Cave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getGemDiggerGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached cave ${numberFormat.format(runtime.wave)}.`;
}

function updateGemDigger(dt, runtime) {
  if (state.input.left) {
    runtime.queuedDirection = { x: -1, y: 0 };
  } else if (state.input.right) {
    runtime.queuedDirection = { x: 1, y: 0 };
  } else if (state.input.up) {
    runtime.queuedDirection = { x: 0, y: -1 };
  } else if (state.input.down) {
    runtime.queuedDirection = { x: 0, y: 1 };
  }

  if (state.input.pointerActive) {
    const centerX = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
    const centerY = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;
    const dx = state.input.pointerX - centerX;
    const dy = state.input.pointerY - centerY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > runtime.cell * 0.3) {
      runtime.queuedDirection = { x: dx > 0 ? 1 : -1, y: 0 };
    } else if (Math.abs(dy) > runtime.cell * 0.3) {
      runtime.queuedDirection = { x: 0, y: dy > 0 ? 1 : -1 };
    }
  }

  runtime.moveTimer -= dt;
  if (runtime.moveTimer <= 0 && (runtime.queuedDirection.x !== 0 || runtime.queuedDirection.y !== 0)) {
    const nextX = runtime.player.x + runtime.queuedDirection.x;
    const nextY = runtime.player.y + runtime.queuedDirection.y;

    if (nextX >= 0 && nextX < runtime.cols && nextY >= 0 && nextY < runtime.rows) {
      runtime.player.x = nextX;
      runtime.player.y = nextY;
      runtime.cleared[nextY][nextX] = true;

      const gemIndex = runtime.gems.findIndex((gem) => gem.x === nextX && gem.y === nextY);
      if (gemIndex >= 0) {
        addScore(runtime, 20 + runtime.wave * 3);
        const fx = runtime.boardX + nextX * runtime.cell + runtime.cell / 2;
        const fy = runtime.boardY + nextY * runtime.cell + runtime.cell / 2;
        emitParticles(runtime.particles, fx, fy, state.mode.accent, 18, 70, 180);
        runtime.gems.splice(gemIndex, 1);

        if (runtime.gems.length === 0) {
          addScore(runtime, 50 + runtime.wave * 8);
          runtime.wave += 1;
          setupGemDiggerCave(runtime);
          updateParticles(runtime.particles, dt);
          return;
        }
      }

      if (
        runtime.enemies.some(
          (enemy) => enemy.x === runtime.player.x && enemy.y === runtime.player.y,
        )
      ) {
        hitGemDiggerPlayer(runtime);
      }
    }

    runtime.moveTimer += Math.max(0.08, 0.18 / getControlMultiplier());
  }

  runtime.enemyTimer -= dt;
  while (runtime.enemyTimer <= 0 && !runtime.gameOver) {
    const occupied = new Set();

    for (const enemy of runtime.enemies) {
      const dx = runtime.player.x - enemy.x;
      const dy = runtime.player.y - enemy.y;
      const options = [];

      if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
        options.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
      }

      if (dy !== 0) {
        options.push({ x: enemy.x, y: enemy.y + Math.sign(dy) });
      }

      if (Math.abs(dx) < Math.abs(dy) && dx !== 0) {
        options.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
      }

      options.push(
        { x: enemy.x + 1, y: enemy.y },
        { x: enemy.x - 1, y: enemy.y },
        { x: enemy.x, y: enemy.y + 1 },
        { x: enemy.x, y: enemy.y - 1 },
      );

      let next = { x: enemy.x, y: enemy.y };

      for (const candidate of options) {
        const key = `${candidate.x},${candidate.y}`;
        if (
          candidate.x < 0 ||
          candidate.x >= runtime.cols ||
          candidate.y < 0 ||
          candidate.y >= runtime.rows ||
          occupied.has(key)
        ) {
          continue;
        }

        next = candidate;
        break;
      }

      enemy.x = next.x;
      enemy.y = next.y;
      enemy.pulse += 0.8;
      occupied.add(`${enemy.x},${enemy.y}`);

      if (enemy.x === runtime.player.x && enemy.y === runtime.player.y) {
        hitGemDiggerPlayer(runtime);
        break;
      }
    }

    runtime.enemyTimer += Math.max(0.12, 0.34 - runtime.wave * 0.012);
  }

  for (const gem of runtime.gems) {
    gem.pulse += dt * 3;
  }

  for (const enemy of runtime.enemies) {
    enemy.pulse += dt * 2;
  }

  updateParticles(runtime.particles, dt);
}

function renderGemDigger(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(
    runtime.boardX,
    runtime.boardY,
    runtime.cols * runtime.cell,
    runtime.rows * runtime.cell,
  );

  for (let row = 0; row < runtime.rows; row += 1) {
    for (let col = 0; col < runtime.cols; col += 1) {
      const x = runtime.boardX + col * runtime.cell;
      const y = runtime.boardY + row * runtime.cell;

      ctx.fillStyle = runtime.cleared[row][col]
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(112, 73, 46, 0.52)";
      ctx.fillRect(x, y, runtime.cell, runtime.cell);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeRect(x, y, runtime.cell, runtime.cell);
    }
  }

  for (const gem of runtime.gems) {
    const x = runtime.boardX + gem.x * runtime.cell + runtime.cell / 2;
    const y = runtime.boardY + gem.y * runtime.cell + runtime.cell / 2;
    const radius = 10 + Math.sin(gem.pulse) * 1.5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(gem.pulse * 0.7);
    ctx.shadowColor = state.mode.accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = state.mode.accent;
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.72, 0);
    ctx.lineTo(0, radius);
    ctx.lineTo(-radius * 0.72, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  for (const enemy of runtime.enemies) {
    const x = runtime.boardX + enemy.x * runtime.cell + runtime.cell / 2;
    const y = runtime.boardY + enemy.y * runtime.cell + runtime.cell / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(enemy.pulse) * 0.15);
    ctx.shadowColor = state.mode.glitchColor;
    ctx.shadowBlur = 16;
    ctx.fillStyle = state.mode.glitchColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 18, 0, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#2e0f0a";
    ctx.beginPath();
    ctx.arc(-4, -3, 2.5, 0, TAU);
    ctx.arc(4, -3, 2.5, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  drawParticles(runtime.particles);

  const playerX = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
  const playerY = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;

  ctx.save();
  ctx.translate(playerX, playerY);
  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff5d0";
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(14, -2);
  ctx.lineTo(10, 16);
  ctx.lineTo(-10, 16);
  ctx.lineTo(-14, -2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.accent;
  ctx.fillRect(-12, -18, 24, 6);
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.arc(0, 2, 6, 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    runtime.boardX,
    runtime.boardY,
    runtime.cols * runtime.cell,
    runtime.rows * runtime.cell,
  );

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function syncBladeHaloBlades(runtime) {
  const targetCount = Math.min(5, 2 + Math.floor((runtime.wave - 1) / 2));

  while (runtime.blades.length < targetCount) {
    runtime.blades.push({
      angle: Math.random() * TAU,
      speed: (Math.random() < 0.5 ? -1 : 1) * randomBetween(0.9, 1.45),
      width: randomBetween(14, 22),
      lengthBase: randomBetween(runtime.hubRadius + 110, runtime.arenaRadius - 48),
      lengthSwing: randomBetween(18, 72),
      pulseSpeed: randomBetween(1.2, 2.3),
      phase: Math.random() * TAU,
    });
  }
}

function spawnBladeHaloPickup(runtime) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const angle = Math.random() * TAU;
    const radius = randomBetween(runtime.hubRadius + 74, runtime.arenaRadius - 36);
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;
    const crowded = runtime.pickups.some((pickup) => distance(pickup.x, pickup.y, x, y) < 54);

    if (!crowded) {
      runtime.pickups.push({
        x,
        y,
        radius: 12,
        phase: Math.random() * TAU,
      });
      return;
    }
  }
}

function createBladeHaloRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    elapsed: 0,
    arenaRadius: 332,
    hubRadius: 78,
    player: {
      x: CENTER,
      y: CENTER + 220,
      radius: 17,
      invulnerable: 0,
    },
    blades: [],
    pickups: [],
    particles: [],
    pickupTimer: 0.55,
    gameOver: false,
  };

  syncBladeHaloBlades(runtime);
  spawnBladeHaloPickup(runtime);
  spawnBladeHaloPickup(runtime);
  return runtime;
}

function getBladeHaloHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.wave),
    status: state.running ? `Spin ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getBladeHaloGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached wave ${numberFormat.format(runtime.wave)}.`;
}

function updateBladeHalo(dt, runtime) {
  runtime.elapsed += dt;
  runtime.wave = 1 + Math.floor(runtime.elapsed / 15 + runtime.score / 260);
  runtime.player.invulnerable = Math.max(0, runtime.player.invulnerable - dt);
  syncBladeHaloBlades(runtime);

  let dx = 0;
  let dy = 0;

  if (state.input.left) {
    dx -= 1;
  }

  if (state.input.right) {
    dx += 1;
  }

  if (state.input.up) {
    dy -= 1;
  }

  if (state.input.down) {
    dy += 1;
  }

  if (state.input.pointerActive) {
    const pointerX = state.input.pointerX - runtime.player.x;
    const pointerY = state.input.pointerY - runtime.player.y;
    const pointerLength = Math.hypot(pointerX, pointerY);

    if (pointerLength > 6) {
      dx += pointerX / pointerLength;
      dy += pointerY / pointerLength;
    }
  }

  const axisLength = Math.hypot(dx, dy);
  if (axisLength > 0) {
    dx /= axisLength;
    dy /= axisLength;
  }

  const controlMultiplier = getControlMultiplier();
  runtime.player.x += dx * 300 * controlMultiplier * dt;
  runtime.player.y += dy * 300 * controlMultiplier * dt;

  const offsetX = runtime.player.x - CENTER;
  const offsetY = runtime.player.y - CENTER;
  const playerDistance = Math.hypot(offsetX, offsetY);
  const minRadius = runtime.hubRadius + 34;
  const maxRadius = runtime.arenaRadius - runtime.player.radius;

  if (playerDistance === 0) {
    runtime.player.x = CENTER + minRadius;
    runtime.player.y = CENTER;
  }

  if (playerDistance > 0 && playerDistance < minRadius) {
    runtime.player.x = CENTER + (offsetX / playerDistance) * minRadius;
    runtime.player.y = CENTER + (offsetY / playerDistance) * minRadius;
  }

  if (playerDistance > maxRadius) {
    runtime.player.x = CENTER + (offsetX / playerDistance) * maxRadius;
    runtime.player.y = CENTER + (offsetY / playerDistance) * maxRadius;
  }

  runtime.pickupTimer -= dt;
  while (runtime.pickupTimer <= 0 && runtime.pickups.length < 3) {
    spawnBladeHaloPickup(runtime);
    runtime.pickupTimer += Math.max(0.48, 1.04 - runtime.wave * 0.045 + Math.random() * 0.14);
  }

  for (let index = runtime.pickups.length - 1; index >= 0; index -= 1) {
    const pickup = runtime.pickups[index];
    pickup.phase += dt * 3.4;

    if (
      distance(runtime.player.x, runtime.player.y, pickup.x, pickup.y) <=
      runtime.player.radius + pickup.radius
    ) {
      addScore(runtime, 20 + runtime.wave * 4);
      emitParticles(runtime.particles, pickup.x, pickup.y, state.mode.accent, 20, 80, 220);
      runtime.pickups.splice(index, 1);
    }
  }

  for (const blade of runtime.blades) {
    blade.angle = wrapAngle(blade.angle + blade.speed * dt * (0.96 + runtime.wave * 0.07));

    const bladeLength = clamp(
      blade.lengthBase + Math.sin(runtime.elapsed * blade.pulseSpeed + blade.phase) * blade.lengthSwing,
      runtime.hubRadius + 42,
      runtime.arenaRadius - 18,
    );

    const start = polarToCartesian(blade.angle, runtime.hubRadius + 10);
    const end = polarToCartesian(blade.angle, bladeLength);

    if (
      runtime.player.invulnerable <= 0 &&
      distancePointToSegment(
        runtime.player.x,
        runtime.player.y,
        start.x,
        start.y,
        end.x,
        end.y,
      ) <=
        runtime.player.radius + blade.width / 2
    ) {
      runtime.lives -= 1;
      runtime.player.invulnerable = 1;
      state.flash = 0.78;
      state.shake = 9;
      emitParticles(runtime.particles, runtime.player.x, runtime.player.y, state.mode.glitchColor, 24, 90, 220);

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
      }

      break;
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderBladeHalo(runtime) {
  ctx.save();

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.arenaRadius, 0, TAU);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.arenaRadius - 62, 0, TAU);
  ctx.stroke();

  for (let spoke = 0; spoke < 12; spoke += 1) {
    const angle = (spoke / 12) * TAU + state.visualTime * 0.06;
    const start = polarToCartesian(angle, runtime.hubRadius + 18);
    const end = polarToCartesian(angle, runtime.arenaRadius);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  for (const blade of runtime.blades) {
    const bladeLength = clamp(
      blade.lengthBase + Math.sin(runtime.elapsed * blade.pulseSpeed + blade.phase) * blade.lengthSwing,
      runtime.hubRadius + 42,
      runtime.arenaRadius - 18,
    );
    const start = polarToCartesian(blade.angle, runtime.hubRadius + 10);
    const end = polarToCartesian(blade.angle, bladeLength);

    ctx.strokeStyle = `${state.mode.glitchColor}dd`;
    ctx.lineWidth = blade.width;
    ctx.lineCap = "round";
    ctx.shadowColor = state.mode.glitchColor;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  for (const pickup of runtime.pickups) {
    const pulse = pickup.radius + Math.sin(pickup.phase) * 1.8;
    ctx.shadowColor = state.mode.accent;
    ctx.shadowBlur = 20;
    ctx.fillStyle = state.mode.accent;
    ctx.beginPath();
    ctx.arc(pickup.x, pickup.y, pulse, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = state.mode.pulseCore;
    ctx.beginPath();
    ctx.arc(pickup.x, pickup.y, 4, 0, TAU);
    ctx.fill();
  }

  drawParticles(runtime.particles);

  const coreGlow = ctx.createRadialGradient(CENTER, CENTER, 20, CENTER, CENTER, runtime.hubRadius + 40);
  coreGlow.addColorStop(0, `${state.mode.accent}88`);
  coreGlow.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.hubRadius + 40, 0, TAU);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.hubRadius + 10, 0, TAU);
  ctx.fill();

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 22;
  ctx.fillStyle = state.mode.accent;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.hubRadius - 8, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.save();
  if (runtime.player.invulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.42;
  }

  ctx.translate(runtime.player.x, runtime.player.y);
  ctx.rotate(Math.atan2(runtime.player.y - CENTER, runtime.player.x - CENTER) + Math.PI / 2);
  ctx.fillStyle = "#fff4d0";
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(16, 6);
  ctx.lineTo(0, 18);
  ctx.lineTo(-16, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(6, 5);
  ctx.lineTo(0, 10);
  ctx.lineTo(-6, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function buildPulseInvaderFormation(mode, wave) {
  const siege = mode.id === "drone-siege";
  const rows = (siege ? 3 : 4) + Math.min(siege ? 3 : 2, Math.floor((wave - 1) / (siege ? 1 : 2)));
  const cols = siege ? 7 : 8;
  const gapX = siege ? 82 : 74;
  const gapY = siege ? 60 : 56;
  const startX = CENTER - ((cols - 1) * gapX) / 2;
  const startY = 140;
  const enemies = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const elite = siege && (row === 0 || (row + col) % 5 === 0);
      enemies.push({
        x: startX + col * gapX,
        y: startY + row * gapY,
        width: elite ? 38 : 30,
        height: elite ? 24 : 20,
        health: elite ? 2 : 1,
        maxHealth: elite ? 2 : 1,
        phase: Math.random() * TAU,
      });
    }
  }

  return enemies;
}

function resetPulseInvadersWave(runtime) {
  runtime.bullets = [];
  runtime.enemyShots = [];
  runtime.enemies = buildPulseInvaderFormation(state.mode, runtime.wave);
  runtime.formationDir = 1;
  runtime.formationTimer = 0.4;
  runtime.enemyShotTimer = state.mode.id === "drone-siege" ? 0.74 : 0.92;
}

function damagePulseInvadersPlayer(runtime) {
  runtime.lives -= 1;
  state.flash = 0.82;
  state.shake = 9;
  emitParticles(runtime.particles, runtime.playerX, runtime.playerY - 10, state.mode.glitchColor, 24, 90, 220);

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
    return;
  }

  resetPulseInvadersWave(runtime);
}

function createPulseInvadersRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    wave: 1,
    playerX: CENTER,
    playerY: 782,
    playerWidth: mode.id === "drone-siege" ? 78 : 72,
    playerHeight: 26,
    bullets: [],
    enemyShots: [],
    enemies: [],
    formationDir: 1,
    formationTimer: 0.42,
    enemyShotTimer: 0.9,
    fireTimer: 0.06,
    particles: [],
    gameOver: false,
  };

  resetPulseInvadersWave(runtime);
  return runtime;
}

function getPulseInvadersHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.wave),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getPulseInvadersGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached wave ${numberFormat.format(runtime.wave)}.`;
}

function updatePulseInvaders(dt, runtime) {
  const controlMultiplier = getControlMultiplier();

  if (state.input.pointerActive) {
    runtime.playerX +=
      (state.input.pointerX - runtime.playerX) * Math.min(1, dt * 12 * controlMultiplier);
  } else {
    const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
    runtime.playerX += horizontal * 520 * controlMultiplier * dt;
  }

  runtime.playerX = clamp(runtime.playerX, 110, 790);

  runtime.fireTimer -= dt;
  while (runtime.fireTimer <= 0) {
    runtime.bullets.push({
      x: runtime.playerX,
      y: runtime.playerY - 20,
      radius: 5,
      speed: state.mode.id === "drone-siege" ? 620 : 680,
    });
    runtime.fireTimer += Math.max(0.08, (state.mode.id === "drone-siege" ? 0.18 : 0.15) - runtime.wave * 0.003);
  }

  runtime.formationTimer -= dt;
  while (runtime.formationTimer <= 0) {
    const step = (state.mode.id === "drone-siege" ? 24 : 28) + runtime.wave * 0.8;
    const minX = Math.min(...runtime.enemies.map((enemy) => enemy.x - enemy.width / 2));
    const maxX = Math.max(...runtime.enemies.map((enemy) => enemy.x + enemy.width / 2));

    if (
      (runtime.formationDir > 0 && maxX + step > 800) ||
      (runtime.formationDir < 0 && minX - step < 100)
    ) {
      runtime.formationDir *= -1;
      for (const enemy of runtime.enemies) {
        enemy.y += 24 + runtime.wave * 1.5;
      }
    } else {
      for (const enemy of runtime.enemies) {
        enemy.x += runtime.formationDir * step;
        enemy.phase += 0.5;
      }
    }

    runtime.formationTimer += Math.max(0.12, (state.mode.id === "drone-siege" ? 0.46 : 0.4) - runtime.wave * 0.014);
  }

  runtime.enemyShotTimer -= dt;
  while (runtime.enemyShotTimer <= 0 && runtime.enemies.length > 0) {
    const columns = new Map();

    for (const enemy of runtime.enemies) {
      const key = Math.round(enemy.x / 45);
      const current = columns.get(key);

      if (!current || enemy.y > current.y) {
        columns.set(key, enemy);
      }
    }

    const shooters = [...columns.values()];
    const shooter = shooters[Math.floor(Math.random() * shooters.length)];

    if (shooter) {
      runtime.enemyShots.push({
        x: shooter.x,
        y: shooter.y + shooter.height / 2 + 6,
        radius: shooter.maxHealth > 1 ? 7 : 5,
        speed: shooter.maxHealth > 1 ? 320 + runtime.wave * 18 : 280 + runtime.wave * 16,
      });
    }

    runtime.enemyShotTimer += Math.max(0.24, (state.mode.id === "drone-siege" ? 0.72 : 0.9) - runtime.wave * 0.02);
  }

  for (let bulletIndex = runtime.bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
    const bullet = runtime.bullets[bulletIndex];
    bullet.y -= bullet.speed * dt;

    let removeBullet = bullet.y < 70;

    for (let enemyIndex = runtime.enemies.length - 1; enemyIndex >= 0 && !removeBullet; enemyIndex -= 1) {
      const enemy = runtime.enemies[enemyIndex];

      if (
        Math.abs(bullet.x - enemy.x) <= enemy.width / 2 + bullet.radius &&
        Math.abs(bullet.y - enemy.y) <= enemy.height / 2 + bullet.radius
      ) {
        enemy.health -= 1;
        removeBullet = true;
        emitParticles(runtime.particles, bullet.x, bullet.y, state.mode.pulseColor, 10, 60, 150);

        if (enemy.health <= 0) {
          addScore(runtime, enemy.maxHealth > 1 ? 22 + runtime.wave * 4 : 12 + runtime.wave * 3);
          emitParticles(runtime.particles, enemy.x, enemy.y, enemy.maxHealth > 1 ? state.mode.accent : state.mode.glitchColor, enemy.maxHealth > 1 ? 18 : 12, 80, 220);
          runtime.enemies.splice(enemyIndex, 1);
        }
      }
    }

    if (removeBullet) {
      runtime.bullets.splice(bulletIndex, 1);
    }
  }

  for (let shotIndex = runtime.enemyShots.length - 1; shotIndex >= 0; shotIndex -= 1) {
    const shot = runtime.enemyShots[shotIndex];
    shot.y += shot.speed * dt;

    const hitPlayer =
      shot.y + shot.radius >= runtime.playerY - runtime.playerHeight / 2 &&
      shot.y - shot.radius <= runtime.playerY + runtime.playerHeight / 2 &&
      Math.abs(shot.x - runtime.playerX) <= runtime.playerWidth / 2 + shot.radius;

    if (hitPlayer) {
      runtime.enemyShots.splice(shotIndex, 1);
      damagePulseInvadersPlayer(runtime);
      break;
    }

    if (shot.y > 840) {
      runtime.enemyShots.splice(shotIndex, 1);
    }
  }

  if (runtime.enemies.some((enemy) => enemy.y + enemy.height / 2 >= runtime.playerY - 48)) {
    damagePulseInvadersPlayer(runtime);
  }

  if (runtime.enemies.length === 0 && !runtime.gameOver) {
    runtime.wave += 1;
    emitParticles(runtime.particles, CENTER, 250, state.mode.accent, 34, 90, 260);
    resetPulseInvadersWave(runtime);
  }

  updateParticles(runtime.particles, dt);
}

function renderPulseInvaders(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.setLineDash([12, 18]);
  for (let row = 0; row < 7; row += 1) {
    const y = 138 + row * 82;
    ctx.beginPath();
    ctx.moveTo(110, y);
    ctx.lineTo(790, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (const enemy of runtime.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y + Math.sin(state.visualTime * 4 + enemy.phase) * 2.2);
    ctx.shadowColor = enemy.maxHealth > 1 ? state.mode.accent : state.mode.glitchColor;
    ctx.shadowBlur = enemy.maxHealth > 1 ? 18 : 12;
    ctx.fillStyle = enemy.maxHealth > 1 ? state.mode.accent : state.mode.glitchColor;
    ctx.beginPath();
    ctx.moveTo(0, -enemy.height / 2);
    ctx.lineTo(enemy.width / 2, 0);
    ctx.lineTo(enemy.width * 0.28, enemy.height / 2);
    ctx.lineTo(-enemy.width * 0.28, enemy.height / 2);
    ctx.lineTo(-enemy.width / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    if (enemy.maxHealth > 1 && enemy.health === 1) {
      ctx.strokeStyle = "rgba(10, 20, 31, 0.45)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  for (const bullet of runtime.bullets) {
    ctx.strokeStyle = `${state.mode.pulseColor}cc`;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y + 12);
    ctx.lineTo(bullet.x, bullet.y - 6);
    ctx.stroke();
  }

  for (const shot of runtime.enemyShots) {
    ctx.fillStyle = state.mode.glitchColor;
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, shot.radius, 0, TAU);
    ctx.fill();
  }

  drawParticles(runtime.particles);

  ctx.save();
  ctx.translate(runtime.playerX, runtime.playerY);
  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff4d2";
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(runtime.playerWidth / 2, 12);
  ctx.lineTo(0, 18);
  ctx.lineTo(-runtime.playerWidth / 2, 12);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(8, 4);
  ctx.lineTo(0, 10);
  ctx.lineTo(-8, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function spawnStarLanderPad() {
  const moving = state.mode.id === "cargo-drop";
  const width = moving ? 124 : 152;

  return {
    x: randomBetween(160, 740),
    y: 792,
    width,
    speed: moving ? randomBetween(90, 130) * (Math.random() < 0.5 ? -1 : 1) : 0,
  };
}

function resetStarLanderFlight(runtime) {
  runtime.player = {
    x: CENTER,
    y: 120,
    vx: 0,
    vy: 20,
  };
  runtime.pad = spawnStarLanderPad();
  runtime.beacon = {
    x: randomBetween(150, 750),
    y: randomBetween(200, 520),
    radius: 11,
    phase: Math.random() * TAU,
    taken: false,
  };
}

function createStarLanderRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    landings: 0,
    stage: 1,
    player: {
      x: CENTER,
      y: 120,
      vx: 0,
      vy: 20,
    },
    pad: null,
    beacon: null,
    particles: [],
    gameOver: false,
  };

  resetStarLanderFlight(runtime);
  return runtime;
}

function getStarLanderHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.landings),
    status: state.running ? `Stage ${runtime.stage}` : state.ended ? "Finished" : "Ready",
  };
}

function getStarLanderGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Completed ${numberFormat.format(runtime.landings)} landings.`;
}

function updateStarLander(dt, runtime) {
  runtime.stage = 1 + Math.floor(runtime.landings / 3);
  const cargoMode = state.mode.id === "cargo-drop";
  const controlMultiplier = getControlMultiplier();
  const thrusting = state.input.up || (state.input.pointerActive && state.input.pointerY < runtime.player.y - 10);

  if (state.input.left) {
    runtime.player.vx -= 260 * controlMultiplier * dt;
  }

  if (state.input.right) {
    runtime.player.vx += 260 * controlMultiplier * dt;
  }

  if (state.input.pointerActive) {
    const dx = state.input.pointerX - runtime.player.x;
    runtime.player.vx += clamp(dx, -1, 1) * 160 * controlMultiplier * dt;
  }

  if (thrusting) {
    runtime.player.vy -= (cargoMode ? 430 : 390) * dt;
  }

  const wind = cargoMode ? Math.sin(state.visualTime * 1.4 + runtime.stage) * 24 : Math.sin(state.visualTime * 0.7) * 10;
  runtime.player.vx += wind * dt;
  runtime.player.vy += (cargoMode ? 360 : 320) * dt;
  runtime.player.vx *= 0.995 ** (dt * 60);
  runtime.player.vy *= 0.997 ** (dt * 60);
  runtime.player.x += runtime.player.vx * dt;
  runtime.player.y += runtime.player.vy * dt;

  if (cargoMode) {
    runtime.pad.x += runtime.pad.speed * dt;
    if (runtime.pad.x < 150 || runtime.pad.x > 750) {
      runtime.pad.speed *= -1;
      runtime.pad.x = clamp(runtime.pad.x, 150, 750);
    }
  }

  runtime.player.x = clamp(runtime.player.x, 60, 840);
  runtime.player.y = Math.max(50, runtime.player.y);

  runtime.beacon.phase += dt * 3.4;
  if (!runtime.beacon.taken && distance(runtime.player.x, runtime.player.y, runtime.beacon.x, runtime.beacon.y) <= runtime.beacon.radius + 16) {
    runtime.beacon.taken = true;
    addScore(runtime, 18 + runtime.stage * 4);
    emitParticles(runtime.particles, runtime.beacon.x, runtime.beacon.y, state.mode.accent, 16, 70, 180);
  }

  if (runtime.player.y >= 776) {
    const onPad = Math.abs(runtime.player.x - runtime.pad.x) <= runtime.pad.width / 2 - 6;
    const softLanding =
      Math.abs(runtime.player.vy) <= (cargoMode ? 100 : 116) &&
      Math.abs(runtime.player.vx) <= (cargoMode ? 86 : 104);

    if (onPad && softLanding) {
      runtime.landings += 1;
      addScore(runtime, (cargoMode ? 58 : 46) + runtime.stage * 8);
      emitParticles(runtime.particles, runtime.pad.x, runtime.pad.y, state.mode.pulseColor, 24, 90, 220);
      resetStarLanderFlight(runtime);
    } else {
      runtime.lives -= 1;
      state.flash = 0.78;
      state.shake = 8;
      emitParticles(runtime.particles, clamp(runtime.player.x, 90, 810), 790, state.mode.glitchColor, 26, 90, 230);

      if (runtime.lives <= 0) {
        runtime.gameOver = true;
      } else {
        resetStarLanderFlight(runtime);
      }
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderStarLander(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.beginPath();
  ctx.moveTo(88, 812);
  ctx.lineTo(180, 768);
  ctx.lineTo(280, 794);
  ctx.lineTo(386, 742);
  ctx.lineTo(508, 798);
  ctx.lineTo(628, 756);
  ctx.lineTo(812, 812);
  ctx.closePath();
  ctx.fill();

  ctx.shadowColor = state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = state.mode.pulseColor;
  ctx.fillRect(runtime.pad.x - runtime.pad.width / 2, runtime.pad.y - 5, runtime.pad.width, 10);
  ctx.shadowBlur = 0;

  if (!runtime.beacon.taken) {
    const pulse = runtime.beacon.radius + Math.sin(runtime.beacon.phase) * 1.8;
    ctx.shadowColor = state.mode.accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = state.mode.accent;
    ctx.beginPath();
    ctx.arc(runtime.beacon.x, runtime.beacon.y, pulse, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.mode.pulseCore;
    ctx.beginPath();
    ctx.arc(runtime.beacon.x, runtime.beacon.y, 4, 0, TAU);
    ctx.fill();
  }

  drawParticles(runtime.particles);

  ctx.save();
  ctx.translate(runtime.player.x, runtime.player.y);

  if (state.input.up || (state.input.pointerActive && state.input.pointerY < runtime.player.y - 10)) {
    const flame = ctx.createLinearGradient(0, 12, 0, 52);
    flame.addColorStop(0, `${state.mode.accent}cc`);
    flame.addColorStop(1, `${state.mode.accent}00`);
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(-7, 12);
    ctx.lineTo(0, 48 + Math.sin(state.visualTime * 20) * 6);
    ctx.lineTo(7, 12);
    ctx.closePath();
    ctx.fill();
  }

  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#fff4d0";
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(16, 10);
  ctx.lineTo(0, 18);
  ctx.lineTo(-16, 10);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(6, 4);
  ctx.lineTo(0, 10);
  ctx.lineTo(-6, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

const MAZE_CHASE_LAYOUTS = {
  "maze-chase": [
    "###############",
    "#P....#....E..#",
    "#.###.#.###.#.#",
    "#.....#...#.#.#",
    "#.#####.#.#.#.#",
    "#.......#...#.#",
    "###.#######.#.#",
    "#...#.....#...#",
    "#.#.#.###.#.###",
    "#.#...#...#...#",
    "#.#####.#####.#",
    "#.....#.....#.#",
    "#.###.#.###.#.#",
    "#E..#.....#..E#",
    "###############",
  ],
  "vault-run": [
    "###############",
    "#P...#...#...E#",
    "#.#.#.#.#.#.#.#",
    "#.#...#...#...#",
    "#.###.###.###.#",
    "#...#.....#...#",
    "###.#.###.#.#.#",
    "#...#.#.#...#.#",
    "#.###.#.###.#.#",
    "#.....#.....#.#",
    "#.#####.#####.#",
    "#.#...#...#...#",
    "#.#.#.###.#.#.#",
    "#E..#.....#..E#",
    "###############",
  ],
};

function mazeKey(x, y) {
  return `${x},${y}`;
}

function parseMazeLayout(modeId) {
  const rows = MAZE_CHASE_LAYOUTS[modeId];
  const walls = new Set();
  const nodes = new Set();
  const enemySpawns = [];
  let playerStart = { x: 1, y: 1 };

  for (let y = 0; y < rows.length; y += 1) {
    for (let x = 0; x < rows[y].length; x += 1) {
      const cell = rows[y][x];

      if (cell === "#") {
        walls.add(mazeKey(x, y));
        continue;
      }

      if (cell === "P") {
        playerStart = { x, y };
      } else if (cell === "E") {
        enemySpawns.push({ x, y });
      }

      nodes.add(mazeKey(x, y));
    }
  }

  nodes.delete(mazeKey(playerStart.x, playerStart.y));

  for (const spawn of enemySpawns) {
    nodes.delete(mazeKey(spawn.x, spawn.y));
  }

  return {
    rows: rows.length,
    cols: rows[0].length,
    walls,
    nodes,
    enemySpawns,
    playerStart,
  };
}

function mazeBlocked(runtime, x, y) {
  return (
    x < 0 ||
    x >= runtime.cols ||
    y < 0 ||
    y >= runtime.rows ||
    runtime.walls.has(mazeKey(x, y))
  );
}

function setupMazeChaseRound(runtime) {
  const parsed = parseMazeLayout(state.mode.id);
  runtime.rows = parsed.rows;
  runtime.cols = parsed.cols;
  runtime.walls = parsed.walls;
  runtime.nodes = new Set(parsed.nodes);
  runtime.playerStart = parsed.playerStart;
  runtime.player = { ...parsed.playerStart };
  runtime.enemySpawns = parsed.enemySpawns;
  runtime.stepTimer = 0;
  runtime.enemyTimer = Math.max(0.14, (state.mode.id === "vault-run" ? 0.28 : 0.34) - runtime.round * 0.012);
  runtime.queuedDirection = { x: 0, y: 0 };
  runtime.boardX = (canvas.width - runtime.cols * runtime.cell) / 2;
  runtime.boardY = (canvas.height - runtime.rows * runtime.cell) / 2;

  const enemyCount = Math.min(
    runtime.enemySpawns.length,
    (state.mode.id === "vault-run" ? 2 : 1) + Math.floor((runtime.round + 1) / 2),
  );
  runtime.enemies = runtime.enemySpawns.slice(0, enemyCount).map((spawn, index) => ({
    x: spawn.x,
    y: spawn.y,
    pulse: index * 0.8,
  }));
}

function damageMazeChasePlayer(runtime) {
  const fx = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
  const fy = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;
  runtime.lives -= 1;
  state.flash = 0.82;
  state.shake = 9;
  emitParticles(runtime.particles, fx, fy, state.mode.glitchColor, 22, 90, 220);

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
    return;
  }

  setupMazeChaseRound(runtime);
}

function createMazeChaseRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    round: 1,
    rows: 0,
    cols: 0,
    cell: 44,
    boardX: 0,
    boardY: 0,
    walls: new Set(),
    nodes: new Set(),
    playerStart: { x: 1, y: 1 },
    player: { x: 1, y: 1 },
    enemySpawns: [],
    enemies: [],
    stepTimer: 0,
    enemyTimer: 0.3,
    queuedDirection: { x: 0, y: 0 },
    particles: [],
    gameOver: false,
  };

  setupMazeChaseRound(runtime);
  return runtime;
}

function getMazeChaseHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.nodes.size),
    status: state.running ? `Round ${runtime.round}` : state.ended ? "Finished" : "Ready",
  };
}

function getMazeChaseGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Reached round ${numberFormat.format(runtime.round)}.`;
}

function updateMazeChase(dt, runtime) {
  if (state.input.left) {
    runtime.queuedDirection = { x: -1, y: 0 };
  } else if (state.input.right) {
    runtime.queuedDirection = { x: 1, y: 0 };
  } else if (state.input.up) {
    runtime.queuedDirection = { x: 0, y: -1 };
  } else if (state.input.down) {
    runtime.queuedDirection = { x: 0, y: 1 };
  }

  if (state.input.pointerActive) {
    const centerX = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
    const centerY = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;
    const dx = state.input.pointerX - centerX;
    const dy = state.input.pointerY - centerY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > runtime.cell * 0.35) {
      runtime.queuedDirection = { x: dx > 0 ? 1 : -1, y: 0 };
    } else if (Math.abs(dy) > runtime.cell * 0.35) {
      runtime.queuedDirection = { x: 0, y: dy > 0 ? 1 : -1 };
    }
  }

  runtime.stepTimer -= dt;
  if (runtime.stepTimer <= 0 && (runtime.queuedDirection.x !== 0 || runtime.queuedDirection.y !== 0)) {
    const nextX = runtime.player.x + runtime.queuedDirection.x;
    const nextY = runtime.player.y + runtime.queuedDirection.y;

    if (!mazeBlocked(runtime, nextX, nextY)) {
      runtime.player.x = nextX;
      runtime.player.y = nextY;
      const key = mazeKey(nextX, nextY);

      if (runtime.nodes.delete(key)) {
        addScore(runtime, state.mode.id === "vault-run" ? 11 : 8);
        emitParticles(
          runtime.particles,
          runtime.boardX + nextX * runtime.cell + runtime.cell / 2,
          runtime.boardY + nextY * runtime.cell + runtime.cell / 2,
          state.mode.pulseColor,
          8,
          40,
          120,
        );
      }

      if (runtime.enemies.some((enemy) => enemy.x === runtime.player.x && enemy.y === runtime.player.y)) {
        damageMazeChasePlayer(runtime);
      }
    }

    runtime.stepTimer += Math.max(0.08, 0.16 / getControlMultiplier());
  }

  runtime.enemyTimer -= dt;
  while (runtime.enemyTimer <= 0 && !runtime.gameOver) {
    const occupied = new Set();

    for (const enemy of runtime.enemies) {
      const options = [
        { x: enemy.x + 1, y: enemy.y },
        { x: enemy.x - 1, y: enemy.y },
        { x: enemy.x, y: enemy.y + 1 },
        { x: enemy.x, y: enemy.y - 1 },
      ].filter((candidate) => !mazeBlocked(runtime, candidate.x, candidate.y));

      options.sort((left, right) => {
        const leftScore = Math.abs(left.x - runtime.player.x) + Math.abs(left.y - runtime.player.y);
        const rightScore = Math.abs(right.x - runtime.player.x) + Math.abs(right.y - runtime.player.y);
        return leftScore - rightScore;
      });

      let moved = false;
      for (const option of options) {
        const key = mazeKey(option.x, option.y);

        if (occupied.has(key)) {
          continue;
        }

        enemy.x = option.x;
        enemy.y = option.y;
        occupied.add(key);
        moved = true;
        break;
      }

      if (!moved) {
        occupied.add(mazeKey(enemy.x, enemy.y));
      }

      enemy.pulse += 0.9;

      if (enemy.x === runtime.player.x && enemy.y === runtime.player.y) {
        damageMazeChasePlayer(runtime);
        break;
      }
    }

    runtime.enemyTimer += Math.max(0.1, (state.mode.id === "vault-run" ? 0.26 : 0.32) - runtime.round * 0.01);
  }

  if (runtime.nodes.size === 0 && !runtime.gameOver) {
    runtime.round += 1;
    addScore(runtime, 42 + runtime.round * 6);
    emitParticles(runtime.particles, CENTER, CENTER, state.mode.accent, 28, 90, 220);
    setupMazeChaseRound(runtime);
  }

  for (const enemy of runtime.enemies) {
    enemy.pulse += dt * 2;
  }

  updateParticles(runtime.particles, dt);
}

function renderMazeChase(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(runtime.boardX, runtime.boardY, runtime.cols * runtime.cell, runtime.rows * runtime.cell);

  for (let y = 0; y < runtime.rows; y += 1) {
    for (let x = 0; x < runtime.cols; x += 1) {
      const drawX = runtime.boardX + x * runtime.cell;
      const drawY = runtime.boardY + y * runtime.cell;
      const key = mazeKey(x, y);

      if (runtime.walls.has(key)) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(drawX, drawY, runtime.cell, runtime.cell);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        ctx.fillRect(drawX, drawY, runtime.cell, runtime.cell);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.strokeRect(drawX, drawY, runtime.cell, runtime.cell);
    }
  }

  for (const key of runtime.nodes) {
    const [x, y] = key.split(",").map(Number);
    ctx.fillStyle = state.mode.pulseColor;
    ctx.beginPath();
    ctx.arc(
      runtime.boardX + x * runtime.cell + runtime.cell / 2,
      runtime.boardY + y * runtime.cell + runtime.cell / 2,
      state.mode.id === "vault-run" ? 5.5 : 4.2,
      0,
      TAU,
    );
    ctx.fill();
  }

  for (const enemy of runtime.enemies) {
    const x = runtime.boardX + enemy.x * runtime.cell + runtime.cell / 2;
    const y = runtime.boardY + enemy.y * runtime.cell + runtime.cell / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(enemy.pulse) * 0.14);
    ctx.shadowColor = state.mode.glitchColor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = state.mode.glitchColor;
    ctx.beginPath();
    ctx.arc(0, 0, runtime.cell * 0.28, Math.PI, TAU);
    ctx.lineTo(runtime.cell * 0.28, 0);
    ctx.lineTo(-runtime.cell * 0.28, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#2e0f0a";
    ctx.beginPath();
    ctx.arc(-4, -3, 2, 0, TAU);
    ctx.arc(4, -3, 2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  drawParticles(runtime.particles);

  const playerX = runtime.boardX + runtime.player.x * runtime.cell + runtime.cell / 2;
  const playerY = runtime.boardY + runtime.player.y * runtime.cell + runtime.cell / 2;
  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 16;
  ctx.fillStyle = state.mode.accent;
  ctx.beginPath();
  ctx.arc(playerX, playerY, runtime.cell * 0.26, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(runtime.boardX, runtime.boardY, runtime.cols * runtime.cell, runtime.rows * runtime.cell);

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function spawnRailJumperObstacle(runtime) {
  const roofMode = state.mode.id === "roof-runner";
  const highObstacle = roofMode && Math.random() < 0.38;

  runtime.obstacles.push({
    x: 950,
    width: highObstacle ? 44 : randomBetween(34, 52),
    height: highObstacle ? 24 : randomBetween(42, 64),
    type: highObstacle ? "sign" : "barrier",
  });

  if (Math.random() < 0.45) {
    runtime.pickups.push({
      x: 980 + randomBetween(20, 90),
      y: highObstacle ? runtime.groundY - 132 : runtime.groundY - randomBetween(110, 150),
      radius: 10,
      phase: Math.random() * TAU,
    });
  }
}

function railJumperHit(runtime) {
  runtime.lives -= 1;
  runtime.invulnerable = 0.95;
  state.flash = 0.78;
  state.shake = 8;
  emitParticles(runtime.particles, runtime.playerX, runtime.playerY - 20, state.mode.glitchColor, 22, 90, 220);

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
  }
}

function createRailJumperRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const roofMode = mode.id === "roof-runner";

  return {
    score: 0,
    lifeCap,
    lives: lifeCap,
    distance: 0,
    section: 1,
    speed: roofMode ? 390 : 350,
    groundY: roofMode ? 714 : 756,
    playerX: 196,
    playerY: roofMode ? 714 : 756,
    playerWidth: 30,
    playerHeight: 54,
    duckHeight: 30,
    playerVX: 0,
    playerVY: 0,
    jumpsUsed: 0,
    onGround: true,
    jumpLatch: false,
    invulnerable: 0,
    obstacles: [],
    pickups: [],
    spawnTimer: 0.95,
    particles: [],
    gameOver: false,
  };
}

function getRailJumperHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(Math.floor(runtime.distance)),
    status: state.running ? `Section ${runtime.section}` : state.ended ? "Finished" : "Ready",
  };
}

function getRailJumperGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Distance ${numberFormat.format(Math.floor(runtime.distance))}.`;
}

function updateRailJumper(dt, runtime) {
  const roofMode = state.mode.id === "roof-runner";
  const controlMultiplier = getControlMultiplier();
  runtime.section = 1 + Math.floor(runtime.distance / 24);
  runtime.speed = (roofMode ? 390 : 350) + runtime.section * 16;
  runtime.distance += runtime.speed * dt * 0.025;
  runtime.invulnerable = Math.max(0, runtime.invulnerable - dt);

  const jumpRequest =
    state.input.up ||
    (state.input.pointerActive && state.input.pointerY < runtime.groundY - 40);

  if (!jumpRequest) {
    runtime.jumpLatch = false;
  }

  if (jumpRequest && !runtime.jumpLatch && (runtime.onGround || (roofMode && runtime.jumpsUsed < 2))) {
    runtime.playerVY = roofMode && !runtime.onGround ? -360 : roofMode ? -410 : -390;
    runtime.onGround = false;
    runtime.jumpsUsed += 1;
    runtime.jumpLatch = true;
    emitParticles(runtime.particles, runtime.playerX, runtime.groundY, state.mode.accent, 8, 40, 120);
  }

  const ducking =
    roofMode &&
    runtime.onGround &&
    (state.input.down || (state.input.pointerActive && state.input.pointerY > runtime.groundY + 8));
  const horizontal = (state.input.right ? 1 : 0) - (state.input.left ? 1 : 0);
  runtime.playerVX += horizontal * 180 * controlMultiplier * dt;
  runtime.playerVX *= 0.9 ** (dt * 60);
  runtime.playerX = clamp(runtime.playerX + runtime.playerVX * dt, 150, 260);

  runtime.playerVY += 980 * dt;
  runtime.playerY += runtime.playerVY * dt;

  if (runtime.playerY >= runtime.groundY) {
    runtime.playerY = runtime.groundY;
    runtime.playerVY = 0;
    runtime.onGround = true;
    runtime.jumpsUsed = 0;
  }

  runtime.spawnTimer -= dt;
  while (runtime.spawnTimer <= 0) {
    spawnRailJumperObstacle(runtime);
    runtime.spawnTimer += Math.max(0.42, (roofMode ? 0.82 : 0.94) - runtime.section * 0.03 + Math.random() * 0.14);
  }

  for (let index = runtime.pickups.length - 1; index >= 0; index -= 1) {
    const pickup = runtime.pickups[index];
    pickup.x -= runtime.speed * dt;
    pickup.phase += dt * 4;

    if (distance(runtime.playerX, runtime.playerY - 26, pickup.x, pickup.y) <= 20 + pickup.radius) {
      addScore(runtime, 10 + runtime.section * 2);
      emitParticles(runtime.particles, pickup.x, pickup.y, state.mode.accent, 14, 60, 160);
      runtime.pickups.splice(index, 1);
      continue;
    }

    if (pickup.x < -40) {
      runtime.pickups.splice(index, 1);
    }
  }

  const playerHeight = ducking ? runtime.duckHeight : runtime.playerHeight;
  const playerLeft = runtime.playerX - runtime.playerWidth / 2;
  const playerRight = runtime.playerX + runtime.playerWidth / 2;
  const playerTop = runtime.playerY - playerHeight;
  const playerBottom = runtime.playerY;

  for (let index = runtime.obstacles.length - 1; index >= 0; index -= 1) {
    const obstacle = runtime.obstacles[index];
    obstacle.x -= runtime.speed * dt;

    const obstacleLeft = obstacle.x - obstacle.width / 2;
    const obstacleRight = obstacle.x + obstacle.width / 2;
    const obstacleTop =
      obstacle.type === "sign"
        ? runtime.groundY - 132
        : runtime.groundY - obstacle.height;
    const obstacleBottom =
      obstacle.type === "sign"
        ? obstacleTop + obstacle.height
        : runtime.groundY;

    const overlap =
      playerRight >= obstacleLeft &&
      playerLeft <= obstacleRight &&
      playerBottom >= obstacleTop &&
      playerTop <= obstacleBottom;

    if (overlap && runtime.invulnerable <= 0) {
      runtime.obstacles.splice(index, 1);
      railJumperHit(runtime);
      continue;
    }

    if (obstacle.x < -80) {
      addScore(runtime, obstacle.type === "sign" ? 4 : 3);
      runtime.obstacles.splice(index, 1);
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderRailJumper(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  for (let building = 0; building < 9; building += 1) {
    const x = 90 + ((building * 118 - state.visualTime * (80 + building * 6)) % 960);
    const width = 70 + (building % 3) * 26;
    const height = 130 + (building % 4) * 44;
    ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
    ctx.fillRect(x, runtime.groundY - height, width, height);
  }

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(88, runtime.groundY + 2);
  ctx.lineTo(812, runtime.groundY + 2);
  ctx.stroke();

  for (const pickup of runtime.pickups) {
    const pulse = pickup.radius + Math.sin(pickup.phase) * 1.4;
    ctx.shadowColor = state.mode.accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = state.mode.accent;
    ctx.beginPath();
    ctx.arc(pickup.x, pickup.y, pulse, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  for (const obstacle of runtime.obstacles) {
    ctx.shadowColor = obstacle.type === "sign" ? state.mode.glitchColor : state.mode.pulseColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = obstacle.type === "sign" ? state.mode.glitchColor : state.mode.pulseColor;

    if (obstacle.type === "sign") {
      ctx.fillRect(obstacle.x - obstacle.width / 2, runtime.groundY - 132, obstacle.width, obstacle.height);
      ctx.fillRect(obstacle.x - 3, runtime.groundY - 108, 6, 108);
    } else {
      ctx.fillRect(obstacle.x - obstacle.width / 2, runtime.groundY - obstacle.height, obstacle.width, obstacle.height);
    }

    ctx.shadowBlur = 0;
  }

  drawParticles(runtime.particles);

  const ducking =
    state.mode.id === "roof-runner" &&
    runtime.onGround &&
    (state.input.down || (state.input.pointerActive && state.input.pointerY > runtime.groundY + 8));
  const playerHeight = ducking ? runtime.duckHeight : runtime.playerHeight;

  ctx.save();
  if (runtime.invulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.44;
  }

  ctx.translate(runtime.playerX, runtime.playerY - playerHeight / 2);
  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#fff4cf";
  ctx.beginPath();
  ctx.moveTo(0, -playerHeight / 2);
  ctx.lineTo(runtime.playerWidth / 2, playerHeight / 3);
  ctx.lineTo(0, playerHeight / 2);
  ctx.lineTo(-runtime.playerWidth / 2, playerHeight / 3);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.arc(0, -Math.max(4, playerHeight * 0.12), 5, 0, TAU);
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function spawnAstroRescueCargo() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const x = randomBetween(120, 780);
    const y = randomBetween(120, 780);

    if (distance(x, y, CENTER, CENTER) > 120) {
      return {
        x,
        y,
        radius: 13,
        phase: Math.random() * TAU,
      };
    }
  }

  return {
    x: 720,
    y: 220,
    radius: 13,
    phase: Math.random() * TAU,
  };
}

function spawnAstroRescueEnemy(runtime) {
  const angle = Math.random() * TAU;
  const radius = randomBetween(360, 430);
  runtime.enemies.push({
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
    phase: Math.random() * TAU,
  });
}

function syncAstroRescueEnemies(runtime) {
  const targetCount = Math.min(
    7,
    (state.mode.id === "shock-swarm" ? 3 : 2) + Math.floor(runtime.wave / 2),
  );

  while (runtime.enemies.length < targetCount) {
    spawnAstroRescueEnemy(runtime);
  }
}

function resetAstroRescueCargo(runtime) {
  runtime.carrying = false;
  runtime.cargo = spawnAstroRescueCargo();
}

function damageAstroRescuePlayer(runtime) {
  runtime.lives -= 1;
  runtime.player.invulnerable = 1;
  state.flash = 0.8;
  state.shake = 9;
  emitParticles(runtime.particles, runtime.player.x, runtime.player.y, state.mode.glitchColor, 24, 90, 220);

  if (runtime.carrying) {
    runtime.carrying = false;
    runtime.cargo = {
      x: clamp(runtime.player.x + randomBetween(-80, 80), 120, 780),
      y: clamp(runtime.player.y + randomBetween(-80, 80), 120, 780),
      radius: 13,
      phase: Math.random() * TAU,
    };
  }

  if (runtime.lives <= 0) {
    runtime.gameOver = true;
  }
}

function createAstroRescueRuntime(mode) {
  const lifeCap = getLifeCap(mode);
  const runtime = {
    score: 0,
    lifeCap,
    lives: lifeCap,
    rescues: 0,
    wave: 1,
    hubRadius: 56,
    carrying: false,
    cargo: spawnAstroRescueCargo(),
    player: {
      x: CENTER,
      y: CENTER + 190,
      vx: 0,
      vy: 0,
      radius: 18,
      invulnerable: 0,
    },
    enemies: [],
    particles: [],
    gameOver: false,
  };

  syncAstroRescueEnemies(runtime);
  return runtime;
}

function getAstroRescueHud(runtime) {
  return {
    score: runtime.score,
    primaryValue: `${runtime.lives} / ${runtime.lifeCap}`,
    secondaryValue: numberFormat.format(runtime.rescues),
    status: state.running ? `Wave ${runtime.wave}` : state.ended ? "Finished" : "Ready",
  };
}

function getAstroRescueGameOverBody(runtime) {
  return `Final score ${numberFormat.format(runtime.score)}. Completed ${numberFormat.format(runtime.rescues)} deliveries.`;
}

function updateAstroRescue(dt, runtime) {
  runtime.wave = 1 + Math.floor(runtime.rescues / 3);
  runtime.player.invulnerable = Math.max(0, runtime.player.invulnerable - dt);
  syncAstroRescueEnemies(runtime);

  let ax = 0;
  let ay = 0;

  if (state.input.left) {
    ax -= 1;
  }

  if (state.input.right) {
    ax += 1;
  }

  if (state.input.up) {
    ay -= 1;
  }

  if (state.input.down) {
    ay += 1;
  }

  if (state.input.pointerActive) {
    const dx = state.input.pointerX - runtime.player.x;
    const dy = state.input.pointerY - runtime.player.y;
    const length = Math.hypot(dx, dy);

    if (length > 8) {
      ax += dx / length;
      ay += dy / length;
    }
  }

  const length = Math.hypot(ax, ay);
  if (length > 0) {
    ax /= length;
    ay /= length;
  }

  const controlMultiplier = getControlMultiplier();
  const carryPenalty = runtime.carrying ? (state.mode.id === "shock-swarm" ? 0.68 : 0.76) : 1;
  runtime.player.vx += ax * 380 * controlMultiplier * carryPenalty * dt;
  runtime.player.vy += ay * 380 * controlMultiplier * carryPenalty * dt;
  runtime.player.vx *= 0.92 ** (dt * 60);
  runtime.player.vy *= 0.92 ** (dt * 60);

  const maxSpeed = (runtime.carrying ? 230 : 290) * controlMultiplier;
  const speed = Math.hypot(runtime.player.vx, runtime.player.vy);
  if (speed > maxSpeed) {
    runtime.player.vx = (runtime.player.vx / speed) * maxSpeed;
    runtime.player.vy = (runtime.player.vy / speed) * maxSpeed;
  }

  runtime.player.x = clamp(runtime.player.x + runtime.player.vx * dt, 96, 804);
  runtime.player.y = clamp(runtime.player.y + runtime.player.vy * dt, 96, 804);

  runtime.cargo.phase += dt * 3;

  if (!runtime.carrying) {
    if (
      distance(runtime.player.x, runtime.player.y, runtime.cargo.x, runtime.cargo.y) <=
      runtime.player.radius + runtime.cargo.radius
    ) {
      runtime.carrying = true;
      emitParticles(runtime.particles, runtime.cargo.x, runtime.cargo.y, state.mode.pulseColor, 14, 70, 160);
    }
  } else {
    runtime.cargo.x += (runtime.player.x - runtime.cargo.x) * Math.min(1, dt * 10);
    runtime.cargo.y += (runtime.player.y - runtime.cargo.y) * Math.min(1, dt * 10);

    if (distance(runtime.player.x, runtime.player.y, CENTER, CENTER) <= runtime.hubRadius) {
      runtime.rescues += 1;
      addScore(runtime, (state.mode.id === "shock-swarm" ? 46 : 38) + runtime.wave * 6);
      emitParticles(runtime.particles, CENTER, CENTER, state.mode.accent, 30, 90, 240);
      resetAstroRescueCargo(runtime);
    }
  }

  for (const enemy of runtime.enemies) {
    const targetX = runtime.carrying ? runtime.player.x : runtime.cargo.x;
    const targetY = runtime.carrying ? runtime.player.y : runtime.cargo.y;
    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;
    const distanceToTarget = Math.hypot(dx, dy) || 1;
    const accel = (state.mode.id === "shock-swarm" ? 190 : 150) + runtime.wave * 16;
    enemy.vx += (dx / distanceToTarget) * accel * dt;
    enemy.vy += (dy / distanceToTarget) * accel * dt;
    enemy.vx *= 0.93 ** (dt * 60);
    enemy.vy *= 0.93 ** (dt * 60);

    const enemySpeed = Math.hypot(enemy.vx, enemy.vy);
    const enemyCap = (state.mode.id === "shock-swarm" ? 270 : 230) + runtime.wave * 14;
    if (enemySpeed > enemyCap) {
      enemy.vx = (enemy.vx / enemySpeed) * enemyCap;
      enemy.vy = (enemy.vy / enemySpeed) * enemyCap;
    }

    enemy.x = clamp(enemy.x + enemy.vx * dt, 84, 816);
    enemy.y = clamp(enemy.y + enemy.vy * dt, 84, 816);
    enemy.phase += dt * 3.2;

    if (
      runtime.player.invulnerable <= 0 &&
      distance(enemy.x, enemy.y, runtime.player.x, runtime.player.y) <=
        runtime.player.radius + 16
    ) {
      damageAstroRescuePlayer(runtime);
      break;
    }
  }

  updateParticles(runtime.particles, dt);
}

function renderAstroRescue(runtime) {
  ctx.save();

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(88, 88, 724, 724);

  ctx.strokeStyle = `${state.mode.pulseColor}44`;
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 88, 724, 724);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 120 + ring * 90, 0, TAU);
    ctx.stroke();
  }

  const hubGlow = ctx.createRadialGradient(CENTER, CENTER, 24, CENTER, CENTER, runtime.hubRadius + 70);
  hubGlow.addColorStop(0, `${state.mode.accent}88`);
  hubGlow.addColorStop(1, `${state.mode.accent}00`);
  ctx.fillStyle = hubGlow;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.hubRadius + 70, 0, TAU);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, runtime.hubRadius + 8, 0, TAU);
  ctx.fill();

  if (runtime.carrying) {
    ctx.strokeStyle = `${state.mode.accent}88`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(runtime.player.x, runtime.player.y);
    ctx.lineTo(runtime.cargo.x, runtime.cargo.y);
    ctx.stroke();
  }

  const pulse = runtime.cargo.radius + Math.sin(runtime.cargo.phase) * 1.6;
  ctx.shadowColor = runtime.carrying ? state.mode.accent : state.mode.pulseColor;
  ctx.shadowBlur = 18;
  ctx.fillStyle = runtime.carrying ? state.mode.accent : state.mode.pulseColor;
  ctx.beginPath();
  ctx.arc(runtime.cargo.x, runtime.cargo.y, pulse, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;

  for (const enemy of runtime.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.phase);
    ctx.shadowColor = state.mode.glitchColor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = state.mode.glitchColor;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(16, 10);
    ctx.lineTo(0, 16);
    ctx.lineTo(-16, 10);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawParticles(runtime.particles);

  ctx.save();
  if (runtime.player.invulnerable > 0 && Math.sin(state.visualTime * 28) > 0) {
    ctx.globalAlpha = 0.44;
  }

  ctx.translate(runtime.player.x, runtime.player.y);
  ctx.shadowColor = state.mode.accent;
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#fff4cf";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(18, 8);
  ctx.lineTo(0, 16);
  ctx.lineTo(-18, 8);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = state.mode.cockpitColor;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(6, 4);
  ctx.lineTo(0, 9);
  ctx.lineTo(-6, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!state.running) {
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(246, 240, 217, 0.88)";
    ctx.font = "600 30px Baskerville";
    ctx.fillText(state.mode.name, CENTER, CENTER - 4);
    ctx.fillStyle = "rgba(246, 240, 217, 0.58)";
    ctx.font = "15px Trebuchet MS";
    ctx.fillText(state.mode.idlePrompt, CENTER, CENTER + 24);
  }

  ctx.restore();
}

function render() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (state.shake > 0) {
    ctx.translate(
      randomBetween(-state.shake, state.shake),
      randomBetween(-state.shake, state.shake),
    );
  }

  drawBackdrop();
  drawStars();
  renderCurrentGame();

  if (state.flash > 0) {
    ctx.globalAlpha = state.flash * 0.14;
    ctx.fillStyle = state.mode.glitchColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function updatePointer(event) {
  const point = getCanvasPoint(event);
  state.input.pointerX = point.x;
  state.input.pointerY = point.y;
}

function handleLaunchAction() {
  launchCurrentMode();
}

function handleKeyState(event, isPressed) {
  const key = event.key.toLowerCase();

  if (key === "arrowleft" || key === "a") {
    state.input.left = isPressed;
    event.preventDefault();
  }

  if (key === "arrowright" || key === "d") {
    state.input.right = isPressed;
    event.preventDefault();
  }

  if (key === "arrowup" || key === "w") {
    state.input.up = isPressed;
    event.preventDefault();
  }

  if (key === "arrowdown" || key === "s") {
    state.input.down = isPressed;
    event.preventDefault();
  }

  if (isPressed && key === "escape") {
    returnToPanel();
    event.preventDefault();
    return;
  }

  if (!isPressed && (event.code === "Space" || key === "enter")) {
    handleLaunchAction();
    event.preventDefault();
  }
}

gameLibrary.addEventListener("click", (event) => {
  const card = event.target.closest("[data-mode-id]");

  if (!card) {
    return;
  }

  selectMode(card.dataset.modeId);
});

storeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upgrade-id]");

  if (!button) {
    return;
  }

  buyUpgrade(button.dataset.upgradeId);
});

overlayButton.addEventListener("click", handleLaunchAction);
sidebarButton.addEventListener("click", handleLaunchAction);
panelButton.addEventListener("click", returnToPanel);
stagePanelButton.addEventListener("click", returnToPanel);
overlayPanelButton.addEventListener("click", returnToPanel);
deviceModeButton.addEventListener("click", toggleDeviceMode);

canvas.addEventListener("pointerdown", (event) => {
  state.input.pointerActive = true;
  updatePointer(event);
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.input.pointerActive) {
    return;
  }

  updatePointer(event);
});

canvas.addEventListener("pointerup", () => {
  state.input.pointerActive = false;
});

canvas.addEventListener("pointercancel", () => {
  state.input.pointerActive = false;
});

window.addEventListener("keydown", (event) => {
  handleKeyState(event, true);
});

window.addEventListener("keyup", (event) => {
  handleKeyState(event, false);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    state.input.pointerActive = false;
  }
});

let previousTimestamp = 0;

function loop(timestamp) {
  if (!previousTimestamp) {
    previousTimestamp = timestamp;
  }

  const dt = Math.min((timestamp - previousTimestamp) / 1000, 0.032);
  previousTimestamp = timestamp;
  state.visualTime += dt;
  state.flash = Math.max(0, state.flash - dt * 2.5);
  state.shake = Math.max(0, state.shake - dt * 18);

  if (state.running) {
    updateCurrentGame(dt);
    updateHud();
  }

  render();
  requestAnimationFrame(loop);
}

applyDeviceMode();
updateModeUi();
returnToPanel();
render();
requestAnimationFrame(loop);
