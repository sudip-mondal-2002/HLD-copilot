import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import { MachineTypes } from '@/types/System';

export const NoHistory = () => {
  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '80%',
          marginBottom: '30px',
        }}
      >
        <Image src={'/api-gateway.svg'} alt={MachineTypes.API_GATEWAY} height={50} width={50} />
        <Image src={'/compute.svg'} alt={MachineTypes.COMPUTE} height={50} width={50} />
        <Image src={'/sql.svg'} alt={MachineTypes.SQL_DATABASE} height={50} width={50} />
        <Image src={'/nosql.svg'} alt={MachineTypes.NOSQL_DATABASE} height={50} width={50} />
        <Image src={'/cache.svg'} alt={MachineTypes.CACHE} height={50} width={50} />
        <Image src={'/queue.svg'} alt={MachineTypes.MESSAGE_QUEUE} height={50} width={50} />
        <Image src={'/file-storage.svg'} alt={MachineTypes.FILE_STORAGE} height={50} width={50} />
        <Image src={'/cdn.svg'} alt={MachineTypes.CONTENT_DELIVERY_NETWORK} height={50} width={50} />
        <Image src={'/load-balancer.svg'} alt={MachineTypes.LOAD_BALANCER} height={50} width={50} />
      </Box>
      <Typography>No history found. Create a new system design to get started. Happy Designing :)</Typography>
    </Container>
  );
};
