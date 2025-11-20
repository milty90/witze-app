import { fetchJoke, saveJokeToLocalStorage, getJokeFromLocalStorage  } from './jokeAPI.js';      
let favoriteJokes = [];

const jokeButton = document.getElementById('jokeButton');
const jokeDisplay = document.getElementById('jokeDisplay');
const favoriteButton = document.getElementById('favoriteButton');
const favoriteJokesList = document.getElementById('favoriteJokesList');

initJokes();

jokeButton.addEventListener('click', async () => {  
    const joke = await fetchJoke();
    jokeDisplay.textContent = joke;      
});

favoriteButton.addEventListener('click', () => {
    initJokes();
    const currentJoke = {jokeId: new Date().getTime(), jokeText: jokeDisplay.textContent};
    favoriteJokes.push(currentJoke);
    saveJokes(favoriteJokes);
    console.log("Witz gespeichert: " + currentJoke);
   

});

function initJokes() {
    loadJokes();
    showFavoriteJokes();
}
    

function saveJokes(arrayJokes) {
    saveJokeToLocalStorage(JSON.stringify(arrayJokes));
}

function loadJokes() {
    const jokes = getJokeFromLocalStorage();
    if (jokes) {
        favoriteJokes = JSON.parse(jokes);
    }
}

function removeFavoriteJoke(jokeId) {
    favoriteJokes = favoriteJokes.filter(joke => joke.jokeId !== jokeId);
    saveJokes(favoriteJokes);
    initJokes();
}   

function showFavoriteJokes() {
    favoriteJokesList.innerHTML = '';
    favoriteJokes.forEach(joke => {
        const listItem = document.createElement('li');
        listItem.className = 'joke-app__favorite';
        listItem.innerHTML = `<p>${joke.jokeText}</p>
        <img class="joke-app__button-icon" src="public/disable-favorite.svg" 
        alt="Disable Favorite">`;
        listItem.querySelector('img').addEventListener('click', () => {
            removeFavoriteJoke(joke.jokeId);
        });
        favoriteJokesList.appendChild(listItem);
    });

}

