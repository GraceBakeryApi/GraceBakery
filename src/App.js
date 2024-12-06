import './App.css';
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/Main'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const tailwindColors = {
  cream: {
    light: 'FFFFFF',
    main: '#FFFBEB',
    dark: '#E6C7B4',
  },
  beige: {
    light: '#C9A97F',
    main: '#A2845E',
    dark: '#9B7857',
  },
  red: {
    light: '#FFC1C1',
    main: '#FF746C',
    dark: '#E56767',
  },
  blue: {
    light: '#C1EFFF',
    main: '#8AD9FF',
    dark: '#67BCE5'
  }
};

const theme = createTheme({
  palette: {
    primary: tailwindColors.blue,
    secondary: tailwindColors.beige,
    error: tailwindColors.red,
    background: {
      default: tailwindColors.cream.light,
      paper: tailwindColors.cream.main,
    },
  },
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
