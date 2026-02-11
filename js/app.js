/**
 * CalorieTracker - Main Application
 * Orquestación principal de la aplicación
 */

const App = {
    // Current state
    currentDate: new Date(),
    currentView: 'dashboard',
    currentMealType: 'breakfast',
    selectedFood: null,

    /**
     * Initialize the application
     */
    async init() {
        console.log('🚀 Initializing CalorieTracker...');

        // Initialize storage
        Storage.init();

        // Wait for Supabase to initialize
        await new Promise(resolve => setTimeout(resolve, 200));

        // Setup event listeners first
        this.setupEventListeners();

        // Check authentication state
        await this.checkAuthState();

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 300);
    },

    /**
     * Check user authentication state
     */
    async checkAuthState() {
        const isLoggedIn = await Storage.isLoggedIn();

        if (isLoggedIn) {
            const hasProfile = await Storage.hasCompleteProfile();
            if (hasProfile) {
                await this.showMainApp();
            } else {
                this.showOnboarding();
            }
        } else {
            this.showAuthScreen();
        }
    },

    /**
     * Show authentication screen
     */
    showAuthScreen() {
        this.hideAllScreens();
        document.getElementById('auth-screen').classList.remove('hidden');
    },

    /**
     * Show onboarding screen
     */
    showOnboarding() {
        this.hideAllScreens();
        document.getElementById('onboarding-screen').classList.remove('hidden');
    },

    /**
     * Show main app
     */
    async showMainApp() {
        this.hideAllScreens();
        document.getElementById('main-app').classList.remove('hidden');

        // Load user data
        await this.loadUserData();

        // Update dashboard
        await this.updateDashboard();

        // Update date display
        this.updateDateDisplay();
    },

    /**
     * Hide all screens
     */
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Auth form listeners
        this.setupAuthListeners();

        // Onboarding listeners
        this.setupOnboardingListeners();

        // Navigation listeners
        this.setupNavigationListeners();

        // Dashboard listeners
        this.setupDashboardListeners();

        // Add food listeners
        this.setupAddFoodListeners();

        // Modal listeners
        this.setupModalListeners();

        // Profile listeners
        this.setupProfileListeners();

        // Progress listeners
        this.setupProgressListeners();
    },

    // ==========================================
    // Auth Listeners
    // ==========================================
    setupAuthListeners() {
        // Switch between login and register
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });

        // Login button
        document.getElementById('login-btn')?.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Show loading state
            const btn = document.getElementById('login-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Cargando...';
            btn.disabled = true;

            try {
                const result = await Storage.authenticate(email, password, '', false);

                if (result.success) {
                    Utils.showToast('¡Bienvenido!', 'success');
                    await this.checkAuthState();
                } else {
                    Utils.showToast(result.error, 'error');
                }
            } catch (err) {
                Utils.showToast('Error de conexión', 'error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });

        // Register button
        document.getElementById('register-btn')?.addEventListener('click', async () => {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            // Show loading state
            const btn = document.getElementById('register-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Cargando...';
            btn.disabled = true;

            try {
                const result = await Storage.authenticate(email, password, name, true);

                if (result.success) {
                    Utils.showToast('¡Cuenta creada exitosamente!', 'success');
                    await this.checkAuthState();
                } else {
                    Utils.showToast(result.error, 'error');
                }
            } catch (err) {
                Utils.showToast('Error de conexión', 'error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    },

    // ==========================================
    // Onboarding Listeners
    // ==========================================
    setupOnboardingListeners() {
        // Step 1 - Personal Data
        document.getElementById('onboarding-next-1')?.addEventListener('click', () => {
            const weight = parseFloat(document.getElementById('profile-weight').value);
            const height = parseFloat(document.getElementById('profile-height').value);
            const age = parseInt(document.getElementById('profile-age').value);
            const sex = document.getElementById('profile-sex').value;

            if (!weight || !height || !age || !sex) {
                Utils.showToast('Por favor completa todos los campos', 'warning');
                return;
            }

            // Save temp data
            this.tempProfile = { weight, height, age, sex };

            // Move to step 2
            this.goToOnboardingStep(2);
        });

        // Step 2 - Activity Level
        document.getElementById('onboarding-back-2')?.addEventListener('click', () => {
            this.goToOnboardingStep(1);
        });

        document.getElementById('onboarding-next-2')?.addEventListener('click', () => {
            const activityLevel = document.querySelector('input[name="activity"]:checked')?.value;

            if (!activityLevel) {
                Utils.showToast('Selecciona tu nivel de actividad', 'warning');
                return;
            }

            this.tempProfile.activityLevel = activityLevel;
            this.goToOnboardingStep(3);
        });

        // Step 3 - Goal
        document.getElementById('onboarding-back-3')?.addEventListener('click', () => {
            this.goToOnboardingStep(2);
        });

        // Goal selection
        document.querySelectorAll('input[name="goal"]').forEach(input => {
            input.addEventListener('change', () => {
                this.tempProfile.goal = input.value;
                this.updateCalculationsPreview();
            });
        });

        // Complete onboarding
        document.getElementById('onboarding-complete')?.addEventListener('click', async () => {
            const goal = document.querySelector('input[name="goal"]:checked')?.value;

            if (!goal) {
                Utils.showToast('Selecciona tu objetivo', 'warning');
                return;
            }

            this.tempProfile.goal = goal;

            // Calculate and save profile
            const profile = await Storage.updateProfileWithCalculations(this.tempProfile);

            Utils.showToast('¡Perfil configurado!', 'success');
            await this.showMainApp();
        });
    },

    /**
     * Go to specific onboarding step
     */
    goToOnboardingStep(step) {
        // Hide all steps
        document.querySelectorAll('.onboarding-step').forEach(s => s.classList.add('hidden'));

        // Show target step
        document.getElementById(`onboarding-step-${step}`).classList.remove('hidden');

        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 < step) {
                indicator.classList.add('completed');
            } else if (index + 1 === step) {
                indicator.classList.add('active');
            }
        });
    },

    /**
     * Update calculations preview in onboarding
     */
    updateCalculationsPreview() {
        const preview = document.getElementById('calculations-preview');
        if (!this.tempProfile.goal) {
            preview.classList.add('hidden');
            return;
        }

        const calculations = Calculations.calculateAll(this.tempProfile);

        document.getElementById('preview-tmb').textContent = calculations.tmb;
        document.getElementById('preview-get').textContent = calculations.get;
        document.getElementById('preview-target').textContent = calculations.calorieTarget;
        document.getElementById('preview-protein').textContent = calculations.proteinTarget;
        document.getElementById('preview-carbs').textContent = calculations.carbsTarget;
        document.getElementById('preview-fat').textContent = calculations.fatTarget;

        preview.classList.remove('hidden');
    },

    // ==========================================
    // Navigation Listeners
    // ==========================================
    setupNavigationListeners() {
        // Bottom nav items
        document.querySelectorAll('.nav-item[data-view]').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);

                // Update active state
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Add food FAB
        document.getElementById('add-food-fab')?.addEventListener('click', () => {
            this.switchView('add-food');
        });

        // Date navigation
        document.getElementById('date-prev')?.addEventListener('click', () => {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.updateDateDisplay();
            this.updateDashboard();
        });

        document.getElementById('date-next')?.addEventListener('click', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (this.currentDate < tomorrow) {
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                this.updateDateDisplay();
                this.updateDashboard();
            }
        });
    },

    /**
     * Switch view
     */
    switchView(viewName) {
        // Hide all views - remove active and add hidden
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
            v.classList.add('hidden');
        });

        // Show target view - add active and remove hidden
        const view = document.getElementById(`${viewName}-view`);
        if (view) {
            view.classList.remove('hidden');
            view.classList.add('active');
            this.currentView = viewName;

            // Trigger view-specific updates
            if (viewName === 'dashboard') {
                this.updateDashboard();
            } else if (viewName === 'progress') {
                this.updateProgressView();
            } else if (viewName === 'profile') {
                this.updateProfileView();
            } else if (viewName === 'recipes') {
                this.updateRecipesView();
            } else if (viewName === 'add-food') {
                this.setupAddFoodView();
            }
        }
    },

    /**
     * Setup add food view
     */
    setupAddFoodView() {
        // Clear previous search
        const searchInput = document.getElementById('food-search');
        if (searchInput) searchInput.value = '';

        const results = document.getElementById('search-results');
        if (results) results.innerHTML = '';

        // Show recent foods by default
        this.showRecentFoods();
    },


    // ==========================================
    // Dashboard
    // ==========================================
    setupDashboardListeners() {
        // User avatar click -> profile
        document.getElementById('user-avatar')?.addEventListener('click', () => {
            this.switchView('profile');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-item[data-view="profile"]')?.classList.add('active');
        });
    },

    /**
     * Load user data
     */
    async loadUserData() {
        const user = await Storage.getUser();
        const profile = await Storage.getProfile();

        if (user) {
            // Update avatar
            const initial = (user.name || user.email)[0].toUpperCase();
            document.getElementById('user-initial').textContent = initial;
            document.getElementById('profile-initial').textContent = initial;
        }
    },

    /**
     * Update date display
     */
    updateDateDisplay() {
        document.getElementById('current-date').textContent = Utils.formatDate(this.currentDate);
    },

    /**
     * Update dashboard with current data
     */
    async updateDashboard() {
        // Try to get profile from cache/localStorage first for speed
        let profile = Storage.getLocalProfile();

        // If no local profile, try async
        if (!profile) {
            profile = await Storage.getProfile();
        }

        if (!profile) return;

        // Get totals - use sync first, async will update
        let totals = Storage.getDailyTotalsSync(this.currentDate);
        const calorieTarget = profile.calorieTarget || 2000;

        // Update calorie circle
        const consumed = totals.calories;
        const remaining = Math.max(0, calorieTarget - consumed);
        const progress = Math.min((consumed / calorieTarget) * 100, 100);

        document.getElementById('calories-consumed').textContent = consumed;
        document.getElementById('calorie-remaining').textContent = `de ${calorieTarget} kcal`;

        // Update circle progress (circumference = 2 * π * r = 2 * 3.14159 * 85 ≈ 534)
        const circumference = 534;
        const offset = circumference - (progress / 100) * circumference;
        document.getElementById('calorie-progress').style.strokeDashoffset = offset;

        // Update macros
        this.updateMacroBar('protein', totals.protein, profile.proteinTarget || 150);
        this.updateMacroBar('carbs', totals.carbs, profile.carbsTarget || 250);
        this.updateMacroBar('fat', totals.fat, profile.fatTarget || 65);

        // Update journal
        await this.updateJournalEntries();

        // Update micronutrients
        const isHighIntensity = document.getElementById('high-intensity-toggle')?.checked || false;
        this.updateMicronutrients(profile.activityLevel, isHighIntensity);

        // Setup high intensity toggle listener (only once)
        const toggle = document.getElementById('high-intensity-toggle');
        if (toggle && !toggle.hasAttribute('data-listener-attached')) {
            toggle.setAttribute('data-listener-attached', 'true');
            toggle.addEventListener('change', (e) => {
                this.updateMicronutrients(profile.activityLevel, e.target.checked);
            });
        }
    },

    /**
     * Update macro progress bar
     */
    updateMacroBar(macro, consumed, target) {
        const percentage = Math.min((consumed / target) * 100, 100);

        document.getElementById(`${macro}-consumed`).textContent = Math.round(consumed);
        document.getElementById(`${macro}-target`).textContent = target;
        document.getElementById(`${macro}-progress`).style.width = `${percentage}%`;
    },

    /**
     * Update micronutrients display
     */
    updateMicronutrients(activityLevel, isHighIntensity = false) {
        const container = document.getElementById('micros-grid');
        if (!container) return;

        const micros = Calculations.calculateMicronutrients(activityLevel, isHighIntensity);

        // Icons for each micronutrient
        const icons = {
            magnesium: '💊',
            zinc: '🧬',
            vitaminD3: '☀️',
            omega3: '🐟',
            sodium: '🧂',
            potassium: '🍌'
        };

        const iconClasses = {
            magnesium: 'magnesium',
            zinc: 'zinc',
            vitaminD3: 'vitamind',
            omega3: 'omega3',
            sodium: 'sodium',
            potassium: 'potassium'
        };

        container.innerHTML = '';

        Object.keys(micros).forEach(key => {
            const micro = micros[key];
            const isElectrolyte = key === 'sodium' || key === 'potassium';
            const highlight = isHighIntensity && isElectrolyte;

            const card = document.createElement('div');
            card.className = `micro-card${highlight ? ' highlight' : ''}`;

            card.innerHTML = `
                <div class="micro-header">
                    <span class="micro-icon ${iconClasses[key]}">${icons[key]}</span>
                    <span class="micro-name">${micro.name}</span>
                </div>
                <div class="micro-value">
                    ${micro.min === micro.max ? micro.min : `${micro.min}-${micro.max}`}
                    <span class="micro-unit">${micro.unit}</span>
                </div>
                <div class="micro-note">${micro.note}</div>
            `;

            container.appendChild(card);
        });
    },

    /**
     * Update journal entries
     */
    async updateJournalEntries() {
        const entries = await Storage.getFoodEntries(this.currentDate);
        const container = document.getElementById('journal-entries');
        const emptyState = document.getElementById('empty-journal');

        if (entries.length === 0) {
            emptyState.classList.remove('hidden');
            // Remove any previous entries
            container.querySelectorAll('.journal-entry').forEach(e => e.remove());
            return;
        }

        emptyState.classList.add('hidden');

        // Clear previous entries
        container.querySelectorAll('.journal-entry').forEach(e => e.remove());

        // Add entries
        entries.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'journal-entry';
            entryEl.dataset.id = entry.id;

            const bgStyle = Utils.getFoodImage(entry.foodName);

            entryEl.innerHTML = `
                <div class="entry-image" style="background: ${bgStyle}">
                    <span class="entry-meal-badge">${Utils.getMealLabel(entry.mealType)}</span>
                </div>
                <div class="entry-content">
                    <div class="entry-name">${entry.foodName}</div>
                    <div class="entry-calories">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        </svg>
                        ${entry.calories} kcal
                    </div>
                </div>
            `;

            entryEl.addEventListener('click', () => {
                this.showEntryOptions(entry);
            });

            container.appendChild(entryEl);
        });
    },

    /**
     * Show entry options (delete)
     */
    async showEntryOptions(entry) {
        if (confirm(`¿Eliminar "${entry.foodName}" del registro?`)) {
            await Storage.deleteFoodEntry(entry.id, this.currentDate);
            await this.updateDashboard();
            Utils.showToast('Registro eliminado', 'success');
        }
    },

    // ==========================================
    // Add Food
    // ==========================================
    setupAddFoodListeners() {
        // Close add food view
        document.getElementById('close-add-food')?.addEventListener('click', () => {
            this.switchView('dashboard');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-item[data-view="dashboard"]')?.classList.add('active');
        });

        // Meal type selector
        document.querySelectorAll('.meal-type').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.meal-type').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMealType = btn.dataset.meal;
            });
        });

        // Food search
        const searchInput = document.getElementById('food-search');
        searchInput?.addEventListener('input', Utils.debounce(() => {
            this.searchFoods(searchInput.value);
        }, 300));

        // Add custom food button
        document.getElementById('add-custom-food')?.addEventListener('click', () => {
            this.showModal('custom-food-modal');
        });

        // Recent foods button
        document.getElementById('recent-foods-btn')?.addEventListener('click', () => {
            this.showRecentFoods();
        });

        // Favorites button
        document.getElementById('favorites-btn')?.addEventListener('click', () => {
            this.showFavorites();
        });

        // Barcode scan button
        document.getElementById('barcode-scan-btn')?.addEventListener('click', () => {
            Utils.showToast('Escaneo de código de barras próximamente', 'warning');
        });

        // AI Photo Recognition button
        document.getElementById('ai-photo-btn')?.addEventListener('click', () => {
            document.getElementById('ai-photo-input')?.click();
        });

        document.getElementById('ai-photo-input')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.processAIPhoto(file);
            }
        });
    },

    /**
     * Process photo with AI recognition
     * Sends image to Supabase Edge Function → Gemini Vision API
     */
    processAIPhoto(file) {
        const overlay = document.getElementById('dynamic-overlay');
        overlay.innerHTML = `
            <div class="modal ai-analysis-modal">
                <div class="ai-analysis-content">
                    <div class="ai-loading">
                        <div class="ai-loading-spinner"></div>
                        <p>Analizando imagen con IA...</p>
                        <span style="color: var(--text-muted); font-size: 12px;">Identificando alimentos en tu plato</span>
                    </div>
                </div>
            </div>
        `;
        overlay.classList.remove('hidden');

        // Convert image to base64 and send to Edge Function
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64Image = e.target.result;

            try {
                const supabaseUrl = SupabaseService.getProjectUrl ? SupabaseService.getProjectUrl() : null;
                const url = supabaseUrl
                    ? `${supabaseUrl}/functions/v1/analyze-food-image`
                    : 'https://essvmsmelsjpbyaemhns.supabase.co/functions/v1/analyze-food-image';

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image })
                });

                const data = await response.json();

                if (data.error) {
                    console.error('AI analysis error:', data.error);
                    Utils.showToast('Error al analizar la imagen. Intentá de nuevo.', 'error');
                    overlay.classList.add('hidden');
                    overlay.innerHTML = '';
                    return;
                }

                const detectedFoods = data.foods || [];
                if (detectedFoods.length === 0) {
                    Utils.showToast('No se detectaron alimentos en la imagen. Probá con otra foto.', 'warning');
                    overlay.classList.add('hidden');
                    overlay.innerHTML = '';
                    return;
                }

                await this.showAIResults(detectedFoods);
            } catch (err) {
                console.error('AI photo processing error:', err);
                Utils.showToast('Error de conexión con el servicio de IA', 'error');
                overlay.classList.add('hidden');
                overlay.innerHTML = '';
            }
        };
        reader.readAsDataURL(file);
    },

    /**
     * Show AI recognition results
     * Receives actual detected foods from AI and matches against Supabase database
     * @param {Array} aiDetections - Array of {name, confidence, estimated_grams}
     */
    async showAIResults(aiDetections) {
        const detectedNames = aiDetections.map(d => d.name);

        // Try to match against Supabase database first
        let detectedFoods = [];

        if (SupabaseService.isAvailable()) {
            try {
                const aiMatches = await SupabaseService.matchFoodsFromAI(detectedNames);
                detectedFoods = aiDetections.map(det => {
                    const match = aiMatches.find(m => m.detected.toLowerCase() === det.name.toLowerCase());
                    const food = match && match.matches.length > 0 ? match.matches[0] : null;
                    return {
                        name: det.name,
                        confidence: det.confidence,
                        estimatedGrams: det.estimated_grams || 100,
                        food: food ? {
                            id: food.id,
                            name: food.name,
                            calories: food.calories,
                            protein: food.protein,
                            carbs: food.carbs,
                            fat: food.fat,
                            fiber: food.fiber,
                            servingSize: food.serving_size,
                            category: food.category,
                            source: 'supabase'
                        } : null
                    };
                });
            } catch (err) {
                console.warn('AI Supabase match failed, falling back to local:', err);
            }
        }

        // Fallback to local FoodsDatabase if Supabase didn't work
        if (detectedFoods.length === 0) {
            detectedFoods = aiDetections.map(det => {
                const results = FoodsDatabase.search(det.name);
                return {
                    name: det.name,
                    confidence: det.confidence,
                    estimatedGrams: det.estimated_grams || 100,
                    food: results.length > 0 ? results[0] : null
                };
            });
        }

        const overlay = document.getElementById('dynamic-overlay');
        overlay.innerHTML = `
            <div class="modal ai-analysis-modal">
                <div class="modal-header">
                    <h3>🤖 Alimentos detectados</h3>
                    <button class="close-btn" id="close-ai-modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="ai-analysis-content">
                    <p style="color: var(--text-muted); margin-bottom: var(--space-lg);">
                        Toca cada alimento para agregarlo a tu registro
                    </p>
                    <div class="ai-results">
                        ${detectedFoods.map(item => `
                            <div class="ai-food-suggestion" data-food-id="${item.food?.id || ''}" data-food-name="${item.name}" data-food-json='${item.food ? JSON.stringify(item.food) : ''}'>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600;">${item.food?.name || item.name}</div>
                                    <div class="ai-confidence">Confianza: ${item.confidence}% · ~${item.estimatedGrams}g</div>
                                </div>
                                <div style="color: var(--primary); font-weight: 600;">
                                    ${item.food ? Math.round(item.food.calories * (item.estimatedGrams / 100)) : '~150'} kcal
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--border-color);">
                        <button class="btn-secondary btn-full" id="ai-add-all">
                            Agregar todos los detectados
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event listeners for results
        document.getElementById('close-ai-modal')?.addEventListener('click', () => {
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
        });

        // Click on individual food suggestion
        document.querySelectorAll('.ai-food-suggestion').forEach(el => {
            el.addEventListener('click', () => {
                const foodJson = el.dataset.foodJson;
                const foodName = el.dataset.foodName;

                if (foodJson) {
                    try {
                        const food = JSON.parse(foodJson);
                        overlay.classList.add('hidden');
                        overlay.innerHTML = '';
                        this.selectFood(food);
                    } catch (e) {
                        Utils.showToast(`No se pudo procesar ${foodName}`, 'warning');
                    }
                } else {
                    Utils.showToast(`${foodName} no está en la base de datos. Podés crearlo manualmente.`, 'warning');
                }
            });
        });

        // Add all detected foods
        document.getElementById('ai-add-all')?.addEventListener('click', async () => {
            for (const item of detectedFoods) {
                if (item.food) {
                    const grams = item.estimatedGrams || item.food.servingSize || 100;
                    const entry = {
                        id: Utils.generateId(),
                        foodId: item.food.id,
                        foodName: item.food.name,
                        mealType: this.currentMealType || 'lunch',
                        quantity: grams,
                        unit: 'g',
                        calories: Math.round(item.food.calories * (grams / 100)),
                        protein: Math.round(item.food.protein * (grams / 100)),
                        carbs: Math.round(item.food.carbs * (grams / 100)),
                        fat: Math.round(item.food.fat * (grams / 100)),
                        timestamp: new Date().toISOString()
                    };
                    await Storage.addFoodEntry(entry, this.currentDate);
                }
            }

            Utils.showToast(`${detectedFoods.filter(f => f.food).length} alimentos agregados al diario`, 'success');
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
            this.switchView('dashboard');
        });
    },


    /**
     * Search foods - queries both Supabase and local database
     */
    async searchFoods(query) {
        let results = FoodsDatabase.search(query);

        // Also search Supabase if available
        if (SupabaseService.isAvailable() && query.length >= 2) {
            try {
                const supabaseResults = await SupabaseService.searchFoodsInDB(query);
                // Map Supabase results to match local format
                const mapped = supabaseResults.map(f => ({
                    id: f.id,
                    name: f.name,
                    brand: f.brand,
                    category: f.category,
                    calories: f.calories,
                    protein: f.protein,
                    carbs: f.carbs,
                    fat: f.fat,
                    fiber: f.fiber,
                    servingSize: f.serving_size,
                    source: 'supabase'
                }));
                // Merge and deduplicate by name (case insensitive)
                const existingNames = new Set(results.map(r => r.name.toLowerCase()));
                mapped.forEach(m => {
                    if (!existingNames.has(m.name.toLowerCase())) {
                        results.push(m);
                    }
                });
            } catch (err) {
                console.warn('Supabase search fallback:', err);
            }
        }
        const container = document.getElementById('search-results');

        container.innerHTML = '';

        if (results.length === 0 && query.length >= 2) {
            container.innerHTML = `
                <div class="empty-state" style="padding: var(--space-lg);">
                    <p>No se encontraron resultados</p>
                    <button class="btn-secondary btn-small" id="create-food-btn">Crear alimento</button>
                </div>
            `;
            document.getElementById('create-food-btn')?.addEventListener('click', () => {
                this.showModal('custom-food-modal');
                document.getElementById('custom-food-name').value = query;
            });
            return;
        }

        results.forEach(food => {
            const foodEl = document.createElement('div');
            foodEl.className = 'food-result';

            const bgStyle = Utils.getFoodImage(food.name);

            foodEl.innerHTML = `
                <div class="food-result-image" style="background: ${bgStyle}"></div>
                <div class="food-result-info">
                    <div class="food-result-name">${food.name}</div>
                    ${food.brand ? `<div class="food-result-brand">${food.brand}</div>` : ''}
                </div>
                <div class="food-result-calories">
                    <span>${food.calories}</span>
                    <span class="food-result-unit">kcal/100g</span>
                </div>
            `;

            foodEl.addEventListener('click', () => {
                this.selectFood(food);
            });

            container.appendChild(foodEl);
        });
    },

    /**
     * Show recent foods
     */
    showRecentFoods() {
        const recent = Storage.getRecentFoods();
        const container = document.getElementById('search-results');

        container.innerHTML = '<h4 style="margin-bottom: var(--space-md); color: var(--text-secondary);">Recientes</h4>';

        if (recent.length === 0) {
            container.innerHTML += '<p style="color: var(--text-muted);">No hay alimentos recientes</p>';
            return;
        }

        recent.forEach(item => {
            const food = FoodsDatabase.getById(item.id) || item;
            if (!food.name) return;

            const foodEl = document.createElement('div');
            foodEl.className = 'food-result';

            const bgStyle = Utils.getFoodImage(food.name);

            foodEl.innerHTML = `
                <div class="food-result-image" style="background: ${bgStyle}"></div>
                <div class="food-result-info">
                    <div class="food-result-name">${food.name}</div>
                </div>
                <div class="food-result-calories">
                    <span>${food.calories}</span>
                    <span class="food-result-unit">kcal/100g</span>
                </div>
            `;

            foodEl.addEventListener('click', () => {
                this.selectFood(food);
            });

            container.appendChild(foodEl);
        });
    },

    /**
     * Show favorites
     */
    showFavorites() {
        const favorites = Storage.getFavorites();
        const container = document.getElementById('search-results');

        container.innerHTML = '<h4 style="margin-bottom: var(--space-md); color: var(--text-secondary);">Favoritos</h4>';

        if (favorites.length === 0) {
            container.innerHTML += '<p style="color: var(--text-muted);">No hay favoritos guardados</p>';
            return;
        }

        favorites.forEach(food => {
            const foodEl = document.createElement('div');
            foodEl.className = 'food-result';

            const bgStyle = Utils.getFoodImage(food.name);

            foodEl.innerHTML = `
                <div class="food-result-image" style="background: ${bgStyle}"></div>
                <div class="food-result-info">
                    <div class="food-result-name">${food.name}</div>
                </div>
                <div class="food-result-calories">
                    <span>${food.calories}</span>
                    <span class="food-result-unit">kcal/100g</span>
                </div>
            `;

            foodEl.addEventListener('click', () => {
                this.selectFood(food);
            });

            container.appendChild(foodEl);
        });
    },

    /**
     * Select food to add
     */
    selectFood(food) {
        this.selectedFood = food;

        // Update modal with food data
        document.getElementById('modal-food-name').textContent = food.name;
        document.getElementById('modal-calories').textContent = food.calories;
        document.getElementById('modal-protein').textContent = food.protein;
        document.getElementById('modal-carbs').textContent = food.carbs;
        document.getElementById('modal-fat').textContent = food.fat;
        document.getElementById('food-quantity').value = food.servingSize || 100;

        // Set food image
        const bgStyle = Utils.getFoodImage(food.name);
        document.getElementById('modal-food-image').style.background = bgStyle;

        this.showModal('food-detail-modal');
    },

    // ==========================================
    // Modals
    // ==========================================
    setupModalListeners() {
        // Modal overlay click to close
        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.hideModal();
            }
        });

        // Food detail modal
        document.getElementById('close-food-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('cancel-add-food')?.addEventListener('click', () => this.hideModal());

        document.getElementById('confirm-add-food')?.addEventListener('click', () => {
            this.addFoodEntry();
        });

        // Quantity buttons
        document.getElementById('qty-minus')?.addEventListener('click', () => {
            const input = document.getElementById('food-quantity');
            const step = parseInt(input.step) || 10;
            input.value = Math.max(1, parseInt(input.value) - step);
            this.updatePortionNutrition();
        });

        document.getElementById('qty-plus')?.addEventListener('click', () => {
            const input = document.getElementById('food-quantity');
            const step = parseInt(input.step) || 10;
            input.value = parseInt(input.value) + step;
            this.updatePortionNutrition();
        });

        document.getElementById('food-quantity')?.addEventListener('input', () => {
            this.updatePortionNutrition();
        });

        document.getElementById('portion-unit')?.addEventListener('change', () => {
            this.updatePortionNutrition();
        });

        // Custom food modal
        document.getElementById('close-custom-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('cancel-custom-food')?.addEventListener('click', () => this.hideModal());

        document.getElementById('save-custom-food')?.addEventListener('click', () => {
            this.saveCustomFood();
        });

        // Weight modal
        document.getElementById('close-weight-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('cancel-weight')?.addEventListener('click', () => this.hideModal());

        document.getElementById('save-weight')?.addEventListener('click', () => {
            this.saveWeight();
        });

        // Edit profile modal
        document.getElementById('close-edit-modal')?.addEventListener('click', () => this.hideModal());
        document.getElementById('cancel-edit-profile')?.addEventListener('click', () => this.hideModal());

        document.getElementById('save-edit-profile')?.addEventListener('click', () => {
            this.saveEditedProfile();
        });
    },

    /**
     * Show modal
     */
    showModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        document.getElementById(modalId).classList.remove('hidden');
    },

    /**
     * Hide modal
     */
    hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    },

    /**
     * Update portion nutrition in modal
     */
    updatePortionNutrition() {
        if (!this.selectedFood) return;

        const quantity = parseFloat(document.getElementById('food-quantity').value) || 0;
        const unit = document.getElementById('portion-unit').value;

        const grams = Calculations.convertToGrams(quantity, unit, this.selectedFood);
        const nutrition = Calculations.calculatePortionNutrition(this.selectedFood, grams);

        document.getElementById('modal-calories').textContent = nutrition.calories;
        document.getElementById('modal-protein').textContent = nutrition.protein;
        document.getElementById('modal-carbs').textContent = nutrition.carbs;
        document.getElementById('modal-fat').textContent = nutrition.fat;
    },

    /**
     * Add food entry
     */
    async addFoodEntry() {
        if (!this.selectedFood) return;

        const quantity = parseFloat(document.getElementById('food-quantity').value) || 0;
        const unit = document.getElementById('portion-unit').value;

        const grams = Calculations.convertToGrams(quantity, unit, this.selectedFood);
        const nutrition = Calculations.calculatePortionNutrition(this.selectedFood, grams);

        const entry = {
            foodId: this.selectedFood.id,
            foodName: this.selectedFood.name,
            mealType: this.currentMealType,
            quantity: quantity,
            unit: unit,
            calories: nutrition.calories,
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat
        };

        await Storage.addFoodEntry(entry, this.currentDate);

        Utils.showToast(`${this.selectedFood.name} agregado`, 'success');
        this.hideModal();

        // Clear search
        document.getElementById('food-search').value = '';
        document.getElementById('search-results').innerHTML = '';

        // Go back to dashboard and update
        this.switchView('dashboard');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelector('.nav-item[data-view="dashboard"]')?.classList.add('active');
        await this.updateDashboard();
    },

    /**
     * Save custom food
     */
    async saveCustomFood() {
        const name = document.getElementById('custom-food-name').value.trim();
        const brand = document.getElementById('custom-food-brand').value.trim();
        const calories = parseFloat(document.getElementById('custom-calories').value) || 0;
        const protein = parseFloat(document.getElementById('custom-protein').value) || 0;
        const carbs = parseFloat(document.getElementById('custom-carbs').value) || 0;
        const fat = parseFloat(document.getElementById('custom-fat').value) || 0;

        if (!name) {
            Utils.showToast('Ingresa el nombre del alimento', 'warning');
            return;
        }

        const food = await Storage.addCustomFood({
            name,
            brand,
            calories,
            protein,
            carbs,
            fat,
            servingSize: 100
        });

        Utils.showToast('Alimento creado', 'success');
        this.hideModal();

        // Clear form
        document.getElementById('custom-food-name').value = '';
        document.getElementById('custom-food-brand').value = '';
        document.getElementById('custom-calories').value = '';
        document.getElementById('custom-protein').value = '';
        document.getElementById('custom-carbs').value = '';
        document.getElementById('custom-fat').value = '';

        // Select the new food
        this.selectFood(food);
    },

    /**
     * Save weight entry
     */
    async saveWeight() {
        const weight = parseFloat(document.getElementById('new-weight').value);

        if (!weight || weight < 30 || weight > 300) {
            Utils.showToast('Ingresa un peso válido', 'warning');
            return;
        }

        await Storage.addWeightEntry(weight);
        Utils.showToast('Peso registrado', 'success');
        this.hideModal();

        // Update views
        await this.updateProgressView();
        await this.updateProfileView();
    },

    // ==========================================
    // Profile
    // ==========================================
    setupProfileListeners() {
        document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
            this.showEditProfileModal();
        });

        document.getElementById('recalculate-goals-btn')?.addEventListener('click', async () => {
            const profile = Storage.getLocalProfile();
            if (profile) {
                const updated = await Storage.updateProfileWithCalculations(profile);
                Utils.showToast('Metas recalculadas', 'success');
                await this.updateProfileView();
                await this.updateDashboard();
            }
        });

        document.getElementById('logout-btn')?.addEventListener('click', async () => {
            if (confirm('¿Cerrar sesión?')) {
                await Storage.logout();
                Utils.showToast('Sesión cerrada', 'success');
                this.showAuthScreen();
            }
        });
    },

    /**
     * Update profile view
     */
    async updateProfileView() {
        const user = await Storage.getUser();
        const profile = await Storage.getProfile();

        if (user) {
            document.getElementById('profile-name').textContent = user.name || 'Usuario';
            document.getElementById('profile-email').textContent = user.email;
        }

        if (profile) {
            document.getElementById('stat-weight').textContent = profile.weight || '--';
            document.getElementById('stat-height').textContent = profile.height || '--';
            document.getElementById('stat-age').textContent = profile.age || '--';
            document.getElementById('stat-target').textContent = profile.calorieTarget || '--';

            document.getElementById('goal-calories').textContent = profile.calorieTarget || '--';
            document.getElementById('goal-protein').textContent = profile.proteinTarget || '--';
            document.getElementById('goal-carbs').textContent = profile.carbsTarget || '--';
            document.getElementById('goal-fat').textContent = profile.fatTarget || '--';
        }
    },

    /**
     * Show edit profile modal
     */
    async showEditProfileModal() {
        const user = await Storage.getUser();
        const profile = await Storage.getProfile();

        document.getElementById('edit-name').value = user?.name || '';
        document.getElementById('edit-weight').value = profile?.weight || '';
        document.getElementById('edit-height').value = profile?.height || '';
        document.getElementById('edit-age').value = profile?.age || '';
        document.getElementById('edit-sex').value = profile?.sex || 'male';
        document.getElementById('edit-activity').value = profile?.activityLevel || 'moderate';
        document.getElementById('edit-goal').value = profile?.goal || 'maintenance';

        this.showModal('edit-profile-modal');
    },

    /**
     * Save edited profile
     */
    async saveEditedProfile() {
        const user = await Storage.getUser();
        if (user) {
            user.name = document.getElementById('edit-name').value.trim() || user.name;
            Storage.saveUser(user);
        }

        const profile = {
            weight: parseFloat(document.getElementById('edit-weight').value),
            height: parseFloat(document.getElementById('edit-height').value),
            age: parseInt(document.getElementById('edit-age').value),
            sex: document.getElementById('edit-sex').value,
            activityLevel: document.getElementById('edit-activity').value,
            goal: document.getElementById('edit-goal').value
        };

        await Storage.updateProfileWithCalculations(profile);

        Utils.showToast('Perfil actualizado', 'success');
        this.hideModal();
        await this.loadUserData();
        await this.updateProfileView();
        await this.updateDashboard();
    },

    // ==========================================
    // Progress
    // ==========================================
    setupProgressListeners() {
        document.getElementById('log-weight-btn')?.addEventListener('click', async () => {
            const latestWeight = await Storage.getLatestWeight();
            document.getElementById('new-weight').value = latestWeight || '';
            document.getElementById('weight-date').textContent = Utils.formatDate(new Date());
            this.showModal('weight-modal');
        });

        document.getElementById('export-data-btn')?.addEventListener('click', async () => {
            await Storage.downloadCSV();
            Utils.showToast('Datos exportados', 'success');
        });

        document.getElementById('progress-period')?.addEventListener('change', () => {
            this.updateProgressView();
        });
    },

    /**
     * Update progress view
     */
    async updateProgressView() {
        const profile = await Storage.getProfile();
        const weightEntries = await Storage.getWeightEntries();
        const weeklyData = await Storage.getWeeklyData();

        // Latest weight
        const latestWeight = await Storage.getLatestWeight();
        document.getElementById('current-weight-display').textContent =
            latestWeight ? `${latestWeight} kg` : '-- kg';

        // Weekly stats
        const weeklyAverages = Calculations.calculateWeeklyAverages(weeklyData);
        const adherence = profile ?
            Calculations.calculateGoalAdherence(weeklyData, profile.calorieTarget) : 0;

        document.getElementById('avg-calories').textContent = weeklyAverages.calories || '--';
        document.getElementById('total-entries').textContent =
            Object.values(weeklyData).reduce((sum, day) => sum + (day.calories > 0 ? 1 : 0), 0);
        document.getElementById('goal-adherence').textContent = `${adherence}%`;

        // Simple chart rendering (without external library)
        this.renderSimpleCharts(weightEntries, weeklyData, profile?.calorieTarget);
    },

    /**
     * Render simple charts using canvas
     */
    renderSimpleCharts(weightEntries, weeklyData, calorieTarget) {
        // Weight chart
        const weightCanvas = document.getElementById('weight-chart');
        if (weightCanvas && weightEntries.length > 0) {
            const ctx = weightCanvas.getContext('2d');
            const width = weightCanvas.parentElement.clientWidth;
            const height = 200;

            weightCanvas.width = width;
            weightCanvas.height = height;

            ctx.clearRect(0, 0, width, height);

            const weights = weightEntries.slice(-7).map(e => e.weight);
            const minWeight = Math.min(...weights) - 1;
            const maxWeight = Math.max(...weights) + 1;
            const range = maxWeight - minWeight || 1;

            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;

            // Draw grid
            ctx.strokeStyle = '#E5E7EB';
            ctx.lineWidth = 1;

            for (let i = 0; i <= 4; i++) {
                const y = padding + (chartHeight / 4) * i;
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(width - padding, y);
                ctx.stroke();
            }

            // Draw line
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();

            weights.forEach((weight, i) => {
                const x = padding + (chartWidth / (weights.length - 1 || 1)) * i;
                const y = padding + chartHeight - ((weight - minWeight) / range) * chartHeight;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw points
            ctx.fillStyle = '#D4AF37';
            weights.forEach((weight, i) => {
                const x = padding + (chartWidth / (weights.length - 1 || 1)) * i;
                const y = padding + chartHeight - ((weight - minWeight) / range) * chartHeight;

                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Calories chart
        const caloriesCanvas = document.getElementById('calories-chart');
        if (caloriesCanvas) {
            const ctx = caloriesCanvas.getContext('2d');
            const width = caloriesCanvas.parentElement.clientWidth;
            const height = 200;

            caloriesCanvas.width = width;
            caloriesCanvas.height = height;

            ctx.clearRect(0, 0, width, height);

            const days = Object.keys(weeklyData).sort();
            const calories = days.map(d => weeklyData[d].calories);
            const maxCal = Math.max(...calories, calorieTarget || 2000);

            const padding = 40;
            const barWidth = (width - padding * 2) / 7 - 10;

            // Draw target line
            if (calorieTarget) {
                const targetY = padding + (height - padding * 2) - ((calorieTarget / maxCal) * (height - padding * 2));
                ctx.strokeStyle = '#E5E7EB';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(padding, targetY);
                ctx.lineTo(width - padding, targetY);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw bars
            days.forEach((day, i) => {
                const cal = weeklyData[day].calories;
                const barHeight = (cal / maxCal) * (height - padding * 2);
                const x = padding + i * ((width - padding * 2) / 7) + 5;
                const y = height - padding - barHeight;

                // Gradient
                const gradient = ctx.createLinearGradient(x, y, x, height - padding);
                gradient.addColorStop(0, '#D4AF37');
                gradient.addColorStop(1, '#E8C860');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 4);
                ctx.fill();

                // Day label
                ctx.fillStyle = '#6B7280';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                const dayLabel = new Date(day).toLocaleDateString('es-AR', { weekday: 'short' });
                ctx.fillText(dayLabel, x + barWidth / 2, height - 10);
            });
        }
    },

    // ==========================================
    // Recipes
    // ==========================================
    updateRecipesView() {
        const profile = Storage.getProfile();
        const userGoal = profile?.goal || 'maintenance';

        // Get recipes - prioritize those matching user's goal
        let recipes = FoodsDatabase.recipes || [];

        // Sort recipes: matching goal first
        recipes = recipes.sort((a, b) => {
            const aMatch = a.goalTag === userGoal ? 1 : 0;
            const bMatch = b.goalTag === userGoal ? 1 : 0;
            return bMatch - aMatch;
        });

        this.renderRecipes(recipes, userGoal);
        this.setupRecipeFilters();
    },

    /**
     * Render recipes to grid
     */
    renderRecipes(recipes, userGoal) {
        const container = document.getElementById('recipes-grid');
        container.innerHTML = '';

        if (recipes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🍳</span>
                    <p>No hay recetas disponibles</p>
                </div>
            `;
            return;
        }

        recipes.forEach(recipe => {
            const recipeEl = document.createElement('div');
            recipeEl.className = 'recipe-card';

            // Check if matches user goal
            const isRecommended = recipe.goalTag === userGoal;
            if (isRecommended) {
                recipeEl.classList.add('recommended');
            }

            const bgStyle = Utils.getFoodImage(recipe.name);
            const categoryEmoji = this.getCategoryEmoji(recipe.category);
            const goalLabel = this.getGoalLabel(recipe.goalTag);

            recipeEl.innerHTML = `
                <div class="recipe-image" style="background: ${bgStyle}">
                    ${isRecommended ? '<span class="recipe-badge">⭐ Recomendado</span>' : ''}
                    <span class="recipe-category-badge">${categoryEmoji}</span>
                </div>
                <div class="recipe-content">
                    <div class="recipe-name">${recipe.name}</div>
                    <div class="recipe-description">${recipe.description || ''}</div>
                    <div class="recipe-macros">
                        <span class="macro-mini protein">P: ${recipe.protein}g</span>
                        <span class="macro-mini carbs">C: ${recipe.carbs}g</span>
                        <span class="macro-mini fat">G: ${recipe.fat}g</span>
                    </div>
                    <div class="recipe-meta">
                        <span>🔥 ${recipe.calories} kcal</span>
                        <span>⏱️ ${recipe.prepTime} min</span>
                        <span class="difficulty">${recipe.difficulty || 'Fácil'}</span>
                    </div>
                    <div class="recipe-goal-tag">${goalLabel}</div>
                </div>
            `;

            recipeEl.addEventListener('click', () => {
                this.showRecipeDetail(recipe);
            });

            container.appendChild(recipeEl);
        });
    },

    /**
     * Show recipe detail modal
     */
    showRecipeDetail(recipe) {
        // Create modal content
        const modalHtml = `
            <div class="recipe-detail-modal">
                <div class="recipe-detail-header">
                    <h2>${recipe.name}</h2>
                    <button class="modal-close" id="close-recipe-modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="recipe-detail-body">
                    <p class="recipe-description-full">${recipe.description || ''}</p>
                    
                    <div class="recipe-nutrition-grid">
                        <div class="nutrition-box">
                            <span class="nutrition-value">${recipe.calories}</span>
                            <span class="nutrition-label">kcal</span>
                        </div>
                        <div class="nutrition-box protein">
                            <span class="nutrition-value">${recipe.protein}g</span>
                            <span class="nutrition-label">Proteína</span>
                        </div>
                        <div class="nutrition-box carbs">
                            <span class="nutrition-value">${recipe.carbs}g</span>
                            <span class="nutrition-label">Carbos</span>
                        </div>
                        <div class="nutrition-box fat">
                            <span class="nutrition-value">${recipe.fat}g</span>
                            <span class="nutrition-label">Grasas</span>
                        </div>
                    </div>

                    <div class="recipe-section">
                        <h3>🥗 Ingredientes</h3>
                        <ul class="ingredients-list">
                            ${(recipe.ingredients || []).map(ing => {
            if (typeof ing === 'string') {
                const food = FoodsDatabase.getById(ing);
                return `<li>${food?.name || ing}</li>`;
            } else {
                const food = FoodsDatabase.getById(ing.food);
                return `<li>${food?.name || ing.food} - ${ing.amount} ${ing.unit}</li>`;
            }
        }).join('')}
                        </ul>
                    </div>

                    ${recipe.instructions ? `
                    <div class="recipe-section">
                        <h3>👨‍🍳 Preparación</h3>
                        <ol class="instructions-list">
                            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    ` : ''}

                    <div class="recipe-info-row">
                        <span>⏱️ Tiempo: ${recipe.prepTime} min</span>
                        <span>👥 Porciones: ${recipe.servings || 1}</span>
                        <span>📊 Dificultad: ${recipe.difficulty || 'Fácil'}</span>
                    </div>
                </div>
                <div class="recipe-detail-footer">
                    <button class="btn-primary btn-full" id="add-recipe-to-journal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Agregar al diario
                    </button>
                </div>
            </div>
        `;

        // Show in dynamic overlay (separate from main modals)
        const overlay = document.getElementById('dynamic-overlay');
        overlay.innerHTML = modalHtml;
        overlay.classList.remove('hidden');

        // Close button
        document.getElementById('close-recipe-modal')?.addEventListener('click', () => {
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
        });

        // Add to journal button
        document.getElementById('add-recipe-to-journal')?.addEventListener('click', async () => {
            // Create a food entry from the recipe
            const entry = {
                id: Utils.generateId(),
                foodId: recipe.id,
                foodName: recipe.name,
                mealType: this.currentMealType || 'lunch',
                quantity: 1,
                unit: 'porción',
                calories: recipe.calories,
                protein: recipe.protein,
                carbs: recipe.carbs,
                fat: recipe.fat,
                timestamp: new Date().toISOString()
            };

            await Storage.addFoodEntry(entry, this.currentDate);
            Utils.showToast('Receta agregada al diario', 'success');
            overlay.classList.add('hidden');
            overlay.innerHTML = '';
            this.switchView('dashboard');
        });
    },

    /**
     * Get category emoji
     */
    getCategoryEmoji(category) {
        const emojis = {
            'high-protein': '💪',
            'low-calorie': '🔥',
            'vegan': '🥬',
            'vegetarian': '🥗'
        };
        return emojis[category] || '🍽️';
    },

    /**
     * Get goal label
     */
    getGoalLabel(goalTag) {
        const labels = {
            'deficit': '📉 Pérdida de peso',
            'maintenance': '⚖️ Mantenimiento',
            'surplus': '📈 Ganancia muscular'
        };
        return labels[goalTag] || '';
    },

    /**
     * Setup recipe filters
     */
    setupRecipeFilters() {
        const profile = Storage.getProfile();
        const userGoal = profile?.goal || 'maintenance';

        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const filter = chip.dataset.filter;
                let filtered;

                if (filter === 'all') {
                    filtered = FoodsDatabase.recipes;
                } else if (filter === 'recommended') {
                    filtered = FoodsDatabase.recipes.filter(r => r.goalTag === userGoal);
                } else {
                    filtered = FoodsDatabase.recipes.filter(r => r.category === filter);
                }

                this.renderRecipes(filtered, userGoal);
            });
        });
    }

};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App available globally for debugging
window.App = App;
