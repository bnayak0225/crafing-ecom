import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

const load = (file) => JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));

let templates = load('templates.json');
let categories = load('categories.json');
let projects = load('projects.json');
const users = load('users.json');
const cart = load('cart.json');
const orders = load('orders.json');
const formats = load('formats.json');
const pricing = load('pricing.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const paginate = (items, page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const start = (p - 1) * l;
  return {
    data: items.slice(start, start + l),
    meta: { page: p, limit: l, total: items.length, totalPages: Math.ceil(items.length / l) },
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cafing-api', timestamp: new Date().toISOString() });
});

app.get('/api/templates', async (req, res) => {
  await delay();
  let result = [...templates];
  const { category, tag, search, premium, sort } = req.query;

  if (category) result = result.filter((t) => t.category === category);
  if (tag) result = result.filter((t) => t.tags.includes(tag));
  if (premium === 'true') result = result.filter((t) => t.premium);
  if (premium === 'false') result = result.filter((t) => !t.premium);
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (sort === 'popular') result.sort((a, b) => b.uses - a.uses);
  if (sort === 'newest') result.reverse();

  res.json(paginate(result, req.query.page, req.query.limit));
});

app.get('/api/templates/:id', async (req, res) => {
  await delay(80);
  const template = templates.find((t) => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

app.get('/api/categories', async (_req, res) => {
  await delay(60);
  res.json({ data: categories });
});

app.get('/api/categories/:id', async (req, res) => {
  await delay(60);
  const category = categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const categoryTemplates = templates.filter((t) => t.category === category.id);
  res.json({ ...category, templates: categoryTemplates });
});

app.get('/api/projects', async (req, res) => {
  await delay();
  res.json(paginate(projects, req.query.page, req.query.limit));
});

app.get('/api/projects/:id', async (req, res) => {
  await delay(80);
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', async (req, res) => {
  await delay(150);
  const { title, templateId, width, height } = req.body || {};
  const template = templateId ? templates.find((t) => t.id === templateId) : null;
  const project = {
    id: `proj-${Date.now()}`,
    title: title || template?.title || 'Untitled Design',
    templateId: templateId || null,
    thumbnail: template?.thumbnail || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    width: width || template?.width || 1080,
    height: height || template?.height || 1080,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(project);
  res.status(201).json(project);
});

app.delete('/api/projects/:id', async (req, res) => {
  await delay(100);
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  const [removed] = projects.splice(idx, 1);
  res.json(removed);
});

app.get('/api/users/me', async (_req, res) => {
  await delay(80);
  res.json(users[0]);
});

app.post('/api/auth/login', async (req, res) => {
  await delay(200);
  const email = String(req.body?.email || '').trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === email) || users[0];
  res.json({
    user,
    token: 'demo-session-token',
    message: 'Demo login — any password works if the email matches a demo user.',
  });
});

app.get('/api/cart', async (_req, res) => {
  await delay(100);
  const items = cart.filter((item) => item.userId === users[0].id);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({
    data: items,
    summary: {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(subtotal * 0.08 * 100) / 100,
      total: Math.round(subtotal * 1.08 * 100) / 100,
      currency: 'USD',
      itemCount: items.reduce((n, item) => n + item.quantity, 0),
    },
  });
});

app.get('/api/orders', async (_req, res) => {
  await delay(120);
  const userOrders = orders
    .filter((o) => o.userId === users[0].id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ data: userOrders });
});

app.get('/api/formats', async (_req, res) => {
  await delay(50);
  res.json({ data: formats });
});

app.get('/api/pricing', async (_req, res) => {
  await delay(50);
  res.json({ data: pricing });
});

app.get('/api/search', async (req, res) => {
  await delay();
  const q = String(req.query.q || '').toLowerCase();
  if (!q) return res.json({ templates: [], categories: [] });

  const matchedTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
  const matchedCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );
  res.json({ templates: matchedTemplates.slice(0, 8), categories: matchedCategories });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Cafing API running at http://localhost:${PORT}`);
});
