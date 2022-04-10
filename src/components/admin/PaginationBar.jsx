import React, { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
// import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';

export default function PaginationBar({ setPage, page, limit, total }) {
  useEffect(() => {
    if(!total) return;
    const count = Math.ceil(total / limit);
    if(page > count) setPage({ page: count, limit });
  }, [setPage, page, limit, total]);

  const handleSetPage = (event, value) => {
    event.preventDefault();
    setPage({page: Number(value), limit});
  };

  return (
    <Stack spacing={2} m={1}>
      <Pagination count={Math.ceil(total / limit)} page={page} onChange={handleSetPage} siblingCount={1} boundaryCount={1} showFirstButton showLastButton />
    </Stack>
  );
}