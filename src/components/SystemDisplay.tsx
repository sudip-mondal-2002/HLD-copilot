import {Container} from "@mui/material";
import React from "react";
import {DisplayContext} from "@/context/DisplayContext";

export const SystemDisplay = () => {
  const {system} = React.useContext(DisplayContext)
  return (
    <Container sx={{
      width: {
        sm: '100%',
        md: '70%'
      }
    }}>
      <h1>System Display</h1>
      {system && JSON.stringify(system)}
    </Container>
  )
}