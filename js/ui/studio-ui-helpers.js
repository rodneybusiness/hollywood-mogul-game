/**
 * HOLLYWOOD MOGUL - STUDIO UI HELPER FUNCTIONS
 * UI functions for the Studio Lot Management System
 * These functions should be integrated into dashboard.js updateStudioSection()
 */

(function() {
    'use strict';

    /**
     * Update studio section - MAIN FUNCTION
     * This should replace the updateStudioSection() function in dashboard.js
     */
    window.updateStudioSectionFull = function() {
        const gameState = window.HollywoodMogul.getGameState();
        const container = document.getElementById('studio-management');

        if (!container) return;

        // Initialize studio lot if needed
        if (window.StudioLotSystem) {
            window.StudioLotSystem.initializeStudioLot(gameState);
        } else {
            container.innerHTML = '<div class="no-content">Studio management system not loaded...</div>';
            return;
        }

        const owned = window.StudioLotSystem.getOwnedFacilities(gameState);
        const available = window.StudioLotSystem.getAvailableFacilities(gameState);

        container.innerHTML = `
            <div class="studio-lot-container">
                <!-- Studio Overview -->
                <div class="studio-overview">
                    <div class="overview-card">
                        <h4>Studio Capacity</h4>
                        <div class="capacity-info">
                            <div class="capacity-stat">
                                <span class="stat-label">Concurrent Productions:</span>
                                <span class="stat-value">${gameState.activeFilms.length} / ${owned.maxConcurrentProductions}</span>
                            </div>
                            <div class="capacity-stat">
                                <span class="stat-label">Monthly Maintenance:</span>
                                <span class="stat-value negative">$${owned.totalMaintenance.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Owned Facilities -->
                ${createOwnedFacilitiesSection(owned)}

                <!-- Available Purchases -->
                <div class="available-facilities">
                    <h3>Expand Your Studio</h3>

                    <!-- Sound Stages -->
                    ${available.soundStages.length > 0 ? `
                        <div class="facility-category">
                            <h4>Sound Stages</h4>
                            <div class="facilities-grid">
                                ${available.soundStages.map(stage => createFacilityCard(stage, 'soundStage')).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Backlots -->
                    ${available.backlots.length > 0 ? `
                        <div class="facility-category">
                            <h4>Backlots</h4>
                            <div class="facilities-grid">
                                ${available.backlots.map(backlot => createFacilityCard(backlot, 'backlot')).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Special Facilities -->
                    ${available.specialFacilities.length > 0 ? `
                        <div class="facility-category">
                            <h4>Special Facilities</h4>
                            <div class="facilities-grid">
                                ${available.specialFacilities.map(facility => createFacilityCard(facility, 'specialFacility')).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${available.soundStages.length === 0 && available.backlots.length === 0 && available.specialFacilities.length === 0 ? `
                        <div class="no-content">
                            <p>You own all available studio facilities!</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Bind purchase buttons
        bindStudioPurchaseHandlers();
    };

    function createOwnedFacilitiesSection(owned) {
        if (owned.soundStages.length === 0 && owned.backlots.length === 0 && owned.specialFacilities.length === 0) {
            return `
                <div class="owned-facilities">
                    <h3>Your Studio Facilities</h3>
                    <div class="no-content">
                        <p>You don't own any studio facilities yet. Start by purchasing a sound stage!</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="owned-facilities">
                <h3>Your Studio Facilities</h3>
                <div class="owned-grid">
                    ${owned.soundStages.map(stage => createOwnedFacilityCard(stage)).join('')}
                    ${owned.backlots.map(backlot => createOwnedFacilityCard(backlot)).join('')}
                    ${owned.specialFacilities.map(facility => createOwnedFacilityCard(facility)).join('')}
                </div>
            </div>
        `;
    }

    function createOwnedFacilityCard(facility) {
        return `
            <div class="owned-facility-card">
                <div class="facility-icon">🏢</div>
                <div class="facility-info">
                    <h4>${facility.name}</h4>
                    <p class="maintenance-cost">Maintenance: $${facility.maintenanceCost.toLocaleString()}/mo</p>
                </div>
            </div>
        `;
    }

    function createFacilityCard(facility, type) {
        const canPurchase = facility.canAfford && facility.meetsRequirements;

        // Format benefits
        let benefitsHTML = '';
        if (facility.benefits) {
            const benefits = facility.benefits;
            benefitsHTML = '<ul class="facility-benefits">';

            if (benefits.concurrentProductions) {
                benefitsHTML += `<li>Allows ${benefits.concurrentProductions} concurrent production${benefits.concurrentProductions > 1 ? 's' : ''}</li>`;
            }
            if (benefits.productionSpeedBonus) {
                benefitsHTML += `<li>${benefits.productionSpeedBonus}% faster production</li>`;
            }
            if (benefits.qualityBonus) {
                benefitsHTML += `<li>+${benefits.qualityBonus} quality bonus</li>`;
            }
            if (benefits.costReduction) {
                const genres = benefits.genres || [benefits.genreDiscount];
                benefitsHTML += `<li>${benefits.costReduction}% cost reduction for ${genres.join(', ')} films</li>`;
            }
            if (benefits.enablesColor) {
                benefitsHTML += `<li>Enables color films (+${benefits.revenueBonus}% revenue)</li>`;
            }
            if (benefits.soundQualityBonus) {
                benefitsHTML += `<li>+${benefits.soundQualityBonus} sound quality</li>`;
            }
            if (benefits.testScreenings) {
                benefitsHTML += `<li>Enables test screenings</li>`;
            }
            if (benefits.preProductionSpeedBonus) {
                benefitsHTML += `<li>${benefits.preProductionSpeedBonus}% faster pre-production</li>`;
            }

            benefitsHTML += '</ul>';
        }

        return `
            <div class="facility-card ${!canPurchase ? 'unavailable' : ''}">
                <div class="facility-header">
                    <h4>${facility.name}</h4>
                    <div class="facility-cost">$${facility.cost.toLocaleString()}</div>
                </div>
                <p class="facility-description">${facility.description}</p>
                ${benefitsHTML}
                <div class="facility-maintenance">
                    Monthly Maintenance: $${facility.maintenanceCost.toLocaleString()}
                </div>

                ${!facility.meetsRequirements ? `
                    <div class="requirement-warning">
                        ${facility.requirementMessage}
                    </div>
                ` : ''}

                <button class="purchase-facility-btn ${canPurchase ? 'cta-button' : 'disabled-button'}"
                        data-facility-type="${type}"
                        data-facility-key="${facility.key}"
                        ${!canPurchase ? 'disabled' : ''}>
                    ${!facility.canAfford ? 'INSUFFICIENT FUNDS' :
                      !facility.meetsRequirements ? 'REQUIREMENTS NOT MET' :
                      'PURCHASE'}
                </button>
            </div>
        `;
    }

    function bindStudioPurchaseHandlers() {
        document.querySelectorAll('.purchase-facility-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const facilityType = this.dataset.facilityType;
                const facilityKey = this.dataset.facilityKey;

                showPurchaseConfirmation(facilityType, facilityKey);
            });
        });
    }

    function showPurchaseConfirmation(facilityType, facilityKey) {
        const gameState = window.HollywoodMogul.getGameState();
        let facility;
        let purchaseFunction;

        // Get facility details
        if (facilityType === 'soundStage') {
            facility = window.StudioLotSystem.SOUND_STAGES[facilityKey];
            purchaseFunction = window.StudioLotSystem.purchaseSoundStage;
        } else if (facilityType === 'backlot') {
            facility = window.StudioLotSystem.BACKLOTS[facilityKey];
            purchaseFunction = window.StudioLotSystem.purchaseBacklot;
        } else if (facilityType === 'specialFacility') {
            facility = window.StudioLotSystem.SPECIAL_FACILITIES[facilityKey];
            purchaseFunction = window.StudioLotSystem.purchaseSpecialFacility;
        }

        if (!facility) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal purchase-confirmation-modal">
                <div class="modal-header">
                    <h3>Purchase ${facility.name}?</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-content">
                    <div class="purchase-summary">
                        <p><strong>Cost:</strong> $${facility.cost.toLocaleString()}</p>
                        <p><strong>Monthly Maintenance:</strong> $${facility.maintenanceCost.toLocaleString()}</p>
                        <p><strong>Current Cash:</strong> $${gameState.cash.toLocaleString()}</p>
                        <p><strong>Cash After Purchase:</strong> $${(gameState.cash - facility.cost).toLocaleString()}</p>
                    </div>
                    <p class="confirmation-message">
                        ${facility.description}
                    </p>
                    <div class="modal-actions">
                        <button class="confirm-purchase-btn cta-button"
                                data-type="${facilityType}"
                                data-key="${facilityKey}">
                            Confirm Purchase
                        </button>
                        <button class="modal-close action-btn secondary">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind confirmation button
        modal.querySelector('.confirm-purchase-btn').addEventListener('click', function() {
            executeFacilityPurchase(facilityType, facilityKey, purchaseFunction);
            modal.remove();
        });

        // Bind close buttons
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });
    }

    function executeFacilityPurchase(facilityType, facilityKey, purchaseFunction) {
        const gameState = window.HollywoodMogul.getGameState();
        const result = purchaseFunction.call(window.StudioLotSystem, facilityKey, gameState);

        if (result.success) {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Facility Purchased!', result.message, 'success');
                window.DashboardUI.updateDashboard();
            }
            window.updateStudioSectionFull(); // Refresh the studio view
        } else {
            if (window.DashboardUI && window.DashboardUI.showNotification) {
                window.DashboardUI.showNotification('Purchase Failed', result.message, 'error');
            }
        }
    }
})();
