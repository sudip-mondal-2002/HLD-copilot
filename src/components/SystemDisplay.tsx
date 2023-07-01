import {System} from "@/types/System";
import Graph from "graphology";
import React, {useEffect} from "react";
import {SigmaContainer, useLoadGraph, useSigma} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {useLayoutNoverlap} from "@react-sigma/layout-noverlap";
import {animateNodes} from "sigma/utils/animate";
import {Sigma} from "sigma";

type SystemDisplayProps = {
  system: System
}


const SystemDisplay = ({system}: SystemDisplayProps)=>{
  const GraphComponent = () => {
    const sigma = useSigma()
    const {positions, assign} = useLayoutNoverlap()
    const loadGraph = useLoadGraph()
    React.useEffect(()=>{
      const graph = new Graph()

      system.machines.forEach((machine, index)=>{
        graph.addNode(machine.id,
          {
            label: machine.name,
            color: "red",
            size: 20,
            x: Math.random(),
            y: Math.random()
          })
      })
      system.machines.forEach(machine=>{
        machine.connectedTo.forEach(connectedTo=>{
          graph.addEdge(machine.id, connectedTo, {
            type: "arrow",
            size: 2,
          })
        })
      })
        loadGraph(graph)
        assign()
    },[loadGraph])
    return null
  }

  return <SigmaContainer
    style={{
    width: "80%",
    height: "80%",
  }}
    settings={{
      defaultEdgeType: "arrow"
    }}
  >
    <GraphComponent/>
  </SigmaContainer>
}

export default SystemDisplay;