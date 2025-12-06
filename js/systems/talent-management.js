/**
 * HOLLYWOOD MOGUL - TALENT MANAGEMENT SYSTEM
 * Contract management, hiring, and talent relationships
 */

window.TalentManagement = (function() {
    'use strict';

    /**
     * Sign talent to an exclusive contract
     */
    function signContract(talentId, talentType, years, gameState) {
        const talent = talentType === 'actor'
            ? window.TalentRoster.getActorById(talentId)
            : window.TalentRoster.getDirectorById(talentId);

        if (!talent) {
            return { success: false, message: 'Talent not found' };
        }

        // Check if already under contract
        const existingContract = gameState.contractPlayers.find(c => c.talentId === talentId);
        if (existingContract) {
            return { success: false, message: `${talent.name} is already under contract` };
        }

        // Calculate contract cost
        const weeklyRate = talent.weeklyRate;
        const annualCost = weeklyRate * 52; // 52 weeks per year
        const totalCost = annualCost * years;
        const signingBonus = Math.floor(annualCost * 0.25); // 25% signing bonus
        const totalUpfront = signingBonus;

        // Check if can afford signing bonus
        if (gameState.cash < totalUpfront) {
            return {
                success: false,
                message: `Cannot afford signing bonus of $${totalUpfront.toLocaleString()}`
            };
        }

        // Create contract
        const contract = {
            talentId: talentId,
            talentType: talentType,
            name: talent.name,
            weeklyRate: weeklyRate,
            yearsRemaining: years,
            totalYears: years,
            signedDate: { ...window.TimeSystem.getCurrentDate() },
            expiresDate: calculateExpirationDate(years, gameState),
            happiness: 75, // Start at 75% happiness
            loyalty: 60,
            filmsCompleted: 0,
            specialTerms: [],

            // Financial tracking
            totalPaid: signingBonus,
            signingBonus: signingBonus
        };

        // Deduct signing bonus
        gameState.cash -= totalUpfront;

        // Add to contract players
        gameState.contractPlayers.push(contract);

        // Add event
        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'talent',
                icon: '✍️',
                message: `${talent.name} signed to ${years}-year contract! Signing bonus: $${signingBonus.toLocaleString()}`,
                priority: 'high'
            });
        }

        return {
            success: true,
            contract: contract,
            message: `${talent.name} signed to exclusive contract`
        };
    }

    /**
     * Release talent from contract early
     */
    function releaseFromContract(talentId, gameState) {
        const contractIndex = gameState.contractPlayers.findIndex(c => c.talentId === talentId);

        if (contractIndex === -1) {
            return { success: false, message: 'No active contract found' };
        }

        const contract = gameState.contractPlayers[contractIndex];

        // Calculate buyout cost (remaining years * annual salary * 0.5)
        const buyoutCost = Math.floor(contract.weeklyRate * 52 * contract.yearsRemaining * 0.5);

        if (gameState.cash < buyoutCost) {
            return {
                success: false,
                message: `Cannot afford buyout of $${buyoutCost.toLocaleString()}`
            };
        }

        // Deduct buyout cost
        gameState.cash -= buyoutCost;

        // Remove contract
        gameState.contractPlayers.splice(contractIndex, 1);

        // Reduce reputation
        gameState.reputation = Math.max(0, gameState.reputation - 5);

        if (window.HollywoodMogul) {
            window.HollywoodMogul.addAlert({
                type: 'talent',
                icon: '📄',
                message: `Released ${contract.name} from contract. Buyout cost: $${buyoutCost.toLocaleString()}`,
                priority: 'medium'
            });
        }

        return {
            success: true,
            buyoutCost: buyoutCost,
            message: `${contract.name} released from contract`
        };
    }

    /**
     * Hire talent for a specific production (either contract or freelance)
     */
    function hireForProduction(talentId, talentType, film, gameState) {
        const talent = talentType === 'actor'
            ? window.TalentRoster.getActorById(talentId)
            : window.TalentRoster.getDirectorById(talentId);

        if (!talent) {
            return { success: false, message: 'Talent not found' };
        }

        // Check availability
        const currentYear = gameState.gameYear || new Date(gameState.currentDate).getFullYear();
        if (currentYear < talent.availableFrom || currentYear > talent.availableTo) {
            return {
                success: false,
                message: `${talent.name} is not available in ${currentYear}`
            };
        }

        // Check if under contract
        const contract = gameState.contractPlayers.find(c => c.talentId === talentId);
        const isContractPlayer = !!contract;

        // Calculate cost
        const shootingWeeks = Math.ceil(film.shootingDays / 7) || 8;
        const baseRate = talent.weeklyRate;
        const freelanceRate = baseRate * 1.5; // Freelance costs 50% more
        const actualRate = isContractPlayer ? baseRate : freelanceRate;
        const totalCost = actualRate * shootingWeeks;

        // Contract players are already paid through contracts
        const upfrontCost = isContractPlayer ? 0 : totalCost;

        if (upfrontCost > 0 && gameState.cash < upfrontCost) {
            return {
                success: false,
                message: `Cannot afford to hire ${talent.name} (${upfrontCost.toLocaleString()})`
            };
        }

        // Create hiring record
        const hire = {
            talentId: talentId,
            name: talent.name,
            type: talentType,
            isContractPlayer: isContractPlayer,
            weeklyRate: actualRate,
            totalCost: totalCost,
            upfrontCost: upfrontCost,
            starPower: talent.starPower || talent.talent,
            genres: talent.genres,
            specialties: talent.specialties || []
        };

        // Pay if freelance
        if (upfrontCost > 0) {
            gameState.cash -= upfrontCost;
            film.spentToDate = (film.spentToDate || 0) + upfrontCost;
        }

        // Update contract player stats
        if (contract) {
            contract.filmsCompleted += 1;
            contract.happiness = Math.min(100, contract.happiness + 5);
        }

        return {
            success: true,
            hire: hire,
            isContractPlayer: isContractPlayer,
            message: `${talent.name} hired for "${film.title}"`
        };
    }

    /**
     * Get available talent for hiring (based on year, genre, budget)
     */
    function getAvailableTalentForHiring(talentType, film, gameState) {
        const currentYear = gameState.gameYear || new Date(gameState.currentDate).getFullYear();

        let availableTalent = [];

        if (talentType === 'actor') {
            availableTalent = window.TalentRoster.getAvailableActors(currentYear, gameState);
        } else if (talentType === 'director') {
            availableTalent = window.TalentRoster.getAvailableDirectors(currentYear, gameState);
        }

        // Sort by compatibility with genre
        availableTalent.sort((a, b) => {
            const aMatch = a.genres.includes(film.genre) ? 1 : 0;
            const bMatch = b.genres.includes(film.genre) ? 1 : 0;

            if (aMatch !== bMatch) return bMatch - aMatch;

            // Then by star power/talent
            const aPower = a.starPower || a.talent;
            const bPower = b.starPower || b.talent;
            return bPower - aPower;
        });

        // Annotate with contract status and costs
        return availableTalent.map(talent => {
            const contract = gameState.contractPlayers.find(c => c.talentId === talent.id);
            const isContractPlayer = !!contract;
            const shootingWeeks = Math.ceil((film.shootingDays || 40) / 7);
            const baseRate = talent.weeklyRate;
            const actualRate = isContractPlayer ? baseRate : baseRate * 1.5;
            const totalCost = actualRate * shootingWeeks;

            return {
                ...talent,
                isContractPlayer: isContractPlayer,
                actualRate: actualRate,
                totalCost: totalCost,
                genreMatch: talent.genres.includes(film.genre),
                contractHappiness: contract ? contract.happiness : null
            };
        });
    }

    /**
     * Process weekly contract payments
     */
    function processWeeklyContracts(gameState) {
        let totalWeeklyCost = 0;

        gameState.contractPlayers.forEach(contract => {
            const weeklyCost = contract.weeklyRate;
            totalWeeklyCost += weeklyCost;
            contract.totalPaid += weeklyCost;

            // Small chance of happiness decrease if not working
            if (Math.random() < 0.1) {
                contract.happiness = Math.max(0, contract.happiness - 1);
            }
        });

        // Deduct from cash
        gameState.cash -= totalWeeklyCost;

        return totalWeeklyCost;
    }

    /**
     * Process yearly contract updates
     */
    function processYearlyContracts(gameState) {
        const expiredContracts = [];

        gameState.contractPlayers.forEach((contract, index) => {
            contract.yearsRemaining -= 1;

            // Check for expiration
            if (contract.yearsRemaining <= 0) {
                expiredContracts.push({ index, contract });
            }
            // Warn about expiring contracts
            else if (contract.yearsRemaining === 1) {
                if (window.HollywoodMogul) {
                    window.HollywoodMogul.addAlert({
                        type: 'talent',
                        icon: '⚠️',
                        message: `${contract.name}'s contract expires in 1 year!`,
                        priority: 'medium'
                    });
                }
            }
        });

        // Remove expired contracts (in reverse to maintain indices)
        expiredContracts.reverse().forEach(({ index, contract }) => {
            gameState.contractPlayers.splice(index, 1);

            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'talent',
                    icon: '📋',
                    message: `${contract.name}'s contract has expired`,
                    priority: 'high'
                });
            }
        });

        return expiredContracts.length;
    }

    /**
     * Calculate talent compatibility with film
     */
    function calculateCompatibility(talent, film) {
        let compatibility = 50; // Base 50%

        // Genre match
        if (talent.genres && talent.genres.includes(film.genre)) {
            compatibility += 30;
        }

        // Director specialty match (for directors)
        if (talent.specialties && film.genre) {
            const genreLower = film.genre.toLowerCase();
            if (talent.specialties.some(s => s.toLowerCase().includes(genreLower))) {
                compatibility += 20;
            }
        }

        return Math.min(100, compatibility);
    }

    /**
     * Get talent statistics
     */
    function getTalentStats(gameState) {
        const currentYear = gameState.gameYear || new Date(gameState.currentDate).getFullYear();

        const totalActors = Object.keys(window.TalentRoster.ACTORS).length;
        const totalDirectors = Object.keys(window.TalentRoster.DIRECTORS).length;

        const availableActors = window.TalentRoster.getAvailableActors(currentYear, gameState);
        const availableDirectors = window.TalentRoster.getAvailableDirectors(currentYear, gameState);

        const contractActors = gameState.contractPlayers.filter(c => c.talentType === 'actor');
        const contractDirectors = gameState.contractPlayers.filter(c => c.talentType === 'director');

        const weeklyContractCosts = gameState.contractPlayers.reduce((sum, c) => sum + c.weeklyRate, 0);
        const annualContractCosts = weeklyContractCosts * 52;

        return {
            totalActors,
            totalDirectors,
            availableActors: availableActors.length,
            availableDirectors: availableDirectors.length,
            contractActors: contractActors.length,
            contractDirectors: contractDirectors.length,
            totalContracts: gameState.contractPlayers.length,
            weeklyContractCosts,
            annualContractCosts
        };
    }

    /**
     * Helper: Calculate contract expiration date
     */
    function calculateExpirationDate(years, gameState) {
        const currentDate = window.TimeSystem
            ? window.TimeSystem.getCurrentDate()
            : { month: 1, year: gameState.gameYear || 1933 };

        return {
            month: currentDate.month,
            year: currentDate.year + years
        };
    }

    /**
     * Greenlight script with talent selection
     */
    function greenlightScriptWithTalent(scriptId, directorId, actorIds, gameState) {
        // Get the script
        const script = window.ScriptLibrary.getScriptById(scriptId);
        if (!script) {
            return { success: false, message: 'Script not found' };
        }

        // Check budget
        if (gameState.cash < script.budget) {
            return { success: false, message: 'Insufficient funds for production' };
        }

        // Start production through ProductionSystem
        const film = window.ProductionSystem.startProduction(script, gameState);

        // Hire director
        if (directorId) {
            const directorHire = hireForProduction(directorId, 'director', film, gameState);
            if (directorHire.success) {
                film.director = directorHire.hire;
                film.directorSkill = directorHire.hire.starPower;
            }
        }

        // Hire actors
        if (actorIds && actorIds.length > 0) {
            film.leadActors = [];
            let totalCastPower = 0;

            actorIds.forEach(actorId => {
                const actorHire = hireForProduction(actorId, 'actor', film, gameState);
                if (actorHire.success) {
                    film.leadActors.push(actorHire.hire);
                    totalCastPower += actorHire.hire.starPower;
                }
            });

            // Calculate cast chemistry
            if (film.leadActors.length > 0) {
                film.castChemistry = Math.floor(totalCastPower / film.leadActors.length);
            }
        }

        return {
            success: true,
            film: film,
            message: `Production started on "${film.title}"`
        };
    }

    // Public API
    return {
        signContract,
        releaseFromContract,
        hireForProduction,
        getAvailableTalentForHiring,
        processWeeklyContracts,
        processYearlyContracts,
        calculateCompatibility,
        getTalentStats,
        greenlightScriptWithTalent
    };
})();
