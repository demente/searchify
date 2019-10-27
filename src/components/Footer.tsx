import React from "react";
import {
    Container,
    Grid,
    Image,
    Segment,
} from 'semantic-ui-react';

class Footer extends React.Component {

    render() {
        return <Segment inverted
            style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
            vertical>
            <Container>
                <Grid divided inverted stackable>
                    <Grid.Row>

                        <Grid.Column width={12}>
                            <Image as="a" href="https://musixmatch.com" size="medium" src="musixmatch.png" target="_blank" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    }
}

export default Footer;