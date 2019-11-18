'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var editForm = document.querySelector('.img-upload__overlay');
  var bigPicture = document.querySelector('.big-picture');

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    onDocumentEscPress: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        if (!bigPicture.classList.contains('hidden')) {
          window.preview.closeBigPicture();
        }
        if (!editForm.classList.contains('hidden')) {
          window.closeEditForm();
        }
      }
    },
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    debounce: function (cb, time) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, time);
      };
    }
  };

})();
