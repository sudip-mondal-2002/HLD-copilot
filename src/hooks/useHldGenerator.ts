import {Requirements} from "@/types/Requirements";
import {v4} from "uuid";
import {System} from "@/types/System";
import {useRouter} from "next/router";

export type HistoryItem = {
  id: string,
  title: string,
  description: string,
  requirements: Requirements,
  system: System
}
export const useHldGenerator = () => {

  const router = useRouter()
  const projectID = router.query.historyID as string | undefined
  const generate = async (requirements: Requirements, projectTitle: string, projectDescription: string, incomingChat?:{
    currentSystem: System,
    message: string
  }) => {
    const history = JSON.parse(localStorage.getItem("history") || "[]")

    const currentSystem = history.find((item: HistoryItem) => item.id === projectID)?.system

    const data = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        requirements,
        title: projectTitle,
        description: projectDescription,
        incomingChat
      })
    })
    const system = await data.json()
    // store the system in the local storage

    const historyItem: HistoryItem = {
      id: projectID || v4(),
      title: projectTitle,
      description: projectDescription,
      requirements: requirements,
      system: system
    }
    if (projectID) {
      const index = history.findIndex((item: HistoryItem) => item.id === projectID)
      if(index === -1 || history.length === 0){
        history.push(historyItem)
      }else {
        history[index] = historyItem
      }
    } else{
      history.push(historyItem)
    }
    localStorage.setItem("history", JSON.stringify(history))

    if(projectID){
      return window.location.reload()
    }
    // navigate to the system page
    await router.push(`/system/${historyItem.id}`)
  }

  const deleteHistoryItem = (id: string) => {
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    const index = history.findIndex((item: HistoryItem) => item.id === id)
    history.splice(index, 1)
    localStorage.setItem("history", JSON.stringify(history))
    window.location.reload()
  }

  const chat = async (message: string) => {
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    const historyItem = history.find((item: HistoryItem) => item.id === projectID)
    await generate(historyItem.requirements, historyItem.title, historyItem.description, {
        currentSystem: historyItem.system,
        message: message
    })
  }
  return {
    generate,
    deleteHistoryItem,
    chat
  }
}