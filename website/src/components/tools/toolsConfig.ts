export const TOOL_OPTIONS = [
  { path: '/tools/remove-background', label: 'Background remover' },
  { path: '/tools/resize-image', label: 'Image resizer' },
] as const;

export type ToolPath = (typeof TOOL_OPTIONS)[number]['path'];
