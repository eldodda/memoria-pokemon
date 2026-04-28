import { useEffect, useState } from 'react';

export const useSettings = () => {
  const [recorde, setRecorde] = useState(() => {
    const salvo = localStorage.getItem('recorde-salvo');
    return salvo ? parseInt(salvo) : 0;
  });

  const [config, setConfig] = useState(() => {
    const configSalva = localStorage.getItem('config-salva');
    return configSalva
      ? JSON.parse(configSalva)
      : {
          useSprites: false,
          useAnimeCries: false,
          nightMode: false,
        };
  });

  useEffect(() => {
    localStorage.setItem('config-salva', JSON.stringify(config));
  }, [config]);

  const atualizarRecorde = (novaFase) => {
    if (novaFase > recorde) {
      // Se a nova fase for maior que o recorde atual:
      setRecorde(novaFase); // Ela passa a ser o novo recorde.
      localStorage.setItem('recorde-salvo', novaFase.toString()); // E o recorde é guardado no localStorage.
    }
  };

  return { config, setConfig, recorde, atualizarRecorde };
};
