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
        const disableFavorite = document.createElement('img');
        listItem.className = 'joke-app__favorite';
        listItem.textContent = joke.jokeText;
        disableFavorite.className = 'joke-app__disable-icon';
        disableFavorite.src = '/disable-favorite.svg';
        disableFavorite.alt = 'Disable Favorite';
        listItem.appendChild(disableFavorite);
        disableFavorite.addEventListener('click', () => {
            removeFavoriteJoke(joke.jokeId);
        });
        favoriteJokesList.appendChild(listItem);
    });

}

