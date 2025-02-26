// import { Button } from "@mui/material"
// import fetchData from "../utils/fetchData";


// export default function ResetButton(setBalance, setHoldings, setTransactions){
//     async function HandleClick(){
//         await fetch("http://localhost:8080/api/reset");
//         fetchData(setBalance, setHoldings, setTransactions);
//     }
//     return <>
//         <Button onClick={HandleClick} sx={{bgcolor:"red"}}></Button>
//     </>
// }

import { Button } from "@mui/material";
import { RestartAlt } from "@mui/icons-material";
import fetchData from "../utils/fetchData";

export default function ResetButton({ setBalance, setHoldings, setTransactions }) {
  async function handleClick() {
    try {
      await fetch("http://localhost:8080/api/reset");
      fetchData(setBalance, setHoldings, setTransactions);
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }

  return (
    <Button 
      variant="contained"
      onClick={handleClick}
      startIcon={<RestartAlt />}
      sx={{
        height:40,
        bgcolor: "#f44336",
        color: "white",
        fontWeight: "bold",
        borderRadius: "8px",
        padding: "8px 16px",
        textTransform: "none",
        boxShadow: "0px 4px 8px rgba(244, 67, 54, 0.3)",
        transition: "all 0.3s",
        "&:hover": {
          bgcolor: "#d32f2f",
          transform: "translateY(-2px)",
          boxShadow: "0px 6px 12px rgba(244, 67, 54, 0.4)",
        }
      }}
    >
      Reset Portfolio
    </Button>
  );
}