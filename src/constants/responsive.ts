export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const CONTAINER_MAX_WIDTHS = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const GRID_COLUMNS = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 4,
} as const;

export const SPACING = {
  xs: {
    padding: 'p-2',
    gap: 'gap-2',
    margin: 'm-2',
  },
  sm: {
    padding: 'p-3',
    gap: 'gap-3',
    margin: 'm-3',
  },
  md: {
    padding: 'p-4',
    gap: 'gap-4',
    margin: 'm-4',
  },
  lg: {
    padding: 'p-6',
    gap: 'gap-6',
    margin: 'm-6',
  },
  xl: {
    padding: 'p-8',
    gap: 'gap-8',
    margin: 'm-8',
  },
} as const;

export const FONT_SIZES = {
  xs: {
    heading1: 'text-2xl',
    heading2: 'text-xl',
    heading3: 'text-lg',
    body: 'text-sm',
    small: 'text-xs',
  },
  sm: {
    heading1: 'text-3xl',
    heading2: 'text-2xl',
    heading3: 'text-xl',
    body: 'text-base',
    small: 'text-sm',
  },
  md: {
    heading1: 'text-4xl',
    heading2: 'text-3xl',
    heading3: 'text-2xl',
    body: 'text-base',
    small: 'text-sm',
  },
  lg: {
    heading1: 'text-5xl',
    heading2: 'text-4xl',
    heading3: 'text-3xl',
    body: 'text-lg',
    small: 'text-base',
  },
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;