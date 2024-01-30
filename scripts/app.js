import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage } from "./localstorage.js";

// // IDs
// let digimonImg = document.getElementById("digimonImg");
// let digimonName = document.getElementById("digimonName");
// let digimonStatus = document.getElementById("digimonStatus");
// let favoriteBtn = document.getElementById("favoriteBtn");
// let digimonInput = document.getElementById("digimonInput");

// let digimon = "";

// const DigimonApi = async (digimon) => {
//     const promise = await fetch(`https://digimon-api.vercel.app/api/digimon/name/${digimon}`);
//     const data = await promise.json();
//     // console.log(data);
//     return data;
// }

// // DigimonApi("agumon");

// digimonInput.addEventListener('keydown', async (event) => {
//     //On enter I want this function to run
//     if(event.key === "Enter"){
//         digimon = await DigimonApi(event.target.value);
//         console.log(digimon);
//         digimonImg.src = digimon[0].img;
//         digimonName.textContent = digimon[0].name;
//         digimonStatus.textContent = digimon[0].level;
//     }
// });

// favoriteBtn.addEventListener('click', () => {
//     saveToLocalStorage(digimon[0].name);
// });


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

let searchBtn = document.getElementById("searchBtn");
let randomBtn = document.getElementById("randomBtn");
let inputField = document.getElementById("inputField");

// Global JavaScript Variabls
let currentPokemon = "pikachu";

// Search
searchBtn.addEventListener('click', () => {
    // call api to update fields
});

randomBtn.addEventListener('click', () => {
    const randNum = Math.floor(Math.random() * 10); // find number of pokedex?
    // call api to update fields
});

inputField.addEventListener('keydown', (event) => {
    if(inputField.value){
        if(event.key === 'Enter'){
            // call api to update fields
        }
    }
});

// Favorites
favHeartBtn.addEventListener('click', () => {
    saveToLocalStorage(currentPokemon);
});

//API Call
const pokemonApi = async (currentPokemon) => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon}/`);
    const promise = await data.json();
    console.log(data);
};