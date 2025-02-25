import React from "react";
import { Box, Typography } from "@mui/material";

const TransactionCard = ({symbol, buysell, amount, price})=>{
    return (
    <>
    <Box sx={{
        width:250,
        height:150,
        marginY: 3,
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Typography variant="h3">{symbol}</Typography>
        <Typography variant="h5">{buysell}</Typography>
        <Typography variant="h5">{amount}</Typography>
        {buysell==true ? <Typography variant="h5">{price/amount}</Typography>:}
    </Box>

    </>)
}