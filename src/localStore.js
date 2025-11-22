function saveJokeToLocalStorage(joke) {
    localStorage.setItem('lastJoke', joke);
}

function getJokeFromLocalStorage() {
    return localStorage.getItem('lastJoke');
}

function saveCatecoryToLocalStorage(category) {
    localStorage.setItem('jokeCategory', category);
}

function getCategoryFromLocalStorage() {
    return localStorage.getItem('jokeCategory');
}

function saveSettingsToLocalStorage(settings) {
    localStorage.setItem('jokeSettings', JSON.stringify(settings));
}

function getSettingsFromLocalStorage() {
    const settings = localStorage.getItem('jokeSettings');
    return settings ? JSON.parse(settings) : null;
}

export { saveJokeToLocalStorage, getJokeFromLocalStorage, saveCatecoryToLocalStorage, getCategoryFromLocalStorage, saveSettingsToLocalStorage, getSettingsFromLocalStorage };