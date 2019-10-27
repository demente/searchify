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

const options = [
  { key: 'all', text: 'All', value: 'all' },
  { key: '1', text: 'Playlist 1', value: '1' },
  { key: '2', text: 'Playlist 2', value: '2' },
];


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
  value: any;
  results: string[];
}

type OwnProps = {}

class SearchResult extends React.Component<OwnProps, OwnState>{
  state = { isLoading: false, results: [], value: '' };

  handleResultSelect() {

  }

  handleSearchChange() {

  }

  render() {
    const { isLoading, value, results } = this.state

    return <React.Fragment>
      <Grid columns={1} container textAlign='center'>
        <Grid.Row>
          &nbsp;
        </Grid.Row>
        <Grid.Row>

          <Input
            action={<Dropdown button basic floating options={options} defaultValue='all' />}
            placeholder='Enter the lyrics...'
          />
        </Grid.Row>
        <Grid.Row>  <Button primary >Search</Button></Grid.Row>
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