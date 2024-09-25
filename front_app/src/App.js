import React, { useState } from 'react';
import { Container, Typography, Paper, Button, Grid, Box, Divider } from '@mui/material';

function App() {
  const initialMemory = {
    8: 0, 9: 0, 10: 2, 11: 3, 12: 0, 13: 0, 100: 'LOAD 10', 101: 'ADD 11', 102: 'STORE 12'
  };

  const [cpuRegisters, setCpuRegisters] = useState({
    PC: 100, CIR: '', MAR: '', MDR: '', AC: 0
  });
  const [memory, setMemory] = useState(initialMemory);
  const [cu, setCU] = useState('');
  const [alu, setALU] = useState('');
  const [cyclePhase, setCyclePhase] = useState('FETCH');
  const [explanation, setExplanation] = useState('');
  const [programCompleted, setProgramCompleted] = useState(false);

  const resetSimulation = () => {
    setCpuRegisters({ PC: 100, CIR: '', MAR: '', MDR: '', AC: 0 });
    setMemory(initialMemory);
    setCU('');
    setALU('');
    setCyclePhase('FETCH');
    setExplanation('');
    setProgramCompleted(false);
  };

  const nextCycle = () => {
    let { PC, CIR, MAR, MDR, AC } = cpuRegisters;
    let newExplanation = '';

    if (PC > 102) {
      setProgramCompleted(true);
      setExplanation('Program completed.');
      return;
    }

    switch (cyclePhase) {
      case 'FETCH':
        MAR = PC;
        MDR = memory[PC];
        newExplanation = `FETCH: PC (${PC}) -> MAR; Instruction (${memory[PC]}) -> MDR`;
        setCyclePhase('DECODE');
        break;

      case 'DECODE':
        CIR = MDR;
        PC += 1;
        setCU(`Decoding instruction: ${CIR}`);
        newExplanation = `DECODE: Instruction (${CIR}) loaded into CIR. PC incremented to ${PC}.`;
        setCyclePhase('EXECUTE');
        break;

      case 'EXECUTE':
        if (CIR) {
        const [operation, address] = CIR.split(' ');
        switch (operation) {
          case 'LOAD':
            MAR = address;
            MDR = memory[address];
            AC = MDR;
            newExplanation = `EXECUTE: Loaded value from memory address ${address} (Value: ${MDR}) into AC (${AC}).`;
            break;
          case 'ADD':
            MAR = address;
            MDR = memory[address];
            setALU(`ALU: AC (${AC}) + MDR (${MDR}) = ${AC + MDR}`);
            AC += MDR;
            newExplanation = `EXECUTE: Added value from memory address ${address} (Value: ${MDR}) to AC. New AC: ${AC}`;
            break;
          case 'STORE':
            MAR = address;
            MDR = AC;
            const updatedMemory = { ...memory, [address]: AC };
            setMemory(updatedMemory);
            newExplanation = `EXECUTE: Stored value from AC (${AC}) into memory address ${address}.`;
            break;
          default:
            newExplanation = `EXECUTE: Unknown instruction ${operation}.`;
        } 
      } else {
        // provide a message if there is no instruction to execute
        newExplanation = 'EXECUTE: No instruction to execute.';
      }
        setCyclePhase('FETCH');
        break;
      default:
        break;
    }

    setCpuRegisters({ PC, CIR, MAR, MDR, AC });
    setExplanation(newExplanation);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: 'lightcyan' }}>
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          Von Neumann Architecture Simulation
        </Typography>

        <Grid container spacing={3}>

          {/* Left-hand Side */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: '16px', width: '90%' }}>
              <Typography variant="h5" align="center">Control Unit (CU)</Typography>
              <Divider />
              <Typography>{cu}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: '16px', width: '90%', mt: 2 }}>
              <Typography variant="h5" align="center">CPU Registers</Typography>
              <Divider />
              <Typography>PC: {cpuRegisters.PC}</Typography>
              <Typography>CIR: {cpuRegisters.CIR}</Typography>
              <Typography>MAR: {cpuRegisters.MAR}</Typography>
              <Typography>MDR: {cpuRegisters.MDR}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: '16px', width: '90%', mt: 2 }}>
              <Typography variant="h5" align="center">Accumulator (AC)</Typography>
              <Divider />
              <Typography>AC: {cpuRegisters.AC}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: '16px', width: '90%', mt: 2 }}>
              <Typography variant="h5" align="center">Arithmetic Logic Unit (ALU)</Typography>
              <Divider />
              <Typography>{alu}</Typography>
            </Paper>
          </Grid>

          {/* Right-hand Side */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: '16px', width: '90%' }}>
              <Typography variant="h5" align="center">Memory State</Typography>
              <Divider />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">Address</Typography>
                  <Divider />
                  {Object.keys(memory).map((address) => (
                    <Typography key={address}>{address}</Typography>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="center">Data</Typography>
                  <Divider />
                  {Object.keys(memory).map((address) => (
                    <Typography key={address}>{memory[address]}</Typography>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

        </Grid>

        {/* Control Buttons */}
        <Box mt={3} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            color={programCompleted ? 'error' : 'primary'} 
            onClick={programCompleted ? resetSimulation: nextCycle}>
            {programCompleted ? 'Start Over' : 'Next Step'}
          </Button>
        </Box>

        {/* Phase Explanation */}
        <Paper mt={3} sx={{ padding: '16px', width: '100%', backgroundColor: 'white', marginTop: '30px' }}>
          <Typography variant="h6" align="center">{cyclePhase} Phase</Typography>
          <Typography align="center">{explanation}</Typography>
        </Paper>

      </Container>
    </Box>
  );
}

export default App;
