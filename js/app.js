var App = (function () {
  // --- State ---
  var currentMode = 'arithmetic';
  var currentProblem = null;
  var settings = null;
  var answerRevealed = false;
  var hideTimeout = null;

  // Mult tables sequential state
  var multSequence = [];
  var multSeqIndex = 0;

  // --- DOM refs ---
  var screens = {};
  var els = {};

  function init() {
    // Cache screens
    screens.home = document.getElementById('screen-home');
    screens.settings = document.getElementById('screen-settings');
    screens.play = document.getElementById('screen-play');
    screens.summary = document.getElementById('screen-summary');

    // Cache elements
    els.settingsTitle = document.getElementById('settings-title');
    els.settingsArithmetic = document.getElementById('settings-arithmetic');
    els.settingsMultTables = document.getElementById('settings-multTables');
    els.settingsFractions = document.getElementById('settings-fractions');
    els.settingsDecimals = document.getElementById('settings-decimals');
    els.settingsPercentages = document.getElementById('settings-percentages');
    els.settingsTradeMath = document.getElementById('settings-tradeMath');
    els.settingsExamPrep = document.getElementById('settings-examPrep');
    els.tableGrid = document.getElementById('table-grid');

    els.problemText = document.getElementById('problem-text');
    els.answerInput = document.getElementById('answer-input');
    els.formatHint = document.getElementById('format-hint');
    els.timerContainer = document.getElementById('timer-container');
    els.timerBar = document.getElementById('timer-bar');
    els.timerText = document.getElementById('timer-text');
    els.actionButtons = document.getElementById('action-buttons');
    els.answerReveal = document.getElementById('answer-reveal');
    els.answerResult = document.getElementById('answer-result');
    els.correctAnswer = document.getElementById('correct-answer');
    els.btnTip = document.getElementById('btn-tip');
    els.tipPanel = document.getElementById('tip-panel');
    els.scoreCorrect = document.getElementById('score-correct');
    els.scoreIncorrect = document.getElementById('score-incorrect');
    els.scoreSkipped = document.getElementById('score-skipped');
    els.scorePct = document.getElementById('score-pct');
    els.scoreStreak = document.getElementById('score-streak');
    els.summaryContent = document.getElementById('summary-content');
    els.homeStats = document.getElementById('home-stats');

    // Build table grid
    buildTableGrid();

    // Load settings
    settings = Storage.getSettings();
    applySettingsToUI();
    updateHomeStats();

    // --- Event listeners ---

    // Mode cards
    var modeCards = document.querySelectorAll('.mode-card');
    for (var i = 0; i < modeCards.length; i++) {
      modeCards[i].addEventListener('click', function () {
        currentMode = this.getAttribute('data-mode');
        showScreen('settings');
        showSettingsForMode(currentMode);
      });
    }

    // Home tabs
    var homeTabs = document.querySelectorAll('.home-tab');
    for (var i = 0; i < homeTabs.length; i++) {
      homeTabs[i].addEventListener('click', function () {
        var targetId = this.getAttribute('data-tab');
        // Toggle tab buttons
        for (var j = 0; j < homeTabs.length; j++) {
          homeTabs[j].classList.remove('active');
        }
        this.classList.add('active');
        // Toggle tab content
        var allTabs = document.querySelectorAll('.tab-content');
        for (var j = 0; j < allTabs.length; j++) {
          allTabs[j].classList.remove('active');
        }
        document.getElementById(targetId).classList.add('active');
      });
    }

    // Reference accordion toggles
    var refToggles = document.querySelectorAll('.ref-toggle');
    for (var i = 0; i < refToggles.length; i++) {
      refToggles[i].addEventListener('click', function () {
        var targetId = this.getAttribute('data-ref');
        var section = document.getElementById(targetId);
        var isOpen = this.classList.contains('open');
        this.classList.toggle('open', !isOpen);
        section.classList.toggle('open', !isOpen);
      });
    }

    // Settings back
    document.getElementById('btn-settings-back').addEventListener('click', function () {
      showScreen('home');
    });

    // Start
    document.getElementById('btn-start').addEventListener('click', function () {
      saveSettingsFromUI();
      startSession();
    });

    // Submit
    document.getElementById('btn-submit').addEventListener('click', submitAnswer);

    // Show answer
    document.getElementById('btn-show-answer').addEventListener('click', function () {
      revealAnswer('skipped');
    });

    // Skip
    document.getElementById('btn-skip').addEventListener('click', function () {
      revealAnswer('skipped');
    });

    // Tip toggle
    document.getElementById('btn-tip').addEventListener('click', function () {
      els.tipPanel.style.display = els.tipPanel.style.display === 'none' ? '' : 'none';
      this.textContent = els.tipPanel.style.display === 'none' ? 'Show Tip' : 'Hide Tip';
    });

    // Next
    document.getElementById('btn-next').addEventListener('click', nextProblem);

    // End session
    document.getElementById('btn-end-session').addEventListener('click', endSession);

    // Summary buttons
    document.getElementById('btn-practice-again').addEventListener('click', function () {
      startSession();
    });
    document.getElementById('btn-change-settings').addEventListener('click', function () {
      showScreen('settings');
      showSettingsForMode(currentMode);
    });
    document.getElementById('btn-home').addEventListener('click', function () {
      showScreen('home');
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (screens.play.classList.contains('active')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (answerRevealed) {
            nextProblem();
          } else {
            submitAnswer();
          }
        }
      }
    });
  }

  // --- Screen management ---

  function showScreen(name) {
    for (var key in screens) {
      screens[key].classList.remove('active');
    }
    screens[name].classList.add('active');
  }

  // --- Settings UI ---

  function buildTableGrid() {
    var grid = els.tableGrid;
    grid.innerHTML = '';
    for (var i = 1; i <= 12; i++) {
      var label = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = i;
      cb.className = 'mult-table-cb';
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + i + 's'));
      grid.appendChild(label);
    }
  }

  function showSettingsForMode(mode) {
    var titles = {
      arithmetic: 'Arithmetic',
      multTables: 'Multiplication Tables',
      fractions: 'Fractions',
      decimals: 'Decimals',
      percentages: 'Percentages',
      tradeMath: 'Trade Math',
      examPrep: 'Exam Prep'
    };
    els.settingsTitle.textContent = titles[mode] || 'Settings';

    var allSettings = ['Arithmetic', 'MultTables', 'Fractions', 'Decimals', 'Percentages', 'TradeMath', 'ExamPrep'];
    for (var i = 0; i < allSettings.length; i++) {
      var el = els['settings' + allSettings[i]];
      if (el) el.style.display = 'none';
    }
    var modeMap = {
      arithmetic: 'Arithmetic', multTables: 'MultTables', fractions: 'Fractions',
      decimals: 'Decimals', percentages: 'Percentages', tradeMath: 'TradeMath', examPrep: 'ExamPrep'
    };
    var target = els['settings' + modeMap[mode]];
    if (target) target.style.display = '';
  }

  function applySettingsToUI() {
    // Arithmetic operations
    document.getElementById('op-addition').checked = settings.arithmetic.operations.addition;
    document.getElementById('op-subtraction').checked = settings.arithmetic.operations.subtraction;
    document.getElementById('op-multiplication').checked = settings.arithmetic.operations.multiplication;
    document.getElementById('op-division').checked = settings.arithmetic.operations.division;

    // Difficulty
    var diffRadios = document.querySelectorAll('input[name="difficulty"]');
    for (var i = 0; i < diffRadios.length; i++) {
      diffRadios[i].checked = diffRadios[i].value === settings.arithmetic.difficulty;
    }

    // Timer
    var timerRadios = document.querySelectorAll('input[name="timer"]');
    for (var i = 0; i < timerRadios.length; i++) {
      timerRadios[i].checked = parseInt(timerRadios[i].value) === settings.timerSeconds;
    }

    // Hide mode
    document.getElementById('hide-mode').checked = settings.hideMode;

    // Mult tables
    var tableCbs = document.querySelectorAll('.mult-table-cb');
    for (var i = 0; i < tableCbs.length; i++) {
      tableCbs[i].checked = settings.multTables.tables.indexOf(parseInt(tableCbs[i].value)) !== -1;
    }

    var multModeRadios = document.querySelectorAll('input[name="mult-mode"]');
    for (var i = 0; i < multModeRadios.length; i++) {
      multModeRadios[i].checked = multModeRadios[i].value === settings.multTables.mode;
    }

    // Trade difficulty
    var tradeRadios = document.querySelectorAll('input[name="trade-difficulty"]');
    for (var i = 0; i < tradeRadios.length; i++) {
      tradeRadios[i].checked = tradeRadios[i].value === settings.tradeMath.difficulty;
    }
  }

  function saveSettingsFromUI() {
    settings.mode = currentMode;

    settings.arithmetic.operations.addition = document.getElementById('op-addition').checked;
    settings.arithmetic.operations.subtraction = document.getElementById('op-subtraction').checked;
    settings.arithmetic.operations.multiplication = document.getElementById('op-multiplication').checked;
    settings.arithmetic.operations.division = document.getElementById('op-division').checked;

    var diffRadios = document.querySelectorAll('input[name="difficulty"]');
    for (var i = 0; i < diffRadios.length; i++) {
      if (diffRadios[i].checked) settings.arithmetic.difficulty = diffRadios[i].value;
    }

    var timerRadios = document.querySelectorAll('input[name="timer"]');
    for (var i = 0; i < timerRadios.length; i++) {
      if (timerRadios[i].checked) settings.timerSeconds = parseInt(timerRadios[i].value);
    }

    settings.hideMode = document.getElementById('hide-mode').checked;

    // Mult tables
    var tables = [];
    var tableCbs = document.querySelectorAll('.mult-table-cb');
    for (var i = 0; i < tableCbs.length; i++) {
      if (tableCbs[i].checked) tables.push(parseInt(tableCbs[i].value));
    }
    if (tables.length === 0) tables = [1, 2, 3, 4, 5];
    settings.multTables.tables = tables;

    var multModeRadios = document.querySelectorAll('input[name="mult-mode"]');
    for (var i = 0; i < multModeRadios.length; i++) {
      if (multModeRadios[i].checked) settings.multTables.mode = multModeRadios[i].value;
    }

    // Trade difficulty
    var tradeRadios = document.querySelectorAll('input[name="trade-difficulty"]');
    for (var i = 0; i < tradeRadios.length; i++) {
      if (tradeRadios[i].checked) settings.tradeMath.difficulty = tradeRadios[i].value;
    }

    Storage.saveSettings(settings);
  }

  // --- Session ---

  function startSession() {
    ScoreTracker.startSession();
    showScreen('play');
    updateScoreDisplay();

    // Set up mult sequence if needed
    if (currentMode === 'multTables' && settings.multTables.mode === 'sequential') {
      multSequence = [];
      var tables = settings.multTables.tables;
      for (var t = 0; t < tables.length; t++) {
        for (var i = 1; i <= 12; i++) {
          multSequence.push({ a: tables[t], b: i });
        }
      }
      multSeqIndex = 0;
    }

    nextProblem();
  }

  function nextProblem() {
    answerRevealed = false;
    clearTimeout(hideTimeout);

    // Reset UI
    els.answerInput.value = '';
    els.answerInput.className = 'answer-input';
    els.answerInput.disabled = false;
    els.actionButtons.style.display = '';
    els.answerReveal.style.display = 'none';
    els.timerBar.style.width = '100%';
    els.timerBar.className = 'timer-bar';

    // Generate problem based on mode
    switch (currentMode) {
      case 'arithmetic':
        currentProblem = ProblemGenerator.generate(
          settings.arithmetic.operations,
          settings.arithmetic.difficulty
        );
        els.formatHint.textContent = 'Enter: 5, 3.75, 3/4, or 1 3/4';
        break;

      case 'multTables':
        if (settings.multTables.mode === 'sequential') {
          if (multSeqIndex >= multSequence.length) {
            endSession();
            return;
          }
          var pair = multSequence[multSeqIndex];
          currentProblem = ProblemGenerator.generateMultTable(pair.a, pair.b);
          multSeqIndex++;
        } else {
          var tables = settings.multTables.tables;
          var a = tables[Math.floor(Math.random() * tables.length)];
          var b = Math.floor(Math.random() * 12) + 1;
          currentProblem = ProblemGenerator.generateMultTable(a, b);
        }
        els.formatHint.textContent = 'Enter the product';
        break;

      case 'fractions':
        currentProblem = generateFractionProblem();
        els.formatHint.textContent = 'Enter: 3/4 or 1 3/4';
        break;

      case 'decimals':
        currentProblem = generateDecimalProblem();
        els.formatHint.textContent = currentProblem.formatHint || 'Enter: 0.75 or 3/4';
        break;

      case 'percentages':
        currentProblem = generatePercentageProblem();
        els.formatHint.textContent = currentProblem.formatHint || 'Enter your answer';
        break;

      case 'tradeMath':
        currentProblem = generateTradeProblem();
        els.formatHint.textContent = currentProblem.formatHint || 'Enter: 42, 3/4, or 1 3/4';
        break;

      case 'examPrep':
        // Placeholder until exam problems are built
        currentProblem = ProblemGenerator.generate(
          { addition: true, subtraction: true, multiplication: true, division: true },
          'medium'
        );
        els.formatHint.textContent = 'Enter your answer';
        break;
    }

    // Display problem
    els.problemText.textContent = currentProblem.displayQuestion;
    els.problemText.classList.remove('hidden-problem');

    // Set up tip button
    var tip = getTipForProblem(currentProblem);
    if (tip) {
      els.tipPanel.innerHTML = Tips.renderTip(tip);
      els.tipPanel.style.display = 'none';
      els.btnTip.style.display = '';
      els.btnTip.textContent = 'Show Tip';
    } else {
      els.tipPanel.style.display = 'none';
      els.btnTip.style.display = 'none';
    }

    // Hide mode
    if (settings.hideMode) {
      hideTimeout = setTimeout(function () {
        if (!answerRevealed) {
          els.problemText.textContent = '? ? ?';
          els.problemText.classList.add('hidden-problem');
        }
      }, 3000);
    }

    // Timer
    if (settings.timerSeconds > 0) {
      els.timerContainer.classList.remove('hidden');
      Timer.start(settings.timerSeconds, function (secondsLeft, fraction) {
        els.timerBar.style.width = (fraction * 100) + '%';
        els.timerText.textContent = secondsLeft.toFixed(1) + 's';

        els.timerBar.className = 'timer-bar';
        if (fraction <= 0.25) {
          els.timerBar.classList.add('danger');
        } else if (fraction <= 0.5) {
          els.timerBar.classList.add('warning');
        }
      }, function () {
        revealAnswer('timeout');
      });
    } else {
      els.timerContainer.classList.add('hidden');
    }

    // Focus input
    els.answerInput.focus();
  }

  function submitAnswer() {
    if (answerRevealed) return;

    var raw = els.answerInput.value.trim();
    if (!raw) return;

    var parsed = InputParser.parse(raw);
    if (!parsed) {
      els.answerInput.className = 'answer-input incorrect';
      setTimeout(function () { els.answerInput.className = 'answer-input'; }, 400);
      return;
    }

    var correct = InputParser.compare(parsed, currentProblem.answer);

    // Also check decimal comparison for decimal/percentage problems
    if (!correct && currentProblem.answerDecimal !== undefined) {
      correct = InputParser.compareDecimal(parsed, currentProblem.answerDecimal);
    }

    // For approximate answers (repeating decimals like 1/3 = 0.333)
    if (!correct && currentProblem.approx && currentProblem.answerDecimal !== undefined) {
      var userVal = parsed.whole + parsed.num / parsed.den;
      correct = Math.abs(userVal - currentProblem.answerDecimal) < 0.01;
    }

    if (correct) {
      els.answerInput.className = 'answer-input correct';
      ScoreTracker.recordCorrect(currentProblem, Timer.getRemaining());
      if (currentMode === 'multTables') {
        ScoreTracker.recordMultFact(
          currentProblem.operand1.whole,
          currentProblem.operand2.whole,
          true
        );
      }
      revealAnswer('correct');
    } else {
      els.answerInput.className = 'answer-input incorrect';
      ScoreTracker.recordIncorrect(currentProblem);
      if (currentMode === 'multTables') {
        ScoreTracker.recordMultFact(
          currentProblem.operand1.whole,
          currentProblem.operand2.whole,
          false
        );
      }
      revealAnswer('incorrect');
    }
  }

  function revealAnswer(reason) {
    if (answerRevealed) return;
    answerRevealed = true;
    clearTimeout(hideTimeout);
    Timer.stop();

    els.answerInput.disabled = true;
    els.actionButtons.style.display = 'none';
    els.answerReveal.style.display = '';

    // Restore problem text if hidden
    els.problemText.textContent = currentProblem.displayQuestion;
    els.problemText.classList.remove('hidden-problem');

    // Result text
    if (reason === 'correct') {
      els.answerResult.textContent = 'Correct!';
      els.answerResult.className = 'answer-result correct';
    } else if (reason === 'incorrect') {
      els.answerResult.textContent = 'Incorrect';
      els.answerResult.className = 'answer-result incorrect';
    } else if (reason === 'timeout') {
      els.answerResult.textContent = 'Time\'s up!';
      els.answerResult.className = 'answer-result skipped';
      ScoreTracker.recordSkipped(currentProblem);
    } else {
      els.answerResult.textContent = 'Skipped';
      els.answerResult.className = 'answer-result skipped';
      ScoreTracker.recordSkipped(currentProblem);
    }

    els.correctAnswer.textContent = 'Answer: ' + currentProblem.displayAnswer;

    // Show worked solution
    var solutionSteps = Solutions.solve(currentProblem, currentMode);
    document.getElementById('solution-panel').innerHTML = Solutions.render(solutionSteps);

    updateScoreDisplay();
  }

  function getTipForProblem(problem) {
    if (currentMode === 'multTables') {
      var factors = [problem.operand1.whole, problem.operand2.whole];
      for (var i = 0; i < factors.length; i++) {
        var tip = Tips.getMultTip(factors[i]);
        if (tip) return tip;
      }
      return null;
    }

    if (currentMode === 'tradeMath' && problem.tipType) {
      return Tips.getTradeTip(problem.tipType);
    }

    // Use tipKey if the problem specifies one directly
    if (problem.tipKey) {
      return Tips.getByKey(problem.tipKey);
    }

    if (problem.operatorName && problem.numberType) {
      return Tips.get(problem.operatorName, problem.numberType);
    }

    return null;
  }

  function endSession() {
    Timer.stop();
    clearTimeout(hideTimeout);

    ScoreTracker.persist(currentMode);
    var summary = ScoreTracker.getSessionSummary();

    showScreen('summary');
    renderSummary(summary);
    updateHomeStats();
  }

  // --- Score display ---

  function updateScoreDisplay() {
    var s = ScoreTracker.getSession();
    if (!s) return;
    els.scoreCorrect.textContent = s.correct;
    els.scoreIncorrect.textContent = s.incorrect;
    els.scoreSkipped.textContent = s.skipped;
    els.scoreStreak.textContent = s.streak;

    var total = s.correct + s.incorrect + s.skipped;
    if (total > 0) {
      els.scorePct.textContent = Math.round((s.correct / total) * 100) + '%';
    } else {
      els.scorePct.textContent = '--%';
    }
  }

  function updateHomeStats() {
    var stats = Storage.getStats();
    var lt = stats.lifetime;
    if (lt.totalProblems > 0) {
      var pct = Math.round((lt.correct / lt.totalProblems) * 100);
      els.homeStats.textContent = 'Lifetime: ' + lt.totalProblems + ' problems | ' + pct + '% accuracy | Best streak: ' + lt.bestStreak;
    } else {
      els.homeStats.textContent = '';
    }
  }

  // --- Summary ---

  function renderSummary(summary) {
    var html = '';

    html += '<div class="summary-stat"><span class="summary-stat-label">Problems</span><span class="summary-stat-value">' + summary.total + '</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Correct</span><span class="summary-stat-value" style="color:var(--green)">' + summary.correct + ' (' + summary.accuracy + '%)</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Incorrect</span><span class="summary-stat-value" style="color:var(--red)">' + summary.incorrect + '</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Skipped</span><span class="summary-stat-value">' + summary.skipped + '</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Best Streak</span><span class="summary-stat-value">' + summary.streak + '</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Duration</span><span class="summary-stat-value">' + formatDuration(summary.duration) + '</span></div>';
    html += '<div class="summary-stat"><span class="summary-stat-label">Avg Time</span><span class="summary-stat-value">' + summary.avgTime + 's</span></div>';

    // Weak multiplication facts
    if (currentMode === 'multTables') {
      var weak = ScoreTracker.getWeakFacts();
      if (weak.length > 0) {
        html += '<div class="summary-section-title">Needs Practice</div>';
        for (var i = 0; i < weak.length; i++) {
          var parts = weak[i].key.split('x');
          html += '<div class="summary-stat"><span class="summary-stat-label">' + parts[0] + ' x ' + parts[1] + '</span><span class="summary-stat-value" style="color:var(--orange)">' + weak[i].pct + '% (' + weak[i].correct + '/' + weak[i].attempts + ')</span></div>';
        }
      }
    }

    els.summaryContent.innerHTML = html;
  }

  function formatDuration(seconds) {
    if (seconds < 60) return seconds + 's';
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return min + 'm ' + sec + 's';
  }

  // --- Fractions Problem Generation ---

  function generateFractionProblem() {
    var ops = {
      addition: document.getElementById('frac-op-addition').checked,
      subtraction: document.getElementById('frac-op-subtraction').checked,
      multiplication: document.getElementById('frac-op-multiplication').checked,
      division: document.getElementById('frac-op-division').checked
    };
    var allowProper = document.getElementById('frac-type-proper').checked;
    var allowMixed = document.getElementById('frac-type-mixed').checked;
    if (!allowProper && !allowMixed) allowProper = true;

    var diffRadios = document.querySelectorAll('input[name="frac-difficulty"]');
    var difficulty = 'easy';
    for (var i = 0; i < diffRadios.length; i++) {
      if (diffRadios[i].checked) difficulty = diffRadios[i].value;
    }

    // Force fraction/mixed number types only
    var numType;
    if (allowProper && allowMixed) {
      numType = Math.random() < 0.5 ? 'fraction' : 'mixed';
    } else if (allowMixed) {
      numType = 'mixed';
    } else {
      numType = 'fraction';
    }

    // Generate using the core generator but override number type weights
    var config = {
      easy: { fractionDens: [2, 3, 4, 5], allowNegative: false, allowMixed: allowMixed, wholeRange: [1, 6] },
      medium: { fractionDens: [2, 3, 4, 5, 6, 8, 10], allowNegative: false, allowMixed: allowMixed, wholeRange: [1, 12] },
      hard: { fractionDens: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16], allowNegative: true, allowMixed: allowMixed, wholeRange: [1, 20] }
    };

    // Use the core generator with forced fraction type
    var weights = {};
    weights[numType] = 100;
    var overrideConfig = config[difficulty];
    overrideConfig.numberTypeWeights = weights;
    overrideConfig.decimalPlaces = 1;
    overrideConfig.divisionExact = true;

    var problem = ProblemGenerator.generate(ops, difficulty);
    // Force the number type
    if (numType === 'fraction') {
      problem = ProblemGenerator.generate(ops, difficulty);
      // Regenerate until we get the right type (simple approach)
      // Better: directly call the fraction/mixed generators
    }

    // Direct generation for more control
    var enabledOps = [];
    var OPERATOR_MAP = { addition: '+', subtraction: '\u2212', multiplication: '\u00d7', division: '\u00f7' };
    for (var op in ops) {
      if (ops[op]) enabledOps.push(OPERATOR_MAP[op]);
    }
    if (enabledOps.length === 0) enabledOps = ['+'];
    var operator = enabledOps[Math.floor(Math.random() * enabledOps.length)];

    var dens = config[difficulty].fractionDens;
    var pick = function(arr) { return arr[Math.floor(Math.random() * arr.length)]; };

    if (numType === 'mixed') {
      var maxW = config[difficulty].wholeRange[1];
      var w1 = Math.floor(Math.random() * maxW) + 1;
      var d1 = pick(dens);
      var n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      var w2 = Math.floor(Math.random() * maxW) + 1;
      var d2 = pick(dens);
      var n2 = Math.floor(Math.random() * (d2 - 1)) + 1;

      var aFrac = ProblemGenerator.toImproper(w1, n1, d1);
      var bFrac = ProblemGenerator.toImproper(w2, n2, d2);

      if (operator === '\u2212' && !config[difficulty].allowNegative) {
        if (aFrac.num / aFrac.den < bFrac.num / bFrac.den) {
          var tmp = aFrac; aFrac = bFrac; bFrac = tmp;
          var tw = w1; w1 = w2; w2 = tw;
          var tn = n1; n1 = n2; n2 = tn;
          var td = d1; d1 = d2; d2 = td;
        }
      }

      var result;
      switch (operator) {
        case '+': result = ProblemGenerator.fracAdd(aFrac, bFrac); break;
        case '\u2212': result = ProblemGenerator.fracSub(aFrac, bFrac); break;
        case '\u00d7': result = ProblemGenerator.fracMul(aFrac, bFrac); break;
        case '\u00f7': result = ProblemGenerator.fracDiv(aFrac, bFrac); break;
      }
      result = ProblemGenerator.reduce(result.num, result.den);
      var mixed = ProblemGenerator.toMixed(result.num, result.den);

      var displayAnswer;
      if (mixed.num === 0) displayAnswer = '' + mixed.whole;
      else if (mixed.whole === 0) displayAnswer = result.num + '/' + result.den;
      else displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den;

      var ar = ProblemGenerator.reduce(n1, d1);
      var br = ProblemGenerator.reduce(n2, d2);

      return {
        operand1: aFrac, operand2: bFrac,
        answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
        answerFrac: result, numberType: 'mixed', operator: operator,
        operatorName: { '+': 'addition', '\u2212': 'subtraction', '\u00d7': 'multiplication', '\u00f7': 'division' }[operator],
        displayQuestion: w1 + ' ' + ar.num + '/' + ar.den + ' ' + operator + ' ' + w2 + ' ' + br.num + '/' + br.den,
        displayAnswer: displayAnswer
      };
    } else {
      var d1 = pick(dens);
      var d2 = pick(dens);
      var n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
      var n2 = Math.floor(Math.random() * (d2 - 1)) + 1;

      var aFrac = ProblemGenerator.reduce(n1, d1);
      var bFrac = ProblemGenerator.reduce(n2, d2);

      if (operator === '\u2212' && !config[difficulty].allowNegative) {
        if (aFrac.num / aFrac.den < bFrac.num / bFrac.den) {
          var tmp = aFrac; aFrac = bFrac; bFrac = tmp;
        }
      }

      var result;
      switch (operator) {
        case '+': result = ProblemGenerator.fracAdd(aFrac, bFrac); break;
        case '\u2212': result = ProblemGenerator.fracSub(aFrac, bFrac); break;
        case '\u00d7': result = ProblemGenerator.fracMul(aFrac, bFrac); break;
        case '\u00f7': result = ProblemGenerator.fracDiv(aFrac, bFrac); break;
      }
      result = ProblemGenerator.reduce(result.num, result.den);
      var mixed = ProblemGenerator.toMixed(result.num, result.den);

      var displayAnswer;
      if (mixed.num === 0) displayAnswer = '' + mixed.whole;
      else if (mixed.whole === 0) displayAnswer = result.num + '/' + result.den;
      else displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den;

      return {
        operand1: aFrac, operand2: bFrac,
        answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
        answerFrac: result, numberType: 'fraction', operator: operator,
        operatorName: { '+': 'addition', '\u2212': 'subtraction', '\u00d7': 'multiplication', '\u00f7': 'division' }[operator],
        displayQuestion: aFrac.num + '/' + aFrac.den + ' ' + operator + ' ' + bFrac.num + '/' + bFrac.den,
        displayAnswer: displayAnswer
      };
    }
  }

  // --- Decimals Problem Generation ---

  function generateDecimalProblem() {
    var doArith = document.getElementById('dec-type-arithmetic').checked;
    var doToFrac = document.getElementById('dec-type-to-fraction').checked;
    var doFromFrac = document.getElementById('dec-type-from-fraction').checked;
    if (!doArith && !doToFrac && !doFromFrac) doArith = true;

    var diffRadios = document.querySelectorAll('input[name="dec-difficulty"]');
    var difficulty = 'easy';
    for (var i = 0; i < diffRadios.length; i++) {
      if (diffRadios[i].checked) difficulty = diffRadios[i].value;
    }

    var types = [];
    if (doArith) types.push('arithmetic');
    if (doToFrac) types.push('to-fraction');
    if (doFromFrac) types.push('from-fraction');
    var type = types[Math.floor(Math.random() * types.length)];

    // Common fractions for conversion
    var conversionPairs = {
      easy: [
        { dec: 0.5, frac: '1/2', num: 1, den: 2 },
        { dec: 0.25, frac: '1/4', num: 1, den: 4 },
        { dec: 0.75, frac: '3/4', num: 3, den: 4 },
        { dec: 0.2, frac: '1/5', num: 1, den: 5 },
        { dec: 0.4, frac: '2/5', num: 2, den: 5 },
        { dec: 0.1, frac: '1/10', num: 1, den: 10 }
      ],
      medium: [
        { dec: 0.125, frac: '1/8', num: 1, den: 8 },
        { dec: 0.375, frac: '3/8', num: 3, den: 8 },
        { dec: 0.625, frac: '5/8', num: 5, den: 8 },
        { dec: 0.875, frac: '7/8', num: 7, den: 8 },
        { dec: 0.333, frac: '1/3', num: 1, den: 3, approx: true },
        { dec: 0.667, frac: '2/3', num: 2, den: 3, approx: true },
        { dec: 0.6, frac: '3/5', num: 3, den: 5 },
        { dec: 0.8, frac: '4/5', num: 4, den: 5 }
      ],
      hard: [
        { dec: 0.0625, frac: '1/16', num: 1, den: 16 },
        { dec: 0.1875, frac: '3/16', num: 3, den: 16 },
        { dec: 0.3125, frac: '5/16', num: 5, den: 16 },
        { dec: 0.4375, frac: '7/16', num: 7, den: 16 },
        { dec: 0.5625, frac: '9/16', num: 9, den: 16 },
        { dec: 0.6875, frac: '11/16', num: 11, den: 16 },
        { dec: 0.8125, frac: '13/16', num: 13, den: 16 },
        { dec: 0.9375, frac: '15/16', num: 15, den: 16 },
        { dec: 0.167, frac: '1/6', num: 1, den: 6, approx: true },
        { dec: 0.833, frac: '5/6', num: 5, den: 6, approx: true }
      ]
    };

    // Include easier pairs in harder difficulties
    var allPairs = conversionPairs.easy.slice();
    if (difficulty === 'medium' || difficulty === 'hard') allPairs = allPairs.concat(conversionPairs.medium);
    if (difficulty === 'hard') allPairs = allPairs.concat(conversionPairs.hard);

    switch (type) {
      case 'to-fraction': {
        var pair = allPairs[Math.floor(Math.random() * allPairs.length)];
        return {
          displayQuestion: pair.dec + ' = what fraction?',
          answer: { whole: 0, num: pair.num, den: pair.den },
          answerFrac: { num: pair.num, den: pair.den },
          displayAnswer: pair.frac,
          numberType: 'fraction',
          operatorName: 'conversion',
          tipKey: 'dec-to-fraction',
          formatHint: 'Enter a fraction (e.g., 3/4)'
        };
      }

      case 'from-fraction': {
        var pair = allPairs[Math.floor(Math.random() * allPairs.length)];
        return {
          displayQuestion: pair.frac + ' = what decimal?',
          answer: { whole: 0, num: Math.round(pair.dec * 10000), den: 10000 },
          answerDecimal: pair.dec,
          displayAnswer: '' + pair.dec,
          numberType: 'decimal',
          operatorName: 'conversion',
          tipKey: 'dec-from-fraction',
          formatHint: 'Enter a decimal (e.g., 0.75)',
          approx: pair.approx || false
        };
      }

      case 'arithmetic': {
        // Generate a decimal arithmetic problem
        var problem = ProblemGenerator.generate(
          { addition: true, subtraction: true, multiplication: true, division: true },
          difficulty
        );
        problem.tipKey = 'dec-arithmetic';
        return problem;
      }
    }
  }

  // --- Percentages Problem Generation ---

  function generatePercentageProblem() {
    var doOf = document.getElementById('pct-type-of').checked;
    var doIs = document.getElementById('pct-type-is').checked;
    var doToDec = document.getElementById('pct-type-to-decimal').checked;
    var doToFrac = document.getElementById('pct-type-to-fraction').checked;
    if (!doOf && !doIs && !doToDec && !doToFrac) doOf = true;

    var diffRadios = document.querySelectorAll('input[name="pct-difficulty"]');
    var difficulty = 'easy';
    for (var i = 0; i < diffRadios.length; i++) {
      if (diffRadios[i].checked) difficulty = diffRadios[i].value;
    }

    var types = [];
    if (doOf) types.push('of');
    if (doIs) types.push('is');
    if (doToDec) types.push('to-decimal');
    if (doToFrac) types.push('to-fraction');
    var type = types[Math.floor(Math.random() * types.length)];

    var randInt = function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };

    switch (type) {
      case 'of': {
        // X% of Y = ?
        var pcts = {
          easy: [10, 20, 25, 50, 75, 100],
          medium: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75],
          hard: [7, 12, 15, 22, 33, 35, 43, 55, 65, 72, 85]
        };
        var pct = pcts[difficulty][Math.floor(Math.random() * pcts[difficulty].length)];
        var maxVal = { easy: 100, medium: 500, hard: 5000 };
        var value = randInt(10, maxVal[difficulty]);
        // Make value divisible by common factors for clean answers on easy
        if (difficulty === 'easy') {
          value = Math.round(value / 4) * 4;
          if (value === 0) value = 4;
        }
        var answer = value * pct / 100;
        var answerRounded = Math.round(answer * 100) / 100;

        return {
          displayQuestion: pct + '% of ' + value + ' = ?',
          answer: { whole: 0, num: Math.round(answerRounded * 100), den: 100 },
          answerDecimal: answerRounded,
          displayAnswer: '' + answerRounded,
          numberType: 'decimal',
          operatorName: 'percentage',
          tipKey: 'pct-of',
          formatHint: 'Enter the number (e.g., 45 or 12.5)'
        };
      }

      case 'is': {
        // X is what % of Y?
        var whole = { easy: randInt(10, 100), medium: randInt(20, 500), hard: randInt(50, 2000) }[difficulty];
        var pctAnswer = { easy: [10, 20, 25, 50, 75], medium: [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80], hard: [7, 12, 17, 23, 33, 43, 55, 68, 72, 88] };
        var pct = pctAnswer[difficulty][Math.floor(Math.random() * pctAnswer[difficulty].length)];
        var part = whole * pct / 100;

        return {
          displayQuestion: Math.round(part) + ' is what % of ' + whole + '?',
          answer: { whole: pct, num: 0, den: 1 },
          answerDecimal: pct,
          displayAnswer: pct + '%',
          numberType: 'whole',
          operatorName: 'percentage',
          tipKey: 'pct-is',
          formatHint: 'Enter the percentage (e.g., 25)'
        };
      }

      case 'to-decimal': {
        var pcts = {
          easy: [10, 20, 25, 50, 75, 100],
          medium: [5, 12, 15, 30, 35, 45, 55, 60, 80, 90],
          hard: [2.5, 5.5, 7.5, 12.5, 33.3, 37.5, 62.5, 87.5, 125, 150]
        };
        var pct = pcts[difficulty][Math.floor(Math.random() * pcts[difficulty].length)];
        var dec = pct / 100;

        return {
          displayQuestion: pct + '% = what decimal?',
          answer: { whole: 0, num: Math.round(dec * 10000), den: 10000 },
          answerDecimal: dec,
          displayAnswer: '' + dec,
          numberType: 'decimal',
          operatorName: 'conversion',
          tipKey: 'pct-to-decimal',
          formatHint: 'Enter the decimal (e.g., 0.25)'
        };
      }

      case 'to-fraction': {
        var pairs = [
          { pct: 25, frac: '1/4', num: 1, den: 4 },
          { pct: 50, frac: '1/2', num: 1, den: 2 },
          { pct: 75, frac: '3/4', num: 3, den: 4 },
          { pct: 20, frac: '1/5', num: 1, den: 5 },
          { pct: 40, frac: '2/5', num: 2, den: 5 },
          { pct: 60, frac: '3/5', num: 3, den: 5 },
          { pct: 80, frac: '4/5', num: 4, den: 5 },
          { pct: 10, frac: '1/10', num: 1, den: 10 },
          { pct: 30, frac: '3/10', num: 3, den: 10 },
          { pct: 12.5, frac: '1/8', num: 1, den: 8 },
          { pct: 37.5, frac: '3/8', num: 3, den: 8 },
          { pct: 62.5, frac: '5/8', num: 5, den: 8 },
          { pct: 87.5, frac: '7/8', num: 7, den: 8 }
        ];
        var available = difficulty === 'easy' ? pairs.slice(0, 5) :
                        difficulty === 'medium' ? pairs.slice(0, 9) : pairs;
        var pair = available[Math.floor(Math.random() * available.length)];

        return {
          displayQuestion: pair.pct + '% = what fraction?',
          answer: { whole: 0, num: pair.num, den: pair.den },
          answerFrac: { num: pair.num, den: pair.den },
          displayAnswer: pair.frac,
          numberType: 'fraction',
          operatorName: 'conversion',
          tipKey: 'pct-to-fraction',
          formatHint: 'Enter a fraction (e.g., 3/4)'
        };
      }
    }
  }

  // --- Trade Math Problem Generation ---

  function generateTradeProblem() {
    var difficulty = settings.tradeMath.difficulty;
    var types = ['feet-to-inches', 'inches-to-feet', 'fraction-add', 'fraction-sub', 'mixed-measure-add'];
    var type = types[Math.floor(Math.random() * types.length)];

    var tradeDens = { easy: [2, 4], medium: [2, 4, 8], hard: [2, 4, 8, 16] };
    var dens = tradeDens[difficulty] || [2, 4];
    var maxFeet = { easy: 10, medium: 25, hard: 100 };
    var mf = maxFeet[difficulty] || 10;

    switch (type) {
      case 'feet-to-inches': {
        var feet = Math.floor(Math.random() * mf) + 1;
        var inches = Math.floor(Math.random() * 12);
        var totalInches = feet * 12 + inches;
        var q = inches > 0
          ? 'How many inches in ' + feet + "'" + '-' + inches + '"?'
          : 'How many inches in ' + feet + "'?";
        var sol = [q];
        sol.push('  ' + feet + ' feet × 12 inches/foot = ' + (feet * 12) + '"');
        if (inches > 0) {
          sol.push('  ' + (feet * 12) + '" + ' + inches + '" = ' + totalInches + '"');
        }
        sol.push('= ' + totalInches + '"');
        return {
          displayQuestion: q,
          answer: { whole: totalInches, num: 0, den: 1 },
          displayAnswer: totalInches + '"',
          numberType: 'whole',
          operatorName: 'multiplication',
          tipType: 'feet-inches',
          formatHint: 'Enter total inches (e.g., 42)',
          solution: sol
        };
      }

      case 'inches-to-feet': {
        var feet = Math.floor(Math.random() * mf) + 1;
        var inches = Math.floor(Math.random() * 12);
        var totalInches = feet * 12 + inches;
        var sol = [totalInches + '" = ? feet and inches'];
        sol.push('  Divide by 12: ' + totalInches + ' ÷ 12 = ' + feet + ' remainder ' + inches);
        sol.push('  ' + feet + ' feet and ' + inches + ' inches');
        sol.push('= ' + feet + "'-" + inches + '"');
        return {
          displayQuestion: totalInches + '" = ? feet and inches',
          answer: { whole: feet * 12 + inches, num: 0, den: 1 },
          displayAnswer: feet + "'" + '-' + inches + '"',
          numberType: 'whole',
          operatorName: 'division',
          tipType: 'feet-inches',
          formatHint: "Enter as feet'inches\" (e.g., 3'6\")",
          solution: sol,
          customCompare: function (userRaw) {
            var match = userRaw.match(/^(\d+)[']\s*-?\s*(\d+)\s*[""]?$/);
            if (match) {
              return parseInt(match[1]) === feet && parseInt(match[2]) === inches;
            }
            var num = parseInt(userRaw);
            return num === totalInches;
          }
        };
      }

      case 'fraction-add': {
        var den1 = dens[Math.floor(Math.random() * dens.length)];
        var den2 = dens[Math.floor(Math.random() * dens.length)];
        var num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
        var num2 = Math.floor(Math.random() * (den2 - 1)) + 1;

        var a = ProblemGenerator.reduce(num1, den1);
        var b = ProblemGenerator.reduce(num2, den2);
        var result = ProblemGenerator.fracAdd(a, b);
        result = ProblemGenerator.reduce(result.num, result.den);
        var mixed = ProblemGenerator.toMixed(result.num, result.den);

        var displayAnswer;
        if (mixed.num === 0) displayAnswer = mixed.whole + '"';
        else if (mixed.whole === 0) displayAnswer = result.num + '/' + result.den + '"';
        else displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den + '"';

        // Build solution
        var displayQ = a.num + '/' + a.den + '" + ' + b.num + '/' + b.den + '"';
        var sol = [displayQ];
        if (a.den === b.den) {
          sol.push('Same denominator: ' + a.den);
          sol.push('  Add numerators: ' + a.num + ' + ' + b.num + ' = ' + (a.num + b.num));
          sol.push('  Result: ' + (a.num + b.num) + '/' + a.den);
        } else {
          sol.push('Butterfly method:');
          sol.push('  Cross-multiply: ' + a.num + ' × ' + b.den + ' = ' + (a.num * b.den));
          sol.push('  Cross-multiply: ' + b.num + ' × ' + a.den + ' = ' + (b.num * a.den));
          sol.push('  Add cross products: ' + (a.num * b.den) + ' + ' + (b.num * a.den) + ' = ' + (a.num * b.den + b.num * a.den));
          sol.push('  Multiply denominators: ' + a.den + ' × ' + b.den + ' = ' + (a.den * b.den));
          sol.push('  Result: ' + (a.num * b.den + b.num * a.den) + '/' + (a.den * b.den));
        }
        if (mixed.whole > 0 && mixed.num > 0) {
          sol.push('Convert to mixed number: ' + mixed.whole + ' ' + mixed.num + '/' + mixed.den);
        }
        sol.push('= ' + displayAnswer);

        return {
          displayQuestion: displayQ,
          answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
          answerFrac: result,
          displayAnswer: displayAnswer,
          numberType: 'fraction',
          operator: '+',
          operatorName: 'addition',
          tipType: 'fraction-add',
          formatHint: 'Enter: 3/4, 1 3/8, etc.',
          solution: sol
        };
      }

      case 'fraction-sub': {
        var den1 = dens[Math.floor(Math.random() * dens.length)];
        var den2 = dens[Math.floor(Math.random() * dens.length)];
        var num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
        var num2 = Math.floor(Math.random() * (den2 - 1)) + 1;

        var a = ProblemGenerator.reduce(num1, den1);
        var b = ProblemGenerator.reduce(num2, den2);

        // Ensure a >= b
        if (a.num / a.den < b.num / b.den) { var tmp = a; a = b; b = tmp; }

        var result = ProblemGenerator.fracSub(a, b);
        result = ProblemGenerator.reduce(result.num, result.den);
        var mixed = ProblemGenerator.toMixed(result.num, result.den);

        var displayAnswer;
        if (mixed.num === 0) displayAnswer = mixed.whole + '"';
        else if (mixed.whole === 0) displayAnswer = result.num + '/' + result.den + '"';
        else displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den + '"';

        // Build solution
        var displayQ = a.num + '/' + a.den + '" - ' + b.num + '/' + b.den + '"';
        var sol = [displayQ];
        if (a.den === b.den) {
          sol.push('Same denominator: ' + a.den);
          sol.push('  Subtract numerators: ' + a.num + ' - ' + b.num + ' = ' + (a.num - b.num));
          sol.push('  Result: ' + (a.num - b.num) + '/' + a.den);
        } else {
          sol.push('Butterfly method:');
          sol.push('  Cross-multiply: ' + a.num + ' × ' + b.den + ' = ' + (a.num * b.den));
          sol.push('  Cross-multiply: ' + b.num + ' × ' + a.den + ' = ' + (b.num * a.den));
          sol.push('  Subtract cross products: ' + (a.num * b.den) + ' - ' + (b.num * a.den) + ' = ' + (a.num * b.den - b.num * a.den));
          sol.push('  Multiply denominators: ' + a.den + ' × ' + b.den + ' = ' + (a.den * b.den));
          sol.push('  Result: ' + (a.num * b.den - b.num * a.den) + '/' + (a.den * b.den));
        }
        sol.push('= ' + displayAnswer);

        return {
          displayQuestion: displayQ,
          answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
          answerFrac: result,
          displayAnswer: displayAnswer,
          numberType: 'fraction',
          operator: '−',
          operatorName: 'subtraction',
          tipType: 'fraction-add',
          formatHint: 'Enter: 3/4, 1 3/8, etc.',
          solution: sol
        };
      }

      case 'mixed-measure-add': {
        var feet1 = Math.floor(Math.random() * Math.min(mf, 20)) + 1;
        var inches1 = Math.floor(Math.random() * 12);
        var den1 = dens[Math.floor(Math.random() * dens.length)];
        var frac1num = Math.floor(Math.random() * den1);

        var feet2 = Math.floor(Math.random() * Math.min(mf, 20)) + 1;
        var inches2 = Math.floor(Math.random() * 12);
        var den2 = dens[Math.floor(Math.random() * dens.length)];
        var frac2num = Math.floor(Math.random() * den2);

        // Total in inches as fraction
        var total1 = ProblemGenerator.fracAdd(
          { num: feet1 * 12 + inches1, den: 1 },
          ProblemGenerator.reduce(frac1num, den1)
        );
        var total2 = ProblemGenerator.fracAdd(
          { num: feet2 * 12 + inches2, den: 1 },
          ProblemGenerator.reduce(frac2num, den2)
        );
        var totalResult = ProblemGenerator.fracAdd(total1, total2);
        totalResult = ProblemGenerator.reduce(totalResult.num, totalResult.den);

        // Convert to feet-inches-fraction
        var totalMixed = ProblemGenerator.toMixed(totalResult.num, totalResult.den);
        var totalWholeInches = totalMixed.whole;
        var resFeet = Math.floor(totalWholeInches / 12);
        var resInches = totalWholeInches % 12;

        var displayAnswer = resFeet + "'" + '-' + resInches;
        if (totalMixed.num > 0) {
          displayAnswer += ' ' + totalMixed.num + '/' + totalMixed.den;
        }
        displayAnswer += '"';

        var q1 = feet1 + "'" + '-' + inches1;
        if (frac1num > 0) { var r1 = ProblemGenerator.reduce(frac1num, den1); q1 += ' ' + r1.num + '/' + r1.den; }
        q1 += '"';
        var q2 = feet2 + "'" + '-' + inches2;
        if (frac2num > 0) { var r2 = ProblemGenerator.reduce(frac2num, den2); q2 += ' ' + r2.num + '/' + r2.den; }
        q2 += '"';

        // Build solution
        var sol = [q1 + ' + ' + q2];
        sol.push('Add feet: ' + feet1 + ' + ' + feet2 + ' = ' + (feet1 + feet2));
        sol.push('Add inches: ' + inches1 + ' + ' + inches2 + ' = ' + (inches1 + inches2));
        var carryFeet = 0;
        var totalInch = inches1 + inches2;
        if (totalInch >= 12) {
          carryFeet = Math.floor(totalInch / 12);
          sol.push('  ' + totalInch + '" ≥ 12" → carry ' + carryFeet + ' foot, ' + (totalInch % 12) + '" remain');
        }
        if (frac1num > 0 || frac2num > 0) {
          var fr1 = ProblemGenerator.reduce(frac1num, den1);
          var fr2 = ProblemGenerator.reduce(frac2num, den2);
          if (frac1num > 0 && frac2num > 0) {
            sol.push('Add fractions: ' + fr1.num + '/' + fr1.den + ' + ' + fr2.num + '/' + fr2.den);
            if (fr1.den === fr2.den) {
              sol.push('  Same denominator: ' + (fr1.num + fr2.num) + '/' + fr1.den);
            } else {
              sol.push('  Butterfly: (' + fr1.num + '×' + fr2.den + ') + (' + fr2.num + '×' + fr1.den + ') = ' + (fr1.num * fr2.den + fr2.num * fr1.den));
              sol.push('  Over ' + fr1.den + '×' + fr2.den + ' = ' + (fr1.den * fr2.den));
            }
          }
        }
        sol.push('= ' + displayAnswer);

        return {
          displayQuestion: q1 + ' + ' + q2,
          answer: { whole: totalMixed.whole, num: totalMixed.num, den: totalMixed.den },
          answerFrac: totalResult,
          displayAnswer: displayAnswer,
          numberType: 'mixed',
          operator: '+',
          operatorName: 'addition',
          tipType: 'mixed-measure',
          formatHint: 'Enter total inches or feet\'inches"',
          solution: sol
        };
      }
    }
  }

  // --- Init on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init: init };
})();
