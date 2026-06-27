import {
  getCrafingApiBearerToken,
  getCrafingGraphqlUrl,
} from './crafing-api-base';

export interface UserWorkListItem {
  id: string;
  name: string;
  templateId: string;
  themeId: string | null;
  /** Cover from page 0 (saved via updateWork). */
  thumbnail: string | null;
  /** Template catalog image — fallback when thumbnail is empty. */
  thumbnailUrl: string | null;
  width: number;
  height: number;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
  error?: { code?: string; message?: string };
}

export class CrafingAuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'CrafingAuthError';
  }
}

const WORK_LIST_QUERY = `
  query WorkList {
    workList {
      id
      name
      templateId
      themeId
      thumbnail
      thumbnailUrl
      width
      height
      pageCount
      createdAt
      updatedAt
    }
  }
`;

const CREATE_BLANK_WORK = `
  mutation CreateBlankWork($input: CreateBlankWorkInput) {
    createBlankWork(input: $input) {
      id
      name
      templateId
      themeId
      thumbnail
      thumbnailUrl
      width
      height
      pageCount
      createdAt
      updatedAt
    }
  }
`;

const DELETE_WORK = `
  mutation DeleteWork($id: ID!) {
    deleteWork(id: $id)
  }
`;

const DEFAULT_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_ID?.trim() || 'tpl-print';

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop';

async function crafingGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(getCrafingGraphqlUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getCrafingApiBearerToken()}`,
    },
    cache: 'no-store',
    body: JSON.stringify({ query, variables }),
  });

  let json: GraphQLResponse<T>;
  try {
    json = (await res.json()) as GraphQLResponse<T>;
  } catch {
    throw new Error(`Crafing GraphQL: invalid JSON (${res.status})`);
  }

  if (json.error) {
    if (json.error.code === 'UNAUTHORIZED') {
      throw new CrafingAuthError(json.error.message);
    }
    throw new Error(json.error.message || `Crafing API error: ${json.error.code || res.status}`);
  }

  if (!res.ok) {
    throw new Error(`Crafing GraphQL HTTP ${res.status}`);
  }

  if (json.errors?.length) {
    const authError = json.errors.find(
      (entry) =>
        entry.extensions?.code === 'UNAUTHENTICATED' ||
        entry.message.toLowerCase().includes('authentication'),
    );
    if (authError) {
      throw new CrafingAuthError(authError.message);
    }
    throw new Error(json.errors.map((entry) => entry.message).filter(Boolean).join('; '));
  }

  if (!json.data) throw new Error('Crafing GraphQL response missing data');
  return json.data;
}

function sortByUpdatedAt(items: UserWorkListItem[]): UserWorkListItem[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/** Saved designs list — crafing/api GraphQL. */
export const crafingGraphql = {
  fetchWorkList: async (): Promise<UserWorkListItem[]> => {
    const data = await crafingGraphqlRequest<{ workList: UserWorkListItem[] }>(WORK_LIST_QUERY);
    return sortByUpdatedAt(data.workList);
  },

  createBlankWork: (input: { name?: string; templateId?: string } = {}) =>
    crafingGraphqlRequest<{ createBlankWork: UserWorkListItem }>(CREATE_BLANK_WORK, {
      input: {
        name: input.name ?? 'Untitled',
        templateId: input.templateId ?? DEFAULT_TEMPLATE_ID,
      },
    }).then((data) => data.createBlankWork),

  deleteWork: (id: string) =>
    crafingGraphqlRequest<{ deleteWork: boolean }>(DELETE_WORK, { id }).then(
      (data) => data.deleteWork,
    ),
};

export function workListThumbnail(work: UserWorkListItem): string {
  return work.thumbnail || work.thumbnailUrl || FALLBACK_THUMBNAIL;
}
