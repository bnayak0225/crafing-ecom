'use client';

import { getEditorUrl, type EditorParams } from './editor';

/** Client-only: navigate to external image-editor (use when you need onClick handlers). */
export function openEditor(params: EditorParams = {}) {
  window.location.href = getEditorUrl(params);
}
