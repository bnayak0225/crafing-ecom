export interface EditorParams {
  projectId?: string;
  templateId?: string;
  width?: number;
  height?: number;
  title?: string;
}

const editorBase = () =>
  process.env.NEXT_PUBLIC_IMAGE_EDITOR_URL || 'http://localhost:5174';

/** Build image-editor URL (safe for Server and Client Components). */
export function getEditorUrl(params: EditorParams = {}): string {
  const url = new URL(editorBase());
  if (params.projectId) url.searchParams.set('project', params.projectId);
  if (params.templateId) url.searchParams.set('template', params.templateId);
  if (params.width) url.searchParams.set('width', String(params.width));
  if (params.height) url.searchParams.set('height', String(params.height));
  if (params.title) url.searchParams.set('title', params.title);
  return url.toString();
}
