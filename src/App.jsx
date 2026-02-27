import { useEffect, useState } from "react";
import { useGame } from "./hooks/useGame.js";
import './App.css';

function App() {
    const { cartas, prepFase, faseAtual, trataEscolha, choice1, choice2, recorde } = useGame();

    return (
        <div className="App">
            <header className="header-jogo">
                <div className="titulo-container">
                    <img src="/titulo.png" alt="Pokemoria" className="img-titulo" />
                    <button className="btn-refresh" onClick={() => prepFase(true)}>
                        <img src="/refresh.png" alt="Reseta o jogo" />
                    </button>
                </div>
                <div className="recorde-badge">
                    Nível: {faseAtual} | 🏆 Recorde: {recorde}
                </div>
            </header>
            <div className="card-grid">
                {cartas.map(carta => {
                    const isFlipped = carta === choice1 || carta === choice2 || carta.combinado;

                    return (
                        <div key={carta.id} className="card-container" onClick={() => trataEscolha(carta)}>
                            <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
                                <div className="card-front">
                                    <img src={carta.src} alt="Pokemon" />
                                </div>
                                <div className="card-back">
                                    <img src="/verso.png" alt="Verso" />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
            <footer className="footer-creditos">
                Desenvolvido por <strong>Douglas Lima</strong>
            </footer>
        </div>
    )
}

export default App;