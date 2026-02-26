import { useEffect, useState } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

//  Array das cartas com suas imagens e propriedades para controle do jogo.
const cartasIniciais = [{
    src: '/assets/arts/1.png',
    cry: '/assets/cries/1.ogg',
    combinado: false
},
{
    src: '/assets/arts/4.png',
    cry: '/assets/cries/4.ogg',
    combinado: false
},
{
    src: '/assets/arts/7.png',
    cry: '/assets/cries/7.ogg',
    combinado: false
},
{
    src: '/assets/arts/10.png',
    cry: '/assets/cries/10.ogg',
    combinado: false
}, {
    src: '/assets/arts/13.png',
    cry: '/assets/cries/13.ogg',
    combinado: false
}, {
    src: '/assets/arts/19.png',
    cry: '/assets/cries/19.ogg',
    combinado: false
}, {
    src: '/assets/arts/23.png',
    cry: '/assets/cries/23.ogg',
    combinado: false
}, {
    src: '/assets/arts/25.png',
    cry: '/assets/cries/25.ogg',
    combinado: false
}, {
    src: '/assets/arts/27.png',
    cry: '/assets/cries/27.ogg',
    combinado: false
}, {
    src: '/assets/arts/29.png',
    cry: '/assets/cries/29.ogg',
    combinado: false
},
{
    src: '/assets/arts/32.png',
    cry: '/assets/cries/32.ogg',
    combinado: false
},
{
    src: '/assets/arts/39.png',
    cry: '/assets/cries/39.ogg',
    combinado: false
},
{
    src: '/assets/arts/41.png',
    cry: '/assets/cries/41.ogg',
    combinado: false
},
{
    src: '/assets/arts/43.png',
    cry: '/assets/cries/43.ogg',
    combinado: false
},
{
    src: '/assets/arts/46.png',
    cry: '/assets/cries/46.ogg',
    combinado: false
}, {
    src: '/assets/arts/48.png',
    cry: '/assets/cries/48.ogg',
    combinado: false
}, {
    src: '/assets/arts/50.png',
    cry: '/assets/cries/50.ogg',
    combinado: false
}, {
    src: '/assets/arts/52.png',
    cry: '/assets/cries/52.ogg',
    combinado: false
}, {
    src: '/assets/arts/54.png',
    cry: '/assets/cries/54.ogg',
    combinado: false
}, {
    src: '/assets/arts/56.png',
    cry: '/assets/cries/56.ogg',
    combinado: false
},
]

//  Função para gerar e embaralhar as cartas, usando estados (useState) para atualizar com o react.
export const useGame = () => {
    const [disabled, setDisabled] = useState(false);
    const [cartas, setCartas] = useState([]);
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [faseAtual, setFaseAtual] = useState(1);
    const [recorde, setRecorde] = useState(() => {
        const salvo = localStorage.getItem('memoria_recorde');
        return salvo ? parseInt(salvo) : 0;
    });
    const maxPares = 9;

    const shuffleCards = (resetTotal = false) => {
        if (resetTotal) {
            setFaseAtual(1);
            return;
        }

        const quantPares = faseAtual <= 4 ? faseAtual + 1 : maxPares;

        const cartasSorteadas = [...cartasIniciais]
            .sort(() => Math.random() - 0.5)
            .slice(0, quantPares)

        const shuffled = [...cartasSorteadas, ...cartasSorteadas]
            .sort(() => Math.random() - 0.5)
            .map((carta) => { return { ...carta, id: Math.random(), combinado: false } });

        setCartas(shuffled);
        setChoice1(null);
        setChoice2(null);
    }

    const playSom = (caminhoAudio, volume) => {
        if (!caminhoAudio) return;
        const audio = new Audio(caminhoAudio);
        audio.volume = volume;
        audio.play();
    };

    useEffect(() => {

        if (choice1 && choice2) {
            setDisabled(true);
            if (choice1.src === choice2.src) {
                playSom(choice1.cry, 1);
                setCartas(escolhidas => {
                    return escolhidas.map(carta => {
                        if (carta.src === choice1.src) {
                            return { ...carta, combinado: true };
                        } else {
                            Haptics.impact({ style: ImpactStyle.Light });
                            return carta;
                        }
                    });
                });
                resetTurno();
            } else {
                setTimeout(() => resetTurno(), 1000);
                playSom('/err.mp3', 1);
            }
        }
    }, [choice1, choice2]);

    useEffect(() => {
        const ganhou = cartas.length > 0 && cartas.every(carta => carta.combinado);
        if (ganhou) {
            playSom('/lvl.mp3', 0.3);
            setTimeout(() => {
                setFaseAtual(prev => {
                    const novaFase = prev + 1;
                    if (novaFase > recorde) {
                        setRecorde(novaFase);
                        localStorage.setItem('memoria_recorde', novaFase.toString());
                    }
                    return novaFase;
                });
            }, 500);
        }
    }, [cartas]);

    useEffect(() => {
        shuffleCards();
    }, [faseAtual]);

    const handleChoice = (carta) => {
        if (!disabled && carta.id !== choice1?.id && !carta.combinado) {
            choice1 ? setChoice2(carta) : setChoice1(carta);
        }
    };

    const resetTurno = () => {
        setChoice1(null);
        setChoice2(null);
        setDisabled(false);
    }

    return {
        cartas,
        shuffleCards: () => shuffleCards(true),
        faseAtual,
        handleChoice,
        choice1,
        choice2,
        recorde,
    }
}