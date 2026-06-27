'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { colors } from '@/theme/colors';

interface HorizontalScrollRowProps {
  children: React.ReactNode;
  gap?: number;
  snap?: boolean;
}

const ARROW_SX = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
  width: 36,
  height: 36,
  bgcolor: colors.background.paper,
  border: 1,
  borderColor: colors.border.subtle,
  boxShadow: colors.shadow.card,
  '&:hover': {
    bgcolor: colors.background.paper,
    boxShadow: colors.shadow.cardHover,
  },
} as const;

export function HorizontalScrollRow({ children, gap = 2, snap = true }: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const refreshScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScrollLeft > 4 && el.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    refreshScrollState();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', refreshScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(refreshScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', refreshScrollState);
      resizeObserver.disconnect();
    };
  }, [refreshScrollState, children]);

  const scrollByDirection = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = Math.max(el.clientWidth * 0.8, 240);
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        mx: { xs: -2, sm: -0.5 },
        px: { xs: 2, sm: 0.5 },
      }}
    >
      {canScrollLeft ? (
        <IconButton
          onClick={() => scrollByDirection('left')}
          aria-label="Scroll left"
          size="small"
          sx={{
            ...ARROW_SX,
            left: { xs: 0, sm: -4 },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      ) : null}

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: snap ? 'x mandatory' : 'none',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '& > *': {
            flexShrink: 0,
            scrollSnapAlign: snap ? 'start' : undefined,
          },
        }}
      >
        {children}
      </Box>

      {canScrollRight ? (
        <IconButton
          onClick={() => scrollByDirection('right')}
          aria-label="Scroll right"
          size="small"
          sx={{
            ...ARROW_SX,
            right: { xs: 0, sm: -4 },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      ) : null}
    </Box>
  );
}
