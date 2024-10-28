import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Card, CardBody } from '@nextui-org/react';

const MyChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
              label: 'Sales',
              data: [12, 19, 3, 5, 2],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Sales Data',
              },
            },
          },
        });

        // Cleanup function
        return () => {
          myChart.destroy();
        };
      }
    }
  }, []);

  return <Card className="m-1">
      <CardBody>
      <canvas ref={chartRef} />
        </CardBody>
        </Card>;
};

export default MyChart;