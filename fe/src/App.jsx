import './App.css'
import Navbar from './components/Navbar/Navbar'
import UserDisplay from './components/UserDisplay/UserDisplay'
import Box from "@mui/material/Box";

function App() {

return (
  <>
    <Navbar />
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // assumes Navbar ~64px (MUI default)
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "min(1100px, 100%)" }}>
        <UserDisplay />
      </Box>
    </Box>
  </>
);


}

export default App
