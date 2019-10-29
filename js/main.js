'use strict';

var SHOWN_PICTURES = 25;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAMES = ['Валера', 'Олег', 'Василий', 'Мария', 'Анна', 'Анатолий'];
var ESC_KEYCODE = 27;

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createUserComments = function () {
  var userComments = [];
  for (var i = 1; i <= getRandomInt(1, 10); i++) {
    userComments.push({
      avatar: 'img/avatar-' + getRandomInt(1, 6) + '.svg',
      message: COMMENTS[getRandomInt(0, COMMENTS.length - 1)],
      name: NAMES[getRandomInt(0, NAMES.length - 1)]
    });
  }
  return userComments;
};

var createPictures = function () {
  var pictures = [];
  for (var i = 1; i <= SHOWN_PICTURES; i++) {
    pictures.push({
      url: 'photos/' + getRandomInt(1, SHOWN_PICTURES) + '.jpg',
      description: ' ',
      likes: getRandomInt(15, 200),
      comments: createUserComments()
    });
  }
  return pictures;
};

var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');

var getCommentsFragment = function (comments) {
  var fragment = document.createDocumentFragment();
  var commentsVisible = 5;

  for (var i = 0; i < comments.length && i <= commentsVisible - 1; i++) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comments[i].avatar;
    commentElement.querySelector('.social__picture').alt = comments[i].name;
    commentElement.querySelector('.social__text').textContent = comments[i].message;
    fragment.appendChild(commentElement);
  }

  return fragment;
};

var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
var socialComments = bigPicture.querySelector('.social__comments');
var commentsCountBlock = bigPicture.querySelector('.social__comment-count');
var commentsLoader = bigPicture.querySelector('.comments-loader');
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
  }
};

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var showBigPicture = function (picture) {
  bigPictureImg.src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  socialComments.textContent = '';

  socialComments.appendChild(getCommentsFragment(picture.comments));

  commentsCountBlock.classList.add('visually-hidden');
  commentsLoader.classList.add('visually-hidden');

  bigPicture.classList.remove('hidden');

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

  document.addEventListener('keydown', onBigPictureEscPress);
};

var pictures = createPictures();

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  pictureElement.addEventListener('click', function () {
    showBigPicture(picture);
  });

  return pictureElement;
};

var fragment = document.createDocumentFragment();

pictures.forEach(function (picture) {
  fragment.appendChild(renderPicture(picture));
});

picturesList.appendChild(fragment);

//  новое задание
var uploadFile = document.querySelector('#upload-file');
var editForm = document.querySelector('.img-upload__overlay');
var editFormCancel = editForm.querySelector('#upload-cancel');
var effectLevelPin = editForm.querySelector('.effect-level__pin');
var effectsRadio = editForm.querySelectorAll('.effects__radio');
var previewImg = editForm.querySelector('.img-upload__preview');

var currentEffect = 'effect-none';

//  пока статична, т.к. ползунок еще не двигается
var pinPosition = 0.2;

var onEditFormEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onEditFormCancelClick();
  }
};

var onUploadFileChange = function () {
  editForm.classList.remove('hidden');
  document.addEventListener('keydown', onEditFormEscPress);

  currentEffect = 'effect-none';
  previewImg.className = 'effects__preview--' + currentEffect;
  previewImg.style.filter = getSaturationFilter();
};

var onEditFormCancelClick = function () {
  editForm.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onEditFormEscPress);
};

uploadFile.addEventListener('change', onUploadFileChange);

editFormCancel.addEventListener('click', onEditFormCancelClick);

//  применение фильтров
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

//  изменение размера
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;

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

//  валидация хэштегов
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
