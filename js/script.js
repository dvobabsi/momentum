import { data } from "./data.js";
import { shuffle, toMinAndSec } from "./utils.js";

//-Variables-
const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greetingElement = document.querySelector('.greeting');
const namegreetingElement = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const cityElement = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector ('.wind');
const humidity = document.querySelector ('.humidity');
const weatherError = document.querySelector('.weather-error');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

const langs = document.querySelectorAll('.lang_button');


const greatingRu = ['Доброй ночи,', 'Доброе утро,','Добрый день,','Добрый вечер,'];
const timeOfDayEng = ['night','morning','afternoon','evening']


//-------------Time and Date-------------------------

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    timeElement.textContent = currentTime;
    showDate();
    showGreeting();
};

setInterval(showTime, 1000);

function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('ru-RU', options);
    dateElement.textContent = currentDate;
};


//------------------------------------Greeting------------------------------------------

function showGreeting() {
    const date = new Date();
    const hours = date.getHours();
    greetingElement.textContent = getTimeOfDay(hours, greatingRu);
};
function getTimeOfDay(d, arr) {
    const h = Math.floor(d / 6);
    return arr[h];
}

function setLocalStorage() {
    localStorage.setItem('name', namegreetingElement.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        namegreetingElement.value = localStorage.getItem('name');
    };
}
window.addEventListener('load', getLocalStorage);

//------------------------------------Slider------------------------------------


function getRandomNum(min, max) {
    let randNum = Math.floor(Math.random() * (max - min) + min);
    return randNum;
}

let randomNumBg = getRandomNum(1, 20);

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

function bgNum () {
    randomNumBg = randomNumBg.toString().padStart(2, "0");
    return randomNumBg;
}



function setBg() {
    const date = new Date();
    const hours = date.getHours();
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/images/${getTimeOfDay(hours, timeOfDayEng)}/${bgNum()}.jpg`;
    img.onload = () => {      
        body.style.backgroundImage = `url('${img.src}')`;
    };
};
setBg();


function getSlideNext() {
    setBg();
    if (randomNumBg < 20) {
        randomNumBg = Number(randomNumBg) + 1;
        return randomNumBg;
    } else {
        randomNumBg = 1;
        return randomNumBg;
    };
};
function getSlidePrev() {
    setBg();
    if (randomNumBg > 1) {
        randomNumBg = randomNumBg - 1;
        return randomNumBg;
    } else {
        randomNumBg = 20;
        return randomNumBg;
    };
};


//---------------------------------Weather------------------------------------

function setLocalStorageCity() {
    localStorage.setItem('city', cityElement.value);
}
window.addEventListener('beforeunload', setLocalStorageCity);

function getLocalStorageCity() {
    if(localStorage.getItem('city')) {
        cityElement.value = localStorage.getItem('city');
    } else {
        cityElement.value = `Минск`;
    };
}
window.addEventListener('load', getLocalStorageCity);

cityElement.addEventListener('change', getWeather);
async function getWeather() {  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityElement.value}&lang=ru&appid=2e79b6f7e08e3c02945038f1d2131c8f&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    if(data.cod === '404') {
        weatherError.textContent = `${data.message}`;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = ``;
        humidity.textContent = ``;
        weatherDescription.textContent = ``;
        wind.textContent = ``;
    } else if (data.cod === '400') {
        weatherError.textContent = `${data.message}`;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = ``;
        weatherDescription.textContent = ``;
        wind.textContent = ``;
        humidity.textContent = ``;
    } else {
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        weatherError.textContent = '';
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Ветер: ${data.wind.speed} м/с`;
        humidity.textContent = `Влажность: ${data.main.humidity} %`;
    };
}
window.addEventListener('load', getWeather);

//----------------------------Цитаты-----------------------
// changeQuote.addEventListener('click', getQuotes);



async function getQuotes() {
    const quotesUrl = `https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/json/data.json`;
    const quotesRes = await fetch(quotesUrl);
    const quotesData = await quotesRes.json(); 
    randQuotes(quotesData);
}



function randQuotes(data) {
    let randQuote = getRandomNum(0, data.length);
    quote.textContent = `${data[randQuote].text}`;
    author.textContent = `${data[randQuote].author}`;
}
getQuotes();
changeQuote.addEventListener('click', getQuotes);


//--------------------------Audio-------------------

const AudioController = {
  state: {
    audios: [],
    current: {},
    repeating: false,
    playing: false,
    volume: 0.5,
  },

  init() {
    this.initVariables();
    this.initEvents();
    this.renderAudios();
  },

  initVariables() {
    this.playButton = null;
    this.audioList = document.querySelector(".items");
    this.currentItem = document.querySelector(".current");
    this.repeatButton = document.querySelector(".handling-repeat");
    this.volumeButton = document.querySelector(".controls-volume");
    this.shuffleButton = document.querySelector(".handling-shuffle");
  },

  initEvents() {
    this.audioList.addEventListener("click", this.handleItem.bind(this));
    this.repeatButton.addEventListener("click", this.handleRepeat.bind(this));
    this.volumeButton.addEventListener("change", this.handleVolume.bind(this));
    this.shuffleButton.addEventListener("click", this.handleShuffle.bind(this));
  },

  handleShuffle() {
    const { children } = this.audioList;
    const shuffled = shuffle([...children]);

    this.audioList.innerHTML = "";
    shuffled.forEach((item) => this.audioList.appendChild(item));
  },

  handleVolume({ target: { value } }) {
    const { current } = this.state;

    this.state.volume = value;

    if (!current?.audio) return;

    current.audio.volume = value;
  },

  handleRepeat({ currentTarget }) {
    const { repeating } = this.state;

    currentTarget.classList.toggle("active", !repeating);
    this.state.repeating = !repeating;
  },

  handleAudioPlay() {
    const { playing, current } = this.state;
    const { audio } = current;

    !playing ? audio.play() : audio.pause();

    this.state.playing = !playing;

    this.playButton.classList.toggle("playing", !playing);
  },

  handleNext() {
    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const next = currentItem.nextSibling?.dataset;
    const first = this.audioList.firstChild?.dataset;

    const itemId = next?.id || first?.id;

    if (!itemId) return;

    this.setCurrentItem(itemId);
  },

  handlePrev() {
    const { current } = this.state;

    const currentItem = document.querySelector(`[data-id="${current.id}"]`);
    const prev = currentItem.previousSibling?.dataset;
    const last = this.audioList.lastChild?.dataset;

    const itemId = prev?.id || last?.id;

    if (!itemId) return;

    this.setCurrentItem(itemId);
  },

  handlePlayer() {
    const play = document.querySelector(".controls-play");
    const next = document.querySelector(".controls-next");
    const prev = document.querySelector(".controls-prev");

    this.playButton = play;

    play.addEventListener("click", this.handleAudioPlay.bind(this));
    next.addEventListener("click", this.handleNext.bind(this));
    prev.addEventListener("click", this.handlePrev.bind(this));
  },

  audioUpdateHandler({ audio, duration }) {
    const progress = document.querySelector(".progress-current");
    const timeline = document.querySelector(".timeline-start");

    audio.addEventListener("timeupdate", ({ target }) => {
      const { currentTime } = target;
      const width = (currentTime * 100) / duration;

      timeline.innerHTML = toMinAndSec(currentTime);
      progress.style.width = `${width}%`;
    });

    audio.addEventListener("ended", ({ target }) => {
      target.currentTime = 0;
      progress.style.width = `0%`;

      this.state.repeating ? target.play() : this.handleNext();
    });
  },

  renderCurrentItem({ id, link, track, year, group, duration }) {
    const [image] = link.split(".");

    return `<div
            class="current-image"
            style="background-image: url(./assets/images/${id}.jpg)"
          ></div>

          <div class="current-info">
            <div class="current-info__top">
              <div class="current-info__titles">
                <h2 class="current-info__group">${group}</h2>
                <h3 class="current-info__track">${track}</h3>
              </div>

              <div class="current-info__year">${year}</div>
            </div>

            <div class="controls">
              <div class="controls-buttons">
                <button class="controls-button controls-prev">
                  <svg version="1.1" class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <title>backward</title>
                    <path fill="#fff" d="M32 64c17.673 0 32-14.327 32-32s-14.327-32-32-32-32 14.327-32 32 14.327 32 32 32zM32 6c14.359 0 26 11.641 26 26s-11.641 26-26 26-26-11.641-26-26 11.641-26 26-26zM44 42l-14-10 14-10zM28 42l-14-10 14-10z"></path>
                  </svg>
                </button>

                <button class="controls-button controls-play">
                  <svg class="icon-pause" version="1.1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <title>pause</title>
                    <path fill="#fff" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM20 20h8v24h-8zM36 20h8v24h-8z"></path>
                  </svg>
                  <svg class="icon-play" version="1.1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <title>play2</title>
                    <path fill="#fff" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM24 18l24 14-24 14z"></path>
                  </svg>
                </button>

                <button class="controls-button controls-next">
                <svg version="1.1" class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                    <title>backward</title>
                    <path fill="#fff" d="M32 64c17.673 0 32-14.327 32-32s-14.327-32-32-32-32 14.327-32 32 14.327 32 32 32zM32 6c14.359 0 26 11.641 26 26s-11.641 26-26 26-26-11.641-26-26 11.641-26 26-26zM44 42l-14-10 14-10zM28 42l-14-10 14-10z"></path>
                </svg>
                </button>
              </div>

              <div class="controls-progress">
                <div class="progress">
                  <div class="progress-current"></div>
                </div>

                <div class="timeline">
                  <span class="timeline-start">00:00</span>
                  <span class="timeline-end">${toMinAndSec(duration)}</span>
                </div>
              </div>
            </div>
          </div>`;
  },

  pauseCurrentAudio() {
    const {
      current: { audio },
    } = this.state;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  },

  togglePlaying() {
    const { playing, current } = this.state;
    const { audio } = current;

    playing ? audio.play() : audio.pause();

    this.playButton.classList.toggle("playing", playing);
  },

  setCurrentItem(itemId) {
    const current = this.state.audios.find(({ id }) => +id === +itemId);

    if (!current) return;

    this.pauseCurrentAudio();

    this.state.current = current;
    this.currentItem.innerHTML = this.renderCurrentItem(current);

    current.audio.volume = this.state.volume;

    this.handlePlayer();
    this.audioUpdateHandler(current);

    setTimeout(() => {
      this.togglePlaying();
    }, 5);
  },

  handleItem({ target }) {
    const { id } = target.dataset;

    if (!id) return;

    this.setCurrentItem(id);
  },

  renderItem({ id, link, track, genre, group, duration }) {
    const [image] = link.split(".");

    return `<div class="item" data-id="${id}">
            <div
              class="item-image"
              style="background-image: url(./assets/images/${id}.jpg)"
            ></div>

            <div class="item-titles">
              <h2 class="item-group">${group}</h2>
              <h3 class="item-track">${track}</h3>
            </div>

            <p class="item-duration">${toMinAndSec(duration)}</p>
            <p class="item-genre">${genre}</p>

            <button class="item-play">
              <svg class="icon-play">
                <use xlink:href="./assets/images/sprite.svg#play"></use>
              </svg>
            </button>
          </div>`;
  },

  loadAudioData(audio) {
    this.audioList.innerHTML += this.renderItem(audio);
  },

  renderAudios() {
    data.forEach((item) => {
      const audio = new Audio(item.link);

      audio.addEventListener("loadeddata", () => {
        const newItem = { ...item, duration: audio.duration, audio };

        this.state.audios.push(newItem);
        this.loadAudioData(newItem);
      });
    });
  },
};

AudioController.init();



//lang

const loggleLang = () => {
    langs.forEach(item => {
        item.addEventListener('click', function(event) {
            item.classList.toggle('lang_active');
        })
    });
}

loggleLang();
