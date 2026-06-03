'use client';

import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/studio?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, maxWidth: 480 }}>
      <TextField
        fullWidth
        placeholder="Search templates, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
