'use client';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { TOOL_OPTIONS } from '@/components/tools/toolsConfig';
import { PRINT_CATEGORIES, printCategoryHref } from '@/config/print-categories';
import {
  STUDIO_DESIGN_PRODUCTS,
  isStudioSectionActive,
  studioProductHref,
  studioSectionHref,
} from '@/config/studio-nav';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

const navLinkSx = {
  color: colors.text.secondary,
  fontWeight: 500,
  transition: 'color 0.2s',
  '&:hover': { color: colors.primary.main, bgcolor: 'transparent' },
} as const;

type NavMenuItem = {
  href: string;
  label: string;
  active?: boolean;
};

function NavTextLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Typography
      component={Link}
      href={href}
      variant="body2"
      sx={{
        ...navLinkSx,
        color: active ? colors.primary.main : colors.text.secondary,
        fontWeight: active ? 600 : 500,
      }}
    >
      {children}
    </Typography>
  );
}

function NavHoverDropdown({
  label,
  href,
  active,
  items,
  minWidth = 220,
}: {
  label: string;
  href: string;
  active?: boolean;
  items: NavMenuItem[];
  minWidth?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Button
        component={Link}
        href={href}
        color="inherit"
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 18,
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
          />
        }
        sx={{
          ...navLinkSx,
          color: active ? colors.primary.main : colors.text.secondary,
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </Button>

      {open ? (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            pt: 0.75,
            minWidth,
            zIndex: 1200,
          }}
        >
          <Stack
            sx={{
              py: 0.5,
              maxHeight: 360,
              overflowY: 'auto',
              bgcolor: colors.background.paper,
              border: 1,
              borderColor: colors.border.subtle,
              borderRadius: tokens.radiusPx.md,
              boxShadow: colors.shadow.elevated,
            }}
          >
            {items.map((item) => (
              <Typography
                key={`${item.href}-${item.label}`}
                component={Link}
                href={item.href}
                variant="body2"
                sx={{
                  px: 2,
                  py: 1.25,
                  whiteSpace: 'nowrap',
                  color: item.active ? colors.primary.main : colors.text.primary,
                  fontWeight: item.active ? 600 : 500,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.primary.main,
                    bgcolor: colors.accent.highlight,
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

export function SiteNavbar() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const sectionParam = searchParams?.get('section') ?? '';
  const productType = searchParams?.get('type') ?? '';
  const groupParam = searchParams?.get('group') ?? '';
  const isHome = pathname === '/';
  const isToolsSection = pathname.startsWith('/tools');
  const [toolsOpen, setToolsOpen] = useState(false);

  const designMenuItems = useMemo<NavMenuItem[]>(
    () => [
      {
        href: studioSectionHref('design'),
        label: 'All design formats',
        active: isStudioSectionActive(pathname, sectionParam, productType, 'design') && !productType,
      },
      ...STUDIO_DESIGN_PRODUCTS.map((product) => ({
        href: studioProductHref(product),
        label: product.label,
        active: productType === product.id,
      })),
    ],
    [pathname, productType, sectionParam],
  );

  const printMenuItems = useMemo<NavMenuItem[]>(
    () => [
      {
        href: studioSectionHref('print'),
        label: 'All print products',
        active:
          isStudioSectionActive(pathname, sectionParam, productType, 'print') &&
          !groupParam &&
          !productType,
      },
      ...PRINT_CATEGORIES.map((category) => ({
        href: printCategoryHref(category.id),
        label: category.title,
        active: groupParam === category.id,
      })),
    ],
    [groupParam, pathname, productType, sectionParam],
  );

  const scrollTo = useCallback((id: string) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = `/#${id}`;
  }, [isHome]);

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        flexShrink: 0,
        height: tokens.siteNavbarHeight,
        boxSizing: 'border-box',
        borderBottom: 1,
        borderColor: colors.border.subtle,
        bgcolor: colors.alpha.white92,
        backdropFilter: 'blur(14px)',
        boxShadow: colors.shadow.header,
      }}
    >
      <Container maxWidth="lg" sx={{ height: '100%' }}>
        <Stack
          direction="row"
          sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          <BrandLogo href="/" size="sm" />

          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <NavHoverDropdown
              label="Design"
              href={studioSectionHref('design')}
              active={isStudioSectionActive(pathname, sectionParam, productType, 'design')}
              items={designMenuItems}
              minWidth={240}
            />
            <NavHoverDropdown
              label="Print"
              href={studioSectionHref('print')}
              active={isStudioSectionActive(pathname, sectionParam, productType, 'print')}
              items={printMenuItems}
              minWidth={200}
            />

            <Button onClick={() => scrollTo('features')} color="inherit" sx={navLinkSx}>
              Features
            </Button>
            <Button onClick={() => scrollTo('templates')} color="inherit" sx={navLinkSx}>
              Templates
            </Button>

            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <Button
                color="inherit"
                endIcon={
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: 18,
                      transition: 'transform 0.2s',
                      transform: toolsOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                }
                sx={{
                  ...navLinkSx,
                  color: isToolsSection ? colors.primary.main : colors.text.secondary,
                  fontWeight: isToolsSection ? 600 : 500,
                }}
              >
                Free tools
              </Button>

              {toolsOpen ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    pt: 0.75,
                    minWidth: 220,
                    zIndex: 1200,
                  }}
                >
                  <Stack
                    sx={{
                      py: 0.5,
                      bgcolor: colors.background.paper,
                      border: 1,
                      borderColor: colors.border.subtle,
                      borderRadius: tokens.radiusPx.md,
                      boxShadow: colors.shadow.elevated,
                    }}
                  >
                    {TOOL_OPTIONS.map((tool) => (
                      <Typography
                        key={tool.path}
                        component={Link}
                        href={tool.path}
                        variant="body2"
                        sx={{
                          px: 2,
                          py: 1.25,
                          color: pathname === tool.path ? colors.primary.main : colors.text.primary,
                          fontWeight: pathname === tool.path ? 600 : 500,
                          textDecoration: 'none',
                          '&:hover': {
                            color: colors.primary.main,
                            bgcolor: colors.accent.highlight,
                          },
                        }}
                      >
                        {tool.label}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ) : null}
            </Box>

            <NavTextLink href="/studio/pricing" active={pathname.startsWith('/studio/pricing')}>
              Pricing
            </NavTextLink>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            <Button
              component={Link}
              href="/tools"
              variant="text"
              color="inherit"
              sx={{ display: { xs: 'inline-flex', md: 'none' }, ...navLinkSx }}
            >
              Tools
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Sign in
            </Button>
            <Button component={Link} href="/studio" variant="contained" color="primary">
              Open Studio
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
