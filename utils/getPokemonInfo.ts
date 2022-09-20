import { pokeApi } from "../api";
import { Pokemon } from "../interfaces";


export const getPokemonInfo = async (nameOrId: string) => {
    try {
        const { data } = await pokeApi.get<Pokemon>(`/pokemon/${nameOrId.toLowerCase()}`);
        //es bueno definirle a la peticion qué tipo de datos va a recibir (PokemonListResponse)
        return {// Refactorizamos la data para que esta envie solo las informacion que necesitamos, y no el monton de informacion innecesaria
            id: data.id,
            name: data.name,
            sprites: data.sprites,
        }
    } catch (err) {
        return null; //Ahora esta funcion puede regresar el objeto o null
    }
}