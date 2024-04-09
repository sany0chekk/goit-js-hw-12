'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import getImages from './pixabay-api';

const galleryEl = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.more-btn');

let totalImages = 0;
let currentPage = 1;
let currentQuery = '';
let cardHeight = 0;
const perPage = 15;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export async function searchImages(event) {
  event.preventDefault();

  const searchQuery = event.target.search.value.trim();

  if (!searchQuery) {
    showWarning('The field cannot be empty!');
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;

  event.target.search.value = '';

  showElement(loader);

  galleryEl.innerHTML = '';

  loadImages();
}

async function loadImages() {
  showElement(loader);
  hideElement(loadMoreBtn);

  try {
    const data = await getImages(currentQuery, currentPage);
    totalImages = data.totalHits;

    if (data.totalHits === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please, try again!'
      );
      return;
    }
    renderImages(data.hits);
  } catch (error) {
    console.log(error);
    showError('Oops, something went wrong. Please, try again later!');
  } finally {
    hideElement(loader);
  }
}

export async function loadMoreImages() {
  currentPage += 1;

  loadImages();
}

function renderImages(array) {
  const createImages = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="gallery-item">
        <a href="${largeImageURL}" class="gallery-item-link">
          <img src="${webformatURL}" alt="${tags}" class="gallery-item-img" />
          <div class="gallery-item-content">
            <p class="gallery-item-descr">Likes<span>${likes}</span></p>
            <p class="gallery-item-descr">Views<span>${views}</span></p>
            <p class="gallery-item-descr">Comments<span>${comments}</span></p>
            <p class="gallery-item-descr">Donwloads<span>${downloads}</span></p>
          </div>
        </a>
      </li>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', createImages);

  getCardHeight();

  lightbox.refresh();

  if (currentPage * perPage > totalImages) {
    hideElement(loadMoreBtn);
    showWarning("We're sorry, but you've reached the end of search results.");
  } else {
    showElement(loadMoreBtn);
  }

  if (array.length < perPage) {
    hideElement(loadMoreBtn);
  } else {
    showElement(loadMoreBtn);
  }
}

function getCardHeight() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const rect = galleryItem.getBoundingClientRect();
    cardHeight = rect.height;

    if (currentPage > 1) {
      setTimeout(() => {
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }, 300);
    }
  }
}

function showWarning(message) {
  iziToast.warning({
    message,
    position: 'topRight',
  });
}

function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
  });
}

function showElement(element) {
  element.classList.remove('is-hidden');
  element.classList.add('is-active');
}

function hideElement(element) {
  element.classList.remove('is-active');
  element.classList.add('is-hidden');
}
