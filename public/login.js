// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    var submitPassword;
    $.fn.spin = function(opts, color, content) {
      var presets;
      presets = {
        tiny: {
          lines: 8,
          length: 2,
          width: 2,
          radius: 3
        },
        small: {
          lines: 8,
          length: 1,
          width: 2,
          radius: 5
        },
        large: {
          lines: 10,
          length: 8,
          width: 4,
          radius: 8
        }
      };
      if (Spinner) {
        return this.each(function() {
          var $this, spinner;
          $this = $(this);
          $this.html("&nbsp;");
          spinner = $this.data("spinner");
          if (spinner != null) {
            spinner.stop();
            $this.data("spinner", null);
            return $this.html(content);
          } else if (opts !== false) {
            if (typeof opts === "string") {
              if (opts in presets) {
                opts = presets[opts];
              } else {
                opts = {};
              }
              if (color) {
                opts.color = color;
              }
            }
            spinner = new Spinner($.extend({
              color: $this.css("color")
            }, opts));
            spinner.spin(this);
            return $this.data("spinner", spinner);
          }
        });
      } else {
        console.log("Spinner class not available.");
        return null;
      }
    };
    submitPassword = function() {
      $('#submit-btn').spin('small');
      return client.post("/login", {
        password: $('#password-input').val()
      }, {
        success: function() {
          var msg;
          $('.alert-error').fadeOut();
          $('#forgot-password').hide();
          msg = "Sign in succeeded";
          if ($(window).width() > 640) {
            $('.alert-success').fadeIn();
            $('.alert-success').html(msg);
            $('#submit-btn').spin(null, null, "Sign in");
          } else {
            $('#submit-btn').spin(null, null, msg);
          }
          return setTimeout(function() {
            var newpath;
            newpath = window.location.pathname.substring(6);
            return window.location.pathname = newpath;
          }, 500);
        },
        error: function(err) {
          var msg;
          $('.alert-success').fadeOut();
          $('.alert-error').hide();
          msg = JSON.parse(err.responseText).msg;
          $('.alert-error').html(msg);
          if ($(window).width() > 640) {
            $('.alert-error').fadeIn();
            $('#submit-btn').spin(null, null, "Sign in");
          } else {
            $('#submit-btn').spin(null, null, "Sign in failed");
          }
          return $('#forgot-password').fadeIn();
        }
      });
    };
    $('#password-input').keyup(function(event) {
      if (event.which === 13) {
        return submitPassword();
      }
    });
    $('#submit-btn').click(function(event) {
      return submitPassword();
    });
    $('#password-input').focus();
    return $('#forgot-password').click(function(event) {
      return client.post("/login/forgot", {}, {
        success: function() {
          $('.alert-error').fadeOut();
          $('.alert-success').fadeIn();
          return $('.alert-success').html("An email have been sent to your mailbox, " + "follow its instructions to get a new password");
        },
        error: function(err) {
          var msg;
          $('.alert-success').fadeOut();
          $('.alert-error').hide();
          msg = JSON.parse(err.responseText).msg;
          $('.alert-error').html(msg);
          return $('.alert-error').fadeIn();
        }
      });
    });
  });

}).call(this);
