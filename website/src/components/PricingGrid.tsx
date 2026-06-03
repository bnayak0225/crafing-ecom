import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { colors } from '@/theme/colors';
import type { PricingPlan } from '@/types';

interface PricingGridProps {
  plans: PricingPlan[];
}

export function PricingGrid({ plans }: PricingGridProps) {
  return (
    <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
      {plans.map((plan) => (
        <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              position: 'relative',
              bgcolor: plan.highlighted ? colors.background.subtle : colors.background.paper,
              ...(plan.highlighted && {
                background: colors.gradient.surfaceGlow,
              }),
            }}
          >
            {plan.highlighted && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: colors.primary.main,
                  typography: 'caption',
                  fontWeight: 700,
                  color: colors.primary.contrast,
                }}
              >
                Popular
              </Box>
            )}
            <CardContent sx={{ p: 3, pt: plan.highlighted ? 4 : 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {plan.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, my: 2 }}>
                <Typography variant="h3" component="span" sx={{ fontWeight: 700 }}>
                  ${plan.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / {plan.interval}
                </Typography>
              </Box>
              <List dense disablePadding sx={{ mb: 3 }}>
                {plan.features.map((f) => (
                  <ListItem key={f} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlinedIcon
                        sx={{ fontSize: 18, color: colors.primary.main }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={f}
                      slotProps={{
                        primary: { variant: 'body2', color: 'text.secondary' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant={plan.highlighted ? 'contained' : 'outlined'}
                color="primary"
                size="large"
              >
                {plan.price === 0 ? 'Get started free' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
