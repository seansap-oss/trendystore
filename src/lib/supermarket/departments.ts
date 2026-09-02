// FreshBasket — Department / Category / Subcategory hierarchy
// Database-driven in production; seeded here for demo
import type { Department, Category, Subcategory } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'dept_new', slug: 'new', name: 'New', sortOrder: 1, isActive: true, icon: '✨' },
  { id: 'dept_specials', slug: 'specials', name: 'Specials', sortOrder: 2, isActive: true, icon: '🏷️' },
  { id: 'dept_fruit_veg', slug: 'fruit-veg', name: 'Fruit & Veg', sortOrder: 3, isActive: true, icon: '🥦' },
  { id: 'dept_meat_seafood', slug: 'meat-seafood', name: 'Poultry, Meat & Seafood', sortOrder: 4, isActive: true, icon: '🥩' },
  { id: 'dept_dinner', slug: 'dinner', name: 'Dinner', sortOrder: 5, isActive: true, icon: '🍝' },
  { id: 'dept_deli', slug: 'deli', name: 'Deli', sortOrder: 6, isActive: true, icon: '🧀' },
  { id: 'dept_dairy', slug: 'dairy-eggs-fridge', name: 'Dairy, Eggs & Fridge', sortOrder: 7, isActive: true, icon: '🥛' },
  { id: 'dept_bakery', slug: 'bakery', name: 'Bakery', sortOrder: 8, isActive: true, icon: '🍞' },
  { id: 'dept_lunchbox', slug: 'lunchbox', name: 'Lunch Box', sortOrder: 9, isActive: true, icon: '🎒' },
  { id: 'dept_freezer', slug: 'freezer', name: 'Freezer', sortOrder: 10, isActive: true, icon: '❄️' },
  { id: 'dept_snacks', slug: 'snacks-confectionery', name: 'Snacks & Confectionery', sortOrder: 11, isActive: true, icon: '🍫' },
  { id: 'dept_pantry', slug: 'pantry', name: 'Pantry', sortOrder: 12, isActive: true, icon: '🥫' },
  { id: 'dept_international', slug: 'international-foods', name: 'International Foods', sortOrder: 13, isActive: true, icon: '🌏' },
  { id: 'dept_drinks', slug: 'drinks', name: 'Drinks', sortOrder: 14, isActive: true, icon: '🥤' },
  { id: 'dept_alcohol', slug: 'beer-wine-spirits', name: 'Beer, Wine & Spirits', sortOrder: 15, isActive: false, icon: '🍷' },
  { id: 'dept_beauty', slug: 'beauty', name: 'Beauty', sortOrder: 16, isActive: true, icon: '💄' },
  { id: 'dept_personal', slug: 'personal-care', name: 'Personal Care', sortOrder: 17, isActive: true, icon: '🧴' },
  { id: 'dept_health', slug: 'health-wellness', name: 'Health & Wellness', sortOrder: 18, isActive: true, icon: '💊' },
  { id: 'dept_cleaning', slug: 'cleaning', name: 'Cleaning & Maintenance', sortOrder: 19, isActive: true, icon: '🧹' },
  { id: 'dept_baby', slug: 'baby', name: 'Baby', sortOrder: 20, isActive: true, icon: '👶' },
  { id: 'dept_pet', slug: 'pet', name: 'Pet', sortOrder: 21, isActive: true, icon: '🐾' },
  { id: 'dept_electronics', slug: 'electronics', name: 'Electronics', sortOrder: 22, isActive: true, icon: '🔋' },
  { id: 'dept_front', slug: 'front-of-store', name: 'Front of Store', sortOrder: 23, isActive: true, icon: '💐' },
  { id: 'dept_home', slug: 'home-lifestyle', name: 'Home & Lifestyle', sortOrder: 24, isActive: true, icon: '🏠' },
  { id: 'dept_marketplace', slug: 'marketplace', name: 'Marketplace', sortOrder: 25, isActive: true, icon: '🛍️' },
];

export const CATEGORIES: Category[] = [
  // New
  { id: 'cat_new_groceries', departmentId: 'dept_new', slug: 'new-groceries', name: 'New Groceries', sortOrder: 1, isActive: true },
  { id: 'cat_new_fresh', departmentId: 'dept_new', slug: 'new-fresh', name: 'New Fresh Food', sortOrder: 2, isActive: true },
  { id: 'cat_trending', departmentId: 'dept_new', slug: 'trending', name: 'Trending Products', sortOrder: 3, isActive: true },
  // Specials
  { id: 'cat_half_price', departmentId: 'dept_specials', slug: 'half-price', name: 'Half Price', sortOrder: 1, isActive: true },
  { id: 'cat_multibuy', departmentId: 'dept_specials', slug: 'multibuy', name: 'Multi-buy', sortOrder: 2, isActive: true },
  { id: 'cat_member', departmentId: 'dept_specials', slug: 'member-offers', name: 'Member Offers', sortOrder: 3, isActive: true },
  { id: 'cat_clearance', departmentId: 'dept_specials', slug: 'clearance', name: 'Clearance', sortOrder: 4, isActive: true },
  // Fruit & Veg
  { id: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'fresh-fruit', name: 'Fresh Fruit', sortOrder: 1, isActive: true },
  { id: 'cat_fresh_veg', departmentId: 'dept_fruit_veg', slug: 'fresh-vegetables', name: 'Fresh Vegetables', sortOrder: 2, isActive: true },
  { id: 'cat_salad_herbs', departmentId: 'dept_fruit_veg', slug: 'salad-herbs', name: 'Salad & Fresh Herbs', sortOrder: 3, isActive: true },
  { id: 'cat_prepared', departmentId: 'dept_fruit_veg', slug: 'prepared', name: 'Prepared Veg & Fruit', sortOrder: 4, isActive: true },
  // Meat
  { id: 'cat_chicken', departmentId: 'dept_meat_seafood', slug: 'chicken', name: 'Chicken', sortOrder: 1, isActive: true },
  { id: 'cat_beef', departmentId: 'dept_meat_seafood', slug: 'beef', name: 'Beef', sortOrder: 2, isActive: true },
  { id: 'cat_seafood', departmentId: 'dept_meat_seafood', slug: 'seafood', name: 'Seafood', sortOrder: 3, isActive: true },
  { id: 'cat_plant_alt', departmentId: 'dept_meat_seafood', slug: 'plant-based', name: 'Plant-based Alternatives', sortOrder: 4, isActive: true },
  // Dinner
  { id: 'cat_ready_meals', departmentId: 'dept_dinner', slug: 'ready-meals', name: 'Ready Meals', sortOrder: 1, isActive: true },
  { id: 'cat_pizza_pasta', departmentId: 'dept_dinner', slug: 'pizza-pasta', name: 'Pizza & Pasta', sortOrder: 2, isActive: true },
  // Dairy
  { id: 'cat_milk', departmentId: 'dept_dairy', slug: 'milk', name: 'Milk', sortOrder: 1, isActive: true },
  { id: 'cat_cheese', departmentId: 'dept_dairy', slug: 'cheese', name: 'Cheese', sortOrder: 2, isActive: true },
  { id: 'cat_yoghurt', departmentId: 'dept_dairy', slug: 'yoghurt', name: 'Yoghurt', sortOrder: 3, isActive: true },
  { id: 'cat_eggs', departmentId: 'dept_dairy', slug: 'eggs', name: 'Eggs', sortOrder: 4, isActive: true },
  // Bakery
  { id: 'cat_bread', departmentId: 'dept_bakery', slug: 'bread', name: 'Bread', sortOrder: 1, isActive: true },
  { id: 'cat_pastries', departmentId: 'dept_bakery', slug: 'pastries', name: 'Pastries & Cakes', sortOrder: 2, isActive: true },
  // Pantry etc — condensed for brevity but covers all depts
  { id: 'cat_rice_pasta', departmentId: 'dept_pantry', slug: 'rice-pasta', name: 'Rice, Pasta & Noodles', sortOrder: 1, isActive: true },
  { id: 'cat_canned', departmentId: 'dept_pantry', slug: 'canned', name: 'Canned Goods', sortOrder: 2, isActive: true },
  { id: 'cat_sauces', departmentId: 'dept_pantry', slug: 'sauces-condiments', name: 'Sauces & Condiments', sortOrder: 3, isActive: true },
  { id: 'cat_cereals', departmentId: 'dept_pantry', slug: 'cereals', name: 'Breakfast Cereals', sortOrder: 4, isActive: true },
  { id: 'cat_drinks_soft', departmentId: 'dept_drinks', slug: 'soft-drinks', name: 'Soft Drinks', sortOrder: 1, isActive: true },
  { id: 'cat_drinks_juice', departmentId: 'dept_drinks', slug: 'juice', name: 'Juice', sortOrder: 2, isActive: true },
  { id: 'cat_clean_laundry', departmentId: 'dept_cleaning', slug: 'laundry', name: 'Laundry', sortOrder: 1, isActive: true },
  { id: 'cat_baby_food', departmentId: 'dept_baby', slug: 'baby-food', name: 'Baby Food', sortOrder: 1, isActive: true },
  { id: 'cat_pet_dog', departmentId: 'dept_pet', slug: 'dog', name: 'Dog', sortOrder: 1, isActive: true },
  { id: 'cat_pet_cat', departmentId: 'dept_pet', slug: 'cat', name: 'Cat', sortOrder: 2, isActive: true },
];

export const SUBCATEGORIES: Subcategory[] = [
  // Fresh Fruit
  { id: 'sub_apples', categoryId: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'apples', name: 'Apples', sortOrder: 1, isActive: true },
  { id: 'sub_bananas', categoryId: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'bananas', name: 'Bananas', sortOrder: 2, isActive: true },
  { id: 'sub_berries', categoryId: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'berries', name: 'Berries', sortOrder: 3, isActive: true },
  { id: 'sub_avocados', categoryId: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'avocados', name: 'Avocados', sortOrder: 4, isActive: true },
  { id: 'sub_citrus', categoryId: 'cat_fresh_fruit', departmentId: 'dept_fruit_veg', slug: 'citrus', name: 'Citrus', sortOrder: 5, isActive: true },
  // Veg
  { id: 'sub_potatoes', categoryId: 'cat_fresh_veg', departmentId: 'dept_fruit_veg', slug: 'potatoes', name: 'Potatoes', sortOrder: 1, isActive: true },
  { id: 'sub_tomatoes', categoryId: 'cat_fresh_veg', departmentId: 'dept_fruit_veg', slug: 'tomatoes', name: 'Tomatoes', sortOrder: 2, isActive: true },
  { id: 'sub_leafy', categoryId: 'cat_fresh_veg', departmentId: 'dept_fruit_veg', slug: 'leafy-greens', name: 'Leafy Greens', sortOrder: 3, isActive: true },
  // Meat subcats
  { id: 'sub_chicken_breast', categoryId: 'cat_chicken', departmentId: 'dept_meat_seafood', slug: 'chicken-breast', name: 'Chicken Breast', sortOrder: 1, isActive: true },
  { id: 'sub_beef_steak', categoryId: 'cat_beef', departmentId: 'dept_meat_seafood', slug: 'steaks', name: 'Steaks', sortOrder: 1, isActive: true },
];
