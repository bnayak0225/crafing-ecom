import type { StudioSection } from '@/config/studio-nav';

export type FeaturedTheme = {
  id: string;
  section: StudioSection;
  /** Design theme / style name, e.g. "Story promo layout" */
  themeName: string;
  /** Format template it belongs to, e.g. "Instagram story" */
  templateName: string;
  thumbnail: string;
  width: number;
  height: number;
  templateId?: string;
  premium?: boolean;
};

export const FEATURED_THEMES: FeaturedTheme[] = [
  {
    id: 'theme-youtube-thumbnail',
    section: 'design',
    themeName: 'Creator bold thumb',
    templateName: 'YouTube thumbnail',
    templateId: 'tpl-009',
    width: 1280,
    height: 720,
    thumbnail:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7bba0?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-instagram-story',
    section: 'design',
    themeName: 'Story promo layout',
    templateName: 'Instagram story',
    templateId: 'tpl-011',
    width: 1080,
    height: 1920,
    thumbnail:
      'https://images.unsplash.com/photo-1611162617474-24b9a338adbe?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-linkedin-banner',
    section: 'design',
    themeName: 'Professional header',
    templateName: 'LinkedIn banner',
    templateId: 'tpl-005',
    width: 1584,
    height: 396,
    thumbnail:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-product-card',
    section: 'design',
    themeName: 'Minimal shop card',
    templateName: 'Product card',
    templateId: 'tpl-002',
    width: 1080,
    height: 1080,
    thumbnail:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-invitation',
    section: 'design',
    themeName: 'Wedding elegant invite',
    templateName: 'Invitation',
    templateId: 'tpl-004',
    width: 1050,
    height: 1500,
    premium: true,
    thumbnail:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-app-launch',
    section: 'design',
    themeName: 'Tech launch story',
    templateName: 'App launch teaser',
    templateId: 'tpl-007',
    width: 1080,
    height: 1920,
    premium: true,
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-sale-banner',
    section: 'design',
    themeName: 'Summer sale banner',
    templateName: 'Web banner',
    templateId: 'tpl-001',
    width: 1200,
    height: 628,
    thumbnail:
      'https://images.unsplash.com/photo-1607083206869-4c6672c72c7d?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-presentation',
    section: 'design',
    themeName: 'Brand style cover',
    templateName: 'Presentation',
    templateId: 'tpl-010',
    width: 1920,
    height: 1080,
    premium: true,
    thumbnail:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-food-menu',
    section: 'print',
    themeName: 'Food menu board',
    templateName: 'A4 flyer',
    templateId: 'tpl-006',
    width: 2480,
    height: 3508,
    thumbnail:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
  },
  {
    id: 'theme-real-estate-flyer',
    section: 'print',
    themeName: 'Real estate flyer',
    templateName: 'Poster',
    templateId: 'tpl-008',
    width: 2550,
    height: 3300,
    thumbnail:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  },
];

export function getFeaturedThemes(section: StudioSection): FeaturedTheme[] {
  return FEATURED_THEMES.filter((theme) => theme.section === section);
}
