var Timer = (function () {
  var intervalId = null;
  var remaining = 0;
  var total = 0;

  return {
    start: function (seconds, onTick, onExpire) {
      this.stop();
      total = seconds * 10;
      remaining = total;
      intervalId = setInterval(function () {
        remaining--;
        var secondsLeft = remaining / 10;
        var fraction = remaining / total;
        onTick(secondsLeft, fraction);
        if (remaining <= 0) {
          clearInterval(intervalId);
          intervalId = null;
          onExpire();
        }
      }, 100);
    },

    stop: function () {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    getRemaining: function () {
      return remaining / 10;
    },

    isRunning: function () {
      return intervalId !== null;
    }
  };
})();
