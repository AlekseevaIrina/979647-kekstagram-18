'use strict';

var SHOWN_PICTURES = 25;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var NAMES = ['Валера', 'Олег', 'Василий', 'Мария', 'Анна', 'Анатолий'];

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

var pictures = createPictures();

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

pictures.forEach(function (picture) {
  fragment.appendChild(renderPicture(picture));
});

picturesList.appendChild(fragment);
