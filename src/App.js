import { CssBaseline, Grid, Container, TextField, Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { init, start } from "./sip/SipClient";
function App() {
  const [username, setUsername] = useState("1000");
  const [password, setPassword] = useState("Hala_1994");
  const [domain, setDomain] = useState("sip.tsuki.local");
  const [serverAddress, setServerAddress] = useState("lan.sip.tsuki.local:8443");

  return (
    <Fragment>
      <CssBaseline />
      <Container disableGutters>
        <Grid container spacing={1} direction="row">
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Username" value={username} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Domain" value={domain} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Server Address" value={serverAddress} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              onClick={() => {
                init({
                  socketAddress: serverAddress,
                  domain: domain,
                  username: username,
                  password: password,
                });
                start();
              }}
            >
              Start
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default App;
