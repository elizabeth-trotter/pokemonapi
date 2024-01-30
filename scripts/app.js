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

//Pokemon Main API Call
const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    pokemonApiData = await promise.json();
    console.log(pokemonApiData);

    let pokeName = pokemonApiData.name;
    name.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

    let pokeNum = pokemonApiData.id;
    switch (pokeNum.toString().length) {
        case 1:
            pokeNum = "00" + pokeNum;
            break;
        case 2:
            pokeNum = "0" + pokeNum;
            break;
        default:
            break;
    }
    num.textContent = pokeNum;

    img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
    pokeImgDefault = true;
    shinyIcon.src = "./assets/Sparkle.png";

    //Shiny Icon Button
    shinyFormBtn.addEventListener('click', () => {
        if (pokeImgDefault) {
            img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
            pokeImgDefault = false;
            shinyIcon.src = "./assets/Sparkle.png";
            // console.log("clicked");
        } else {
            img.src = pokemonApiData.sprites.other["official-artwork"].front_shiny;
            pokeImgDefault = true;
            shinyIcon.src = "./assets/SparkleFilled.png";
            // console.log("clicked");
        }
    });

    let pokeTypesArr = pokemonApiData.types;
    let pokeTypes = [];
    pokeTypesArr.forEach(element => {
        element = element.type.name;
        pokeTypes.push(element.charAt(0).toUpperCase() + element.slice(1));
    });
    type.textContent = pokeTypes.join(" + ");

    let pokemonEncounterData = await encounterApi(pokemon);
    console.log(pokemonEncounterData);
    if (!pokemonEncounterData.length == 0) {
        location.textContent = pokemonEncounterData[0]["location_area"].name;
    } else {
        location.textContent = "N/a";
    }

    let pokeAbilitiesArr = pokemonApiData.abilities;
    const pokeAbilities = pokeAbilitiesArr.map(element => capitalizeFirstLetter(element.ability.name));
    abilities.textContent = pokeAbilities.join(" + ");

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