var Storage = (function () {
  var SETTINGS_KEY = 'mathPractice_settings';
  var STATS_KEY = 'mathPractice_stats';
  var MULT_KEY = 'mathPractice_multTables';

  var DEFAULT_SETTINGS = {
    version: 1,
    mode: 'arithmetic',
    arithmetic: {
      operations: { addition: true, subtraction: true, multiplication: true, division: false },
      difficulty: 'easy'
    },
    multTables: {
      tables: [1, 2, 3, 4, 5],
      mode: 'random',
      difficulty: 'easy'
    },
    fractions: {
      operations: { addition: true, subtraction: true, multiplication: false, division: false },
      types: { proper: true, mixed: true },
      difficulty: 'easy'
    },
    decimals: {
      types: { arithmetic: true, toFraction: true, fromFraction: true },
      difficulty: 'easy'
    },
    percentages: {
      types: { of: true, is: true, toDecimal: true, toFraction: true },
      difficulty: 'easy'
    },
    tradeMath: {
      difficulty: 'easy'
    },
    examPrep: {
      categories: ['fractions', 'percentages', 'unit_conversion', 'area_volume', 'rate_ratio', 'word_problems', 'exponents_roots', 'comparison', 'material_estimation', 'stacking']
    },
    timerSeconds: 8,
    hideMode: false
  };

  var DEFAULT_STATS = {
    version: 1,
    lifetime: {
      totalProblems: 0,
      correct: 0,
      incorrect: 0,
      skipped: 0,
      bestStreak: 0,
      byOperation: {
        addition: { total: 0, correct: 0 },
        subtraction: { total: 0, correct: 0 },
        multiplication: { total: 0, correct: 0 },
        division: { total: 0, correct: 0 }
      },
      byNumberType: {
        whole: { total: 0, correct: 0 },
        decimal: { total: 0, correct: 0 },
        fraction: { total: 0, correct: 0 },
        mixed: { total: 0, correct: 0 }
      },
      byMode: {
        arithmetic: { total: 0, correct: 0 },
        multTables: { total: 0, correct: 0 },
        fractions: { total: 0, correct: 0 },
        decimals: { total: 0, correct: 0 },
        percentages: { total: 0, correct: 0 },
        tradeMath: { total: 0, correct: 0 },
        examPrep: { total: 0, correct: 0 }
      }
    }
  };

  var DEFAULT_MULT = {
    version: 1,
    facts: {} // keyed like "7x8": { attempts: 0, correct: 0 }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
            typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
          deepMerge(target[key], source[key]);
        } else if (!(key in target)) {
          target[key] = deepClone(source[key]);
        }
      }
    }
    return target;
  }

  function read(key, defaults) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return deepClone(defaults);
      var parsed = JSON.parse(raw);
      return deepMerge(parsed, defaults);
    } catch (e) {
      return deepClone(defaults);
    }
  }

  function write(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      // storage full or unavailable — silently fail
    }
  }

  return {
    getSettings: function () { return read(SETTINGS_KEY, DEFAULT_SETTINGS); },
    saveSettings: function (s) { write(SETTINGS_KEY, s); },

    getStats: function () { return read(STATS_KEY, DEFAULT_STATS); },
    saveStats: function (s) { write(STATS_KEY, s); },
    resetStats: function () { write(STATS_KEY, deepClone(DEFAULT_STATS)); },

    getMultTables: function () { return read(MULT_KEY, DEFAULT_MULT); },
    saveMultTables: function (m) { write(MULT_KEY, m); },

    getDefaults: function () { return deepClone(DEFAULT_SETTINGS); }
  };
})();
