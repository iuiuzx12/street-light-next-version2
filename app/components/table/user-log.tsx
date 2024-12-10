
"use client"
import React, { useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue, Input} from "@nextui-org/react";
import useSWR from "swr";
import moment from 'moment';

//const fetcher = (...args : [RequestInfo, RequestInit?]) => fetch(...args).then((res) => res.json());



const fetcher = (url: string, data: object) => {
  console.log(url)
  console.log(data)
  return fetch(url[0], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(url[1]),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  });
};

interface Item {
  data_type: string;
  detail: string;
  full_name: string;
  timestamp: string;
}

export default function TableLogUser() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const dataToSend = { period: '-15780000',
    page_number : page.toString(),
    page_size : pageSize.toString(),
    draw : page.toString()
   };

  // const {data, isLoading} = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
  //   keepPreviousData: true,
  // });

  const [searchTerm, setSearchTerm] = useState('');
  

  const { data, error, isLoading } = useSWR(
    ['/api/get-log-user', dataToSend],
    fetcher,
    {
      keepPreviousData: false,
    }
  );

  const rowsPerPage = pageSize;

  const filteredData = data?.data.data.filter((item : Item) =>
    item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data_type.toString().includes(searchTerm)
  );

  const pages = React.useMemo(() => {
    //Number dataTotal = (data?.data.recordsFiltered / pageSize) < 1 ? 1 : data?.data.recordsFiltered / pageSize
    return (data?.data.recordsFiltered / pageSize) < 1 ? 1 : Math.floor(data?.data.recordsFiltered / pageSize)
  }, [(data?.data.recordsFiltered / pageSize), rowsPerPage]);

  const loadingState = isLoading || data?.data.recordsFiltered / pageSize === 0 ? "loading" : "idle";
  
  return (
    <>
     <Input
        isClearable
        
        label="Search"
        placeholder="Search by Command or Name"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    <Table
      isStriped
      aria-label="Example table with client async pagination"
      isHeaderSticky
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "h-[calc(100vh-170px)]",
      }}
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="data_type">Commamd</TableColumn>
        <TableColumn key="detail">Detail</TableColumn>
        <TableColumn key="full_name">Name</TableColumn>
        <TableColumn key="timestamp">Time</TableColumn>
      </TableHeader>
      <TableBody
        items={filteredData ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item: Item) => (
          <TableRow key={item.timestamp}>
            {(columnKey) => 
              <TableCell>{columnKey == 'timestamp' ?  moment(getKeyValue(item, columnKey) * 1000).format('YYYY-MM-DD HH:mm') : getKeyValue(item, columnKey)}</TableCell>
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
    
  );
}
