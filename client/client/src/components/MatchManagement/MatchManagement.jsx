import { useEffect, useRef, useState } from "react";

import {
  TextField,
  Card,
  Button,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  Autocomplete,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
//import "./tournament.styles.scss";
import { ConfirmDialog, CustomDatePicker } from "../flugin";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";
import TableTournament from "./TableTournament";

const MatchManagement = () => {
  const [opendialog, setOpenDialog] = useState(false);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tournamentName, setTournamentName] = useState();
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);
  const [uploadId, setUploadId] = useState();
  const [tournament, setTournament] = useState();
  const [matchName, setMatchName] = useState();
  const [time, setTime] = useState(new Date());
  const [channel, setChannel] = useState();
  const [ip, setIp] = useState();
  const [openDConfirm, setOpenDConfirm] = useState(false);
  // const [rowDelete, setRowDelete] = useState();

  const [port, setPort] = useState();

  const [hidden, setHidden] = useState(true);
  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [file, setFile] = useState(null);

  let navigate = useNavigate();

  const handleDateChange = (date) => {
    setTime(date);
  };

  const handleTournamentChange = (e, value) => {
    setTournament(value);
  };

  const getMatches = async () => {
    try {
      const response = await videoEditingApi.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var a = hidden ? tournament.id : null;
    var b = hidden ? null : tournamentName;
    const payload = {
      tournamentId: a,
      tournametName: b,
      matchName: matchName,
      mactchTime: `${time
        .toLocaleString("sv", { timeZoneName: "short" })
        .substring(0, 10)}T${("0" + time.getHours()).slice(-2)}:${(
        "0" + time.getMinutes()
      ).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}.000Z`,
      channel: channel,
      ip: ip,
      port: port,
    };

    const addTournament = async () => {
      try {
        const response = await videoEditingApi.addMatch(payload);
        if (response.status === 200 && response.data === "Succeed") {
          setNoti(true);
          setMessage("Saved");
          setTypeNoti("success");
          getMatches();
        }
      } catch (error) {
        setNoti(true);
        setMessage(error.response.description);
        setTypeNoti("error");
        console.log(error);
      }
    };
    addTournament();
  };

  const handleUploadClick = () => {
    const UploadFile = async () => {
      try {
        const formdata = new FormData();
        formdata.append("jsonfile", file);
        await videoEditingApi.uploadJsonFile(uploadId, formdata);
        setNoti(true);
        setMessage("Saved");
        setTypeNoti("success");
        getMatches();
        setOpenDialog(false);
      } catch (error) {
        setNoti(true);
        setMessage(error.response.description);
        setTypeNoti("error");
        console.log(error);
      }
    };
    if (file === null) {
      setNoti(true);
      setMessage("Please select file");
      setTypeNoti("error");
    } else {
      UploadFile();
    }
  };

  const handleIconUploadClick = (match) => {
    setUploadId(match.id);
    setFile(null);
    setOpenDialog(true);
  };

  // const handleIconDeleteClick = (match) => {
  //   setOpenDConfirm(true);
  //   setRowDelete(match);
  // };

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const response = await videoEditingApi.getTournaments();
        setTournaments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
    getTournaments();
  }, []);

  const handleResultClick = (e, row) => {
    e.preventDefault();
    navigate("/video-edit", { state: { row } });
    console.log(row);
  };

  // const handleDeleteClick = () => {
  //   const deleteMatch = async () => {
  //     try {
  //       await videoEditingApi.deleteMatch(rowDelete.id);
  //       setNoti(true);
  //       setMessage("Delete Succeed");
  //       setTypeNoti("success");
  //       getMatches();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   deleteMatch();
  // };
  const handleClose = () => {
    setOpenDialog(false);
    setOpenDConfirm(false);
  };
  const handleFileChange = (file) => {
    setFile(file);
  };

  // const handleConfirmClick = () => {
  //   handleDeleteClick();
  //   setOpenDConfirm(false);
  // };
  return (
    <>
      {/* <ConfirmDialog
        title="Confirm"
        description="Are you sure to delete the record?"
        onClose={handleClose}
        onConfirm={handleConfirmClick}
        open={openDConfirm}
      /> */}
      <Dialog open={opendialog} onClose={handleClose} scroll={scroll}>
        <DialogTitle
          sx={{
            backgroundColor: "#CEEBF9",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          id="scroll-dialog-title"
        >
          <h4>Upload json file</h4>
          <Button variant="contained" onClick={handleUploadClick}>
            Upload
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <FileUploader
              handleChange={handleFileChange}
              name="file"
              types={["JSON"]}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

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

      <TableTournament
        data={matches}
        titleSearch={tournaments}
        handleResultClick={handleResultClick}
        handleIconUploadClick={handleIconUploadClick}
        // handleIconDeleteClick={handleIconDeleteClick}
      />
    </>
  );
};

export default MatchManagement;
