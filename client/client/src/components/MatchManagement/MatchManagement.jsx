import { useEffect, useState } from "react";

import videoEditingApi from "../../api/video-editing";
import { useNavigate } from "react-router-dom";
import TableTournament from "./TableTournament";

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
        console.log(response.data)
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
      <TableTournament
        data={matches}
        titleSearch={tournaments}
        handleResultClick={handleResultClick}
      />
    </>
  );
};

export default MatchManagement;
