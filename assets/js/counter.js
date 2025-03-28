(function ($) {
  // Define a jQuery plugin named countTo
  $.fn.countTo = function (options) {
    // Ensure options is an object
    options = options || {};

    return this.each(function () {
      // Merge default settings with user-provided options and data attributes
      var settings = $.extend(
        {},
        $.fn.countTo.defaults,
        {
          from: $(this).data("from"),
          to: $(this).data("to"),
          speed: $(this).data("speed"),
          refreshInterval: $(this).data("refresh-interval"),
          decimals: $(this).data("decimals"),
        },
        options
      );

      var totalSteps = Math.ceil(settings.speed / settings.refreshInterval);
      var increment = (settings.to - settings.from) / totalSteps;

      var $element = $(this);
      var currentValue = settings.from;
      var stepCount = 0;
      var countToData = $element.data("countTo") || {};

      // Store data in the element
      $element.data("countTo", countToData);

      // Clear existing interval if it exists
      if (countToData.interval) {
        clearInterval(countToData.interval);
      }

      // Start the counting interval
      countToData.interval = setInterval(updateValue, settings.refreshInterval);

      // Set initial display value
      updateDisplay(currentValue);

      function updateValue() {
        currentValue += increment;
        stepCount++;
        updateDisplay(currentValue);

        if (typeof settings.onUpdate === "function") {
          settings.onUpdate.call($element, currentValue);
        }

        // Stop the counter when the final value is reached
        if (stepCount >= totalSteps) {
          clearInterval(countToData.interval);
          $element.removeData("countTo");
          currentValue = settings.to;
          updateDisplay(currentValue);

          if (typeof settings.onComplete === "function") {
            settings.onComplete.call($element, currentValue);
          }
        }
      }

      function updateDisplay(value) {
        var formattedValue = settings.formatter(value, settings);
        $element.html(formattedValue);
      }
    });
  };

  // Default settings for the countTo plugin
  $.fn.countTo.defaults = {
    from: 0,
    to: 0,
    speed: 1000,
    refreshInterval: 100,
    decimals: 0,
    formatter: function (value, settings) {
      return value.toFixed(settings.decimals);
    },
    onUpdate: null,
    onComplete: null,
  };
})(jQuery);

// Initialize the counter when the page is loaded
jQuery(function ($) {
  // Custom number formatting to add commas for thousands
  $(".count-number").data("countToOptions", {
    formatter: function (value, options) {
      return value
        .toFixed(options.decimals)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  });

  // Start counting for each element with class 'timer'
  $(".timer").each(function () {
    var $this = $(this);
    var options = $.extend({}, $this.data("countToOptions") || {});
    $this.countTo(options);
  });
});
