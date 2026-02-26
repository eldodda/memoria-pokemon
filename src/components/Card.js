const Carta = ({ carta, handleChoice, flipped, disabled }) => {

    const handleClick = () => {
        if (!disabled && !flipped) {
            handleChoice(carta);
        }
    };

    return (
        <div className="card-container" onClick={handleClick}>
            <div className={flipped ? "card flipped" : "card"}>
                <img className="frente" src={carta.src} alt="Frente" />

                <img className="verso" src="/img/verso.png" alt="Verso" />
            </div>
        </div>
    );
};