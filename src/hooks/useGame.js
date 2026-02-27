import { useEffect, useState } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics"; // Recursos do Capacitor para vibração.

const cartasIniciais = [{       //  Array das cartas com suas imagens e propriedades para controle do jogo.
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

export const useGame = () => {      // Motor lógico do jogo.
    const [disabled, setDisabled] = useState(false);
    const [cartas, setCartas] = useState([]);
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [faseAtual, setFaseAtual] = useState(1);
    const [recorde, setRecorde] = useState(() => {
        const salvo = localStorage.getItem('memoria_recorde');
        return salvo ? parseInt(salvo) : 0;
    });

    const maxPares = 9; // Máximo de cartas na tela (9 pares = 18 cartas);

    const prepFase = (resetTotal = false) => {  // Prepara a fase.
        if (resetTotal) {
            setFaseAtual(1);
            return;
        }

        const quantPares = faseAtual <= 8 ? faseAtual + 1 : maxPares;   // Controla o progresso das fases.
        const cartasSorteadas = [...cartasIniciais]                     // Separa cartas aleatórias para cada fase, diminuindo a repetição:
            .sort(() => Math.random() - 0.5)                            // Embaralha;
            .slice(0, quantPares);                                      // Separa a quantidade para a fase.

        const shuffled = [...cartasSorteadas, ...cartasSorteadas]        // Gera os pares e os prepara para a fase:
            .sort(() => Math.random() - 0.5)                             // Embaralha;
            .map((carta) => { return { ...carta, id: Math.random(), combinado: false } });  // Seta todas as cartas como 'não combinadas' (combinado: false).

        setCartas(shuffled);    // Prepara as cartas da fase;
        setChoice1(null);       // Limpa a primeira escolha
        setChoice2(null);       // e a segunda;
    }

    const trataEscolha = (carta) => {
        if (!disabled && carta.id !== choice1?.id && !carta.combinado) {
            choice1 ? setChoice2(carta) : setChoice1(carta);
        }
    }

    const resetTurno = () => {  // Função para resetar o turno:
        setChoice1(null);           // Zera a escolha um
        setChoice2(null);           // e a dois;
        setDisabled(false);         // Destrava as cartas para novas escolhas.
    }

    const playSom = (caminhoAudio, volume) => { // Função para tocar os sons de acerto, erro e mudança de fase.
        if (!caminhoAudio) return;  // Se o caminhoAudio não for fornecido, segue sem mesmo;
        const audio = new Audio(caminhoAudio);
        audio.volume = volume;
        audio.play();
    }

    useEffect(() => {
        if (choice1 && choice2) {   // Se as duas escolhas já foram feitas,
            setDisabled(true);      // trava as cartas, impedindo novas escolhas.
            if (choice1.src === choice2.src) {                  // Se as escolhas forem iguais,
                playSom(choice1.cry, 1);                // toca o som de acerto e
                setCartas(escolhidas => {                       // pega as cartas escolhidas e
                    return escolhidas.map(carta => {            // mapeia cada carta:
                        if (carta.src === choice1.src) {            // Mais uma comparação para o .map(), e se confirmar,
                            return { ...carta, combinado: true }   // registra que essas cartas já foram combinadas.
                        } else {            // Senão,
                            return carta;   // voltamos as cartas ao normal.
                        }
                    });
                });
                resetTurno();   // E resetamos o turno.
            } else {                                            // Se as cartas não forem iguais (erro):
                playSom('/err.mp3', 1),                         // Toca o som de erro.
                    setTimeout(() => {
                        resetTurno();                                   // Reseta o turno
                        Haptics.impact({ style: ImpactStyle.Light })   // e vibra.
                    },
                        1000
                    );
            }
        }
    }, [choice1, choice2]); // As variáveis a serem vigiadas pelo useEffect.

    useEffect(() => {
        const ganhou = cartas.length > 0 && cartas.every(carta => carta.combinado); // Condição de vitória: todas as cartas combinadas (combinado: true).
        if (ganhou) {   // Se venceu:
            setTimeout(() => {
                setFaseAtual(prev => {          // Preparamos uma nova fase
                    const novaFase = prev + 1;  // que é a fase atual + 1.
                    if (novaFase > recorde) {                                   // Se a nova fase for maior que o recorde atual:
                        setRecorde(novaFase);                                           // Ela passa a ser o novo recorde.
                        localStorage.setItem('memoria_recorde', novaFase.toString());   // E o recorde é guardado no localStorage.
                    }
                    return novaFase;
                });
                playSom('/lvl.mp3', 1);   // E tocamos o som de vitória.
            }, 700);
        }
    }, [cartas]);

    useEffect(() => {
        prepFase(); // Sempre que faseAtual for atualizada, prepara a fase.
    }, [faseAtual]);

    return {
        cartas,
        prepFase,
        faseAtual,
        trataEscolha,
        choice1,
        choice2,
        recorde,
    }
}