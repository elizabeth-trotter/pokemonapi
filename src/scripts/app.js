import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage } from "./localstorage.js";

// IDs - Pokemon Fields
let name = document.getElementById("pokeName");
let img = document.getElementById("pokeImg");
let num = document.getElementById("pokeNum");

let type = document.getElementById("pokeType");
let location = document.getElementById("pokeLocation");
let abilities = document.getElementById("pokeAbilities");
let moves = document.getElementById("pokeMoves");
let evolutionDiv = document.getElementById("evolutionDiv");

// Background
let background = document.getElementById("background");

// Buttons
let favHeartBtn = document.getElementById("favHeartBtn");
let seeFavoritesBtn = document.getElementById("seeFavoritesBtn");
let drawerSwipeBtn = document.getElementById("drawer-swipe");
let heartIcon = document.getElementById("heartIcon");
let ulForModalFavorites = document.getElementById("ulForModalFavorites");
let shinyFormBtn = document.getElementById("shinyFormBtn");
let shinyIcon = document.getElementById("shinyIcon");
let searchBtn = document.getElementById("searchBtn");
let randomBtn = document.getElementById("randomBtn");
let inputField = document.getElementById("inputField");

// Global JavaScript Variabls
let currentPokemon, pokemonApiData, pokeImgDefault;

// On Load
document.addEventListener('DOMContentLoaded', async function() {
    // Your code to run on window load or refresh
    await pokemonApi(1);
    currentPokemon = pokemonApiData.name;
});

// Search
searchBtn.addEventListener('click', async () => {
    if (inputField.value) {
        await pokemonApi(inputField.value.toLowerCase());
        currentPokemon = pokemonApiData.name;
    }
});

randomBtn.addEventListener('click', async () => {
    const randNum = Math.floor(Math.random() * 649);
    if (randNum) {
        await pokemonApi(randNum);
        currentPokemon = pokemonApiData.name;
    }
});

inputField.addEventListener('keydown', async (event) => {
    if (inputField.value) {
        if (event.key === 'Enter') {
            await pokemonApi(event.target.value.toLowerCase());
            currentPokemon = pokemonApiData.name;
        }
    }
});

// Favorite Icon Button
favHeartBtn.addEventListener('click', () => {
    const favorites = getLocalStorage();

    if (favorites.includes(pokemonApiData.name)) {
        removeFromLocalStorage(pokemonApiData.name);
        heartIcon.src = "./assets/HeartEmpty.png";
    } else {
        saveToLocalStorage(pokemonApiData.name);
        heartIcon.src = "./assets/HeartFilled.png";
    }
});

// Favorites Buttons
async function handleSeeFavoritesBtnClick() {
    const favorites = getLocalStorage();

    ulForModalFavorites.innerHTML = "";

    for (const fav of favorites) {
        const div = document.createElement('div');
        const p = document.createElement('p');
        const imgTag = document.createElement('img');
        const imgBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const deleteImg = document.createElement('img');

        div.classList.add("flex", "rounded-lg", "p-2", "w-72");
        p.textContent = capitalizeFirstLetter(fav);
        p.classList.add("font-bold", "montserrat", "p-2", "flex-1");
        deleteBtn.classList.add("px-3");
        deleteImg.src = "./assets/faDeleteLeft.png";
        deleteImg.classList.add("h-9");

        const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${fav}/`);
        const data = await promise.json();
        imgTag.src = data.sprites.other["official-artwork"].front_default;
        imgTag.classList.add("h-9", "px-1");
        imgBtn.append(imgTag);

        let favTypeArr = data.types;
        let favType = favTypeArr.map(element => element.type.name);
        div.classList.add(backgroundClasses[favType[0]]);

        deleteBtn.append(deleteImg);
        div.append(imgBtn, p, deleteBtn);
        ulForModalFavorites.append(div);

        deleteBtn.addEventListener('mouseover', () => {
            deleteImg.src = "./assets/faDeleteLeftHover.png";
        });

        deleteBtn.addEventListener('mouseout', () => {
            deleteImg.src = "./assets/faDeleteLeft.png";
        });
        
        deleteBtn.addEventListener('click', () => {
            removeFromLocalStorage(fav);
            if(fav == currentPokemon){
                const favorites = getLocalStorage();

                if (!favorites.includes(pokemonApiData.name)) {
                    heartIcon.src = "./assets/HeartEmpty.png";
                } else {
                    heartIcon.src = "./assets/HeartFilled.png";
                }
            }
        });

        imgBtn.addEventListener('click', async () => {
            await pokemonApi(fav);
            currentPokemon = pokemonApiData.name;
        });

        imgBtn.addEventListener('mouseover', () => {
            imgBtn.classList.add("bg-white", "rounded");
        });

        imgBtn.addEventListener('mouseout', () => {
            imgBtn.classList.remove("bg-white");
        });
    }
}

seeFavoritesBtn.addEventListener('click', handleSeeFavoritesBtnClick);
drawerSwipeBtn.addEventListener('click', handleSeeFavoritesBtnClick);

//Shiny Icon Button
shinyFormBtn.addEventListener('click', () => {
    if (!pokeImgDefault) {
        img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
        pokeImgDefault = true;
        shinyIcon.src = "./assets/Sparkle.png";
    } else {
        img.src = pokemonApiData.sprites.other["official-artwork"].front_shiny;
        pokeImgDefault = false;
        shinyIcon.src = "./assets/SparkleFilled.png";
    }
});

//Pokemon Main API Call
const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    pokemonApiData = await promise.json();

    const favorites = getLocalStorage();

    if (!favorites.includes(pokemonApiData.name)) {
        heartIcon.src = "./assets/HeartEmpty.png";
    } else {
        heartIcon.src = "./assets/HeartFilled.png";
    }

    let pokeName = pokemonApiData.name;
    name.textContent = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);

    const pokeNum = pokemonApiData.id.toString().padStart(3, '0');
    num.textContent = pokeNum;

    img.src = pokemonApiData.sprites.other["official-artwork"].front_default;
    pokeImgDefault = true;
    shinyIcon.src = "./assets/Sparkle.png";

    let pokeTypesArr = pokemonApiData.types;
    let pokeTypes = pokeTypesArr.map(element => element.type.name);

    type.textContent = pokeTypes.map(capitalizeFirstLetter).join(", ");
    background.className = backgroundClasses[pokeTypes[0]];

    let pokemonEncounterData = await encounterApi(pokemon);
    if (!pokemonEncounterData.length == 0) {
        location.textContent = capitalizeAndRemoveHyphens(pokemonEncounterData[0]["location_area"].name);
    } else {
        location.textContent = "N/a";
    }

    let pokeAbilitiesArr = pokemonApiData.abilities;
    const pokeAbilities = pokeAbilitiesArr.map(element => capitalizeFirstLetter(element.ability.name));
    abilities.textContent = pokeAbilities.join(", ");

    const pokeMovesArr = pokemonApiData.moves;
    const pokeMoves = pokeMovesArr.map(element => capitalizeFirstLetter(element.move.name));
    moves.textContent = pokeMoves.join(", ");

    const speciesPromise = await fetch(`${pokemonApiData.species.url}`);
    const speciesData = await speciesPromise.json();

    const evolutionPromise = await fetch(`${speciesData.evolution_chain.url}`);
    const evolutionData = await evolutionPromise.json();

    if (evolutionData.chain.evolves_to.length === 0) {
        evolutionDiv.textContent = "N/a";
    } else {
        const evolutionArr = [evolutionData.chain.species.name];
        //Recursive Function
        const traverseEvolutions = (chain) => {
            // Base case
            if (chain.evolves_to.length === 0) return;
            // Recursive case
            chain.evolves_to.forEach((evolution) => {
                evolutionArr.push(evolution.species.name);
                traverseEvolutions(evolution); // Continues until base case is reached
            });
        };
        traverseEvolutions(evolutionData.chain);

        evolutionDiv.innerHTML = "";
        evolutionArr.map(async (pokemonName) => {
            const div = document.createElement('div');
            div.className = ("flex-grow text-center px-5");
            // const imgBtn = document.createElement('button');

            const imgPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
            const imgData = await imgPromise.json();

            const imgTag = document.createElement('img');
            imgTag.src = imgData.sprites.other["official-artwork"].front_default;

            const p = document.createElement('p');
            p.textContent = capitalizeFirstLetter(pokemonName);

            // imgBtn.append(imgTag);
            div.append(imgTag);
            div.append(p);
            evolutionDiv.append(div);

            // imgBtn.addEventListener('click', async () => {
            //     await pokemonApi(pokemonName);
            // });
        });
    }
};

const encounterApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`);
    return await promise.json();
};

// Formatting
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeAndRemoveHyphens(str) {
    const words = str.split('-');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
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