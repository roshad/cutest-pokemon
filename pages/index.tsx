import type { NextPage } from "next";
// import useEffect
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
//import styles from "../styles/Home.module.css";
import { trpc } from "../utils/trpc";
import Link from 'next/link'
import { log } from "console";
// const getPokemon = async ()=>prisma.pokemon.findFirst().then((pokemon) => console.log(pokemon));
import loadingSVG from '../public/loading.svg'

const Home: NextPage = (props) => {
    type Pokemon = {
        id: number;
        image: string;
        name: string;
    }
    const mutation = trpc.useMutation(["pokemon"]);
    // state
    //console.log(props);
    const setOpacity = (is0: boolean) => {
        const elements = document.getElementsByClassName("button")
        for (let i = 0; i < elements.length; i++) {
            is0 ? elements[i].classList.add("opacity-0") : elements[i].classList.remove("opacity-0")

        }
    }

    const sendResult = async (win: number, lose: number) => {
        //console.log("sendResult", win, lose);

        setOpacity(true)
        mutation.mutate({ win: win, lose: lose });
        getPokemons()
    };
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const getPokemons = () => {
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
            //console.log("loading");

            setPokemon([
                {
                    id: poke1.id,
                    name: poke1.name,
                    image: poke1.sprites.other["official-artwork"].front_default,
                },
                {
                    id: poke2.id,
                    name: poke2.name,
                    image: poke2.sprites.other["official-artwork"].front_default,
                },
            ]);
            setTimeout(() => setOpacity(false), 1000)

        })();
    };
    useEffect(() => {
        getPokemons();
        // getPokemon()
        //console.log("useEffect");

    }, []);
    return (
        <div>
            {(
                <div>
                    <br />
                    Click the cuter Pokémon
                    {pokemon.length && (
                        <div style={{ height: "90vh" }}>
                            <div
                                className="h-5/6 flex justify-between mx-auto my-auto items-center"
                                style={{ width: "1000px" }}
                            >
                                <div className="button neu relative rounded-full p-12 label opacity-0" data-label={pokemon[0].name} onClick={() => sendResult(pokemon[0].id, pokemon[1].id)}>
                                    <Image
                                        id="img1"
                                        alt="pokemon1"
                                        src={pokemon[0].image}
                                        height="300px"
                                        width="300px"

                                    />
                                    {/* <label className="label">
                {pokemon[0].name}
              </label> */}
                                </div>
                                <div className="button neu relative rounded-full p-12 label opacity-0" data-label={pokemon[1].name} onClick={() => sendResult(pokemon[1].id, pokemon[0].id)}>
                                    <Image
                                        alt="pokemon2"
                                        id="img2"
                                        src={pokemon[1]["image"]}
                                        height="300px"
                                        width="300px"

                                    />
                                    {/* <div >
                {pokemon[1].name}
              </div> */}
                                </div>
                            </div>
                        </div>
                    )}
                    <Link href="/results">
                        <a className="relative neu p-4 bottom-8 rounded-lg">Results</a>
                    </Link>
                </div>)}
        </div>
    );
};

export default Home;
