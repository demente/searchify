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
  Loader
  

} from 'semantic-ui-react';
import axios, { AxiosResponse } from 'axios';

type Artist = {
  id: string,
  name: string
}

type MusixmatchTrackResponse = {
  message: {
    body: {
      track_list: [
        {
          track: {has_lyrics: boolean;
            track_id: number;}
          }
      ]
    }
  }
}

type LyricsResponse = {
  message: {
    body: {
      lyrics: {
        lyrics_body: string;
        pixel_tracking_url: string;
        lyrics_copyright: string;
      }
    }
  }
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
  album: {images: {height: number, url: string}[]},
  lyrics?: string,
  musixmatchUrl?: string,
  copyright?: string,
}

type Playlist = {
  collaborative?: boolean;
  external_urls?: { spotify: string };
  href?: string;
  id: string;
  images?: [];
  name: string;
  owner?: { display_name: string; external_urls: {}; href: string; id: string; type: string };
  primary_color?: string;
  public?: boolean;
  snapshot_id?: string;
  tracks?: { href: string; total: number };
  fetched_tracks?: TrackResponse[],
  type?: string;
  uri?: string;
}

const api_url: string = process.env.REACT_APP_SPOTIFY_API_URL as string | '';
const musixmatch_url: string = process.env.REACT_APP_MUSIXMATCH_API_URL as string | '';
const musixmatch_api_key: string = process.env.REACT_APP_MUSIXMATCH_ID as string | '';

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
  lyrics?: string;
  isSearching: boolean;
}

type OwnProps = {}

class SearchResult extends React.Component<OwnProps, OwnState>{
  state: OwnState = { playlists: [], results: [], isSearching: false };

  constructor(props: OwnProps, state: OwnState) {
    super(props, state);
    this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchClicked = this.handleSearchClicked.bind(this);
  }

  private handlePlaylistChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
     data && data.value && this.setState({ selectedPlaylist: this.state.playlists.find(playlist => playlist.id === data.value) });

  }

  private async fetchTracksRecursively(next: string):Promise< TrackResponse[]> {
   return axios.get(next).then(
        async (response: AxiosResponse) => {
          const current = response.data.items;
          let nextTracks: any[] = [];

          if(response.data.next){
            nextTracks = await this.fetchTracksRecursively(response.data.next);
          }
          
          return current.concat(nextTracks);
        }
      );
    
  }

  private async fetchTracks() {
  for (const playlist of this.state.playlists) {
     if(playlist && playlist.tracks) {
       playlist.fetched_tracks = await this.fetchTracksRecursively(playlist.tracks.href);
      } 
    }
  }

  componentDidMount() {
    axios.get(`${api_url}/me/playlists`).then((response: AxiosResponse) => {
      const playlists=response.data.items.concat({id: 'all',  name:'All Saved Tracks', tracks: {href: `${api_url}/me/tracks?limit=50`}});

      this.setState({ playlists });
      this.fetchTracks();
      });
  }

  private handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({lyrics: e.target.value.toLowerCase()});
  }

  private async fetchTracksWithLyrics(tracks: Track[]): Promise<Track[]>{
    let matchingTracks: Track[] = [];
    for(const track of tracks ){
      if(track.lyrics){
        if(!this.state.lyrics || (this.state.lyrics && 
          track.lyrics.toLowerCase().indexOf(this.state.lyrics) > -1)){
          matchingTracks.push(track);
         }
      }
      else{
        const musixmatchTrack = await this.fetchMusixmatchTrack(track);
        if(musixmatchTrack.message.body && musixmatchTrack.message.body.track_list && musixmatchTrack.message.body.track_list[0] && musixmatchTrack.message.body.track_list[0].track.has_lyrics){
          const musixmatch_id=  musixmatchTrack.message.body.track_list[0].track.track_id;
         if (musixmatch_id){
            await axios.get(`${musixmatch_url}/track.lyrics.get?track_id=${musixmatch_id}&apikey=${musixmatch_api_key}`).then((response: AxiosResponse) => {
            const lyricsResponse: LyricsResponse = response.data;
            track.lyrics = lyricsResponse.message.body.lyrics.lyrics_body;
            track.musixmatchUrl = lyricsResponse.message.body.lyrics.pixel_tracking_url;
            track.copyright = lyricsResponse.message.body.lyrics.lyrics_copyright;
            if(!this.state.lyrics || (this.state.lyrics && 
             lyricsResponse.message.body.lyrics.lyrics_body.toLowerCase().indexOf(this.state.lyrics) > -1)){
               matchingTracks.push(track);
            }
              });
          }
        }
      }
    }
    return matchingTracks;
    }

  private async fetchMusixmatchTrack(track: Track): Promise<MusixmatchTrackResponse>{
    const artists = track.artists.map(artist => artist.name).join(', ');
     return axios.get(`${musixmatch_url}/track.search?q_artist=${artists}&q_track=${track.name}&apikey=${musixmatch_api_key}`).then((response: AxiosResponse) => 
      {
      return response.data;
      });
    }

 private async handleSearchClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { selectedPlaylist } = this.state;
    this.setState({isSearching: true});

    const tracks = selectedPlaylist && selectedPlaylist.fetched_tracks ? selectedPlaylist.fetched_tracks.map(track => track.track) : [];

    const result = await this.fetchTracksWithLyrics(tracks);
    
    this.setState({ results: result});
    this.setState({isSearching: false});
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
            )} />}
            placeholder='Enter the lyrics...'
          />
        </Grid.Row>
        <Grid.Row><Button primary onClick={this.handleSearchClicked}>Search</Button></Grid.Row>
      </Grid>

      {this.state.isSearching?<Grid textAlign='center'> <Loader active inline/></Grid>: null}
      {this.state.results && this.state.results.length > 0 ? <Header as='h3' content='Song suggestions' style={style.h3} textAlign='center' /> : <Grid.Row style={{ marginBottom: '26%' }}>&nbsp;</Grid.Row>}
      <Grid textAlign='center'>
        <Item.Group divided>
          {results.map(track => {
            return <Item key={track.id}>
              <Item.Image size="tiny" src={track.album.images.find(image => image.height === 64) ? track.album.images.find(image => image.height === 64)!.url : 'musixmatch.png'} />
              <Item.Content>
                <Item.Header>{track.name}
                {track.musixmatchUrl ? <img src={track.musixmatchUrl} alt="copyright" hidden/>: null}
                </Item.Header>
                <Item.Meta>
                  <span>{track.artists.map(artist => artist.name).join(', ')}</span>
                </Item.Meta>
                <Item.Description>{track.lyrics && track.lyrics.split ('\n').map ((item, i) => <p key={i}>{item}</p>)}
                <Item.Meta>
               {track.copyright}
                </Item.Meta>
                </Item.Description>
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