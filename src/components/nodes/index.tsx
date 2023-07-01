import {Machine, MachineTypes} from "@/types/System";
import {Box, Tooltip} from "@mui/material";
import {ApiGateway} from "@/components/nodes/ApiGateway";
import {MessageQueue} from "@/components/nodes/MessageQueue";
import {Cache} from "@/components/nodes/Cache";
import {Compute} from "@/components/nodes/Compute";
import {SqlDatabase} from "@/components/nodes/SqlDatabase";
import {NoSqlDatabase} from "@/components/nodes/NoSqlDatabase";
import {ContentDeliveryNetwork} from "@/components/nodes/ContentDeliveryNetwork";
import {LoadBalancer} from "@/components/nodes/LoadBalancer";
import {Filestorage} from "@/components/nodes/Filestorage";

type NodeProps = {
  machine: Machine
}

export const Node = ({machine}: NodeProps) => {
  return <Tooltip title={machine.name + " : " + machine.description}>
    <Box
      sx={{
        width: "50px",
        height: "50px",
      }}
    >
      {machine.machineType === MachineTypes.API_GATEWAY && <ApiGateway/>}
      {machine.machineType === MachineTypes.MESSAGE_QUEUE && <MessageQueue/>}
      {machine.machineType === MachineTypes.CACHE && <Cache/>}
      {machine.machineType === MachineTypes.COMPUTE && <Compute/>}
      {machine.machineType === MachineTypes.SQL_DATABASE && <SqlDatabase/>}
      {machine.machineType === MachineTypes.NOSQL_DATABASE && <NoSqlDatabase/>}
      {machine.machineType === MachineTypes.CONTENT_DELIVERY_NETWORK && <ContentDeliveryNetwork/>}
      {machine.machineType === MachineTypes.LOAD_BALANCER && <LoadBalancer/>}
      {machine.machineType === MachineTypes.FILE_STORAGE && <Filestorage/>}
    </Box>
  </Tooltip>
}