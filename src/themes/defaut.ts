'use client';
import { createTheme } from "@mui/material";

export const defaultTheme = createTheme({
  unstable_strictMode: true,
  palette: {
    mode: 'light'
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '4px 6px'
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.08)',
          borderRadius: 2
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: 'normal',
          lineHeight: 'inherit',
        },
        h1: {
          fontSize: 'var(--md-node-h1-font-size)',
          fontWeight: 'var(--md-node-h1-font-weight)',
        },
        h2: {
          fontSize: 'var(--md-node-h2-font-size)',
          fontWeight: 'var(--md-node-h2-font-weight)',
        },
        h3: {
          fontSize: 'var(--md-node-h3-font-size)',
          fontWeight: 'var(--md-node-h3-font-weight)',
        },
        h4: {
          fontSize: 'var(--md-node-h4-font-size)',
          fontWeight: 'var(--md-node-h4-font-weight)',
        },
        h5: {
          fontSize: 'var(--md-node-h5-font-size)',
          fontWeight: 'var(--md-node-h5-font-weight)',
        },
        h6: {
          fontSize: 'var(--md-node-h6-font-size)',
          fontWeight: 'var(--md-node-h6-font-weight)',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
          },
        }
      }
    }
  }
})