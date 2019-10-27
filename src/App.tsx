import React from 'react';
import Login from './components/Login';

import ResponsiveContainer from './components/ResponsiveContainer';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <ResponsiveContainer>
      <Login />
      {/* <SearchResult/> */}

      <Footer />
    </ResponsiveContainer>
  );
}

export default App;
