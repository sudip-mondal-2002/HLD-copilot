import {Container, Button, Typography} from "@mui/material";
import {Requirements} from "@/types/Requirements";
import React from "react";
import {RequirementsInput} from "@/components/RequirementsInput";
import {RequirementDisplay} from "@/components/RequirementDisplay";
import {DisplayContext} from "@/context/DisplayContext";

export const RequirementsForm = () => {
  const [requirements, setRequirements] = React.useState<Requirements>({
    functional: [],
    nonFunctional: []
  })
  const displayContext = React.useContext(DisplayContext)

  const generateSystem = async () => {
    const data = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requirements)
    })
    const system = await data.json()
    displayContext.setSystem(system)
  }

  return (
    <Container
      sx={{
        width: {
          sm: "100%",
          md: "30%"
        }
      }}
    >
      <Typography variant={"h4"}>Requirements</Typography>
      <Typography variant={"h6"} sx={{
        marginTop: 4
      }}>Functional</Typography>
      <RequirementDisplay requirements={requirements.functional} onRemove={
        (index) => setRequirements({
          ...requirements,
          functional: requirements.functional.filter((_, i) => i !== index)
        })
      }/>
      <RequirementsInput
        placeholder={"Users will be able to ..."}
        onAdd={(requirement) => setRequirements({
          ...requirements,
          functional: [...requirements.functional, requirement]
        })}
      />

      <Typography variant={"h6"} sx={{
        marginTop: 4
      }}>Non Functional</Typography>

      <RequirementDisplay requirements={requirements.nonFunctional} onRemove={
        (index) => setRequirements({
          ...requirements,
          nonFunctional: requirements.nonFunctional.filter((_, i) => i !== index)
        })
      }/>
      <RequirementsInput
        placeholder={"The system should ..."}
        onAdd={(requirement) => setRequirements({
          ...requirements,
          nonFunctional: [...requirements.nonFunctional, requirement]
        })}
      />

      <Button onClick={generateSystem}>
        Generate System
      </Button>

    </Container>
  )
}