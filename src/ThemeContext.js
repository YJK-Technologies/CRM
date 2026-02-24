import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = {
  blue: {         // --BLUE -- COLOR
    '--bg-color': "#dafcff",
    '--font-color': '#FBE3D1',
    '--sidenav-menu': '#416680',
    '--ag-header': '#416680',
    '--ag-row': '#afc9dc',                          
    '--ag-col': '#86a7c7',
    '--ag-h1': '#416680',
    '--but': '#416680',
    '--but-border': "#3a6787",
    '--ag-row-even-hover': "#bfe0de",
    '--ag-row-odd-hover' : '#afc9dc',
    '--but-hover': '#1b72af',
    '--sidenav-hover': '#d6eaf8 ',
    '--exp-input-field': '#86a7c7',
    "--exp-container": "#dafcff",
    '--font-hover': '#000000',
    '--chart-bg' : ' #1A4862',
    '--ESS-hov'  : '#edfc00 '
  },
  red: {                // --RED -- COLOR
    '--bg-color': "#FBE3D1",
    '--font-color': '#FBE3D1',
    '--sidenav-menu': '#6a0000',
    '--ag-header': '#6a0000',
    '--ag-row': '#fadac2',
    '--ag-col': '#c66f6f',
    '--ag-h1': '#6a0000',
    '--but': '#6a0000',
    '--but-border': "#6a0000",
    '--ag-row-even-hover': "#d07c7c",
    '--ag-row-odd-hover' : "#de5555",
    '--sidenav-hover': '#cf603f',
    '--but-hover': '#b00000',
    '--exp-input-field': '#c48484',
    '--font-hover': '#ffffff',
    '--chart-bg' : ' #1A4862'
  },
  green: {                    // --GREEN -- COLOR
    '--bg-color': '#EEE7CE',
    '--font-color': '#FBE3D1',
    '--sidenav-menu': '#064439',
    '--ag-header': '#064439',
    '--ag-row': '#eadeb3',
    '--ag-col': '#90ceb0',
    '--ag-h1': '#064439',
    '--but': '#064439',
    '--but-border': '#064439',
    '--ag-row-even-hover': "#8acec2",
    '--ag-row-odd-hover' : "#0b967d",
    '--but-hover': '#0c9c82',
    '--sidenav-hover': '#0c9c82',
    '--exp-input-field': '#b2e0ca',
    '--font-hover': '#000000',
    '--chart-bg' : ' #1A4862'
  },
  dark: {                       // --BLACK -- COLOR
    '--bg-color': '#FBF8F3',
    '--font-color': '#ffffff',
    '--sidenav-menu': '#232323',
    '--ag-header': '#232323',
    '--ag-row': '#999999',
    '--ag-col': '#e3e3e3',
    '--ag-h1': '#232323',
    '--but': '#232323',
    '--but-border': '#232323',
    '--ag-row-even-hover': "#9c9c9c",
    '--ag-row-odd-hover' : '#c8c8c8',
    '--but-hover': '#d8d8d8',
    '--sidenav-hover': '#bebebe',
    '--exp-input-field': '#cecece',
    '--font-hover': '#232323',
    '--chart-bg' : ' #1A4862'
  },
  brown: {                      // --BROWN -- COLOR
    '--bg-color': '#fff0eb',
    '--font-color': '#ffffff',
    '--sidenav-menu': '#3d0f00',
    '--ag-header': '#3d0f00',
    '--ag-row': '#e5d7d2',
    '--ag-col': '#ab897e',
    '--ag-h1': '#3d0f00',
    '--but': '#3d0f00',
    '--but-border': '#3d0f00',
    '--ag-row-even-hover': "#9c9c9c",
    '--ag-row-odd-hover' : '#c8c8c8',
    '--but-hover': '#a55d46',
    '--sidenav-hover': '#a55d46',
    '--exp-input-field': '#ad9e9a',
    '--font-hover': '#ffffff',
    '--chart-bg' : ' #1A4862'
  },
  Rose: {                      // --BROWN -- COLOR
    '--bg-color': '#e9edd1',
    '--font-color': '#ffffff',
    '--sidenav-menu': '#1A4862',
    '--ag-header': '#1A4862',
    '--ag-row': '#add3e9',
    '--ag-col': '#dce9f0',
    '--ag-h1': '#1A4862',
    '--but': '#1A4862',
    '--but-border': '#1A4862',
    '--ag-row-even-hover': "#80c1e6",
    '--ag-row-odd-hover' : '#add3e9',
    '--but-hover': '#1A4862',
    '--sidenav-hover': '#e9edd1',
    '--exp-input-field': '#D7DFA3',
    '--chart-bg' : ' #1A4862',
    '--font-hover': '#000000'
  },

  Orange: {                      // --BROWN -- COLOR
    '--bg-color': '#FFF2D7',
    '--font-color': '#ffffff',
    '--sidenav-menu': '#F98866',
    '--ag-header': '#F98866',
    '--ag-row': '#febfad',
    '--ag-col': '#ffe6de',
    '--ag-h1': '#F98866',
    '--but': '#F98866',
    '--but-border': '#F98866',
    '--ag-row-even-hover': "#F98866",
    '--ag-row-odd-hover' : '#F98866',
    '--but-hover': '#F98866',
    '--sidenav-hover': '#FFF2D7',
    '--exp-input-field': '#FFF2D7',
    '--chart-bg' : ' #1A4862'
    
  },
 

  // add colors --
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    Object.keys(themes[themeName]).forEach((key) => {
      root.style.setProperty(key, themes[themeName][key]);
    });
  };

  const setAppTheme = (themeName) => {
    setTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('theme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
