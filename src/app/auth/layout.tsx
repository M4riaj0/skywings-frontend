import { Box } from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: '400px', 
        width: '100%', 
        padding: [2, 4], 
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh', 
        margin: 'auto', 
        marginTop: '10vh',
      }}
    >
      {children}
    </Box>
  );
}
