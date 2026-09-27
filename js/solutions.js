var Solutions = (function () {

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  /**
   * Generate a worked solution for a problem.
   * Returns an array of step strings (same format as tip progressions).
   * Lines starting with "  " are indented, "= " lines are answer-highlighted.
   */
  function solve(problem, mode) {
    // If the problem has a custom solution, use it
    if (problem.solution) return problem.solution;

    var op = problem.operator;
    var numType = problem.numberType;

    // Conversion problems (decimals/percentages mode)
    if (problem.tipKey === 'dec-to-fraction') {
      return solveDecToFrac(problem);
    }
    if (problem.tipKey === 'dec-from-fraction') {
      return solveFracToDec(problem);
    }
    if (problem.tipKey === 'pct-of') {
      return solvePctOf(problem);
    }
    if (problem.tipKey === 'pct-is') {
      return solvePctIs(problem);
    }
    if (problem.tipKey === 'pct-to-decimal') {
      return solvePctToDec(problem);
    }
    if (problem.tipKey === 'pct-to-fraction') {
      return solvePctToFrac(problem);
    }

    // Trade math
    if (mode === 'tradeMath') {
      return solveTrade(problem);
    }

    // Multiplication tables
    if (mode === 'multTables') {
      var a = problem.operand1.whole;
      var b = problem.operand2.whole;
      return [
        problem.displayQuestion,
        '  ' + a + ' × ' + b,
        '= ' + (a * b)
      ];
    }

    // Fraction arithmetic
    if (numType === 'fraction') {
      return solveFraction(problem);
    }

    // Mixed number arithmetic
    if (numType === 'mixed') {
      return solveMixed(problem);
    }

    // Decimal arithmetic
    if (numType === 'decimal') {
      return solveDecimal(problem);
    }

    // Whole number arithmetic
    if (numType === 'whole') {
      return solveWhole(problem);
    }

    return [problem.displayQuestion, '= ' + problem.displayAnswer];
  }

  function solveWhole(p) {
    var a = p.operand1.whole || (p.operand1.num / p.operand1.den);
    var b = p.operand2.whole || (p.operand2.num / p.operand2.den);
    var steps = [p.displayQuestion];

    switch (p.operator) {
      case '+':
        steps.push('  ' + a + ' + ' + b);
        steps.push('= ' + p.displayAnswer);
        break;
      case '\u2212':
        steps.push('  ' + a + ' - ' + b);
        steps.push('= ' + p.displayAnswer);
        break;
      case '\u00d7':
        // Show partial products for larger numbers
        if (a > 12 && b > 12) {
          var bOnes = b % 10;
          var bTens = Math.floor(b / 10) * 10;
          if (bTens > 0 && bOnes > 0) {
            steps.push('  ' + a + ' × ' + bOnes + ' = ' + (a * bOnes));
            steps.push('  ' + a + ' × ' + bTens + ' = ' + (a * bTens));
            steps.push('  ' + (a * bOnes) + ' + ' + (a * bTens));
          }
        }
        steps.push('= ' + p.displayAnswer);
        break;
      case '\u00f7':
        steps.push('  ' + a + ' ÷ ' + b);
        steps.push('= ' + p.displayAnswer);
        break;
    }
    return steps;
  }

  function solveDecimal(p) {
    var steps = [p.displayQuestion];
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solveFraction(p) {
    var a = p.operand1;
    var b = p.operand2;
    var steps = [p.displayQuestion];

    switch (p.operator) {
      case '+': {
        if (a.den === b.den) {
          steps.push('Same denominator: ' + a.den);
          steps.push('  Add numerators: ' + a.num + ' + ' + b.num + ' = ' + (a.num + b.num));
          steps.push('  Result: ' + (a.num + b.num) + '/' + a.den);
        } else {
          steps.push('Butterfly method:');
          var cross1 = a.num * b.den;
          var cross2 = b.num * a.den;
          steps.push('  Cross-multiply: ' + a.num + ' × ' + b.den + ' = ' + cross1);
          steps.push('  Cross-multiply: ' + b.num + ' × ' + a.den + ' = ' + cross2);
          steps.push('  Add cross products: ' + cross1 + ' + ' + cross2 + ' = ' + (cross1 + cross2));
          var newDen = a.den * b.den;
          steps.push('  Multiply denominators: ' + a.den + ' × ' + b.den + ' = ' + newDen);
          steps.push('  Result: ' + (cross1 + cross2) + '/' + newDen);
        }
        var result = ProblemGenerator.reduce(p.answerFrac.num, p.answerFrac.den);
        if (result.num !== (a.den === b.den ? a.num + b.num : a.num * b.den + b.num * a.den) ||
            result.den !== (a.den === b.den ? a.den : a.den * b.den)) {
          var g = gcd(Math.abs(p.answerFrac.num), Math.abs(p.answerFrac.den));
          if (g > 1) {
            steps.push('  Reduce: ÷ ' + g);
          }
        }
        var m = ProblemGenerator.toMixed(result.num, result.den);
        if (m.whole !== 0 && m.num !== 0) {
          steps.push('  Convert: ' + result.num + '/' + result.den + ' = ' + m.whole + ' ' + m.num + '/' + m.den);
        }
        steps.push('= ' + p.displayAnswer);
        break;
      }
      case '\u2212': {
        if (a.den === b.den) {
          steps.push('Same denominator: ' + a.den);
          steps.push('  Subtract numerators: ' + a.num + ' - ' + b.num + ' = ' + (a.num - b.num));
        } else {
          steps.push('Butterfly method:');
          var cross1 = a.num * b.den;
          var cross2 = b.num * a.den;
          steps.push('  Cross-multiply: ' + a.num + ' × ' + b.den + ' = ' + cross1);
          steps.push('  Cross-multiply: ' + b.num + ' × ' + a.den + ' = ' + cross2);
          steps.push('  Subtract cross products: ' + cross1 + ' - ' + cross2 + ' = ' + (cross1 - cross2));
          var newDen = a.den * b.den;
          steps.push('  Multiply denominators: ' + a.den + ' × ' + b.den + ' = ' + newDen);
          steps.push('  Result: ' + (cross1 - cross2) + '/' + newDen);
        }
        var result = ProblemGenerator.reduce(p.answerFrac.num, p.answerFrac.den);
        var rawNum = a.den === b.den ? (a.num - b.num) : (a.num * b.den - b.num * a.den);
        var rawDen = a.den === b.den ? a.den : a.den * b.den;
        var g = gcd(Math.abs(rawNum), Math.abs(rawDen));
        if (g > 1) {
          steps.push('  Reduce: ÷ ' + g);
        }
        steps.push('= ' + p.displayAnswer);
        break;
      }
      case '\u00d7': {
        steps.push('Multiply straight across:');
        steps.push('  Numerators: ' + a.num + ' × ' + b.num + ' = ' + (a.num * b.num));
        steps.push('  Denominators: ' + a.den + ' × ' + b.den + ' = ' + (a.den * b.den));
        steps.push('  Result: ' + (a.num * b.num) + '/' + (a.den * b.den));
        var g = gcd(a.num * b.num, a.den * b.den);
        if (g > 1) {
          steps.push('  Reduce: ÷ ' + g);
        }
        steps.push('= ' + p.displayAnswer);
        break;
      }
      case '\u00f7': {
        steps.push('Keep, flip, multiply:');
        steps.push('  Keep: ' + a.num + '/' + a.den);
        steps.push('  Flip: ' + b.num + '/' + b.den + ' → ' + b.den + '/' + b.num);
        steps.push('  Multiply: (' + a.num + '×' + b.den + ') / (' + a.den + '×' + b.num + ')');
        steps.push('  = ' + (a.num * b.den) + '/' + (a.den * b.num));
        var g = gcd(a.num * b.den, a.den * b.num);
        if (g > 1) {
          steps.push('  Reduce: ÷ ' + g);
        }
        steps.push('= ' + p.displayAnswer);
        break;
      }
    }
    return steps;
  }

  function solveMixed(p) {
    // Reconstruct the mixed number parts from the display question
    var parts = p.displayQuestion.split(' ' + p.operator + ' ');
    var steps = [p.displayQuestion];

    // Parse mixed numbers from display
    var parseMixed = function (s) {
      s = s.trim().replace(/"/g, '');
      var m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
      if (m) return { whole: parseInt(m[1]), num: parseInt(m[2]), den: parseInt(m[3]) };
      var f = s.match(/^(\d+)\/(\d+)$/);
      if (f) return { whole: 0, num: parseInt(f[1]), den: parseInt(f[2]) };
      var w = s.match(/^(\d+)$/);
      if (w) return { whole: parseInt(w[1]), num: 0, den: 1 };
      return null;
    };

    var a = parseMixed(parts[0]);
    var b = parseMixed(parts[1]);
    if (!a || !b) {
      steps.push('= ' + p.displayAnswer);
      return steps;
    }

    // Step 1: Convert to improper fractions
    steps.push('Convert to improper fractions:');
    var aImpNum = a.whole * a.den + a.num;
    var bImpNum = b.whole * b.den + b.num;
    if (a.whole > 0) {
      steps.push('  ' + a.whole + ' ' + a.num + '/' + a.den + ' → (' + a.whole + '×' + a.den + ' + ' + a.num + ')/' + a.den + ' = ' + aImpNum + '/' + a.den);
    }
    if (b.whole > 0) {
      steps.push('  ' + b.whole + ' ' + b.num + '/' + b.den + ' → (' + b.whole + '×' + b.den + ' + ' + b.num + ')/' + b.den + ' = ' + bImpNum + '/' + b.den);
    }

    var aFrac = { num: aImpNum, den: a.den };
    var bFrac = { num: bImpNum, den: b.den };

    switch (p.operator) {
      case '+': {
        if (aFrac.den === bFrac.den) {
          steps.push('Same denominator: ' + aFrac.den);
          steps.push('  Add numerators: ' + aFrac.num + ' + ' + bFrac.num + ' = ' + (aFrac.num + bFrac.num));
          steps.push('  Result: ' + (aFrac.num + bFrac.num) + '/' + aFrac.den);
        } else {
          steps.push('Butterfly method:');
          var c1 = aFrac.num * bFrac.den;
          var c2 = bFrac.num * aFrac.den;
          steps.push('  Cross-multiply: ' + aFrac.num + ' × ' + bFrac.den + ' = ' + c1);
          steps.push('  Cross-multiply: ' + bFrac.num + ' × ' + aFrac.den + ' = ' + c2);
          steps.push('  Add: ' + c1 + ' + ' + c2 + ' = ' + (c1 + c2));
          var nd = aFrac.den * bFrac.den;
          steps.push('  Multiply denominators: ' + aFrac.den + ' × ' + bFrac.den + ' = ' + nd);
          steps.push('  Result: ' + (c1 + c2) + '/' + nd);
        }
        break;
      }
      case '\u2212': {
        if (aFrac.den === bFrac.den) {
          steps.push('Same denominator: ' + aFrac.den);
          steps.push('  Subtract numerators: ' + aFrac.num + ' - ' + bFrac.num + ' = ' + (aFrac.num - bFrac.num));
          steps.push('  Result: ' + (aFrac.num - bFrac.num) + '/' + aFrac.den);
        } else {
          steps.push('Butterfly method:');
          var c1 = aFrac.num * bFrac.den;
          var c2 = bFrac.num * aFrac.den;
          steps.push('  Cross-multiply: ' + aFrac.num + ' × ' + bFrac.den + ' = ' + c1);
          steps.push('  Cross-multiply: ' + bFrac.num + ' × ' + aFrac.den + ' = ' + c2);
          steps.push('  Subtract: ' + c1 + ' - ' + c2 + ' = ' + (c1 - c2));
          var nd = aFrac.den * bFrac.den;
          steps.push('  Multiply denominators: ' + aFrac.den + ' × ' + bFrac.den + ' = ' + nd);
          steps.push('  Result: ' + (c1 - c2) + '/' + nd);
        }
        break;
      }
      case '\u00d7': {
        steps.push('Multiply straight across:');
        steps.push('  Numerators: ' + aFrac.num + ' × ' + bFrac.num + ' = ' + (aFrac.num * bFrac.num));
        steps.push('  Denominators: ' + aFrac.den + ' × ' + bFrac.den + ' = ' + (aFrac.den * bFrac.den));
        steps.push('  Result: ' + (aFrac.num * bFrac.num) + '/' + (aFrac.den * bFrac.den));
        break;
      }
      case '\u00f7': {
        steps.push('Keep, flip, multiply:');
        steps.push('  Keep: ' + aFrac.num + '/' + aFrac.den);
        steps.push('  Flip: ' + bFrac.num + '/' + bFrac.den + ' → ' + bFrac.den + '/' + bFrac.num);
        steps.push('  Multiply: (' + aFrac.num + '×' + bFrac.den + ') / (' + aFrac.den + '×' + bFrac.num + ')');
        var rn = aFrac.num * bFrac.den;
        var rd = aFrac.den * bFrac.num;
        steps.push('  = ' + rn + '/' + rd);
        break;
      }
    }

    // Reduce step
    var result = ProblemGenerator.reduce(p.answerFrac.num, p.answerFrac.den);
    var g = gcd(Math.abs(p.answerFrac.num), Math.abs(p.answerFrac.den));
    if (g > 1 && result.num !== p.answerFrac.num) {
      steps.push('  Reduce: ÷ ' + g);
    }

    // Convert back to mixed
    var m = p.answer;
    if (m.whole !== 0 && m.num !== 0) {
      steps.push('Convert to mixed number: ' + result.num + ' ÷ ' + result.den + ' = ' + m.whole + ' remainder ' + m.num);
    }

    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  // --- Conversion / Percentage solutions ---

  function solveDecToFrac(p) {
    var q = p.displayQuestion.replace(' = what fraction?', '');
    var dec = parseFloat(q);
    var steps = [p.displayQuestion];
    // Count decimal places
    var places = q.split('.')[1] ? q.split('.')[1].length : 0;
    var pow = Math.pow(10, places);
    var rawNum = Math.round(dec * pow);
    steps.push('  ' + places + ' decimal place' + (places > 1 ? 's' : '') + ' → denominator of ' + pow);
    steps.push('  ' + rawNum + '/' + pow);
    var g = gcd(rawNum, pow);
    if (g > 1) {
      steps.push('  Reduce: ÷ ' + g);
      steps.push('  ' + (rawNum / g) + '/' + (pow / g));
    }
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solveFracToDec(p) {
    var steps = [p.displayQuestion];
    var frac = p.displayQuestion.replace(' = what decimal?', '');
    var parts = frac.split('/');
    if (parts.length === 2) {
      steps.push('  Divide numerator by denominator:');
      steps.push('  ' + parts[0] + ' ÷ ' + parts[1]);
    }
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solvePctOf(p) {
    // "X% of Y = ?"
    var match = p.displayQuestion.match(/^([\d.]+)% of ([\d,]+)/);
    if (!match) return [p.displayQuestion, '= ' + p.displayAnswer];
    var pct = parseFloat(match[1]);
    var val = parseFloat(match[2].replace(/,/g, ''));
    var steps = [p.displayQuestion];

    // Show the breakdown approach
    if (pct === Math.floor(pct) && pct <= 100) {
      var tenPct = val / 10;
      steps.push('  10% of ' + val + ' = ' + val + ' ÷ 10 = ' + tenPct);
      if (pct === 10) {
        // done
      } else if (pct === 50) {
        steps.push('  50% = ' + val + ' ÷ 2');
      } else if (pct === 25) {
        steps.push('  25% = ' + val + ' ÷ 4');
      } else if (pct === 75) {
        steps.push('  75% = 50% + 25%');
        steps.push('  50% = ' + (val / 2));
        steps.push('  25% = ' + (val / 4));
        steps.push('  ' + (val / 2) + ' + ' + (val / 4));
      } else {
        steps.push('  ' + pct + '% = ' + pct + ' ÷ 100 = ' + (pct / 100));
        steps.push('  ' + val + ' × ' + (pct / 100));
      }
    } else {
      steps.push('  Convert percent to decimal: ' + pct + '% = ' + (pct / 100));
      steps.push('  Multiply: ' + val + ' × ' + (pct / 100));
    }
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solvePctIs(p) {
    var match = p.displayQuestion.match(/^([\d.]+) is what % of ([\d.]+)/);
    if (!match) return [p.displayQuestion, '= ' + p.displayAnswer];
    var part = parseFloat(match[1]);
    var whole = parseFloat(match[2]);
    var steps = [p.displayQuestion];
    steps.push('  Divide part by whole: ' + part + ' ÷ ' + whole + ' = ' + (Math.round((part / whole) * 10000) / 10000));
    steps.push('  Multiply by 100: ' + (Math.round((part / whole) * 10000) / 10000) + ' × 100');
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solvePctToDec(p) {
    var match = p.displayQuestion.match(/^([\d.]+)%/);
    if (!match) return [p.displayQuestion, '= ' + p.displayAnswer];
    var pct = parseFloat(match[1]);
    var steps = [p.displayQuestion];
    steps.push('  Divide by 100 (move decimal 2 places left):');
    steps.push('  ' + pct + ' ÷ 100');
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  function solvePctToFrac(p) {
    var match = p.displayQuestion.match(/^([\d.]+)%/);
    if (!match) return [p.displayQuestion, '= ' + p.displayAnswer];
    var pct = parseFloat(match[1]);
    var steps = [p.displayQuestion];
    var num, den;
    if (pct === Math.floor(pct)) {
      num = pct;
      den = 100;
    } else {
      // Handle things like 12.5% = 125/1000
      var places = match[1].split('.')[1] ? match[1].split('.')[1].length : 0;
      var mult = Math.pow(10, places);
      num = pct * mult;
      den = 100 * mult;
    }
    steps.push('  Place over 100: ' + num + '/' + den);
    var g = gcd(num, den);
    if (g > 1) {
      steps.push('  Reduce: ÷ ' + g);
      steps.push('  ' + (num / g) + '/' + (den / g));
    }
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  // --- Trade math solutions ---

  function solveTrade(p) {
    if (p.solution) return p.solution;
    var steps = [p.displayQuestion];
    steps.push('= ' + p.displayAnswer);
    return steps;
  }

  // --- Render ---

  function render(solutionSteps) {
    if (!solutionSteps || solutionSteps.length === 0) return '';
    var html = '<div class="solution-title">Solution</div>';
    for (var i = 0; i < solutionSteps.length; i++) {
      var line = solutionSteps[i];
      if (line === '') {
        html += '<div class="solution-spacer"></div>';
      } else if (line.substring(0, 2) === '= ') {
        html += '<div class="solution-step sol-answer">' + line + '</div>';
      } else if (line.substring(0, 2) === '  ') {
        html += '<div class="solution-step sol-indent">' + line + '</div>';
      } else {
        html += '<div class="solution-step">' + line + '</div>';
      }
    }
    return html;
  }

  return {
    solve: solve,
    render: render
  };
})();
