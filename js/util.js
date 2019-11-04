'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var editForm = document.querySelector('.img-upload__overlay');
  var bigPicture = document.querySelector('.big-picture');

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE
  };

  window.onDocumentEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (!bigPicture.classList.contains('hidden')) {
        window.closeBigPicture();
      }
      if (!editForm.classList.contains('hidden')) {
        window.onEditFormCancelClick();
      }
    }
  };
})();
