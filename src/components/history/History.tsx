import {HistoryItem, useHldGenerator} from "@/hooks/useHldGenerator";
import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {NoHistory} from "@/components/history/NoHistory";
import {LoadingForm} from "@/components/history/Loading";

export const History = () => {
  const [history, setHistory] = React.useState<HistoryItem[]>();
  const router = useRouter();
  const {deleteHistoryItem} = useHldGenerator();
  React.useEffect(() => {
    setHistory(
      JSON.parse(localStorage?.getItem("history") || "[]")
    );
  }, []);

  return (
    <Container>
      {
        history ? history.length ? history.map((item) => {
          return <Box key={item.id} sx={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "1rem",
            marginY: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography variant={"body1"} sx={{width: "30%"}}>{item.title}</Typography>
            <Typography
              sx={{width: "40%"}}
              variant={"body2"}>{item.description.length > 30 ? item.description.slice(0, 27) + "..." : item.description}</Typography>
            <Box>
              <Button variant={"outlined"} onClick={async () => {
                await router.push(`/system/${item.id}`)
              }} sx={{marginRight: "10px"}}>Edit/View</Button>
              <Button variant={"outlined"} color={"secondary"}
                      onClick={() => deleteHistoryItem(item.id)}>Delete</Button>
            </Box>
          </Box>
        }) : <NoHistory/> : <Box sx={{
          height: "90vh"
        }}> <LoadingForm/></Box>
      }
    </Container>
  )
}