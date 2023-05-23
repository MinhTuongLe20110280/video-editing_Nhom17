import React from "react";
import { Bar } from "react-chartjs-2";
import "./chart.scss";

const Chart = () => {
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
        data: [210, 250, 230, 260, 280, 210, 210, 240, 220, 270, 220, 290],
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

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            // beginAtZero: true,
            min: 150,
            max: 300, 
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
