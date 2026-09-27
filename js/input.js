var InputParser = (function () {

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a || 1;
  }

  return {
    /**
     * Parse a user's answer string into { whole, num, den } form.
     * Accepts: "5", "3.75", "3/4", "1 3/4", "1-3/4", "3'-6\"", "42\""
     * Returns null if unparseable.
     */
    parse: function (raw) {
      if (!raw) return null;
      raw = raw.trim();
      if (!raw) return null;

      // Feet-inches: 3'-6", 3'6", 3' 6"
      var feetInches = raw.match(/^(\d+)[']\s*-?\s*(\d+(?:\s+\d+\/\d+|\s*\d*\/?\d*)?)[""]?$/);
      if (feetInches) {
        var feet = parseInt(feetInches[1]);
        var inchPart = feetInches[2].trim();
        var inchParsed = this.parse(inchPart);
        if (inchParsed) {
          // Convert to total inches
          var totalInches = feet * 12 + inchParsed.whole + (inchParsed.num / inchParsed.den);
          // Return as a rational number (total inches)
          var wholeInches = feet * 12 + inchParsed.whole;
          return { whole: wholeInches, num: inchParsed.num, den: inchParsed.den, isFeetInches: true, feet: feet, inches: inchParsed };
        }
      }

      // Just inches: 42"
      var justInches = raw.match(/^(\d+(?:\.\d+)?)\s*[""]$/);
      if (justInches) {
        return this.parse(justInches[1]);
      }

      // Mixed number: "2 3/4" or "2-3/4"
      var mixedMatch = raw.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
      if (!mixedMatch) mixedMatch = raw.match(/^(-?\d+)-(\d+)\/(\d+)$/);
      if (mixedMatch) {
        var whole = parseInt(mixedMatch[1]);
        var num = parseInt(mixedMatch[2]);
        var den = parseInt(mixedMatch[3]);
        if (den === 0) return null;
        return { whole: whole, num: num, den: den };
      }

      // Fraction: "3/4"
      var fracMatch = raw.match(/^(-?\d+)\/(\d+)$/);
      if (fracMatch) {
        var num = parseInt(fracMatch[1]);
        var den = parseInt(fracMatch[2]);
        if (den === 0) return null;
        return { whole: 0, num: num, den: den };
      }

      // Decimal or whole: "3.75" or "42"
      var numVal = parseFloat(raw);
      if (!isNaN(numVal) && /^-?\d+(\.\d+)?$/.test(raw)) {
        var parts = raw.split('.');
        if (parts.length === 2) {
          var places = parts[1].length;
          var den = Math.pow(10, places);
          var totalNum = Math.round(numVal * den);
          var g = gcd(Math.abs(totalNum), den);
          return { whole: 0, num: totalNum / g, den: den / g };
        }
        return { whole: parseInt(raw), num: 0, den: 1 };
      }

      return null;
    },

    /**
     * Compare user answer to correct answer.
     * Both in { whole, num, den } form.
     * Returns true if equal.
     */
    compare: function (userAnswer, correctAnswer) {
      if (!userAnswer || !correctAnswer) return false;

      // Convert both to improper fractions
      var uNum = userAnswer.whole * userAnswer.den + userAnswer.num;
      var uDen = userAnswer.den;
      var cNum = correctAnswer.whole * correctAnswer.den + correctAnswer.num;
      var cDen = correctAnswer.den;

      // Cross multiply to compare
      return uNum * cDen === cNum * uDen;
    },

    /**
     * Compare allowing decimal tolerance (for decimal answer display).
     */
    compareDecimal: function (userAnswer, correctDecimal) {
      if (!userAnswer) return false;
      var userVal = userAnswer.whole + userAnswer.num / userAnswer.den;
      return Math.abs(userVal - correctDecimal) < 0.001;
    }
  };
})();
