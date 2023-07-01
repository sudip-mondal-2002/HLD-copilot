import {Container, Button, Typography, TextField} from "@mui/material";
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

  const [projectTitle, setProjectTitle] = React.useState<string>("")
  const [projectDescription, setProjectDescription] = React.useState<string>("")

  const displayContext = React.useContext(DisplayContext)

  const generateSystem = async () => {
    const data = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        requirements,
        title: projectTitle,
        description: projectDescription
      })
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
      <TextField
        required={true}
        margin={"normal"}
        placeholder={"A browser based virtual machine ..."}
        label={"Project title"}
        fullWidth={true}
        value={projectTitle}
        onChange={(event) => setProjectTitle(event.target.value)}
      />
      <TextField
        required={true}
        multiline={true}
        margin={"normal"}
        placeholder={"Can be used as a cheap and handy alternative to conventional VMs ..."}
        label={"Project description"}
        fullWidth={true}
        value={projectDescription}
        onChange={(event) => setProjectDescription(event.target.value)}
      />

      <Typography variant={"h6"} sx={{
        marginTop: 4
      }}>Functional Requirements</Typography>
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
      }}>Non Functional Requirements</Typography>

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

      <Button
        onClick={generateSystem}
        variant={"contained"}
        disabled={!projectTitle || !projectDescription}
        sx={{
          width: "100%"
        }}
      >
        Generate System Architecture
      </Button>

    </Container>
  )
}