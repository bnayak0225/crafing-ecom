import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { getEditorUrl } from '@/lib/editor';
import { tokens } from '@/theme';

const mainNav = [
  { href: '/studio', label: 'Templates', icon: DashboardOutlinedIcon, exact: true },
  { href: '/studio/projects', label: 'My Work', icon: FolderOutlinedIcon, exact: false },
];

const secondaryNav = [
  { href: '/studio/pricing', label: 'Plans', icon: LocalOfferOutlinedIcon, exact: false },
  { href: '/studio/account', label: 'Account', icon: PersonOutlinedIcon, exact: false },
  { href: '/studio/cart', label: 'Cart', icon: ShoppingCartOutlinedIcon, exact: false },
  { href: '/login', label: 'Sign in', icon: LoginOutlinedIcon, exact: true },
];

interface SidebarProps {
  pathname: string;
}

function NavSection({
  items,
  pathname,
}: {
  items: typeof mainNav;
  pathname: string;
}) {
  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <List disablePadding>
      {items.map(({ href, label, icon: Icon, exact }) => (
        <ListItemButton
          key={href}
          component={Link}
          href={href}
          selected={isActive(href, exact)}
        >
          <ListItemIcon>
            <Icon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </List>
  );
}

export function Sidebar({ pathname }: SidebarProps) {
  return (
    <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 2.5,
          px: 2,
        }}
      >
        <Box sx={{ px: 0.5, mb: 3 }}>
          <BrandLogo href="/studio" />
        </Box>

        <Typography
          variant="overline"
          sx={{ px: 1.5, mb: 1, color: 'text.disabled', display: 'block' }}
        >
          Workspace
        </Typography>
        <NavSection items={mainNav} pathname={pathname} />

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="overline"
          sx={{ px: 1.5, mb: 1, color: 'text.disabled', display: 'block' }}
        >
          Account
        </Typography>
        <NavSection items={secondaryNav} pathname={pathname} />

        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button
            component="a"
            href={getEditorUrl()}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            New design
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
