import {Container} from "@mui/material";
import React from "react";
import {DisplayContext} from "@/context/DisplayContext";
import {SystemDisplay} from "@/components/SystemDisplay";

export const DisplayContainer = () => {
  const {system} = React.useContext(DisplayContext)
  return (
    <Container sx={{
      width: {
        sm: '100%',
        md: '70%'
      }
    }}>
      {system ? <SystemDisplay system={system}/> : "Let's Generate ..."}
    </Container>
  )
}