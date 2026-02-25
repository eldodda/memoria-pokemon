import { useEffect, useState } from "react";
import { useGame } from "./hooks/useGame.js";
import './App.css';

function App() {
    const { cartas, shuffleCards, turno, handleChoice, choice1, choice2, recorde } = useGame();
    useEffect(() => {
        shuffleCards();
    }, []);

    return (
        <div className="App">
            <div className="titulo">
                <img src="/titulo.png" />
            </div>
            <button className="new-game" onClick={shuffleCards}>Novo jogo</button>

            <div className="card-grid">
                {cartas.map(carta => (
                    <div key={carta.id} className="card" onClick={() => handleChoice(carta)}>
                        <img
                            src={(carta === choice1 || carta === choice2 || carta.combinado) ? carta.src : '/verso.png'}
                            alt="Carta" />
                    </div>
                ))}
            </div>
            <div className="stats">
                <p>Turnos: {turno}</p>
                {recorde > 0 && <p>Recorde: {recorde} turnos</p>}
            </div>
        </div>
    )
}

export default App;