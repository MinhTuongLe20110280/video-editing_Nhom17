import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Grid, TextField } from "@mui/material";
import "./AccountManagement.scss";
import { userApi } from "../../api";
import { Alert, Snackbar } from "@mui/material";

const AccountManagement = () => {
  const currentUsername = localStorage.getItem("username");
  const [Id, setId] = useState();
  const [Username, setUsername] = useState(currentUsername);
  const [Fullname, setFullname] = useState();
  const [Email, setEmail] = useState();
  const [Phonenumber, setPhonenumber] = useState();
  const [isEnable, setIsEnable] = useState(false);
  const [previousValues, setPreviousValues] = useState();

  const [profile, setProfile] = useState({});

  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApi.getUserByUsername(currentUsername);
        setId(response.id);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUsername]);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const response2 = await userApi.getUserById(Id);
        setProfile(response2);
        setUsername(response2.userName);
        setFullname(response2.fullName);
        setPhonenumber(response2.phoneNumber || "");
        setEmail(response2.email);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData2();
  }, [Id]);

  useEffect(() => {
    if (isEnable) {
      setPreviousValues({
        Username,
        Fullname,
        Email,
        Phonenumber,
      });
    }
  }, [isEnable]);

  const handleEdit = () => {
    if (isEnable) {
      if (previousValues) {
        setUsername(previousValues.Username);
        setFullname(previousValues.Fullname);
        setEmail(previousValues.Email);
        setPhonenumber(previousValues.Phonenumber);
      }
      setIsEnable(false);
    } else {
      setIsEnable(true);
    }
  };

  const handleSave = () => {
    setIsEnable(false);
    const updateUserAccount = async () => {
      try {
        const updatedProfile = {
          userName: Username,
          email: Email,
          phoneNumber: Phonenumber,
          fullName: Fullname,
        };

        await userApi.updateUserAccount(Id, updatedProfile);
        setProfile(updatedProfile);
        localStorage.removeItem("fullName", Fullname);
        localStorage.removeItem("userName", Username);
        localStorage.setItem("fullName", Fullname);
        setNoti(true);
        setMessage("Update Succeed");
        setTypeNoti("success");
        window.location.reload();
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };

    updateUserAccount();
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={noti}
        autoHideDuration={5000}
        onClose={() => setNoti(false)}
      >
        <Alert
          onClose={() => setNoti(false)}
          severity={typeNoti}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
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
              fullWidth
              required
              disabled
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
              placeholder="Empty"
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
              placeholder="Empty"
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
              placeholder="Empty"
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="button_bar">
              <Button
                variant="contained"
                onClick={handleSave}
                className="button"
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={handleEdit}
                className="button"
              >
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
