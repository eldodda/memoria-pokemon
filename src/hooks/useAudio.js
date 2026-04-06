export const useAudio = () => {
    const playSom = (caminho, volume = 1) => {
        if (!caminho) return;
        const audio = new Audio(`${caminho}?v=${Date.now()}`);
        audio.volume = volume;
        audio.play().catch(e => console.warn("Áudio bloqueado pelo navegador", e));
    };

    return { playSom };
};
