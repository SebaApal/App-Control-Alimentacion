/**
 * CalorieTracker - Supabase Client Module
 * Manejo de conexión y operaciones con Supabase
 */

// Configuración de Supabase
const SUPABASE_URL = 'https://essvmsmelsjpbyaemhns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc3Ztc21lbHNqcGJ5YWVtaG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDkyOTcsImV4cCI6MjA4NTM4NTI5N30.7Cc5Bp_mkPGleAoibvMp7MQ4oUeGf48k2r2z776H-nY';

// Cliente Supabase (se inicializa después de cargar el script)
let supabaseClient = null;

const SupabaseService = {
    /**
     * Inicializar cliente Supabase
     */
    init() {
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized');
            return true;
        } else {
            console.warn('⚠️ Supabase library not loaded, using localStorage fallback');
            return false;
        }
    },

    /**
     * Verificar si Supabase está disponible
     */
    isAvailable() {
        return supabaseClient !== null;
    },

    /**
     * Obtener el cliente Supabase
     */
    getClient() {
        return supabaseClient;
    },

    // ==========================================
    // Autenticación
    // ==========================================

    /**
     * Registrar nuevo usuario
     * @param {string} email 
     * @param {string} password 
     * @param {string} name 
     * @returns {Promise<Object>}
     */
    async signUp(email, password, name) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return {
                success: true,
                user: data.user,
                session: data.session,
                message: data.user?.identities?.length === 0
                    ? 'Este email ya está registrado'
                    : 'Cuenta creada exitosamente'
            };
        } catch (err) {
            console.error('SignUp error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Iniciar sesión
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async signIn(email, password) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (err) {
            console.error('SignIn error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Cerrar sesión
     * @returns {Promise<Object>}
     */
    async signOut() {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err) {
            console.error('SignOut error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Obtener usuario actual
     * @returns {Promise<Object|null>}
     */
    async getUser() {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            return user;
        } catch (err) {
            console.error('GetUser error:', err);
            return null;
        }
    },

    /**
     * Obtener sesión actual
     * @returns {Promise<Object|null>}
     */
    async getSession() {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            return session;
        } catch (err) {
            console.error('GetSession error:', err);
            return null;
        }
    },

    /**
     * Escuchar cambios de autenticación
     * @param {Function} callback 
     */
    onAuthStateChange(callback) {
        if (!this.isAvailable()) return;

        supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },

    // ==========================================
    // Perfil
    // ==========================================

    /**
     * Obtener perfil del usuario
     * @returns {Promise<Object|null>}
     */
    async getProfile() {
        if (!this.isAvailable()) return null;

        const user = await this.getUser();
        if (!user) return null;

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('GetProfile error:', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('GetProfile error:', err);
            return null;
        }
    },

    /**
     * Actualizar perfil del usuario
     * @param {Object} profileData 
     * @returns {Promise<Object>}
     */
    async updateProfile(profileData) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, profile: data };
        } catch (err) {
            console.error('UpdateProfile error:', err);
            return { success: false, error: err.message };
        }
    },

    // ==========================================
    // Food Entries
    // ==========================================

    /**
     * Obtener entradas de alimentos por fecha
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @returns {Promise<Array>}
     */
    async getFoodEntries(date) {
        if (!this.isAvailable()) return [];

        const user = await this.getUser();
        if (!user) return [];

        try {
            const { data, error } = await supabaseClient
                .from('food_entries')
                .select('*')
                .eq('user_id', user.id)
                .eq('entry_date', date)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('GetFoodEntries error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('GetFoodEntries error:', err);
            return [];
        }
    },

    /**
     * Agregar entrada de alimento
     * @param {Object} entry 
     * @returns {Promise<Object>}
     */
    async addFoodEntry(entry) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const { data, error } = await supabaseClient
                .from('food_entries')
                .insert({
                    user_id: user.id,
                    food_id: entry.foodId || null,
                    food_name: entry.foodName,
                    meal_type: entry.mealType,
                    quantity: entry.quantity,
                    unit: entry.unit || 'g',
                    calories: entry.calories,
                    protein: entry.protein,
                    carbs: entry.carbs,
                    fat: entry.fat,
                    entry_date: entry.entryDate || new Date().toISOString().split('T')[0]
                })
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, entry: data };
        } catch (err) {
            console.error('AddFoodEntry error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Eliminar entrada de alimento
     * @param {string} entryId 
     * @returns {Promise<Object>}
     */
    async deleteFoodEntry(entryId) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        try {
            const { error } = await supabaseClient
                .from('food_entries')
                .delete()
                .eq('id', entryId);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err) {
            console.error('DeleteFoodEntry error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Obtener entradas por rango de fechas
     * @param {string} startDate 
     * @param {string} endDate 
     * @returns {Promise<Array>}
     */
    async getFoodEntriesRange(startDate, endDate) {
        if (!this.isAvailable()) return [];

        const user = await this.getUser();
        if (!user) return [];

        try {
            const { data, error } = await supabaseClient
                .from('food_entries')
                .select('*')
                .eq('user_id', user.id)
                .gte('entry_date', startDate)
                .lte('entry_date', endDate)
                .order('entry_date', { ascending: true });

            if (error) {
                console.error('GetFoodEntriesRange error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('GetFoodEntriesRange error:', err);
            return [];
        }
    },

    // ==========================================
    // Weight Entries
    // ==========================================

    /**
     * Obtener historial de peso
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getWeightEntries(limit = 30) {
        if (!this.isAvailable()) return [];

        const user = await this.getUser();
        if (!user) return [];

        try {
            const { data, error } = await supabaseClient
                .from('weight_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('entry_date', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('GetWeightEntries error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('GetWeightEntries error:', err);
            return [];
        }
    },

    /**
     * Agregar entrada de peso
     * @param {number} weight 
     * @param {string} date 
     * @returns {Promise<Object>}
     */
    async addWeightEntry(weight, date = null) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        const entryDate = date || new Date().toISOString().split('T')[0];

        try {
            // Upsert para permitir actualizar si ya existe para esa fecha
            const { data, error } = await supabaseClient
                .from('weight_entries')
                .upsert({
                    user_id: user.id,
                    weight: parseFloat(weight),
                    entry_date: entryDate
                }, {
                    onConflict: 'user_id,entry_date'
                })
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            // También actualizar el peso en el perfil
            await this.updateProfile({ weight: parseFloat(weight) });

            return { success: true, entry: data };
        } catch (err) {
            console.error('AddWeightEntry error:', err);
            return { success: false, error: err.message };
        }
    },

    // ==========================================
    // Custom Foods
    // ==========================================

    /**
     * Obtener alimentos personalizados del usuario
     * @returns {Promise<Array>}
     */
    async getCustomFoods() {
        if (!this.isAvailable()) return [];

        const user = await this.getUser();
        if (!user) return [];

        try {
            const { data, error } = await supabaseClient
                .from('foods')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('GetCustomFoods error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('GetCustomFoods error:', err);
            return [];
        }
    },

    /**
     * Agregar alimento personalizado
     * @param {Object} food 
     * @returns {Promise<Object>}
     */
    async addCustomFood(food) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const { data, error } = await supabaseClient
                .from('foods')
                .insert({
                    user_id: user.id,
                    name: food.name,
                    brand: food.brand || null,
                    barcode: food.barcode || null,
                    calories: food.calories || 0,
                    protein: food.protein || 0,
                    carbs: food.carbs || 0,
                    fat: food.fat || 0,
                    fiber: food.fiber || 0,
                    serving_size: food.servingSize || 100,
                    serving_unit: food.servingUnit || 'g',
                    category: food.category || null,
                    source: 'custom'
                })
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, food: data };
        } catch (err) {
            console.error('AddCustomFood error:', err);
            return { success: false, error: err.message };
        }
    },

    // ==========================================
    // Foods Database Queries
    // ==========================================

    /**
     * Obtener todos los alimentos de la base de datos
     * @param {string} category - Filtrar por categoría (opcional)
     * @returns {Promise<Array>}
     */
    async fetchAllFoods(category = null) {
        if (!this.isAvailable()) return [];

        try {
            let query = supabaseClient
                .from('foods')
                .select('*')
                .eq('is_verified', true)
                .order('name', { ascending: true });

            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                console.error('FetchAllFoods error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('FetchAllFoods error:', err);
            return [];
        }
    },

    /**
     * Buscar alimentos en la base de datos por texto
     * @param {string} searchQuery - Texto de búsqueda
     * @returns {Promise<Array>}
     */
    async searchFoodsInDB(searchQuery) {
        if (!this.isAvailable() || !searchQuery || searchQuery.length < 2) return [];

        try {
            const { data, error } = await supabaseClient
                .from('foods')
                .select('*')
                .ilike('name', `%${searchQuery}%`)
                .order('name', { ascending: true })
                .limit(50);

            if (error) {
                console.error('SearchFoodsInDB error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('SearchFoodsInDB error:', err);
            return [];
        }
    },

    /**
     * Obtener alimentos por categoría
     * @param {string} category 
     * @returns {Promise<Array>}
     */
    async getFoodsByCategory(category) {
        return this.fetchAllFoods(category);
    },

    /**
     * Matchear alimentos detectados por IA contra la base de datos
     * Busca coincidencias parciales para cada nombre de alimento detectado
     * @param {Array<string>} detectedFoodNames - Nombres detectados por la IA
     * @returns {Promise<Array>} - Alimentos encontrados con sus datos nutricionales
     */
    async matchFoodsFromAI(detectedFoodNames) {
        if (!this.isAvailable() || !detectedFoodNames || detectedFoodNames.length === 0) return [];

        try {
            const results = [];

            for (const foodName of detectedFoodNames) {
                const { data, error } = await supabaseClient
                    .from('foods')
                    .select('*')
                    .ilike('name', `%${foodName}%`)
                    .limit(3);

                if (!error && data && data.length > 0) {
                    results.push({
                        detected: foodName,
                        matches: data
                    });
                }
            }

            return results;
        } catch (err) {
            console.error('MatchFoodsFromAI error:', err);
            return [];
        }
    },

    // ==========================================
    // Favorites
    // ==========================================

    /**
     * Obtener favoritos del usuario
     * @returns {Promise<Array>}
     */
    async getFavorites() {
        if (!this.isAvailable()) return [];

        const user = await this.getUser();
        if (!user) return [];

        try {
            const { data, error } = await supabaseClient
                .from('favorites')
                .select(`
                    id,
                    food_id,
                    foods (*)
                `)
                .eq('user_id', user.id);

            if (error) {
                console.error('GetFavorites error:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('GetFavorites error:', err);
            return [];
        }
    },

    /**
     * Agregar a favoritos
     * @param {string} foodId 
     * @returns {Promise<Object>}
     */
    async addFavorite(foodId) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const { data, error } = await supabaseClient
                .from('favorites')
                .insert({
                    user_id: user.id,
                    food_id: foodId
                })
                .select()
                .single();

            if (error) {
                // Si ya existe, no es error
                if (error.code === '23505') {
                    return { success: true, alreadyExists: true };
                }
                return { success: false, error: error.message };
            }

            return { success: true, favorite: data };
        } catch (err) {
            console.error('AddFavorite error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Eliminar de favoritos
     * @param {string} foodId 
     * @returns {Promise<Object>}
     */
    async removeFavorite(foodId) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Supabase no disponible' };
        }

        const user = await this.getUser();
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            const { error } = await supabaseClient
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('food_id', foodId);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err) {
            console.error('RemoveFavorite error:', err);
            return { success: false, error: err.message };
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que el script de Supabase cargue
    setTimeout(() => {
        SupabaseService.init();
    }, 100);
});

// Hacer disponible globalmente
window.SupabaseService = SupabaseService;
