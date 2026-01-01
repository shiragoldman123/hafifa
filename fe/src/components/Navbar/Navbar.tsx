import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CssBaseline from "@mui/material/CssBaseline";

const pages = ["Products", "Pricing", "Blog"];

export default function Navbar() {
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
             <Box
              component="img"
              sx={{
                height: 70,
                width: 70,
                mr: 4,
                mt: 1,
                mb: 1,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="logo"
              src="src/assets/userly.png"
            />
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 2,
                fontWeight: 800,
              }}
            >
              USERLY
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
}
