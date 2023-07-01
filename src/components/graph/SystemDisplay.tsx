import {System} from "@/types/System";
import Graph from "graphology";
import React, {useEffect} from "react";
import {SigmaContainer, useLoadGraph, useSigma} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {useLayoutNoverlap} from "@react-sigma/layout-noverlap";
import {MachineTypes} from "@/types/System";
import getNodeImageProgram from "sigma/rendering/webgl/programs/node.image";

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
      return "/message-queue.svg"
    case MachineTypes.FILE_STORAGE:
      return "/file-storage.svg"
    case MachineTypes.CONTENT_DELIVERY_NETWORK:
      return "/cdn.svg"
    case MachineTypes.LOAD_BALANCER:
      return "./load-balancer.svg"
  }
}

const SystemDisplay = ({system}: SystemDisplayProps) => {
  const GraphComponent = () => {
    const sigma = useSigma()
    const {positions, assign} = useLayoutNoverlap()
    const loadGraph = useLoadGraph()
    React.useEffect(() => {
      const graph = new Graph()

      system.machines.forEach((machine, index) => {
        graph.addNode(machine.id,
          {
            label: machine.name,
            type: "image",
            image: getImageUrlFromMachineType(machine.machineType),
            color: "#0000",
            shape: "rect",
            size: 30,
            x: Math.random(),
            y: Math.random()
          })
      })
      system.machines.forEach(machine => {
        machine.connectedTo.forEach(connectedTo => {
          graph.addEdge(machine.id, connectedTo, {
            type: "arrow",
            size: 2,
          })
        })
      })
      loadGraph(graph)
      assign()
    }, [loadGraph])
    return null
  }

  return <SigmaContainer
    style={{
      width: "60vw",
      height: "90vh"
    }}
    settings={{
      defaultEdgeType: "arrow",
      defaultNodeType: "rect",
      nodeProgramClasses: {
        image: getNodeImageProgram()
      }
    }}
  >
    <GraphComponent/>
  </SigmaContainer>
}

export default SystemDisplay;