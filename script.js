const input = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");
const result = document.getElementById("result");

let characters = [];

// Load all characters once when page loads
async function loadCharacters() {
  try {
    const res = await fetch("https://thronesapi.com/api/v2/Characters");
    characters = await res.json();
  } catch (err) {
    console.error("Failed to load characters", err);
  }
}

loadCharacters();

// Show character info in the result div
function showCharacter(character) {
  result.innerHTML = `
    <img src="${character.imageUrl}" alt="${character.fullName}" />
    <h2>${character.fullName}</h2>
    <p><strong>Title:</strong> ${character.title}</p>
    <p><strong>Family:</strong> ${character.family}</p>
    <p><strong>First Name:</strong> ${character.firstName}</p>
    <p><strong>Last Name:</strong> ${character.lastName}</p>
  `;
}

// Clear suggestions list
function clearSuggestions() {
  suggestions.innerHTML = "";
  suggestions.style.display = "none";
}

// When user clicks a suggestion
suggestions.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    const selectedName = e.target.textContent;
    input.value = selectedName;
    clearSuggestions();

    const character = characters.find(c =>
      c.fullName.toLowerCase() === selectedName.toLowerCase()
    );

    if (character) {
      showCharacter(character);
    }
  }
});

// On input change
input.addEventListener("input", () => {
  const query = input.value.trim().toLowerCase();

  if (query.length < 1) {
    clearSuggestions();
    result.innerHTML = "";
    return;
  }

  const matches = characters.filter(c =>
    c.fullName.toLowerCase().includes(query)
  ).slice(0, 5); // max 5 suggestions

  if (matches.length === 0) {
    clearSuggestions();
    return;
  }

  // Show suggestions
  suggestions.innerHTML = matches
    .map(c => `<li>${c.fullName}</li>`)
    .join("");
  suggestions.style.display = "block";

  // If exactly one character matches the full input, show details automatically
  const exactMatch = characters.find(c => c.fullName.toLowerCase() === query);
  if (exactMatch) {
    showCharacter(exactMatch);
  } else {
    result.innerHTML = "";
  }
});

// Hide suggestions if clicked outside
document.addEventListener("click", (e) => {
  if (!suggestions.contains(e.target) && e.target !== input) {
    clearSuggestions();
  }
});
