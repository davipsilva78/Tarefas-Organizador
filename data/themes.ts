
export interface Theme {
    name: string;
    colors: {
        '--custom-blue': string;
        '--custom-light-blue': string;
        '--custom-dark-blue': string;
    };
}

export const themes: { [key: string]: Theme } = {
  'blue': { 
    name: 'Azul Padrão', 
    colors: { 
        '--custom-blue': '#007BFF', 
        '--custom-light-blue': '#F0F7FF', 
        '--custom-dark-blue': '#0056b3' 
    } 
  },
  'green': { 
    name: 'Verde Esmeralda', 
    colors: { 
        '--custom-blue': '#28a745', 
        '--custom-light-blue': '#e9f7eb', 
        '--custom-dark-blue': '#1e7e34' 
    } 
  },
  'red': { 
    name: 'Vermelho Carmesim', 
    colors: { 
        '--custom-blue': '#dc3545', 
        '--custom-light-blue': '#fdeaec', 
        '--custom-dark-blue': '#b02a37' 
    } 
  },
  'purple': { 
    name: 'Roxo Imperial', 
    colors: { 
        '--custom-blue': '#6f42c1', 
        '--custom-light-blue': '#f1eefe', 
        '--custom-dark-blue': '#59369a' 
    }
  },
   'orange': { 
    name: 'Laranja Vibrante', 
    colors: { 
        '--custom-blue': '#fd7e14', 
        '--custom-light-blue': '#fff2e7', 
        '--custom-dark-blue': '#d96a0b' 
    }
  },
};
