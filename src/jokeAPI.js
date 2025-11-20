async function fetchJoke() {
    const response = await fetch('https://witzapi.de/api/joke');
    const data = await response.json();
    return data[0].text;
}

function saveJokeToLocalStorage(joke) {
    localStorage.setItem('lastJoke', joke);
}

function getJokeFromLocalStorage() {
    return localStorage.getItem('lastJoke');
}

export { fetchJoke, saveJokeToLocalStorage, getJokeFromLocalStorage };