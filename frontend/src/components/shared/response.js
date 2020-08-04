import React, { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
export default function Response(props) {
  const [open, setOpen] = useState(props.open);
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);
  return (
    <div>
      {open ? (
        <Message
          style={{
            position: "absolute",
            width: "20rem",
            marginLeft: "auto",
            marginRight: "auto",
            top: "6rem",
            left: "0",
            right: "0",
            zIndex:"1",
            backgroundColor:"lightcoral"
          }}
        >
          {props.message}
        </Message>
      ) : (
        <div />
      )}
    </div>
  );
}
