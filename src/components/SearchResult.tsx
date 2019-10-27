import React from 'react';
import _ from 'lodash';
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
  results: any[],
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

}

componentDidMount() {
    axios.get(`${api_url}/me/playlists`).then((response: AxiosResponse) => {
        this.setState({ playlists: response.data.items });
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
            action={<Dropdown button basic floating options={playlists.map(p => 
             {return {key: p.id, text: p.name, value: p.id}}
            ).concat({key: 'all', text: 'All', value: 'all'})} defaultValue='all' />}
            placeholder='Enter the lyrics...'
          />
        </Grid.Row>
        <Grid.Row><Button primary >Search</Button></Grid.Row>
      </Grid>


      <Header as='h3' content='Song suggestions' style={style.h3} textAlign='center' />
      <Grid textAlign='center'>
        <Item.Group divided>
          <Item>
            <Item.Image src='/musixmatch.png' />
            <Item.Content>
              <Item.Header>Song name</Item.Header>
              <Item.Meta>
                <span>Band</span>
              </Item.Meta>
              <Item.Description>Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?</Item.Description>
              <Item.Extra>
                <Button primary floated='right' as='a' href='#' target="_blank">
                  Listen on Spotify
            <Icon name='external' style={style.floatedRight} />

                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
          <Item>
            <Item.Image src='/musixmatch.png' />
            <Item.Content>
              <Item.Header>Song name</Item.Header>
              <Item.Meta>
                <span>Band</span>
              </Item.Meta>
              <Item.Description>Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?</Item.Description>
              <Item.Extra>
                <Button primary floated='right' as='a' href='#' target="_blank">
                  Listen on Spotify
            <Icon name='external' style={style.floatedRight} />

                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
          <Item>
            <Item.Image src='/musixmatch.png' />
            <Item.Content>
              <Item.Header>Song name</Item.Header>
              <Item.Meta>
                <span>Band</span>
              </Item.Meta>
              <Item.Description>Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?Some lyrics here?</Item.Description>
              <Item.Extra>
                <Button primary floated='right' as='a' href='#' target="_blank">
                  Listen on Spotify
            <Icon name='external' style={style.floatedRight} />

                </Button>
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>

      </Grid>
    </React.Fragment>;
  }

}

export default SearchResult;