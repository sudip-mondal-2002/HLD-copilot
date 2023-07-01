import {System} from "@/types/System";
import {Typography} from "@mui/material";
import {Node} from "@/components/nodes";

type SystemDisplayProps = {
  system: System
}
export const SystemDisplay = ({system}: SystemDisplayProps)=>{
  return <Typography>
    {system.machines.map(machine=> <Node machine={machine} key={machine.id}/>)}
  </Typography>
}