import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Card, CardBody, colors } from "@heroui/react";
import React from "react";
import { CheckCircleIcon, Container, Grid, XCircleIcon } from "lucide-react";
import { AiOutlineExclamation } from "react-icons/ai";

const MyChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [dataLable, setDataLable] = React.useState(["ew", "aa" , "aa", "aa", "aa"]);
  const [data, setData] = React.useState([1, 2 , 3 ,4, 3, 2]);
  //const [data, setData] = React.useState([]);

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
            maintainAspectRatio: false,
            aspectRatio: 2.55,
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
                } else {
                }
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
    <div className="grid grid-flow-row auto-rows-max">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {/* Card 1: จำนวนการใช้งาน */}
        <Card className="bg-blue-50 shadow-md p-4 m-1">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-blue-500" />
            <div>
              <h5 className="text-lg font-semibold">จำนวนการใช้งาน</h5>
              <p className="text-2xl font-bold">1,245 ครั้ง</p>
            </div>
          </div>
        </Card>

        {/* Card 2: สถานะการเชื่อมต่อ */}
        <Card className="bg-red-50 shadow-md p-4 m-1">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="h-6 w-6 text-red-500" />
            <div>
              <h5 className="text-lg font-semibold">สถานะการเชื่อมต่อ</h5>
              <p className="text-xl text-red-600">ไม่มีการเชื่อมต่อ</p>
            </div>
          </div>
        </Card>

        {/* Card 3: สถานะออนไลน์ */}
        <Card className="bg-green-50 shadow-md p-4 m-1">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <div>
              <h5 className="text-lg font-semibold">สถานะออนไลน์</h5>
              <p className="text-xl text-green-600">ออนไลน์</p>
            </div>
          </div>
        </Card>

        {/* Card 4: ค่าไฟที่ต่ำเกินกำหนด */}
        <Card className="bg-yellow-50 shadow-md p-4 m-1">
          <div className="flex items-center space-x-3">
            <AiOutlineExclamation className="h-6 w-6 text-yellow-500" />
            <div>
              <h5 className="text-lg font-semibold">ค่าไฟที่ต่ำเกินกำหนด</h5>
              <p className="text-xl text-yellow-600">ต่ำเกินกำหนด</p>
            </div>
          </div>
        </Card>
      </div>
      {/* h-[calc(100vh-290px)] */}
      <Card className="m-1">
        <CardBody>
          <canvas ref={chartRef} />
        </CardBody>
      </Card>

      
    </div>
  );
};

export default MyChart;
