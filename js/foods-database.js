/**
 * CalorieTracker - Foods Database
 * Base de datos de alimentos preestablecidos
 * Incluye alimentos comunes en Argentina y marcas comerciales
 */

const FoodsDatabase = {
    /**
     * Categories for filtering
     */
    categories: [
        { id: 'all', name: 'Todos', icon: '🍽️' },
        { id: 'fruits', name: 'Frutas', icon: '🍎' },
        { id: 'vegetables', name: 'Verduras', icon: '🥬' },
        { id: 'proteins', name: 'Proteínas', icon: '🥩' },
        { id: 'dairy', name: 'Lácteos', icon: '🥛' },
        { id: 'grains', name: 'Cereales', icon: '🌾' },
        { id: 'legumes', name: 'Legumbres', icon: '🫘' },
        { id: 'beverages', name: 'Bebidas', icon: '🥤' },
        { id: 'snacks', name: 'Snacks', icon: '🍿' },
        { id: 'prepared', name: 'Preparados', icon: '🍲' },
        { id: 'oils_condiments', name: 'Aceites y Condimentos', icon: '🫒' },
        { id: 'sweets', name: 'Dulces y Postres', icon: '🍰' },
        { id: 'supplements', name: 'Suplementos', icon: '💊' }
    ],

    /**
     * Sample foods database (valores por 100g/100ml)
     * En producción, esto se cargaría desde API externa
     */
    foods: [
        // ==========================================
        // Frutas
        // ==========================================
        {
            id: 'banana',
            name: 'Banana',
            category: 'fruits',
            calories: 89,
            protein: 1.1,
            carbs: 22.8,
            fat: 0.3,
            fiber: 2.6,
            servingSize: 120,
            unitWeight: 120
        },
        {
            id: 'apple',
            name: 'Manzana',
            category: 'fruits',
            calories: 52,
            protein: 0.3,
            carbs: 13.8,
            fat: 0.2,
            fiber: 2.4,
            servingSize: 180,
            unitWeight: 180
        },
        {
            id: 'orange',
            name: 'Naranja',
            category: 'fruits',
            calories: 47,
            protein: 0.9,
            carbs: 11.8,
            fat: 0.1,
            fiber: 2.4,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'strawberry',
            name: 'Frutilla',
            category: 'fruits',
            calories: 32,
            protein: 0.7,
            carbs: 7.7,
            fat: 0.3,
            fiber: 2.0,
            servingSize: 150,
            cupWeight: 150
        },
        {
            id: 'grape',
            name: 'Uva',
            category: 'fruits',
            calories: 69,
            protein: 0.7,
            carbs: 18.1,
            fat: 0.2,
            fiber: 0.9,
            servingSize: 100,
            cupWeight: 150
        },
        {
            id: 'watermelon',
            name: 'Sandía',
            category: 'fruits',
            calories: 30,
            protein: 0.6,
            carbs: 7.6,
            fat: 0.2,
            fiber: 0.4,
            servingSize: 200,
            cupWeight: 150
        },
        {
            id: 'pear',
            name: 'Pera',
            category: 'fruits',
            calories: 57,
            protein: 0.4,
            carbs: 15.2,
            fat: 0.1,
            fiber: 3.1,
            servingSize: 180,
            unitWeight: 180
        },

        // ==========================================
        // Verduras
        // ==========================================
        {
            id: 'tomato',
            name: 'Tomate',
            category: 'vegetables',
            calories: 18,
            protein: 0.9,
            carbs: 3.9,
            fat: 0.2,
            fiber: 1.2,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'lettuce',
            name: 'Lechuga',
            category: 'vegetables',
            calories: 15,
            protein: 1.4,
            carbs: 2.9,
            fat: 0.2,
            fiber: 1.3,
            servingSize: 50,
            cupWeight: 50
        },
        {
            id: 'carrot',
            name: 'Zanahoria',
            category: 'vegetables',
            calories: 41,
            protein: 0.9,
            carbs: 9.6,
            fat: 0.2,
            fiber: 2.8,
            servingSize: 80,
            unitWeight: 80
        },
        {
            id: 'onion',
            name: 'Cebolla',
            category: 'vegetables',
            calories: 40,
            protein: 1.1,
            carbs: 9.3,
            fat: 0.1,
            fiber: 1.7,
            servingSize: 100,
            unitWeight: 100
        },
        {
            id: 'potato',
            name: 'Papa',
            category: 'vegetables',
            calories: 77,
            protein: 2.0,
            carbs: 17.0,
            fat: 0.1,
            fiber: 2.2,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'sweet_potato',
            name: 'Batata / Boniato',
            category: 'vegetables',
            calories: 86,
            protein: 1.6,
            carbs: 20.1,
            fat: 0.1,
            fiber: 3.0,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'broccoli',
            name: 'Brócoli',
            category: 'vegetables',
            calories: 34,
            protein: 2.8,
            carbs: 6.6,
            fat: 0.4,
            fiber: 2.6,
            servingSize: 100,
            cupWeight: 90
        },
        {
            id: 'spinach',
            name: 'Espinaca',
            category: 'vegetables',
            calories: 23,
            protein: 2.9,
            carbs: 3.6,
            fat: 0.4,
            fiber: 2.2,
            servingSize: 50,
            cupWeight: 30
        },
        {
            id: 'avocado',
            name: 'Palta / Aguacate',
            category: 'vegetables',
            calories: 160,
            protein: 2.0,
            carbs: 8.5,
            fat: 14.7,
            fiber: 6.7,
            servingSize: 100,
            unitWeight: 150
        },

        // ==========================================
        // Proteínas
        // ==========================================
        {
            id: 'chicken_breast',
            name: 'Pechuga de pollo',
            category: 'proteins',
            calories: 165,
            protein: 31.0,
            carbs: 0,
            fat: 3.6,
            fiber: 0,
            servingSize: 150
        },
        {
            id: 'beef_steak',
            name: 'Bife de ternera',
            category: 'proteins',
            calories: 250,
            protein: 26.0,
            carbs: 0,
            fat: 15.0,
            fiber: 0,
            servingSize: 200
        },
        {
            id: 'ground_beef',
            name: 'Carne picada común',
            category: 'proteins',
            calories: 250,
            protein: 17.0,
            carbs: 0,
            fat: 20.0,
            fiber: 0,
            servingSize: 150
        },
        {
            id: 'ground_beef_lean',
            name: 'Carne picada magra',
            category: 'proteins',
            calories: 170,
            protein: 21.0,
            carbs: 0,
            fat: 10.0,
            fiber: 0,
            servingSize: 150
        },
        {
            id: 'pork_chop',
            name: 'Costilla de cerdo',
            category: 'proteins',
            calories: 250,
            protein: 25.0,
            carbs: 0,
            fat: 16.0,
            fiber: 0,
            servingSize: 150
        },
        {
            id: 'salmon',
            name: 'Salmón',
            category: 'proteins',
            calories: 208,
            protein: 20.0,
            carbs: 0,
            fat: 13.0,
            fiber: 0,
            servingSize: 150
        },
        {
            id: 'tuna',
            name: 'Atún (lata en agua)',
            category: 'proteins',
            calories: 116,
            protein: 26.0,
            carbs: 0,
            fat: 0.8,
            fiber: 0,
            servingSize: 100
        },
        {
            id: 'egg',
            name: 'Huevo',
            category: 'proteins',
            calories: 155,
            protein: 13.0,
            carbs: 1.1,
            fat: 11.0,
            fiber: 0,
            servingSize: 50,
            unitWeight: 50
        },
        {
            id: 'egg_white',
            name: 'Clara de huevo',
            category: 'proteins',
            calories: 52,
            protein: 11.0,
            carbs: 0.7,
            fat: 0.2,
            fiber: 0,
            servingSize: 33,
            unitWeight: 33
        },

        // ==========================================
        // Lácteos
        // ==========================================
        {
            id: 'milk_whole',
            name: 'Leche entera',
            category: 'dairy',
            calories: 61,
            protein: 3.2,
            carbs: 4.8,
            fat: 3.3,
            fiber: 0,
            servingSize: 200,
            cupWeight: 240
        },
        {
            id: 'milk_skim',
            name: 'Leche descremada',
            category: 'dairy',
            calories: 35,
            protein: 3.4,
            carbs: 5.0,
            fat: 0.1,
            fiber: 0,
            servingSize: 200,
            cupWeight: 240
        },
        {
            id: 'yogurt_natural',
            name: 'Yogur natural',
            category: 'dairy',
            calories: 59,
            protein: 3.5,
            carbs: 4.7,
            fat: 3.3,
            fiber: 0,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'yogurt_greek',
            name: 'Yogur griego',
            category: 'dairy',
            calories: 97,
            protein: 9.0,
            carbs: 3.6,
            fat: 5.0,
            fiber: 0,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'cheese_mozzarella',
            name: 'Queso mozzarella',
            category: 'dairy',
            calories: 280,
            protein: 28.0,
            carbs: 2.2,
            fat: 17.0,
            fiber: 0,
            servingSize: 30
        },
        {
            id: 'cheese_cheddar',
            name: 'Queso cheddar',
            category: 'dairy',
            calories: 403,
            protein: 25.0,
            carbs: 1.3,
            fat: 33.0,
            fiber: 0,
            servingSize: 30
        },
        {
            id: 'cheese_cream',
            name: 'Queso crema',
            category: 'dairy',
            calories: 342,
            protein: 6.0,
            carbs: 4.0,
            fat: 34.0,
            fiber: 0,
            servingSize: 30
        },
        {
            id: 'butter',
            name: 'Manteca',
            category: 'dairy',
            calories: 717,
            protein: 0.9,
            carbs: 0.1,
            fat: 81.0,
            fiber: 0,
            servingSize: 10
        },

        // ==========================================
        // Cereales y granos
        // ==========================================
        {
            id: 'rice_white',
            name: 'Arroz blanco (cocido)',
            category: 'grains',
            calories: 130,
            protein: 2.7,
            carbs: 28.0,
            fat: 0.3,
            fiber: 0.4,
            servingSize: 150,
            cupWeight: 185
        },
        {
            id: 'rice_brown',
            name: 'Arroz integral (cocido)',
            category: 'grains',
            calories: 111,
            protein: 2.6,
            carbs: 23.0,
            fat: 0.9,
            fiber: 1.8,
            servingSize: 150,
            cupWeight: 195
        },
        {
            id: 'pasta_cooked',
            name: 'Fideos/Pasta (cocidos)',
            category: 'grains',
            calories: 131,
            protein: 5.0,
            carbs: 25.0,
            fat: 1.1,
            fiber: 1.8,
            servingSize: 200,
            cupWeight: 140
        },
        {
            id: 'bread_white',
            name: 'Pan blanco',
            category: 'grains',
            calories: 265,
            protein: 9.0,
            carbs: 49.0,
            fat: 3.2,
            fiber: 2.7,
            servingSize: 30,
            unitWeight: 30
        },
        {
            id: 'bread_whole',
            name: 'Pan integral',
            category: 'grains',
            calories: 247,
            protein: 13.0,
            carbs: 41.0,
            fat: 4.2,
            fiber: 7.0,
            servingSize: 30,
            unitWeight: 30
        },
        {
            id: 'oats',
            name: 'Avena',
            category: 'grains',
            calories: 389,
            protein: 16.9,
            carbs: 66.3,
            fat: 6.9,
            fiber: 10.6,
            servingSize: 40,
            cupWeight: 80
        },
        {
            id: 'quinoa',
            name: 'Quinoa (cocida)',
            category: 'grains',
            calories: 120,
            protein: 4.4,
            carbs: 21.3,
            fat: 1.9,
            fiber: 2.8,
            servingSize: 100,
            cupWeight: 185
        },
        {
            id: 'tortilla_corn',
            name: 'Tortilla de maíz',
            category: 'grains',
            calories: 218,
            protein: 5.7,
            carbs: 44.6,
            fat: 2.8,
            fiber: 5.3,
            servingSize: 30,
            unitWeight: 30
        },

        // ==========================================
        // Bebidas
        // ==========================================
        {
            id: 'coffee_black',
            name: 'Café negro (sin azúcar)',
            category: 'beverages',
            calories: 2,
            protein: 0.3,
            carbs: 0,
            fat: 0,
            fiber: 0,
            servingSize: 240,
            cupWeight: 240
        },
        {
            id: 'tea_black',
            name: 'Té negro (sin azúcar)',
            category: 'beverages',
            calories: 1,
            protein: 0,
            carbs: 0.3,
            fat: 0,
            fiber: 0,
            servingSize: 240,
            cupWeight: 240
        },
        {
            id: 'orange_juice',
            name: 'Jugo de naranja',
            category: 'beverages',
            calories: 45,
            protein: 0.7,
            carbs: 10.4,
            fat: 0.2,
            fiber: 0.2,
            servingSize: 200,
            cupWeight: 240
        },
        {
            id: 'coca_cola',
            name: 'Coca-Cola',
            brand: 'Coca-Cola',
            category: 'beverages',
            calories: 42,
            protein: 0,
            carbs: 10.6,
            fat: 0,
            fiber: 0,
            servingSize: 330,
            unitWeight: 330
        },
        {
            id: 'coca_cola_zero',
            name: 'Coca-Cola Zero',
            brand: 'Coca-Cola',
            category: 'beverages',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            servingSize: 330,
            unitWeight: 330
        },

        // ==========================================
        // Snacks y otros
        // ==========================================
        {
            id: 'peanuts',
            name: 'Maní',
            category: 'snacks',
            calories: 567,
            protein: 25.8,
            carbs: 16.1,
            fat: 49.2,
            fiber: 8.5,
            servingSize: 30
        },
        {
            id: 'almonds',
            name: 'Almendras',
            category: 'snacks',
            calories: 579,
            protein: 21.2,
            carbs: 21.6,
            fat: 49.9,
            fiber: 12.5,
            servingSize: 30
        },
        {
            id: 'chocolate_dark',
            name: 'Chocolate negro 70%',
            category: 'snacks',
            calories: 598,
            protein: 7.8,
            carbs: 45.9,
            fat: 42.6,
            fiber: 10.9,
            servingSize: 30
        },
        {
            id: 'chips',
            name: 'Papas fritas',
            category: 'snacks',
            calories: 536,
            protein: 7.0,
            carbs: 53.0,
            fat: 35.0,
            fiber: 4.4,
            servingSize: 30
        },
        {
            id: 'protein_bar',
            name: 'Barra de proteína',
            category: 'snacks',
            calories: 200,
            protein: 20.0,
            carbs: 22.0,
            fat: 6.0,
            fiber: 3.0,
            servingSize: 60,
            unitWeight: 60
        },

        // ==========================================
        // Comidas preparadas
        // ==========================================
        {
            id: 'empanada_carne',
            name: 'Empanada de carne',
            category: 'prepared',
            calories: 280,
            protein: 10.0,
            carbs: 25.0,
            fat: 15.0,
            fiber: 1.5,
            servingSize: 100,
            unitWeight: 100
        },
        {
            id: 'pizza_muzzarella',
            name: 'Pizza muzzarella',
            category: 'prepared',
            calories: 266,
            protein: 11.0,
            carbs: 33.0,
            fat: 10.0,
            fiber: 2.3,
            servingSize: 100,
            unitWeight: 150
        },
        {
            id: 'milanesa',
            name: 'Milanesa de carne',
            category: 'prepared',
            calories: 260,
            protein: 20.0,
            carbs: 15.0,
            fat: 14.0,
            fiber: 0.5,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'milanesa_pollo',
            name: 'Milanesa de pollo',
            category: 'prepared',
            calories: 220,
            protein: 25.0,
            carbs: 12.0,
            fat: 9.0,
            fiber: 0.5,
            servingSize: 150,
            unitWeight: 150
        },
        {
            id: 'hamburger',
            name: 'Hamburguesa completa',
            category: 'prepared',
            calories: 295,
            protein: 17.0,
            carbs: 24.0,
            fat: 14.0,
            fiber: 1.3,
            servingSize: 200,
            unitWeight: 200
        },
        {
            id: 'spaghetti_bolognese',
            name: 'Spaghetti con bolognesa',
            category: 'prepared',
            calories: 130,
            protein: 6.0,
            carbs: 17.0,
            fat: 4.0,
            fiber: 1.5,
            servingSize: 300
        },
        {
            id: 'salad_caesar',
            name: 'Ensalada César',
            category: 'prepared',
            calories: 150,
            protein: 10.0,
            carbs: 8.0,
            fat: 10.0,
            fiber: 2.0,
            servingSize: 200
        },
        {
            id: 'asado',
            name: 'Asado (carne)',
            category: 'prepared',
            calories: 291,
            protein: 27.0,
            carbs: 0,
            fat: 20.0,
            fiber: 0,
            servingSize: 200
        }
    ],

    /**
     * Sample recipes - categorized by goal
     * Categories: high-protein, low-calorie, vegan, vegetarian, deficit (weight loss), surplus (muscle gain)
     */
    recipes: [
        // ==========================================
        // ALTO EN PROTEÍNA - Para ganancia muscular
        // ==========================================
        {
            id: 'recipe_hp_1',
            name: 'Pechuga grillada con arroz integral y brócoli',
            description: 'Clásico combo fitness, alto en proteína y carbohidratos complejos',
            category: 'high-protein',
            goalTag: 'surplus',
            calories: 450,
            protein: 42,
            carbs: 45,
            fat: 8,
            servings: 1,
            prepTime: 30,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'chicken_breast', amount: 200, unit: 'g' },
                { food: 'rice_brown', amount: 150, unit: 'g' },
                { food: 'broccoli', amount: 100, unit: 'g' }
            ],
            instructions: [
                'Condimentar la pechuga con sal, pimienta y ajo',
                'Cocinar a la plancha 6-7 min por lado',
                'Hervir el arroz integral según instrucciones',
                'Saltear el brócoli con un poco de aceite de oliva'
            ]
        },
        {
            id: 'recipe_hp_2',
            name: 'Omelette de claras con espinaca y queso',
            description: 'Desayuno proteico bajo en grasas',
            category: 'high-protein',
            goalTag: 'deficit',
            calories: 180,
            protein: 28,
            carbs: 4,
            fat: 6,
            servings: 1,
            prepTime: 10,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'egg_white', amount: 6, unit: 'unidades' },
                { food: 'spinach', amount: 50, unit: 'g' },
                { food: 'cheese_mozzarella', amount: 30, unit: 'g' }
            ],
            instructions: [
                'Batir las claras con sal y pimienta',
                'Saltear la espinaca en sartén',
                'Verter las claras y cocinar a fuego medio',
                'Agregar el queso y doblar el omelette'
            ]
        },
        {
            id: 'recipe_hp_3',
            name: 'Salmón al horno con quinoa',
            description: 'Omega 3 y proteína de alta calidad',
            category: 'high-protein',
            goalTag: 'maintenance',
            calories: 520,
            protein: 38,
            carbs: 35,
            fat: 24,
            servings: 1,
            prepTime: 35,
            difficulty: 'Media',
            ingredients: [
                { food: 'salmon', amount: 180, unit: 'g' },
                { food: 'quinoa', amount: 150, unit: 'g' },
                { food: 'avocado', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Precalentar horno a 200°C',
                'Condimentar el salmón con limón y eneldo',
                'Hornear 15-18 minutos',
                'Servir sobre cama de quinoa cocida'
            ]
        },
        {
            id: 'recipe_hp_4',
            name: 'Bowl de atún con vegetales',
            description: 'Proteína magra lista en minutos',
            category: 'high-protein',
            goalTag: 'deficit',
            calories: 280,
            protein: 35,
            carbs: 15,
            fat: 8,
            servings: 1,
            prepTime: 10,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'tuna', amount: 150, unit: 'g' },
                { food: 'lettuce', amount: 100, unit: 'g' },
                { food: 'tomato', amount: 100, unit: 'g' },
                { food: 'carrot', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Escurrir el atún',
                'Cortar los vegetales en trozos',
                'Mezclar todo en un bowl',
                'Aliñar con limón y aceite de oliva'
            ]
        },
        {
            id: 'recipe_hp_5',
            name: 'Yogur griego con almendras y banana',
            description: 'Snack proteico post-entrenamiento',
            category: 'high-protein',
            goalTag: 'surplus',
            calories: 350,
            protein: 22,
            carbs: 38,
            fat: 14,
            servings: 1,
            prepTime: 5,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'yogurt_greek', amount: 200, unit: 'g' },
                { food: 'banana', amount: 100, unit: 'g' },
                { food: 'almonds', amount: 20, unit: 'g' }
            ],
            instructions: [
                'Cortar la banana en rodajas',
                'Colocar el yogur en un bowl',
                'Agregar la banana y almendras troceadas'
            ]
        },

        // ==========================================
        // BAJO EN CALORÍAS - Para pérdida de peso
        // ==========================================
        {
            id: 'recipe_lc_1',
            name: 'Wrap de lechuga con pollo',
            description: 'Sin carbohidratos, alto en proteína',
            category: 'low-calorie',
            goalTag: 'deficit',
            calories: 180,
            protein: 28,
            carbs: 5,
            fat: 6,
            servings: 1,
            prepTime: 15,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'chicken_breast', amount: 120, unit: 'g' },
                { food: 'lettuce', amount: 80, unit: 'g' },
                { food: 'tomato', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Cocinar el pollo desmenuzado',
                'Usar hojas de lechuga como base',
                'Rellenar con pollo y tomate picado'
            ]
        },
        {
            id: 'recipe_lc_2',
            name: 'Sopa de verduras light',
            description: 'Muy baja en calorías, ideal para cenas',
            category: 'low-calorie',
            goalTag: 'deficit',
            calories: 85,
            protein: 4,
            carbs: 15,
            fat: 1,
            servings: 2,
            prepTime: 25,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'carrot', amount: 100, unit: 'g' },
                { food: 'broccoli', amount: 100, unit: 'g' },
                { food: 'spinach', amount: 50, unit: 'g' },
                { food: 'onion', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Picar todas las verduras',
                'Hervir en caldo de verduras',
                'Cocinar 20 minutos',
                'Licuar si se prefiere cremosa'
            ]
        },
        {
            id: 'recipe_lc_3',
            name: 'Ensalada de pepino y tomate',
            description: 'Fresca y casi sin calorías',
            category: 'low-calorie',
            goalTag: 'deficit',
            calories: 45,
            protein: 2,
            carbs: 8,
            fat: 1,
            servings: 1,
            prepTime: 5,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'tomato', amount: 150, unit: 'g' },
                { food: 'lettuce', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Cortar tomate en cubos',
                'Mezclar con lechuga picada',
                'Aliñar con limón y sal'
            ]
        },

        // ==========================================
        // VEGANO
        // ==========================================
        {
            id: 'recipe_v_1',
            name: 'Buddha bowl vegano',
            description: 'Nutritivo bowl con todos los grupos de alimentos vegetales',
            category: 'vegan',
            goalTag: 'maintenance',
            calories: 420,
            protein: 15,
            carbs: 55,
            fat: 16,
            servings: 1,
            prepTime: 25,
            difficulty: 'Media',
            ingredients: [
                { food: 'quinoa', amount: 150, unit: 'g' },
                { food: 'avocado', amount: 80, unit: 'g' },
                { food: 'spinach', amount: 50, unit: 'g' },
                { food: 'carrot', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Cocinar la quinoa según instrucciones',
                'Cortar la palta en láminas',
                'Armar el bowl con todos los ingredientes',
                'Agregar semillas y aliño de limón'
            ]
        },
        {
            id: 'recipe_v_2',
            name: 'Avena overnight con frutas',
            description: 'Desayuno preparado la noche anterior',
            category: 'vegan',
            goalTag: 'surplus',
            calories: 380,
            protein: 14,
            carbs: 68,
            fat: 8,
            servings: 1,
            prepTime: 5,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'oats', amount: 60, unit: 'g' },
                { food: 'banana', amount: 100, unit: 'g' },
                { food: 'strawberry', amount: 80, unit: 'g' }
            ],
            instructions: [
                'Mezclar avena con leche vegetal',
                'Refrigerar toda la noche',
                'Por la mañana agregar las frutas cortadas'
            ]
        },
        {
            id: 'recipe_v_3',
            name: 'Tostadas de palta',
            description: 'Clásico brunch saludable',
            category: 'vegan',
            goalTag: 'maintenance',
            calories: 320,
            protein: 8,
            carbs: 35,
            fat: 18,
            servings: 1,
            prepTime: 5,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'bread_whole', amount: 60, unit: 'g' },
                { food: 'avocado', amount: 100, unit: 'g' },
                { food: 'tomato', amount: 50, unit: 'g' }
            ],
            instructions: [
                'Tostar el pan integral',
                'Aplastar la palta con tenedor',
                'Untar sobre el pan y agregar tomate'
            ]
        },

        // ==========================================
        // VEGETARIANO
        // ==========================================
        {
            id: 'recipe_vt_1',
            name: 'Huevos revueltos con vegetales',
            description: 'Desayuno nutritivo y satisfactorio',
            category: 'vegetarian',
            goalTag: 'maintenance',
            calories: 280,
            protein: 18,
            carbs: 8,
            fat: 20,
            servings: 1,
            prepTime: 10,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'egg', amount: 3, unit: 'unidades' },
                { food: 'spinach', amount: 50, unit: 'g' },
                { food: 'cheese_mozzarella', amount: 30, unit: 'g' }
            ],
            instructions: [
                'Batir los huevos con sal y pimienta',
                'Saltear espinaca en la sartén',
                'Agregar huevos y revolver',
                'Añadir queso al final'
            ]
        },
        {
            id: 'recipe_vt_2',
            name: 'Ensalada César vegetariana',
            description: 'Con huevo y queso parmesano',
            category: 'vegetarian',
            goalTag: 'deficit',
            calories: 250,
            protein: 15,
            carbs: 12,
            fat: 16,
            servings: 1,
            prepTime: 15,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'lettuce', amount: 150, unit: 'g' },
                { food: 'egg', amount: 2, unit: 'unidades' },
                { food: 'cheese_cheddar', amount: 20, unit: 'g' }
            ],
            instructions: [
                'Hervir huevos durante 10 minutos',
                'Cortar la lechuga',
                'Mezclar con huevo picado y queso rallado',
                'Aliñar con aderezo césar light'
            ]
        },

        // ==========================================
        // GANANCIA DE MASA (Surplus)
        // ==========================================
        {
            id: 'recipe_s_1',
            name: 'Batido proteico casero',
            description: 'Ideal post-entrenamiento para ganar músculo',
            category: 'high-protein',
            goalTag: 'surplus',
            calories: 550,
            protein: 35,
            carbs: 70,
            fat: 15,
            servings: 1,
            prepTime: 5,
            difficulty: 'Fácil',
            ingredients: [
                { food: 'milk_whole', amount: 300, unit: 'ml' },
                { food: 'banana', amount: 150, unit: 'g' },
                { food: 'oats', amount: 40, unit: 'g' },
                { food: 'peanuts', amount: 20, unit: 'g' }
            ],
            instructions: [
                'Agregar todos los ingredientes a la licuadora',
                'Licuar hasta obtener consistencia homogénea',
                'Tomar inmediatamente después del ejercicio'
            ]
        },
        {
            id: 'recipe_s_2',
            name: 'Pasta con carne magra',
            description: 'Carbohidratos y proteína para el crecimiento muscular',
            category: 'high-protein',
            goalTag: 'surplus',
            calories: 620,
            protein: 38,
            carbs: 65,
            fat: 22,
            servings: 1,
            prepTime: 25,
            difficulty: 'Media',
            ingredients: [
                { food: 'pasta_cooked', amount: 200, unit: 'g' },
                { food: 'ground_beef_lean', amount: 150, unit: 'g' },
                { food: 'tomato', amount: 100, unit: 'g' }
            ],
            instructions: [
                'Cocinar la pasta al dente',
                'Dorar la carne en sartén',
                'Agregar salsa de tomate',
                'Mezclar con la pasta y servir'
            ]
        },

        // ==========================================
        // PÉRDIDA DE PESO (Déficit)
        // ==========================================
        {
            id: 'recipe_d_1',
            name: 'Milanesa de pollo al horno con ensalada',
            description: 'Version saludable sin freír',
            category: 'low-calorie',
            goalTag: 'deficit',
            calories: 320,
            protein: 35,
            carbs: 18,
            fat: 12,
            servings: 1,
            prepTime: 35,
            difficulty: 'Media',
            ingredients: [
                { food: 'chicken_breast', amount: 150, unit: 'g' },
                { food: 'egg', amount: 1, unit: 'unidad' },
                { food: 'lettuce', amount: 100, unit: 'g' },
                { food: 'tomato', amount: 100, unit: 'g' }
            ],
            instructions: [
                'Pasar el pollo por huevo y pan rallado',
                'Hornear a 200°C por 20-25 minutos',
                'Acompañar con ensalada fresca'
            ]
        },
        {
            id: 'recipe_d_2',
            name: 'Bife con batata al horno',
            description: 'Proteína magra con carbohidratos complejos',
            category: 'high-protein',
            goalTag: 'deficit',
            calories: 380,
            protein: 32,
            carbs: 30,
            fat: 14,
            servings: 1,
            prepTime: 40,
            difficulty: 'Media',
            ingredients: [
                { food: 'beef_steak', amount: 150, unit: 'g' },
                { food: 'sweet_potato', amount: 150, unit: 'g' },
                { food: 'broccoli', amount: 100, unit: 'g' }
            ],
            instructions: [
                'Hornear la batata cortada en cubos',
                'Cocinar el bife a la plancha',
                'Servir con brócoli al vapor'
            ]
        }
    ],


    /**
     * Search foods by query
     * @param {string} query 
     * @returns {Array}
     */
    search(query) {
        if (!query || query.length < 2) return [];

        const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Search in database foods
        const dbResults = this.foods.filter(food => {
            const name = food.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const brand = (food.brand || '').toLowerCase();
            return name.includes(normalizedQuery) || brand.includes(normalizedQuery);
        });

        // Search in custom foods
        const customFoods = Storage.getCustomFoods();
        const customResults = customFoods.filter(food => {
            const name = food.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return name.includes(normalizedQuery);
        });

        return [...customResults, ...dbResults];
    },

    /**
     * Get food by ID
     * @param {string} id 
     * @returns {Object|null}
     */
    getById(id) {
        // Check custom foods first
        const customFoods = Storage.getCustomFoods();
        const customFood = customFoods.find(f => f.id === id);
        if (customFood) return customFood;

        // Check database foods
        return this.foods.find(f => f.id === id) || null;
    },

    /**
     * Get foods by category
     * @param {string} categoryId 
     * @returns {Array}
     */
    getByCategory(categoryId) {
        if (categoryId === 'all') return this.foods;
        return this.foods.filter(f => f.category === categoryId);
    },

    /**
     * Get recipes filtered
     * @param {string} filter 
     * @returns {Array}
     */
    getRecipes(filter = 'all') {
        if (filter === 'all') return this.recipes;
        return this.recipes.filter(r => r.category === filter);
    }
};

// Make FoodsDatabase available globally
window.FoodsDatabase = FoodsDatabase;
