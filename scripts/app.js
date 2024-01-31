import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage } from "./localstorage.js";

// IDs
// Pokemon Fields
let name = document.getElementById("pokeName");
let img = document.getElementById("pokeImg");
let num = document.getElementById("pokeNum");

let type = document.getElementById("pokeType");
let location = document.getElementById("pokeLocation");
let abilities = document.getElementById("pokeAbilities");
let moves = document.getElementById("pokeMoves");
// How do i want to do this section?
let evolutionOneImg = document.getElementById("evolutionOneImg");
let evolutionOneName = document.getElementById("evolutionOneName");
// Background
let background = document.getElementById("background");

// Buttons
let favHeartBtn = document.getElementById("favHeartBtn");
let seeFavoritesBtn = document.getElementById("seeFavoritesBtn");

let shinyFormBtn = document.getElementById("shinyFormBtn");
let shinyIcon = document.getElementById("shinyIcon");

let searchBtn = document.getElementById("searchBtn");
let randomBtn = document.getElementById("randomBtn");
let inputField = document.getElementById("inputField");

// Global JavaScript Variabls
let currentPokemon, pokemonApiData, pokeImgDefault;

// Search
searchBtn.addEventListener('click', async () => {
    if (inputField.value) {
        currentPokemon = await pokemonApi(inputField.value.toLowerCase());
    }
});

randomBtn.addEventListener('click', async () => {
    const randNum = Math.floor(Math.random() * 10); // find number of pokedex?
    if (inputField.value) {
        currentPokemon = await pokemonApi(inputField.value.toLowerCase());
    }
});

inputField.addEventListener('keydown', async (event) => {
    if (inputField.value) {
        if (event.key === 'Enter') {
            currentPokemon = await pokemonApi(event.target.value.toLowerCase());
        }
    }
});

// Favorite Icon Button
favHeartBtn.addEventListener('click', () => {
    saveToLocalStorage(currentPokemon);
});

//Shiny Icon Button
shinyFormBtn.addEventListener('click', () => {
    if (pokeImgDefault) {
        img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
        pokeImgDefault = false;
        shinyIcon.src = "./assets/Sparkle.png";
        console.log("clicked");
    } else {
        img.src = pokemonApiData.sprites.other["official-artwork"].front_shiny;
        pokeImgDefault = true;
        shinyIcon.src = "./assets/SparkleFilled.png";
        console.log("clicked");
    }
});

//Pokemon Main API Call
const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    pokemonApiData = await promise.json();
    console.log(pokemonApiData);

    let pokeName = pokemonApiData.name;
    name.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

    const pokeNum = pokemonApiData.id.toString().padStart(3, '0'); //The padStart(3, '0') method pads the string representation with leading zeros to ensure it has a length of 3 characters
    num.textContent = pokeNum;

    img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
    pokeImgDefault = true;
    shinyIcon.src = "./assets/Sparkle.png";

    let pokeTypesArr = pokemonApiData.types;
    let pokeTypes = pokeTypesArr.map(element => (element.type.name));
    type.textContent = pokeTypes.join(", ");
    background.className = backgroundClasses[pokeTypes[0]];

    let pokemonEncounterData = await encounterApi(pokemon);
    if (!pokemonEncounterData.length == 0) {
        location.textContent = capitalizeFirstLetter(pokemonEncounterData[0]["location_area"].name);
    } else {
        location.textContent = "N/a";
    }

    let pokeAbilitiesArr = pokemonApiData.abilities;
    const pokeAbilities = pokeAbilitiesArr.map(element => capitalizeFirstLetter(element.ability.name));
    abilities.textContent = pokeAbilities.join(", ");

    const pokeMovesArr = pokemonApiData.moves;
    const pokeMoves = pokeMovesArr.map(element => capitalizeFirstLetter(element.move.name));
    moves.textContent = pokeMoves.join(", ");

    // How do i want to do evolution section?

};

const encounterApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`);
    return await promise.json();
};

// Formatting
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//Background
const backgroundClasses = {
	normal: 'bg-normal',
	fire: 'bg-fire',
	water: 'bg-water',
	electric: 'bg-electric',
	grass: 'bg-grass',
	ice: 'bg-ice',
	fighting: 'bg-fighting',
	poison: 'bg-poison',
	ground: 'bg-ground',
	flying: 'bg-flying',
	psychic: 'bg-psychic',
	bug: 'bg-bug',
	rock: 'bg-rock',
	ghost: 'bg-ghost',
	dragon: 'bg-dragon',
	dark: 'bg-dark',
	steel: 'bg-steel',
	fairy: 'bg-fairy',
};

function backgroundChange(pokemonType) {
    switch (pokemonType) {
        case "normal":
            background.className = "";
            break;
        case "fire":
            background.className = "";
            break;
        case "water":
            background.className = "";
            break;
        case "electric":
            background.className = "";
            break;
        case "grass":
            background.className = "bg-[]";
            break;
        case "ice":
            background.className = "";
            break;
        case "fighting":
            background.className = "";
            break;
        case "poison":
            background.className = "";
            break;
        case "ground":
            background.className = "";
            break;
        case "flying":
            background.className = "";
            break;
        case "psychic":
            background.className = "";
            break;
        case "bug":
            background.className = "";
            break;
        case "rock":
            background.className = "";
            break;
        case "ghost":
            background.className = "";
            break;
        case "dragon":
            background.className = "";
            break;
        case "dark":
            background.className = "";
            break;
        case "steel":
            background.className = "";
            break;
        default:
            background.className = "";
            break;
    }
}