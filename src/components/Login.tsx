import React from 'react';

import {
  Button,
  Grid,
} from 'semantic-ui-react'



const authEndpoint = 'https://accounts.spotify.com/authorize/';
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URL;
const scopes = [
  "user-library-read",
  "playlist-read-collaborative",
  "playlist-read-private"
];


class Login extends React.Component {

  render() {
    return <Grid columns={1} container textAlign='center'>
      <Grid.Row style={{ marginTop: '20%', marginBottom: '20%' }}>
        <Button primary size='huge'
         href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
          Login with Spotify
          </Button>
      </Grid.Row>
    </Grid>;
  }
}

export default Login;