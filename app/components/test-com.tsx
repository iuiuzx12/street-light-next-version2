import useSWR from 'swr';
import axios from 'axios'
//import { fetcher } from '../api/auth/jwt'; // เรียกใช้ฟังก์ชัน fetcher ที่สร้างไว้

const externalApiUrl = '/api/user-login'; // URL ของ API ภายนอกที่ต้องการเรียกใช้
// const fetcher = async (url : any) => {
//     const response = await fetch(url);
//     return response.json();
// };

const fetcher = (url: string) => axios.post(url).then(res => res.data)

function TestCom() {
    const { data, error } = useSWR('/api/user-login', fetcher ,{
        revalidateOnFocus: false,
        revalidateOnMount:false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    });

    if (error) return <div>เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;
    if (!data) return <div>กำลังโหลดข้อมูล...</div>;

    return (
        <div>
            <h1>ข้อมูลที่ดึงมา: {data}</h1>
        </div>
    );
}

export default TestCom;