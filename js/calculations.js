/**
 * CalorieTracker - Nutritional Calculations
 * Cálculos de TMB, GET y metas de macronutrientes
 * Basado en fórmula Harris-Benedict revisada
 */

const Calculations = {
    /**
     * Activity level multipliers for GET calculation
     */
    activityMultipliers: {
        sedentary: 1.2,      // Poco o ningún ejercicio
        light: 1.375,        // Ejercicio ligero 1-3 días/semana
        moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
        intense: 1.725,      // Ejercicio intenso 6-7 días/semana
        very_intense: 1.9    // Atleta / ejercicio muy intenso
    },

    /**
     * Goal modifiers for calorie target
     */
    goalModifiers: {
        deficit: 0.80,       // -20% para perder peso
        maintenance: 1.0,    // Mantener peso
        surplus: 1.15        // +15% para ganar masa
    },

    /**
     * Calculate Basal Metabolic Rate (TMB) using Harris-Benedict formula
     * @param {Object} profile - User profile data
     * @param {number} profile.weight - Weight in kg
     * @param {number} profile.height - Height in cm
     * @param {number} profile.age - Age in years
     * @param {string} profile.sex - 'male' or 'female'
     * @returns {number} TMB in kcal/day
     */
    calculateTMB(profile) {
        const { weight, height, age, sex } = profile;

        if (!weight || !height || !age || !sex) {
            return 0;
        }

        let tmb;
        if (sex === 'male') {
            // Hombres: TMB = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × edad)
            tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            // Mujeres: TMB = 447.593 + (9.247 × peso) + (3.098 × altura) - (4.330 × edad)
            tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        return Math.round(tmb);
    },

    /**
     * Calculate Total Daily Energy Expenditure (GET)
     * @param {number} tmb - Basal Metabolic Rate
     * @param {string} activityLevel - Activity level key
     * @returns {number} GET in kcal/day
     */
    calculateGET(tmb, activityLevel) {
        const multiplier = this.activityMultipliers[activityLevel] || 1.2;
        return Math.round(tmb * multiplier);
    },

    /**
     * Calculate daily calorie target based on goal
     * @param {number} get - Total Daily Energy Expenditure
     * @param {string} goal - Goal key (deficit, maintenance, surplus)
     * @returns {number} Calorie target in kcal/day
     */
    calculateCalorieTarget(get, goal) {
        const modifier = this.goalModifiers[goal] || 1.0;
        return Math.round(get * modifier);
    },

    /**
     * Calculate macro targets based on body weight and goal
     * Using scientifically-backed g/kg formulas:
     * 
     * DÉFICIT (Bajar Grasa):
     *   - Proteína: 2.2-2.6 g/kg (usamos 2.4 g/kg)
     *   - Grasas: 0.5-0.8 g/kg (usamos 0.65 g/kg)
     *   - Carbohidratos: Resto de calorías (mín. 2g/kg)
     * 
     * MANTENIMIENTO (Equilibrio):
     *   - Proteína: 1.8-2.2 g/kg (usamos 2.0 g/kg)
     *   - Grasas: 0.8-1.2 g/kg (usamos 1.0 g/kg)
     *   - Carbohidratos: 3.0-5.0 g/kg (resto calórico)
     * 
     * SUPERÁVIT (Ganar Músculo):
     *   - Proteína: 1.6-2.0 g/kg (usamos 1.8 g/kg)
     *   - Grasas: 0.8-1.2 g/kg (usamos 1.0 g/kg)
     *   - Carbohidratos: 4.0-7.0 g/kg (resto calórico, alto)
     * 
     * @param {number} calorieTarget - Daily calorie target
     * @param {number} weight - Body weight in kg
     * @param {string} goal - Goal key (deficit, maintenance, surplus)
     * @returns {Object} Macro targets in grams
     */
    calculateMacroTargets(calorieTarget, weight, goal) {
        let proteinPerKg, fatPerKg, minCarbsPerKg;

        // Macro ratios based on goal (g/kg body weight)
        switch (goal) {
            case 'deficit':
                // High protein to preserve muscle during fat loss
                proteinPerKg = 2.4;   // 2.2-2.6 g/kg
                fatPerKg = 0.65;      // 0.5-0.8 g/kg (lower end)
                minCarbsPerKg = 2.0;  // Minimum carbs
                break;
            case 'surplus':
                // Moderate protein, higher carbs for muscle gain
                proteinPerKg = 1.8;   // 1.6-2.0 g/kg
                fatPerKg = 1.0;       // 0.8-1.2 g/kg
                minCarbsPerKg = 4.0;  // High carbs for energy
                break;
            case 'maintenance':
            default:
                // Balanced approach
                proteinPerKg = 2.0;   // 1.8-2.2 g/kg
                fatPerKg = 1.0;       // 0.8-1.2 g/kg
                minCarbsPerKg = 3.0;  // Moderate carbs
                break;
        }

        // Calculate grams from g/kg
        const protein = Math.round(weight * proteinPerKg);
        const fat = Math.round(weight * fatPerKg);

        // Calculate calories from protein and fat
        // Protein: 4 kcal/g, Fat: 9 kcal/g
        const proteinCals = protein * 4;
        const fatCals = fat * 9;

        // Calculate carbs from remaining calories
        // Carbs: 4 kcal/g
        const remainingCals = calorieTarget - proteinCals - fatCals;
        let carbs = Math.round(remainingCals / 4);

        // Ensure minimum carbs based on goal
        const minCarbs = Math.round(weight * minCarbsPerKg);
        carbs = Math.max(minCarbs, carbs);

        return {
            protein,
            carbs,
            fat
        };
    },

    /**
     * Calculate all nutritional targets for a user profile
     * @param {Object} profile - User profile with all data
     * @returns {Object} All calculated values
     */
    calculateAll(profile) {
        const tmb = this.calculateTMB(profile);
        const get = this.calculateGET(tmb, profile.activityLevel);
        const calorieTarget = this.calculateCalorieTarget(get, profile.goal);
        const macros = this.calculateMacroTargets(calorieTarget, profile.weight, profile.goal);

        return {
            tmb,
            get,
            calorieTarget,
            proteinTarget: macros.protein,
            carbsTarget: macros.carbs,
            fatTarget: macros.fat
        };
    },

    /**
     * Calculate nutrition values for a food portion
     * @param {Object} food - Food item with nutrition per 100g/ml
     * @param {number} quantity - Quantity in grams/ml
     * @returns {Object} Calculated nutrition values
     */
    calculatePortionNutrition(food, quantity) {
        const factor = quantity / 100;
        return {
            calories: Utils.round(food.calories * factor, 0),
            protein: Utils.round(food.protein * factor, 1),
            carbs: Utils.round(food.carbs * factor, 1),
            fat: Utils.round(food.fat * factor, 1),
            fiber: food.fiber ? Utils.round(food.fiber * factor, 1) : 0
        };
    },

    /**
     * Convert portion units to grams
     * @param {number} quantity - Quantity in specified unit
     * @param {string} unit - Unit type
     * @param {Object} food - Food item (for serving size reference)
     * @returns {number} Quantity in grams
     */
    convertToGrams(quantity, unit, food = null) {
        switch (unit) {
            case 'g':
            case 'ml':
                return quantity;
            case 'portion':
                // Use food's serving size or default 100g
                return quantity * (food?.servingSize || 100);
            case 'unit':
                // Approximate unit weight (can be customized per food)
                return quantity * (food?.unitWeight || 50);
            case 'cup':
                // Standard cup = ~240ml for liquids, varies for solids
                return quantity * (food?.cupWeight || 200);
            case 'tbsp':
                // Tablespoon = ~15ml/g
                return quantity * 15;
            default:
                return quantity;
        }
    },

    /**
     * Calculate daily totals from food entries
     * @param {Array} entries - Array of food entries
     * @returns {Object} Daily totals
     */
    calculateDailyTotals(entries) {
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        entries.forEach(entry => {
            totals.calories += entry.calories || 0;
            totals.protein += entry.protein || 0;
            totals.carbs += entry.carbs || 0;
            totals.fat += entry.fat || 0;
        });

        // Round values
        totals.calories = Math.round(totals.calories);
        totals.protein = Utils.round(totals.protein, 1);
        totals.carbs = Utils.round(totals.carbs, 1);
        totals.fat = Utils.round(totals.fat, 1);

        return totals;
    },

    /**
     * Calculate weekly averages
     * @param {Object} dailyData - Object with date keys and daily totals
     * @returns {Object} Weekly averages
     */
    calculateWeeklyAverages(dailyData) {
        const days = Object.keys(dailyData);
        if (days.length === 0) {
            return { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }

        const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

        days.forEach(day => {
            const data = dailyData[day];
            totals.calories += data.calories || 0;
            totals.protein += data.protein || 0;
            totals.carbs += data.carbs || 0;
            totals.fat += data.fat || 0;
        });

        const count = days.length;
        return {
            calories: Math.round(totals.calories / count),
            protein: Utils.round(totals.protein / count, 1),
            carbs: Utils.round(totals.carbs / count, 1),
            fat: Utils.round(totals.fat / count, 1)
        };
    },

    /**
     * Calculate goal adherence percentage
     * @param {Object} dailyData - Object with date keys and daily totals
     * @param {number} calorieTarget - Daily calorie target
     * @param {number} tolerance - Acceptable deviation percentage (default 10%)
     * @returns {number} Percentage of days within target
     */
    calculateGoalAdherence(dailyData, calorieTarget, tolerance = 0.10) {
        const days = Object.keys(dailyData);
        if (days.length === 0) return 0;

        const lowerBound = calorieTarget * (1 - tolerance);
        const upperBound = calorieTarget * (1 + tolerance);

        let daysOnTarget = 0;
        days.forEach(day => {
            const calories = dailyData[day].calories || 0;
            if (calories >= lowerBound && calories <= upperBound) {
                daysOnTarget++;
            }
        });

        return Math.round((daysOnTarget / days.length) * 100);
    },

    /**
     * Estimate exercise calories burned
     * @param {string} exerciseType - Type of exercise
     * @param {number} duration - Duration in minutes
     * @param {number} weight - Body weight in kg
     * @returns {number} Estimated calories burned
     */
    estimateExerciseCalories(exerciseType, duration, weight) {
        // MET values for common exercises (approximations)
        const metValues = {
            walking: 3.5,
            running: 9.8,
            cycling: 7.5,
            swimming: 8.0,
            weightlifting: 5.0,
            yoga: 3.0,
            hiit: 12.0,
            dancing: 5.5,
            other: 5.0
        };

        const met = metValues[exerciseType] || metValues.other;
        // Calories = MET × weight (kg) × time (hours)
        const hours = duration / 60;
        return Math.round(met * weight * hours);
    },

    /**
     * Calculate micronutrient targets based on activity level
     * Micronutrients don't change by weight, but by physical wear/activity
     * 
     * Guidelines:
     * - Magnesio (200-400 mg): Muscle contraction & recovery (take at night)
     * - Zinc (10-15 mg): Testosterone & immune system
     * - Vitamina D3 (2000-5000 UI): Strength & bone health
     * - Omega 3 (2-3g fish oil): Joint inflammation
     * - Sodio/Potasio: Increase on high activity days to prevent cramps
     * 
     * @param {string} activityLevel - Activity level key
     * @param {boolean} isHighIntensityDay - If today is a match/intense training day
     * @returns {Object} Micronutrient targets with units
     */
    calculateMicronutrients(activityLevel, isHighIntensityDay = false) {
        // Base micronutrient values
        let micros = {
            magnesium: { min: 200, max: 300, unit: 'mg', name: 'Magnesio', note: 'Tomar de noche para mejor descanso' },
            zinc: { min: 10, max: 12, unit: 'mg', name: 'Zinc', note: 'Para testosterona y sistema inmune' },
            vitaminD3: { min: 2000, max: 3000, unit: 'UI', name: 'Vitamina D3', note: 'Especialmente si no tomas mucho sol' },
            omega3: { min: 2, max: 2.5, unit: 'g', name: 'Omega 3', note: 'Aceite de pescado para desinflamar articulaciones' },
            sodium: { min: 2000, max: 2500, unit: 'mg', name: 'Sodio', note: 'Importante para hidratación' },
            potassium: { min: 3500, max: 4000, unit: 'mg', name: 'Potasio', note: 'Previene calambres musculares' }
        };

        // Adjust based on activity level
        switch (activityLevel) {
            case 'sedentary':
                // Lower end of ranges
                micros.magnesium = { ...micros.magnesium, min: 200, max: 250 };
                micros.zinc = { ...micros.zinc, min: 10, max: 10 };
                micros.vitaminD3 = { ...micros.vitaminD3, min: 2000, max: 2000 };
                micros.omega3 = { ...micros.omega3, min: 2, max: 2 };
                break;

            case 'light':
                // Low-moderate ranges
                micros.magnesium = { ...micros.magnesium, min: 250, max: 300 };
                micros.zinc = { ...micros.zinc, min: 10, max: 12 };
                micros.vitaminD3 = { ...micros.vitaminD3, min: 2000, max: 3000 };
                micros.omega3 = { ...micros.omega3, min: 2, max: 2.5 };
                break;

            case 'moderate':
                // Moderate-high ranges
                micros.magnesium = { ...micros.magnesium, min: 300, max: 350 };
                micros.zinc = { ...micros.zinc, min: 12, max: 15 };
                micros.vitaminD3 = { ...micros.vitaminD3, min: 3000, max: 4000 };
                micros.omega3 = { ...micros.omega3, min: 2.5, max: 3 };
                break;

            case 'intense':
            case 'very_intense':
                // Upper ranges for athletes
                micros.magnesium = { ...micros.magnesium, min: 350, max: 400 };
                micros.zinc = { ...micros.zinc, min: 15, max: 15 };
                micros.vitaminD3 = { ...micros.vitaminD3, min: 4000, max: 5000 };
                micros.omega3 = { ...micros.omega3, min: 3, max: 3 };
                break;
        }

        // Increase electrolytes on high intensity days (match, boxing, intense sports)
        if (isHighIntensityDay) {
            micros.sodium = {
                ...micros.sodium,
                min: 3000,
                max: 4000,
                note: '⚡ Día intenso: Mayor ingesta para evitar deshidratación'
            };
            micros.potassium = {
                ...micros.potassium,
                min: 4500,
                max: 5000,
                note: '⚡ Día intenso: Prevenir calambres por desgaste'
            };
        }

        return micros;
    },

    /**
     * Calculate all nutritional targets including micronutrients
     * @param {Object} profile - User profile with all data
     * @param {boolean} isHighIntensityDay - If today is a high intensity day
     * @returns {Object} All calculated macro and micro values
     */
    calculateAllWithMicros(profile, isHighIntensityDay = false) {
        const base = this.calculateAll(profile);
        const micros = this.calculateMicronutrients(profile.activityLevel, isHighIntensityDay);

        return {
            ...base,
            micronutrients: micros
        };
    }
};

// Make Calculations available globally
window.Calculations = Calculations;
