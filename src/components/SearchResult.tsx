import React from 'react';

import {
  Button,
  Grid,
  Header,
  Icon,
  Item,
  Input,
  Dropdown,

} from 'semantic-ui-react';
import axios, { AxiosResponse } from 'axios';

type Artist = {
  id: string,
  name: string
}

type Track = {
  artists: Artist[],
  href: string,
  id: string,
  is_playable: boolean,
  external_urls: { spofify: string }
  name: string
}

type Playlist = {
  collaborative: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: [];
  name: string;
  owner: { display_name: string; external_urls: {}; href: string; id: string; type: string };
  primary_color?: string;
  public: boolean;
  snapshot_id: string;
  tracks: { href: string; total: number };
  type: string;
  uri: string;
}

const api_url: string = process.env.REACT_APP_SPOTIFY_API_URL as string | '';

const style = {
  h1: {
    marginTop: '3em',
  },
  h2: {
    margin: '4em 0em 2em',
  },
  h3: {
    marginTop: '2em',
    padding: '2em 0em',

  },
  last: {
    marginBottom: '300px',
  },
  halfHeight: {
    height: '50%',
  },
  floatedRight: {
    float: 'right',
    marginLeft: '5px',
  },
};

type OwnState = {
  isLoading: boolean;
  playlists: Playlist[];
  results: Track[],
  selectedPlaylist?: string;
}

type OwnProps = {}

class SearchResult extends React.Component<OwnProps, OwnState>{
  state: OwnState = { isLoading: false, playlists: [], results: [], selectedPlaylist: '' };

  constructor(props: OwnProps, state: OwnState) {
    super(props, state);
    this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
  }

  private handlePlaylistChange(event: any) {
    event && event.target && this.setState({ selectedPlaylist: event.target.value });
  }

  private fetchTracks() {
    for (const playlist of this.state.playlists) {
      
      axios.get(playlist.tracks.href).then((response: AxiosResponse) => {
          console.log(response.data.items);
        });
    }
  }

  componentDidMount() {
    axios.get(`${api_url}/me/playlists`).then((response: AxiosResponse) => {
      this.setState({ playlists: response.data.items });
      this.fetchTracks();
    });
  }

  handleResultSelect() {

  }

  handleSearchChange() {

  }

  render() {
    const { isLoading, selectedPlaylist, results, playlists } = this.state

    return <React.Fragment>
      <Grid columns={1} container textAlign='center'>
        <Grid.Row>
          &nbsp;
        </Grid.Row>
        <Grid.Row>

          <Input
            action={<Dropdown button basic floating options={playlists.map(p => { return { key: p.id, text: p.name, value: p.id } }
            ).concat({ key: 'all', text: 'All', value: 'all' })} defaultValue='all' />}
            placeholder='Enter the lyrics...'
          />
        </Grid.Row>
        <Grid.Row><Button primary >Search</Button></Grid.Row>
      </Grid>


      {this.state.results && this.state.results.length > 0 ? <Header as='h3' content='Song suggestions' style={style.h3} textAlign='center' />: <Grid.Row style={{marginBottom: '26%'}}>&nbsp;</Grid.Row>}
      <Grid textAlign='center'>
        <Item.Group divided>
          {results.map(track => {
            return <Item>
              <Item.Image src='/musixmatch.png' />
              <Item.Content>
                <Item.Header>${track.name}</Item.Header>
                <Item.Meta>
                  <span>${track.artists.map(artist => artist.name).concat(',')}</span>
                </Item.Meta>
                <Item.Description>Lyrics go here</Item.Description>
                <Item.Extra>
                  {track.is_playable ? <Button primary floated='right' as='a' href={track.external_urls.spofify} target="_blank">
                    Listen on Spotify
   <Icon name='external' style={style.floatedRight} />
                  </Button> : null}
                </Item.Extra>
              </Item.Content>
            </Item>
          })}
        </Item.Group>

      </Grid>
    </React.Fragment>;
  }

}

export default SearchResult;