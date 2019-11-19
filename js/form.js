'use strict';

(function () {

  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;

  var PIN_POSITION_X_MAX = 453;
  var PIN_POSITION_X_MIN = 0;
  var SATURATION_RATIO = 1 / PIN_POSITION_X_MAX;

  var FILE_TYPES = ['.gif', '.jpg', '.jpeg', '.png'];
  var DEFAULT_PREVIEW_PATH = 'img/upload-default-image.jpg';

  var uploadFile = document.querySelector('#upload-file');
  var editForm = document.querySelector('.img-upload__overlay');
  var editFormCancel = editForm.querySelector('#upload-cancel');
  var effectLevelPin = editForm.querySelector('.effect-level__pin');
  var effectLevelDepth = editForm.querySelector('.effect-level__depth');
  var effectsRadio = editForm.querySelectorAll('.effects__radio');
  var previewImg = editForm.querySelector('.img-upload__preview img');
  var effectLevel = editForm.querySelector('.img-upload__effect-level');

  var hashtagField = document.querySelector('.text__hashtags');
  var descriptionField = document.querySelector('.text__description');

  var scaleControlSmaller = editForm.querySelector('.scale__control--smaller');
  var scaleControlBigger = editForm.querySelector('.scale__control--bigger');
  var scaleControlValue = editForm.querySelector('.scale__control--value');

  var currentEffect = 'effect-none';

  //  очищаем value загруженного файла
  var clearUploadFile = function () {
    uploadFile.value = '';
    hashtagField.value = '';
    descriptionField.value = '';
    previewImg.src = DEFAULT_PREVIEW_PATH;
  };

  var onUploadFileChange = function () {

    var file = uploadFile.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewImg.src = reader.result;
        });

        reader.readAsDataURL(file);
        showEditForm();
      }
    }

  };

  var showEditForm = function () {
    editForm.classList.remove('hidden');
    document.addEventListener('keydown', window.util.onDocumentEscPress);

    scaleControlValue.value = SCALE_MAX + '%';
    previewImg.style.transform = 'scale(' + SCALE_MAX / 100 + ')';

    addClass(effectsRadio[0]);

  };

  window.closeEditForm = function () {

    if (document.activeElement !== hashtagField && document.activeElement !== descriptionField) {
      editForm.classList.add('hidden');
      clearUploadFile();

      document.removeEventListener('keydown', window.util.onDocumentEscPress);
    }
  };

  uploadFile.addEventListener('change', onUploadFileChange);

  editFormCancel.addEventListener('click', function () {
    window.closeEditForm();
  });

  // применение фильтров
  var getSaturationFilter = function (pinPosition) {

    var saturationFilter = 'none';

    effectLevel.style.display = 'block';

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
        saturationFilter = 'brightness(' + ((pinPosition * 2) + 1) + ')';
        break;
      }
      default:
        effectLevel.style.display = 'none';
        saturationFilter = 'none';
    }
    return saturationFilter;
  };

  var changePin = function (positionX) {
    effectLevelPin.style.left = positionX + 'px';
    effectLevelDepth.style.width = positionX + 'px';

    previewImg.style.filter = getSaturationFilter((positionX) * SATURATION_RATIO);
  };

  var addClass = function (effect) {
    previewImg.className = 'effects__preview--' + effect.value;
    currentEffect = effect.value;
    changePin(PIN_POSITION_X_MAX);
  };

  effectsRadio.forEach(function (effect) {
    effect.addEventListener('click', function () {
      addClass(effect);
    });
  });

  //  ползунок
  var startX = 0;

  var onEffectLevelPinMousemove = function (evt) {

    var shiftX = startX - evt.clientX;
    var currentX = effectLevelPin.offsetLeft - shiftX;

    editForm.style.userSelect = 'none';

    startX = evt.clientX;

    if (currentX >= PIN_POSITION_X_MIN && currentX <= PIN_POSITION_X_MAX) {
      changePin(currentX);
    }
  };

  var onEffectLevelPinMouseup = function () {

    previewImg.style.filter = getSaturationFilter();

    document.removeEventListener('mousemove', onEffectLevelPinMousemove);
    document.removeEventListener('mouseup', onEffectLevelPinMouseup);

    editForm.style.userSelect = 'initial';

  };

  effectLevelPin.addEventListener('mousedown', function (evt) {

    startX = evt.clientX;

    document.addEventListener('mousemove', onEffectLevelPinMousemove);
    document.addEventListener('mouseup', onEffectLevelPinMouseup);

  });

  // изменение размера
  scaleControlValue.value = '100%';
  var currentScaleControl = SCALE_MAX;

  var changeSize = function (isReduce) {

    currentScaleControl = isReduce ? currentScaleControl - SCALE_STEP : currentScaleControl + SCALE_STEP;

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
  var isHashSymbolFirst = function (hashtag) {
    return hashtag[0] === '#';
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

  var isHashtagsContainsSpaces = function (tags) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].slice(0).indexOf('#')) {
        return false;
      }
    }
    return true;
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
      } else if (hashtag.length === 1) {
        hashtagField.setCustomValidity('Хэш-тег не может состоять только из одной решётки');
      } else if (hashtag.length > 20) {
        hashtagField.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая решётку');
      } else if (!isHashtagsContainsSpaces(hashtag)) {
        hashtagField.setCustomValidity('Хэш-теги должны быть разделены пробелами');
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

  // работа с окном успешной отправки данных на сервер
  var succesTemplateElement = document.querySelector('#success').content.querySelector('.success');
  var imgUploadForm = document.querySelector('.img-upload__form');

  var successItem = succesTemplateElement.cloneNode(true);
  successItem.style.display = 'none';
  document.querySelector('main').insertAdjacentElement('afterbegin', successItem);

  var successButtonElement = successItem.querySelector('.success__button');

  var onSuccessMessageClose = function () {
    successItem.style.display = 'none';
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      onSuccessMessageClose();
    }
  };

  successButtonElement.addEventListener('click', onSuccessMessageClose);
  successItem.addEventListener('click', onSuccessMessageClose);

  var onUploadSuccess = function () {

    window.closeEditForm();

    successItem.style.display = 'flex';

    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  //  отправка данных на сервер
  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.api.send(new FormData(imgUploadForm), onUploadSuccess, window.api.onServerRequestError);
  });

})();
