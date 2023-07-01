import {HistoryItem} from "@/hooks/useHldGenerator";
import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {NoHistory} from "@/components/history/NoHistory";
export const History = () => {
  const [history, setHistory] = React.useState<HistoryItem[]>();
  const router = useRouter();
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
            <Typography variant={"body1"}>{item.title}</Typography>
            <Typography variant={"body2"}>{item.description.length > 30 ? item.description.slice(0, 27) + "..." : item.description}</Typography>
            <Button variant={"outlined"} onClick={async () => {await router.push(`/system/${item.id}`)}}>Edit/View</Button>
          </Box>
        }) : <NoHistory/> : <p>Loading...</p>
      }
    </Container>
  )
}