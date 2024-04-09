'use strict';

import axios from 'axios';

export default async function getImages(searchWord, page = 1) {
  const searchList = new URLSearchParams({
    key: '43306463-04f5e758a9e005b63fe743cb3',
    q: searchWord,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  });

  const imagesData = await axios.get(`https://pixabay.com/api/?${searchList}`);

  return imagesData.data;
}
