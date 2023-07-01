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
export const useHldGenerator = (projectID?: string) => {

  const router = useRouter()
  return async (requirements: Requirements, projectTitle: string, projectDescription: string) => {
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
    // store the system in the local storage

    const historyItem: HistoryItem = {
      id: v4(),
      title: projectTitle,
      description: projectDescription,
      requirements: requirements,
      system: system
    }
    const history = JSON.parse(localStorage.getItem("history") || "[]")
    if (projectID) {
      const index = history.findIndex((item: HistoryItem) => item.id === projectID)
      history[index] = historyItem
    } else{
      history.push(historyItem)
    }
    localStorage.setItem("history", JSON.stringify(history))

    // navigate to the system page
    await router.push(`/system/${historyItem.id}`)
  }
}