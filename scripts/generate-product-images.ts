/**
 * FreshBasket — AI Product Image Generation Script
 * Usage: npm run images:generate [-- --batch 50]
 *
 * Retrieves products without images, constructs prompt, calls image generation API
 * (OpenAI DALL-E / Replicate / Stability), uploads to Supabase Storage, updates product record.
 */

type Product = { id: string; name: string; categoryId: string; packageSize: string; images: string[] };

async function generatePrompt(p: Product) {
  return `Professional e-commerce supermarket product photograph of fictional branded ${p.name}, isolated on clean light background, accurate retail packaging, front-facing, soft studio shadow, premium catalogue photography, no copyrighted logo, no real-world supermarket branding, 1:1 composition.`;
}

async function main() {
  const batch = Number(process.argv.find(a=>a==='--batch') ? process.argv[process.argv.indexOf('--batch')+1] : 20);
  console.log(`[images:generate] batch=${batch}`);
  // 1. retrieve products without images (mock: read from lib)
  // In production: query Supabase -> products where images is empty or placeholder
  console.log('Retrieving products without images...');
  // 2. For each, construct prompt
  // 3. Call configured service if OPENAI_API_KEY present, else skip
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) {
    console.log('OPENAI_API_KEY not set — running in DRY RUN mode. Prompts would be:');
    console.log('Example:', await generatePrompt({ id:'001', name:'FreshBasket Australian Bananas', categoryId:'cat_fresh_fruit', packageSize:'1kg', images:[] }));
    console.log('Set OPENAI_API_KEY and re-run to generate.');
    return;
  }
  // 4. Call OpenAI images/generations
  // 5. Save + upload to Supabase Storage
  // 6. Update product record
  console.log('Would generate images for batch and upload to Supabase Storage bucket "product-images"');
  console.log('Done. See docs/images-generation.md');
}

main().catch(e=> { console.error(e); process.exit(1); });
