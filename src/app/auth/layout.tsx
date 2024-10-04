import { Box } from "@mui/material";
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: '450px', 
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
        marginTop: '5vh',
      }}
    >
      <Box sx={{mb: 2,width: '30%', display: 'flex',justifyContent: 'center',}}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          layout="responsive"
          width={100}
          height={100}
        />
      </Box>
      {children}
    </Box>
  );
}
