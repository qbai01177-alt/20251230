let spriteSheet;
let walkSheet;
let stopSheet;
let pushSheet;
let toolSheet;
let dashSheet;
let npc1Sheet; // 提問者1圖片
let npc2Sheet; // 提問者2圖片
let npc3Sheet; // 提問者3圖片
let hintSheet; // 提示精靈圖片
let jumpFrames = [];
let walkFrames = [];
let stopFrames = [];
let pushFrames = [];
let dashFrames = [];
let npc1Frames = []; // 提問者1動畫影格
let npc2Frames = []; // 提問者2動畫影格
let npc3Frames = []; // 提問者3動畫影格
let hintFrames = []; // 提示精靈動畫影格
let currentFrame = 0;

// 跳躍動畫參數
const jumpNumFrames = 8;
const jumpFrameWidth = 299 / jumpNumFrames;
const jumpFrameHeight = 28;

// 行走動畫參數
const walkNumFrames = 12;
const walkFrameWidth = 326 / walkNumFrames;
const walkFrameHeight = 23;

// 待機動畫參數
const stopNumFrames = 2;
const stopFrameWidth = 61 / stopNumFrames;
const stopFrameHeight = 22;

// 攻擊動畫參數
const pushNumFrames = 4;
const pushFrameWidth = 107 / pushNumFrames;
const pushFrameHeight = 28;

// 奔跑動畫參數
const dashNumFrames = 8;
const dashFrameWidth = 259 / dashNumFrames;
const dashFrameHeight = 24;

// 提問者1動畫參數 (171*19, 8張)
const npc1NumFrames = 8;
const npc1FrameWidth = 171 / npc1NumFrames;
const npc1FrameHeight = 19;

// 提問者2動畫參數 (611*82, 8張)
const npc2NumFrames = 8;
const npc2FrameWidth = 611 / npc2NumFrames;
const npc2FrameHeight = 82;

// 提問者3動畫參數 (212*22, 7張)
const npc3NumFrames = 7;
const npc3FrameWidth = 212 / npc3NumFrames;
const npc3FrameHeight = 22;

// 提示精靈動畫參數 (胖丁)
const hintNumFrames = 3;
const hintFrameWidth = 97 / hintNumFrames;
const hintFrameHeight = 27;

// 角色縮放比例
const charScale = 3;

// 角色狀態與物理變數
let playerX, playerY;
let velocityY = 0;
const gravity = 0.6; // 重力強度
const jumpStrength = -15; // 向上跳躍的力道 (負值代表向上)
const walkSpeed = 5; // 走路速度
const dashSpeed = 10; // 奔跑速度 (比走路快)
let isJumping = false; // 追蹤角色是否在空中
let isWalking = false; // 追蹤角色是否在走路
let isDashing = false; // 追蹤角色是否在奔跑
let isAttacking = false; // 追蹤角色是否在攻擊
let isFacingRight = true; // 追蹤角色面向方向
let groundY;
let attackTimer = 0; // 攻擊動畫計時器
let hasSpawnedProjectile = false; // 追蹤本次攻擊是否已發射飛行道具

// 飛行道具管理
let projectiles = [];
let ghosts = []; // 殘影陣列

// 雙擊偵測變數
let lastDPressTime = 0; // 上次按下 D 鍵的時間
let lastAPressTime = 0; // 上次按下 A 鍵的時間
const doubleTapTime = 300; // 雙擊判定的時間間隔 (毫秒)

// 背景管理
let bgImg;
let bgX = 0;
let correctSound; // 答對音效變數
let wrongSound; // 答錯音效變數
let jumpSound; // 跳躍音效變數
let footstepSound; // 奔跑/走路音效
let attackSound; // 攻擊音效
let bgm; // 背景音樂變數

// 問答系統變數
let questionTable;
let npcs = []; // 儲存提問者 NPC
let gameState = 'INTRO_DIALOGUE'; // 'INTRO_DIALOGUE', 'START', 'PLAYING', 'QUESTION', 'FINISHED'
let currentNPC = null; // 當前互動的 NPC
let currentQuestionIndex = 0; // 當前問題索引
let score = 20; // 遊戲分數 (初始送20分)
let hasAttempted = false; // 追蹤當前問題是否已嘗試回答過 (用於計分)
let hintChances = 0; // 提示機會次數
let questionPhase = 0; // 0: 打招呼, 1: 詢問名字, 2: 歡迎, 3: 問答
let playerName = ""; // 玩家名字
let optionBtns = []; // 選項按鈕陣列
let isProcessingAnswer = false; // 防止重複點擊旗標
let restartBtn; // 重新開始按鈕
let startBtn; // 開始遊戲按鈕
let particles = []; // 粒子特效陣列
let interactableNPC = null; // 可互動的 NPC
let startQuizBtn; // 開始問答按鈕
let helpBtn; // 胖丁幫助按鈕 (觸發器)
let isHelpActive = false; // 是否顯示幫助對話框
let helpQuestionBtns = []; // 幫助系統的預設問題按鈕
let closeQuestionBtn; // 關閉問題介面的按鈕
let helpContext = ''; // 'GENERAL' or 'HINT'
let musicToggleBtn; // 音樂開關按鈕
let isMuted = false; // 是否靜音
let helpInput, helpSubmitBtn, helpCloseBtn; // 幫助聊天框UI
let jigglypuffResponse = ""; // 胖丁的回應
let dialogueMessages = []; // 開頭對話訊息
let currentDialogueIndex = 0; // 當前對話索引

// UI 元素
let answerInput, submitBtn, hintBtn;
let feedbackMessage = ""; let currentHint = "";
let questionText = "";

function preload() {
  // 從 '4' 資料夾載入圖片精靈 (替換為新角色)
  spriteSheet = loadImage('4/jump.png', null, (e) => console.error("錯誤：找不到 4/jump.png", e));
  walkSheet = loadImage('4/walk.png', null, (e) => console.error("錯誤：找不到 4/walk.png", e)); // 加入錯誤偵測
  stopSheet = loadImage('4/stand.png', null, (e) => console.error("錯誤：找不到 4/stand.png", e));
  pushSheet = loadImage('4/taunt.png', null, (e) => console.error("錯誤：找不到 4/taunt.png", e)); // 使用 taunt 作為攻擊動作
  dashSheet = loadImage('4/dash.png', null, (e) => console.error("錯誤：找不到 4/dash.png", e)); // 載入奔跑圖片
  bgImg = loadImage('3/10.png', null, (e) => console.error("錯誤：找不到 3/10.png", e)); // 載入背景圖片 (資料夾3是背景)
  npc1Sheet = loadImage('提問者/1.png', null, (e) => console.error("錯誤：找不到 提問者/1.png", e)); // 加入錯誤偵測
  npc2Sheet = loadImage('提問者/2.png', null, (e) => console.error("錯誤：找不到 提問者/2.png", e)); // 加入錯誤偵測
  npc3Sheet = loadImage('提問者/3.png', null, (e) => console.error("錯誤：找不到 提問者/3.png", e)); // 加入錯誤偵測
  hintSheet = loadImage('提示精靈/胖丁.png', null, (e) => console.error("錯誤：找不到 提示精靈/胖丁.png", e)); // 載入提示精靈圖片
  questionTable = loadTable('questions.csv', 'csv', 'header', null, (e) => console.error("錯誤：找不到 questions.csv", e)); // 加入錯誤偵測
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  hintChances = 0; // 初始化提示機會
  // 初始化角色位置
  // 注意：我們以最高的待機圖檔為基準來計算地面，以避免動畫切換時的抖動
  // 依照視窗高度的 2/3 位置設定地面
  groundY = (height * 2 / 3) - (stopFrameHeight * charScale);
  playerX = (width - (stopFrameWidth * charScale)) / 2;
  playerY = groundY;

  // --- 初始化開頭對話 ---
  dialogueMessages = [
    { speaker: '胖丁', text: '你好呀，小冒險家！(｡･ω･｡)ﾉ♡' },
    { speaker: '胖丁', text: '我的名字是胖丁喔～' },
    { speaker: '胖丁', text: '接下來我會陪著你一起冒險！' },
    { speaker: '胖丁', text: '準備好了嗎？旅程要開始囉！ (點擊畫面繼續...)' }
  ];
  currentDialogueIndex = 0;

  // 嘗試載入音效 (移至 setup 以避免若檔案遺失導致卡在 Loading 畫面)
  if (typeof loadSound === 'function') {
    correctSound = loadSound('correct.mp3', null, (e) => console.error("錯誤：找不到 correct.mp3，音效將無法播放", e));
    wrongSound = loadSound('wrong.mp3', null, (e) => console.error("錯誤：找不到 wrong.mp3，音效將無法播放", e));
    jumpSound = loadSound('libraries/pixel-jump-319167.mp3', null, (e) => console.error("錯誤：找不到指定的跳躍音效，將無法播放", e));
    footstepSound = loadSound('libraries/running-on-dirt-road-345729.mp3', null, (e) => console.error("錯誤：找不到指定的腳步音效，將無法播放", e));
    attackSound = loadSound('libraries/clear-combo-7-394494.mp3', null, (e) => console.error("錯誤：找不到指定的攻擊音效，將無法播放", e));
    bgm = loadSound('libraries/upbeat-music-434838 (1).mp3', null, (e) => console.error("錯誤：找不到指定的背景音樂，將無法播放", e));
  }

  // 將 spriteSheet 切割成 10 個影格
  if (spriteSheet && spriteSheet.width > 0) {
    for (let i = 0; i < jumpNumFrames; i++) {
      let x = Math.floor(i * jumpFrameWidth);
      let w = Math.floor(jumpFrameWidth);
      let frame = spriteSheet.get(x, 0, w, jumpFrameHeight);
      jumpFrames.push(frame); // 將切割後的影格存入 jumpFrames 陣列
    }
  }

  // 將 walkSheet 切割成 12 個影格
  // 加入檢查：確保圖片已載入才切割，避免錯誤
  if (walkSheet && walkSheet.width > 0) {
    for (let i = 0; i < walkNumFrames; i++) {
      let x = Math.floor(i * walkFrameWidth);
      let w = Math.floor(walkFrameWidth);
      let frame = walkSheet.get(x, 0, w, walkFrameHeight);
      walkFrames.push(frame);
    }
  }

  // 將 stopSheet 切割成 2 個影格
  if (stopSheet && stopSheet.width > 0) {
    for (let i = 0; i < stopNumFrames; i++) {
      let x = Math.floor(i * stopFrameWidth);
      let w = Math.floor(stopFrameWidth);
      let frame = stopSheet.get(x, 0, w, stopFrameHeight);
      stopFrames.push(frame);
    }
  }

  // 將 pushSheet 切割成 4 個影格
  if (pushSheet && pushSheet.width > 0) {
    for (let i = 0; i < pushNumFrames; i++) {
      let x = Math.floor(i * pushFrameWidth);
      let w = Math.floor(pushFrameWidth);
      let frame = pushSheet.get(x, 0, w, pushFrameHeight);
      pushFrames.push(frame);
    }
  }

  // 將 dashSheet 切割成 8 個影格
  if (dashSheet && dashSheet.width > 0) {
    for (let i = 0; i < dashNumFrames; i++) {
      let x = Math.floor(i * dashFrameWidth);
      let w = Math.floor(dashFrameWidth);
      let frame = dashSheet.get(x, 0, w, dashFrameHeight);
      dashFrames.push(frame);
    }
  }

  // 將 npc1Sheet 切割成 8 個影格
  if (npc1Sheet && npc1Sheet.width > 0) {
    for (let i = 0; i < npc1NumFrames; i++) {
      let x = Math.floor(i * npc1FrameWidth);
      let w = Math.floor(npc1FrameWidth);
      let frame = npc1Sheet.get(x, 0, w, npc1FrameHeight);
      npc1Frames.push(frame);
    }
  }

  // 將 npc2Sheet 切割成 8 個影格
  if (npc2Sheet && npc2Sheet.width > 0) {
    for (let i = 0; i < npc2NumFrames; i++) {
      // 水平切割 (Horizontal Strip)
      let x = Math.floor(i * npc2FrameWidth);
      let w = Math.floor(npc2FrameWidth);
      let frame = npc2Sheet.get(x, 0, w, npc2FrameHeight);
      npc2Frames.push(frame);
    }
  }

  // 將 npc3Sheet 切割成 7 個影格
  if (npc3Sheet && npc3Sheet.width > 0) {
    for (let i = 0; i < npc3NumFrames; i++) {
      let x = Math.floor(i * npc3FrameWidth);
      let w = Math.floor(npc3FrameWidth);
      let frame = npc3Sheet.get(x, 0, w, npc3FrameHeight);
      npc3Frames.push(frame);
    }
  }

  // 將 hintSheet 切割成 3 個影格
  if (hintSheet && hintSheet.width > 0) {
    for (let i = 0; i < hintNumFrames; i++) {
      let x = Math.floor(i * hintFrameWidth);
      let w = Math.floor(hintFrameWidth);
      let frame = hintSheet.get(x, 0, w, hintFrameHeight);
      hintFrames.push(frame);
    }
  }

  // --- 初始化選項按鈕 (四選一) ---
  for (let i = 0; i < 4; i++) {
    let btn = createButton('');
    btn.position(width / 2 - 150, height / 2 + 20 + i * 40); // 垂直排列
    btn.size(300, 30);
    btn.hide();
    btn.mousePressed(() => checkOption(i));
    optionBtns.push(btn);
  }

  // --- 初始化 NPC ---
  // 建立 3 個提問者，分佈在不同距離
  // 由於還沒有圖片，我們用顏色區分：紅、綠、藍
  // 每個 NPC 分配 2 個問題
  // 使用淡江大學教育科技相關題目 (四選一)
  const tkuQuestions = [
    { q: "淡江大學教育科技學系隸屬於哪個學院？", options: ["教育學院", "工學院", "商管學院", "外語學院"], ans: 0, hint: "跟'教育'有關喔！" }, // ans: 0 代表第一個選項
    { q: "教育科技學系主要培養什麼領域的人才？", options: ["數位學習與教材設計", "餐飲管理", "土木工程", "服裝設計"], ans: 0, hint: "跟電腦教學有關。" },
    { q: "淡江大學位於台灣的哪個地區？", options: ["淡水", "板橋", "新竹", "台中"], ans: 0, hint: "有紅毛城的地方。" },
    { q: "教育科技的英文縮寫是什麼？", options: ["ET", "IT", "CS", "MBA"], ans: 0, hint: "Educational Technology" },
    { q: "下列何者通常不是教育科技系的核心課程？", options: ["中式料理", "教學設計", "多媒體製作", "程式設計"], ans: 0, hint: "我們不教煮飯喔。" },
    { q: "製作互動式數位教材時，常使用哪個軟體？", options: ["Unity", "Excel", "Word", "Notepad"], ans: 0, hint: "也是做遊戲常用的引擎。" }
  ];

  // 打亂題庫順序 (Fisher-Yates Shuffle)
  for (let i = tkuQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tkuQuestions[i], tkuQuestions[j]] = [tkuQuestions[j], tkuQuestions[i]];
  }

  const npcNames = ["土豆", "小天", "小魚"];
  for (let i = 0; i < 3; i++) {
    // 將 NPC 拉近，方便測試與尋找
    let npcX = width + 200 + (i * 800); // 第一個在螢幕外 200px，之後每隔 800px
    let questions = [];
    // 從題庫中分配題目 (NPC 1: 0-1, NPC 2: 2-3, NPC 3: 4-5)

    let qIndex = i * 2;
    if (qIndex < tkuQuestions.length) {
      questions.push(tkuQuestions[qIndex]);
      questions.push(tkuQuestions[qIndex + 1]);
    } else {
      // 備用題目
      questions.push({ q: "預設題目", options: ["A", "B", "C", "D"], ans: 0, hint: "無" });
      questions.push({ q: "預設題目", options: ["A", "B", "C", "D"], ans: 0, hint: "無" });
    }
    
    let npcData = {
      id: i + 1,
      name: npcNames[i],
      x: npcX,
      y: groundY - 60, // 稍微浮空或站在地上
      w: 50,
      h: 80,
      color: [255 - (i * 80), 100 + (i * 50), 100], // 不同顏色
      questions: questions,
      currentQ: 0,
      isCompleted: false, // 是否已回答完所有問題
      health: 3, // NPC 血量
      hitTimer: 0, // 被擊中計時器 (用於閃爍效果)
      imgFrames: null, // 儲存動畫影格
      currentFrame: 0 // 當前播放的影格
    };

    // 設定提問者圖片與參數
    let currentScale = charScale; // 預設縮放比例

    if (i === 0) {
      // 提問者 1 (較小，放大 9 倍)
      npcData.imgFrames = npc1Frames;
      currentScale = 9;
      npcData.w = npc1FrameWidth * currentScale;
      npcData.h = npc1FrameHeight * currentScale;
    } else if (i === 1) {
      // 提問者 2 (高度 82px，放大 2.5 倍 -> 約 205px)
      npcData.imgFrames = npc2Frames;
      currentScale = 2.5;
      npcData.w = npc2FrameWidth * currentScale;
      npcData.h = npc2FrameHeight * currentScale;
    } else if (i === 2) {
      // 提問者 3 (較小，放大 9 倍)
      npcData.imgFrames = npc3Frames;
      currentScale = 9;
      npcData.w = npc3FrameWidth * currentScale;
      npcData.h = npc3FrameHeight * currentScale;
    }

    // 計算 Y 軸位置，讓 NPC 站在地面上
    // 地面 Y 座標 = groundY + (stopFrameHeight * charScale)
    npcData.y = (groundY + (stopFrameHeight * charScale)) - npcData.h;

    npcs.push(npcData);
  }

  // --- 初始化 UI ---
  answerInput = createInput('');
  answerInput.position(width / 2 - 100, height / 2 + 20);
  answerInput.size(200);
  answerInput.hide();

  submitBtn = createButton('送出答案');
  submitBtn.position(width / 2 + 110, height / 2 + 20);
  submitBtn.mousePressed(checkAnswer);
  submitBtn.hide();

  hintBtn = createButton('求助提示精靈');
  hintBtn.position(width / 2 - 50, height / 2 + 60);
  hintBtn.style('background-color', '#FFD700'); // 金色
  hintBtn.mousePressed(() => openHelp('HINT'));
  hintBtn.hide();

  // --- 初始化重新開始按鈕 ---
  restartBtn = createButton('重新開始');
  restartBtn.position(width / 2 - 60, height / 2 + 80);
  restartBtn.size(120, 40);
  restartBtn.style('font-size', '20px');
  restartBtn.mousePressed(resetGame);
  restartBtn.hide();

  // --- 初始化開始遊戲按鈕 ---
  startBtn = createButton('開始遊戲');
  startBtn.position(width / 2 - 60, height / 2 + 50);
  startBtn.size(120, 40);
  startBtn.style('font-size', '20px');
  startBtn.mousePressed(() => {
    gameState = 'PLAYING';
    startBtn.hide();
    // 播放背景音樂
    if (bgm && bgm.isLoaded() && !bgm.isPlaying()) { // 如果音樂已載入且未播放
      bgm.loop();
      if (isMuted) {
        bgm.setVolume(0); // 如果是靜音狀態，開始播放時就設為靜音
      } else {
        bgm.setVolume(1); // 否則確保音量正常
      }
    }
  });
  startBtn.hide(); // 預設隱藏，直到開頭對話結束

  // --- 初始化開始問答按鈕 ---
  startQuizBtn = createButton('開始回答');
  startQuizBtn.size(100, 30);
  startQuizBtn.style('font-size', '16px');
  startQuizBtn.mousePressed(() => {
    if (interactableNPC) {
      startQuestion(interactableNPC);
    }
  });
  startQuizBtn.hide();

  // --- 初始化胖丁幫助按鈕 ---
  helpBtn = createButton('?');
  helpBtn.size(35, 35);
  helpBtn.style('font-size', '20px');
  helpBtn.style('font-weight', 'bold');
  helpBtn.style('border-radius', '50%'); // 圓形按鈕
  helpBtn.style('cursor', 'pointer');
  helpBtn.style('background-color', '#FF9800');
  helpBtn.style('color', 'white');
  helpBtn.style('border', '2px solid white');
  helpBtn.mousePressed(() => openHelp('GENERAL'));
  helpBtn.hide();

  // --- 初始化幫助聊天框 ---
  helpInput = createInput('');
  helpInput.size(300, 30);
  helpInput.style('font-size', '16px');
  helpInput.hide();

  helpSubmitBtn = createButton('發送');
  helpSubmitBtn.size(80, 34);
  helpSubmitBtn.mousePressed(getJigglypuffResponse);
  helpSubmitBtn.hide();

  helpCloseBtn = createButton('X');
  helpCloseBtn.size(30, 30);
  helpCloseBtn.style('font-size', '16px');
  helpCloseBtn.style('border-radius', '50%');
  helpCloseBtn.style('cursor', 'pointer');
  helpCloseBtn.style('background-color', '#E57373');
  helpCloseBtn.mousePressed(closeHelp);
  helpCloseBtn.hide();

  // --- 初始化關閉問題按鈕 ---
  closeQuestionBtn = createButton('X');
  closeQuestionBtn.size(30, 30);
  closeQuestionBtn.style('font-size', '16px');
  closeQuestionBtn.style('border-radius', '50%');
  closeQuestionBtn.style('cursor', 'pointer');
  closeQuestionBtn.style('background-color', '#E57373');
  closeQuestionBtn.style('color', 'white');
  closeQuestionBtn.mousePressed(closeQuestionUI);
  closeQuestionBtn.hide();

  // --- 初始化幫助問題按鈕 ---
  const generalQuestions = ["怎麼移動？", "如何攻擊？", "分數怎麼算？", "如何跳躍？"];
  for (let i = 0; i < generalQuestions.length; i++) {
    let btn = createButton(generalQuestions[i]);
    btn.size(120, 35);
    btn.style('font-size', '14px');
    btn.mousePressed(() => setJigglypuffResponse(btn.html()));
    btn.hide();
    helpQuestionBtns.push(btn);
  }

  // --- 初始化音樂開關按鈕 ---
  musicToggleBtn = createButton('🔊');
  musicToggleBtn.position(width - 60, 20);
  musicToggleBtn.size(40, 40);
  musicToggleBtn.style('font-size', '24px');
  musicToggleBtn.style('border', 'none');
  musicToggleBtn.style('background', 'transparent');
  musicToggleBtn.style('cursor', 'pointer');
  musicToggleBtn.mousePressed(toggleMusic);
  musicToggleBtn.hide(); // 預設隱藏
}

function draw() {
  // --- 開頭對話 ---
  if (gameState === 'INTRO_DIALOGUE') {
    // 繪製靜態背景
    if (bgImg && bgImg.width > 0) image(bgImg, 0, 0, width, height);
    else background('#ade8f4');

    // 繪製對話框
    let boxH = 150;
    fill(0, 0, 0, 180);
    stroke(255);
    strokeWeight(2);
    rect(50, height - boxH - 50, width - 100, boxH, 20);

    // 繪製胖丁
    if (hintFrames.length > 0) {
      let hintAnimFrame = floor(frameCount / 10) % hintNumFrames;
      let hintFrame = hintFrames[hintAnimFrame];
      let hintW = hintFrameWidth * charScale * 2.5; // 對話時放大一點
      let hintH = hintFrameHeight * charScale * 2.5;
      // 將胖丁移到右邊
      let hintX = width - hintW - 80;
      image(hintFrame, hintX, height - boxH - 140, hintW, hintH);
    }

    // 繪製對話文字
    if (dialogueMessages[currentDialogueIndex]) {
      let msg = dialogueMessages[currentDialogueIndex];
      fill(255);
      noStroke();
      textSize(28);
      textAlign(LEFT, TOP);
      // 縮小文字框寬度，避免與右邊的胖丁重疊
      let textWidth = width - 500;
      text(msg.speaker + ':', 120, height - boxH - 20, textWidth);
      text(msg.text, 120, height - boxH + 20, textWidth);
    }
    return; // 停止執行後續邏輯
  }

  // --- 開始畫面 ---
  if (gameState === 'START') {
    // 繪製背景 (靜態)
    if (bgImg && bgImg.width > 0) {
      image(bgImg, 0, 0, width, height);
    } else {
      background('#ade8f4');
    }
    
    // 半透明遮罩，讓文字更清楚
    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    // 標題與提示
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50); // 調整字體大小以容納較長的標題
    text("淡江大學教科系考題大作戰", width / 2, height / 2 - 50);
    textSize(30);
    startBtn.show(); // 顯示開始按鈕
    pop();
    return; // 停止執行後續的遊戲邏輯
  }

  // --- 結束畫面 ---
  if (gameState === 'FINISHED') {
    // 繪製背景 (靜態)
    if (bgImg && bgImg.width > 0) {
      image(bgImg, 0, 0, width, height);
    } else {
      background('#ade8f4');
    }
    
    // 半透明遮罩
    push();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    // 標題
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("遊戲結束", width / 2, height / 2 - 120);
    
    // 分數
    textSize(30);
    text("你的總分: " + score, width / 2, height / 2 - 50);
    
    // 評語與鼓勵
    let comment = "";
    if (score >= 60) {
      comment = "太完美了！你是知識小達人！";
    } else if (score >= 40) {
      comment = "做得很好！繼續保持！";
    } else if (score >= 20) {
      comment = "不錯喔！再接再厲！";
    } else {
      comment = "別灰心，下次會更好！";
    }
    
    fill(255, 255, 0); // 黃色文字
    text(comment, width / 2, height / 2 + 20);
    
    // 顯示重新開始按鈕
    restartBtn.show();
    pop();
    return;
  }

  // 設定背景顏色
  // background('#ade8f4');
  
  // 如果在問答狀態，停止背景捲動邏輯的更新，但保持繪製
  // 這裡我們只在 PLAYING 狀態下更新 bgX，但繪製始終進行
  
  // 處理背景無限捲動：當背景移出畫面時，重置 bgX
  if (bgX <= -width) {
    bgX += width;
  } else if (bgX >= width) {
    bgX -= width;
  }
  
  // 繪製背景 (三張圖片串接為一個大的背景)
  // bgX 為中間背景的 X 座標
  // 優化：只需要繪製兩張圖片即可覆蓋整個螢幕，提升效能
  if (bgImg && bgImg.width > 0) {
    image(bgImg, bgX, 0, width, height); // 繪製主背景
    if (bgX > 0) {
      image(bgImg, bgX - width, 0, width, height); // 如果背景偏右，填補左側空隙
    } else {
      image(bgImg, bgX + width, 0, width, height); // 如果背景偏左，填補右側空隙
    }
  } else {
    background('#ade8f4'); // 如果背景圖載入失敗，顯示預設顏色
  }
  
  // --- 輸入處理 ---
  // 使用 keyIsDown 實現持續移動
  let isMovingByKey = false; // 追蹤本幀是否有移動按鍵按下
  // 攻擊時不能在地面上移動，但在空中可以保持移動控制
  if (gameState === 'PLAYING' && (!isAttacking || isJumping)) {
    if (keyIsDown(68)) { // 'D' 鍵
      let currentSpeed = isDashing ? dashSpeed : walkSpeed;
      bgX -= currentSpeed;
      for (let p of projectiles) p.x -= currentSpeed;
      for (let g of ghosts) g.x -= currentSpeed;
      for (let npc of npcs) npc.x -= currentSpeed;
      isFacingRight = true;
      isMovingByKey = true;
    } else if (keyIsDown(65)) { // 'A' 鍵
      let currentSpeed = isDashing ? dashSpeed : walkSpeed;
      bgX += currentSpeed;
      for (let p of projectiles) p.x += currentSpeed;
      for (let g of ghosts) g.x += currentSpeed;
      for (let npc of npcs) npc.x += currentSpeed;
      isFacingRight = false;
      isMovingByKey = true;
    }
  }
  
  // 走路動畫狀態只在地面上時更新
  isWalking = isMovingByKey && !isJumping;

  // --- 腳步音效管理 (更穩定的版本) ---
  if (footstepSound) {
    // 只要按下移動鍵就應該播放音效
    const shouldPlay = gameState === 'PLAYING' && isMovingByKey;
    const isPlaying = footstepSound.isPlaying();

    if (shouldPlay) {
      if (!isPlaying) {
        footstepSound.loop(); // 如果該播但沒在播，就開始
      }
      // 隨時根據奔跑狀態調整速度
      const targetRate = isDashing ? 1.0 : 0.6;
      if (footstepSound.rate() !== targetRate) {
        footstepSound.rate(targetRate);
      }
    } else {
      if (isPlaying) {
        footstepSound.stop(); // 如果不該播但正在播，就停止
      }
    }
  }

  // --- 物理更新 ---
  velocityY += gravity; // 將重力應用到垂直速度
  playerY += velocityY; // 根據速度更新 Y 位置
  
  // 檢查角色是否落地
  if (playerY >= groundY) {
    playerY = groundY; // 將角色固定在地面上，避免掉下去
    velocityY = 0; // 停止垂直移動
    isJumping = false; // 設定為不在跳躍狀態
  }
  
  // --- 動畫更新與繪製 ---
  let displayFrame;
  let frameW, frameH;

  if (isAttacking) {
    // 狀態1: 攻擊 (最高優先級)
    // 根據計時器決定顯示哪一幀，讓動畫播放一次後停止
    let attackFrameIndex = floor(attackTimer / 5); // 每5幀換一圖
    if (attackFrameIndex >= pushNumFrames) {
      isAttacking = false; // 動畫結束
    } else {
      if (pushFrames.length > 0) {
        displayFrame = pushFrames[attackFrameIndex];
        frameW = pushFrameWidth;
        frameH = pushFrameHeight;
      }
      attackTimer++;

      // 在攻擊動畫的特定幀發射飛行道具
      // 這裡假設在第 3 幀 (索引為 2) 發射，您可以根據實際動畫效果調整這個數字
      if (attackFrameIndex === 2 && !hasSpawnedProjectile) {
        let projectile = {
          x: isFacingRight ? playerX + (frameW * charScale) - 20 : playerX + 20, // 調整發射位置
          y: playerY + (frameH * charScale) / 2, // 調整發射高度
          speed: isFacingRight ? 10 : -10,
          animFrame: 0
        };
        projectiles.push(projectile);
        hasSpawnedProjectile = true; // 標記為已發射，本次攻擊不再發射
      }
    }
  }
  
  if (!isAttacking && isJumping) {
    // 狀態2: 跳躍
    if (frameCount % 5 === 0) {
      currentFrame = (currentFrame + 1) % jumpNumFrames;
    }
    if (jumpFrames.length > 0) {
      displayFrame = jumpFrames[currentFrame % jumpNumFrames];
      frameW = jumpFrameWidth;
      frameH = jumpFrameHeight;
    }
  } else if (!isAttacking && isWalking) {
    // 狀態3: 行走 或 奔跑
    if (isDashing) {
      // 奔跑動畫
      if (frameCount % 4 === 0) { // 奔跑動畫通常比走路快一點
        currentFrame = (currentFrame + 1) % dashNumFrames;
      }
      if (dashFrames.length > 0) {
        displayFrame = dashFrames[currentFrame % dashNumFrames];
        frameW = dashFrameWidth;
        frameH = dashFrameHeight;
      }
    } else {
      // 行走動畫
      if (frameCount % 5 === 0) {
        currentFrame = (currentFrame + 1) % walkNumFrames;
      }
      if (walkFrames.length > 0) {
        displayFrame = walkFrames[currentFrame % walkNumFrames];
        frameW = walkFrameWidth;
        frameH = walkFrameHeight;
      }
    }
  } else if (!isAttacking) {
    // 狀態4: 站立/待機 (預設)
    // 播放待機動畫
    if (frameCount % 8 === 0) { // 待機動畫可以慢一點
      currentFrame = (currentFrame + 1) % stopNumFrames;
    }
    if (stopFrames.length > 0) {
      displayFrame = stopFrames[currentFrame % stopNumFrames];
      frameW = stopFrameWidth;
      frameH = stopFrameHeight;
    }
  }
  
  // --- 產生與繪製殘影 ---
  // 只有在奔跑時才產生殘影
  if (isDashing && frameCount % 3 === 0 && displayFrame) {
    ghosts.push({
      x: playerX,
      y: playerY,
      w: frameW,
      h: frameH,
      img: displayFrame,
      facingRight: isFacingRight,
      alpha: 150, // 初始透明度 (0-255)
      // 設定殘影顏色 (R, G, B)
      // 藍色範例: (50, 50, 255)，若要紅色可改為 (255, 50, 50)
      r: 50, g: 50, b: 255
    });
  }

  // 繪製並更新殘影
  for (let i = ghosts.length - 1; i >= 0; i--) {
    let g = ghosts[i];
    g.alpha -= 10; // 殘影消失速度
    if (g.alpha <= 0) {
      ghosts.splice(i, 1);
      continue;
    }
    push();
    tint(g.r, g.g, g.b, g.alpha); // 設定顏色與透明度
    translate(g.x + (g.w * charScale) / 2, g.y + (g.h * charScale) / 2);
    if (!g.facingRight) scale(-1, 1);
    image(g.img, -(g.w * charScale) / 2, -(g.h * charScale) / 2, g.w * charScale, g.h * charScale);
    pop();
  }

  // --- 更新與繪製飛行道具 (包含碰撞檢測) ---
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed; // 移動
    
    // 改為繪製一個簡單的圖形代替圖片
    push();
    fill(255, 255, 0); // 黃色
    noStroke();
    
    // 繪製星星
    translate(p.x, p.y); // 將原點移至飛行道具位置
    rotate(frameCount * 0.1); // 讓星星旋轉
    
    beginShape();
    // 繪製五角星
    for (let j = 0; j < 5; j++) {
      let angle = TWO_PI * j / 5 - HALF_PI;
      vertex(cos(angle) * 15, sin(angle) * 15); // 外頂點 (半徑15)
      
      angle += TWO_PI / 10;
      vertex(cos(angle) * 7, sin(angle) * 7); // 內頂點 (半徑7)
    }
    endShape(CLOSE);
    pop();
    
    // 如果飛出畫面，則移除
    if (p.x > width || p.x < 0) {
      projectiles.splice(i, 1);
      continue; // 繼續下一個飛行道具的迴圈
    }

    // 碰撞檢測：飛行道具 vs NPC
    for (let npc of npcs) {
      if (!npc.isCompleted && npc.health > 0) {
        const projectileSize = 30; // 星星的碰撞大小估計值
        if (p.x < npc.x + npc.w && p.x + projectileSize > npc.x &&
            p.y < npc.y + npc.h && p.y + projectileSize > npc.y) {
          
          npc.health--; // 扣血
          npc.hitTimer = 15; // 設定閃爍計時器 (15幀)
          hintChances++; // 增加提示機會
          projectiles.splice(i, 1); // 移除飛行道具
          break; // 飛行道具已消失，跳出 NPC 迴圈
        }
      }
    }
  }

  // --- 繪製與更新 NPC ---
  interactableNPC = null; // 重置可互動 NPC
  for (let npc of npcs) {
    // 繪製 NPC (暫時用方塊代替，之後可換成圖片)
    if (npc.health <= 0 && !npc.isCompleted) {
      npc.isCompleted = true; // 血量為0則視為完成
      score += 5; // 擊敗 NPC 獲得額外分數
    }

    if (!npc.isCompleted) {
      if (npc.imgFrames && npc.imgFrames.length > 0) { // 確保有影格才播放
        // 如果有圖片影格 (如霸王龍)，播放動畫
        if (frameCount % 10 === 0) { // 控制動畫速度
          npc.currentFrame = (npc.currentFrame + 1) % npc.imgFrames.length;
        }
        let frame = npc.imgFrames[npc.currentFrame];

        // 如果被擊中，應用紅色閃爍效果
        if (npc.hitTimer > 0) {
          tint(255, 100, 100); // 紅色色調
          npc.hitTimer--;
        }
        
        push();
        // 移動原點到 NPC 中心以便翻轉
        translate(npc.x + npc.w / 2, npc.y + npc.h / 2);
        
        // 將所有提問者面向左邊 (水平翻轉，假設原始素材面向右)
        scale(-1, 1);
        
        image(frame, -npc.w / 2, -npc.h / 2, npc.w, npc.h);
        pop();

        // 重置色調，避免影響其他繪圖
        noTint();

        // 標籤 (獨立繪製，避免被翻轉)
        push();
        fill(255);
        textAlign(CENTER);
        text(npc.name, npc.x + npc.w/2, npc.y - 10);

        // 繪製血條
        const barWidth = 20;
        const barHeight = 8;
        const totalBarWidth = barWidth * 3 + 2 * 2; // 3格血 + 2個間隔
        const barStartX = npc.x + (npc.w / 2) - (totalBarWidth / 2);
        const barY = npc.y - 30;
        
        noStroke();
        for (let j = 0; j < 3; j++) {
          fill(j < npc.health ? '#4CAF50' : '#555'); // 綠色或灰色
          rect(barStartX + j * (barWidth + 2), barY, barWidth, barHeight, 2);
        }

        pop();
      } else {
        // 如果沒有圖片 (提問者 2, 3)，繪製方塊
        push();
        fill(npc.color);
        rect(npc.x, npc.y, npc.w, npc.h);
        fill(255);
        textAlign(CENTER);
        text(`提問者 ${npc.id}`, npc.x + npc.w/2, npc.y - 10);
        pop();
      }

      // --- 驚嘆號與互動按鈕偵測 ---
      // 為了避免同時顯示多個按鈕，只對第一個偵測到的NPC顯示
      if (!interactableNPC && gameState === 'PLAYING') {
        let pCenterX = playerX + (stopFrameWidth * charScale) / 2;
        let nCenterX = npc.x + npc.w / 2;
        let dist = abs(pCenterX - nCenterX);

        if (dist < 200) { // 互動範圍
          interactableNPC = npc; // 標記本幀可互動的NPC

          // 繪製驚嘆號
          let bounce = sin(frameCount * 0.2) * 5;
          push();
          textAlign(CENTER, BOTTOM);
          textSize(50);
          stroke(255);
          strokeWeight(4);
          fill(255, 0, 0);
          text("!", npc.x + npc.w / 2, npc.y - 30 + bounce);
          pop();

          // 定位並顯示按鈕
          startQuizBtn.position(npc.x + npc.w / 2 + 20, npc.y - 55 + bounce);
          startQuizBtn.show();
        }
      }
    }
  }

  // 如果本幀結束後沒有可互動的 NPC，隱藏按鈕
  if (!interactableNPC) {
    startQuizBtn.hide();
  }

  // --- 繪製提示精靈 (Hint Character) ---
  if (hintFrames.length > 0) {
    let hintAnimFrame = floor(frameCount / 10) % hintNumFrames; // 控制動畫速度
    let hintFrame = hintFrames[hintAnimFrame];
    let hintW = hintFrameWidth * charScale; // 放大
    let hintH = hintFrameHeight * charScale;
    
    // 計算位置，讓它跟隨在玩家左上方
    let hintX = playerX - hintW - 10; // 放在玩家左邊一點
    let hintY = playerY - hintH + sin(frameCount * 0.1) * 5; // 上下浮動

    push();
    // 發光效果 (改為粉色以搭配胖丁)
    noStroke();
    for(let i = 0; i < 5; i++) {
      fill(255, 182, 193, 50 - i * 10); // 粉色光暈
      circle(hintX + hintW / 2, hintY + hintH / 2, hintW + i * 5);
    }
    image(hintFrame, hintX, hintY, hintW, hintH);

    // 定位並顯示幫助按鈕
    if (gameState === 'PLAYING') {
      helpBtn.position(hintX + hintW - 15, hintY - 20);
      helpBtn.show();
    } else {
      helpBtn.hide();
    }
    pop();
  }

  // --- 繪製問答 UI (如果是 QUESTION 狀態) ---
  if (gameState === 'QUESTION') {
    // 半透明黑色背景遮罩
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // 對話框
    push();
    fill(255);
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 50, 400, 200, 20);

    // 顯示關閉按鈕
    let boxX_center = width / 2;
    let boxY_center = height / 2 - 50;
    let boxW = 400;
    let boxH = 200;
    closeQuestionBtn.position(boxX_center + boxW / 2 - 40, boxY_center - boxH / 2 + 10);
    closeQuestionBtn.show();
    
    // 文字設定
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    
    if (questionPhase === 0) {
      // --- 階段 0: 打招呼 ---
      textSize(24);
      text(`你好！我是${currentNPC.name}。`, width / 2, height / 2 - 40);
      text("很高興見到你！", width / 2, height / 2);
    } else if (questionPhase === 1) {
      // --- 階段 1: 詢問名字 ---
      textSize(24);
      text("請問你叫什麼名字？", width / 2, height / 2 - 40);
    } else if (questionPhase === 2) {
      // --- 階段 2: 歡迎訊息 ---
      textSize(24);
      text(`你好~ 歡迎你 ${playerName}`, width / 2, height / 2);
    } else if (questionPhase === 3) {
      // --- 階段 3: 四選一問答 ---
      textSize(20);
      text(`問題 (${currentNPC.currentQ + 1}/2):`, width / 2, height / 2 - 120);
      textSize(22);
      // 自動換行顯示題目
      text(questionText, width / 2, height / 2 - 80);
      
      // --- 在問答時，將胖丁和求助按鈕移到左邊 ---
      if (hintFrames.length > 0) {
        let hintAnimFrame = floor(frameCount / 10) % hintNumFrames;
        let hintFrame = hintFrames[hintAnimFrame];
        let hintW = hintFrameWidth * charScale * 1.5;
        let hintH = hintFrameHeight * charScale * 1.5;
        let hintX = 50;
        let hintY = height / 2 - hintH / 2;
        
        image(hintFrame, hintX, hintY, hintW, hintH);
        
        hintBtn.position(hintX + hintW + 10, hintY + hintH / 2 - 15);
        hintBtn.show();
      }

      // 回饋訊息
      textSize(18);
      if (feedbackMessage.includes("答對")) fill(0, 150, 0);
      else fill(200, 0, 0);
      text(feedbackMessage, width / 2, height / 2 + 160); // 移到按鈕下方
    }
    pop();
  }

  // --- 繪製粒子特效 (彩帶) ---
  // 放在 UI 繪製之後，確保顯示在最上層 (但在 DOM 元素之下)
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // 重力效果
    p.alpha -= 3; // 慢慢消失
    
    push();
    noStroke();
    fill(p.r, p.g, p.b, p.alpha);
    translate(p.x, p.y);
    rotate(frameCount * 0.1 + p.offset); // 旋轉效果
    rect(0, 0, p.size, p.size); // 方形彩帶
    pop();

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // --- 繪製角色 ---
  push(); // 保存當前的繪圖狀態
  translate(playerX + (frameW * charScale) / 2, playerY + (frameH * charScale) / 2); // 將座標原點移到圖片中心
  if (!isFacingRight) {
    scale(-1, 1); // 如果角色向左，則水平翻轉
  }
  if (displayFrame) {
    image(displayFrame, -(frameW * charScale) / 2, -(frameH * charScale) / 2, frameW * charScale, frameH * charScale);
  } else {
    // 圖片載入失敗時的替代顯示 (紅色方塊)，避免程式崩潰
    fill(255, 0, 0);
    rect(-20, -40, 40, 80);
  }
  pop(); // 恢復繪圖狀態

  // --- 顯示分數 (HUD) ---
  // 繪製在最上層，確保隨時可見
  push();
  fill(255); // 白色文字，在深色背景上較清楚
  textSize(32);
  textAlign(LEFT, TOP);
  text("分數: " + score, 30, 30); // 顯示在左上角
  pop();

  // --- 繪製幫助對話框 (如果啟用) ---
  if (isHelpActive) {
    // 半透明背景遮罩
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);

    // 對話框
    let boxW = width * 0.6;
    let boxH = 250; // 增加高度以容納輸入框
    let boxX = width / 2 - boxW / 2;
    let boxY = height / 2 - boxH / 2;
    fill(255, 240, 245, 240); // 淡粉色
    stroke(255, 105, 180); // 桃紅色邊框
    strokeWeight(3);
    rect(boxX, boxY, boxW, boxH, 20);

    // 胖丁圖片
    if (hintFrames.length > 0) {
      let hintFrame = hintFrames[floor(frameCount / 10) % hintNumFrames];
      image(hintFrame, boxX + 20, boxY + 20, hintFrameWidth * 3, hintFrameHeight * 3);
    }

    // 胖丁的回應文字
    fill(93, 64, 55); // 深咖啡色文字
    noStroke();
    textSize(20);
    textAlign(LEFT, TOP);
    text(jigglypuffResponse, boxX + hintFrameWidth * 3 + 40, boxY + 25, boxW - (hintFrameWidth * 3) - 80);
  }
}

// --- 問答系統函式 ---

function startQuestion(npc) {
  gameState = 'QUESTION';
  currentNPC = npc;
  isWalking = false; // 停止走路動畫
  isDashing = false;
  hasAttempted = false; // 重置嘗試狀態，新題目開始計算
  isProcessingAnswer = false; // 重置防止重複點擊旗標
  
  // 重置 UI
  feedbackMessage = "";
  answerInput.value('');
  answerInput.hide();
  hintBtn.hide(); // 暫時隱藏提示
  startQuizBtn.hide(); // 隱藏開始問答按鈕
  closeQuestionBtn.hide(); // 預先隱藏關閉按鈕
  for(let btn of optionBtns) btn.hide(); // 隱藏選項

  // 判斷是否需要問名字
  if (playerName === "") {
    questionPhase = 0; // 從打招呼開始
    submitBtn.html('下一步');
    submitBtn.show();
  } else {
    questionPhase = 3; // 已經有名字，直接進入問答
    // 更新提示按鈕文字
    hintBtn.html('求助提示精靈 (' + hintChances + ')');
    // hintBtn 會在 draw() 中被定位和顯示

    loadQuizUI();
  }
}

function checkAnswer() {
  if (questionPhase === 0) {
    // --- 從打招呼 進入 詢問名字 ---
    questionPhase = 1;
    submitBtn.html('送出名字');
    answerInput.show();
    return;
  }
  
  if (questionPhase === 1) {
    // --- 從詢問名字 進入 問答 ---
    playerName = answerInput.value();
    if (playerName.trim() === "") playerName = "冒險者"; // 預設名字
    
    questionPhase = 2; // 進入歡迎階段

    // --- 觸發開心跳躍動作 ---
    velocityY = jumpStrength; 
    isJumping = true;
    currentFrame = 0;

    answerInput.hide();
    submitBtn.html('開始挑戰'); // 按鈕改為進入下一階段
    return;
  }

  if (questionPhase === 2) {
    // --- 從歡迎 進入 問答 ---
    questionPhase = 3;
    submitBtn.hide(); // 隱藏送出按鈕
    
    hintBtn.html('求助提示精靈 (' + hintChances + ')');
    // hintBtn 會在 draw() 中被定位和顯示
    
    loadQuizUI(); // 載入題目與選項
    return;
  }
}

function loadQuizUI() {
  let qData = currentNPC.questions[currentNPC.currentQ];
  questionText = qData.q;
  currentHint = qData.hint;
  
  // 設定選項按鈕文字並顯示
  for (let i = 0; i < 4; i++) {
    optionBtns[i].html(qData.options[i]);
    optionBtns[i].show();
    // 重置按鈕樣式
    optionBtns[i].style('background-color', '');
    optionBtns[i].style('color', '');
  }
}

function checkOption(optionIndex) {
  if (questionPhase !== 3 || isProcessingAnswer) return;
  
  let qData = currentNPC.questions[currentNPC.currentQ];
  let correctIndex = qData.ans;

  if (optionIndex === correctIndex) {
    isProcessingAnswer = true; // 鎖定輸入，防止重複點擊

    // --- 答對時的變色效果 ---
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        // 正確答案變為綠色
        optionBtns[i].style('background-color', '#4CAF50');
        optionBtns[i].style('color', 'white');
      } else {
        // 其他選項變為灰色以示禁用
        optionBtns[i].style('background-color', '#cccccc');
        optionBtns[i].style('color', '#666666');
      }
    }

    feedbackMessage = "答對了！太棒了 " + playerName + "！";
    if (!hasAttempted) score += 10; // 第一次就答對才加分
    
    // 播放答對音效
    if (correctSound && correctSound.isLoaded()) {
      correctSound.play();
    }
    // 延遲一秒後進入下一題或結束
    setTimeout(() => {
      currentNPC.currentQ++;
      if (currentNPC.currentQ >= currentNPC.questions.length) {
        // 該 NPC 所有問題回答完畢
        currentNPC.isCompleted = true;
        closeQuestionUI();
      } else {
        // 還有下一題，重新載入
        // 這裡直接載入下一題，不重複打招呼
        hasAttempted = false;
        isProcessingAnswer = false; // 解鎖輸入
        feedbackMessage = "";
        hintBtn.html('求助提示精靈 (' + hintChances + ')'); // 更新按鈕文字
        loadQuizUI();
      }
    }, 1500);
  } else {
    feedbackMessage = "答錯囉，再試試看！";
    hasAttempted = true; // 標記為已嘗試過 (答錯)，之後答對也不加分
    // 播放答錯音效
    if (wrongSound && wrongSound.isLoaded()) {
      wrongSound.play();
    }

    // --- 答錯時的震動與變色效果 ---
    const wrongButton = optionBtns[optionIndex];
    shakeElement(wrongButton); // 觸發震動
    wrongButton.style('background-color', '#E57373'); // 變為淡紅色
    wrongButton.style('color', 'white');

    // 短暫延遲後恢復按鈕顏色
    setTimeout(() => {
      // 確保在恢復顏色時，玩家還沒有答對
      if (!isProcessingAnswer) {
        wrongButton.style('background-color', ''); // 恢復預設
        wrongButton.style('color', '');
      }
    }, 600);
  }
}

function closeQuestionUI() {
  // 檢查是否所有 NPC 都已完成
  let allCompleted = true;
  for (let npc of npcs) {
    if (!npc.isCompleted) {
      allCompleted = false;
      break;
    }
  }

  if (allCompleted) {
    gameState = 'FINISHED'; // 所有問題回答完畢，進入結束畫面
  } else {
    gameState = 'PLAYING'; // 繼續遊戲
  }
  
  currentNPC = null;
  answerInput.hide();
  submitBtn.hide();
  hintBtn.hide();
  closeQuestionBtn.hide(); // 確保關閉按鈕被隱藏
  for(let btn of optionBtns) btn.hide();
  isProcessingAnswer = false;
}

function shakeElement(element) {
  const originalX = element.position().x;
  const shakeAmount = 5; // 震動幅度 (像素)
  let shakeCount = 0;
  const shakeDuration = 6; // 震動次數

  const intervalId = setInterval(() => {
    if (shakeCount >= shakeDuration) {
      clearInterval(intervalId);
      element.position(originalX, element.position().y); // 恢復原始位置
      return;
    }
    // 左右交替移動
    const newX = originalX + (shakeCount % 2 === 0 ? shakeAmount : -shakeAmount);
    element.position(newX, element.position().y);
    shakeCount++;
  }, 50); // 每 50 毫秒震動一次
}

function setJigglypuffResponse(query) {
  query = query.toLowerCase();
  
  if (helpContext === 'HINT') {
    const isAskingForHint = query.includes('提示');
    const isAskingAboutQuestion = questionText.toLowerCase().includes(query) && query.trim().length > 0;

    if (isAskingForHint || isAskingAboutQuestion) {
      jigglypuffResponse = "好的，關於「" + questionText + "」...\n我的提示是...\n\n✨ " + currentHint + " ✨";
      hintChances--;
      hintBtn.html('求助提示精靈 (' + hintChances + ')');
    } else {
      jigglypuffResponse = "這個...胖丁聽不懂耶，\n你可以問我「提示」，或打出題目裡的字喔！";
    }
  } else { // GENERAL
    if (query.includes('移動')) {
      jigglypuffResponse = "用鍵盤上的 A 和 D 鍵就可以左右移動囉！\n雙擊 A 或 D 還可以快速衝刺！";
    } else if (query.includes('攻擊') || query.includes('星星')) {
      jigglypuffResponse = "按下空白鍵 (Space) 就可以發射可愛的星星來攻擊！";
    } else if (query.includes('分數')) {
      jigglypuffResponse = "答對提問者的問題就可以獲得分數囉！\n加油加油～(o^▽^o)";
    } else if (query.includes('跳躍')) {
      jigglypuffResponse = "按下 W 鍵就可以向上跳躍，\n試著跳過障礙物吧！";
    } else {
      jigglypuffResponse = "嗯...這個胖丁聽不懂耶，\n可以換個問題問我嗎？";
    }
  }
}

// --- 幫助系統函式 ---

function openHelp(context) {
  // 在問答中，只有HINT可以打開；在遊戲中，只有GENERAL可以打開
  if ((context === 'HINT' && gameState !== 'QUESTION') || 
      (context === 'GENERAL' && gameState !== 'PLAYING')) {
    return;
  }

  // If opening hint dialog during a question, hide the option buttons to prevent overlap
  if (context === 'HINT' && gameState === 'QUESTION') {
    for (let btn of optionBtns) {
      btn.hide();
    }
  }

  isHelpActive = true;
  helpContext = context;

  let boxW = width * 0.6;
  let boxH = 250;
  let boxX = width / 2 - boxW / 2;
  let boxY = height / 2 - boxH / 2;
  
  helpCloseBtn.position(boxX + boxW - 40, boxY + 10);
  helpCloseBtn.show();

  // 定位輸入框和發送按鈕
  helpInput.position(boxX + 20, boxY + boxH - 50);
  helpSubmitBtn.position(boxX + 330, boxY + boxH - 52);
  helpInput.show();
  helpSubmitBtn.show();

  if (context === 'HINT') {
    if (hintChances > 0) {
      jigglypuffResponse = "需要什麼提示嗎？\n你可以點擊下面的按鈕，或自己打字問我喔！";
      helpQuestionBtns[0].html('給我提示！');
      helpQuestionBtns[0].position(boxX + 20, boxY + boxH - 95);
      helpQuestionBtns[0].show();
      for (let i = 1; i < helpQuestionBtns.length; i++) helpQuestionBtns[i].hide();
    } else {
      jigglypuffResponse = "你沒有求助次數了耶...\n先去攻擊提問者賺一點吧！";
      helpInput.hide();
      helpSubmitBtn.hide();
      for (let btn of helpQuestionBtns) btn.hide();
    }
  } else { // GENERAL
    jigglypuffResponse = "有什麼想問胖丁的嗎？\n你可以點擊下面的問題，或自己打字問我喔！";
    const generalQuestions = ["怎麼移動？", "如何攻擊？", "分數怎麼算？", "如何跳躍？"];
    for (let i = 0; i < helpQuestionBtns.length; i++) {
      if (generalQuestions[i]) {
        helpQuestionBtns[i].html(generalQuestions[i]);
        helpQuestionBtns[i].position(boxX + 20 + i * 130, boxY + boxH - 95);
        helpQuestionBtns[i].show();
      }
    }
  }
}

function closeHelp() {
  isHelpActive = false;
  helpInput.hide();
  helpSubmitBtn.hide();
  helpCloseBtn.hide();

  for (let btn of helpQuestionBtns) {
    btn.hide();
  }
  // If we were in a question, show the option buttons again
  if (gameState === 'QUESTION') {
    for (let btn of optionBtns) {
      btn.show();
    }
  }
}

function getJigglypuffResponse() {
  const query = helpInput.value().toLowerCase();
  setJigglypuffResponse(query);
  helpInput.value(''); // 清空輸入框
}

function toggleMusic() {
  isMuted = !isMuted; // 切換靜音狀態
  if (isMuted) {
    if (bgm) {
      bgm.setVolume(0); // 將音量設為0來靜音，音樂會繼續在背景播放
    }
    musicToggleBtn.html('🔇');
  } else {
    if (bgm) {
      bgm.setVolume(1); // 恢復音量
      // 如果音樂沒有在播放 (例如重置遊戲後)，且遊戲正在進行中，則重新開始播放
      if (!bgm.isPlaying() && (gameState === 'PLAYING' || gameState === 'QUESTION' || gameState === 'FINISHED')) {
        bgm.loop();
      }
    }
    musicToggleBtn.html('🔊');
  }
}

// 處理鍵盤按下事件
function keyPressed() {
  // 如果在問答或幫助狀態，禁止角色操作
  if (gameState === 'QUESTION' || isHelpActive) return;

  // 當按下 'W' 鍵且角色不在空中或攻擊時，觸發跳躍
  if ((key === 'W' || key === 'w') && !isJumping && !isAttacking) {
    velocityY = jumpStrength; // 給予向上的初速度
    isJumping = true; // 設定為跳躍狀態
    currentFrame = 0; // 重置動畫影格，讓跳躍從第一格開始
    // 播放跳躍音效
    if (jumpSound && jumpSound.isLoaded()) {
      jumpSound.play();
    }
  }

  // 當按下空白鍵且角色不在攻擊時，觸發攻擊 (現在允許在跳躍時攻擊)
  if (keyCode === 32 && !isAttacking) {
    isAttacking = true;
    attackTimer = 0; // 重置攻擊計時器
    // 播放攻擊音效
    if (attackSound && attackSound.isLoaded()) {
      attackSound.play();
    }
    // 注意：飛行道具的生成邏輯已移至 draw() 函式中，以確保發射時機準確
    // 這裡只負責啟動攻擊狀態並重置旗標
    hasSpawnedProjectile = false; // 重置發射標記，準備本次攻擊發射飛行道具
  }

  // 偵測 D 鍵雙擊 (Dash)
  if (key === 'D' || key === 'd') {
    let currentTime = millis();
    // 如果兩次按鍵間隔小於設定的時間 (300ms)，則觸發奔跑
    if (currentTime - lastDPressTime < doubleTapTime) {
      isDashing = true;
    }
    lastDPressTime = currentTime;
  }

  // 偵測 A 鍵雙擊 (Dash)
  if (key === 'A' || key === 'a') {
    let currentTime = millis();
    // 如果兩次按鍵間隔小於設定的時間 (300ms)，則觸發奔跑
    if (currentTime - lastAPressTime < doubleTapTime) {
      isDashing = true;
    }
    lastAPressTime = currentTime;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 當視窗大小改變時，重新計算角色位置
  // 依照視窗高度的 2/3 位置設定地面
  groundY = (height * 2 / 3) - (stopFrameHeight * charScale);
  
  // 如果角色沒有在移動，將其重新置中
  // 這裡我們假設遊戲開始時角色是靜止的
  if (!isJumping) {
    playerX = (width - (stopFrameWidth * charScale)) / 2;
    playerY = groundY;

  }
  // 重新定位音樂按鈕
  if (musicToggleBtn) {
    musicToggleBtn.position(width - 60, 20);
  }
}

function mousePressed() {
  // 處理開頭對話的點擊推進
  if (gameState === 'INTRO_DIALOGUE' && !isHelpActive) {
    currentDialogueIndex++;
    if (currentDialogueIndex >= dialogueMessages.length) {
      gameState = 'START';
      musicToggleBtn.show(); // 顯示音樂按鈕
    }
  }
}

function keyReleased() {
  // 當放開 D 鍵時，停止奔跑狀態
  if (key === 'D' || key === 'd') {
    isDashing = false;
  }
  // 當放開 A 鍵時，停止奔跑狀態
  if (key === 'A' || key === 'a') {
    isDashing = false;
  }
}

function resetGame() {
  // 停止背景音樂
  if (bgm && bgm.isPlaying()) {
    bgm.stop();
  }
  // 停止腳步聲
  if (footstepSound && footstepSound.isPlaying()) {
    footstepSound.stop();
  }
  restartBtn.hide(); // 隱藏按鈕
  score = 20; // 重置為 20 分 (初始送分)
  bgX = 0;
  projectiles = [];
  ghosts = [];
  particles = []; // 清空粒子
  hintChances = 0; // 重置提示機會
  closeHelp(); // 關閉並隱藏幫助UI
  startQuizBtn.hide(); // 隱藏問答按鈕
  startBtn.show(); // 顯示開始按鈕
  musicToggleBtn.show(); // 確保音樂按鈕也顯示
  
  // 重置角色位置
  groundY = (height * 2 / 3) - (stopFrameHeight * charScale);
  playerX = (width - (stopFrameWidth * charScale)) / 2;
  playerY = groundY;
  
  // 重置 NPC 狀態與位置
  for (let i = 0; i < npcs.length; i++) {
    let npc = npcs[i];
    npc.x = width + 200 + (i * 800);
    npc.currentQ = 0;
    npc.hitTimer = 0; // 重置被擊中計時器
    npc.health = 3; // 重置血量
    npc.isCompleted = false;
  }
  
  gameState = 'START';
}
