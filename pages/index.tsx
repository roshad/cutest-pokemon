import type { NextPage } from "next";
// import useEffect
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";
const Home: NextPage = () => {
  const mutation = trpc.useMutation(["pokemon"]);
  // state
  const sendResult = async (win: number, lose: number) => {
    mutation.mutate({ win: win, lose: lose });
  };
  const [pokemon, setPokemon] = useState();
  useEffect(() => {
    // generate two random numbers between 1 and 905
    const getRandom = () => Math.floor(Math.random() * 905) + 1;
    let random = getRandom();
    let random2;
    do {
      random2 = getRandom();
    } while (random === random2);

    (async () => {
      const poke1 = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
      ).json();
      const poke2 = await (
        await fetch(`https://pokeapi.co/api/v2/pokemon/${random2}`)
      ).json();

      setPokemon({
        "1": {
          id: poke1.id,
          name: poke1.name,
          image: poke1.sprites.other["official-artwork"].front_default,
        },
        "2": {
          name: poke2.name,
          image: poke2.sprites.other["official-artwork"].front_default,
        },
      });
     
    })();
    
  }, []);

  return (
    <div>
      {pokemon ? (
        <>
          <Image src={pokemon[1].image} height="500px" width="500px" />
          <Image src={pokemon[2].image} height="500px" width="500px" />
          <button onClick={()=>sendResult(pokemon[1].id,pokemon[2].id)}>{pokemon[1].name}</button>
          <button onClick={()=>sendResult(pokemon[2].id,pokemon[1].id)}>{pokemon[2].name}</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
