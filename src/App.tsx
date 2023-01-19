import React from 'react';
import './App.css';
import Main from './main';
import { MOBILE_WIDTH } from './constants/subscride_api';

export const WindowSizeContext = React.createContext({ width: window.innerWidth, height: Math.floor(window.innerHeight / 21) })


function App() {
  const [windowWidth, setWindowWidth] = React.useState(0)
  const [orderCount, setOrdersCount] = React.useState(0)

  let multiplier = 1


  React.useEffect(() => {
    window.innerWidth <= MOBILE_WIDTH ? multiplier = 0.45 : multiplier = 1;
    setWindowWidth(() => window.innerWidth);
    setOrdersCount(Math.floor(window.innerHeight / 21 * multiplier));
    if (windowWidth)
      window.onresize = () => {
        setOrdersCount(Math.floor(window.innerHeight / 21 * multiplier));
      }
  }, [])

  return (
    <WindowSizeContext.Provider value={{ width: windowWidth, height: orderCount }}>
      <div className='container'>
        <Main />
      </div>
    </WindowSizeContext.Provider>
  );
}

export default App;
