import type { SupermarketProduct } from './types';

// Helper to create product
function p(overrides: Partial<SupermarketProduct> & Pick<SupermarketProduct, 'id'|'name'|'brandName'|'departmentId'|'categoryId'|'retailPrice'|'packageSize'|'images'>): SupermarketProduct {
  return {
    sku: `FB-${overrides.id.padStart(6,'0')}`,
    slug: overrides.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + overrides.id,
    description: overrides.description || `${overrides.name} — premium quality from ${overrides.brandName}.`,
    shortDescription: overrides.shortDescription || overrides.name,
    taxRate: 0.1,
    variableWeight: false,
    inStock: true,
    isSpecial: false,
    isNew: false,
    isFeatured: false,
    dietaryTags: [],
    allergenTags: [],
    packageUnit: overrides.packageSize.split(' ').pop() || 'each',
    unitPrice: overrides.retailPrice,
    brandId: 'brand_' + overrides.brandName.toLowerCase().replace(/\s+/g,'_'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as SupermarketProduct;
}

export const PRODUCTS: SupermarketProduct[] = [
  // FRUIT & VEG - Fresh Fruit
  p({ id:'001', name:'FreshBasket Australian Bananas', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_bananas', retailPrice:4.50, packageSize:'1kg', images:['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600'], description:'Sweet Australian Cavendish bananas, perfect for lunchboxes and smoothies.', variableWeight:true, estimatedWeight:1, minWeight:0.9, maxWeight:1.1, pricePerKg:4.50, unitPrice:4.50, healthStarRating:4.5 }),
  p({ id:'002', name:'Harvest Valley Pink Lady Apples 1kg', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_apples', retailPrice:6.50, packageSize:'1kg', images:['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600'], healthStarRating:4.5, variableWeight:false }),
  p({ id:'003', name:'FreshBasket Strawberries 250g', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_berries', retailPrice:5.00, packageSize:'250g', images:['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600'], isSpecial:true, specialPrice:3.50, healthStarRating:4 }),
  p({ id:'004', name:'Hass Avocados Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_avocados', retailPrice:2.20, packageSize:'each', images:['https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=600'], variableWeight:false }),
  p({ id:'005', name:'Navel Oranges 1kg', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_citrus', retailPrice:5.90, packageSize:'1kg', images:['https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=600'] }),
  p({ id:'006', name:'Blueberries 125g Punnet', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_berries', retailPrice:4.50, packageSize:'125g', images:['https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600'], isNew:true }),
  p({ id:'007', name:'Green Kiwifruit 4 Pack', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_citrus', retailPrice:4.00, packageSize:'4 pack', images:['https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=600'] }),
  p({ id:'008', name:'Mango Kensington Pride Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_fruit', subcategoryId:'sub_citrus', retailPrice:2.80, packageSize:'each', images:['https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'] }),

  // Fresh Veg
  p({ id:'009', name:'Brush Potatoes 2kg', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_potatoes', retailPrice:6.00, packageSize:'2kg', images:['https://images.unsplash.com/photo-1518977678668-bd60d396a11b?w=600'], variableWeight:false }),
  p({ id:'010', name:'Brown Onions 1kg', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_potatoes', retailPrice:3.50, packageSize:'1kg', images:['https://images.unsplash.com/photo-1508747703725-719777637510?w=600'] }),
  p({ id:'011', name:'Carrots 1kg', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_leafy', retailPrice:2.90, packageSize:'1kg', images:['https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600'] }),
  p({ id:'012', name:'Broccoli Head Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_leafy', retailPrice:3.20, packageSize:'each', images:['https://images.unsplash.com/photo-1459411621450-e34825549a3a?w=600'] }),
  p({ id:'013', name:'Truss Tomatoes 500g', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_tomatoes', retailPrice:5.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1592924357228-91a4da028fea?w=600'], isSpecial:true, specialPrice:3.90 }),
  p({ id:'014', name:'Baby Spinach 120g', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_salad_herbs', retailPrice:3.50, packageSize:'120g', images:['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600'] }),
  p({ id:'015', name:'Cucumber Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_leafy', retailPrice:1.80, packageSize:'each', images:['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600'] }),
  p({ id:'016', name:'Capsicum Red Each', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', subcategoryId:'sub_leafy', retailPrice:1.50, packageSize:'each', images:['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600'] }),

  // Meat & Seafood
  p({ id:'017', name:'North Farm Chicken Breast Fillets 500g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_chicken', subcategoryId:'sub_chicken_breast', retailPrice:9.90, packageSize:'500g', images:['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600'], variableWeight:true, estimatedWeight:0.5, pricePerKg:19.80 }),
  p({ id:'018', name:'Beef Rump Steak 400g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_beef', subcategoryId:'sub_beef_steak', retailPrice:14.00, packageSize:'400g', images:['https://images.unsplash.com/photo-1608039824140-39110f48e0c2?w=600'], variableWeight:true, estimatedWeight:0.4, pricePerKg:35 }),
  p({ id:'019', name:'Ocean Catch Atlantic Salmon Portions 500g', brandName:'Ocean Catch', departmentId:'dept_meat_seafood', categoryId:'cat_seafood', retailPrice:18.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600'], isFeatured:true }),
  p({ id:'020', name:'Pork Mince 500g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_beef', retailPrice:7.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600'], variableWeight:true, estimatedWeight:0.5, pricePerKg:15 }),
  p({ id:'021', name:'Ocean Catch Prawns Cooked 500g', brandName:'Ocean Catch', departmentId:'dept_meat_seafood', categoryId:'cat_seafood', retailPrice:22.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1565680018434-3188f78d8251?w=600'] }),
  p({ id:'022', name:'Plant-Based Burgers 4 Pack', brandName:'Greenfields', departmentId:'dept_meat_seafood', categoryId:'cat_plant_alt', retailPrice:8.50, packageSize:'4 pack', images:['https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600'], dietaryTags:['Vegan'] }),

  // Bakery
  p({ id:'023', name:'Golden Bake Sourdough Loaf 680g', brandName:'Golden Bake', departmentId:'dept_bakery', categoryId:'cat_bread', retailPrice:6.50, packageSize:'680g', images:['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600'] }),
  p({ id:'024', name:'White Bread Sliced 700g', brandName:'Golden Bake', departmentId:'dept_bakery', categoryId:'cat_bread', retailPrice:3.20, packageSize:'700g', images:['https://images.unsplash.com/photo-1549931319-a545dcf3d696?w=600'], isSpecial:true, specialPrice:2.00 }),
  p({ id:'025', name:'Croissants 4 Pack', brandName:'Golden Bake', departmentId:'dept_bakery', categoryId:'cat_pastries', retailPrice:6.00, packageSize:'4 pack', images:['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'] }),
  p({ id:'026', name:'Wraps Wholemeal 8 Pack', brandName:'Golden Bake', departmentId:'dept_bakery', categoryId:'cat_bread', retailPrice:4.50, packageSize:'8 pack', images:['https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600'] }),

  // Dairy
  p({ id:'027', name:'Daily Choice Full Cream Milk 2L', brandName:'Daily Choice', departmentId:'dept_dairy', categoryId:'cat_milk', retailPrice:3.60, packageSize:'2L', images:['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'], healthStarRating:3.5 }),
  p({ id:'028', name:'Sunrise Dairy Free Range Eggs 12 Pack', brandName:'Morning Grove', departmentId:'dept_dairy', categoryId:'cat_eggs', retailPrice:8.50, packageSize:'12 pack', images:['https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600'], isFeatured:true }),
  p({ id:'029', name:'Cheddar Cheese Block 500g', brandName:'Sunrise Dairy', departmentId:'dept_dairy', categoryId:'cat_cheese', retailPrice:7.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600'] }),
  p({ id:'030', name:'Greek Yoghurt 1kg', brandName:'Sunrise Dairy', departmentId:'dept_dairy', categoryId:'cat_yoghurt', retailPrice:5.90, packageSize:'1kg', images:['https://images.unsplash.com/photo-1488477181946-64290103bb53?w=600'] }),
  p({ id:'031', name:'Butter 250g', brandName:'Sunrise Dairy', departmentId:'dept_dairy', categoryId:'cat_cheese', retailPrice:4.80, packageSize:'250g', images:['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600'] }),
  p({ id:'032', name:'Oat Milk 1L', brandName:'Pure Pantry', departmentId:'dept_dairy', categoryId:'cat_milk', retailPrice:4.50, packageSize:'1L', images:['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'], dietaryTags:['Vegan','Dairy Free'] }),
  p({ id:'033', name:'Strawberry Yoghurt 6 Pack', brandName:'Sunrise Dairy', departmentId:'dept_dairy', categoryId:'cat_yoghurt', retailPrice:6.50, packageSize:'6 pack', images:['https://images.unsplash.com/photo-1488477181946-64290103bb53?w=600'] }),

  // Pantry
  p({ id:'034', name:'Kitchen Lane Penne Pasta 500g', brandName:'Kitchen Lane', departmentId:'dept_pantry', categoryId:'cat_rice_pasta', retailPrice:2.20, packageSize:'500g', images:['https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600'] }),
  p({ id:'035', name:'Basmati Rice 2kg', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_rice_pasta', retailPrice:6.90, packageSize:'2kg', images:['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'] }),
  p({ id:'036', name:'Canned Tomatoes 400g', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_canned', retailPrice:1.50, packageSize:'400g', images:['https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600'] }),
  p({ id:'037', name:'Olive Oil Extra Virgin 500ml', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_sauces', retailPrice:9.50, packageSize:'500ml', images:['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600'] }),
  p({ id:'038', name:'Honey 500g', brandName:'Harvest Valley', departmentId:'dept_pantry', categoryId:'cat_sauces', retailPrice:7.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'] }),
  p({ id:'039', name:'Peanut Butter Smooth 375g', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_sauces', retailPrice:4.50, packageSize:'375g', images:['https://images.unsplash.com/photo-1474440690486-0a34d1dd6d07?w=600'] }),
  p({ id:'040', name:'Weet-Bix 750g', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_cereals', retailPrice:5.20, packageSize:'750g', images:['https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600'], healthStarRating:5 }),
  p({ id:'041', name:'Instant Coffee 200g', brandName:'Kitchen Lane', departmentId:'dept_pantry', categoryId:'cat_cereals', retailPrice:8.00, packageSize:'200g', images:['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600'] }),
  p({ id:'042', name:'Green Tea Bags 100 Pack', brandName:'Pure Pantry', departmentId:'dept_pantry', categoryId:'cat_cereals', retailPrice:6.00, packageSize:'100 pack', images:['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600'] }),

  // Snacks
  p({ id:'043', name:'Potato Chips Sea Salt 175g', brandName:'Daily Choice', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:4.00, packageSize:'175g', images:['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600'], isSpecial:true, specialPrice:2.00 }),
  p({ id:'044', name:'Milk Chocolate Block 180g', brandName:'Daily Choice', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:5.50, packageSize:'180g', images:['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] }),
  p({ id:'045', name:'Mixed Nuts 500g', brandName:'Pure Pantry', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:9.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600'], dietaryTags:['Vegan'] }),
  p({ id:'046', name:'Popcorn Butter 100g', brandName:'Daily Choice', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:3.00, packageSize:'100g', images:['https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600'] }),

  // Drinks
  p({ id:'047', name:'Cola Soft Drink 1.25L', brandName:'Cola Co', departmentId:'dept_drinks', categoryId:'cat_drinks_soft', retailPrice:2.80, packageSize:'1.25L', images:['https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600'] }),
  p({ id:'048', name:'Orange Juice 2L', brandName:'FreshBasket', departmentId:'dept_drinks', categoryId:'cat_drinks_juice', retailPrice:5.50, packageSize:'2L', images:['https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600'] }),
  p({ id:'049', name:'Sparkling Water 500ml', brandName:'Alpine Springs', departmentId:'dept_drinks', categoryId:'cat_drinks_soft', retailPrice:1.50, packageSize:'500ml', images:['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600'] }),
  p({ id:'050', name:'Energy Drink 500ml', brandName:'Cola Co', departmentId:'dept_drinks', categoryId:'cat_drinks_soft', retailPrice:3.50, packageSize:'500ml', images:['https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=600'] }),

  // Cleaning
  p({ id:'051', name:'HomeBright Laundry Liquid 2L', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:12.00, packageSize:'2L', images:['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600'] }),
  p({ id:'052', name:'Dishwasher Tablets 30 Pack', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:14.50, packageSize:'30 pack', images:['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600'] }),
  p({ id:'053', name:'Toilet Paper 12 Pack', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:10.00, packageSize:'12 pack', images:['https://images.unsplash.com/photo-1584305574586-0d33cfaf15f7?w=600'] }),
  p({ id:'054', name:'Paper Towel 6 Pack', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:8.50, packageSize:'6 pack', images:['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600'] }),

  // Baby
  p({ id:'055', name:'LittleSprout Baby Wipes 80 Pack', brandName:'LittleSprout', departmentId:'dept_baby', categoryId:'cat_baby_food', retailPrice:6.00, packageSize:'80 pack', images:['https://images.unsplash.com/photo-1511948374796-da53471d73d8?w=600'] }),
  p({ id:'056', name:'Baby Formula Stage 1 900g', brandName:'LittleSprout', departmentId:'dept_baby', categoryId:'cat_baby_food', retailPrice:28.00, packageSize:'900g', images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600'] }),
  p({ id:'057', name:'Nappies Size 3 60 Pack', brandName:'LittleSprout', departmentId:'dept_baby', categoryId:'cat_baby_food', retailPrice:32.00, packageSize:'60 pack', images:['https://images.unsplash.com/photo-1522771930-78848d9293e4?w=600'] }),

  // Pet
  p({ id:'058', name:'Paw & Whisker Chicken Dog Food 1.5kg', brandName:'Paw & Whisker', departmentId:'dept_pet', categoryId:'cat_pet_dog', retailPrice:18.00, packageSize:'1.5kg', images:['https://images.unsplash.com/photo-1589924691997-abdc5d0bf630?w=600'] }),
  p({ id:'059', name:'Cat Tuna Pouches 12 Pack', brandName:'Paw & Whisker', departmentId:'dept_pet', categoryId:'cat_pet_cat', retailPrice:12.00, packageSize:'12 pack', images:['https://images.unsplash.com/photo-1571873735615-1ae72b963024?w=600'] }),
  p({ id:'060', name:'Cat Litter 10L', brandName:'Paw & Whisker', departmentId:'dept_pet', categoryId:'cat_pet_cat', retailPrice:15.00, packageSize:'10L', images:['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600'] }),

  // Freezer
  p({ id:'061', name:'Frozen Peas 500g', brandName:'FreshBasket', departmentId:'dept_freezer', categoryId:'cat_half_price', retailPrice:3.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1589923188651-268a9765e432?w=600'] }),
  p({ id:'062', name:'Frozen Pizza Pepperoni 500g', brandName:'Kitchen Lane', departmentId:'dept_freezer', categoryId:'cat_half_price', retailPrice:7.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'] }),
  p({ id:'063', name:'Vanilla Ice Cream 2L', brandName:'Sunrise Dairy', departmentId:'dept_freezer', categoryId:'cat_half_price', retailPrice:8.50, packageSize:'2L', images:['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600'], isSpecial:true, specialPrice:5.00 }),

  // Personal / Beauty / Health
  p({ id:'064', name:'Shampoo 500ml', brandName:'HomeBright', departmentId:'dept_personal', categoryId:'cat_half_price', retailPrice:7.00, packageSize:'500ml', images:['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'] }),
  p({ id:'065', name:'Toothpaste 100g', brandName:'HomeBright', departmentId:'dept_personal', categoryId:'cat_half_price', retailPrice:4.50, packageSize:'100g', images:['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600'] }),
  p({ id:'066', name:'Vitamin C 60 Tablets', brandName:'Pure Pantry', departmentId:'dept_health', categoryId:'cat_half_price', retailPrice:12.00, packageSize:'60 pack', images:['https://images.unsplash.com/photo-1471864190281-a93a3070b6de8?w=600'] }),

  // International
  p({ id:'067', name:'Soy Sauce 500ml', brandName:'Spice Route', departmentId:'dept_international', categoryId:'cat_half_price', retailPrice:4.50, packageSize:'500ml', images:['https://images.unsplash.com/photo-1581922814484-0b48460b7010?w=600'] }),
  p({ id:'068', name:'Basmati Rice Indian 1kg', brandName:'Spice Route', departmentId:'dept_international', categoryId:'cat_half_price', retailPrice:5.50, packageSize:'1kg', images:['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'] }),
  p({ id:'069', name:'Tortillas 8 Pack', brandName:'Spice Route', departmentId:'dept_international', categoryId:'cat_half_price', retailPrice:4.00, packageSize:'8 pack', images:['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'] }),

  // Home & Lifestyle
  p({ id:'070', name:'Kitchen Paper Towels 4 Pack', brandName:'HomeBright', departmentId:'dept_home', categoryId:'cat_half_price', retailPrice:6.50, packageSize:'4 pack', images:['https://images.unsplash.com/photo-1582735689369-4a4d6b8e5c24?w=600'] }),
  p({ id:'071', name:'Batteries AA 12 Pack', brandName:'HomeBright', departmentId:'dept_electronics', categoryId:'cat_half_price', retailPrice:12.00, packageSize:'12 pack', images:['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'] }),

  // Additional filler to reach 100+
  p({ id:'072', name:'Lettuce Iceberg Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_salad_herbs', retailPrice:3.00, packageSize:'each', images:['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600'] }),
  p({ id:'073', name:'Mushrooms 200g', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', retailPrice:3.80, packageSize:'200g', images:['https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600'] }),
  p({ id:'074', name:'Zucchini Each', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', retailPrice:0.90, packageSize:'each', images:['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600'] }),
  p({ id:'075', name:'Sweet Potato 1kg', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', retailPrice:3.90, packageSize:'1kg', images:['https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600'] }),
  p({ id:'076', name:'Bacon Streaky 250g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_beef', retailPrice:7.00, packageSize:'250g', images:['https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600'] }),
  p({ id:'077', name:'Sausages Beef 500g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_beef', retailPrice:6.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600'] }),
  p({ id:'078', name:'Tuna in Olive Oil 185g', brandName:'Ocean Catch', departmentId:'dept_pantry', categoryId:'cat_canned', retailPrice:3.50, packageSize:'185g', images:['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'] }),
  p({ id:'079', name:'Sourdough Rolls 4 Pack', brandName:'Golden Bake', departmentId:'dept_bakery', categoryId:'cat_bread', retailPrice:5.00, packageSize:'4 pack', images:['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600'] }),
  p({ id:'080', name:'Chocolate Biscuits 200g', brandName:'Daily Choice', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:3.80, packageSize:'200g', images:['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600'] }),
  p({ id:'081', name:'Coconut Water 330ml', brandName:'Alpine Springs', departmentId:'dept_drinks', categoryId:'cat_drinks_juice', retailPrice:2.50, packageSize:'330ml', images:['https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=600'] }),
  p({ id:'082', name:'Laundry Capsules 26 Pack', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:16.00, packageSize:'26 pack', images:['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600'] }),
  p({ id:'083', name:'Baby Puree Apple 120g', brandName:'LittleSprout', departmentId:'dept_baby', categoryId:'cat_baby_food', retailPrice:1.80, packageSize:'120g', images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600'] }),
  p({ id:'084', name:'Dog Treats 200g', brandName:'Paw & Whisker', departmentId:'dept_pet', categoryId:'cat_pet_dog', retailPrice:6.50, packageSize:'200g', images:['https://images.unsplash.com/photo-1589924691997-abdc5d0bf630?w=600'] }),
  p({ id:'085', name:'Frozen Berries 500g', brandName:'FreshBasket', departmentId:'dept_freezer', categoryId:'cat_half_price', retailPrice:6.50, packageSize:'500g', images:['https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600'] }),
  p({ id:'086', name:'Hand Wash 300ml', brandName:'HomeBright', departmentId:'dept_personal', categoryId:'cat_half_price', retailPrice:4.00, packageSize:'300ml', images:['https://images.unsplash.com/photo-1584305574586-0d33cfaf15f7?w=600'] }),
  p({ id:'087', name:'Sunscreen SPF50 200ml', brandName:'HomeBright', departmentId:'dept_beauty', categoryId:'cat_half_price', retailPrice:14.00, packageSize:'200ml', images:['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'] }),
  p({ id:'088', name:'Pain Relief Tablets 24 Pack', brandName:'Pure Pantry', departmentId:'dept_health', categoryId:'cat_half_price', retailPrice:6.50, packageSize:'24 pack', images:['https://images.unsplash.com/photo-1471864190281-a93a3070b6de8?w=600'] }),
  p({ id:'089', name:'Ramen Noodles 5 Pack', brandName:'Spice Route', departmentId:'dept_international', categoryId:'cat_half_price', retailPrice:5.00, packageSize:'5 pack', images:['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600'] }),
  p({ id:'090', name:'Kombucha Ginger 330ml', brandName:'Alpine Springs', departmentId:'dept_drinks', categoryId:'cat_drinks_juice', retailPrice:3.80, packageSize:'330ml', images:['https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600'] }),
  p({ id:'091', name:'Cauliflower Head Each', brandName:'FreshBasket', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', retailPrice:4.00, packageSize:'each', images:['https://images.unsplash.com/photo-1566842600177-97d3c9c9a0f1?w=600'] }),
  p({ id:'092', name:'Green Beans 250g', brandName:'Harvest Valley', departmentId:'dept_fruit_veg', categoryId:'cat_fresh_veg', retailPrice:3.50, packageSize:'250g', images:['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600'] }),
  p({ id:'093', name:'Lamb Chops 500g', brandName:'North Farm', departmentId:'dept_meat_seafood', categoryId:'cat_beef', retailPrice:16.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1546964052-d93311f80026?w=600'], variableWeight:true, estimatedWeight:0.5, pricePerKg:32 }),
  p({ id:'094', name:'Smoked Salmon 100g', brandName:'Ocean Catch', departmentId:'dept_meat_seafood', categoryId:'cat_seafood', retailPrice:8.50, packageSize:'100g', images:['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600'] }),
  p({ id:'095', name:'Margherita Pizza Family 500g', brandName:'Kitchen Lane', departmentId:'dept_dinner', categoryId:'cat_pizza_pasta', retailPrice:8.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'] }),
  p({ id:'096', name:'Hummus Classic 200g', brandName:'Pure Pantry', departmentId:'dept_deli', categoryId:'cat_half_price', retailPrice:4.00, packageSize:'200g', images:['https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?w=600'] }),
  p({ id:'097', name:'Long Life Milk 1L', brandName:'Daily Choice', departmentId:'dept_pantry', categoryId:'cat_cereals', retailPrice:2.00, packageSize:'1L', images:['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600'] }),
  p({ id:'098', name:'Crackers 200g', brandName:'Pure Pantry', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:3.50, packageSize:'200g', images:['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600'] }),
  p({ id:'099', name:'Muesli Bars 6 Pack', brandName:'Pure Pantry', departmentId:'dept_snacks', categoryId:'cat_half_price', retailPrice:5.00, packageSize:'6 pack', images:['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600'] }),
  p({ id:'100', name:'No Sugar Cola 375ml 6 Pack', brandName:'Cola Co', departmentId:'dept_drinks', categoryId:'cat_drinks_soft', retailPrice:7.50, packageSize:'6 pack', images:['https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600'] }),
  p({ id:'101', name:'Garbage Bags Large 30 Pack', brandName:'HomeBright', departmentId:'dept_cleaning', categoryId:'cat_clean_laundry', retailPrice:6.00, packageSize:'30 pack', images:['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600'] }),
  p({ id:'102', name:'Period Care 16 Pack', brandName:'HomeBright', departmentId:'dept_personal', categoryId:'cat_half_price', retailPrice:7.50, packageSize:'16 pack', images:['https://images.unsplash.com/photo-1584305574586-0d33cfaf15f7?w=600'] }),
  p({ id:'103', name:'Protein Powder Vanilla 500g', brandName:'Pure Pantry', departmentId:'dept_health', categoryId:'cat_half_price', retailPrice:32.00, packageSize:'500g', images:['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'] }),
  p({ id:'104', name:'Dog Food Beef 2kg', brandName:'Paw & Whisker', departmentId:'dept_pet', categoryId:'cat_pet_dog', retailPrice:22.00, packageSize:'2kg', images:['https://images.unsplash.com/photo-1589924691997-abdc5d0bf630?w=600'] }),
  p({ id:'105', name:'Flowers Bouquet Seasonal', brandName:'FreshBasket', departmentId:'dept_front', categoryId:'cat_half_price', retailPrice:25.00, packageSize:'each', images:['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600'] }),
];

export const getProductById = (id: string) => PRODUCTS.find(p => p.id === id);
export const getProductBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const getProductsByDepartment = (deptId: string) => PRODUCTS.filter(p => p.departmentId === deptId);
export const getProductsByCategory = (catId: string) => PRODUCTS.filter(p => p.categoryId === catId);
export const getSpecials = () => PRODUCTS.filter(p => p.isSpecial);
export const getFeatured = () => PRODUCTS.filter(p => p.isFeatured);
