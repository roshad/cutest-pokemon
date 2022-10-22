import { useEffect, useState } from 'react'
import type { NextPage } from "next";
import { prisma } from './api/prisma';
import { array } from 'zod';
import Image from "next/image";
// const results=(props)=> {
//   console.log("props",props);

//   //const pokemonss = props.pokemons.sort((a, b) => b.win / b.total - a.win / a.total);
//   //console.log(pokemonss);
//   return (
//     <div>results</div>
//   )
// }
type Pokemon = { id: number, win: number, lose: number, total: number, image: string, name: string }
export default function results(props: { pokemons: [Pokemon] }) {

  //console.log("props", props.pokemons);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  let good = 0;
  const getPokemons = async () => {
    // generate two random numbers between 1 and 905


    const pokemons = await Promise.all(props.pokemons?.sort((a, b) => b.win / b.total - a.win / a.total).slice(0, 20)?.map(async (pokemon) => {

      const poke = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      ).json();
      //console.log("loading");
      // console.log(poke);

      pokemon.image = poke.sprites.front_default;
      pokemon.name = poke.name
      return pokemon

    }))

    //console.log("pokemons", pokemons);

    setPokemons(pokemons);
    //console.log("loading");
    setLoading(false);


  };
  useEffect(() => {
    getPokemons();
    // getPokemon()
    //console.log("useEffect");

  }, [props]);
  //console.log(pokemonss);
  return (
    <div className="overflow-x-auto relative">
      {!loading &&
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>

              <th scope="col" className="py-3 px-6">
                Pokémon

              </th>
              <th scope="col" className="py-3 px-6">
                Win
              </th>
              <th scope="col" className="py-3 px-6">
                Total
              </th>
              <th scope="col" className="py-3 px-6">
                Win Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {

              pokemons.map((pokemon) =>
                <tr key={pokemon.id} className="bg-white dark:bg-gray-800">
                  <th scope="row" className="flex items-center justify-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white ">

                    <Image className='align-middle' src={pokemon.image} height="80px" width="80px" />
                    <p className='inline'>{pokemon.name}</p>
                  </th>
                  <td className="py-4 px-6">
                    {pokemon.win}
                  </td>
                  <td className="py-4 px-6">
                    {pokemon.total}
                  </td>
                  <td className="py-4 px-6">
                    {pokemon.win / pokemon.total * 100 + "%"}
                  </td>
                </tr>
              )
            }



          </tbody>
        </table>
      }
    </div>
  )
}
export async function getServerSideProps() {

  const pokemons = await prisma.pokemon.findMany()
  //console.log(pokemons);

  return {
    props: { pokemons }, // will be passed to the page component as props
  }
}