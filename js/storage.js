/**
 * CalorieTracker - Storage Module
 * Manejo de almacenamiento con Supabase como fuente primaria
 * y LocalStorage como fallback para modo offline
 */

const Storage = {
    /**
     * Storage keys para localStorage (fallback)
     */
    KEYS: {
        USER: 'calorietracker_user',
        PROFILE: 'calorietracker_profile',
        FOOD_ENTRIES: 'calorietracker_food_entries',
        WEIGHT_ENTRIES: 'calorietracker_weight_entries',
        CUSTOM_FOODS: 'calorietracker_custom_foods',
        FAVORITES: 'calorietracker_favorites',
        RECENT_FOODS: 'calorietracker_recent_foods',
        SETTINGS: 'calorietracker_settings'
    },

    // Cache para evitar múltiples llamadas
    _cache: {
        user: null,
        profile: null
    },

    /**
     * Initialize storage with default values if empty
     */
    init() {
        // Initialize food entries object if not exists
        if (!localStorage.getItem(this.KEYS.FOOD_ENTRIES)) {
            localStorage.setItem(this.KEYS.FOOD_ENTRIES, JSON.stringify({}));
        }

        // Initialize weight entries array if not exists
        if (!localStorage.getItem(this.KEYS.WEIGHT_ENTRIES)) {
            localStorage.setItem(this.KEYS.WEIGHT_ENTRIES, JSON.stringify([]));
        }

        // Initialize custom foods array if not exists
        if (!localStorage.getItem(this.KEYS.CUSTOM_FOODS)) {
            localStorage.setItem(this.KEYS.CUSTOM_FOODS, JSON.stringify([]));
        }

        // Initialize favorites array if not exists
        if (!localStorage.getItem(this.KEYS.FAVORITES)) {
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify([]));
        }

        // Initialize recent foods array if not exists
        if (!localStorage.getItem(this.KEYS.RECENT_FOODS)) {
            localStorage.setItem(this.KEYS.RECENT_FOODS, JSON.stringify([]));
        }

        // Inicializar Supabase si está disponible
        if (typeof SupabaseService !== 'undefined') {
            SupabaseService.init();
        }
    },

    // ==========================================
    // User Authentication
    // ==========================================

    /**
     * Check if user is logged in
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        // Primero intentar con Supabase (con timeout para free tier)
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            try {
                const sessionPromise = SupabaseService.getSession();
                const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('TIMEOUT'), 3000));
                const result = await Promise.race([sessionPromise, timeoutPromise]);

                if (result === 'TIMEOUT') {
                    console.warn('⚠️ Supabase session check timed out, using localStorage');
                    const user = this.getLocalUser();
                    return user !== null;
                }

                if (result !== null) return true;
            } catch (err) {
                console.warn('⚠️ Supabase session check failed:', err);
            }
        }

        // Fallback a localStorage
        const user = this.getLocalUser();
        return user !== null;
    },

    /**
     * Versión sincrónica para compatibilidad
     */
    isLoggedInSync() {
        // Check cache first
        if (this._cache.user) return true;

        // Check localStorage
        const user = this.getLocalUser();
        return user !== null;
    },

    /**
     * Get current user from localStorage (fallback)
     * @returns {Object|null}
     */
    getLocalUser() {
        const data = localStorage.getItem(this.KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Get current user (async, prefers Supabase)
     * @returns {Promise<Object|null>}
     */
    async getUser() {
        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const user = await SupabaseService.getUser();
            if (user) {
                this._cache.user = user;
                return user;
            }
        }

        // Fallback a localStorage
        return this.getLocalUser();
    },

    /**
     * Save user to localStorage (for caching)
     * @param {Object} user 
     */
    saveUser(user) {
        this._cache.user = user;
        localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    },

    /**
     * Logout user
     */
    async logout() {
        // Logout de Supabase
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            await SupabaseService.signOut();
        }

        // Limpiar localStorage
        localStorage.removeItem(this.KEYS.USER);
        localStorage.removeItem(this.KEYS.PROFILE);
        this._cache.user = null;
        this._cache.profile = null;
    },

    /**
     * Authenticate user (register or login)
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     * @param {boolean} isRegister 
     * @returns {Promise<Object>} Result with success and user/error
     */
    async authenticate(email, password, name = '', isRegister = false) {
        // Simple validation
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' };
        }

        if (password.length < 6) {
            return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Email inválido' };
        }

        // Usar Supabase si está disponible
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            let result;

            if (isRegister) {
                if (!name) {
                    return { success: false, error: 'El nombre es requerido' };
                }
                result = await SupabaseService.signUp(email, password, name);
            } else {
                result = await SupabaseService.signIn(email, password);
            }

            if (result.success && result.user) {
                // Guardar en caché local
                this.saveUser({
                    id: result.user.id,
                    email: result.user.email,
                    name: name || result.user.user_metadata?.name || email.split('@')[0],
                    createdAt: result.user.created_at
                });
            }

            return result;
        }

        // Fallback: autenticación local (demo)
        if (isRegister) {
            if (!name) {
                return { success: false, error: 'El nombre es requerido' };
            }

            const user = {
                id: Utils.generateId(),
                email: email.toLowerCase(),
                name: name,
                createdAt: new Date().toISOString()
            };

            this.saveUser(user);
            return { success: true, user };
        } else {
            // Login - check if user exists with this email
            const existingUser = this.getLocalUser();
            if (existingUser && existingUser.email === email.toLowerCase()) {
                return { success: true, user: existingUser };
            }

            // For demo: allow any login to create user
            const user = {
                id: Utils.generateId(),
                email: email.toLowerCase(),
                name: email.split('@')[0],
                createdAt: new Date().toISOString()
            };

            this.saveUser(user);
            return { success: true, user };
        }
    },

    // ==========================================
    // Profile
    // ==========================================

    /**
     * Check if profile is complete
     * @returns {Promise<boolean>}
     */
    async hasCompleteProfile() {
        const profile = await this.getProfile();
        if (!profile) return false;

        // Soportar ambos formatos (camelCase y snake_case)
        const activityLevel = profile.activityLevel || profile.activity_level;
        return !!(profile.weight && profile.height && profile.age &&
            profile.sex && activityLevel && profile.goal);
    },

    /**
     * Versión sincrónica para compatibilidad
     */
    hasCompleteProfileSync() {
        const profile = this.getLocalProfile();
        if (!profile) return false;

        // Soportar ambos formatos (camelCase y snake_case)
        const activityLevel = profile.activityLevel || profile.activity_level;
        return profile.weight && profile.height && profile.age &&
            profile.sex && activityLevel && profile.goal;
    },

    /**
     * Get user profile from localStorage
     * @returns {Object|null}
     */
    getLocalProfile() {
        const data = localStorage.getItem(this.KEYS.PROFILE);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Get user profile (async, prefers Supabase)
     * @returns {Promise<Object|null>}
     */
    async getProfile() {
        // Intentar con Supabase primero (con timeout)
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            try {
                const profilePromise = SupabaseService.getProfile();
                const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('TIMEOUT'), 3000));
                const result = await Promise.race([profilePromise, timeoutPromise]);

                if (result === 'TIMEOUT') {
                    console.warn('⚠️ Supabase profile fetch timed out, using localStorage');
                    return this.getLocalProfile();
                }

                if (result) {
                    // Convertir snake_case a camelCase para compatibilidad
                    const normalizedProfile = this._normalizeProfile(result);
                    this._cache.profile = normalizedProfile;
                    // También guardar en localStorage para acceso rápido
                    localStorage.setItem(this.KEYS.PROFILE, JSON.stringify(normalizedProfile));
                    return normalizedProfile;
                }
            } catch (err) {
                console.warn('⚠️ Supabase profile fetch failed:', err);
            }
        }

        // Fallback a localStorage
        return this.getLocalProfile();
    },

    /**
     * Normalizar perfil (convertir snake_case a camelCase)
     */
    _normalizeProfile(profile) {
        return {
            id: profile.id,
            name: profile.name,
            weight: profile.weight,
            height: profile.height,
            age: profile.age,
            sex: profile.sex,
            activityLevel: profile.activity_level || profile.activityLevel,
            goal: profile.goal,
            tmb: profile.tmb,
            get: profile.get_value || profile.get,
            calorieTarget: profile.calorie_target || profile.calorieTarget,
            proteinTarget: profile.protein_target || profile.proteinTarget,
            carbsTarget: profile.carbs_target || profile.carbsTarget,
            fatTarget: profile.fat_target || profile.fatTarget,
            updatedAt: profile.updated_at || profile.updatedAt
        };
    },

    /**
     * Convertir perfil a snake_case para Supabase
     */
    _denormalizeProfile(profile) {
        return {
            name: profile.name,
            weight: profile.weight,
            height: profile.height,
            age: profile.age,
            sex: profile.sex,
            activity_level: profile.activityLevel || profile.activity_level,
            goal: profile.goal,
            tmb: profile.tmb,
            get_value: profile.get || profile.get_value,
            calorie_target: profile.calorieTarget || profile.calorie_target,
            protein_target: profile.proteinTarget || profile.protein_target,
            carbs_target: profile.carbsTarget || profile.carbs_target,
            fat_target: profile.fatTarget || profile.fat_target
        };
    },

    /**
     * Save user profile
     * @param {Object} profile 
     */
    async saveProfile(profile) {
        profile.updatedAt = new Date().toISOString();

        // Guardar en Supabase si está disponible
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const supabaseProfile = this._denormalizeProfile(profile);
            await SupabaseService.updateProfile(supabaseProfile);
        }

        // Siempre guardar en localStorage también
        localStorage.setItem(this.KEYS.PROFILE, JSON.stringify(profile));
        this._cache.profile = profile;
    },

    /**
     * Update profile with calculations
     * @param {Object} profileData 
     * @returns {Promise<Object>} Updated profile with calculations
     */
    async updateProfileWithCalculations(profileData) {
        const calculations = Calculations.calculateAll(profileData);
        const profile = {
            ...profileData,
            ...calculations,
            updatedAt: new Date().toISOString()
        };
        await this.saveProfile(profile);
        return profile;
    },

    // ==========================================
    // Food Entries
    // ==========================================

    /**
     * Get all food entries from localStorage
     * @returns {Object} Object with date keys
     */
    getAllLocalFoodEntries() {
        const data = localStorage.getItem(this.KEYS.FOOD_ENTRIES);
        return data ? JSON.parse(data) : {};
    },

    /**
     * Get food entries for a specific date
     * @param {Date|string} date 
     * @returns {Promise<Array>}
     */
    async getFoodEntries(date) {
        const dateKey = typeof date === 'string' ? date : Utils.getDateKey(date);

        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const entries = await SupabaseService.getFoodEntries(dateKey);
            if (entries.length > 0) {
                // Normalizar entradas
                return entries.map(e => ({
                    id: e.id,
                    foodId: e.food_id,
                    foodName: e.food_name,
                    mealType: e.meal_type,
                    quantity: e.quantity,
                    unit: e.unit,
                    calories: parseFloat(e.calories),
                    protein: parseFloat(e.protein),
                    carbs: parseFloat(e.carbs),
                    fat: parseFloat(e.fat),
                    createdAt: e.created_at
                }));
            }
        }

        // Fallback a localStorage
        const allEntries = this.getAllLocalFoodEntries();
        return allEntries[dateKey] || [];
    },

    /**
     * Versión sincrónica para compatibilidad
     */
    getFoodEntriesSync(date) {
        const dateKey = typeof date === 'string' ? date : Utils.getDateKey(date);
        const allEntries = this.getAllLocalFoodEntries();
        return allEntries[dateKey] || [];
    },

    /**
     * Add food entry
     * @param {Object} entry 
     * @param {Date|string} date 
     */
    async addFoodEntry(entry, date = new Date()) {
        const dateKey = typeof date === 'string' ? date : Utils.getDateKey(date);

        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const result = await SupabaseService.addFoodEntry({
                ...entry,
                entryDate: dateKey
            });

            if (result.success) {
                // También guardar en localStorage para acceso rápido
                this._addLocalFoodEntry(entry, dateKey);
                this.addRecentFood(entry.foodId || entry.food);
                return result.entry;
            }
        }

        // Fallback: guardar solo en localStorage
        return this._addLocalFoodEntry(entry, dateKey);
    },

    /**
     * Add food entry to localStorage
     */
    _addLocalFoodEntry(entry, dateKey) {
        const allEntries = this.getAllLocalFoodEntries();

        if (!allEntries[dateKey]) {
            allEntries[dateKey] = [];
        }

        entry.id = entry.id || Utils.generateId();
        entry.createdAt = new Date().toISOString();

        allEntries[dateKey].push(entry);
        localStorage.setItem(this.KEYS.FOOD_ENTRIES, JSON.stringify(allEntries));

        // Add to recent foods
        this.addRecentFood(entry.foodId || entry.food);

        return entry;
    },

    /**
     * Delete food entry
     * @param {string} entryId 
     * @param {Date|string} date 
     */
    async deleteFoodEntry(entryId, date) {
        // Eliminar de Supabase si está disponible
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            await SupabaseService.deleteFoodEntry(entryId);
        }

        // También eliminar de localStorage
        const dateKey = typeof date === 'string' ? date : Utils.getDateKey(date);
        const allEntries = this.getAllLocalFoodEntries();

        if (allEntries[dateKey]) {
            allEntries[dateKey] = allEntries[dateKey].filter(e => e.id !== entryId);
            localStorage.setItem(this.KEYS.FOOD_ENTRIES, JSON.stringify(allEntries));
        }
    },

    /**
     * Get daily totals for a date
     * @param {Date|string} date 
     * @returns {Promise<Object>}
     */
    async getDailyTotals(date) {
        const entries = await this.getFoodEntries(date);
        return Calculations.calculateDailyTotals(entries);
    },

    /**
     * Versión sincrónica para compatibilidad
     */
    getDailyTotalsSync(date) {
        const entries = this.getFoodEntriesSync(date);
        return Calculations.calculateDailyTotals(entries);
    },

    /**
     * Get weekly data
     * @returns {Promise<Object>}
     */
    async getWeeklyData() {
        const weekData = {};
        const dates = Utils.getLastNDays(7);

        for (const date of dates) {
            const dateKey = Utils.getDateKey(date);
            weekData[dateKey] = await this.getDailyTotals(date);
        }

        return weekData;
    },

    // ==========================================
    // Weight Entries
    // ==========================================

    /**
     * Get all weight entries from localStorage
     * @returns {Array}
     */
    getLocalWeightEntries() {
        const data = localStorage.getItem(this.KEYS.WEIGHT_ENTRIES);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Get all weight entries
     * @returns {Promise<Array>}
     */
    async getWeightEntries() {
        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const entries = await SupabaseService.getWeightEntries();
            if (entries.length > 0) {
                return entries.map(e => ({
                    id: e.id,
                    weight: parseFloat(e.weight),
                    date: e.entry_date,
                    createdAt: e.created_at
                }));
            }
        }

        return this.getLocalWeightEntries();
    },

    /**
     * Add weight entry
     * @param {number} weight 
     * @param {Date} date 
     */
    async addWeightEntry(weight, date = new Date()) {
        const dateKey = Utils.getDateKey(date);

        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            await SupabaseService.addWeightEntry(weight, dateKey);
        }

        // También guardar en localStorage
        const entries = this.getLocalWeightEntries();

        // Remove existing entry for same date
        const filtered = entries.filter(e => e.date !== dateKey);

        filtered.push({
            id: Utils.generateId(),
            weight: parseFloat(weight),
            date: dateKey,
            createdAt: new Date().toISOString()
        });

        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        localStorage.setItem(this.KEYS.WEIGHT_ENTRIES, JSON.stringify(filtered));

        // Update profile weight
        const profile = this.getLocalProfile();
        if (profile) {
            profile.weight = parseFloat(weight);
            await this.saveProfile(profile);
        }

        return filtered;
    },

    /**
     * Get latest weight
     * @returns {Promise<number|null>}
     */
    async getLatestWeight() {
        const entries = await this.getWeightEntries();
        if (entries.length === 0) return null;
        return entries[entries.length - 1].weight;
    },

    // ==========================================
    // Custom Foods
    // ==========================================

    /**
     * Get custom foods from localStorage
     * @returns {Array}
     */
    getLocalCustomFoods() {
        const data = localStorage.getItem(this.KEYS.CUSTOM_FOODS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Get custom foods
     * @returns {Promise<Array>}
     */
    async getCustomFoods() {
        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const foods = await SupabaseService.getCustomFoods();
            if (foods.length > 0) {
                return foods.map(f => ({
                    id: f.id,
                    name: f.name,
                    brand: f.brand,
                    calories: parseFloat(f.calories),
                    protein: parseFloat(f.protein),
                    carbs: parseFloat(f.carbs),
                    fat: parseFloat(f.fat),
                    source: 'custom'
                }));
            }
        }

        return this.getLocalCustomFoods();
    },

    /**
     * Add custom food
     * @param {Object} food 
     */
    async addCustomFood(food) {
        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const result = await SupabaseService.addCustomFood(food);
            if (result.success) {
                food.id = result.food.id;
            }
        }

        // También guardar en localStorage
        const foods = this.getLocalCustomFoods();

        food.id = food.id || Utils.generateId();
        food.source = 'custom';
        food.createdAt = new Date().toISOString();

        foods.push(food);
        localStorage.setItem(this.KEYS.CUSTOM_FOODS, JSON.stringify(foods));

        return food;
    },

    // ==========================================
    // Recent Foods & Favorites
    // ==========================================

    /**
     * Get recent foods
     * @param {number} limit 
     * @returns {Array}
     */
    getRecentFoods(limit = 10) {
        const data = localStorage.getItem(this.KEYS.RECENT_FOODS);
        const recent = data ? JSON.parse(data) : [];
        return recent.slice(0, limit);
    },

    /**
     * Add to recent foods
     * @param {Object|string} food 
     */
    addRecentFood(food) {
        let recent = this.getRecentFoods(20);

        // Remove if already exists
        recent = recent.filter(f => f.id !== (food.id || food));

        // Add to beginning
        recent.unshift(typeof food === 'object' ? food : { id: food });

        // Keep only last 20
        recent = recent.slice(0, 20);

        localStorage.setItem(this.KEYS.RECENT_FOODS, JSON.stringify(recent));
    },

    /**
     * Get favorites
     * @returns {Promise<Array>}
     */
    async getFavorites() {
        // Intentar con Supabase primero
        if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
            const favorites = await SupabaseService.getFavorites();
            if (favorites.length > 0) {
                return favorites.map(f => f.foods);
            }
        }

        const data = localStorage.getItem(this.KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Toggle favorite
     * @param {Object} food 
     * @returns {Promise<boolean>} Is now favorite
     */
    async toggleFavorite(food) {
        let favorites = await this.getFavorites();
        const index = favorites.findIndex(f => f.id === food.id);

        if (index === -1) {
            // Agregar a favoritos
            if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
                await SupabaseService.addFavorite(food.id);
            }
            favorites.push(food);
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            return true;
        } else {
            // Eliminar de favoritos
            if (typeof SupabaseService !== 'undefined' && SupabaseService.isAvailable()) {
                await SupabaseService.removeFavorite(food.id);
            }
            favorites.splice(index, 1);
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            return false;
        }
    },

    // ==========================================
    // Export Data
    // ==========================================

    /**
     * Export all data as CSV
     * @returns {Promise<string>}
     */
    async exportToCSV() {
        const allEntries = this.getAllLocalFoodEntries();
        const profile = this.getLocalProfile();

        let csv = 'Fecha,Comida,Alimento,Cantidad,Unidad,Calorías,Proteína,Carbohidratos,Grasas\n';

        Object.keys(allEntries).sort().forEach(dateKey => {
            const entries = allEntries[dateKey];
            entries.forEach(entry => {
                csv += `${dateKey},${entry.mealType || ''},${entry.foodName || ''},${entry.quantity || ''},${entry.unit || 'g'},${entry.calories || 0},${entry.protein || 0},${entry.carbs || 0},${entry.fat || 0}\n`;
            });
        });

        return csv;
    },

    /**
     * Download data as CSV file
     */
    async downloadCSV() {
        const csv = await this.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `calorietracker_export_${Utils.getDateKey(new Date())}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // ==========================================
    // Clear Data
    // ==========================================

    /**
     * Clear all app data (for testing/reset)
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this._cache = { user: null, profile: null };
    }
};

// Initialize storage
Storage.init();

// Make Storage available globally
window.Storage = Storage;
