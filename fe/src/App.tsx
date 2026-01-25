import './App.css'
import CreateEntityBtn from './components/CreateBtn/CreateEntityBtn';
import Navbar from './components/Navbar/Navbar'
import UserDisplay from './components/UserDisplay/UserDisplay'
import Box from "@mui/material/Box";

function App() {

return (
  <>
    <Navbar />
    <Box
      sx={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        px: 2,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          mt: 10, 
        }}
      >
        <Box sx={{ width: "90%" }}>
          <UserDisplay />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pb: 2,
        }}
      >
        <CreateEntityBtn />
      </Box>
    </Box>
  </>
);
}

export default App
