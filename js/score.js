var ScoreTracker = (function () {
  var session = null;

  function resetSession() {
    session = {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      streak: 0,
      bestStreak: 0,
      problems: [],
      startTime: Date.now()
    };
  }

  return {
    startSession: function () {
      resetSession();
    },

    recordCorrect: function (problem, timeRemaining) {
      session.correct++;
      session.streak++;
      if (session.streak > session.bestStreak) {
        session.bestStreak = session.streak;
      }
      session.problems.push({
        problem: problem,
        result: 'correct',
        timeRemaining: timeRemaining
      });
    },

    recordIncorrect: function (problem) {
      session.incorrect++;
      session.streak = 0;
      session.problems.push({
        problem: problem,
        result: 'incorrect'
      });
    },

    recordSkipped: function (problem) {
      session.skipped++;
      session.streak = 0;
      session.problems.push({
        problem: problem,
        result: 'skipped'
      });
    },

    getSession: function () {
      return session;
    },

    getSessionSummary: function () {
      var total = session.correct + session.incorrect + session.skipped;
      var pct = total > 0 ? Math.round((session.correct / total) * 100) : 0;
      var elapsed = (Date.now() - session.startTime) / 1000;

      return {
        total: total,
        correct: session.correct,
        incorrect: session.incorrect,
        skipped: session.skipped,
        accuracy: pct,
        streak: session.bestStreak,
        duration: Math.round(elapsed),
        avgTime: total > 0 ? Math.round(elapsed / total * 10) / 10 : 0,
        problems: session.problems
      };
    },

    /**
     * Persist session results into lifetime stats.
     */
    persist: function (mode) {
      var stats = Storage.getStats();
      var lt = stats.lifetime;

      lt.totalProblems += session.correct + session.incorrect + session.skipped;
      lt.correct += session.correct;
      lt.incorrect += session.incorrect;
      lt.skipped += session.skipped;
      if (session.bestStreak > lt.bestStreak) {
        lt.bestStreak = session.bestStreak;
      }

      // By mode
      if (lt.byMode[mode]) {
        lt.byMode[mode].total += session.correct + session.incorrect;
        lt.byMode[mode].correct += session.correct;
      }

      // By operation and number type
      for (var i = 0; i < session.problems.length; i++) {
        var p = session.problems[i];
        var prob = p.problem;

        if (prob.operatorName && lt.byOperation[prob.operatorName]) {
          lt.byOperation[prob.operatorName].total++;
          if (p.result === 'correct') lt.byOperation[prob.operatorName].correct++;
        }

        if (prob.numberType && lt.byNumberType[prob.numberType]) {
          lt.byNumberType[prob.numberType].total++;
          if (p.result === 'correct') lt.byNumberType[prob.numberType].correct++;
        }
      }

      Storage.saveStats(stats);
    },

    /**
     * Record a multiplication fact attempt.
     */
    recordMultFact: function (a, b, correct) {
      var data = Storage.getMultTables();
      var key = a + 'x' + b;
      if (!data.facts[key]) data.facts[key] = { attempts: 0, correct: 0 };
      data.facts[key].attempts++;
      if (correct) data.facts[key].correct++;
      Storage.saveMultTables(data);
    },

    getWeakFacts: function () {
      var data = Storage.getMultTables();
      var facts = [];
      for (var key in data.facts) {
        var f = data.facts[key];
        if (f.attempts >= 3) {
          var pct = Math.round((f.correct / f.attempts) * 100);
          if (pct < 80) {
            facts.push({ key: key, attempts: f.attempts, correct: f.correct, pct: pct });
          }
        }
      }
      facts.sort(function (a, b) { return a.pct - b.pct; });
      return facts.slice(0, 5);
    }
  };
})();
