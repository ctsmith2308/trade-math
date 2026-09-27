var ProblemGenerator = (function () {

  // --- Rational arithmetic helpers ---

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  function lcd(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  function reduce(num, den) {
    if (den === 0) return { num: 0, den: 1 };
    var sign = (den < 0) ? -1 : 1;
    num *= sign; den *= sign;
    var g = gcd(Math.abs(num), den);
    return { num: num / g, den: den / g };
  }

  function toImproper(whole, num, den) {
    var sign = whole < 0 ? -1 : 1;
    return { num: sign * (Math.abs(whole) * den + num), den: den };
  }

  function toMixed(num, den) {
    if (den === 0) return { whole: 0, num: 0, den: 1 };
    var r = reduce(num, den);
    num = r.num; den = r.den;
    var sign = num < 0 ? -1 : 1;
    num = Math.abs(num);
    var whole = Math.floor(num / den);
    var remainder = num % den;
    return { whole: sign * whole, num: remainder, den: den };
  }

  function fracAdd(a, b) {
    var d = lcd(a.den, b.den);
    return reduce(a.num * (d / a.den) + b.num * (d / b.den), d);
  }

  function fracSub(a, b) {
    return fracAdd(a, { num: -b.num, den: b.den });
  }

  function fracMul(a, b) {
    return reduce(a.num * b.num, a.den * b.den);
  }

  function fracDiv(a, b) {
    return reduce(a.num * b.den, a.den * b.num);
  }

  // --- Difficulty configs ---

  var DIFFICULTY = {
    easy: {
      wholeRange: [1, 20],
      decimalPlaces: 1,
      fractionDens: [2, 3, 4, 5],
      allowNegative: false,
      allowMixed: false,
      divisionExact: true,
      numberTypeWeights: { whole: 60, decimal: 20, fraction: 20, mixed: 0 }
    },
    medium: {
      wholeRange: [1, 100],
      decimalPlaces: 2,
      fractionDens: [2, 3, 4, 5, 6, 8, 10],
      allowNegative: false,
      allowMixed: true,
      divisionExact: true,
      numberTypeWeights: { whole: 30, decimal: 25, fraction: 25, mixed: 20 }
    },
    hard: {
      wholeRange: [1, 500],
      decimalPlaces: 2,
      fractionDens: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
      allowNegative: true,
      allowMixed: true,
      divisionExact: false,
      numberTypeWeights: { whole: 20, decimal: 25, fraction: 25, mixed: 30 }
    }
  };

  // --- Random helpers ---

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function weightedPick(weights) {
    var total = 0;
    for (var k in weights) total += weights[k];
    var r = Math.random() * total;
    var cumulative = 0;
    for (var k in weights) {
      cumulative += weights[k];
      if (r <= cumulative) return k;
    }
    return k; // fallback to last
  }

  // --- Number type generators ---

  function generateWhole(config, operator) {
    var min = config.wholeRange[0];
    var max = config.wholeRange[1];

    if (operator === '÷' && config.divisionExact) {
      var answer = randInt(min, Math.min(max, 50));
      var b = randInt(2, Math.min(12, max));
      var a = answer * b;
      return {
        operand1: { whole: a, num: 0, den: 1 },
        operand2: { whole: b, num: 0, den: 1 },
        answer: { whole: answer, num: 0, den: 1 },
        numberType: 'whole',
        displayQuestion: a + ' ÷ ' + b,
        displayAnswer: '' + answer
      };
    }

    var a = randInt(min, max);
    var b = randInt(min, max);

    // For subtraction, ensure a >= b on easy/medium to avoid negatives
    if (operator === '−' && !config.allowNegative && a < b) {
      var temp = a; a = b; b = temp;
    }

    var aFrac = { num: a, den: 1 };
    var bFrac = { num: b, den: 1 };
    var result;

    switch (operator) {
      case '+': result = fracAdd(aFrac, bFrac); break;
      case '−': result = fracSub(aFrac, bFrac); break;
      case '×': result = fracMul(aFrac, bFrac); break;
      case '÷': result = fracDiv(aFrac, bFrac); break;
    }

    var mixed = toMixed(result.num, result.den);
    var displayAnswer;
    if (mixed.num === 0) {
      displayAnswer = '' + mixed.whole;
    } else if (mixed.whole === 0) {
      displayAnswer = result.num + '/' + result.den;
    } else {
      displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den;
    }

    return {
      operand1: { whole: a, num: 0, den: 1 },
      operand2: { whole: b, num: 0, den: 1 },
      answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
      answerFrac: result,
      numberType: 'whole',
      displayQuestion: a + ' ' + operator + ' ' + b,
      displayAnswer: displayAnswer
    };
  }

  function generateDecimal(config, operator) {
    var places = config.decimalPlaces;
    var factor = Math.pow(10, places);
    var min = config.wholeRange[0];
    var max = Math.min(config.wholeRange[1], 100);

    if (operator === '÷' && config.divisionExact) {
      var answerInt = randInt(1, 20) * (factor / 10);
      var bInt = randInt(2, 10) * (factor / 10);
      var aInt = answerInt * bInt / factor;
      // Simpler approach: generate clean division
      var answer = randInt(1, 20);
      var b = randInt(2, 10);
      var a = answer * b;
      var aDecimal = a / Math.pow(10, randInt(0, 1));
      var bDecimal = b;
      if (aDecimal === a) {
        // Keep as whole numbers divided
      }
      return generateWhole(config, operator); // fallback for clean division
    }

    var aInt = randInt(min * factor, max * factor);
    var bInt = randInt(min * factor, max * factor);
    var a = aInt / factor;
    var b = bInt / factor;

    // Convert to fractions for exact arithmetic
    var aFrac = reduce(aInt, factor);
    var bFrac = reduce(bInt, factor);

    if (operator === '−' && !config.allowNegative && a < b) {
      var temp = aFrac; aFrac = bFrac; bFrac = temp;
      var tempVal = a; a = b; b = tempVal;
    }

    var result;
    switch (operator) {
      case '+': result = fracAdd(aFrac, bFrac); break;
      case '−': result = fracSub(aFrac, bFrac); break;
      case '×': result = fracMul(aFrac, bFrac); break;
      case '÷': result = fracDiv(aFrac, bFrac); break;
    }

    var decimalAnswer = result.num / result.den;
    var displayAnswer;
    // Check if it's a clean decimal
    var rounded = Math.round(decimalAnswer * 10000) / 10000;
    if (rounded === Math.round(rounded)) {
      displayAnswer = '' + rounded;
    } else {
      displayAnswer = '' + (Math.round(decimalAnswer * 10000) / 10000);
    }

    var mixed = toMixed(result.num, result.den);

    return {
      operand1: aFrac,
      operand2: bFrac,
      answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
      answerFrac: result,
      answerDecimal: decimalAnswer,
      numberType: 'decimal',
      displayQuestion: a + ' ' + operator + ' ' + b,
      displayAnswer: displayAnswer
    };
  }

  function generateFraction(config, operator) {
    var dens = config.fractionDens;
    var den1 = pick(dens);
    var den2 = pick(dens);
    var num1 = randInt(1, den1 - 1);
    var num2 = randInt(1, den2 - 1);

    var aFrac = reduce(num1, den1);
    var bFrac = reduce(num2, den2);

    var result;
    switch (operator) {
      case '+': result = fracAdd(aFrac, bFrac); break;
      case '−':
        // Ensure positive result on easy/medium
        if (!config.allowNegative) {
          var testResult = fracSub(aFrac, bFrac);
          if (testResult.num < 0) {
            var temp = aFrac; aFrac = bFrac; bFrac = temp;
          }
        }
        result = fracSub(aFrac, bFrac);
        break;
      case '×': result = fracMul(aFrac, bFrac); break;
      case '÷': result = fracDiv(aFrac, bFrac); break;
    }

    result = reduce(result.num, result.den);
    var mixed = toMixed(result.num, result.den);

    var displayAnswer;
    if (mixed.num === 0) {
      displayAnswer = '' + mixed.whole;
    } else if (mixed.whole === 0) {
      displayAnswer = result.num + '/' + result.den;
    } else {
      displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den;
    }

    return {
      operand1: aFrac,
      operand2: bFrac,
      answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
      answerFrac: result,
      numberType: 'fraction',
      displayQuestion: aFrac.num + '/' + aFrac.den + ' ' + operator + ' ' + bFrac.num + '/' + bFrac.den,
      displayAnswer: displayAnswer
    };
  }

  function generateMixed(config, operator) {
    var dens = config.fractionDens;
    var maxWhole = Math.min(Math.floor(config.wholeRange[1] / 5), 20);

    var whole1 = randInt(1, maxWhole);
    var den1 = pick(dens);
    var num1 = randInt(1, den1 - 1);

    var whole2 = randInt(1, maxWhole);
    var den2 = pick(dens);
    var num2 = randInt(1, den2 - 1);

    var aFrac = toImproper(whole1, num1, den1);
    var bFrac = toImproper(whole2, num2, den2);

    var result;
    switch (operator) {
      case '+': result = fracAdd(aFrac, bFrac); break;
      case '−':
        if (!config.allowNegative) {
          // Ensure a >= b
          var aVal = aFrac.num / aFrac.den;
          var bVal = bFrac.num / bFrac.den;
          if (aVal < bVal) {
            var temp = aFrac; aFrac = bFrac; bFrac = temp;
            var tw = whole1; whole1 = whole2; whole2 = tw;
            var tn = num1; num1 = num2; num2 = tn;
            var td = den1; den1 = den2; den2 = td;
          }
        }
        result = fracSub(aFrac, bFrac);
        break;
      case '×': result = fracMul(aFrac, bFrac); break;
      case '÷': result = fracDiv(aFrac, bFrac); break;
    }

    result = reduce(result.num, result.den);
    var mixed = toMixed(result.num, result.den);

    var displayAnswer;
    if (mixed.num === 0) {
      displayAnswer = '' + mixed.whole;
    } else if (mixed.whole === 0) {
      var r = reduce(Math.abs(result.num), result.den);
      displayAnswer = (result.num < 0 ? '-' : '') + r.num + '/' + r.den;
    } else {
      displayAnswer = mixed.whole + ' ' + mixed.num + '/' + mixed.den;
    }

    var aReduced = reduce(num1, den1);
    var bReduced = reduce(num2, den2);

    return {
      operand1: aFrac,
      operand2: bFrac,
      answer: { whole: mixed.whole, num: mixed.num, den: mixed.den },
      answerFrac: result,
      numberType: 'mixed',
      displayQuestion: whole1 + ' ' + aReduced.num + '/' + aReduced.den + ' ' + operator + ' ' + whole2 + ' ' + bReduced.num + '/' + bReduced.den,
      displayAnswer: displayAnswer
    };
  }

  // --- Operator mapping ---
  var OPERATOR_MAP = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷'
  };

  var OPERATOR_NAMES = {
    '+': 'addition',
    '−': 'subtraction',
    '×': 'multiplication',
    '÷': 'division'
  };

  // --- Public API ---

  return {
    // Expose helpers for other modules
    gcd: gcd,
    lcd: lcd,
    reduce: reduce,
    toImproper: toImproper,
    toMixed: toMixed,
    fracAdd: fracAdd,
    fracSub: fracSub,
    fracMul: fracMul,
    fracDiv: fracDiv,

    generate: function (operations, difficulty) {
      var config = DIFFICULTY[difficulty] || DIFFICULTY.easy;

      // Pick a random enabled operation
      var enabledOps = [];
      for (var op in operations) {
        if (operations[op] && OPERATOR_MAP[op]) {
          enabledOps.push(OPERATOR_MAP[op]);
        }
      }
      if (enabledOps.length === 0) enabledOps = ['+'];

      var operator = pick(enabledOps);

      // Pick number type based on difficulty weights
      var numberType = weightedPick(config.numberTypeWeights);

      var problem;
      switch (numberType) {
        case 'whole': problem = generateWhole(config, operator); break;
        case 'decimal': problem = generateDecimal(config, operator); break;
        case 'fraction': problem = generateFraction(config, operator); break;
        case 'mixed':
          if (config.allowMixed) {
            problem = generateMixed(config, operator);
          } else {
            problem = generateFraction(config, operator);
          }
          break;
        default: problem = generateWhole(config, operator); break;
      }

      problem.operator = operator;
      problem.operatorName = OPERATOR_NAMES[operator];
      return problem;
    },

    generateMultTable: function (a, b) {
      return {
        operand1: { whole: a, num: 0, den: 1 },
        operand2: { whole: b, num: 0, den: 1 },
        answer: { whole: a * b, num: 0, den: 1 },
        answerFrac: { num: a * b, den: 1 },
        numberType: 'whole',
        operator: '×',
        operatorName: 'multiplication',
        displayQuestion: a + ' × ' + b,
        displayAnswer: '' + (a * b)
      };
    }
  };
})();
