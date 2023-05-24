import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./chart.scss";
import videoEditingApi from "../../api/video-editing";

const Chart = () => {
  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await videoEditingApi.getAllMatches();
        setMatches(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
  }, []);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "",
        data: [
          matches.length * 10,
          250,
          230,
          260,
          280,
          210,
          210,
          240,
          220,
          270,
          220,
          290,
        ],
        backgroundColor: [
          "#54cdec",
          "#fa9ec3",
          "#27ae60",
          "#f39c12",
          "#8865ff",
          "#30343b",
          "#54cdec",
          "#fa9ec3",
          "#27ae60",
          "#f39c12",
          "#8865ff",
          "#30343b",
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
            max: maxValue + 50,
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
