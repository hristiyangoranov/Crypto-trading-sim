import { Box, Typography } from "@mui/material";

export default function HoldingCard (symbol, amount, currprice){
    return (
      <Box sx={{
          background: 'linear-gradient(145deg, ghostwhite 0%, #f8f8ff 100%)',
          height: 150,
          width: 250,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginY: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)'
          },
          '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)'
          }
      }}>
          <Typography variant='h4' sx={{ 
              color: 'black',
              fontWeight: 700,
              fontFamily: 'monospace',
              mb: 0.5
          }}>
              {symbol}
          </Typography>
          
          <Typography variant='subtitle2' sx={{ 
              color: '#666',
              fontWeight: 500,
              mt: 1,
              textTransform: 'uppercase'
          }}>
              Amount: {amount}
          </Typography>
          <Typography variant='h6' sx={{ 
              color: "black",
              fontWeight: 600,
              fontFamily: 'monospace'
          }}>
              Bought at: {currprice}
          </Typography>
      </Box>
    );
}