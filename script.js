// Fetch meals from the Meal API based on the search term
async function searchMeals(searchTerm) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  const data = await response.json();
  return data.meals;
}

// Display the meals on the page
function displayMeals(meals) {
  const mealsContainer = document.getElementById('meals-container');
  mealsContainer.innerHTML = '';

  if (!meals) {
    mealsContainer.innerHTML = '<p>No meals found.</p>';
    return;
  }

  meals.forEach((meal) => {
    const mealCard = createMealCard(meal);

    const addToFavoritesButton = createAddToFavoritesButton(meal);
    mealCard.appendChild(addToFavoritesButton);

    mealsContainer.appendChild(mealCard);
  });
}


// Retrieve meal details by ID
async function getMealDetailsById(mealId) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  return data.meals[0];
}

// Load meal details
function loadMealDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get('id');

  if (mealId) {
    fetchMealDetails(mealId);
  } else {
    displayErrorMessage();
  }
}

// Fetch and display meal details
async function fetchMealDetails(mealId) {
  try {
    const meal = await getMealDetailsById(mealId);
    displayMealDetails(meal);
  } catch (error) {
    displayErrorMessage();
  }
}

// Display meal details on the page
function displayMealDetails(meal) {
  const mealImage = document.getElementById('meal-image');
  mealImage.src = meal.strMealThumb;
  mealImage.alt = meal.strMeal;

  const mealName = document.getElementById('meal-name');
  mealName.textContent = meal.strMeal;

  const mealCategory = document.getElementById('meal-category');
  mealCategory.textContent = meal.strCategory;

  const mealInstructions = document.getElementById('meal-instructions');
  mealInstructions.textContent = meal.strInstructions;
}

// Display error message if meal details cannot be loaded
function displayErrorMessage() {
  const mealDetailsContainer = document.getElementById('meal-details-container');
  mealDetailsContainer.innerHTML = '<p>Failed to load meal details.</p>';
}

// Load meal details on page load
window.addEventListener('DOMContentLoaded', loadMealDetails);
// Create a meal card
function createMealCard(meal) {
  const mealCard = document.createElement('div');
  mealCard.className = 'meal-card';

  const mealImage = document.createElement('img');
  mealImage.src = meal.strMealThumb;
  mealCard.appendChild(mealImage);

  const mealName = document.createElement('h3');
  mealName.textContent = meal.strMeal;
  mealCard.appendChild(mealName);

  const mealCategory = document.createElement('p');
  mealCategory.textContent = meal.strCategory;
  mealCard.appendChild(mealCategory);

  return mealCard;
}

// Create "Add to Favorites" button
function createAddToFavoritesButton(meal) {
  const button = document.createElement('button');
  button.textContent = 'Add to Favorites';
  button.className = 'add-to-favorites-button';

  button.addEventListener('click', () => {
    addToFavorites(meal);
  });

  return button;
}

// Search input event handler
document.getElementById('search-input').addEventListener('input', (event) => {
  const searchTerm = event.target.value.trim();

  if (searchTerm.length > 0) {
    displaySearchSuggestions(searchTerm);
  } else {
    document.getElementById('search-suggestions').innerHTML = '';
  }
});

// Add a meal to the favorites list
function addToFavorites(meal) {
  const favorites = getFavorites();

  // Check if the meal is already in favorites
  const existingMeal = favorites.find((favMeal) => favMeal.idMeal === meal.idMeal);
  if (existingMeal) {
    alert('This meal is already in your favorites list.');
    return;
  }

  favorites.push(meal);
  saveFavorites(favorites);
  displayFavorites(favorites);
}

// Remove a meal from the favorites list
function removeFromFavorites(mealId) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter((meal) => meal.idMeal !== mealId);
  saveFavorites(updatedFavorites);
  displayFavorites(updatedFavorites);
}

// Save favorites to local storage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Retrieve favorites from local storage
function getFavorites() {
  const favoritesString = localStorage.getItem('favorites');
  return favoritesString ? JSON.parse(favoritesString) : [];
}

// Display the favorites on the page
function displayFavorites(favorites) {
  const favoritesContainer = document.getElementById('favorites-container');
  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>No favorites yet.</p>';
    return;
  }

  favorites.forEach((meal) => {
    const favoriteCard = createMealCard(meal);

    const removeFromFavoritesButton = document.createElement('button');
    removeFromFavoritesButton.textContent = 'Remove';
    removeFromFavoritesButton.className = 'remove-from-favorites-button';

    removeFromFavoritesButton.addEventListener('click', () => {
      removeFromFavorites(meal.idMeal);
    });

    favoriteCard.appendChild(removeFromFavoritesButton);

    favoritesContainer.appendChild(favoriteCard);
  });
}

// Search input event handler
document.getElementById('search-input').addEventListener('input', (event) => {
  const searchTerm = event.target.value.trim();

  if (searchTerm.length > 0) {
    displaySearchSuggestions(searchTerm);
  } else {
    document.getElementById('search-suggestions').innerHTML = '';
  }
});



// Display search suggestions
async function displaySearchSuggestions(searchTerm) {
  const suggestions = await searchMeals(searchTerm);

  const suggestionsList = document.getElementById('search-suggestions');
  suggestionsList.innerHTML = '';

  if (!suggestions) {
    return;
  }

  suggestions.forEach((suggestion) => {
    const suggestionItem = document.createElement('li');
    suggestionItem.textContent = suggestion.strMeal;
    suggestionItem.addEventListener('click', () => {
      document.getElementById('search-input').value = suggestion.strMeal;
      document.getElementById('search-suggestions').innerHTML = '';
      openMealDetailsPage(suggestion.idMeal);
    });

    suggestionsList.appendChild(suggestionItem);
  });
}

// Open meal details page
function openMealDetailsPage(mealId) {
  window.open(`meal-details.html?id=${mealId}`, '_blank');
}

// Search button click event handler
document.getElementById('search-button').addEventListener('click', async () => {
  const searchTerm = document.getElementById('search-input').value;
  const meals = await searchMeals(searchTerm);
  displayMeals(meals);
});

// Load favorites from local storage and display them
window.addEventListener('DOMContentLoaded', () => {
  const favorites = getFavorites();
  displayFavorites(favorites);
});
