const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}" onClick="loadPokemon(${pokemon.number})">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>

      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>

        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join('')
    pokemonList.innerHTML += newHtml
  })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
  offset += limit
  const qtdRecordsWithNexPage = offset + limit

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, newLimit)

    loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {
    loadPokemonItens(offset, limit)
  }
})

const initialPage = document.getElementById("initial-page");
const pokemonPage = document.getElementById("pokemon-page");

function loadPokemon(number) {
  initialPage.classList.add('hide');
  pokemonPage.classList.remove('hide');
  pokemonPage.classList.add('pokemon-details');


  pokeApi.getPokemon(number).then(pokemon => {
    pokemonPage.innerHTML = displayPokemon(pokemon);
  });
}

function displayPokemon(pokemon) {
  pokemonPage.classList.add(pokemon.type);

  return `
    <header>
				<img src="/assets/images/arrow-back.png" alt="arrow-back" width="40" onClick="backPage()" />
				<span>${pokemon.name}</span>
        <span class="number">#${pokemon.number}</span>
				<ol class="types">
          ${pokemon.types.map(type => `<li class="${type}">${type}</li>`).join("")}
				</ol>
			</header>

			<img
				class="pokemon-photo"
				src=${pokemon.photo}
				alt="Bulbasur"
			/>

			<section class="info">
				<table>
					<tr>
						<th class="key">Height:</th>
						<th class="value">${pokemon.height} m</th>
					</tr>
					<tr>
						<th class="key">Weight:</th>
						<th class="value">${pokemon.weight} kg</th>
					</tr>
					<tr>
						<th class="key">Abilities:</th>
						<th class="value">${pokemon.abilities.map(ability => ability).join(", ")}</th>
					</tr>
				</table>

				<h3>Base Stats</h3>
        
				<table>
          ${pokemon.stats.map(stat => `
            <tr>
              <th class="key">${stat.name}:</th>
              <th class="value">${stat.value}</th>
            </tr>
          `).join("")}
				</table>
			</section>
  `;
}

function backPage() {
  initialPage.classList.remove('hide');
  pokemonPage.classList.add('hide');
  pokemonPage.classList.remove('pokemon-details');
}