// // app/user/page.tsx
// 'use client'; // สำหรับ Client-side rendering

// import React, { useState, useEffect } from 'react';
// import Table from '../../components/Table';

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// const UserPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);

//   // ฟังก์ชันดึงข้อมูลจาก API
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('https://your-api.com/users');
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//     }
//   };

//   // ฟังก์ชันลบผู้ใช้
//   const handleDeleteUser = async (userId: string) => {
//     try {
//       await fetch(`https://your-api.com/users/${userId}`, {
//         method: 'DELETE',
//       });
//       fetchUsers(); // ดึงข้อมูลใหม่หลังจากลบ
//     } catch (error) {
//       console.error('Failed to delete user:', error);
//     }
//   };

//   // ดึงข้อมูลเมื่อ component ถูก mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h1>User List</h1>
//       <Table users={users} onDeleteUser={handleDeleteUser} />
//     </div>
//   );
// };

// export default UserPage;



// // components/Table.tsx
// import React from 'react';
// import Button from './Button';

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface TableProps {
//   users: User[];
//   onDeleteUser: (userId: string) => void;
// }

// const Table: React.FC<TableProps> = ({ users, onDeleteUser }) => {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((user) => (
//           <tr key={user.id}>
//             <td>{user.id}</td>
//             <td>{user.name}</td>
//             <td>{user.email}</td>
//             <td>
//               <Button userId={user.id} onDelete={onDeleteUser} />
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default Table;



// // components/Button.tsx
// import React from 'react';

// interface ButtonProps {
//   userId: string;
//   onDelete: (userId: string) => void;
// }

// const Button: React.FC<ButtonProps> = ({ userId, onDelete }) => {
//   return (
//     <button onClick={() => onDelete(userId)}>Delete</button>
//   );
// };

// export default Button;