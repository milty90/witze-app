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
    initJokes();  
});

favoriteButton.addEventListener('click', () => {
    const currentJoke = {jokeId: new Date().getTime(), jokeText: jokeDisplay.textContent};
    favoriteJokes.push(currentJoke);
    saveJokes(favoriteJokes);
    console.log("Witz gespeichert: " + currentJoke);
    initJokes();

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
        listItem.textContent = joke.jokeText;
        listItem.innerHTML += `
        <img class="joke-app__button-icon" src="$disable-favorite" alt="Disable Favorite">`;
        listItem.querySelector('img').addEventListener('click', () => {
            removeFavoriteJoke(joke.jokeId);
        });
        favoriteJokesList.appendChild(listItem);
    });

}

