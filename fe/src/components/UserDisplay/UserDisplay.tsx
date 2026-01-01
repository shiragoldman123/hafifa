import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "birthDate",
    headerName: "Birth Date",
    type: "date",
    width: 130,
  },
  {
    field: "identityNum",
    headerName: "indentity num",
    width: 130,
  },
  {
    field: "gender",
    headerName: "gender",
    width: 130,
  },
];

// TO-DO- change it to api request
const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function UserDisplay() {
  return (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        mb: 5,
      }}
    >
      <TextField
        select
        label="Search By"
        size="small"
        defaultValue=""
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="fullName">Full Name</MenuItem>
        <MenuItem value="identityCard">Identity Number</MenuItem>
        <MenuItem value="account">Account</MenuItem>
        <MenuItem value="source">Source</MenuItem>
      </TextField>

      <TextField label="Input" size="small" />
    </Box>

    <Paper sx={{ height: 400, width: "80%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  </Box>
);

}
