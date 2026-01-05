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
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "90%" }}>
        <UserDisplay />
      </Box>
    </Box>
  </>
);


}

export default App
