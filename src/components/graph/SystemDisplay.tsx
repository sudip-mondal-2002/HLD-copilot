import {System} from "@/types/System";
import Graph from "graphology";
import React from "react";
import {SigmaContainer, useLoadGraph, useRegisterEvents} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {MachineTypes} from "@/types/System";
import getNodeImageProgram from "sigma/rendering/webgl/programs/node.image";
import {useLayoutForceAtlas2} from "@react-sigma/layout-forceatlas2";
import {SigmaNodeEventPayload} from "sigma/sigma";
import {Box, Button, Typography} from "@mui/material";
import {ChatBox} from "@/components/graph/ChatBox";

type SystemDisplayProps = {
  system: System
}

const getImageUrlFromMachineType = (machineType: MachineTypes) => {
  switch (machineType) {
    case MachineTypes.API_GATEWAY:
      return "/api-gateway.svg"
    case MachineTypes.COMPUTE:
      return "/compute.svg"
    case MachineTypes.SQL_DATABASE:
      return "/sql.svg"
    case MachineTypes.NOSQL_DATABASE:
      return "/nosql.svg"
    case MachineTypes.CACHE:
      return "/cache.svg"
    case MachineTypes.MESSAGE_QUEUE:
      return "/queue.svg"
    case MachineTypes.FILE_STORAGE:
      return "/file-storage.svg"
    case MachineTypes.CONTENT_DELIVERY_NETWORK:
      return "/cdn.svg"
    case MachineTypes.LOAD_BALANCER:
      return "/load-balancer.svg"
  }
}
const GraphComponent = ({system, setDescription}: {
  system: System
  setDescription: (description: string) => void
}) => {
  const {assign} = useLayoutForceAtlas2({
    settings: {
      slowDown: 200,
      strongGravityMode: false
    },
    iterations: 1000
  })
  const loadGraph = useLoadGraph()
  const registerEvents = useRegisterEvents()
  React.useEffect(() => {
    const graph = new Graph()

    system.machines.forEach(machine => {
      graph.addNode(machine.id,
        {
          label: machine.name,
          type: "image",
          image: getImageUrlFromMachineType(machine.machineType),
          color: "#fff",
          shape: "rect",
          size: 30,
          x: Math.random(),
          y: Math.random()
        })
    })
    system.connections.forEach(connection => {
      graph.addEdge(connection.requestOrigin, connection.requestDestination, {
        size: 5,
        label: connection.protocol,
      })
    })

    system.users.forEach(user => {
      graph.addNode(user.name,
        {
          label: user.name,
          type: "image",
          image: "/user.svg",
          color: "#fff",
          shape: "rect",
          size: 20,
          x: Math.random(),
          y: Math.random()
        })
    })

    system.users.forEach(user => {
      user.requests.forEach(request => {
        if (!system.machines.find(machine => machine.id === request)) {
          return
        }
        graph.addEdge(user.name, request, {
          size: 10,
        })
      })
    })
    loadGraph(graph)
    assign()
  }, [assign, loadGraph, system.connections, system.machines, system.users])
  React.useEffect(() => {
    registerEvents({
      enterNode(payload: SigmaNodeEventPayload) {
        const machine = system.machines.find(machine => machine.id === parseInt(payload.node))
        if (machine) {
          setDescription(machine.machineType + " : " + machine.description)
        }
      },
      leaveNode() {
        setDescription("")
      }
    })
  }, [registerEvents, setDescription, system.machines])
  return null
}


const SystemDisplay = ({system}: SystemDisplayProps) => {
  const [description, setDescription] = React.useState<string>("")

  return <Box sx={{
    padding: "10px"
  }}>
    {/*<Button variant={'contained'} sx={{*/}
    {/*  display: "block",*/}
    {/*}}>*/}
    {/*  Download*/}
    {/*</Button>*/}
    <Typography sx={{
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginY: "5px",
      padding: "10px",
      display: "inline-block",
      height: "50px"
    }}>{description || "Hover over a machine to know how that works"}</Typography>
    <SigmaContainer
      style={{
        width: "100%",
        height: "60vh",
      }}
      settings={{
        labelDensity: 0,
        labelSize: 10,
        edgeLabelSize: 10,
        renderEdgeLabels: true,
        defaultEdgeType: "arrow",
        maxCameraRatio: 1,
        minCameraRatio: 1,
        nodeProgramClasses: {
          image: getNodeImageProgram()
        }
      }}
    >
      <GraphComponent system={system} setDescription={setDescription}/>
    </SigmaContainer>
    <ChatBox/>
  </Box>

}

export default SystemDisplay;