import { useEffect, useState } from "react";

import videoEditingApi from "../../api/video-editing";
import { useNavigate } from "react-router-dom";
import MatchTable from "./MatchTable";
import RefreshIcon from "@mui/icons-material/Refresh";

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  let navigate = useNavigate();

  const getMatches = async () => {
    try {
      const response = await videoEditingApi.getAllMatches();
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <>
      <MatchTable
        data={matches}
        titleSearch={tournaments}
        handleResultClick={handleResultClick}
      />
     <div
        onClick={() => {
          window.location.reload();
        }}
        style={{
          cursor: "pointer",
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "12px" }}>Click Here To Refresh Page</span>
        <RefreshIcon />
      </div>
    </>
  );
};

export default MatchManagement;
