import {Container, Button, Typography, TextField} from "@mui/material";
import {Requirements} from "@/types/Requirements";
import React from "react";
import {RequirementsInput} from "@/components/input/RequirementsInput";
import {RequirementDisplay} from "@/components/input/RequirementDisplay";
import {useHldGenerator} from "@/hooks/useHldGenerator";

type RequirementsFormProps = {
  _projectTitle?: string;
  _projectDescription?: string;
  _requirements?: Requirements;
  _projectID?: string;
}

export const RequirementsForm = (
  {
    _projectID = undefined,
    _projectTitle = "",
    _projectDescription = "",
    _requirements = {
      functional: [],
      nonFunctional: []
    }
  }: RequirementsFormProps) => {
  const [requirements, setRequirements] = React.useState<Requirements>(_requirements)

  const [projectTitle, setProjectTitle] = React.useState<string>(_projectTitle)
  const [projectDescription, setProjectDescription] = React.useState<string>(_projectDescription)
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false)

  const generateSystem = useHldGenerator(_projectID)

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
        onClick={async () => {
          setIsGenerating(true)
          await generateSystem(requirements, projectTitle, projectDescription)
          setIsGenerating(false)
        }}
        variant={"contained"}
        disabled={!projectTitle || !projectDescription || isGenerating}
        sx={{
          width: "100%",
          textTransform: "none",
        }}
      >
        {isGenerating ? "Generating ..." : <span>{_projectTitle && "Re-"}Generate System Architecture</span>}
      </Button>

    </Container>
  )
}