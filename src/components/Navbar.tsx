import {AppBar, Container, Toolbar, Typography} from "@mui/material";

export const Navbar = () => {
  return <AppBar position={"static"}>
    <Container>
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href={"/"}
          sx={{
            textDecoration: "none",
            color: "#fff"
          }}
        >
          System Design Copilot
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
}