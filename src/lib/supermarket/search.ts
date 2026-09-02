import { PRODUCTS } from './products';

export const SYNONYMS: Record<string, string[]> = {
  'capsicum': ['bell pepper'],
  'coriander': ['cilantro'],
  'soft drink': ['soda', 'pop'],
  'aubergine': ['eggplant'],
  'courgette': ['zucchini'],
  'lollies': ['candy'],
  'mince': ['ground meat'],
  'chips': ['crisps'],
  'biscuits': ['cookies'],
};

export function normalize(str: string): string {
  return str.toLowerCase().trim();
}

export function expandSynonyms(term: string): string[] {
  const n = normalize(term);
  const results = [n];
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (n.includes(key)) {
      syns.forEach(s => results.push(n.replace(key, s)));
    }
    for (const s of syns) {
      if (n.includes(s)) results.push(n.replace(s, key));
    }
  }
  return [...new Set(results)];
}

// Simple fuzzy: Levenshtein distance <=2 or includes
function levenshtein(a: string, b: string): number {
  const m = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = m[0];
    m[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const temp = m[j+1];
      m[j+1] = Math.min(m[j+1]+1, m[j]+1, prev + (a[i] !== b[j] ? 1 : 0));
      prev = temp;
    }
  }
  return m[b.length];
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = normalize(query);
  const t = normalize(text);
  if (t.includes(q)) return true;
  // check words
  const words = t.split(/\s+/);
  return words.some(w => levenshtein(q, w) <= 2 || (q.length > 3 && w.includes(q.slice(0, -1))));
}

export function searchProducts(query: string) {
  if (!query.trim()) return PRODUCTS.slice(0, 20);
  const expanded = expandSynonyms(query);
  const terms = expanded.flatMap(e => e.split(/\s+/));
  return PRODUCTS.filter(p => {
    const hay = `${p.name} ${p.brandName} ${p.description} ${p.categoryId} ${p.packageSize}`.toLowerCase();
    return terms.some(t => fuzzyMatch(t, hay));
  });
}

export function getAutocomplete(query: string) {
  if (!query.trim() || query.length < 2) return { products: [], suggestions: [], categories: [] as string[] };
  const results = searchProducts(query).slice(0, 5);
  const suggestions = [...new Set(results.map(r => r.name.split(' ').slice(0,2).join(' ')))].slice(0,3);
  const categories = [...new Set(results.map(r => r.categoryId))].slice(0,3);
  return { products: results, suggestions, categories };
}
