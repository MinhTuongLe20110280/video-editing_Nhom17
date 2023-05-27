import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./chart.scss";
import videoEditingApi from "../../api/video-editing";
import { userApi } from "../../api";

const Chart = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [tagEvents, setTagEvents] = useState([]);
  const [gallery1, setGallery1] = useState([]);
  const [gallery2, setGallery2] = useState([]);
  const [users, setUsers] = useState([]);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const response1 = await videoEditingApi.getAllMatches();
        setMatches(response1.data);
        const response2 = await videoEditingApi.getTournaments();
        setTournaments(response2.data);
        const response3 = await videoEditingApi.getTagNameList();
        setTagEvents(response3.data);
        const response4 = await videoEditingApi.getAllGalleries(0);
        setGallery1(response4.data);
        const response5 = await videoEditingApi.getAllGalleries(1);
        setGallery2(response5.data);
        const response6 = await userApi.getAllUsers();
        setUsers(response6);
        const response7 = await videoEditingApi.getHighlight();
        setHighlights(response7.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
  }, []);

  const data = {
    labels: [
      "Matches",
      "Tournaments",
      "TagEvents",
      "Images",
      "Videos",
      "Users",
      "Highlights",
    ],
    datasets: [
      {
        label: "",
        data: [
          matches.length,
          tournaments.length,
          tagEvents.length,
          gallery1.length,
          gallery2.length,
          users.length,
          highlights.length
        ],
        backgroundColor: [
          "#54cdec",
          "#fa9ec3",
          "#27ae60",
          "#f39c12",
          "#8865ff",
          "#30343b",
          "#54cdec",
        ],
      },
    ],
  };

  const values = data.datasets[0].data;
  const maxValue = Math.max(...values);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
            max: maxValue + 10,
          },
        },
      ],
    },
  };

  const legendItems = data.labels.map((label, index) => (
    <span
      key={label}
      style={{
        marginRight: 10,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          backgroundColor: data.datasets[0].backgroundColor[index],
          marginRight: 5,
        }}
      ></span>
      {label}
    </span>
  ));

  return (
    <div className="chart-body">
      <Bar data={data} options={options} />
      <legend style={{ display: "flex", justifyContent: "space-between" }}>
        {legendItems}
      </legend>
    </div>
  );
};

export default Chart;
