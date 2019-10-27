import React from 'react';

import {
  Button,
  Grid,
  Header,
  Icon,
  Item,
  Input,
  Dropdown,
  DropdownProps,

} from 'semantic-ui-react';
import axios, { AxiosResponse } from 'axios';

type Artist = {
  id: string,
  name: string
}


type TrackResponse = {
  track: Track;
}

type Track = {
  artists: Artist[],
  href: string,
  id: string,
  is_playable: boolean,
  external_urls: { spotify: string }
  name: string,
  album: {images: {height: number, url: string}[]}
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
  fetched_tracks?: TrackResponse[],
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
  playlists: Playlist[];
  results: Track[],
  selectedPlaylist?: Playlist;
}

type OwnProps = {}

class SearchResult extends React.Component<OwnProps, OwnState>{
  state: OwnState = { playlists: [], results: [] };

  constructor(props: OwnProps, state: OwnState) {
    super(props, state);
    this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchClicked = this.handleSearchClicked.bind(this);
  }

  private handlePlaylistChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    data && data.value && this.setState({ selectedPlaylist: this.state.playlists.find(playlist => playlist.id === data.value) });
  }

  private fetchTracks() {
    for (const playlist of this.state.playlists) {
      axios.get(playlist.tracks.href).then((response: AxiosResponse) => {
        playlist.fetched_tracks = response.data.items;
      });
    }
  }

  componentDidMount() {
    axios.get(`${api_url}/me/playlists`).then((response: AxiosResponse) => {
      this.setState({ playlists: response.data.items });
      this.fetchTracks();
    });
  }

  private handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }

 private handleSearchClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { selectedPlaylist } = this.state;
    console.log(selectedPlaylist);
    this.setState({ results: selectedPlaylist && selectedPlaylist.fetched_tracks ? selectedPlaylist.fetched_tracks.map(track => track.track) : [] })
  }

  render() {
    const { results, playlists } = this.state

    return <React.Fragment>
      <Grid columns={1} container textAlign='center'>
        <Grid.Row>
          &nbsp;
        </Grid.Row>
        <Grid.Row>

          <Input onChange={this.handleInputChange}
            action={<Dropdown onChange={this.handlePlaylistChange} button basic floating options={playlists.map(p => { return { key: p.id, text: p.name, value: p.id } }
            ).concat({ key: 'all', text: 'All', value: 'all' })} defaultValue='all' />}
            placeholder='Enter the lyrics...'
          />
        </Grid.Row>
        <Grid.Row><Button primary onClick={this.handleSearchClicked}>Search</Button></Grid.Row>
      </Grid>


      {this.state.results && this.state.results.length > 0 ? <Header as='h3' content='Song suggestions' style={style.h3} textAlign='center' /> : <Grid.Row style={{ marginBottom: '26%' }}>&nbsp;</Grid.Row>}
      <Grid textAlign='center'>
        <Item.Group divided>
          {results.map(track => {
            return <Item key={track.id}>
              <Item.Image size="tiny" src={track.album.images.find(image => image.height === 64)!.url} />
              <Item.Content>
                <Item.Header>{track.name}</Item.Header>
                <Item.Meta>
                  <span>{track.artists.map(artist => artist.name).join(', ')}</span>
                </Item.Meta>
                <Item.Description>Lyrics go here</Item.Description>
                <Item.Extra>
                   <Button primary floated='right' as='a' href={track.external_urls.spotify} target="_blank">
                    Listen on Spotify
   <Icon name='external' style={style.floatedRight} />
                  </Button> 
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