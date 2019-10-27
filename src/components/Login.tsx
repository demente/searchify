import React from 'react';

import {
  Button,
  Grid,
} from 'semantic-ui-react'


const height = window.innerWidth;
class Login extends React.Component {

  render() {
    return <Grid columns={1} container textAlign='center'>
      <Grid.Row style={{ marginTop: '20%', marginBottom: '20%' }}>
        <Button primary size='huge'>Login with Spotify</Button>
      </Grid.Row>
    </Grid>;
  }
}

export default Login;