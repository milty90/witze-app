import {
  fetchJoke,
  fetchJokeWithCategory,
  fetchJokeCategories,
} from "./jokeAPI.js";
import {
  saveJokeToLocalStorage,
  getJokeFromLocalStorage,
  saveCategoryToLocalStorage,
  getCategoryFromLocalStorage,
  saveSettingsToLocalStorage,
  getSettingsFromLocalStorage,
} from "./localStore.js";

let favoriteJokes = [];
let categories = [];
let categoryToggles = [];

const jokeButton = document.getElementById("jokeButton");
const jokeDisplay = document.getElementById("jokeDisplay");
const favoriteButton = document.getElementById("favoriteButton");
const favoriteJokesList = document.getElementById("favoriteJokesList");
const modal = document.getElementById("setting");
const closeModalButton = document.getElementById("closeModalButton");
const openModalButton = document.getElementById("openModalButton");
const categoryContainer = document.getElementById("categoryContainer");
const darkModeToggle = document.getElementById("darkMode");

nextJoke();
initJokes();
applySavedSettings();

async function nextJoke() {
  categories = JSON.parse(getCategoryFromLocalStorage()) || [];

  if (categories.length > 0) {
    const randomIndex = Math.floor(Math.random() * categories.length);
    const category = categories[randomIndex]
      .trim()
      .toLowerCase()
      .replaceAll(" ", "-");
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
    try {
      favoriteJokes = JSON.parse(jokes);
    } catch (error) {
      console.error(error);
    }
  }
}

function removeFavoriteJoke(jokeId) {
  favoriteJokes = favoriteJokes.filter((joke) => joke.jokeId !== jokeId);
  saveJokes(favoriteJokes);
  initJokes();
}

function showFavoriteJokes() {
  favoriteJokesList.innerHTML = "";
  if (favoriteJokes.length === 0) {
    const noFavoritesItem = document.createElement("li");
    noFavoritesItem.className = "joke-app__no-favorites";
    noFavoritesItem.textContent = "Keine Witze gespeichert.";
    favoriteJokesList.appendChild(noFavoritesItem);
    return;
  }

  favoriteJokes.forEach((joke) => {
    const listItem = document.createElement("li");
    const disableFavorite = document.createElement("img");
    listItem.className = "joke-app__favorite";
    listItem.textContent = joke.jokeText;
    disableFavorite.className = "joke-app__disable-icon";
    disableFavorite.src = "/disable-favorite.svg";
    disableFavorite.alt = "Disable Favorite";
    listItem.appendChild(disableFavorite);
    disableFavorite.addEventListener("click", () => {
      removeFavoriteJoke(joke.jokeId);
    });
    favoriteJokesList.appendChild(listItem);
  });
}

function applySavedSettings() {
  const settings = getSettingsFromLocalStorage();
  if (settings && settings.darkMode) {
    document.documentElement.classList.add("dark");
    darkModeToggle.checked = true;
  } else {
    document.documentElement.classList.remove("dark");
    darkModeToggle.checked = false;
  }
}

function renderCategoryToggles() {
  const savedCategories = JSON.parse(getCategoryFromLocalStorage()) || [];
  categoryToggles.forEach((toggle) => {
    const categoryName =
      toggle.parentElement.previousElementSibling.textContent;
    if (savedCategories.includes(categoryName)) {
      toggle.checked = true;
    } else {
      toggle.checked = false;
    }
  });
}

async function rendercategories() {
  let categoryElemens = (await fetchJokeCategories()) || [];
  categoryToggles = [];
  categoryContainer.innerHTML = "";

  categoryElemens.forEach((category) => {
    const categoryItem = document.createElement("div");
    const settingsLabel = document.createElement("label");
    const toggleInput = document.createElement("input");
    const switchContainer = document.createElement("div");

    categoryItem.className = "joke-app__setting-item";
    settingsLabel.className = "joke-app__setting-label";
    toggleInput.className = "joke-app__setting-toggle";
    switchContainer.className = "joke-app__switch";

    settingsLabel.setAttribute("for", `${category.name}Toggle`);
    toggleInput.type = "checkbox";
    toggleInput.id = `${category.name}Toggle`;
    categoryToggles.push(toggleInput);

    settingsLabel.textContent = category.name;
    switchContainer.appendChild(toggleInput);
    categoryItem.appendChild(settingsLabel);
    categoryItem.appendChild(switchContainer);
    categoryContainer.appendChild(categoryItem);

    toggleInput.addEventListener("change", () => {
      if (toggleInput.checked) {
        categories.push(
          toggleInput.parentElement.previousElementSibling.textContent
        );
        saveCategoryToLocalStorage(JSON.stringify(categories));
      } else {
        categories = categories.filter(
          (category) =>
            category !==
            toggleInput.parentElement.previousElementSibling.textContent
        );
        saveCategoryToLocalStorage(JSON.stringify(categories));
      }
    });
  });
}

openModalButton.addEventListener("click", async () => {
  modal.style.display = "flex";
  await rendercategories();
  renderCategoryToggles();
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
  initJokes();
  nextJoke();
});

jokeButton.addEventListener("click", async () => {
  nextJoke();
});

favoriteButton.addEventListener("click", () => {
  const currentJoke = {
    jokeId: new Date().getTime(),
    jokeText: jokeDisplay.textContent,
  };

  const isAlreadySaved = favoriteJokes.some(
    (joke) => joke.jokeText === currentJoke.jokeText
  );

  if (isAlreadySaved) {
    alert("Witz ist bereits gespeichert!");
    return;
  }

  favoriteJokes.push(currentJoke);
  saveJokes(favoriteJokes);
  initJokes();
});

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.documentElement.classList.add("dark");
    saveSettingsToLocalStorage({ darkMode: true });
  } else {
    document.documentElement.classList.remove("dark");
    saveSettingsToLocalStorage({ darkMode: false });
  }
});

// Opcionális: Automatikus dark mode detektálás page load-kor
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  // Ha nincs mentett beállítás, használd a rendszer beállítást
  const savedSettings = getSettingsFromLocalStorage();
  if (!savedSettings || savedSettings.darkMode === undefined) {
    document.documentElement.classList.add("dark");
    darkModeToggle.checked = true;
  }
}
