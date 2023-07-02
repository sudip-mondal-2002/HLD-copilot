import {Grid, Skeleton} from "@mui/material";
import React from "react";

export const Loading = () => {
  return <Grid container={true} spacing={4} sx={{
    padding: "2rem",
    minHeight: "90vh"
  }}>
    <Grid item={true} xs={12} md={4}>
      <LoadingForm/>
    </Grid>
    <Grid item={true} xs={12} md={8}>
      <LoadingGraph/>
    </Grid>
  </Grid>
}

export const LoadingForm = () => {
  return <>
    <Skeleton variant={"text"} height={"15%"}/>
    <Skeleton variant={"text"} height={"15%"}/>
    <Skeleton variant={"rectangular"} height={"20%"}/>
    <Skeleton variant={"text"} height={"15%"}/>
    <Skeleton variant={"rectangular"} height={"20%"}/>
    <Skeleton variant={"text"} height={"15%"}/>
  </>
}

export const LoadingGraph = () => {
  return <Skeleton variant={"rectangular"} height={"100%"}/>
}