import { fetchJoke, fetchJokeWithCategory, fetchJokeCategories } from './jokeAPI.js';     
import { saveJokeToLocalStorage, getJokeFromLocalStorage, saveCatecoryToLocalStorage, getCategoryFromLocalStorage } from './localStore.js';
let favoriteJokes = [];
let categorys = [];

const jokeButton = document.getElementById('jokeButton');
const jokeDisplay = document.getElementById('jokeDisplay');
const favoriteButton = document.getElementById('favoriteButton');
const favoriteJokesList = document.getElementById('favoriteJokesList');
const modal = document.getElementById('setting');
const closeModalButton = document.getElementById('closeModalButton');
const openModalButton = document.getElementById('openModalButton');
const categoryContainer = document.getElementById('categoryContainer');
let categoryToggles = [];

nextJoke();
initJokes();


async function nextJoke() {

    categorys = JSON.parse(getCategoryFromLocalStorage()) || [];

    if (categorys.length > 0) {
        const randomIndex = Math.floor(Math.random() * categorys.length);
        const category = categorys[randomIndex].trim().toLowerCase().replace(' ', '-');
    const joke = await fetchJokeWithCategory(category);
    jokeDisplay.textContent = joke;  
    } else {
        const joke = await fetchJoke();
        jokeDisplay.textContent = joke;  
    }
    
}

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
    if (favoriteJokes.length === 0) {
        const noFavoritesItem = document.createElement('li');
        noFavoritesItem.className = 'joke-app__no-favorites';
        noFavoritesItem.textContent = 'Keine Witze gespeichert.'; 
        favoriteJokesList.appendChild(noFavoritesItem);
        return;
    }

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

async function renderCategoryToggles() {
    const savedCategories = JSON.parse(getCategoryFromLocalStorage()) || [];
    categoryToggles.forEach(toggle => {
        const categoryName = toggle.parentElement.previousElementSibling.textContent;   
        console.log("categoryName: ", categoryName);
        if (savedCategories.includes(categoryName)) {
            toggle.checked = true;
        } else {
            toggle.checked = false;
        }
    });
}

async function renderCategorys() {
    let categoryElemens = await fetchJokeCategories() || [];
    categoryContainer.innerHTML = '';

    categoryElemens.forEach(category => {
        
        const categoryItem = document.createElement('div');
        const settingsLabel = document.createElement('label');
        const toggleInput = document.createElement('input');
        const switchContainer = document.createElement('div');

        categoryItem.className = 'joke-app__setting-item';
        settingsLabel.className = 'joke-app__setting-label';
        toggleInput.className = 'joke-app__setting-toggle';
        switchContainer.className = 'joke-app__switch';

        settingsLabel.setAttribute('for', `${category.name}Toggle`);
        toggleInput.type = 'checkbox';
        toggleInput.id = `${category.name}Toggle`;
        categoryToggles.push(toggleInput);
        

        
        settingsLabel.textContent = category.name;
        switchContainer.appendChild(toggleInput);
        categoryItem.appendChild(settingsLabel);
        categoryItem.appendChild(switchContainer);
        categoryContainer.appendChild(categoryItem);

        toggleInput.addEventListener('change', () => {
        if (toggleInput.checked) {
            categorys.push(toggleInput.parentElement.previousElementSibling.textContent);
            saveCatecoryToLocalStorage(JSON.stringify(categorys));
        } else {
            categorys = categorys.filter(category => category !== toggleInput.parentElement.previousElementSibling.textContent);
            saveCatecoryToLocalStorage(JSON.stringify(categorys));
        }
    });
        
    });
}

openModalButton.addEventListener('click', async () => {
    modal.style.display = 'flex';
    await renderCategorys();
     await renderCategoryToggles();
});

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
}); 

jokeButton.addEventListener('click', async () => {    
    nextJoke();
});

favoriteButton.addEventListener('click', () => {
    const currentJoke = { jokeId: new Date().getTime(), jokeText: jokeDisplay.textContent };
    const isAlreadySaved = favoriteJokes.some(joke => joke.jokeText === currentJoke.jokeText);
    
    if (isAlreadySaved) {
        alert("Witz ist bereits gespeichert!");
        return;
    }
    
    favoriteJokes.push(currentJoke);
    saveJokes(favoriteJokes);
    initJokes();

});




