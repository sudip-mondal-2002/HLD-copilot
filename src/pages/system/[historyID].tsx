import {useRouter} from "next/router";
import {HistoryItem} from "@/hooks/useHldGenerator";
import {RequirementsForm} from "@/components/input/RequirementsForm";
import {Stack} from "@mui/system";
import dynamic from "next/dynamic";
import React from "react";

const SystemDisplay = dynamic(import("@/components/SystemDisplay"), {ssr: false});

const SystemHistory = () => {
  const router = useRouter()
  const {historyID} = router.query
  const [history, setHistory] = React.useState<HistoryItem>()
  React.useEffect(() => {
    if(!historyID) {
      router.push("/")
      return
    }
    const loadedHistory = JSON.parse(localStorage?.getItem("history") || "[]")
    const historyItem = loadedHistory.find((item: HistoryItem) => item.id === historyID)
    if(!historyItem) {
        router.push("/")
        return
    }
    setHistory(historyItem)
  }, []);

  return <Stack spacing={2} direction={"row"}>
    {history && <> <RequirementsForm
      _projectTitle={history.title}
      _projectDescription={history.description}
      _requirements={history.requirements}
      _projectID={history.id}
    />
    <SystemDisplay system={history.system}/></>}
  </Stack>
}

export default SystemHistory