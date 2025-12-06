/**
 * HOLLYWOOD MOGUL - STUDIO LOT MANAGEMENT SYSTEM
 * Build your dream studio with sound stages, backlots, and special facilities
 */

window.StudioLotSystem = (function() {
    'use strict';

    // SOUND STAGES - Allow concurrent productions and provide bonuses
    const SOUND_STAGES = {
        BASIC: {
            id: 'basic_stage',
            name: 'Basic Sound Stage',
            cost: 50000,
            maintenanceCost: 2000,
            description: 'A modest sound stage for independent productions',
            benefits: {
                concurrentProductions: 1,
                productionSpeedBonus: 0,
                qualityBonus: 0
            },
            requirements: {}
        },
        PROFESSIONAL: {
            id: 'professional_stage',
            name: 'Professional Sound Stage',
            cost: 150000,
            maintenanceCost: 5000,
            description: 'State-of-the-art facility with superior acoustics and lighting',
            benefits: {
                concurrentProductions: 2,
                productionSpeedBonus: 10, // 10% faster
                qualityBonus: 3
            },
            requirements: {
                reputation: 50,
                filmsProduced: 2
            }
        },
        GRAND: {
            id: 'grand_stage',
            name: 'Grand Sound Stage',
            cost: 350000,
            maintenanceCost: 10000,
            description: 'Massive production facility capable of epic spectacles',
            benefits: {
                concurrentProductions: 3,
                productionSpeedBonus: 20, // 20% faster
                qualityBonus: 7
            },
            requirements: {
                reputation: 70,
                filmsProduced: 5,
                cash: 400000
            }
        }
    };

    // BACKLOTS - Genre-specific cost reductions
    const BACKLOTS = {
        WESTERN_TOWN: {
            id: 'western_town',
            name: 'Western Town',
            cost: 75000,
            maintenanceCost: 1500,
            description: 'Complete Old West frontier town with saloons, jail, and main street',
            benefits: {
                genreDiscount: 'Western',
                costReduction: 15, // 15% cost reduction
                qualityBonus: 5
            },
            requirements: {}
        },
        NYC_STREETS: {
            id: 'nyc_streets',
            name: 'New York Streets',
            cost: 100000,
            maintenanceCost: 2000,
            description: 'Authentic urban streets, brownstones, and storefronts',
            benefits: {
                genres: ['Crime', 'Gangster', 'Drama'],
                costReduction: 15,
                qualityBonus: 5
            },
            requirements: {
                reputation: 45
            }
        },
        JUNGLE_SET: {
            id: 'jungle_set',
            name: 'Jungle Set',
            cost: 125000,
            maintenanceCost: 2500,
            description: 'Tropical paradise with waterfalls, exotic plants, and ancient ruins',
            benefits: {
                genres: ['Adventure', 'Jungle'],
                costReduction: 15,
                qualityBonus: 5
            },
            requirements: {
                reputation: 50
            }
        },
        EUROPEAN_VILLAGE: {
            id: 'european_village',
            name: 'European Village',
            cost: 150000,
            maintenanceCost: 3000,
            description: 'Charming European streets, cafes, and period architecture',
            benefits: {
                genres: ['War', 'Romance', 'Drama'],
                costReduction: 15,
                qualityBonus: 5
            },
            requirements: {
                reputation: 55,
                filmsProduced: 3
            }
        }
    };

    // SPECIAL FACILITIES - Unique bonuses and capabilities
    const SPECIAL_FACILITIES = {
        TECHNICOLOR_LAB: {
            id: 'technicolor_lab',
            name: 'Technicolor Lab',
            cost: 200000,
            maintenanceCost: 5000,
            description: 'Revolutionary color film processing - dramatically increases box office appeal',
            benefits: {
                enablesColor: true,
                revenueBonus: 20, // 20% higher revenue for color films
                prestigeBonus: 10
            },
            requirements: {
                year: 1935, // Technicolor became viable in mid-1930s
                reputation: 60,
                cash: 250000
            }
        },
        RECORDING_STUDIO: {
            id: 'recording_studio',
            name: 'Recording Studio',
            cost: 100000,
            maintenanceCost: 3000,
            description: 'Professional sound recording and mixing - essential for talkies',
            benefits: {
                soundQualityBonus: 5,
                musicalBonus: 10, // Extra bonus for musicals
                qualityBonus: 5
            },
            requirements: {
                year: 1930, // Sound era
                reputation: 40
            }
        },
        COSTUME_DEPARTMENT: {
            id: 'costume_department',
            name: 'Costume Department',
            cost: 75000,
            maintenanceCost: 2500,
            description: 'Full wardrobe facility - faster pre-production and period film bonuses',
            benefits: {
                preProductionSpeedBonus: 20, // 20% faster pre-production
                periodFilmBonus: 10,
                qualityBonus: 3
            },
            requirements: {
                reputation: 45
            }
        },
        SCREENING_ROOM: {
            id: 'screening_room',
            name: 'Screening Room',
            cost: 50000,
            maintenanceCost: 1000,
            description: 'Private theater for test screenings and executive previews',
            benefits: {
                testScreenings: true,
                qualityInsight: true,
                reputationBonus: 5
            },
            requirements: {
                reputation: 35
            }
        }
    };

    /**
     * Initialize studio lot in game state
     */
    function initializeStudioLot(gameState) {
        if (!gameState.studioLot) {
            gameState.studioLot = {
                soundStages: [],
                backlots: [],
                specialFacilities: [],
                totalMaintenanceCost: 0,
                maxConcurrentProductions: 1 // Base: 1 production at a time
            };
        }
    }

    /**
     * Purchase a sound stage
     */
    function purchaseSoundStage(stageKey, gameState) {
        const stage = SOUND_STAGES[stageKey];
        if (!stage) {
            return { success: false, message: 'Invalid sound stage type' };
        }

        // Check if already owned
        if (hasSoundStage(stage.id, gameState)) {
            return { success: false, message: 'You already own this sound stage' };
        }

        // Check requirements
        const reqCheck = meetsRequirements(stage.requirements, gameState);
        if (!reqCheck.success) {
            return { success: false, message: reqCheck.message };
        }

        // Check if can afford
        if (gameState.cash < stage.cost) {
            return {
                success: false,
                message: `Insufficient funds. Need $${stage.cost.toLocaleString()}, have $${gameState.cash.toLocaleString()}`
            };
        }

        // Purchase the stage
        gameState.cash -= stage.cost;
        gameState.studioLot.soundStages.push({
            id: stage.id,
            name: stage.name,
            purchaseDate: new Date(gameState.currentDate),
            maintenanceCost: stage.maintenanceCost,
            benefits: stage.benefits
        });

        // Update max concurrent productions
        updateMaxConcurrentProductions(gameState);

        // Update monthly maintenance
        updateMaintenanceCosts(gameState);

        return {
            success: true,
            message: `${stage.name} purchased for $${stage.cost.toLocaleString()}!`,
            facility: stage
        };
    }

    /**
     * Purchase a backlot
     */
    function purchaseBacklot(backlotKey, gameState) {
        const backlot = BACKLOTS[backlotKey];
        if (!backlot) {
            return { success: false, message: 'Invalid backlot type' };
        }

        // Check if already owned
        if (hasBacklot(backlot.id, gameState)) {
            return { success: false, message: 'You already own this backlot' };
        }

        // Check requirements
        const reqCheck = meetsRequirements(backlot.requirements, gameState);
        if (!reqCheck.success) {
            return { success: false, message: reqCheck.message };
        }

        // Check if can afford
        if (gameState.cash < backlot.cost) {
            return {
                success: false,
                message: `Insufficient funds. Need $${backlot.cost.toLocaleString()}`
            };
        }

        // Purchase the backlot
        gameState.cash -= backlot.cost;
        gameState.studioLot.backlots.push({
            id: backlot.id,
            name: backlot.name,
            purchaseDate: new Date(gameState.currentDate),
            maintenanceCost: backlot.maintenanceCost,
            benefits: backlot.benefits
        });

        // Update monthly maintenance
        updateMaintenanceCosts(gameState);

        return {
            success: true,
            message: `${backlot.name} constructed for $${backlot.cost.toLocaleString()}!`,
            facility: backlot
        };
    }

    /**
     * Purchase a special facility
     */
    function purchaseSpecialFacility(facilityKey, gameState) {
        const facility = SPECIAL_FACILITIES[facilityKey];
        if (!facility) {
            return { success: false, message: 'Invalid facility type' };
        }

        // Check if already owned
        if (hasSpecialFacility(facility.id, gameState)) {
            return { success: false, message: 'You already own this facility' };
        }

        // Check requirements
        const reqCheck = meetsRequirements(facility.requirements, gameState);
        if (!reqCheck.success) {
            return { success: false, message: reqCheck.message };
        }

        // Check if can afford
        if (gameState.cash < facility.cost) {
            return {
                success: false,
                message: `Insufficient funds. Need $${facility.cost.toLocaleString()}`
            };
        }

        // Purchase the facility
        gameState.cash -= facility.cost;
        gameState.studioLot.specialFacilities.push({
            id: facility.id,
            name: facility.name,
            purchaseDate: new Date(gameState.currentDate),
            maintenanceCost: facility.maintenanceCost,
            benefits: facility.benefits
        });

        // Update monthly maintenance
        updateMaintenanceCosts(gameState);

        return {
            success: true,
            message: `${facility.name} built for $${facility.cost.toLocaleString()}!`,
            facility: facility
        };
    }

    /**
     * Get production cost modifier for a film based on owned backlots
     */
    function getProductionCostModifier(film, gameState) {
        if (!gameState.studioLot || !gameState.studioLot.backlots) {
            return 1.0; // No modifier
        }

        let costMultiplier = 1.0;

        gameState.studioLot.backlots.forEach(backlot => {
            const backlotDef = Object.values(BACKLOTS).find(b => b.id === backlot.id);
            if (!backlotDef) return;

            // Check if backlot applies to this film's genre
            const genres = backlotDef.benefits.genres || [backlotDef.benefits.genreDiscount];
            if (genres.some(g => g && film.genre && film.genre.toLowerCase().includes(g.toLowerCase()))) {
                const reduction = backlotDef.benefits.costReduction / 100;
                costMultiplier *= (1 - reduction);
            }
        });

        return costMultiplier;
    }

    /**
     * Get quality bonus for a film from studio facilities
     */
    function getQualityBonus(film, gameState) {
        if (!gameState.studioLot) return 0;

        let bonus = 0;

        // Sound stages
        if (gameState.studioLot.soundStages) {
            gameState.studioLot.soundStages.forEach(stage => {
                bonus += stage.benefits.qualityBonus || 0;
            });
        }

        // Backlots (if genre matches)
        if (gameState.studioLot.backlots) {
            gameState.studioLot.backlots.forEach(backlot => {
                const backlotDef = Object.values(BACKLOTS).find(b => b.id === backlot.id);
                if (!backlotDef) return;

                const genres = backlotDef.benefits.genres || [backlotDef.benefits.genreDiscount];
                if (genres.some(g => g && film.genre && film.genre.toLowerCase().includes(g.toLowerCase()))) {
                    bonus += backlotDef.benefits.qualityBonus || 0;
                }
            });
        }

        // Special facilities
        if (gameState.studioLot.specialFacilities) {
            gameState.studioLot.specialFacilities.forEach(facility => {
                const facilityDef = Object.values(SPECIAL_FACILITIES).find(f => f.id === facility.id);
                if (!facilityDef) return;

                bonus += facilityDef.benefits.qualityBonus || 0;
                bonus += facilityDef.benefits.soundQualityBonus || 0;
            });
        }

        return bonus;
    }

    /**
     * Get revenue bonus multiplier from facilities (like Technicolor)
     */
    function getRevenueBonus(film, gameState) {
        if (!gameState.studioLot || !gameState.studioLot.specialFacilities) {
            return 1.0;
        }

        let multiplier = 1.0;

        gameState.studioLot.specialFacilities.forEach(facility => {
            const facilityDef = Object.values(SPECIAL_FACILITIES).find(f => f.id === facility.id);
            if (!facilityDef) return;

            // Technicolor bonus
            if (facilityDef.benefits.enablesColor && facilityDef.benefits.revenueBonus) {
                multiplier *= (1 + facilityDef.benefits.revenueBonus / 100);
            }
        });

        return multiplier;
    }

    /**
     * Get production speed bonus
     */
    function getProductionSpeedBonus(gameState) {
        if (!gameState.studioLot || !gameState.studioLot.soundStages) {
            return 0;
        }

        let maxBonus = 0;
        gameState.studioLot.soundStages.forEach(stage => {
            const bonus = stage.benefits.productionSpeedBonus || 0;
            if (bonus > maxBonus) maxBonus = bonus;
        });

        return maxBonus;
    }

    /**
     * Check if studio can handle another concurrent production
     */
    function canStartNewProduction(gameState) {
        const activeCount = gameState.activeFilms ? gameState.activeFilms.length : 0;
        const maxAllowed = gameState.studioLot ? gameState.studioLot.maxConcurrentProductions : 1;

        return activeCount < maxAllowed;
    }

    /**
     * Get max concurrent productions allowed
     */
    function getMaxConcurrentProductions(gameState) {
        if (!gameState.studioLot || !gameState.studioLot.soundStages) {
            return 1;
        }

        let max = 1; // Base
        gameState.studioLot.soundStages.forEach(stage => {
            const additional = stage.benefits.concurrentProductions || 0;
            max = Math.max(max, additional);
        });

        return max;
    }

    /**
     * Process monthly maintenance costs
     */
    function processMonthlyMaintenance(gameState) {
        if (!gameState.studioLot) return 0;

        const maintenanceCost = gameState.studioLot.totalMaintenanceCost || 0;
        gameState.cash -= maintenanceCost;

        return maintenanceCost;
    }

    /**
     * Get all available facilities to purchase
     */
    function getAvailableFacilities(gameState) {
        const available = {
            soundStages: [],
            backlots: [],
            specialFacilities: []
        };

        // Sound Stages
        Object.entries(SOUND_STAGES).forEach(([key, stage]) => {
            if (!hasSoundStage(stage.id, gameState)) {
                const reqCheck = meetsRequirements(stage.requirements, gameState);
                available.soundStages.push({
                    key: key,
                    ...stage,
                    canAfford: gameState.cash >= stage.cost,
                    meetsRequirements: reqCheck.success,
                    requirementMessage: reqCheck.message
                });
            }
        });

        // Backlots
        Object.entries(BACKLOTS).forEach(([key, backlot]) => {
            if (!hasBacklot(backlot.id, gameState)) {
                const reqCheck = meetsRequirements(backlot.requirements, gameState);
                available.backlots.push({
                    key: key,
                    ...backlot,
                    canAfford: gameState.cash >= backlot.cost,
                    meetsRequirements: reqCheck.success,
                    requirementMessage: reqCheck.message
                });
            }
        });

        // Special Facilities
        Object.entries(SPECIAL_FACILITIES).forEach(([key, facility]) => {
            if (!hasSpecialFacility(facility.id, gameState)) {
                const reqCheck = meetsRequirements(facility.requirements, gameState);
                available.specialFacilities.push({
                    key: key,
                    ...facility,
                    canAfford: gameState.cash >= facility.cost,
                    meetsRequirements: reqCheck.success,
                    requirementMessage: reqCheck.message
                });
            }
        });

        return available;
    }

    /**
     * Get owned facilities summary
     */
    function getOwnedFacilities(gameState) {
        if (!gameState.studioLot) {
            return {
                soundStages: [],
                backlots: [],
                specialFacilities: [],
                totalMaintenance: 0,
                maxConcurrentProductions: 1
            };
        }

        return {
            soundStages: gameState.studioLot.soundStages || [],
            backlots: gameState.studioLot.backlots || [],
            specialFacilities: gameState.studioLot.specialFacilities || [],
            totalMaintenance: gameState.studioLot.totalMaintenanceCost || 0,
            maxConcurrentProductions: gameState.studioLot.maxConcurrentProductions || 1
        };
    }

    // ========== HELPER FUNCTIONS ==========

    function hasSoundStage(stageId, gameState) {
        if (!gameState.studioLot || !gameState.studioLot.soundStages) return false;
        return gameState.studioLot.soundStages.some(s => s.id === stageId);
    }

    function hasBacklot(backlotId, gameState) {
        if (!gameState.studioLot || !gameState.studioLot.backlots) return false;
        return gameState.studioLot.backlots.some(b => b.id === backlotId);
    }

    function hasSpecialFacility(facilityId, gameState) {
        if (!gameState.studioLot || !gameState.studioLot.specialFacilities) return false;
        return gameState.studioLot.specialFacilities.some(f => f.id === facilityId);
    }

    function meetsRequirements(requirements, gameState) {
        if (!requirements || Object.keys(requirements).length === 0) {
            return { success: true };
        }

        // Check reputation
        if (requirements.reputation && gameState.reputation < requirements.reputation) {
            return {
                success: false,
                message: `Requires reputation ${requirements.reputation} (current: ${gameState.reputation})`
            };
        }

        // Check films produced
        if (requirements.filmsProduced && gameState.stats.filmsProduced < requirements.filmsProduced) {
            return {
                success: false,
                message: `Requires ${requirements.filmsProduced} films produced (current: ${gameState.stats.filmsProduced})`
            };
        }

        // Check year
        if (requirements.year && gameState.gameYear < requirements.year) {
            return {
                success: false,
                message: `Not available until ${requirements.year} (current: ${gameState.gameYear})`
            };
        }

        // Check cash (for high-end facilities)
        if (requirements.cash && gameState.cash < requirements.cash) {
            return {
                success: false,
                message: `Requires minimum cash reserve of $${requirements.cash.toLocaleString()}`
            };
        }

        return { success: true };
    }

    function updateMaintenanceCosts(gameState) {
        if (!gameState.studioLot) return;

        let total = 0;

        // Add sound stage maintenance
        if (gameState.studioLot.soundStages) {
            gameState.studioLot.soundStages.forEach(stage => {
                total += stage.maintenanceCost || 0;
            });
        }

        // Add backlot maintenance
        if (gameState.studioLot.backlots) {
            gameState.studioLot.backlots.forEach(backlot => {
                total += backlot.maintenanceCost || 0;
            });
        }

        // Add facility maintenance
        if (gameState.studioLot.specialFacilities) {
            gameState.studioLot.specialFacilities.forEach(facility => {
                total += facility.maintenanceCost || 0;
            });
        }

        gameState.studioLot.totalMaintenanceCost = total;

        // Update global monthly burn
        updateMonthlyBurn(gameState);
    }

    function updateMaxConcurrentProductions(gameState) {
        if (!gameState.studioLot) return;

        gameState.studioLot.maxConcurrentProductions = getMaxConcurrentProductions(gameState);
    }

    function updateMonthlyBurn(gameState) {
        // Recalculate monthly burn including studio maintenance
        const baseBurn = 30000; // Base studio operations
        const studioMaintenance = gameState.studioLot ? gameState.studioLot.totalMaintenanceCost : 0;

        gameState.monthlyBurn = baseBurn + studioMaintenance;
    }

    /**
     * Public API
     */
    return {
        // Initialization
        initializeStudioLot,

        // Purchase functions
        purchaseSoundStage,
        purchaseBacklot,
        purchaseSpecialFacility,

        // Query functions
        getAvailableFacilities,
        getOwnedFacilities,
        canStartNewProduction,
        getMaxConcurrentProductions,

        // Production bonuses
        getProductionCostModifier,
        getQualityBonus,
        getRevenueBonus,
        getProductionSpeedBonus,

        // Monthly processing
        processMonthlyMaintenance,

        // Constants (for other systems to reference)
        SOUND_STAGES,
        BACKLOTS,
        SPECIAL_FACILITIES
    };
})();
