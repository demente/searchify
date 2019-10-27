import React, { ReactPropTypes } from 'react';
import Login from './components/Login';

import ResponsiveContainer from './components/ResponsiveContainer';
import Footer from './components/Footer';
import SearchResult from './components/SearchResult';
import axios from 'axios';


type HashParams = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  state?: string;
}


let params: HashParams = {};
window.location.hash
  .substring(1)
  .split("&").forEach((item) => {
    const parts: string[] = item.split("=");
    if (parts[0] === 'access_token') {
      params.access_token = parts[1];
    }
  })

window.location.hash = "";

type OwnState = { token?: string };
type OwnProps = {};

class App extends React.Component<OwnProps, OwnState>  {

  componentDidMount() {
    let _token: string | undefined = params.access_token;

    if (_token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${_token}`;
      this.setState({
        token: _token
      });
    }
  }

  render() {
    return (
      <ResponsiveContainer>
        {(!this.state || !this.state.token)
          && (<Login />)}
        {this.state && this.state.token && <SearchResult />}

        <Footer />
      </ResponsiveContainer>
    );
  }

}

export default App;
