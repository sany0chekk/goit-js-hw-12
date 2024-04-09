'use strict';
import { searchImages, loadMoreImages } from './js/render-fuctions';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.more-btn');

searchForm.addEventListener('submit', searchImages);

loadMoreBtn.addEventListener('click', loadMoreImages);
