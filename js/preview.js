'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var socialComments = bigPicture.querySelector('.social__comments');
  var commentsCountBlock = bigPicture.querySelector('.social__comment-count');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  window.closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', window.onDocumentEscPress);
  };

  window.showBigPicture = function (picture) {
    bigPictureImg.src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    socialComments.textContent = '';

    socialComments.appendChild(window.getCommentsFragment(picture.comments));

    commentsCountBlock.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');

    bigPicture.classList.remove('hidden');

    bigPictureCancel.addEventListener('click', function () {
      window.closeBigPicture();
    });

    document.addEventListener('keydown', window.onDocumentEscPress);
  };

})();
