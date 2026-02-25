import { useEffect, useState } from "react";

//  Array das cartas com suas imagens e propriedades para controle do jogo.
const cartasIniciais = [{
    src: '/1.png',
    virado: false,
    combinado: false
},
{
    src: '/4.png',
    virado: false,
    combinado: false
},
{
    src: '/7.png',
    virado: false,
    combinado: false
},
{
    src: '/10.png',
    virado: false,
    combinado: false
}, {
    src: '/13.png',
    virado: false,
    combinado: false
}, {
    src: '/19.png',
    virado: false,
    combinado: false
}, {
    src: '/23.png',
    virado: false,
    combinado: false
}, {
    src: '/25.png',
    virado: false,
    combinado: false
}, {
    src: '/27.png',
    virado: false,
    combinado: false
}, {
    src: '/29.png',
    virado: false,
    combinado: false
},
]

//  Função para gerar e embaralhar as cartas, usando estados (useState) para atualizar com o react.
export const useGame = () => {
    const [disabled, setDisabled] = useState(false);
    const [cartas, setCartas] = useState([]);
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [turno, setTurno] = useState(0);
    const [recorde, setRecorde] = useState(() => {
        const salvo = localStorage.getItem('memoria_recorde');
        return salvo ? parseInt(salvo) : 0;
    });


    const shuffleCards = () => {
        const shuffled = [...cartasIniciais, ...cartasIniciais]
            .sort(() => Math.random() - 0.5)
            .map((carta) => { return { ...carta, id: Math.random() } });

        setCartas(shuffled);
        setTurno(0);
    }

    useEffect(() => {
        if (choice1 && choice2) {
            setDisabled(true);
            if (choice1.src === choice2.src) {
                setCartas(escolhidas => {
                    return escolhidas.map(carta => {
                        if (carta.src === choice1.src) {
                            return { ...carta, combinado: true };
                        } else {
                            return carta;
                        }
                    });
                });
                resetTurno();
            } else {
                setTimeout(() => resetTurno(), 1000);
            }
        }
    }, [choice1, choice2]);

    useEffect(() => {
        if (cartas.length > 0 && cartas.every(carta => carta.combinado)) {
            if (recorde === 0 || turno < recorde) {
                localStorage.setItem('memoria_recorde', turno.toString());
                setRecorde(turno);
                alert('Novo Recorde!!');
            }
        }
    }, [cartas, turno, recorde]);

    const handleChoice = (carta) => {
        if (!disabled && carta.id !== choice1?.id && !carta.combinado) {
            choice1 ? setChoice2(carta) : setChoice1(carta);
        }
    };

    const resetTurno = () => {
        setChoice1(null);
        setChoice2(null);
        setTurno(prev => prev + 1);
        setDisabled(false);
    }

    return {
        cartas,
        shuffleCards,
        turno,
        handleChoice,
        choice1,
        choice2,
        recorde
    }
}