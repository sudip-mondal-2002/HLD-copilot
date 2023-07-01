import {Container} from "@mui/material";
import React from "react";
import {DisplayContext} from "@/context/DisplayContext";
import dynamic from "next/dynamic";
const SystemDisplay = dynamic(import("./SystemDisplay"), {ssr: false})

export const DisplayContainer = () => {
  const {system} = React.useContext(DisplayContext)
  return (
    <Container sx={{
      width: {
        sm: '100%',
        md: '70%'
      },
      minHeight: "100vh"
    }}>
      {system ? <SystemDisplay system={system}/> : "Let's Generate ..."}
    </Container>
  )
}