import { useState } from 'react';

import { GetStaticProps, NextPage, GetStaticPaths } from 'next';
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react';

import confetti from 'canvas-confetti';

import { Layout } from '../../components/layouts';
import { Pokemon } from '../../interfaces';
import { capitalizeStrings, getPokemonInfo, localFavorites } from '../../utils';

interface Props {
    pokemon: Pokemon;
}

const PokemonPage: NextPage<Props> = ({ pokemon }) => {

    const [isInfavorites, setIsInfavorites] = useState(localFavorites.existInFavorites(pokemon.id))

    const onTiggleFavorite = () => {
        localFavorites.localFavorites(pokemon.id);
        setIsInfavorites(!isInfavorites);

        if (isInfavorites) return;

        confetti({
            zIndex: 999,
            particleCount: 100,
            spread: 160,
            angle: -100,
            origin: {
                x: 1,
                y: 0,
            }
        })
    }

    return (
        <Layout title={capitalizeStrings.capitalizeStrings(pokemon.name)}>

            <Grid.Container css={{ marginTop: '5px' }} gap={2}>
                <Grid xs={12} sm={4}>
                    <Card isHoverable css={{ padding: '30px' }}>
                        <Card.Body>
                            <Card.Image
                                src={pokemon.sprites.other?.dream_world.front_default || '/no-image.png'}
                                alt={pokemon.name}
                                width="100%"
                                height={200}
                            />
                        </Card.Body>
                    </Card>
                </Grid>

                <Grid xs={12} sm={8}>
                    <Card>
                        <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text h1 transform='capitalize'>{pokemon.name}</Text>

                            <Button
                                color="gradient"
                                ghost={!isInfavorites}
                                onClick={onTiggleFavorite}
                            >
                                {isInfavorites ? 'En Favorites' : 'Guardar en favoritos'}

                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Text size={30}>Sprites:</Text>
                            <Container direction='row' display='flex' gap={0}>
                                <Image
                                    src={pokemon.sprites.front_default}
                                    alt={pokemon.name}
                                    width={100}
                                    height={100}
                                />
                                <Image
                                    src={pokemon.sprites.back_default}
                                    alt={pokemon.name}
                                    width={100}
                                    height={100}
                                />
                                <Image
                                    src={pokemon.sprites.front_shiny}
                                    alt={pokemon.name}
                                    width={100}
                                    height={100}
                                />
                                <Image
                                    src={pokemon.sprites.back_shiny}
                                    alt={pokemon.name}
                                    width={100}
                                    height={100}
                                />
                            </Container>
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>

        </Layout>
    )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const paths = [...Array(151)].map((_, index) => ({
        params: { id: `${index + 1}` },
    }));

    return {
        paths,
        //fallback: false //Indicamos que si trata de ingresar a un url que no está entre los paths, o sea no está previamente renderizado, entonces que tire un 404
        fallback: 'blocking',
    };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { id } = params as { id: string };

    const pokemon = await getPokemonInfo(id);

    if (!pokemon) {
        return {
            redirect: {
                destination: '/',
                permanent: false
                //'false' porque si la persona busca un pokemon con un id que no esta ya generado, puede que exista ya o que en un futuro exista
                //Y si colocamos 'true' entonces la redireccion a otra pagina la eliminará del indice porque quiere decir que ya no existe, que ya nunca mas vamos a volver entrar ahi
            }
        }
    }

    return {
        props: {
            pokemon
        },
        revalidate: 86400, //Le decimos que revalide la página cada 86480s (24h), a esto se le llama ISR (Incremental static regeneration)
        //Esto en cuanto necesitemos que la data se actualice cada cierto tiempo
    }
}



export default PokemonPage;
