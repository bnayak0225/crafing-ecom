'use client';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  isStudioSectionActive,
  studioSectionHref,
  type StudioPanel,
} from '@/config/studio-nav';
import { getEditorUrl } from '@/lib/editor';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

const mainNav: {
  id: StudioPanel;
  label: string;
  href: string;
  icon: typeof AutoAwesomeOutlinedIcon;
}[] = [
  { id: 'design', label: 'Design', href: studioSectionHref('design'), icon: AutoAwesomeOutlinedIcon },
  { id: 'print', label: 'Print', href: studioSectionHref('print'), icon: PrintOutlinedIcon },
  { id: 'my-work', label: 'My Work', href: '/studio/projects', icon: FolderOutlinedIcon },
  { id: 'account', label: 'Account', href: '/studio/account', icon: PersonOutlinedIcon },
];

export function Sidebar() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const productType = searchParams?.get('type') ?? '';
  const sectionParam = searchParams?.get('section') ?? '';

  return (
    <Box
      component="aside"
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        flexShrink: 0,
        width: tokens.sidebarWidth,
        height: '100%',
        minHeight: 0,
        overflow: 'auto',
        borderRight: 1,
        borderColor: colors.border.subtle,
        bgcolor: colors.background.elevated,
        py: 2.5,
        px: 2,
      }}
    >
      <List dense disablePadding sx={{ flex: 1 }}>
        {mainNav.map(({ id, label, href, icon: Icon }) => (
          <ListItemButton
            key={id}
            component={Link}
            href={href}
            selected={isStudioSectionActive(pathname, sectionParam, productType, id)}
            sx={{ py: 1, mb: 0.25, borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <Icon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 600 } } }}
            />
          </ListItemButton>
        ))}
      </List>

      <Button
        component="a"
        href={getEditorUrl()}
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ mt: 2, flexShrink: 0 }}
      >
        New design
      </Button>
    </Box>
  );
}
