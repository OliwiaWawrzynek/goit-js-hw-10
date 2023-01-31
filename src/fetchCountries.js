import { Notify } from 'notiflix/build/notiflix-notify-aio';
let _ = require('lodash');

const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
const searchBox = document.querySelector("#search-box");

const DEBOUNCE_DELAY = 300;

const fetchCountries = async name => {
  return await fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length <= 10 && data.length > 1) {
        data.forEach(country => {
          countryListEl(country);
        });
      } else {
        data.forEach(country => {
          countryInfoDetails(country);
        });
      }
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
};

const countryListEl = country => {
  countryList.insertAdjacentHTML(
    'beforeend',
    `<li class="country">
    <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
    <p>${country.name.common}</p>
   </li>`
  );
};

const countryInfoDetails = country => {
  countryInfo.innerHTML = 
  `<img src="${country.flags.svg}" alt="${country.flags.svg}"/>
  <h2>${country.name.common}</h2>
  <p>Capital: ${country.capital}</p>
  <p>Population: ${country.population}</p>
  <p>Languages: ${Object.values(country.languages)}</>`;
};

searchBox.addEventListener(
  'input',
  _.debounce(() => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    if (searchBox.value == '') {
      return;
    } else {
      fetchCountries(searchBox.value.trim());
    }
  }, DEBOUNCE_DELAY)
);
