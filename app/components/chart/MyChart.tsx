import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Card, CardBody, colors } from "@heroui/react";
import React from "react";

const MyChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [dataLable , setDataLable] = React.useState(["ew", "aa"]);
  const [data , setData] = React.useState([1,2]);

  useEffect(() => {
    if (chartRef.current) {
      const colors = {
        red: {
          default: "rgba(255, 0, 0, 1)",
          half: "rgba(253, 120, 120, 0.5)",
          quarter: "rgba(255, 135, 135, 0.2)",
          zero: "rgba(255, 180, 180, 0.1)",
        },
      };

      const ctx = chartRef.current.getContext("2d");
      const gradient = ctx?.createLinearGradient(0, 25, 0, 300);
      gradient?.addColorStop(0, colors.red.half);
      gradient?.addColorStop(0.75, colors.red.quarter);
      gradient?.addColorStop(1, colors.red.zero);

      if (ctx) {
        const myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: dataLable,
            datasets: [
              {
                label: "Sales",
                data: data,
                backgroundColor: gradient,
                borderWidth: 2.5,
                fill: true,

                tension: 0.1,
              },
            ],
          },

          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Sales Data",
                align: "center",
              },
            },
            animation: {
              onComplete: () => {

                if (data.length === 0) {
                  const fontSize = 24;
                  
                  ctx.save();
                  ctx.font = `${fontSize}px Arial`;
                  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  ctx.fillText(
                    "No Data",
                    ctx.canvas.width / 2,
                    ctx.canvas.height / 2
                  );
                  ctx.restore();
                }
                else{}
              },
            },
          },
        });

        return () => {
          myChart.destroy();
        };
      }
    }
  }, []);

  return (
    <Card className="m-1">
      <CardBody>
        <canvas ref={chartRef} />
      </CardBody>
    </Card>
  );
};

export default MyChart;
