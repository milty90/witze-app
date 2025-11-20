import { fetchJoke, saveJokeToLocalStorage, getJokeFromLocalStorage  } from './jokeAPI.js';      
let favoriteJokes = [];

const jokeButton = document.getElementById('jokeButton');
const jokeDisplay = document.getElementById('jokeDisplay');
const favoriteButton = document.getElementById('favoriteButton');

jokeButton.addEventListener('click', async () => {  
    const joke = await fetchJoke();
    jokeDisplay.textContent = joke;      
}
);

favoriteButton.addEventListener('click', () => {
    loadJokes();
    const currentJoke = {jokeId: new Date().getTime(), jokeText: jokeDisplay.textContent};
    favoriteJokes.push(currentJoke);
    saveJokes(favoriteJokes);
    console.log("Witz gespeichert: " + currentJoke);
    showFavoriteJokes();
});

function saveJokes(arrayJokes) {
    saveJokeToLocalStorage(JSON.stringify(arrayJokes));
}

function loadJokes() {
    const jokes = getJokeFromLocalStorage();
    if (jokes) {
        favoriteJokes = JSON.parse(jokes);
    }
}

function showFavoriteJokes() {

}

