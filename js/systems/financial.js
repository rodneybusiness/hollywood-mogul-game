/**
 * HOLLYWOOD MOGUL - FINANCIAL SYSTEM
 * The ruthless mathematics of movie money - loans, debts, and deals with devils
 */

window.FinancialSystem = (function() {
    'use strict';
    
    // Loan types and their brutal terms
    const LOAN_TYPES = {
        BANK: {
            name: 'First National Bank',
            minAmount: 25000,
            maxAmount: 300000,
            baseInterestRate: 0.04, // 4% monthly - still high but competitive with mob financing
            requirements: {
                lastFilmGrossed: 200000, // Last film must have grossed at least $200k
                minReputation: 40,
                maxOutstandingLoans: 2
            },
            description: 'Conservative bank financing with strict requirements but legitimate terms',
            riskLevel: 'LOW'
        },
        
        PRIVATE_INVESTOR: {
            name: 'Private Investment Group',
            minAmount: 50000,
            maxAmount: 500000,
            baseInterestRate: 0.05, // 5% monthly
            requirements: {
                oscarsWon: 1, // Need at least 1 Oscar nomination or win
                minReputation: 60,
                profitableFilms: 3 // At least 3 profitable films
            },
            profitShare: 0.20, // Investors take 20% of profits for 5 years
            description: 'Wealthy investors seeking long-term returns on quality pictures',
            riskLevel: 'MEDIUM'
        },
        
        MOB: {
            name: 'Carmine "The Suit" Torrino',
            minAmount: 10000,
            maxAmount: 1000000,
            baseInterestRate: 0.00, // No interest - but favors are worse
            requirements: {}, // No requirements - Carmine is always "helpful"
            favorSystem: true,
            description: 'No questions asked, no interest charged. But Carmine expects favors...',
            riskLevel: 'EXTREME'
        },
        
        ADVANCE_DISTRIBUTOR: {
            name: 'Theater Chain Advance',
            minAmount: 20000,
            maxAmount: 150000,
            baseInterestRate: 0.00, // No interest
            requirements: {
                filmsInProduction: 1 // Must have film in production
            },
            distributionLock: true, // Must use their theaters
            revenueShare: 0.60, // They take 60% instead of normal 50%
            description: 'Advance payment from theater chains against future film revenues',
            riskLevel: 'MEDIUM'
        }
    };
    
    // Mob favor types - escalating commitment and danger
    const MOB_FAVORS = [
        {
            type: 'CAST_GIRLFRIEND',
            description: 'Cast Carmine\'s girlfriend in your next picture',
            severity: 1,
            impact: { actingSkill: 20, scandalRisk: 30 } // She can't act, might cause scandal
        },
        {
            type: 'LAUNDER_MONEY',
            description: 'Report inflated box office numbers to help launder mob money',
            severity: 2,
            impact: { fbiAttention: 40, moralCorruption: 20 }
        },
        {
            type: 'UNION_PRESSURE',
            description: 'Use your influence to pressure union leaders during negotiations',
            severity: 3,
            impact: { unionRelations: -30, reputation: -10 }
        },
        {
            type: 'PROPAGANDA_FILM',
            description: 'Produce a film that portrays organized crime sympathetically',
            severity: 3,
            impact: { censorshipHeat: 60, reputation: -15, fbiAttention: 30 }
        },
        {
            type: 'CASINO_INVESTMENT',
            description: 'Invest your studio\'s profits in Carmine\'s Las Vegas casino project',
            severity: 4,
            impact: { cashDrain: 100000, fbiInvestigation: true }
        }
    ];
    
    // Investment opportunities
    const INVESTMENT_OPPORTUNITIES = {
        THEATER_CHAIN: {
            name: 'Regional Theater Chain',
            cost: 500000,
            monthlyRevenue: 25000,
            description: 'Own 15 theaters across the Midwest. Keep 100% of your films\' box office.',
            requirements: { cash: 500000, reputation: 70 },
            risks: ['antitrust_lawsuit', 'maintenance_costs']
        },
        
        RADIO_STATION: {
            name: 'WXYZ Radio Network',
            cost: 150000,
            monthlyRevenue: 8000,
            description: 'Radio network for promoting your films and developing talent.',
            requirements: { cash: 150000 },
            benefits: ['film_promotion_bonus', 'talent_development']
        },
        
        RESTAURANT_CHAIN: {
            name: 'Brown Derby Restaurants',
            cost: 200000,
            monthlyRevenue: 12000,
            description: 'Upscale restaurants frequented by Hollywood elite. Great for networking.',
            requirements: { cash: 200000, reputation: 60 },
            benefits: ['reputation_boost', 'talent_attraction']
        }
    };
    
    /**
     * Initialize financial system for new game
     */
    function initializeFinancialSystem(gameState) {
        gameState.finances = {
            loans: [],
            investments: [],
            mobFavorsOwed: 0,
            mobFavorsCompleted: [],
            creditRating: 'UNRATED',
            bankRelationship: 'NEUTRAL',
            fbiAttention: 0,
            monthlyIncome: 0,
            monthlyExpenses: gameState.monthlyBurn,
            cashFlowHistory: [],
            transactions: [] // Track all financial transactions
        };

        updateCreditRating(gameState);
    }
    
    /**
     * Process monthly financial obligations
     */
    function processMonthlyFinances(gameState) {
        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }
        
        let totalInterest = 0;
        let totalPrincipal = 0;
        let monthlyInvestmentIncome = 0;
        
        // Process loan payments
        gameState.finances.loans.forEach(loan => {
            const interestPayment = calculateInterestPayment(loan);
            const principalPayment = calculatePrincipalPayment(loan);
            
            totalInterest += interestPayment;
            totalPrincipal += principalPayment;
            
            // Apply payments
            gameState.cash -= (interestPayment + principalPayment);
            loan.remainingBalance -= principalPayment;
            loan.totalInterestPaid += interestPayment;
            loan.paymentsRemaining -= 1;
            
            // Check for loan completion
            if (loan.remainingBalance <= 0 || loan.paymentsRemaining <= 0) {
                completeLoan(loan, gameState);
            }
        });
        
        // Remove completed loans
        gameState.finances.loans = gameState.finances.loans.filter(loan => 
            loan.remainingBalance > 0 && loan.paymentsRemaining > 0
        );
        
        // Process investment income
        gameState.finances.investments.forEach(investment => {
            const monthlyReturn = calculateInvestmentReturn(investment, gameState);
            monthlyInvestmentIncome += monthlyReturn;
        });
        
        gameState.cash += monthlyInvestmentIncome;
        
        // Update financial tracking
        const netCashFlow = monthlyInvestmentIncome - totalInterest - totalPrincipal;
        gameState.finances.monthlyIncome = monthlyInvestmentIncome;
        gameState.finances.cashFlowHistory.push({
            month: new Date(gameState.currentDate),
            income: monthlyInvestmentIncome,
            loanPayments: totalInterest + totalPrincipal,
            netFlow: netCashFlow
        });
        
        // Keep only last 24 months of history
        if (gameState.finances.cashFlowHistory.length > 24) {
            gameState.finances.cashFlowHistory = gameState.finances.cashFlowHistory.slice(-24);
        }
        
        // Update credit rating
        updateCreditRating(gameState);
        
        // Check for financial alerts
        checkFinancialAlerts(gameState, totalInterest + totalPrincipal);
    }
    
    /**
     * Show loan options to player
     */
    function showLoanOptions(gameState) {
        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }
        
        const availableLoans = Object.entries(LOAN_TYPES).filter(([key, loanType]) => 
            meetsLoanRequirements(loanType, gameState)
        );
        
        let modalContent = `
            <div class="loan-office">
                <h2>Financing Options</h2>
                <div class="financial-status">
                    <p><strong>Current Cash:</strong> $${gameState.cash.toLocaleString()}</p>
                    <p><strong>Credit Rating:</strong> ${gameState.finances.creditRating}</p>
                    <p><strong>Outstanding Loans:</strong> ${gameState.finances.loans.length}</p>
                    <p><strong>Monthly Loan Payments:</strong> $${calculateTotalMonthlyPayments(gameState).toLocaleString()}</p>
                </div>
                
                <div class="loan-options">
                    ${availableLoans.length > 0 ? 
                        availableLoans.map(([key, loanType]) => createLoanCard(key, loanType, gameState)).join('') :
                        '<p class="no-loans">No financing options currently available. Improve your track record to unlock lenders.</p>'
                    }
                </div>
                
                <div class="loan-footer">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn secondary">Cancel</button>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }
    
    /**
     * Create loan option card
     */
    function createLoanCard(loanKey, loanType, gameState) {
        const riskColors = {
            'LOW': 'success',
            'MEDIUM': 'warning',
            'EXTREME': 'danger'
        };
        
        return `
            <div class="loan-card risk-${riskColors[loanType.riskLevel]}">
                <div class="loan-header">
                    <h3>${loanType.name}</h3>
                    <div class="risk-badge risk-${loanType.riskLevel.toLowerCase()}">${loanType.riskLevel} RISK</div>
                </div>
                
                <div class="loan-details">
                    <p class="loan-description">${loanType.description}</p>
                    
                    <div class="loan-terms">
                        <div class="term-row">
                            <span>Amount Range:</span>
                            <span>$${loanType.minAmount.toLocaleString()} - $${loanType.maxAmount.toLocaleString()}</span>
                        </div>
                        <div class="term-row">
                            <span>Interest Rate:</span>
                            <span>${(loanType.baseInterestRate * 100).toFixed(1)}% monthly</span>
                        </div>
                        ${loanType.profitShare ? `
                            <div class="term-row special">
                                <span>Profit Share:</span>
                                <span>${(loanType.profitShare * 100)}% for 5 years</span>
                            </div>
                        ` : ''}
                        ${loanType.favorSystem ? `
                            <div class="term-row warning">
                                <span>Special Terms:</span>
                                <span>Favors may be requested</span>
                            </div>
                        ` : ''}
                        ${loanType.revenueShare ? `
                            <div class="term-row">
                                <span>Revenue Share:</span>
                                <span>Theater takes ${(loanType.revenueShare * 100)}%</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="loan-actions">
                    <button onclick="FinancialSystem.showLoanApplication('${loanKey}')" class="action-btn primary">
                        Apply for Loan
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Show loan application form
     */
    function showLoanApplication(loanKey) {
        const loanType = LOAN_TYPES[loanKey];
        if (!loanType) return;
        
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;
        
        let modalContent = `
            <div class="loan-application">
                <h2>Loan Application - ${loanType.name}</h2>
                
                <div class="application-form">
                    <div class="form-group">
                        <label for="loan-amount">Loan Amount:</label>
                        <input type="range" 
                               id="loan-amount" 
                               min="${loanType.minAmount}" 
                               max="${loanType.maxAmount}" 
                               value="${loanType.minAmount}"
                               oninput="FinancialSystem.updateLoanPreview()">
                        <div class="amount-display">$<span id="amount-value">${loanType.minAmount.toLocaleString()}</span></div>
                    </div>
                    
                    <div class="loan-preview" id="loan-preview">
                        <!-- Preview will be populated by updateLoanPreview() -->
                    </div>
                    
                    <div class="application-actions">
                        <button onclick="FinancialSystem.submitLoanApplication('${loanKey}')" 
                                class="action-btn primary">
                            Submit Application
                        </button>
                        <button onclick="FinancialSystem.showLoanOptions()" 
                                class="action-btn secondary">
                            Back to Options
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
            
            // Store loan type for application
            window._currentLoanType = loanKey;
            
            // Initialize preview
            setTimeout(() => updateLoanPreview(), 100);
        }
    }
    
    /**
     * Update loan preview calculations
     */
    function updateLoanPreview() {
        const loanKey = window._currentLoanType;
        if (!loanKey) return;
        
        const loanType = LOAN_TYPES[loanKey];
        const amountSlider = document.getElementById('loan-amount');
        const amountDisplay = document.getElementById('amount-value');
        const previewDiv = document.getElementById('loan-preview');
        
        if (!amountSlider || !amountDisplay || !previewDiv) return;
        
        const amount = parseInt(amountSlider.value);
        amountDisplay.textContent = amount.toLocaleString();
        
        // Calculate loan terms
        const termMonths = calculateLoanTerm(amount, loanType);
        const monthlyInterest = amount * loanType.baseInterestRate;
        const principalPayment = amount / termMonths;
        const totalMonthlyPayment = monthlyInterest + principalPayment;
        const totalInterest = monthlyInterest * termMonths;
        const totalRepayment = amount + totalInterest;
        
        previewDiv.innerHTML = `
            <h4>Loan Terms Preview</h4>
            <div class="preview-grid">
                <div class="preview-item">
                    <span class="preview-label">Loan Amount:</span>
                    <span class="preview-value">$${amount.toLocaleString()}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Term:</span>
                    <span class="preview-value">${termMonths} months</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Monthly Payment:</span>
                    <span class="preview-value">$${totalMonthlyPayment.toLocaleString()}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Total Interest:</span>
                    <span class="preview-value text-danger">$${totalInterest.toLocaleString()}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Total Repayment:</span>
                    <span class="preview-value">$${totalRepayment.toLocaleString()}</span>
                </div>
            </div>
            
            ${loanType.favorSystem ? `
                <div class="warning-box">
                    <h5>⚠️ Special Terms</h5>
                    <p>This lender may request "favors" in lieu of interest payments. These requests become more frequent and compromising over time.</p>
                </div>
            ` : ''}
        `;
    }
    
    /**
     * Submit loan application
     */
    function submitLoanApplication(loanKey) {
        const loanType = LOAN_TYPES[loanKey];
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        
        if (!loanType || !gameState) return;
        
        const amountSlider = document.getElementById('loan-amount');
        if (!amountSlider) return;
        
        const amount = parseInt(amountSlider.value);
        
        // Create loan object
        const loan = {
            id: generateLoanId(),
            type: loanKey,
            lender: loanType.name,
            originalAmount: amount,
            remainingBalance: amount,
            interestRate: loanType.baseInterestRate,
            termMonths: calculateLoanTerm(amount, loanType),
            paymentsRemaining: calculateLoanTerm(amount, loanType),
            monthlyInterest: amount * loanType.baseInterestRate,
            monthlyPrincipal: amount / calculateLoanTerm(amount, loanType),
            totalInterestPaid: 0,
            originationDate: new Date(gameState.currentDate),
            specialTerms: {
                favorSystem: loanType.favorSystem || false,
                profitShare: loanType.profitShare || 0,
                distributionLock: loanType.distributionLock || false,
                revenueShare: loanType.revenueShare || 0
            }
        };
        
        // Add loan to game state
        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }
        
        gameState.finances.loans.push(loan);
        gameState.cash += amount;
        
        // Special handling for mob loans
        if (loanType.favorSystem) {
            gameState.finances.mobFavorsOwed += Math.ceil(amount / 100000); // 1 favor per $100k
            
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '🤝',
                    message: `Carmine smiles: "Pleasure doing business. I'll be in touch about those favors..."`,
                    priority: 'high'
                });
            }
        }
        
        // Update credit rating
        updateCreditRating(gameState);
        
        // Success message
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'financial',
                icon: '💰',
                message: `Loan approved: $${amount.toLocaleString()} from ${loanType.name}`,
                priority: 'high'
            });
            
            window.HollywoodMogul.closeModal();
        }
        
        console.log(`Loan approved: $${amount} from ${loanType.name}`);
    }
    
    /**
     * Show investment opportunities
     */
    function showInvestmentOptions(gameState) {
        const availableInvestments = Object.entries(INVESTMENT_OPPORTUNITIES).filter(([key, investment]) => 
            meetsInvestmentRequirements(investment, gameState) && !hasInvestment(key, gameState)
        );
        
        let modalContent = `
            <div class="investment-office">
                <h2>Investment Opportunities</h2>
                <p class="investment-subtitle">Diversify your income beyond film production</p>
                
                <div class="investment-options">
                    ${availableInvestments.length > 0 ? 
                        availableInvestments.map(([key, investment]) => createInvestmentCard(key, investment, gameState)).join('') :
                        '<p class="no-investments">No investment opportunities currently available.</p>'
                    }
                </div>
                
                ${gameState.finances && gameState.finances.investments.length > 0 ? `
                    <div class="current-investments">
                        <h3>Current Investments</h3>
                        ${gameState.finances.investments.map(investment => `
                            <div class="investment-summary">
                                <strong>${investment.name}</strong> - Monthly Income: $${investment.monthlyReturn.toLocaleString()}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="investment-footer">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn secondary">Close</button>
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }
    
    /**
     * Create investment opportunity card
     */
    function createInvestmentCard(investmentKey, investment, gameState) {
        const canAfford = gameState.cash >= investment.cost;
        const roi = ((investment.monthlyRevenue * 12) / investment.cost * 100).toFixed(1);
        
        return `
            <div class="investment-card ${canAfford ? '' : 'unaffordable'}">
                <div class="investment-header">
                    <h3>${investment.name}</h3>
                    <div class="investment-cost">$${investment.cost.toLocaleString()}</div>
                </div>
                
                <div class="investment-details">
                    <p class="investment-description">${investment.description}</p>
                    
                    <div class="investment-stats">
                        <div class="stat-row">
                            <span>Monthly Revenue:</span>
                            <span class="text-success">+$${investment.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div class="stat-row">
                            <span>Annual ROI:</span>
                            <span>${roi}%</span>
                        </div>
                        <div class="stat-row">
                            <span>Payback Period:</span>
                            <span>${Math.ceil(investment.cost / investment.monthlyRevenue)} months</span>
                        </div>
                    </div>
                    
                    ${investment.benefits ? `
                        <div class="investment-benefits">
                            <h5>Additional Benefits:</h5>
                            <ul>
                                ${investment.benefits.map(benefit => `<li>${benefit.replace('_', ' ')}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${investment.risks ? `
                        <div class="investment-risks">
                            <h5>Risks:</h5>
                            <ul>
                                ${investment.risks.map(risk => `<li>${risk.replace('_', ' ')}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="investment-actions">
                    <button onclick="FinancialSystem.makeInvestment('${investmentKey}')" 
                            class="action-btn ${canAfford ? 'primary' : 'disabled'}"
                            ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'Invest' : 'Insufficient Funds'}
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Make an investment
     */
    function makeInvestment(investmentKey) {
        const investment = INVESTMENT_OPPORTUNITIES[investmentKey];
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        
        if (!investment || !gameState) return;
        
        if (gameState.cash < investment.cost) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '💸',
                    message: `Cannot afford ${investment.name} - need $${investment.cost.toLocaleString()}`,
                    priority: 'high'
                });
            }
            return;
        }
        
        // Make the investment
        gameState.cash -= investment.cost;
        
        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }
        
        const newInvestment = {
            id: generateInvestmentId(),
            type: investmentKey,
            name: investment.name,
            cost: investment.cost,
            monthlyReturn: investment.monthlyRevenue,
            purchaseDate: new Date(gameState.currentDate),
            benefits: investment.benefits || [],
            risks: investment.risks || []
        };
        
        gameState.finances.investments.push(newInvestment);
        
        // Apply immediate benefits
        if (investment.benefits) {
            applyInvestmentBenefits(investment.benefits, gameState);
        }
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '🏢',
                message: `Successfully invested in ${investment.name}! +$${investment.monthlyRevenue.toLocaleString()}/month`,
                priority: 'high'
            });
            
            window.HollywoodMogul.closeModal();
        }
        
        console.log(`Investment made: ${investment.name} for $${investment.cost}`);
    }
    
    /**
     * Check if player qualifies for mob favor event
     */
    function checkMobFavorEvent(gameState) {
        if (!gameState.finances || gameState.finances.mobFavorsOwed <= 0) {
            return false;
        }
        
        // 15% chance per month if favors are owed
        return Math.random() < 0.15;
    }
    
    /**
     * Trigger mob favor request
     */
    function triggerMobFavor(gameState) {
        if (!gameState.finances || gameState.finances.mobFavorsOwed <= 0) {
            return;
        }
        
        const availableFavors = MOB_FAVORS.filter(favor => 
            favor.severity <= gameState.finances.mobFavorsOwed
        );
        
        if (availableFavors.length === 0) return;
        
        const favor = availableFavors[Math.floor(Math.random() * availableFavors.length)];
        
        showMobFavorRequest(favor, gameState);
    }
    
    /**
     * Show mob favor request modal
     */
    function showMobFavorRequest(favor, gameState) {
        let modalContent = `
            <div class="mob-favor-request">
                <div class="favor-header">
                    <h2>Carmine "The Suit" Torrino</h2>
                    <div class="favor-subtitle">A Request from a Friend</div>
                </div>
                
                <div class="favor-message">
                    <p>"Hey there, partner. Remember that little loan we discussed? Time for you to do me a solid."</p>
                    <p><strong>"${favor.description}"</strong></p>
                    <p>"I'm sure you understand - this ain't really a request. We're partners, after all."</p>
                </div>
                
                <div class="favor-consequences">
                    <h4>Consequences:</h4>
                    <ul>
                        ${Object.entries(favor.impact).map(([key, value]) => {
                            const description = getImpactDescription(key, value);
                            return `<li>${description}</li>`;
                        }).join('')}
                    </ul>
                </div>
                
                <div class="favor-choices">
                    <button onclick="FinancialSystem.acceptMobFavor('${favor.type}')" 
                            class="action-btn danger">
                        Accept "Request"
                    </button>
                    <button onclick="FinancialSystem.refuseMobFavor('${favor.type}')" 
                            class="action-btn secondary">
                        Refuse (DANGEROUS)
                    </button>
                </div>
                
                <div class="favor-warning">
                    ⚠️ Refusing Carmine's requests increases the risk of "accidents" and mysterious setbacks.
                </div>
            </div>
        `;
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
            
            // Store favor for resolution
            window._currentMobFavor = favor;
        }
    }
    
    /**
     * Accept mob favor
     */
    function acceptMobFavor(favorType) {
        const favor = window._currentMobFavor;
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        
        if (!favor || !gameState) return;
        
        // Apply favor consequences
        Object.entries(favor.impact).forEach(([key, value]) => {
            applyFavorImpact(key, value, gameState);
        });
        
        // Reduce favors owed
        gameState.finances.mobFavorsOwed -= 1;
        gameState.finances.mobFavorsCompleted.push({
            type: favorType,
            date: new Date(gameState.currentDate),
            description: favor.description
        });
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '🤝',
                message: `Favor completed for Carmine. He's pleased... for now.`,
                priority: 'high'
            });
            
            window.HollywoodMogul.closeModal();
        }
        
        delete window._currentMobFavor;
    }
    
    /**
     * Refuse mob favor (dangerous)
     */
    function refuseMobFavor(favorType) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;
        
        // Increase mob heat significantly
        gameState.finances.mobFavorsOwed += 2; // Penalty for refusal
        
        // Immediate retaliation
        const retaliation = [
            'Mysterious equipment failures cost you $15,000',
            'Union "problems" delay your current production by 2 weeks',
            'Key crew members suddenly find "better opportunities" elsewhere',
            'Your theater bookings mysteriously get "mixed up"'
        ];
        
        const retaliationType = retaliation[Math.floor(Math.random() * retaliation.length)];
        
        // Apply retaliation
        if (retaliationType.includes('$15,000')) {
            gameState.cash -= 15000;
        }
        // Additional retaliation effects would be handled by production system
        
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'danger',
                icon: '💀',
                message: `Carmine is not pleased. ${retaliationType}`,
                priority: 'critical'
            });
            
            window.HollywoodMogul.addAlert({
                type: 'warning',
                icon: '⚠️',
                message: `Your relationship with Carmine has deteriorated significantly. Expect more "problems."`,
                priority: 'high'
            });
            
            window.HollywoodMogul.closeModal();
        }
        
        delete window._currentMobFavor;
    }
    
    /**
     * HELPER FUNCTIONS
     */
    
    function meetsLoanRequirements(loanType, gameState) {
        const req = loanType.requirements;
        
        // Check last film grossed
        if (req.lastFilmGrossed) {
            const lastFilm = gameState.completedFilms
                .filter(f => f.totalGross > 0)
                .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0];
            
            if (!lastFilm || lastFilm.totalGross < req.lastFilmGrossed) {
                return false;
            }
        }
        
        // Check reputation
        if (req.minReputation && gameState.reputation < req.minReputation) {
            return false;
        }
        
        // Check Oscars
        if (req.oscarsWon && gameState.stats.oscarsWon < req.oscarsWon) {
            return false;
        }
        
        // Check profitable films
        if (req.profitableFilms) {
            const profitableCount = gameState.completedFilms.filter(f => 
                f.studioRevenue > f.spentToDate
            ).length;
            
            if (profitableCount < req.profitableFilms) {
                return false;
            }
        }
        
        // Check max outstanding loans
        if (req.maxOutstandingLoans) {
            const currentLoans = gameState.finances ? gameState.finances.loans.length : 0;
            if (currentLoans >= req.maxOutstandingLoans) {
                return false;
            }
        }
        
        return true;
    }
    
    function meetsInvestmentRequirements(investment, gameState) {
        const req = investment.requirements;
        
        if (req.cash && gameState.cash < req.cash) {
            return false;
        }
        
        if (req.reputation && gameState.reputation < req.reputation) {
            return false;
        }
        
        return true;
    }
    
    function hasInvestment(investmentKey, gameState) {
        if (!gameState.finances || !gameState.finances.investments) {
            return false;
        }
        
        return gameState.finances.investments.some(inv => inv.type === investmentKey);
    }
    
    function calculateLoanTerm(amount, loanType) {
        // Larger loans = longer terms
        if (amount >= 200000) return 24; // 2 years
        if (amount >= 100000) return 18; // 1.5 years
        if (amount >= 50000) return 12;  // 1 year
        return 6; // 6 months
    }
    
    function calculateInterestPayment(loan) {
        return Math.floor(loan.remainingBalance * loan.interestRate);
    }
    
    function calculatePrincipalPayment(loan) {
        return Math.floor(loan.originalAmount / loan.termMonths);
    }
    
    function calculateTotalMonthlyPayments(gameState) {
        if (!gameState.finances || !gameState.finances.loans) {
            return 0;
        }
        
        return gameState.finances.loans.reduce((total, loan) => {
            return total + loan.monthlyInterest + loan.monthlyPrincipal;
        }, 0);
    }
    
    function calculateInvestmentReturn(investment, gameState) {
        let baseReturn = investment.monthlyReturn;
        
        // Apply modifiers based on game state
        if (investment.benefits.includes('film_promotion_bonus')) {
            // Radio station helps promote films
            baseReturn += gameState.activeFilms.length * 1000;
        }
        
        if (investment.benefits.includes('reputation_boost')) {
            // Restaurant networking
            if (gameState.reputation < 90) {
                gameState.reputation += 0.5;
            }
        }
        
        return Math.floor(baseReturn);
    }
    
    function updateCreditRating(gameState) {
        if (!gameState.finances) return;
        
        let score = 50; // Base score
        
        // Payment history
        const totalLoans = gameState.finances.loans.length + 
                          (gameState.finances.cashFlowHistory.length > 0 ? 1 : 0);
        if (totalLoans > 0) {
            score += 20; // Has credit history
        }
        
        // Current cash position
        if (gameState.cash > 200000) score += 20;
        else if (gameState.cash > 100000) score += 10;
        else if (gameState.cash < 10000) score -= 20;
        
        // Reputation
        score += (gameState.reputation - 50) / 2;
        
        // Successful films
        const profitableFilms = gameState.completedFilms.filter(f => 
            f.studioRevenue > f.spentToDate
        ).length;
        score += profitableFilms * 5;
        
        // Mob connections (negative)
        if (gameState.finances.mobFavorsOwed > 0) {
            score -= gameState.finances.mobFavorsOwed * 10;
        }
        
        // Determine rating
        if (score >= 80) gameState.finances.creditRating = 'EXCELLENT';
        else if (score >= 70) gameState.finances.creditRating = 'GOOD';
        else if (score >= 60) gameState.finances.creditRating = 'FAIR';
        else if (score >= 40) gameState.finances.creditRating = 'POOR';
        else gameState.finances.creditRating = 'TERRIBLE';
    }
    
    function completeLoan(loan, gameState) {
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'success',
                icon: '🎉',
                message: `Loan from ${loan.lender} paid in full! Total interest: $${loan.totalInterestPaid.toLocaleString()}`,
                priority: 'high'
            });
        }
        
        // Improve credit rating
        gameState.reputation += 2;
    }
    
    function checkFinancialAlerts(gameState, monthlyPayments) {
        const runway = window.HollywoodMogul ? window.HollywoodMogul.calculateRunwayWeeks() : 0;
        
        if (monthlyPayments > gameState.cash * 0.8) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'danger',
                    icon: '💸',
                    message: `Loan payments are consuming ${Math.floor((monthlyPayments / gameState.cash) * 100)}% of your cash!`,
                    priority: 'critical'
                });
            }
        }
        
        // Check for mob favor events
        if (checkMobFavorEvent(gameState)) {
            setTimeout(() => triggerMobFavor(gameState), 5000); // Delay for dramatic effect
        }
    }
    
    function applyInvestmentBenefits(benefits, gameState) {
        benefits.forEach(benefit => {
            switch (benefit) {
                case 'reputation_boost':
                    gameState.reputation += 5;
                    break;
                case 'talent_attraction':
                    // Would be handled by talent system
                    break;
            }
        });
    }
    
    function applyFavorImpact(impactType, value, gameState) {
        switch (impactType) {
            case 'fbiAttention':
                gameState.finances.fbiAttention += value;
                break;
            case 'reputation':
                gameState.reputation += value;
                break;
            case 'cashDrain':
                gameState.cash -= value;
                break;
            case 'moralCorruption':
                // Track moral choices - could affect endings
                break;
        }
    }
    
    function getImpactDescription(impactType, value) {
        const descriptions = {
            actingSkill: `Acting quality reduced (terrible performance)`,
            scandalRisk: `Increased scandal risk (+${value}%)`,
            fbiAttention: `FBI attention increased (+${value}%)`,
            moralCorruption: `Moral corruption increased`,
            unionRelations: `Union relations damaged (${value})`,
            reputation: `Studio reputation affected (${value > 0 ? '+' : ''}${value})`,
            censorshipHeat: `Censorship scrutiny increased (+${value}%)`,
            cashDrain: `Financial cost: $${value.toLocaleString()}`,
            fbiInvestigation: `Triggers FBI investigation`
        };
        
        return descriptions[impactType] || `${impactType}: ${value}`;
    }
    
    function generateLoanId() {
        return 'loan_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    function generateInvestmentId() {
        return 'investment_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    /**
     * Get available loans based on player's current standing
     */
    function getAvailableLoans() {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return [];

        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }

        const availableLoans = [];

        Object.entries(LOAN_TYPES).forEach(([key, loanType]) => {
            if (meetsLoanRequirements(loanType, gameState)) {
                availableLoans.push({
                    type: key,
                    name: loanType.name,
                    maxAmount: loanType.maxAmount,
                    terms: `${(loanType.baseInterestRate * 100).toFixed(1)}% monthly interest`,
                    riskLevel: loanType.riskLevel
                });
            }
        });

        return availableLoans;
    }

    /**
     * Check if player can afford a given amount
     */
    function canAfford(amount) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return false;

        return gameState.cash >= amount;
    }

    /**
     * Get recent transactions
     */
    function getRecentTransactions(limit = 10) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState || !gameState.finances) return [];

        if (!gameState.finances.transactions) {
            gameState.finances.transactions = [];
        }

        // Return most recent transactions
        return gameState.finances.transactions
            .slice(-limit)
            .reverse();
    }

    /**
     * Add a transaction to the history
     */
    function addTransaction(amount, description) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;

        if (!gameState.finances) {
            initializeFinancialSystem(gameState);
        }

        if (!gameState.finances.transactions) {
            gameState.finances.transactions = [];
        }

        const transaction = {
            id: generateTransactionId(),
            amount: amount,
            description: description,
            date: new Date(gameState.currentDate),
            balance: gameState.cash
        };

        gameState.finances.transactions.push(transaction);

        // Keep only last 100 transactions to prevent memory bloat
        if (gameState.finances.transactions.length > 100) {
            gameState.finances.transactions = gameState.finances.transactions.slice(-100);
        }
    }

    function generateTransactionId() {
        return 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    }

    /**
     * Public API
     */
    return {
        // Core functions
        initializeFinancialSystem,
        processMonthlyFinances,

        // UI functions
        showLoanOptions,
        showLoanApplication,
        updateLoanPreview,
        submitLoanApplication,
        showInvestmentOptions,
        makeInvestment,

        // Mob favor functions
        checkMobFavorEvent,
        triggerMobFavor,
        acceptMobFavor,
        refuseMobFavor,

        // Utility functions
        calculateTotalMonthlyPayments,
        updateCreditRating,

        // Dashboard API functions
        getAvailableLoans,
        canAfford,
        getRecentTransactions,
        addTransaction,

        // Constants for other systems
        LOAN_TYPES,
        MOB_FAVORS,
        INVESTMENT_OPPORTUNITIES
    };
})();