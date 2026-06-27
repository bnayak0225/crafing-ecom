import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import ManOutlinedIcon from '@mui/icons-material/ManOutlined';
import WomanOutlinedIcon from '@mui/icons-material/WomanOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import FilterFramesOutlinedIcon from '@mui/icons-material/FilterFramesOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import PanoramaOutlinedIcon from '@mui/icons-material/PanoramaOutlined';
import PhotoAlbumOutlinedIcon from '@mui/icons-material/PhotoAlbumOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import { studioProductSizeSearchText } from '@/config/studio-product-sizes';
export type StudioSection = 'design' | 'print';

export type StudioProductGroupId =
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'linkedin'
  | 'twitter'
  | 'pinterest'
  | 'tiktok'
  | 'banners'
  | 'presentations'
  | 'social'
  | 'ecommerce'
  | 'events'
  | 'documents'
  | 'video';

export type StudioPrintGroupId = 'mug' | 'tshirt' | 'photobook' | 'photo-print' | 'frame';

export type StudioFilterTagId = StudioProductGroupId | StudioPrintGroupId | 'all';

export type StudioFilterTag = {
  id: StudioFilterTagId;
  label: string;
};

export type StudioProduct = {
  id: string;
  section: StudioSection;
  label: string;
  icon: SvgIconComponent;
  groupId?: StudioProductGroupId;
  printGroupId?: StudioPrintGroupId;
  category?: string;
  tag?: string;
  search?: string;
  formatId?: string;
  description?: string;
  /** When false, hidden from print pickers and category lists (code/routes may remain). */
  listed?: boolean;
};

export type StudioProductGroup = {
  id: StudioProductGroupId;
  label: string;
  description: string;
};

export const STUDIO_DESIGN_GROUPS: StudioProductGroup[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Square posts, stories, and reels covers sized for Instagram.',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Page covers and feed graphics for Facebook.',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Thumbnails and channel art for video content.',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional banners and article headers.',
  },
  {
    id: 'banners',
    label: 'Banners & ads',
    description: 'Display ads, promo banners, and campaign cards.',
  },
  {
    id: 'social',
    label: 'Social & multi-platform',
    description: 'Flexible layouts that work across social networks.',
  },
  {
    id: 'presentations',
    label: 'Presentations',
    description: 'Slides and widescreen decks for talks and pitches.',
  },
];

/** Ordered tag chips shown above the design format grid. */
export const STUDIO_DESIGN_FILTER_TAGS: StudioFilterTag[] = [
  { id: 'all', label: 'All' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'banners', label: 'Marketing' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'events', label: 'Events' },
  { id: 'video', label: 'Video' },
  { id: 'presentations', label: 'Presentations' },
  { id: 'documents', label: 'Documents' },
  { id: 'social', label: 'Social' },
];

/** Ordered tag chips shown above the print product grid. */
export const STUDIO_PRINT_FILTER_TAGS: StudioFilterTag[] = [
  { id: 'all', label: 'All' },
  { id: 'mug', label: 'Mugs' },
  { id: 'tshirt', label: 'T-Shirts' },
  { id: 'photobook', label: 'Photo books' },
  { id: 'photo-print', label: 'Photo prints' },
  { id: 'frame', label: 'Frames' },
];

export const STUDIO_DESIGN_PRODUCTS: StudioProduct[] = [
  // Instagram
  {
    id: 'instagram-post',
    section: 'design',
    label: 'Instagram post',
    icon: ImageOutlinedIcon,
    groupId: 'instagram',
    category: 'social',
    formatId: 'instagram-post',
    tag: 'instagram',
    description: '1080×1080 square feed posts.',
  },
  {
    id: 'instagram-story',
    section: 'design',
    label: 'Instagram story',
    icon: PanoramaOutlinedIcon,
    groupId: 'instagram',
    category: 'social',
    formatId: 'instagram-story',
    tag: 'story',
    description: '1080×1920 stories and reels.',
  },
  {
    id: 'instagram-reel-cover',
    section: 'design',
    label: 'Instagram reel cover',
    icon: MovieOutlinedIcon,
    groupId: 'instagram',
    category: 'social',
    tag: 'reel',
    search: 'reel',
    description: 'Vertical cover art for reels.',
  },
  // Facebook
  {
    id: 'facebook-cover',
    section: 'design',
    label: 'Facebook cover',
    icon: CampaignOutlinedIcon,
    groupId: 'facebook',
    category: 'social',
    formatId: 'facebook-cover',
    tag: 'facebook',
    description: '820×312 page cover photos.',
  },
  {
    id: 'facebook-post',
    section: 'design',
    label: 'Facebook post',
    icon: ShareOutlinedIcon,
    groupId: 'facebook',
    category: 'social',
    tag: 'facebook',
    search: 'facebook post',
    description: '1200×630 link and feed posts.',
  },
  {
    id: 'facebook-event-cover',
    section: 'design',
    label: 'Facebook event cover',
    icon: EventOutlinedIcon,
    groupId: 'facebook',
    category: 'events',
    tag: 'facebook',
    search: 'event',
    description: '1920×1005 event header images.',
  },
  // YouTube & video
  {
    id: 'youtube-thumbnail',
    section: 'design',
    label: 'YouTube thumbnail',
    icon: SlideshowOutlinedIcon,
    groupId: 'youtube',
    category: 'video',
    formatId: 'youtube-thumb',
    tag: 'youtube',
    description: '1280×720 video thumbnails.',
  },
  {
    id: 'youtube-channel-art',
    section: 'design',
    label: 'YouTube channel art',
    icon: OndemandVideoOutlinedIcon,
    groupId: 'youtube',
    category: 'video',
    tag: 'youtube',
    search: 'channel',
    description: '2560×1440 channel banners.',
  },
  {
    id: 'video-intro',
    section: 'design',
    label: 'Video intro',
    icon: VideoLibraryOutlinedIcon,
    groupId: 'video',
    category: 'video',
    tag: 'video',
    search: 'intro',
    description: 'Short intro clips and bumpers.',
  },
  {
    id: 'twitch-banner',
    section: 'design',
    label: 'Twitch banner',
    icon: MovieOutlinedIcon,
    groupId: 'video',
    category: 'video',
    search: 'twitch',
    description: '1200×480 stream profile banners.',
  },
  // LinkedIn
  {
    id: 'linkedin-banner',
    section: 'design',
    label: 'LinkedIn banner',
    icon: ContactMailOutlinedIcon,
    groupId: 'linkedin',
    category: 'social',
    formatId: 'linkedin-banner',
    tag: 'linkedin',
    description: '1584×396 profile and company banners.',
  },
  {
    id: 'linkedin-post',
    section: 'design',
    label: 'LinkedIn post',
    icon: WorkOutlineOutlinedIcon,
    groupId: 'linkedin',
    category: 'social',
    tag: 'linkedin',
    search: 'linkedin',
    description: '1200×627 professional feed posts.',
  },
  // X (Twitter), Pinterest, TikTok
  {
    id: 'twitter-header',
    section: 'design',
    label: 'X (Twitter) header',
    icon: TagOutlinedIcon,
    groupId: 'twitter',
    category: 'social',
    search: 'twitter',
    description: '1500×500 profile header images.',
  },
  {
    id: 'twitter-post',
    section: 'design',
    label: 'X (Twitter) post',
    icon: ShareOutlinedIcon,
    groupId: 'twitter',
    category: 'social',
    search: 'twitter post',
    description: '1600×900 post and card images.',
  },
  {
    id: 'pinterest-pin',
    section: 'design',
    label: 'Pinterest pin',
    icon: PushPinOutlinedIcon,
    groupId: 'pinterest',
    category: 'social',
    search: 'pinterest',
    description: '1000×1500 vertical pins.',
  },
  {
    id: 'tiktok-cover',
    section: 'design',
    label: 'TikTok cover',
    icon: MovieOutlinedIcon,
    groupId: 'tiktok',
    category: 'video',
    search: 'tiktok',
    description: '1080×1920 video cover images.',
  },
  // Marketing & ads
  {
    id: 'web-banner',
    section: 'design',
    label: 'Web banner',
    icon: CampaignOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    tag: 'banner',
    search: 'banner',
    description: 'Leaderboards and site hero banners.',
  },
  {
    id: 'display-ad',
    section: 'design',
    label: 'Display ad',
    icon: CampaignOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    tag: 'sale',
    search: 'ad',
    description: 'Rectangular ads for campaigns.',
  },
  {
    id: 'email-header',
    section: 'design',
    label: 'Email header',
    icon: EmailOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    search: 'email',
    description: '600px-wide newsletter headers.',
  },
  {
    id: 'digital-flyer',
    section: 'design',
    label: 'Digital flyer',
    icon: DescriptionOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    tag: 'flyer',
    search: 'flyer',
    description: 'Shareable promo flyers.',
  },
  {
    id: 'digital-poster',
    section: 'design',
    label: 'Digital poster',
    icon: PanoramaOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    search: 'poster',
    description: 'Posters for web and social.',
  },
  {
    id: 'logo',
    section: 'design',
    label: 'Logo',
    icon: AutoAwesomeOutlinedIcon,
    groupId: 'banners',
    category: 'marketing',
    search: 'logo',
    description: 'Brand marks and icon sets.',
  },
  // E-commerce
  {
    id: 'product-card',
    section: 'design',
    label: 'Product card',
    icon: ShoppingBagOutlinedIcon,
    groupId: 'ecommerce',
    category: 'ecommerce',
    tag: 'product',
    search: 'product',
    description: 'Square shop and catalog images.',
  },
  {
    id: 'shop-banner',
    section: 'design',
    label: 'Shop banner',
    icon: StorefrontOutlinedIcon,
    groupId: 'ecommerce',
    category: 'ecommerce',
    tag: 'shop',
    search: 'shop',
    description: 'Storefront and marketplace banners.',
  },
  {
    id: 'sale-badge',
    section: 'design',
    label: 'Sale badge',
    icon: TagOutlinedIcon,
    groupId: 'ecommerce',
    category: 'ecommerce',
    tag: 'sale',
    search: 'sale',
    description: 'Discount stickers and promo tags.',
  },
  // Events
  {
    id: 'invitation',
    section: 'design',
    label: 'Invitation',
    icon: EventOutlinedIcon,
    groupId: 'events',
    category: 'events',
    tag: 'invite',
    search: 'invitation',
    description: 'Wedding, party, and event invites.',
  },
  {
    id: 'event-poster',
    section: 'design',
    label: 'Event poster',
    icon: PanoramaOutlinedIcon,
    groupId: 'events',
    category: 'events',
    tag: 'event',
    search: 'event',
    description: 'Gigs, meetups, and launches.',
  },
  {
    id: 'ticket',
    section: 'design',
    label: 'Ticket',
    icon: CardGiftcardOutlinedIcon,
    groupId: 'events',
    category: 'events',
    search: 'ticket',
    description: 'Event and raffle ticket layouts.',
  },
  // Documents & content
  {
    id: 'presentation',
    section: 'design',
    label: 'Presentation',
    icon: SlideshowOutlinedIcon,
    groupId: 'presentations',
    category: 'documents',
    formatId: 'presentation',
    tag: 'presentation',
    description: '1920×1080 slides and decks.',
  },
  {
    id: 'infographic',
    section: 'design',
    label: 'Infographic',
    icon: InsightsOutlinedIcon,
    groupId: 'documents',
    category: 'documents',
    search: 'infographic',
    description: 'Data stories and visual guides.',
  },
  {
    id: 'resume',
    section: 'design',
    label: 'Resume / CV',
    icon: WorkOutlineOutlinedIcon,
    groupId: 'documents',
    category: 'documents',
    search: 'resume',
    description: 'Professional CV layouts.',
  },
  {
    id: 'report-cover',
    section: 'design',
    label: 'Report cover',
    icon: ArticleOutlinedIcon,
    groupId: 'documents',
    category: 'documents',
    search: 'report',
    description: 'Business report and ebook covers.',
  },
  {
    id: 'certificate',
    section: 'design',
    label: 'Certificate',
    icon: AutoAwesomeOutlinedIcon,
    groupId: 'documents',
    category: 'documents',
    search: 'certificate',
    description: 'Awards and completion certificates.',
  },
  // General
  {
    id: 'social-post',
    section: 'design',
    label: 'Social post',
    icon: ShareOutlinedIcon,
    groupId: 'social',
    category: 'social',
    description: 'Multi-platform square posts.',
  },
  {
    id: 'photo-collage',
    section: 'design',
    label: 'Photo collage',
    icon: CollectionsOutlinedIcon,
    groupId: 'social',
    category: 'social',
    search: 'collage',
    description: 'Multi-photo grid layouts.',
  },
  {
    id: 'whatsapp-status',
    section: 'design',
    label: 'WhatsApp status',
    icon: ShareOutlinedIcon,
    groupId: 'social',
    category: 'social',
    search: 'whatsapp',
    description: '1080×1920 status images.',
  },
  {
    id: 'custom-size',
    section: 'design',
    label: 'Custom size',
    icon: CropFreeOutlinedIcon,
    groupId: 'social',
    category: 'marketing',
    description: 'Start from a blank canvas.',
  },
];
export const STUDIO_PRINT_PRODUCTS: StudioProduct[] = [
  // Mugs
  {
    id: 'coffee-mug',
    section: 'print',
    label: 'Coffee mug',
    icon: LocalCafeOutlinedIcon,
    printGroupId: 'mug',
    category: 'print',
    search: 'mug coffee',
    description: '11 oz ceramic mug with wrap print.',
  },
  {
    id: 'travel-mug',
    section: 'print',
    label: 'Travel mug',
    icon: LocalCafeOutlinedIcon,
    printGroupId: 'mug',
    category: 'print',
    search: 'travel mug tumbler',
    description: 'Insulated tumbler with photo wrap.',
    listed: false,
  },
  // T-Shirts
  {
    id: 't-shirt-men',
    section: 'print',
    label: "Men's T-shirt",
    icon: ManOutlinedIcon,
    printGroupId: 'tshirt',
    category: 'print',
    search: 'tshirt men mens tee shirt apparel',
    description: 'Crew neck tee with front print — men’s fit.',
  },
  {
    id: 't-shirt-women',
    section: 'print',
    label: "Women's T-shirt",
    icon: WomanOutlinedIcon,
    printGroupId: 'tshirt',
    category: 'print',
    search: 'tshirt women womens ladies tee shirt apparel',
    description: 'Crew neck tee with front print — women’s fit.',
  },
  // Photo books
  {
    id: 'photobook',
    section: 'print',
    label: 'Photobook',
    icon: MenuBookOutlinedIcon,
    printGroupId: 'photobook',
    category: 'print',
    search: 'photobook album',
    description: 'Hardcover photo book with custom cover.',
  },
  // Photo prints
  {
    id: 'standard-photo-print',
    section: 'print',
    label: 'Gloss photo print',
    icon: PhotoAlbumOutlinedIcon,
    printGroupId: 'photo-print',
    category: 'print',
    search: 'photo print glossy 4x6 5x7',
    description: 'Single lustre photo print — 4×6 or 5×7 in.',
  },
  {
    id: 'polaroid-print',
    section: 'print',
    label: 'Polaroid print',
    icon: CollectionsOutlinedIcon,
    printGroupId: 'photo-print',
    category: 'print',
    search: 'polaroid instant border retro',
    description: 'Square print with classic white polaroid border.',
  },
  // Frames
  {
    id: 'picture-frame',
    section: 'print',
    label: 'Picture frame',
    icon: FilterFramesOutlinedIcon,
    printGroupId: 'frame',
    category: 'print',
    search: 'frame wall',
    description: 'Framed wall print with mat.',
  },
  {
    id: 'canvas-print',
    section: 'print',
    label: 'Canvas print',
    icon: PhotoAlbumOutlinedIcon,
    printGroupId: 'frame',
    category: 'print',
    search: 'canvas frame',
    description: 'Gallery-wrapped canvas.',
  },
  {
    id: 'poster-frame',
    section: 'print',
    label: 'Poster frame',
    icon: PanoramaOutlinedIcon,
    printGroupId: 'frame',
    category: 'print',
    search: 'poster frame',
    description: '18×24 framed poster print.',
  },
];

/** Print products shown in studio lists (excludes `listed: false`). */
export function listStudioPrintProducts(): StudioProduct[] {
  return STUDIO_PRINT_PRODUCTS.filter((product) => product.listed !== false);
}

export const ALL_STUDIO_PRODUCTS = [...STUDIO_DESIGN_PRODUCTS, ...STUDIO_PRINT_PRODUCTS];

function productSearchText(product: StudioProduct): string {
  return [
    product.label,
    product.description,
    product.id,
    product.tag,
    product.search,
    product.category,
    studioProductSizeSearchText(product),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function filterStudioProducts(
  products: StudioProduct[],
  options: {
    tagId: StudioFilterTagId;
    query: string;
    groupField: 'groupId' | 'printGroupId';
  },
): StudioProduct[] {
  let items = products;

  if (options.tagId !== 'all') {
    items = items.filter((product) => product[options.groupField] === options.tagId);
  }

  const query = options.query.trim().toLowerCase();
  if (query) {
    items = items.filter((product) => productSearchText(product).includes(query));
  }

  return items;
}

export function getDesignProductGroups(): { group: StudioProductGroup; products: StudioProduct[] }[] {
  return STUDIO_DESIGN_GROUPS.map((group) => ({
    group,
    products: STUDIO_DESIGN_PRODUCTS.filter((product) => product.groupId === group.id),
  })).filter((entry) => entry.products.length > 0);
}

export function getStudioProduct(id: string): StudioProduct | undefined {
  return ALL_STUDIO_PRODUCTS.find((product) => product.id === id);
}

export function studioProductHref(product: StudioProduct): string {
  const params = new URLSearchParams({
    section: product.section,
    type: product.id,
  });
  return `/studio?${params.toString()}`;
}

export function studioSectionHref(section: StudioSection): string {
  return `/studio?section=${section}`;
}

export type StudioPanel = 'design' | 'print' | 'my-work' | 'account';

export function resolveStudioPanel(
  pathname: string,
  sectionParam: string,
  productType: string,
): StudioPanel {
  if (
    pathname.startsWith('/studio/pricing') ||
    pathname.startsWith('/studio/account') ||
    pathname.startsWith('/studio/cart') ||
    pathname === '/login'
  ) {
    return 'account';
  }

  if (pathname.startsWith('/studio/projects')) return 'my-work';

  if (pathname.startsWith('/studio/print')) return 'print';

  if (sectionParam === 'print') return 'print';
  if (sectionParam === 'design') return 'design';

  if (productType) {
    const product = getStudioProduct(productType);
    if (product?.section === 'print') return 'print';
    if (product) return 'design';
  }

  if (pathname === '/studio') return 'design';

  return 'design';
}

export function isStudioProductActive(
  pathname: string,
  activeType: string,
  productId: string,
): boolean {
  return pathname === '/studio' && activeType === productId;
}

export function isStudioSectionActive(
  pathname: string,
  sectionParam: string,
  productType: string,
  target: StudioPanel,
): boolean {
  return resolveStudioPanel(pathname, sectionParam, productType) === target;
}
