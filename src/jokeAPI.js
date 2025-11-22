async function fetchJoke() {
    const response = await fetch('https://witzapi.de/api/joke');
    const data = await response.json();
    return data[0].text;
}

async function fetchJokeWithCategory(category) {
const url = `https://witzapi.de/api/joke?category=${encodeURIComponent(category)}`;
const response = await fetch(url);
const jokes = await response.json();
return jokes[0].text;       
}

async function fetchJokeCategories() {
    const url = `https://witzapi.de/api/category`;
    const response = await fetch(url);
    const jokes = await response.json();
    console.log("jokes: ", jokes);
    return jokes;
}

export { fetchJoke, fetchJokeWithCategory, fetchJokeCategories };