import type { Template } from '@/types';
import type { StudioProduct } from '@/config/studio-nav';

type Format = {
  id: string;
  width: number | null;
  height: number | null;
};

export function filterTemplatesForProduct(
  templates: Template[],
  product: StudioProduct,
  formats: Format[],
): Template[] {
  let result = [...templates];

  if (product.category) {
    result = result.filter((template) => template.category === product.category);
  }

  if (product.tag) {
    result = result.filter((template) => template.tags.includes(product.tag!));
  }

  if (product.search) {
    const q = product.search.toLowerCase();
    result = result.filter(
      (template) =>
        template.title.toLowerCase().includes(q) ||
        template.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }

  if (product.formatId) {
    const format = formats.find((entry) => entry.id === product.formatId);
    if (format?.width && format?.height) {
      const bySize = result.filter(
        (template) => template.width === format.width && template.height === format.height,
      );
      if (bySize.length > 0) result = bySize;
    }
  }

  return result;
}
