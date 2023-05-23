import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Grid, Checkbox, TextField } from "@mui/material";
import "./AccountManagement.scss";

const AccountManagement = () => {
  const defaultValues = {
    Username: "leminhtuong",
    Fullname: "leminhtuong",
    Email: "leminhtuong09122002@gmail.com",
    Password: "Mtl@091202",
    Phonenumber: "0834091202",
    EmailConfirmed: false,
  };

  const [Username, setUsername] = useState(defaultValues.Username);
  const [Fullname, setFullname] = useState(defaultValues.Fullname);
  const [Email, setEmail] = useState(defaultValues.Email);
  const [Password, setPassword] = useState(defaultValues.Password);
  const [Phonenumber, setPhonenumber] = useState(defaultValues.Phonenumber);
  const [EmailConfirmed, setEmailConfirmed] = useState(
    defaultValues.EmailConfirmed
  );
  const [isEnable, setIsEnable] = useState(false);
  const [previousValues, setPreviousValues] = useState(null);

  useEffect(() => {
    if (isEnable) {
      setPreviousValues({
        Username,
        Fullname,
        Email,
        Password,
        Phonenumber,
        EmailConfirmed,
      });
    }
  }, [isEnable]);

  const handleEmailConfirmedChange = (e) => {
    setEmailConfirmed(e.target.checked);
  };

  const handleEdit = () => {
    if (isEnable) {
      if (previousValues) {
        setUsername(previousValues.Username);
        setFullname(previousValues.Fullname);
        setEmail(previousValues.Email);
        setPassword(previousValues.Password);
        setPhonenumber(previousValues.Phonenumber);
        setEmailConfirmed(previousValues.EmailConfirmed);
        // console.log(previousValues);
      }
      setIsEnable(false);
    } else {
      setIsEnable(true);
    }
  };

  const handleSave = () => {
    setIsEnable(false);
    // console.log(Username, Fullname, Email, Password, Phonenumber, EmailConfirmed)
  };
  return (
    <>
      <Card
        sx={{
          width: "50%",
          padding: 5,
          margin: "auto",
          marginBottom: 3,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center" }}
          component="form"
        >
          <Grid item xs={3}>
            Username
          </Grid>

          {/* <Grid item xs={9}>
            <span>username</span>
          </Grid> */}
          <Grid item xs={9}>
            <TextField
              value={Username}
              variant="standard"
              size="small"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              fullWidth
              required
              disabled={!isEnable}
            />
          </Grid>
          {/* <Grid item xs={0.5}>
            
          </Grid> */}
          <Grid item xs={3}>
            Fullname
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={Fullname}
              variant="standard"
              size="small"
              onChange={(e) => {
                setFullname(e.target.value);
              }}
              fullWidth
              required
              disabled={!isEnable}
            />
          </Grid>

          <Grid item xs={3}>
            Email
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={Email}
              variant="standard"
              size="small"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth
              required
              disabled={!isEnable}
            />
          </Grid>

          <Grid item xs={3}>
            Password
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={Password}
              variant="standard"
              size="small"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              fullWidth
              required
              disabled={!isEnable}
            />
          </Grid>

          <Grid item xs={3}>
            PhoneNumber
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={Phonenumber}
              variant="standard"
              size="small"
              onChange={(e) => {
                setPhonenumber(e.target.value);
              }}
              fullWidth
              required
              disabled={!isEnable}
            />
          </Grid>

          <Grid item xs={3}>
            EmailConfirmed
          </Grid>
          <Checkbox
            disabled={!isEnable}
            checked={EmailConfirmed}
            onChange={handleEmailConfirmedChange}
          />
          {/* <Checkbox disabled checked/> */}

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="button_bar">
              <Button variant="contained" onClick={handleSave} className="button">
                Save
              </Button>
              <Button variant="contained" onClick={handleEdit} className="button">
                {isEnable ? "Cancel" : "Edit"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default AccountManagement;