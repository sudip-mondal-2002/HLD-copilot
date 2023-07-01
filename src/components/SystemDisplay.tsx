import {System} from "@/types/System";
import {Typography} from "@mui/material";

type SystemDisplayProps = {
  system: System
}
export const SystemDisplay = ({system}: SystemDisplayProps)=>{
  return <Typography>
    {JSON.stringify(system)}
  </Typography>
}