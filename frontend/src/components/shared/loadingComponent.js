import React from "react";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

export default function () {
  return (
    <Segment style={{ marginTop: "2rem", border: "none" }}>
      <Dimmer active inverted>
        <Loader style={{ marginTop: ".9rem" }} inverted>
          Loading...
        </Loader>
      </Dimmer>
    </Segment>
  );
}
