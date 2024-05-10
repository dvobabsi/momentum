//------------------------------------Variables------------------------------------
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
const playPrevBtn = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const playListContainerArr = document.querySelectorAll('.play-list');
const lineTime = document.querySelector('.line-time');
const playTime = document.querySelector('.play-time');
const playTimeAll = document.querySelector('.play-time-all');
const nameTrack = document.querySelector('.name-track');
const langs = document.querySelectorAll('.lang_button');


const greatingRu = ['Доброй ночи,', 'Доброе утро,','Добрый день,','Добрый вечер,'];
const timeOfDayEng = ['night','morning','afternoon','evening']


//------------------------------------Time and Date------------------------------------

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    timeElement.textContent = currentTime;
    showDate();
    showGreeting();
    // setInterval(showTime, 1000);
};
// showTime();
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
const playList = [
    {
        author: 'AnnenMayKantereit',
        title: 'Ganz egal',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/Ganz egal.mp3',
        duration: '02:10'
    },
    {
        author: 'AnnenMayKantereit',
        title: 'Gegenwartsbewältigung',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/Gegenwartsbewältigung.mp3',
        duration: '01:44'
    },
    {
        author: 'AnnenMayKantereit',
        title: 'Podojdi',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/Podojdi.mp3',
        duration: '02:46'
    },
    {
        author: 'AnnenMayKantereit',
        title: 'So laut so leer',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/So laut so leer.mp3',
        duration: '02:44'
    },
    {
        author: 'AnnenMayKantereit',
        title: 'So wies war',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/So wies war.mp3',
        duration: '00:47'
    },
    {
        author: 'AnnenMayKantereit',
        title: 'Vergangenheit',
        src: 'https://raw.githubusercontent.com/dvobabsi/stage0-tasks/assets/sounds/AnnenMayKantereit/Vergangenheit.mp3',
        duration: '01:56'
    }
];


const audio = new Audio();
let isPlay = false;
let playNum = 0;
const playListArr = playListContainer.children;
let playTrack = playListArr[0];
let currentTimeAudio = 0;


function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = currentTimeAudio;
    isPlay = true;
    audio.play();
    // console.log(audio.currentTime);
};

function pauseAudio() {
    isPlay = false;
    audio.pause();
    currentTimeAudio = audio.currentTime;
    // console.log(audio.currentTime);
};

play.addEventListener('click', toggleBtn);
function toggleBtn() {
    if(play.classList.contains('pause') === false) {
        playAudio();
        play.classList.toggle('pause');
    } else {
        pauseAudio();
        play.classList.toggle('pause');
    }
}
audio.addEventListener('ended', playNext);



playList.forEach(el => {
    const li = document.createElement('li');
    playListContainer.append(li);
    li.classList.add('play-item');
    li.textContent = `${el.title} | ${el.duration}`;
});
// console.log(playListArr);
playListArr[playNum].classList.add('item-active');

// playListContainer.addEventListener("click", function(e) {
//     let target = e.target;
//     if (target.className == "play-item") {
//         alert('+++ ');
//         console.log(playListContainer.indexOf(target));
//     }
//   });

const listItems = document.querySelectorAll('.play-item');

listItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const itemIndex = Array.from(listItems).indexOf(item);
        console.log(itemIndex);
        playNum = itemIndex;
        playAudio();
        removeClassActive();
        item.classList.add('item-active');
        if(play.classList.contains('pause') === false) {
            toggleBtn();
        }
    });
});

// playListArr.forEach(el => {
//     el.addEventListener('click', function () {
//         playNum = playListArr.childElementCount;
//         playAudio();
//     })
// });

function removeClassActive() {
    for(let i = 0; i < playListArr.length; i = i + 1) {
        if (playListArr[i] !== playListArr[playNum]) {
            playListArr[i].classList.remove('item-active');
        };
    };
}


// const playItem = document.querySelectorAll('play-item');

function playNext() {
    if (playNum < playListArr.length - 1) {
        playNum = playNum + 1;
        playAudio();
        play.classList.add('pause');
        playListArr[playNum].classList.add('item-active');
        removeClassActive();
        currentTimeAudio = 0;
        return console.log(playNum);
    } else {
        playNum = 0;
        playAudio();
        playListArr[playNum].classList.add('item-active');
        removeClassActive();
        currentTimeAudio = 0;
        return console.log(playNum);
    };
};
function playPrev() {
    if (playNum > 0) {
        playNum = playNum - 1;
        playAudio();
        play.classList.add('pause');
        playListArr[playNum].classList.add('item-active');
        removeClassActive();
        currentTimeAudio = 0;
        return console.log(playNum);
    } else {
        playNum = playListArr.length - 1;
        playAudio();
        playListArr[playNum].classList.add('item-active');
        removeClassActive();
        currentTimeAudio = 0;
        return console.log(playNum);
    };
};

playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);


//--------------------------Audio-+++-------------------

// let time = audio.currentTime;

// audio.addEventListener('timeupdate', (event) => {
//     playTime.textContent = `${time}`;
//     console.log(time);
// });

//mute
const muteElement = document.querySelector('.mute');
const muteActiveElement = document.querySelector('.mute-active');
let isMute = false;
let volumeRate = 1.0;

muteElement.addEventListener('click', mute);
function mute() {
    muteElement.classList.toggle('mute-active');
    if(muteElement.classList.contains('mute-active') == true) {
        audio.muted = true;
    } else {
        audio.muted = false;
    };
};

//volume
const volumeInput = document.getElementById('volume');
volumeInput.value = '100';

volumeInput.addEventListener('click', getVolume)
function getVolume() {
    audio.volume = volumeInput.value / 100;
}

//progress
lineTime.value = '0';
playTime.textContent = '0:00';
playTimeAll.textContent = playList[playNum].duration;


function minSecTime(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}

lineTime.addEventListener('change', function () {
    audio.currentTime = lineTime.value;
    // playTimeAll.textContent = playList[playNum].duration;
});



setTimeout(function tick() {
    lineTime.max = audio.duration;
    lineTime.value = audio.currentTime;
    playTime.textContent = minSecTime(audio.currentTime);
    nameTrack.textContent = playList[playNum].title;
    playTimeAll.textContent = playList[playNum].duration;
    setTimeout(tick, 500);
}
, 500);

// setInterval(console.log(minSecTime(audio.currentTime)), 500);
setInterval(() => {
    const progressBar = document.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    document.querySelector(".play-time").textContent = minSecTime( audio.currentTime);
}, 500);

//lang

const loggleLang = () => {
    langs.forEach(item => {
        item.addEventListener('click', function(event) {
            item.classList.toggle('lang_active');
        })
        
    });
}

loggleLang();
