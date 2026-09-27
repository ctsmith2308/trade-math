var Tips = (function () {

  var TIPS = {
    // --- Arithmetic: Addition ---
    'addition-whole': {
      title: 'Adding Whole Numbers',
      progression: [
        'Example: 47 + 38',
        'Align by place value (ones, tens, hundreds...)',
        'Add the ones column: 7 + 8 = 15',
        'Write 5, carry the 1 to the tens column',
        'Add the tens column: 4 + 3 + 1 (carried) = 8',
        '= 85'
      ]
    },
    'addition-decimal': {
      title: 'Adding Decimals',
      progression: [
        'Example: 3.5 + 2.75',
        'Align the decimal points vertically',
        'Pad with zeros so both have equal decimal places: 3.50 + 2.75',
        'Add as whole numbers from right to left',
        'Place the decimal point directly below',
        '= 6.25'
      ]
    },
    'addition-fraction': {
      title: 'Adding Fractions — Butterfly Method',
      progression: [
        'Example: 1/3 + 1/4',
        'Cross-multiply each numerator by the other denominator:',
        '  First numerator × second denominator: 1 × 4 = 4',
        '  Second numerator × first denominator: 1 × 3 = 3',
        'Add the cross products for the new numerator: 4 + 3 = 7',
        'Multiply the denominators for the new denominator: 3 × 4 = 12',
        'Reduce if possible (7 and 12 share no common factors)',
        '= 7/12'
      ]
    },
    'addition-mixed': {
      title: 'Adding Mixed Numbers',
      progression: [
        'Example: 2 1/3 + 1 3/4',
        'Step 1 — Convert each mixed number to an improper fraction:',
        '  (whole × denominator + numerator) / denominator',
        '  2 1/3 → (2×3 + 1) / 3 = 7/3',
        '  1 3/4 → (1×4 + 3) / 4 = 7/4',
        'Step 2 — Butterfly method on the improper fractions:',
        '  Cross products: (7×4) + (7×3) = 28 + 21 = 49',
        '  New denominator: 3 × 4 = 12',
        'Step 3 — Convert back to a mixed number:',
        '  49 ÷ 12 = 4 remainder 1',
        '= 4 1/12'
      ]
    },

    // --- Arithmetic: Subtraction ---
    'subtraction-whole': {
      title: 'Subtracting Whole Numbers',
      progression: [
        'Example: 83 - 47',
        'Align by place value',
        'Subtract the ones column: 3 - 7 → cannot, borrow 1 from tens',
        '  13 - 7 = 6',
        'Subtract the tens column: 7 - 4 = 3 (8 became 7 after borrowing)',
        '= 36'
      ]
    },
    'subtraction-decimal': {
      title: 'Subtracting Decimals',
      progression: [
        'Example: 5.3 - 2.75',
        'Align decimal points and pad with zeros: 5.30 - 2.75',
        'Subtract from right to left, borrowing as needed',
        '  0 - 5 → borrow → 10 - 5 = 5',
        '  2 - 7 → borrow → 12 - 7 = 5',
        '  4 - 2 = 2 (5 became 4 after borrowing)',
        '= 2.55'
      ]
    },
    'subtraction-fraction': {
      title: 'Subtracting Fractions — Butterfly Method',
      progression: [
        'Example: 3/4 - 1/3',
        'Cross-multiply each numerator by the other denominator:',
        '  First numerator × second denominator: 3 × 3 = 9',
        '  Second numerator × first denominator: 1 × 4 = 4',
        'Subtract the cross products for the new numerator: 9 - 4 = 5',
        'Multiply the denominators for the new denominator: 4 × 3 = 12',
        'Reduce if possible',
        '= 5/12'
      ]
    },
    'subtraction-mixed': {
      title: 'Subtracting Mixed Numbers',
      progression: [
        'Example: 4 1/4 - 1 3/4',
        'Step 1 — Convert each mixed number to an improper fraction:',
        '  (whole × denominator + numerator) / denominator',
        '  4 1/4 → (4×4 + 1) / 4 = 17/4',
        '  1 3/4 → (1×4 + 3) / 4 = 7/4',
        'Step 2 — Same denominator? Subtract numerators directly:',
        '  17 - 7 = 10 → 10/4',
        '  (Different denominators? Use the butterfly method)',
        'Step 3 — Reduce and convert back:',
        '  10/4 → reduce → 5/2 → 2 remainder 1',
        '= 2 1/2'
      ]
    },

    // --- Arithmetic: Multiplication ---
    'multiplication-whole': {
      title: 'Multiplying Whole Numbers',
      progression: [
        'Example: 23 × 15',
        'Multiply by each digit of the second number (multiplier):',
        '  23 × 5 (ones) = 115',
        '  23 × 1 (tens) = 23, shift left → 230',
        'Add the partial products:',
        '  115 + 230',
        '= 345'
      ]
    },
    'multiplication-decimal': {
      title: 'Multiplying Decimals',
      progression: [
        'Example: 2.5 × 1.2',
        'Step 1 — Ignore the decimal points, multiply as whole numbers:',
        '  25 × 12 = 300',
        'Step 2 — Count total decimal places in both factors:',
        '  2.5 has 1 place + 1.2 has 1 place = 2 total',
        'Step 3 — Place the decimal point that many places from the right:',
        '  300 → 3.00',
        '= 3'
      ]
    },
    'multiplication-fraction': {
      title: 'Multiplying Fractions — Straight Across',
      progression: [
        'Example: 2/3 × 3/4',
        'No butterfly needed — multiply straight across:',
        '  Numerator × numerator: 2 × 3 = 6',
        '  Denominator × denominator: 3 × 4 = 12',
        '  Result: 6/12',
        'Reduce by dividing numerator and denominator by their GCF (6):',
        '= 1/2'
      ]
    },
    'multiplication-mixed': {
      title: 'Multiplying Mixed Numbers',
      progression: [
        'Example: 1 1/2 × 2 1/3',
        'Step 1 — Convert each mixed number to an improper fraction:',
        '  (whole × denominator + numerator) / denominator',
        '  1 1/2 → (1×2 + 1) / 2 = 3/2',
        '  2 1/3 → (2×3 + 1) / 3 = 7/3',
        'Step 2 — Multiply straight across:',
        '  Numerators: 3 × 7 = 21',
        '  Denominators: 2 × 3 = 6',
        '  Result: 21/6',
        'Step 3 — Reduce and convert back:',
        '  21/6 → reduce → 7/2 → 3 remainder 1',
        '= 3 1/2'
      ]
    },

    // --- Arithmetic: Division ---
    'division-whole': {
      title: 'Dividing Whole Numbers',
      progression: [
        'Example: 156 ÷ 12',
        '',
        'Long Division (on paper):',
        '  Divide, multiply, subtract, bring down — repeat:',
        '  12 into 15 → goes 1 time (1 × 12 = 12), remainder 3',
        '  Bring down the 6 → 36',
        '  12 into 36 → goes 3 times (3 × 12 = 36), remainder 0',
        '= 13',
        '',
        'Mental Math — Chunking (multiply up):',
        '  Think: "What do I know about 12s?"',
        '  12 × 10 = 120 → 156 - 120 = 36 left',
        '  12 × 3 = 36 → 36 - 36 = 0 left',
        '  10 + 3 = 13 ✓',
        '',
        'Mental Math — Factor the divisor:',
        '  Break 12 into 2 × 2 × 3, then divide in steps:',
        '  156 ÷ 2 = 78 → 78 ÷ 2 = 39 → 39 ÷ 3 = 13 ✓',
        '',
        'Mental Math — Use nearby facts:',
        '  12 × 12 = 144 (known fact)',
        '  156 - 144 = 12 → that\'s one more 12',
        '  12 + 1 = 13 ✓'
      ]
    },
    'division-decimal': {
      title: 'Dividing Decimals',
      progression: [
        'Example: 7.5 ÷ 2.5',
        'Step 1 — Move the decimal in the divisor to make it a whole number:',
        '  2.5 → 25 (moved 1 place right)',
        'Step 2 — Move the decimal in the dividend the same number of places:',
        '  7.5 → 75',
        'Step 3 — Divide as whole numbers:',
        '  75 ÷ 25',
        '= 3',
        '',
        'Mental shortcut — Chunk it:',
        '  "25 × 2 = 50, 25 × 3 = 75" → answer is 3'
      ]
    },
    'division-fraction': {
      title: 'Dividing Fractions — Keep, Flip, Multiply',
      progression: [
        'Example: 2/3 ÷ 4/5',
        'Step 1 — Keep the first fraction (the dividend): 2/3',
        'Step 2 — Flip the second fraction (the divisor) to its reciprocal:',
        '  4/5 → 5/4',
        'Step 3 — Multiply straight across:',
        '  Numerators: 2 × 5 = 10',
        '  Denominators: 3 × 4 = 12',
        '  Result: 10/12',
        'Step 4 — Reduce by dividing by GCF (2):',
        '= 5/6'
      ]
    },
    'division-mixed': {
      title: 'Dividing Mixed Numbers',
      progression: [
        'Example: 2 1/2 ÷ 1 1/4',
        'Step 1 — Convert each mixed number to an improper fraction:',
        '  2 1/2 → (2×2 + 1) / 2 = 5/2',
        '  1 1/4 → (1×4 + 1) / 4 = 5/4',
        'Step 2 — Keep the first, flip the second (reciprocal):',
        '  5/2 × 4/5',
        'Step 3 — Multiply straight across:',
        '  Numerators: 5 × 4 = 20',
        '  Denominators: 2 × 5 = 10',
        '  Result: 20/10',
        'Step 4 — Reduce:',
        '= 2'
      ]
    },

    // --- Multiplication Table tricks ---
    'mult-1': { title: 'Multiply by 1', progression: ['Any number × 1 equals itself', 'Example: 1 × 9 = 9'] },
    'mult-2': { title: 'Multiply by 2 — Double It', progression: ['Double the number (add it to itself)', 'Example: 2 × 7 → 7 + 7 = 14'] },
    'mult-3': { title: 'Multiply by 3 — Double + One More', progression: ['Double the number, then add it once more', 'Example: 3 × 8 → 8 + 8 = 16 → 16 + 8 = 24'] },
    'mult-4': { title: 'Multiply by 4 — Double Twice', progression: ['Double the number, then double the result', 'Example: 4 × 7 → 7 × 2 = 14 → 14 × 2 = 28'] },
    'mult-5': { title: 'Multiply by 5 — Half of 10×', progression: ['Multiply by 10 then divide by 2', 'Example: 5 × 13 → 13 × 10 = 130 → 130 ÷ 2 = 65'] },
    'mult-6': { title: 'Multiply by 6 — Triple Then Double', progression: ['Multiply by 3, then double the result', 'Example: 6 × 7 → 3 × 7 = 21 → 21 × 2 = 42'] },
    'mult-7': { title: 'Multiply by 7 — Know the Pattern', progression: ['No easy shortcut — memorize the sequence:', '7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84', 'Memory aid: 56 = 7 × 8 → "5, 6, 7, 8"'] },
    'mult-8': { title: 'Multiply by 8 — Double Three Times', progression: ['Double the number three times', 'Example: 8 × 6 → 6 × 2 = 12 → 12 × 2 = 24 → 24 × 2 = 48'] },
    'mult-9': { title: 'Multiply by 9 — 10× Minus the Number', progression: ['Multiply by 10, then subtract the original number', 'Example: 9 × 7 → 10 × 7 = 70 → 70 - 7 = 63', 'Digit check: the digits of the product always sum to 9', '  6 + 3 = 9 ✓'] },
    'mult-10': { title: 'Multiply by 10 — Add a Zero', progression: ['Append a zero to the number', 'Example: 10 × 7 = 70'] },
    'mult-11': { title: 'Multiply by 11 — Split and Sum', progression: ['For a 2-digit number: split the digits, place their sum in the middle', 'Example: 11 × 36 → 3_(3+6)_6 = 3_9_6 = 396', 'If the sum is 10+, carry the 1:', '  11 × 85 → 8_(8+5)_5 = 8_13_5 → carry → 935'] },
    'mult-12': { title: 'Multiply by 12 — 10× Plus 2×', progression: ['Multiply by 10, then add double the number', 'Example: 12 × 7 → 10 × 7 = 70, then 2 × 7 = 14 → 70 + 14 = 84'] },

    // --- Percentages ---
    'pct-of': {
      title: 'Finding a Percentage of a Number',
      progression: [
        'Example: 15% of 240',
        'Break the percentage into easy pieces:',
        '  10% of 240 = 240 ÷ 10 = 24',
        '  5% of 240 = half of 10% = 24 ÷ 2 = 12',
        '  15% = 10% + 5% = 24 + 12',
        '= 36',
        '',
        'Quick reference:',
        '  10% → divide by 10',
        '  25% → divide by 4',
        '  50% → divide by 2',
        '  1%  → divide by 100'
      ]
    },
    'pct-is': {
      title: 'What Percent is X of Y?',
      progression: [
        'Example: 17 correct out of 25 questions',
        'Divide the part by the whole:',
        '  17 ÷ 25 = 0.68',
        'Multiply the quotient by 100:',
        '  0.68 × 100',
        '= 68%',
        '',
        'Formula: (part ÷ whole) × 100 = percent'
      ]
    },
    'pct-to-decimal': {
      title: 'Converting Percent to Decimal',
      progression: [
        'Divide the percentage by 100',
        '(move the decimal point 2 places to the left)',
        '',
        'Examples:',
        '  45%  → 0.45',
        '  5.5% → 0.055',
        '  125% → 1.25',
        '',
        '"Percent" literally means "per hundred"'
      ]
    },
    'pct-to-fraction': {
      title: 'Converting Percent to Fraction',
      progression: [
        'Place the percentage over a denominator of 100, then reduce:',
        '',
        'Example: 75% → 75/100',
        '  GCF of 75 and 100 is 25',
        '  75 ÷ 25 = 3, 100 ÷ 25 = 4',
        '= 3/4',
        '',
        'Common conversions:',
        '  25% = 1/4    50% = 1/2    75% = 3/4',
        '  20% = 1/5    33⅓% ≈ 1/3  10% = 1/10'
      ]
    },

    // --- Decimals ---
    'dec-to-fraction': {
      title: 'Converting a Decimal to a Fraction',
      progression: [
        'Example: 0.375',
        'Step 1 — Count the decimal places (3 places)',
        'Step 2 — Write the digits over the matching power of 10:',
        '  375 / 1000',
        'Step 3 — Reduce by dividing numerator and denominator by their GCF:',
        '  GCF of 375 and 1000 = 125',
        '  375 ÷ 125 = 3, 1000 ÷ 125 = 8',
        '= 3/8',
        '',
        'Eighths to memorize:',
        '  0.125 = 1/8    0.25 = 1/4    0.375 = 3/8    0.5 = 1/2',
        '  0.625 = 5/8    0.75 = 3/4    0.875 = 7/8'
      ]
    },
    'dec-from-fraction': {
      title: 'Converting a Fraction to a Decimal',
      progression: [
        'Divide the numerator by the denominator:',
        '',
        'Example: 3/4 → 3 ÷ 4 = 0.75',
        'Example: 5/8 → 5 ÷ 8 = 0.625',
        '',
        'Eighths to memorize:',
        '  1/8 = 0.125    2/8 = 0.25     3/8 = 0.375    4/8 = 0.5',
        '  5/8 = 0.625    6/8 = 0.75     7/8 = 0.875',
        '',
        'Common thirds and sixths:',
        '  1/3 ≈ 0.333    2/3 ≈ 0.667',
        '  1/6 ≈ 0.167    5/6 ≈ 0.833'
      ]
    },
    'dec-arithmetic': {
      title: 'Decimal Arithmetic',
      progression: [
        'Addition / Subtraction:',
        '  Align the decimal points, pad with zeros, then add or subtract',
        '  Example: 5.30 - 2.75 = 2.55',
        '',
        'Multiplication:',
        '  Ignore decimals and multiply as whole numbers',
        '  Count total decimal places in both factors',
        '  Place the decimal point that many places from the right',
        '  Example: 2.5 × 1.2 → 25 × 12 = 300 → 2 places → 3.00',
        '',
        'Division:',
        '  Shift the decimal in the divisor to make it a whole number',
        '  Shift the decimal in the dividend the same number of places',
        '  Example: 7.5 ÷ 2.5 → 75 ÷ 25 = 3'
      ]
    },

    // --- Trade Math ---
    'trade-feet-inches': {
      title: 'Feet ↔ Inches Conversion',
      progression: [
        '1 foot = 12 inches',
        '',
        'Feet to inches — multiply by 12:',
        '  Example: 3\'-6" → (3 × 12) + 6 = 36 + 6 = 42"',
        '',
        'Inches to feet — divide by 12:',
        '  Example: 50" → 50 ÷ 12 = 4 remainder 2 → 4\'-2"',
        '',
        'The quotient is the feet, the remainder is the inches'
      ]
    },
    'trade-fraction-add': {
      title: 'Adding Fractional Inches — Butterfly Method',
      progression: [
        'Example: 5/8" + 3/4"',
        'Cross-multiply each numerator by the other denominator:',
        '  5 × 4 = 20 and 3 × 8 = 24',
        'Add the cross products for the new numerator: 20 + 24 = 44',
        'Multiply the denominators for the new denominator: 8 × 4 = 32',
        'Result: 44/32',
        'Convert to mixed number: 44 ÷ 32 = 1 remainder 12 → 1 12/32',
        'Reduce the fraction: 12/32 → ÷4 → 3/8',
        '= 1 3/8"',
        '',
        'Standard tape measure denominators: 2, 4, 8, 16'
      ]
    },
    'trade-mixed-measure': {
      title: 'Adding Mixed Measurements',
      progression: [
        'Example: 2\'-3 1/4" + 1\'-9 3/4"',
        'Add feet: 2 + 1 = 3',
        'Add inches: 3 + 9 = 12 → 12" = 1\' → carry the foot',
        'Add fractions (butterfly or same denominator): 1/4 + 3/4 = 4/4 = 1"',
        '  → carry the inch',
        'Combine: 3\' + 1\' (carried) + 0" + 1" (carried)',
        '= 4\'-1"',
        '',
        'If inches ≥ 12, carry a foot',
        'If the fraction ≥ 1, carry an inch'
      ]
    },
    'trade-decimal-fraction': {
      title: 'Decimal ↔ Fraction Conversion (Trade)',
      progression: [
        'Decimal to fraction — multiply by the denominator you want:',
        '  Example: 0.375" → 0.375 × 8 = 3 → 3/8"',
        '',
        'Fraction to decimal — divide numerator by denominator:',
        '  Example: 3/8" → 3 ÷ 8 = 0.375"',
        '',
        'Eighths to memorize:',
        '  0.125 = 1/8    0.25 = 1/4    0.375 = 3/8    0.5 = 1/2',
        '  0.625 = 5/8    0.75 = 3/4    0.875 = 7/8'
      ]
    }
  };

  return {
    get: function (operator, numberType) {
      var key = operator + '-' + numberType;
      return TIPS[key] || null;
    },

    getByKey: function (key) {
      return TIPS[key] || null;
    },

    getMultTip: function (factor) {
      return TIPS['mult-' + factor] || null;
    },

    getTradeTip: function (type) {
      return TIPS['trade-' + type] || null;
    },

    renderTip: function (tip) {
      if (!tip) return '';
      var html = '<div class="tip-title">' + tip.title + '</div>';
      html += '<div class="tip-progression">';
      for (var i = 0; i < tip.progression.length; i++) {
        var line = tip.progression[i];
        if (line === '') {
          html += '<div class="tip-spacer"></div>';
        } else if (line.substring(0, 2) === '= ') {
          html += '<div class="tip-step tip-answer">' + line + '</div>';
        } else if (line.substring(0, 2) === '  ') {
          html += '<div class="tip-step tip-indent">' + line + '</div>';
        } else {
          html += '<div class="tip-step">' + line + '</div>';
        }
      }
      html += '</div>';
      return html;
    }
  };
})();
