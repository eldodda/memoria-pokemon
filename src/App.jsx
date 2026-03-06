import { useEffect, useState } from "react";
import { useGame } from "./hooks/useGame.js";
import './App.css';

function App() {
    const { cartas, prepFase, faseAtual, trataEscolha, choice1, choice2, recorde, config, setConfig } = useGame();
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <div className={`App ${config.darkMode ? 'night-mode' : ''}`}>
            <header className="header-jogo">
                <div className="titulo-container">
                    <img src="/titulo.png" alt="Pokemoria" className="img-titulo" />
                    <button className="btn-config" onClick={() => setMenuAberto(!menuAberto)}>
                        <img src="/sets.png" alt="Config" />
                    </button>
                    <button className="btn-refresh" onClick={() => prepFase(true)}>
                        <img src="/refresh.png" alt="Reset" />
                    </button>
                </div>
                <div className="recorde-badge">
                    Nível: {faseAtual} | 🏆 Recorde: {recorde}
                </div>
            </header>

            {menuAberto && (
                <div className="menu-config">
                    <h3>Configurações</h3>

                    <div className="opcao">
                        <span>Visual:</span>
                        <button onClick={() => setConfig({ ...config, useSprites: false })}>Art</button>
                        <button onClick={() => setConfig({ ...config, useSprites: true })}>GBA</button>
                    </div>

                    <div className="opcao">
                        <span>Sons:</span>
                        <button onClick={() => setConfig({ ...config, useAnimeCries: false })}>GBA</button>
                        <button onClick={() => setConfig({ ...config, useAnimeCries: true })}>Anime</button>
                    </div>

                    <button className="btn-drk-mode" onClick={() => setConfig({...config, darkMode: config.darkMode ? false : true})}>
                        <img src={config.darkMode ? "/sun.png" : "/moon.png"} alt="Night Mode" />
                    </button>

                    <button className="btn-fechar" onClick={() => setMenuAberto(false)}>Voltar</button>
                </div>
            )}

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