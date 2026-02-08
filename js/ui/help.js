/**
 * HOLLYWOOD MOGUL - HELP & CODEX SYSTEM
 * Searchable database of game mechanics, tips, strategies, and historical context
 */
window.HelpSystem = (function() {
    'use strict';

    let helpModal = null;
    let currentCategory = 'all';
    let searchTerm = '';

    /**
     * Help Database - Comprehensive game mechanics guide
     */
    const HELP_DATABASE = {
        // PRODUCTION
        production_basics: {
            id: 'production_basics',
            category: 'production',
            title: 'Production Basics',
            icon: '🎬',
            content: `
                <h3>How Film Production Works</h3>
                <p>Films progress through five distinct phases:</p>
                <ol>
                    <li><strong>Pre-Production (2-3 weeks):</strong> Planning, casting, location scouting</li>
                    <li><strong>Principal Photography (varies):</strong> Actual filming based on shooting days</li>
                    <li><strong>Post-Production (3-4 weeks):</strong> Editing, sound, visual effects</li>
                    <li><strong>Ready for Release:</strong> Film complete, choose distribution strategy</li>
                    <li><strong>In Theaters (8-12 weeks):</strong> Box office run</li>
                </ol>
                <div class="help-tip">Production time varies by budget: Low-budget films complete faster, epics take longer.</div>
            `,
            keywords: ['production', 'phases', 'filming', 'greenlight', 'movies']
        },

        quality_factors: {
            id: 'quality_factors',
            category: 'production',
            title: 'Film Quality Factors',
            icon: '⭐',
            content: `
                <h3>What Makes a Quality Film?</h3>
                <p>Film quality (0-100) is determined by:</p>
                <ul>
                    <li><strong>Script Quality:</strong> Base quality of the screenplay (major factor)</li>
                    <li><strong>Budget:</strong> Higher budgets allow better production values</li>
                    <li><strong>Talent:</strong> Star actors and acclaimed directors boost quality</li>
                    <li><strong>Production Events:</strong> Your decisions during filming</li>
                    <li><strong>Studio Facilities:</strong> Better facilities improve all productions</li>
                    <li><strong>Genre Match:</strong> Right talent for the right genre</li>
                </ul>
                <div class="help-tip"><strong>Quality Tiers:</strong> 0-40 (Poor), 41-60 (Average), 61-75 (Good), 76-85 (Excellent), 86+ (Masterpiece)</div>
            `,
            keywords: ['quality', 'film', 'script', 'talent', 'budget']
        },

        budget_management: {
            id: 'budget_management',
            category: 'production',
            title: 'Managing Budgets',
            icon: '💵',
            content: `
                <h3>Budget Strategy</h3>
                <p>Production budgets are crucial to your studio's health:</p>
                <ul>
                    <li><strong>Low Budget ($20-50K):</strong> Safe, fast, limited upside</li>
                    <li><strong>Mid Budget ($50-100K):</strong> Balanced risk/reward, recommended for beginners</li>
                    <li><strong>High Budget ($100-200K+):</strong> Prestige projects, risky, high potential</li>
                </ul>
                <div class="help-warning"><strong>Warning:</strong> Budget is deducted immediately on greenlight. Make sure you have enough runway!</div>
                <div class="help-tip">Going over budget during production can improve quality but drains cash reserves.</div>
            `,
            keywords: ['budget', 'money', 'cost', 'greenlight', 'spending']
        },

        // FINANCIAL
        cash_management: {
            id: 'cash_management',
            category: 'financial',
            title: 'Cash Flow Management',
            icon: '💰',
            content: `
                <h3>Understanding Your Finances</h3>
                <p>Three critical numbers to monitor:</p>
                <ul>
                    <li><strong>Cash on Hand:</strong> Your available liquid funds</li>
                    <li><strong>Monthly Burn:</strong> Fixed costs paid every 4 weeks ($30,000 base)</li>
                    <li><strong>Runway:</strong> Weeks until bankruptcy if no revenue comes in</li>
                </ul>
                <h4>Monthly Burn Includes:</h4>
                <ul>
                    <li>Studio lot maintenance and utilities</li>
                    <li>Salaried staff (executives, permanent crew)</li>
                    <li>Facility costs (sound stages, back lots, etc.)</li>
                    <li>Contract talent salaries</li>
                    <li>Loan payments</li>
                </ul>
                <div class="help-warning"><strong>CRITICAL:</strong> If cash hits $0, you go bankrupt and lose! Keep runway above 4 weeks minimum.</div>
            `,
            keywords: ['cash', 'money', 'burn', 'runway', 'bankruptcy', 'finances']
        },

        loans_credit: {
            id: 'loans_credit',
            category: 'financial',
            title: 'Loans & Credit',
            icon: '🏦',
            content: `
                <h3>Emergency Financing</h3>
                <p>When cash runs low, you have loan options:</p>
                <h4>Bank Loans</h4>
                <ul>
                    <li>Amount: $25,000 - $100,000</li>
                    <li>Interest: 5-10% monthly</li>
                    <li>Repayment: Monthly installments</li>
                    <li>Requires good reputation</li>
                </ul>
                <h4>States Rights Advances</h4>
                <ul>
                    <li>Sell distribution rights for upfront cash</li>
                    <li>No repayment but forfeit box office revenue</li>
                    <li>Safe option for low-quality films</li>
                </ul>
                <div class="help-tip"><strong>Pro Tip:</strong> Only borrow when you have films about to release that will generate revenue to repay.</div>
            `,
            keywords: ['loan', 'borrow', 'debt', 'credit', 'bank', 'money']
        },

        revenue_streams: {
            id: 'revenue_streams',
            category: 'financial',
            title: 'Revenue & Profitability',
            icon: '📈',
            content: `
                <h3>How You Make Money</h3>
                <h4>Box Office Revenue</h4>
                <p>Your primary income source. Revenue depends on:</p>
                <ul>
                    <li>Film quality and genre appeal</li>
                    <li>Distribution strategy (wide vs. limited)</li>
                    <li>Star power and word-of-mouth</li>
                    <li>Marketing spend</li>
                </ul>
                <h4>Studio Share</h4>
                <p>You don't get 100% of box office gross:</p>
                <ul>
                    <li><strong>Wide Release:</strong> ~50% of gross (theaters take their cut)</li>
                    <li><strong>Limited Release:</strong> ~45% of gross</li>
                    <li><strong>States Rights:</strong> Fixed payment, no ongoing revenue</li>
                </ul>
                <div class="help-tip">A film needs to gross 2-3x its budget to be profitable after theater cuts and marketing costs.</div>
            `,
            keywords: ['revenue', 'money', 'profit', 'box office', 'earnings']
        },

        // DISTRIBUTION
        distribution_strategies: {
            id: 'distribution_strategies',
            category: 'distribution',
            title: 'Distribution Strategies',
            icon: '🎞️',
            content: `
                <h3>Releasing Your Films</h3>
                <h4>Wide Release</h4>
                <ul>
                    <li><strong>Theaters:</strong> 500+</li>
                    <li><strong>Marketing:</strong> High ($10,000+)</li>
                    <li><strong>Best for:</strong> High-quality films, star vehicles</li>
                    <li><strong>Risk:</strong> High upfront cost</li>
                </ul>
                <h4>Limited Release</h4>
                <ul>
                    <li><strong>Theaters:</strong> 100-300</li>
                    <li><strong>Marketing:</strong> Modest ($3,000-$5,000)</li>
                    <li><strong>Best for:</strong> Art films, experimental works</li>
                    <li><strong>Risk:</strong> Lower potential but safer</li>
                </ul>
                <h4>States Rights Sale</h4>
                <ul>
                    <li><strong>Immediate payment</strong> based on quality</li>
                    <li><strong>No marketing costs</strong></li>
                    <li><strong>Best for:</strong> Low-quality films, desperate cash situations</li>
                    <li><strong>Risk:</strong> None, but limited upside</li>
                </ul>
            `,
            keywords: ['distribution', 'release', 'theaters', 'marketing', 'wide', 'limited']
        },

        box_office_mechanics: {
            id: 'box_office_mechanics',
            category: 'distribution',
            title: 'Box Office Mechanics',
            icon: '📊',
            content: `
                <h3>How Box Office Works</h3>
                <h4>Opening Weekend</h4>
                <p>Critical first week based on:</p>
                <ul>
                    <li>Film quality (most important)</li>
                    <li>Star power multiplier</li>
                    <li>Genre appeal (Westerns and Musicals popular in this era)</li>
                    <li>Number of theaters</li>
                    <li>Marketing spend</li>
                </ul>
                <h4>Weekly Dropoff</h4>
                <p>Revenue typically declines each week:</p>
                <ul>
                    <li><strong>Excellent films (75+):</strong> Hold well, 20-30% dropoff</li>
                    <li><strong>Good films (60-75):</strong> Moderate decline, 35-45% dropoff</li>
                    <li><strong>Poor films (&lt;60):</strong> Steep decline, 50-70% dropoff</li>
                </ul>
                <div class="help-tip">Some exceptional films gain momentum through word-of-mouth and can grow in week 2!</div>
            `,
            keywords: ['box office', 'revenue', 'opening', 'weekend', 'dropoff']
        },

        // TALENT
        talent_system: {
            id: 'talent_system',
            category: 'talent',
            title: 'Talent Management',
            icon: '🌟',
            content: `
                <h3>Hiring Actors & Directors</h3>
                <h4>Star Tiers</h4>
                <ul>
                    <li><strong>A-List:</strong> Major box office draw, expensive, boost opening weekend 50%+</li>
                    <li><strong>B-List:</strong> Reliable, moderate cost, 25% boost</li>
                    <li><strong>C-List:</strong> Supporting players, affordable, small boost</li>
                    <li><strong>Unknown:</strong> Cheap, can be developed into stars</li>
                </ul>
                <h4>Hiring Options</h4>
                <ul>
                    <li><strong>Per-Film:</strong> No commitment, pay market rate</li>
                    <li><strong>Long-Term Contract:</strong> Adds to monthly burn, exclusive rights, builds loyalty</li>
                </ul>
                <div class="help-tip">Develop unknowns into stars by giving them good roles in quality films!</div>
            `,
            keywords: ['talent', 'actors', 'stars', 'directors', 'casting', 'contracts']
        },

        star_development: {
            id: 'star_development',
            category: 'talent',
            title: 'Developing Stars',
            icon: '⭐',
            content: `
                <h3>The Star System</h3>
                <p>Build your own stable of stars:</p>
                <h4>How Stars Develop</h4>
                <ol>
                    <li>Sign unknown talent to long-term contract</li>
                    <li>Cast them in quality films (60+ quality)</li>
                    <li>Successful films increase their star power</li>
                    <li>After 2-3 hit films, they become B-List or A-List</li>
                </ol>
                <h4>Benefits of Contract Players</h4>
                <ul>
                    <li>Fixed monthly cost (cheaper than per-film for frequent use)</li>
                    <li>Exclusive to your studio (rivals can't use them)</li>
                    <li>Build audience recognition and loyalty</li>
                    <li>Develop them into A-listers worth millions</li>
                </ul>
                <div class="help-warning">Contract talent adds to monthly burn. Don't over-commit!</div>
            `,
            keywords: ['stars', 'development', 'contracts', 'talent', 'actors']
        },

        // STUDIO
        facilities: {
            id: 'facilities',
            category: 'studio',
            title: 'Studio Facilities',
            icon: '🏗️',
            content: `
                <h3>Upgrading Your Studio</h3>
                <h4>Available Facilities</h4>
                <ul>
                    <li><strong>Additional Sound Stages:</strong> Produce multiple films simultaneously</li>
                    <li><strong>Back Lot:</strong> Reduce production costs by 10-15%</li>
                    <li><strong>Post-Production Suite:</strong> Improve all film quality by +5</li>
                    <li><strong>Talent Bungalows:</strong> Attract better stars, improve contract negotiations</li>
                    <li><strong>Screening Room:</strong> Better distribution deals</li>
                </ul>
                <h4>Cost vs. Benefit</h4>
                <p>Facilities are expensive but provide long-term value:</p>
                <ul>
                    <li>High upfront cost ($50,000 - $200,000)</li>
                    <li>Increase monthly burn ($2,000 - $10,000)</li>
                    <li>Benefits apply to all future productions</li>
                    <li>Essential for mid-late game competitiveness</li>
                </ul>
            `,
            keywords: ['studio', 'facilities', 'upgrades', 'sound stage', 'lot']
        },

        // HISTORICAL
        hays_code: {
            id: 'hays_code',
            category: 'historical',
            title: 'The Hays Code (1934)',
            icon: '📜',
            content: `
                <h3>Censorship Era Begins</h3>
                <p>In July 1934, the Production Code Administration (PCA) begins strict enforcement of moral standards.</p>
                <h4>Forbidden Content</h4>
                <ul>
                    <li>Sexual content and adultery</li>
                    <li>Excessive violence</li>
                    <li>Drug use and trafficking</li>
                    <li>Disrespect for religion</li>
                    <li>Negative portrayal of law enforcement</li>
                </ul>
                <h4>Impact on Your Studio</h4>
                <ul>
                    <li>Scripts flagged for "censor risk"</li>
                    <li>High-risk scripts may be rejected or require changes</li>
                    <li>Changes reduce film quality and delay release</li>
                    <li>High reputation helps negotiate with censors</li>
                </ul>
                <div class="help-tip">Pre-Code films (before 1934) could push boundaries. After July 1934, play it safe or build high reputation.</div>
            `,
            keywords: ['hays code', 'censorship', 'pca', 'production code', 'censors']
        },

        world_war_ii: {
            id: 'world_war_ii',
            category: 'historical',
            title: 'World War II (1941-1945)',
            icon: '🎖️',
            content: `
                <h3>War Years</h3>
                <p>After Pearl Harbor (Dec 1941), the war affects every aspect of filmmaking.</p>
                <h4>Challenges</h4>
                <ul>
                    <li><strong>Talent Drafted:</strong> Stars and crew may be called to military service</li>
                    <li><strong>Material Rationing:</strong> Film stock and equipment shortages</li>
                    <li><strong>Reduced Budgets:</strong> Wartime economy limits lavish productions</li>
                    <li><strong>Pressure for Propaganda:</strong> Government requests war-themed films</li>
                </ul>
                <h4>Opportunities</h4>
                <ul>
                    <li>War films are popular and patriotic</li>
                    <li>Supporting war effort builds reputation</li>
                    <li>Female talent has more opportunities</li>
                    <li>Escapist entertainment highly valued</li>
                </ul>
                <div class="help-tip">Balance patriotic films with escapist entertainment. Audiences need both!</div>
            `,
            keywords: ['world war', 'wwii', 'war', '1941', '1945', 'military']
        },

        huac_hearings: {
            id: 'huac_hearings',
            category: 'historical',
            title: 'HUAC Hearings (1947)',
            icon: '⚖️',
            content: `
                <h3>The Red Scare</h3>
                <p>House Un-American Activities Committee investigates Communist influence in Hollywood.</p>
                <h4>The Blacklist</h4>
                <p>You may be pressured to:</p>
                <ul>
                    <li>Name suspected Communists in your employ</li>
                    <li>Fire certain talent or crew</li>
                    <li>Cooperate with investigators</li>
                </ul>
                <h4>Your Choices</h4>
                <ul>
                    <li><strong>Cooperate:</strong> Maintain business relationships, damage reputation with talent</li>
                    <li><strong>Resist:</strong> Preserve integrity, risk business consequences</li>
                    <li><strong>Navigate Carefully:</strong> High reputation provides more options</li>
                </ul>
                <div class="help-warning">These are difficult moral choices with no easy answers. Your decisions affect the ending you receive.</div>
            `,
            keywords: ['huac', 'blacklist', 'communist', 'red scare', '1947']
        },

        paramount_decision: {
            id: 'paramount_decision',
            category: 'historical',
            title: 'Paramount Decision (1948)',
            icon: '⚖️',
            content: `
                <h3>Antitrust Ruling</h3>
                <p>Supreme Court rules that studios cannot own theater chains - breaking the studio system monopoly.</p>
                <h4>Impact</h4>
                <ul>
                    <li>Studios must divest theater ownership</li>
                    <li>More competitive marketplace</li>
                    <li>Independent theaters have more power</li>
                    <li>Changed distribution economics</li>
                </ul>
                <h4>For Your Studio</h4>
                <ul>
                    <li>Negotiating distribution becomes more important</li>
                    <li>Quality matters more than ever</li>
                    <li>Smaller studios can compete better</li>
                </ul>
            `,
            keywords: ['paramount', 'antitrust', 'supreme court', '1948', 'theaters']
        },

        // STRATEGY
        early_game_strategy: {
            id: 'early_game_strategy',
            category: 'strategy',
            title: 'Early Game Strategy (1933-1936)',
            icon: '🎯',
            content: `
                <h3>Surviving the First Years</h3>
                <h4>First Priorities</h4>
                <ol>
                    <li><strong>Build Cash Reserves:</strong> Don't spend everything immediately</li>
                    <li><strong>Start Small:</strong> 2-3 mid-budget films ($50-75K)</li>
                    <li><strong>Focus on Quality:</strong> Better to make 2 good films than 4 bad ones</li>
                    <li><strong>Watch Your Runway:</strong> Never let it drop below 8 weeks</li>
                </ol>
                <h4>Pre-Code Opportunity (Before July 1934)</h4>
                <p>Take advantage of lax censorship:</p>
                <ul>
                    <li>Make edgy, controversial films while you can</li>
                    <li>Crime dramas and mature content are acceptable</li>
                    <li>After Hays Code enforcement, content is restricted</li>
                </ul>
                <div class="help-tip">Your goal is to reach 1937 with positive cash flow and 5+ completed films.</div>
            `,
            keywords: ['strategy', 'early', 'beginning', 'start', 'tips']
        },

        mid_game_strategy: {
            id: 'mid_game_strategy',
            category: 'strategy',
            title: 'Mid Game Strategy (1937-1944)',
            icon: '🎯',
            content: `
                <h3>Building Your Empire</h3>
                <h4>Expansion Phase</h4>
                <ul>
                    <li><strong>Invest in Facilities:</strong> Sound stages, back lot, post-production</li>
                    <li><strong>Sign Contract Talent:</strong> Build your stable of stars</li>
                    <li><strong>Bigger Budgets:</strong> Move to $100-150K prestige pictures</li>
                    <li><strong>Diversify:</strong> Mix genres to spread risk</li>
                </ul>
                <h4>World War II (1941-1945)</h4>
                <ul>
                    <li>Make patriotic films for reputation boost</li>
                    <li>But also provide escapist entertainment</li>
                    <li>Prepare for talent being drafted</li>
                    <li>Manage wartime budget constraints</li>
                </ul>
                <div class="help-tip">This is the time to grow. Aim for 15+ films completed and $300,000+ cash by 1945.</div>
            `,
            keywords: ['strategy', 'mid', 'middle', 'expansion', 'growth']
        },

        late_game_strategy: {
            id: 'late_game_strategy',
            category: 'strategy',
            title: 'Late Game Strategy (1945-1949)',
            icon: '🎯',
            content: `
                <h3>The Final Push</h3>
                <h4>Victory Conditions</h4>
                <p>Choose your path to success:</p>
                <ul>
                    <li><strong>Mogul Ending:</strong> $500,000+ cash, 20+ films</li>
                    <li><strong>Prestige Ending:</strong> 5+ Oscars, reputation 80+</li>
                    <li><strong>Integrity Ending:</strong> Refuse to cooperate with HUAC</li>
                </ul>
                <h4>HUAC Era (1947-1949)</h4>
                <p>The most challenging period:</p>
                <ul>
                    <li>Make moral choices about the blacklist</li>
                    <li>High reputation gives you more options</li>
                    <li>Decisions affect which ending you receive</li>
                </ul>
                <div class="help-tip">You can achieve multiple endings simultaneously! Aim for all three if possible.</div>
            `,
            keywords: ['strategy', 'late', 'endgame', 'ending', 'victory']
        },

        genre_guide: {
            id: 'genre_guide',
            category: 'strategy',
            title: 'Genre Guide',
            icon: '🎭',
            content: `
                <h3>Understanding Genres</h3>
                <h4>Popular in this Era</h4>
                <ul>
                    <li><strong>Drama:</strong> Reliable, broad appeal, Oscar potential</li>
                    <li><strong>Musical:</strong> Very popular, high production values</li>
                    <li><strong>Western:</strong> Consistent performer, action-oriented</li>
                    <li><strong>Noir:</strong> Sophisticated, growing audience (post-1940)</li>
                    <li><strong>Comedy:</strong> Safe, escapist, moderate returns</li>
                </ul>
                <h4>Niche Genres</h4>
                <ul>
                    <li><strong>Horror:</strong> Low budget, cult following</li>
                    <li><strong>War:</strong> Especially 1941-1945, patriotic</li>
                    <li><strong>Romance:</strong> Female-focused, steady audience</li>
                </ul>
                <div class="help-tip">Match talent to genre! Musical stars in musicals, tough guys in noir, etc.</div>
            `,
            keywords: ['genre', 'types', 'drama', 'comedy', 'western', 'musical']
        }
    };

    /**
     * Help Categories
     */
    const CATEGORIES = {
        all: { name: 'All Topics', icon: '📚' },
        production: { name: 'Production', icon: '🎬' },
        financial: { name: 'Financial', icon: '💰' },
        distribution: { name: 'Distribution', icon: '🎞️' },
        talent: { name: 'Talent', icon: '🌟' },
        studio: { name: 'Studio', icon: '🏗️' },
        historical: { name: 'Historical', icon: '📜' },
        strategy: { name: 'Strategy', icon: '🎯' }
    };

    /**
     * Initialize help system
     */
    function init() {
        createHelpButton();
    }

    /**
     * Create help button in header
     */
    function createHelpButton() {
        const header = document.getElementById('game-header');
        if (!header) return;

        const helpButton = document.createElement('button');
        helpButton.id = 'help-button';
        helpButton.className = 'help-button';
        helpButton.innerHTML = '?';
        helpButton.title = 'Help & Codex';
        helpButton.onclick = openHelp;

        header.appendChild(helpButton);
    }

    /**
     * Open help modal
     */
    function openHelp() {
        if (helpModal) {
            helpModal.remove();
        }

        createHelpModal();
        renderHelpContent();
    }

    /**
     * Create help modal structure
     */
    function createHelpModal() {
        helpModal = document.createElement('div');
        helpModal.id = 'help-modal';
        helpModal.className = 'help-modal-overlay';

        helpModal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-header">
                    <h2>Help & Codex</h2>
                    <button class="help-close" onclick="HelpSystem.closeHelp()">×</button>
                </div>

                <div class="help-search">
                    <input type="text"
                           id="help-search-input"
                           placeholder="Search help topics..."
                           oninput="HelpSystem.handleSearch(this.value)">
                    <button class="help-search-btn">🔍</button>
                </div>

                <div class="help-categories">
                    ${renderCategories()}
                </div>

                <div class="help-content-area">
                    <div id="help-topics-list" class="help-topics-list"></div>
                    <div id="help-article" class="help-article"></div>
                </div>

                <div class="help-footer">
                    <button onclick="TutorialSystem.startTutorial()" class="help-action-btn">
                        Replay Tutorial
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(helpModal);

        // Close on escape key
        document.addEventListener('keydown', handleEscapeKey);
    }

    /**
     * Render category buttons
     */
    function renderCategories() {
        return Object.entries(CATEGORIES).map(([key, cat]) => {
            const activeClass = key === currentCategory ? 'active' : '';
            return `
                <button class="help-category-btn ${activeClass}"
                        data-category="${key}"
                        onclick="HelpSystem.selectCategory('${key}')">
                    <span class="category-icon">${cat.icon}</span>
                    <span class="category-name">${cat.name}</span>
                </button>
            `;
        }).join('');
    }

    /**
     * Render help content based on current filters
     */
    function renderHelpContent() {
        const topicsList = document.getElementById('help-topics-list');
        if (!topicsList) return;

        // Filter topics
        let topics = Object.values(HELP_DATABASE);

        // Filter by category
        if (currentCategory !== 'all') {
            topics = topics.filter(t => t.category === currentCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            topics = topics.filter(t => {
                return t.title.toLowerCase().includes(lowerSearch) ||
                       t.keywords.some(k => k.includes(lowerSearch)) ||
                       t.content.toLowerCase().includes(lowerSearch);
            });
        }

        // Render topics
        if (topics.length === 0) {
            topicsList.innerHTML = '<div class="no-results">No help topics found</div>';
            return;
        }

        topicsList.innerHTML = topics.map(topic => `
            <div class="help-topic-item" onclick="HelpSystem.showArticle('${topic.id}')">
                <div class="topic-icon">${topic.icon}</div>
                <div class="topic-title">${topic.title}</div>
            </div>
        `).join('');

        // Auto-select first topic if none selected
        if (topics.length > 0) {
            showArticle(topics[0].id);
        }
    }

    /**
     * Show specific help article
     */
    function showArticle(topicId) {
        const topic = HELP_DATABASE[topicId];
        if (!topic) return;

        const article = document.getElementById('help-article');
        if (!article) return;

        article.innerHTML = `
            <div class="article-header">
                <div class="article-icon">${topic.icon}</div>
                <h3>${topic.title}</h3>
            </div>
            <div class="article-content">
                ${topic.content}
            </div>
        `;

        // Highlight active topic
        document.querySelectorAll('.help-topic-item').forEach(item => {
            item.classList.remove('active');
        });
        event?.target?.closest('.help-topic-item')?.classList.add('active');
    }

    /**
     * Select category
     */
    function selectCategory(category) {
        currentCategory = category;

        // Update active state
        document.querySelectorAll('.help-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        renderHelpContent();
    }

    /**
     * Handle search input
     */
    function handleSearch(value) {
        searchTerm = value.trim();
        renderHelpContent();
    }

    /**
     * Close help modal
     */
    function closeHelp() {
        if (helpModal) {
            helpModal.remove();
            helpModal = null;
        }
        document.removeEventListener('keydown', handleEscapeKey);
    }

    /**
     * Handle escape key
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeHelp();
        }
    }

    /**
     * Get help on specific topic (can be called from game)
     */
    function showTopic(topicId) {
        openHelp();
        setTimeout(() => showArticle(topicId), 100);
    }

    // Public API
    return {
        init,
        openHelp,
        closeHelp,
        selectCategory,
        handleSearch,
        showArticle,
        showTopic
    };
})();
