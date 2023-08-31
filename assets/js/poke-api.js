const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.home.front_default

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
}

function convertPokemonDetailsModel(pokemon) {
  const newPokemon = new PokemonDetails()
  newPokemon.number = pokemon.id
  newPokemon.name = pokemon.name

  const types = pokemon.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  newPokemon.types = types
  newPokemon.type = type

  newPokemon.photo = pokemon.sprites.other.home.front_default

  newPokemon.height = (pokemon.height / 10).toFixed(2)
  newPokemon.weight = (pokemon.weight / 10).toFixed(2)

  newPokemon.abilities = pokemon.abilities.map((a) => a.ability.name)
  newPokemon.stats = pokemon.stats.map((s) => {
    return { name: s.stat.name, value: s.base_stat }
  })

  return newPokemon
}

pokeApi.getPokemon = (number) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${number}`;

  return fetch(url)
    .then((response) => response.json())
    .then(convertPokemonDetailsModel)
}