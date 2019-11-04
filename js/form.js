'use strict';

(function () {

  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;

  var uploadFile = document.querySelector('#upload-file');
  var editForm = document.querySelector('.img-upload__overlay');
  var editFormCancel = editForm.querySelector('#upload-cancel');
  var effectLevelPin = editForm.querySelector('.effect-level__pin');
  var effectsRadio = editForm.querySelectorAll('.effects__radio');
  var previewImg = editForm.querySelector('.img-upload__preview');
  var currentEffect = 'effect-none';

  // пока статична, т.к. ползунок еще не двигается
  var pinPosition = 0.2;

  var onUploadFileChange = function () {
    editForm.classList.remove('hidden');
    document.addEventListener('keydown', window.util.onDocumentEscPress);

    currentEffect = 'effect-none';
    previewImg.className = 'effects__preview--' + currentEffect;
    previewImg.style.filter = getSaturationFilter();
  };

  window.onEditFormCancelClick = function () {
    editForm.classList.add('hidden');
    uploadFile.value = '';
    document.removeEventListener('keydown', window.util.onDocumentEscPress);
  };

  uploadFile.addEventListener('change', onUploadFileChange);

  editFormCancel.addEventListener('click', window.onEditFormCancelClick);

  // применение фильтров
  var getSaturationFilter = function () {

    var saturationFilter = 'none';

    switch (currentEffect) {
      case 'chrome': {
        saturationFilter = 'grayscale(' + pinPosition + ')';
        break;
      }
      case 'sepia': {
        saturationFilter = 'sepia(' + pinPosition + ')';
        break;
      }
      case 'marvin': {
        saturationFilter = 'invert(' + pinPosition * 100 + '%)';
        break;
      }
      case 'phobos': {
        saturationFilter = 'blur(' + pinPosition * 3 + 'px)';
        break;
      }
      case 'heat': {
        saturationFilter = 'brightness(' + pinPosition * 3 + ')';
        break;
      }
      default:
        saturationFilter = 'none';
    }
    return saturationFilter;
  };

  var addClass = function (effect) {
    previewImg.className = 'effects__preview--' + effect.value;
    currentEffect = effect.value;
    pinPosition = 1;
    previewImg.style.filter = getSaturationFilter();
  };

  effectsRadio.forEach(function (effect) {
    effect.addEventListener('click', function () {
      addClass(effect);
    });
  });

  var onEffectLevelPinMouseup = function () {
    previewImg.style.filter = getSaturationFilter();
  };

  effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseup);

  // изменение размера
  var scaleControlSmaller = editForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = editForm.querySelector('.scale__control--bigger');
  var scaleControlValue = editForm.querySelector('.scale__control--value');

  scaleControlValue.value = '100%';
  var currentScaleControl = SCALE_MAX;

  var changeSize = function (isReduce) {
    if (isReduce) {
      currentScaleControl = currentScaleControl - SCALE_STEP;
    } else {
      currentScaleControl = currentScaleControl + SCALE_STEP;
    }
    scaleControlValue.value = currentScaleControl + '%';
    previewImg.style.transform = 'scale(' + currentScaleControl / 100 + ')';
  };

  var onScaleControlSmallerClick = function () {
    if (currentScaleControl > SCALE_MIN) {
      changeSize(true);
    }
  };

  var onScaleControlBiggerClick = function () {
    if (currentScaleControl < SCALE_MAX) {
      changeSize(false);
    }
  };

  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);

  // валидация хэштегов
  var hashtagField = document.querySelector('.text__hashtags');

  var isHashSymbolFirst = function (hashtag) {
    if (hashtag[0] === '#') {
      return true;
    }
    return false;
  };

  var isHashtagsSame = function (tags) {
    var tagsTemp = [];

    for (var i = 0; i < tags.length; i++) {
      if (tagsTemp.includes(tags[i].toLowerCase())) {
        return true;
      }
      tagsTemp.push(tags[i].toLowerCase());
    }

    return false;

  };

  hashtagField.addEventListener('invalid', function () {
    if (!hashtagField.validity.valid) {
      hashtagField.setCustomValidity(hashtagField.validationMessage);
    }
  });

  var onHashtagFieldChange = function () {

    var hashtags = hashtagField.value.split(' ');

    hashtags.forEach(function (hashtag) {
      if (!isHashSymbolFirst(hashtag)) {
        hashtagField.setCustomValidity('Хэш-тег должен начинаться с символа #');
        return;
      } else if (hashtag.length === 1) {
        hashtagField.setCustomValidity('Хэш-тег не может состоять только из одной решётки');
        return;
      } else if (hashtag.length > 20) {
        hashtagField.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
        return;
      } else {
        hashtagField.setCustomValidity('');
      }
    });

    if (hashtags.length > 5) {
      hashtagField.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    } else if (isHashtagsSame(hashtags)) {
      hashtagField.setCustomValidity('Нельзя использовать повторяющиеся хэш-теги');
    }

  };

  hashtagField.addEventListener('input', onHashtagFieldChange);

})();
