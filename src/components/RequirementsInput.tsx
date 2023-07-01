import React from 'react';
import {TextField} from "@mui/material";
type RequirementsInputProps = {
  placeholder: string;
  onAdd: (requirement: string) => void;
}

export const RequirementsInput = (
  {
    placeholder,
    onAdd
  }:RequirementsInputProps) => {
  const [requirement, setRequirement] = React.useState<string>("")
  return (
    <TextField
      margin={"normal"}
      placeholder={placeholder}
      label={"Add new requirement"}
      fullWidth={true}
      value={requirement}
      onChange={(event) => setRequirement(event.target.value)}
      onKeyDownCapture={(event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onAdd(requirement)
            setRequirement("")
        }
      }}
    />
  )
}