import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const ErrorPage: React.FC<ErrorProps> = ({ statusCode }) => {
  if (statusCode === 404) {
    return <h1>ไม่พบหน้าที่คุณต้องการ</h1>;
  }

  if (statusCode === 500) {
    return <h1>มีข้อผิดพลาดในเซิร์ฟเวอร์</h1>;
  }

  return <h1>เกิดข้อผิดพลาดบางอย่าง</h1>;
};

// ฟังก์ชันสำหรับจัดการข้อผิดพลาดจากเซิร์ฟเวอร์
// ErrorPage.getInitialProps = async (context: NextPageContext) => {
//   const { res, err } = context;

//   // ตรวจสอบว่าเป็นข้อผิดพลาดจากการเรนเดอร์ในเซิร์ฟเวอร์หรือไม่
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

//   return { statusCode };
// };

export default ErrorPage;