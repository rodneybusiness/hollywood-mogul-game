/**
 * HOLLYWOOD MOGUL - HISTORICAL EVENTS SYSTEM
 * Major milestones and historical moments from 1933-2010
 * Includes: Hays Code (1934), WWII (1941-1945), HUAC (1947-1949)
 * EXPANDED: 60+ authentic historical events covering the full era
 */

window.HistoricalEvents = (function() {
    'use strict';

    // Track which events have already been triggered
    let triggeredEvents = new Set();

    /**
     * Complete historical event database organized chronologically
     * Multiple events per year/month supported
     */
    const HISTORICAL_EVENTS = [
        // ============================================================
        // 1933 - GAME START & EARLY EVENTS
        // ============================================================

        {
            year: 1933,
            month: 1,
            id: 'game_start',
            title: 'The Golden Age Begins',
            description: 'Welcome to Hollywood in 1933. The talkies have revolutionized cinema, and the studio system is at its peak. But challenges lie ahead...',
            type: 'milestone',
            importance: 'major',
            effects: {},
            modal: {
                title: '🎬 Welcome to Hollywood - 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>The Golden Age of Hollywood has begun.</strong></p>
                        <p>Sound pictures have revolutionized the industry. Studios control everything: production, distribution, and exhibition. You have the opportunity to build a legendary studio.</p>
                        <h3>Key Facts:</h3>
                        <ul>
                            <li>Average film budget: $50,000-$150,000</li>
                            <li>No content restrictions yet (Pre-Code era)</li>
                            <li>Stars earn $1,000-$5,000 per week</li>
                            <li>Roosevelt's New Deal is reshaping America</li>
                        </ul>
                        <p><em>The next 16 years will test your business acumen, artistic vision, and moral compass.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD ENTERS GOLDEN AGE OF SOUND PICTURES'
        },

        {
            year: 1933,
            month: 6,
            id: 'nra_studios',
            title: 'National Recovery Act Affects Studios',
            description: 'Roosevelt\'s NRA establishes industry codes, including minimum wages and maximum hours for film workers.',
            type: 'political',
            importance: 'minor',
            effects: {
                production_costs: 1.05
            },
            modal: {
                title: '🏛️ National Recovery Act - June 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>New Deal legislation impacts Hollywood.</strong></p>
                        <p>The National Industrial Recovery Act creates industry codes governing labor practices.</p>
                        <h3>Changes for Studios:</h3>
                        <ul>
                            <li>Minimum wage requirements for crew</li>
                            <li>40-hour work week (with overtime)</li>
                            <li>Child actor protections strengthened</li>
                            <li>Union organizing rights protected</li>
                        </ul>
                        <p><strong>Effect:</strong> Production costs increase by 5%</p>
                    </div>
                `
            },
            newspaperHeadline: 'NEW DEAL BRINGS NEW RULES TO HOLLYWOOD'
        },

        {
            year: 1933,
            month: 8,
            id: 'production_code_written',
            title: 'Production Code Written',
            description: 'The Motion Picture Production Code is formally drafted, though not yet enforced. The Pre-Code era continues for now.',
            type: 'industry',
            importance: 'minor',
            effects: {},
            modal: {
                title: '📜 Production Code Written - August 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>Moral guidelines drafted, but not enforced yet.</strong></p>
                        <p>The Production Code has been written by Catholic leaders and Will Hays, but studios largely ignore it. The "Pre-Code" era of risqué content continues.</p>
                        <h3>What the Code Says:</h3>
                        <ul>
                            <li>No profanity or vulgarity</li>
                            <li>Crime must not be glorified</li>
                            <li>Sanctity of marriage upheld</li>
                            <li>No ridicule of religion</li>
                        </ul>
                        <p><em>But for now... studios are ignoring these rules. Enjoy it while it lasts.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'MORAL CODE WRITTEN BUT WIDELY IGNORED'
        },

        {
            year: 1933,
            month: 11,
            id: 'king_kong_premiere',
            title: 'King Kong Premieres',
            description: 'RKO\'s revolutionary special effects spectacle proves audiences crave escapist entertainment during the Depression.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                spectacle_films_boost: 1.15,
                special_effects_interest: 10
            },
            modal: {
                title: '🦍 King Kong - November 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>King Kong becomes a sensation!</strong></p>
                        <p>RKO's revolutionary use of stop-motion animation creates a movie monster for the ages. Budget: $672,000. Box office: Over $2 million.</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Special effects films gain credibility</li>
                            <li>Spectacle movies see 15% boost</li>
                            <li>Depression-era audiences want escapism</li>
                            <li>Movie monsters become bankable</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'KING KONG CONQUERS BOX OFFICE WITH SPECTACULAR EFFECTS'
        },

        {
            year: 1933,
            month: 12,
            id: 'prohibition_ends',
            title: 'Prohibition Ends',
            description: 'The 21st Amendment repeals Prohibition. Studios can now show drinking without moral condemnation.',
            type: 'milestone',
            importance: 'major',
            effects: {
                content_freedom: 5,
                nightclub_scenes_viable: true
            },
            modal: {
                title: '🍸 Prohibition Repealed - December 1933',
                content: `
                    <div class="historical-event">
                        <p><strong>The "Noble Experiment" is over.</strong></p>
                        <p>After 13 years, Americans can legally drink alcohol again. This changes the content landscape for Hollywood films.</p>
                        <h3>Impact on Films:</h3>
                        <ul>
                            <li>Nightclub scenes become glamorous again</li>
                            <li>Sophisticated comedies can show drinking</li>
                            <li>Film noir will benefit (when it emerges)</li>
                            <li>Social realism can depict bars honestly</li>
                        </ul>
                        <p><em>Toast to creative freedom... while it lasts!</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'PROHIBITION ENDS - HOLLYWOOD RAISES A GLASS'
        },

        // ============================================================
        // 1934 - HAYS CODE ENFORCEMENT YEAR
        // ============================================================

        {
            year: 1934,
            month: 2,
            id: 'shirley_temple_star',
            title: 'Shirley Temple Becomes Top Box Office Star',
            description: 'At age 6, Shirley Temple\'s wholesome charm makes her Hollywood\'s biggest star, signaling changing audience tastes.',
            type: 'industry',
            importance: 'minor',
            effects: {
                family_films_boost: 1.2,
                child_star_value: 15
            },
            modal: {
                title: '⭐ Shirley Temple Phenomenon - February 1934',
                content: `
                    <div class="historical-event">
                        <p><strong>A six-year-old becomes Hollywood's biggest star!</strong></p>
                        <p>Shirley Temple's wholesome optimism resonates with Depression-weary audiences. She earns $1,250 per week.</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Family films get 20% box office boost</li>
                            <li>Child stars become highly valuable</li>
                            <li>Wholesome content proves profitable</li>
                            <li>Studios rush to find "the next Shirley"</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'SHIRLEY TEMPLE, 6, TOPS BOX OFFICE STARS'
        },

        {
            year: 1934,
            month: 7,
            id: 'hays_code_enforced',
            title: 'Production Code Administration Established',
            description: 'Joseph Breen\'s Production Code Administration begins enforcing strict moral guidelines. All scripts must now be approved before filming.',
            type: 'censorship',
            importance: 'major',
            effects: {
                censorship_active: true,
                reputation_requirement: 40,
                content_restrictions: 25
            },
            modal: {
                title: '⚖️ The Hays Code - July 1934',
                content: `
                    <div class="historical-event">
                        <p><strong>The Production Code Administration (PCA) is now in effect.</strong></p>
                        <p>Joseph Breen will review all scripts for moral content. Films depicting crime, sex, or irreligion must be handled with "good taste."</p>
                        <h3>New Rules:</h3>
                        <ul>
                            <li>❌ No explicit sexuality or nudity</li>
                            <li>❌ Crime cannot be glorified</li>
                            <li>❌ Adultery must be punished</li>
                            <li>❌ Religious mockery forbidden</li>
                            <li>❌ Interracial relationships prohibited</li>
                            <li>⚠️ Scripts must receive PCA seal before filming</li>
                        </ul>
                        <p><strong>Impact on your studio:</strong></p>
                        <ul>
                            <li>Some scripts will now be flagged for content</li>
                            <li>You may need to make script changes</li>
                            <li>Reshoots may be required</li>
                            <li>Films without the seal cannot be exhibited</li>
                        </ul>
                        <p><em>"The Pre-Code era is over. Welcome to the age of moral enforcement."</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'PRODUCTION CODE NOW ENFORCED - HOLLYWOOD MORALITY CRACKDOWN BEGINS'
        },

        {
            year: 1934,
            month: 9,
            id: 'it_happened_one_night',
            title: 'It Happened One Night Sweep',
            description: 'Frank Capra\'s romantic comedy wins all five major Oscars, proving quality can triumph under the Code.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                romantic_comedy_boost: 1.15,
                capra_style_popular: true
            },
            modal: {
                title: '🏆 It Happened One Night - September 1934',
                content: `
                    <div class="historical-event">
                        <p><strong>Romantic comedy wins Big Five Oscars!</strong></p>
                        <p>Frank Capra's film wins Picture, Director, Actor, Actress, and Screenplay - unprecedented!</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Romantic comedies get 15% boost</li>
                            <li>"Capra-corn" style becomes popular</li>
                            <li>Proves Code-friendly films can win big</li>
                            <li>Screwball comedy genre takes off</li>
                        </ul>
                        <p><em>Plus: Men's undershirt sales plummet after Gable appears shirtless!</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'IT HAPPENED ONE NIGHT SWEEPS OSCARS'
        },

        {
            year: 1934,
            month: 11,
            id: 'legion_of_decency',
            title: 'Catholic Legion of Decency Formed',
            description: 'Catholic Church creates powerful censorship organization to rate films. Their condemnation can kill a movie.',
            type: 'political',
            importance: 'minor',
            effects: {
                catholic_censorship: true,
                content_risk: 15
            },
            modal: {
                title: '✝️ Legion of Decency - November 1934',
                content: `
                    <div class="historical-event">
                        <p><strong>Catholic Church forms film censorship board.</strong></p>
                        <p>The Legion of Decency will rate all films. Catholics pledge to boycott "condemned" movies.</p>
                        <h3>Rating System:</h3>
                        <ul>
                            <li>A-I: Morally Unobjectionable (safe)</li>
                            <li>A-II: Adults (some caution)</li>
                            <li>B: Morally Objectionable (risky)</li>
                            <li>C: Condemned (box office death)</li>
                        </ul>
                        <p><strong>Impact:</strong> Religious content issues now extremely risky</p>
                    </div>
                `
            },
            newspaperHeadline: 'CATHOLIC LEGION PLEDGES TO BOYCOTT IMMORAL FILMS'
        },

        // ============================================================
        // 1935 - LABOR ORGANIZING & PARTNERSHIPS
        // ============================================================

        {
            year: 1935,
            month: 3,
            id: 'astaire_rogers_partnership',
            title: 'Astaire-Rogers Partnership Begins',
            description: 'Fred Astaire and Ginger Rogers become RKO\'s golden team, saving the studio with their musicals.',
            type: 'industry',
            importance: 'minor',
            effects: {
                musical_genre_boost: 1.2,
                dance_sequences_popular: true
            },
            modal: {
                title: '💃 Astaire & Rogers - March 1935',
                content: `
                    <div class="historical-event">
                        <p><strong>Fred Astaire and Ginger Rogers become Hollywood's dream team!</strong></p>
                        <p>Their sophisticated musicals prove escapist entertainment is Depression-proof. RKO's profits soar.</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Musical genre gets 20% boost</li>
                            <li>Dance sequences become must-haves</li>
                            <li>Romantic chemistry sells tickets</li>
                            <li>Art Deco style dominates sets</li>
                        </ul>
                        <p><em>"She gives him sex, he gives her class." - Katharine Hepburn</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'ASTAIRE & ROGERS DANCE INTO BOX OFFICE GOLD'
        },

        {
            year: 1935,
            month: 5,
            id: 'will_rogers_death',
            title: 'Will Rogers Dies in Plane Crash',
            description: 'America\'s beloved humorist and top box office star dies at 55. Hollywood mourns.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                rural_comedy_decline: 0.9,
                industry_mourning: true
            },
            modal: {
                title: '💔 Will Rogers Dies - May 1935',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood loses its most beloved star.</strong></p>
                        <p>Will Rogers, top box office draw and America's humorist, dies in Alaska plane crash with aviator Wiley Post.</p>
                        <h3>Rogers' Legacy:</h3>
                        <ul>
                            <li>71 films in 7 years</li>
                            <li>Top box office star 1933-1935</li>
                            <li>Known for folksy wisdom</li>
                            <li>Never said a mean word about anyone</li>
                        </ul>
                        <p><em>"I never met a man I didn't like." - Will Rogers</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'WILL ROGERS KILLED IN ALASKA PLANE CRASH'
        },

        {
            year: 1935,
            month: 7,
            id: 'sag_formation',
            title: 'Screen Actors Guild Founded',
            description: 'Actors form union to negotiate better contracts and working conditions. Studio power begins to shift.',
            type: 'milestone',
            importance: 'major',
            effects: {
                actor_costs: 1.1,
                production_time: 1.05,
                labor_relations: 10
            },
            modal: {
                title: '⭐ Screen Actors Guild Founded - July 1935',
                content: `
                    <div class="historical-event">
                        <p><strong>Actors unite to challenge studio power!</strong></p>
                        <p>Led by Ralph Morgan, actors form a union to fight for better pay, working conditions, and contract terms.</p>
                        <h3>SAG Demands:</h3>
                        <ul>
                            <li>Reasonable working hours (not 18-hour days)</li>
                            <li>Meal breaks on set</li>
                            <li>Fair compensation for all actors</li>
                            <li>Protection from arbitrary firings</li>
                            <li>Limits on contract term length</li>
                        </ul>
                        <p><strong>Impact on Studios:</strong></p>
                        <ul>
                            <li>Actor costs increase 10%</li>
                            <li>Production schedules 5% longer</li>
                            <li>Can't exploit contract players as freely</li>
                            <li>Labor negotiations now required</li>
                        </ul>
                        <p><em>The studio system's absolute control is beginning to crack.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'ACTORS UNITE! Guild to Represent Hollywood Stars'
        },

        {
            year: 1935,
            month: 9,
            id: 'huey_long_assassination',
            title: 'Huey Long Assassinated',
            description: 'Louisiana\'s populist senator and Hollywood critic is assassinated. His anti-Hollywood rhetoric ends.',
            type: 'political',
            importance: 'flavor',
            effects: {},
            modal: {
                title: '🗞️ Huey Long Assassinated - September 1935',
                content: `
                    <div class="historical-event">
                        <p><strong>Controversial senator killed in Baton Rouge.</strong></p>
                        <p>Senator Huey Long, who called Hollywood "immoral" and threatened federal censorship, has been shot.</p>
                        <h3>Long's Hollywood Stance:</h3>
                        <ul>
                            <li>Called for federal film censorship</li>
                            <li>Attacked "Hollywood immorality"</li>
                            <li>Proposed 100% tax on film revenues</li>
                            <li>Considered studios "propaganda machines"</li>
                        </ul>
                        <p><em>Studios breathe easier with one less political enemy.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HUEY LONG ASSASSINATED - HOLLYWOOD CRITIC SILENCED'
        },

        {
            year: 1935,
            month: 12,
            id: 'top_hat_success',
            title: 'Top Hat Breaks Box Office Records',
            description: 'Astaire and Rogers\' "Top Hat" becomes RKO\'s biggest hit ever, proving musicals are Depression-proof.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                musical_confidence: 1.15,
                art_deco_style: true
            },
            modal: {
                title: '🎩 Top Hat Success - December 1935',
                content: `
                    <div class="historical-event">
                        <p><strong>"Top Hat" becomes RKO's biggest hit!</strong></p>
                        <p>Budget: $609,000. Box office: $3 million. Irving Berlin's songs are everywhere.</p>
                        <h3>Why It Worked:</h3>
                        <ul>
                            <li>"Cheek to Cheek" is the hit song of the year</li>
                            <li>Lavish Art Deco sets provide escapism</li>
                            <li>Depression audiences need glamour</li>
                            <li>Astaire-Rogers chemistry is magic</li>
                        </ul>
                        <p><strong>Effect:</strong> Musical genre gets another 15% boost</p>
                    </div>
                `
            },
            newspaperHeadline: 'TOP HAT DANCES TO RECORD-BREAKING BOX OFFICE'
        },

        // ============================================================
        // 1936 - ACADEMY AWARDS & LABOR TROUBLES
        // ============================================================

        {
            year: 1936,
            month: 3,
            id: 'oscars_larger_venue',
            title: 'Academy Awards Moves to Larger Venue',
            description: 'Growing prestige of Oscars requires bigger theater. The awards are becoming a major cultural event.',
            type: 'milestone',
            importance: 'major',
            effects: {
                oscar_prestige: 15,
                awards_marketing_value: 1.2
            },
            modal: {
                title: '🏆 Oscars Go Big - March 1936',
                content: `
                    <div class="historical-event">
                        <p><strong>Academy Awards outgrows intimate banquet format.</strong></p>
                        <p>The ceremony moves from hotel ballrooms to Grauman's Chinese Theatre to accommodate growing interest.</p>
                        <h3>Awards Evolution:</h3>
                        <ul>
                            <li>1929-1935: Hotel banquet, 270 guests</li>
                            <li>1936+: Public theater, thousands attend</li>
                            <li>Radio broadcast begins this year</li>
                            <li>Major publicity event for studios</li>
                        </ul>
                        <p><strong>Impact:</strong> Oscar wins now worth 20% more at box office</p>
                    </div>
                `
            },
            newspaperHeadline: 'ACADEMY AWARDS EXPAND AS PRESTIGE GROWS'
        },

        {
            year: 1936,
            month: 4,
            id: 'great_ziegfeld',
            title: 'MGM\'s "The Great Ziegfeld" Sets Budget Record',
            description: 'MGM spends $2 million on lavish musical biography, proving studios are willing to invest big.',
            type: 'industry',
            importance: 'minor',
            effects: {
                budget_expectations: 1.1,
                prestige_picture_viable: true
            },
            modal: {
                title: '💰 The Great Ziegfeld - April 1936',
                content: `
                    <div class="historical-event">
                        <p><strong>MGM spends record $2 million on musical biography!</strong></p>
                        <p>The lavish production wins Best Picture and proves big budgets can pay off.</p>
                        <h3>Record-Breaking Production:</h3>
                        <ul>
                            <li>$2 million budget (enormous for 1936)</li>
                            <li>3-hour runtime</li>
                            <li>Lavish musical numbers</li>
                            <li>Wins Best Picture Oscar</li>
                        </ul>
                        <p><strong>Impact:</strong> Studios now more willing to invest in prestige pictures</p>
                    </div>
                `
            },
            newspaperHeadline: 'MGM SPENDS $2 MILLION ON "THE GREAT ZIEGFELD"'
        },

        {
            year: 1936,
            month: 8,
            id: 'spanish_civil_war',
            title: 'Spanish Civil War Begins',
            description: 'Fascism vs. Democracy conflict in Spain. Many Hollywood writers and actors support the Republicans.',
            type: 'political',
            importance: 'flavor',
            effects: {
                political_awareness: 10,
                anti_fascist_sentiment: true
            },
            modal: {
                title: '🌍 Spanish Civil War - August 1936',
                content: `
                    <div class="historical-event">
                        <p><strong>Spain erupts in civil war - fascists vs. republicans.</strong></p>
                        <p>Many Hollywood liberals support the Republican cause. Some even volunteer to fight.</p>
                        <h3>Hollywood Response:</h3>
                        <ul>
                            <li>Writers and actors raise funds for Republicans</li>
                            <li>Anti-fascist sentiment grows</li>
                            <li>Political divisions deepen in Hollywood</li>
                            <li>Conservative voices warn of "Red influence"</li>
                        </ul>
                        <p><em>These political activities will be remembered during HUAC hearings...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'SPANISH CIVIL WAR - HOLLYWOOD SPLIT ON RESPONSE'
        },

        {
            year: 1936,
            month: 11,
            id: 'modern_times',
            title: 'Chaplin\'s "Modern Times" Released',
            description: 'Charlie Chaplin\'s satire of industrial capitalism becomes his last silent film and a social commentary masterpiece.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                social_commentary_films: 1.1,
                chaplin_influence: 10
            },
            modal: {
                title: '🎭 Modern Times - November 1936',
                content: `
                    <div class="historical-event">
                        <p><strong>Chaplin's "Modern Times" critiques industrial capitalism.</strong></p>
                        <p>The Little Tramp's final appearance is a bold social satire - and Chaplin's last silent film.</p>
                        <h3>Film's Impact:</h3>
                        <ul>
                            <li>Satirizes assembly line dehumanization</li>
                            <li>Shows Depression-era poverty</li>
                            <li>Critics call it "communist propaganda"</li>
                            <li>But audiences love it anyway</li>
                        </ul>
                        <p><em>Chaplin's politics will haunt him for decades...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'CHAPLIN\'S "MODERN TIMES" - COMEDY MEETS SOCIAL COMMENTARY'
        },

        // ============================================================
        // 1937 - DISNEY ANIMATION & LABOR STRIKES
        // ============================================================

        {
            year: 1937,
            month: 5,
            id: 'labor_strikes',
            title: 'Labor Strikes Hit Hollywood Studios',
            description: 'Cartoonists and technicians strike for better pay. Labor unrest spreads across the industry.',
            type: 'political',
            importance: 'minor',
            effects: {
                production_delays: 0.95,
                labor_tensions: 15,
                production_costs: 1.08
            },
            modal: {
                title: '✊ Hollywood Labor Strikes - May 1937',
                content: `
                    <div class="historical-event">
                        <p><strong>Workers strike across multiple studios!</strong></p>
                        <p>Cartoonists, technicians, and crew members walk out demanding better pay and conditions.</p>
                        <h3>Strike Demands:</h3>
                        <ul>
                            <li>Higher wages for technical crew</li>
                            <li>Union recognition for cartoonists</li>
                            <li>Improved working conditions</li>
                            <li>Job security protections</li>
                        </ul>
                        <p><strong>Impact:</strong> Production slows, costs rise 8%</p>
                        <p><em>Labor tensions will continue to plague Hollywood...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'STRIKES SHUT DOWN HOLLYWOOD PRODUCTIONS'
        },

        {
            year: 1937,
            month: 6,
            id: 'jean_harlow_death',
            title: 'Jean Harlow Dies at 26',
            description: 'Platinum blonde bombshell Jean Harlow dies of kidney failure during filming. Hollywood is shocked.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                industry_mourning: true,
                blonde_bombshell_archetype: 10
            },
            modal: {
                title: '💔 Jean Harlow Dies - June 1937',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood's "Platinum Blonde" dies tragically young.</strong></p>
                        <p>Jean Harlow, MGM's biggest female star, dies of kidney failure at age 26 while filming "Saratoga."</p>
                        <h3>Harlow's Legacy:</h3>
                        <ul>
                            <li>Defined the "blonde bombshell" archetype</li>
                            <li>Sex symbol of early 1930s Pre-Code era</li>
                            <li>Genuine comedic talent</li>
                            <li>"Dinner at Eight," "Red Dust," "Bombshell"</li>
                        </ul>
                        <p><em>MGM completes "Saratoga" using a body double.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'JEAN HARLOW DEAD AT 26 - HOLLYWOOD MOURNS'
        },

        {
            year: 1937,
            month: 9,
            id: 'errol_flynn_scandals',
            title: 'Errol Flynn Scandals Begin',
            description: 'Warner Bros. swashbuckling star\'s off-screen behavior becomes tabloid fodder. His rakish image grows.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                scandal_publicity: 1.1,
                bad_boy_image_viable: true
            },
            modal: {
                title: '⚔️ Errol Flynn Scandals - September 1937',
                content: `
                    <div class="historical-event">
                        <p><strong>Swashbuckling star's private life rivals his films!</strong></p>
                        <p>Errol Flynn's drinking, womanizing, and brawling make headlines. Warner Bros. uses it as publicity.</p>
                        <h3>Flynn's Reputation:</h3>
                        <ul>
                            <li>Legendary drinking binges</li>
                            <li>Affairs with countless actresses</li>
                            <li>Bar fights and scandals</li>
                            <li>Studios realize bad publicity can sell tickets</li>
                        </ul>
                        <p><em>"My problem lies in reconciling my gross habits with my net income." - Errol Flynn</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'ERROL FLYNN\'S WILD BEHAVIOR SHOCKS AND DELIGHTS'
        },

        {
            year: 1937,
            month: 12,
            id: 'snow_white',
            title: 'Disney\'s "Snow White" Revolutionizes Animation',
            description: 'Walt Disney\'s first feature-length animated film proves cartoons can be serious art and big business.',
            type: 'industry',
            importance: 'major',
            effects: {
                animation_viable: true,
                family_film_market: 1.25,
                animation_costs: 1.2
            },
            modal: {
                title: '🍎 Snow White and the Seven Dwarfs - December 1937',
                content: `
                    <div class="historical-event">
                        <p><strong>Disney's "folly" becomes a triumph!</strong></p>
                        <p>Critics called it "Disney's Folly," but "Snow White" earns $8 million - more than any film since "Gone with the Wind."</p>
                        <h3>Revolutionary Achievement:</h3>
                        <ul>
                            <li>First feature-length animated film</li>
                            <li>Budget: $1.5 million (huge for animation)</li>
                            <li>Box office: $8+ million</li>
                            <li>Proves animation can be dramatic art</li>
                            <li>Creates entirely new market for family films</li>
                        </ul>
                        <p><strong>Impact on Industry:</strong></p>
                        <ul>
                            <li>Family film market expands 25%</li>
                            <li>Animation now viable for features</li>
                            <li>But animation costs are high</li>
                        </ul>
                        <p><em>Disney has created a new art form - and a new business model.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'SNOW WHITE TRIUMPHS - ANIMATION BECOMES BIG BUSINESS'
        },

        // ============================================================
        // 1938 - WAR APPROACHES
        // ============================================================

        {
            year: 1938,
            month: 3,
            id: 'anschluss_austria',
            title: 'Hitler Annexes Austria',
            description: 'Nazi Germany absorbs Austria. European markets become unstable. Jewish refugees flee to Hollywood.',
            type: 'political',
            importance: 'minor',
            effects: {
                european_markets: 0.9,
                refugee_talent: 10
            },
            modal: {
                title: '🌍 Austria Annexed - March 1938',
                content: `
                    <div class="historical-event">
                        <p><strong>Nazi Germany absorbs Austria in the "Anschluss."</strong></p>
                        <p>Hitler's expansion threatens European stability - and Hollywood's foreign markets.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>European box office becomes uncertain</li>
                            <li>German/Austrian Jewish refugees arrive</li>
                            <li>Directors like Billy Wilder flee to America</li>
                            <li>Studios worry about war's impact</li>
                        </ul>
                        <p><strong>Effect:</strong> European markets decline 10%</p>
                    </div>
                `
            },
            newspaperHeadline: 'HITLER ANNEXES AUSTRIA - EUROPE ON BRINK'
        },

        {
            year: 1938,
            month: 6,
            id: 'superman_debuts',
            title: 'Superman Comic Debuts',
            description: 'Action Comics #1 introduces Superman. The superhero genre is born, presaging future film potential.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                superhero_awareness: 10
            },
            modal: {
                title: '📚 Superman Debuts - June 1938',
                content: `
                    <div class="historical-event">
                        <p><strong>A new kind of hero appears in comic books!</strong></p>
                        <p>Action Comics #1 introduces Superman - a hero with incredible powers fighting for justice.</p>
                        <h3>Cultural Phenomenon:</h3>
                        <ul>
                            <li>Comics are suddenly serious business</li>
                            <li>Superhero genre is born</li>
                            <li>Film serials will soon follow</li>
                            <li>Sets template for future blockbusters</li>
                        </ul>
                        <p><em>In 1938, movies aren't ready for Superman. But someday...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'SUPERMAN COMIC BECOMES INSTANT SENSATION'
        },

        {
            year: 1938,
            month: 7,
            id: 'howard_hughes_record',
            title: 'Howard Hughes Sets Flight Record',
            description: 'Billionaire filmmaker Howard Hughes flies around the world in 91 hours, capturing public imagination.',
            type: 'industry',
            importance: 'flavor',
            effects: {
                hughes_prestige: 15,
                aviation_films: 1.1
            },
            modal: {
                title: '✈️ Howard Hughes Flight Record - July 1938',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood mogul circles the globe in record time!</strong></p>
                        <p>Howard Hughes, filmmaker and aviator, flies around the world in just 91 hours.</p>
                        <h3>Hughes in Hollywood:</h3>
                        <ul>
                            <li>Produced "Hell's Angels" (1930)</li>
                            <li>Owns RKO Pictures</li>
                            <li>Aviation obsessive</li>
                            <li>Will produce "The Outlaw" (controversial)</li>
                        </ul>
                        <p><em>Hughes brings publicity - and eccentricity - to Hollywood.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HOWARD HUGHES FLIES AROUND WORLD IN 91 HOURS'
        },

        {
            year: 1938,
            month: 10,
            id: 'war_of_worlds',
            title: 'Orson Welles\' "War of the Worlds" Broadcast',
            description: 'Radio drama causes panic. Orson Welles proves power of media - and gets Hollywood\'s attention.',
            type: 'milestone',
            importance: 'major',
            effects: {
                welles_interest: 20,
                radio_drama_respect: 15
            },
            modal: {
                title: '📻 War of the Worlds Panic - October 1938',
                content: `
                    <div class="historical-event">
                        <p><strong>Orson Welles' radio drama causes mass panic!</strong></p>
                        <p>His realistic broadcast of Martian invasion fools thousands. Hollywood takes notice of this 23-year-old genius.</p>
                        <h3>The Broadcast:</h3>
                        <ul>
                            <li>October 30, 1938 (Halloween eve)</li>
                            <li>Realistic news bulletin format</li>
                            <li>Thousands believe Martians have landed</li>
                            <li>Police switchboards jammed</li>
                        </ul>
                        <p><strong>Impact on Hollywood:</strong></p>
                        <ul>
                            <li>Studios scramble to sign Welles</li>
                            <li>RKO offers unprecedented creative control</li>
                            <li>Will lead to "Citizen Kane" (1941)</li>
                        </ul>
                        <p><em>A star - and a troublemaker - is born.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'WELLES RADIO DRAMA CAUSES NATIONWIDE PANIC'
        },

        {
            year: 1938,
            month: 12,
            id: 'wizard_of_oz_filming',
            title: 'The Wizard of Oz Begins Filming',
            description: 'MGM\'s lavish Technicolor fantasy begins production. It will become an immortal classic.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                technicolor_prestige: 15,
                fantasy_genre: 1.15
            },
            modal: {
                title: '🌈 Wizard of Oz Production - December 1938',
                content: `
                    <div class="historical-event">
                        <p><strong>MGM begins filming its Technicolor masterpiece!</strong></p>
                        <p>Budget: $2.8 million. Judy Garland stars after Shirley Temple proves unavailable.</p>
                        <h3>Production Challenges:</h3>
                        <ul>
                            <li>Multiple directors (Victor Fleming takes over)</li>
                            <li>Technicolor is expensive and difficult</li>
                            <li>Elaborate sets and costumes</li>
                            <li>Will premiere in August 1939</li>
                        </ul>
                        <p><em>Will it be worth the enormous cost? Time will tell...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'MGM BEGINS FILMING "WIZARD OF OZ" IN TECHNICOLOR'
        },

        // ============================================================
        // 1939 - GOLDEN YEAR OF CINEMA
        // ============================================================

        {
            year: 1939,
            month: 2,
            id: 'vivien_leigh_scarlett',
            title: 'Vivien Leigh Cast as Scarlett O\'Hara',
            description: 'After nationwide search, unknown British actress wins role of a lifetime in "Gone with the Wind."',
            type: 'cultural',
            importance: 'minor',
            effects: {
                gwtw_anticipation: 20,
                casting_publicity: 1.15
            },
            modal: {
                title: '🎬 Scarlett O\'Hara Found - February 1939',
                content: `
                    <div class="historical-event">
                        <p><strong>The search is over! Vivien Leigh will play Scarlett!</strong></p>
                        <p>David O. Selznick's nationwide search for Scarlett O'Hara ends with unknown British actress Vivien Leigh.</p>
                        <h3>The Search:</h3>
                        <ul>
                            <li>1,400 actresses interviewed</li>
                            <li>Katharine Hepburn, Bette Davis rejected</li>
                            <li>Public debate raged for 2 years</li>
                            <li>Leigh discovered at last minute</li>
                        </ul>
                        <p><strong>Effect:</strong> Publicity generates enormous anticipation</p>
                    </div>
                `
            },
            newspaperHeadline: 'VIVIEN LEIGH WINS SCARLETT O\'HARA ROLE'
        },

        {
            year: 1939,
            month: 8,
            id: 'the_women_premiere',
            title: 'The Women Premieres',
            description: 'MGM\'s all-female cast film showcases Hollywood\'s greatest actresses in George Cukor\'s comedy.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                womens_pictures: 1.1,
                ensemble_casts: true
            },
            modal: {
                title: '👗 The Women - August 1939',
                content: `
                    <div class="historical-event">
                        <p><strong>All-star, all-female cast comedy becomes a hit!</strong></p>
                        <p>George Cukor directs Norma Shearer, Joan Crawford, Rosalind Russell, and Joan Fontaine in sophisticated comedy.</p>
                        <h3>Unique Feature:</h3>
                        <ul>
                            <li>135 speaking roles - all women</li>
                            <li>Not one man appears on screen</li>
                            <li>Sophisticated dialogue and style</li>
                            <li>Proves women's pictures can be profitable</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: '"THE WOMEN" - ALL-FEMALE CAST TRIUMPHS'
        },

        {
            year: 1939,
            month: 12,
            id: 'gone_with_wind',
            title: 'Gone with the Wind Premieres',
            description: 'David O. Selznick\'s epic sets new standards for production values and box office success. The industry is forever changed.',
            type: 'milestone',
            importance: 'major',
            effects: {
                audience_expectations: 10,
                epic_genre_boost: 1.2,
                technicolor_demand: 15,
                budget_inflation: 1.15
            },
            modal: {
                title: '🎬 Gone with the Wind - December 1939',
                content: `
                    <div class="historical-event">
                        <p><strong>Gone with the Wind premieres to unprecedented success!</strong></p>
                        <p>Budget: $3.9 million (enormous for the era)<br>
                        Box office: Expected to gross over $30 million</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>Audiences now expect higher production values</li>
                            <li>Epic films become more viable</li>
                            <li>Technicolor gains prominence</li>
                            <li>Budget expectations are rising</li>
                        </ul>
                        <p><strong>Effect on your studio:</strong></p>
                        <ul>
                            <li>Audience expectations increased by 10%</li>
                            <li>Epic genre films get 20% box office boost</li>
                            <li>Higher quality standards expected</li>
                            <li>Budgets trend upward</li>
                        </ul>
                        <p><em>Note: Also this year - "The Wizard of Oz," "Mr. Smith Goes to Washington," "Stagecoach," "Wuthering Heights." 1939 is Hollywood's greatest year.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'GONE WITH THE WIND PREMIERES - GREATEST FILM EVER MADE?'
        },

        // ============================================================
        // 1940 - WAR PREPARATIONS
        // ============================================================

        {
            year: 1940,
            month: 1,
            id: 'fantasia_released',
            title: 'Disney\'s "Fantasia" Released',
            description: 'Walt Disney\'s experimental animated concert film pushes artistic boundaries but struggles at box office.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                animation_experimentation: 10,
                prestige_animation: true
            },
            modal: {
                title: '🎵 Fantasia - January 1940',
                content: `
                    <div class="historical-event">
                        <p><strong>Disney releases ambitious animated concert film!</strong></p>
                        <p>"Fantasia" pairs classical music with experimental animation. Critics are divided.</p>
                        <h3>The Experiment:</h3>
                        <ul>
                            <li>Classical music visualization</li>
                            <li>No dialogue, just music</li>
                            <li>"Sorcerer's Apprentice" with Mickey Mouse</li>
                            <li>Budget overruns plague production</li>
                        </ul>
                        <p><em>Box office is disappointing, but the film will be rediscovered.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'DISNEY\'S "FANTASIA" - BOLD EXPERIMENT OR FOLLY?'
        },

        {
            year: 1940,
            month: 2,
            id: 'hattie_mcdaniel_oscar',
            title: 'Hattie McDaniel Wins Oscar',
            description: 'First African American to win an Academy Award for "Gone with the Wind." Historic but bittersweet.',
            type: 'cultural',
            importance: 'minor',
            effects: {
                racial_awareness: 10,
                diversity_slow_progress: true
            },
            modal: {
                title: '🏆 Hattie McDaniel Wins Oscar - February 1940',
                content: `
                    <div class="historical-event">
                        <p><strong>First Black actor wins Academy Award!</strong></p>
                        <p>Hattie McDaniel wins Best Supporting Actress for "Mammy" in "Gone with the Wind."</p>
                        <h3>The Bitter Reality:</h3>
                        <ul>
                            <li>Historic achievement for Black actors</li>
                            <li>But she played a stereotypical "mammy" role</li>
                            <li>Segregated Oscar ceremony - seated separately</li>
                            <li>Couldn't attend Atlanta premiere (Georgia segregated)</li>
                            <li>NAACP criticized her role choices</li>
                        </ul>
                        <p><em>"I'd rather play a maid than be one." - Hattie McDaniel</em></p>
                        <p>Hollywood's racial barriers remain firmly in place.</p>
                    </div>
                `
            },
            newspaperHeadline: 'HATTIE McDANIEL MAKES OSCAR HISTORY'
        },

        {
            year: 1940,
            month: 9,
            id: 'selective_service',
            title: 'Selective Service Act - Draft Begins',
            description: 'America prepares for war. Male actors and crew may be drafted. Studio planning becomes uncertain.',
            type: 'milestone',
            importance: 'major',
            effects: {
                draft_risk: 0.1,
                male_actor_shortage: true,
                production_uncertainty: 10
            },
            modal: {
                title: '🎖️ Peacetime Draft Begins - September 1940',
                content: `
                    <div class="historical-event">
                        <p><strong>America institutes first peacetime draft.</strong></p>
                        <p>All men aged 21-36 must register for Selective Service. War seems inevitable.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Male actors may be drafted mid-contract</li>
                            <li>Leading men suddenly unavailable</li>
                            <li>Studios can't plan long-term productions</li>
                            <li>Jimmy Stewart, Clark Gable will serve</li>
                            <li>Female stars become more important</li>
                        </ul>
                        <p><strong>Effect:</strong> 10% of male talent may be drafted</p>
                        <p><em>The war is coming, whether America wants it or not.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'DRAFT BEGINS - HOLLYWOOD FACES ACTOR SHORTAGE'
        },

        {
            year: 1940,
            month: 10,
            id: 'great_dictator',
            title: 'Chaplin\'s "The Great Dictator"',
            description: 'Charlie Chaplin mocks Hitler in bold political satire. His first talkie is a powerful anti-fascist statement.',
            type: 'industry',
            importance: 'minor',
            effects: {
                political_films: 1.15,
                anti_nazi_sentiment: 15
            },
            modal: {
                title: '🎭 The Great Dictator - October 1940',
                content: `
                    <div class="historical-event">
                        <p><strong>Chaplin mocks Hitler in daring satire!</strong></p>
                        <p>Charlie Chaplin's first talkie is a bold attack on fascism and Hitler.</p>
                        <h3>The Film:</h3>
                        <ul>
                            <li>Chaplin plays dual role: dictator and Jewish barber</li>
                            <li>Directly satirizes Hitler and Mussolini</li>
                            <li>Ends with passionate plea for democracy</li>
                            <li>Controversial in isolationist America</li>
                        </ul>
                        <p><strong>Impact:</strong> Political films gain 15% boost</p>
                        <p><em>"I'm sorry, but I don't want to be an emperor." - Final speech</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'CHAPLIN MOCKS HITLER IN "THE GREAT DICTATOR"'
        },

        {
            year: 1940,
            month: 11,
            id: 'fdr_third_term',
            title: 'Roosevelt Elected to Third Term',
            description: 'FDR breaks tradition with third term. His relationship with Hollywood will continue.',
            type: 'political',
            importance: 'flavor',
            effects: {},
            modal: {
                title: '🗳️ FDR Third Term - November 1940',
                content: `
                    <div class="historical-event">
                        <p><strong>Roosevelt wins unprecedented third term.</strong></p>
                        <p>FDR defeats Wendell Willkie. Hollywood largely supported Roosevelt.</p>
                        <h3>Hollywood-FDR Relationship:</h3>
                        <ul>
                            <li>Studios support New Deal</li>
                            <li>Stars campaign for Roosevelt</li>
                            <li>Government encourages pro-democracy films</li>
                            <li>War cooperation will intensify</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'FDR WINS THIRD TERM - HOLLYWOOD CELEBRATES'
        },

        // ============================================================
        // 1941 - PEARL HARBOR & WAR BEGINS
        // ============================================================

        {
            year: 1941,
            month: 5,
            id: 'citizen_kane',
            title: 'Citizen Kane Controversy',
            description: 'Orson Welles\' masterpiece faces William Randolph Hearst\'s wrath. A genius vs. a media mogul.',
            type: 'industry',
            importance: 'major',
            effects: {
                artistic_ambition: 15,
                hearst_boycott: true,
                prestige_cinema: 1.2
            },
            modal: {
                title: '🎬 Citizen Kane - May 1941',
                content: `
                    <div class="historical-event">
                        <p><strong>Welles' masterpiece faces powerful opposition!</strong></p>
                        <p>William Randolph Hearst recognizes himself in "Citizen Kane" and tries to destroy it.</p>
                        <h3>The Controversy:</h3>
                        <ul>
                            <li>Hearst bans all mention in his newspapers</li>
                            <li>Threatens to expose Hollywood scandals</li>
                            <li>Louis B. Mayer offers to buy negative to destroy it</li>
                            <li>Many theaters afraid to book it</li>
                        </ul>
                        <h3>Critical Response:</h3>
                        <ul>
                            <li>Critics call it a masterpiece</li>
                            <li>Revolutionary cinematography</li>
                            <li>Narrative innovation</li>
                            <li>But box office is disappointing</li>
                        </ul>
                        <p><strong>Impact:</strong> Artistic cinema gains prestige, but political risk increases</p>
                        <p><em>Will be called greatest film ever made... decades later.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HEARST WAGES WAR ON WELLES\' "CITIZEN KANE"'
        },

        {
            year: 1941,
            month: 7,
            id: 'sergeant_york',
            title: '"Sergeant York" Released',
            description: 'Gary Cooper\'s WWI heroism film prepares America for war. Isolationism is fading.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                war_films: 1.15,
                patriotic_sentiment: 10
            },
            modal: {
                title: '🎖️ Sergeant York - July 1941',
                content: `
                    <div class="historical-event">
                        <p><strong>Gary Cooper plays WWI hero Alvin York.</strong></p>
                        <p>The film subtly prepares America for the coming war, showing heroism and sacrifice.</p>
                        <h3>The Message:</h3>
                        <ul>
                            <li>Pacifist becomes war hero</li>
                            <li>Duty overcomes reluctance</li>
                            <li>American values worth fighting for</li>
                            <li>Warner Bros. pushes interventionist message</li>
                        </ul>
                        <p><em>Pearl Harbor is five months away...</em></p>
                    </div>
                `
            },
            newspaperHeadline: '"SERGEANT YORK" - HEROISM STORY RESONATES'
        },

        {
            year: 1941,
            month: 9,
            id: 'gary_cooper_oscar',
            title: 'Gary Cooper Wins Oscar',
            description: 'Cooper\'s performance in "Sergeant York" wins Best Actor, cementing his status as American everyman.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                cooper_prestige: 10
            },
            modal: {
                title: '🏆 Gary Cooper Oscar - September 1941',
                content: `
                    <div class="historical-event">
                        <p><strong>Gary Cooper wins Best Actor for "Sergeant York."</strong></p>
                        <p>Cooper embodies the American everyman - reluctant but heroic when duty calls.</p>
                        <h3>Cooper's Career:</h3>
                        <ul>
                            <li>Defined strong, silent American hero</li>
                            <li>"Mr. Deeds," "High Noon" (future)</li>
                            <li>Box office draw for two decades</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'GARY COOPER WINS OSCAR FOR "SERGEANT YORK"'
        },

        {
            year: 1941,
            month: 12,
            id: 'pearl_harbor',
            title: 'Pearl Harbor - America Enters WWII',
            description: 'The attack on Pearl Harbor brings America into World War II. Hollywood will now play a crucial role in the war effort.',
            type: 'war',
            importance: 'major',
            effects: {
                war_active: true,
                morale_films_boost: 1.3,
                military_censorship: true,
                actor_draft_risk: 0.15,
                material_rationing: 0.95
            },
            modal: {
                title: '🎖️ Pearl Harbor - December 7, 1941',
                content: `
                    <div class="historical-event">
                        <p><strong>America is at war.</strong></p>
                        <p>The Japanese attack on Pearl Harbor has thrust the nation into World War II. Hollywood must now support the war effort.</p>
                        <h3>New Reality:</h3>
                        <ul>
                            <li>⚠️ Male actors may be drafted (15% risk)</li>
                            <li>📽️ War bond films are highly encouraged</li>
                            <li>🎖️ Patriotic films receive box office boost (+30%)</li>
                            <li>❌ Anti-war sentiment is not acceptable</li>
                            <li>⚠️ Material rationing affects production (-5%)</li>
                            <li>🎬 Film stock may be limited</li>
                        </ul>
                        <p><strong>Your studio's role:</strong></p>
                        <ul>
                            <li>Produce morale-boosting content</li>
                            <li>Support war bond sales</li>
                            <li>Avoid controversial war topics</li>
                            <li>Expect actor availability issues</li>
                        </ul>
                        <p><em>"The motion picture industry is now an essential part of the war effort."</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'PEARL HARBOR ATTACKED - AMERICA ENTERS WAR'
        },

        // ============================================================
        // 1942 - WAR PRODUCTION
        // ============================================================

        {
            year: 1942,
            month: 1,
            id: 'hollywood_victory_committee',
            title: 'Hollywood Victory Committee Formed',
            description: 'Studios coordinate war effort through new organization. Propaganda becomes patriotic duty.',
            type: 'industry',
            importance: 'minor',
            effects: {
                war_coordination: true,
                propaganda_quota: 0.2,
                morale_bonus: 10
            },
            modal: {
                title: '🎖️ Hollywood Victory Committee - January 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood organizes for total war effort!</strong></p>
                        <p>All major studios join Hollywood Victory Committee to coordinate war support.</p>
                        <h3>Committee Activities:</h3>
                        <ul>
                            <li>Coordinate war bond sales</li>
                            <li>Organize USO entertainment tours</li>
                            <li>Produce training and propaganda films</li>
                            <li>Work with Office of War Information</li>
                            <li>Send stars to military bases</li>
                        </ul>
                        <p><strong>Expectation:</strong> 20% of output should support war effort</p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD UNITES FOR WAR EFFORT'
        },

        {
            year: 1942,
            month: 2,
            id: 'japanese_internment',
            title: 'Japanese Internment Begins',
            description: 'Executive Order 9066 interns Japanese Americans. Hollywood largely stays silent.',
            type: 'political',
            importance: 'flavor',
            effects: {
                japanese_american_talent_lost: true,
                moral_complexity: 10
            },
            modal: {
                title: '⚠️ Japanese Internment - February 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>120,000 Japanese Americans forced into camps.</strong></p>
                        <p>Executive Order 9066 orders internment of all West Coast Japanese Americans, including actors and crew.</p>
                        <h3>Hollywood's Response:</h3>
                        <ul>
                            <li>Japanese American actors lose careers overnight</li>
                            <li>Studios stay silent on injustice</li>
                            <li>Sessue Hayakawa's career ends</li>
                            <li>Anti-Japanese propaganda films increase</li>
                        </ul>
                        <p><em>A dark chapter that Hollywood will not address for decades.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'JAPANESE AMERICANS ORDERED TO INTERNMENT CAMPS'
        },

        {
            year: 1942,
            month: 5,
            id: 'bing_crosby_charts',
            title: 'Bing Crosby Tops Charts',
            description: '"White Christmas" becomes massive hit. Crosby\'s warm crooning provides comfort during wartime.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                musical_popularity: 1.1,
                crosby_value: 10
            },
            modal: {
                title: '🎵 Bing Crosby - May 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>Bing Crosby's "White Christmas" becomes anthem!</strong></p>
                        <p>Irving Berlin's song (from "Holiday Inn") becomes biggest-selling single ever.</p>
                        <h3>Crosby's Impact:</h3>
                        <ul>
                            <li>America's most popular singer</li>
                            <li>Top box office star</li>
                            <li>Wholesome image perfect for wartime</li>
                            <li>USO tours boost morale</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'BING CROSBY\'S "WHITE CHRISTMAS" SOARS'
        },

        {
            year: 1942,
            month: 9,
            id: 'mrs_miniver_oscars',
            title: '"Mrs. Miniver" Wins Oscars',
            description: 'British home front drama wins Best Picture, showing American audiences the war\'s reality.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                british_films: 1.15,
                war_drama_credibility: 10
            },
            modal: {
                title: '🏆 Mrs. Miniver - September 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>"Mrs. Miniver" wins Best Picture Oscar!</strong></p>
                        <p>MGM's British home front drama shows Americans what their allies are fighting for.</p>
                        <h3>The Film's Impact:</h3>
                        <ul>
                            <li>Humanizes British war experience</li>
                            <li>Greer Garson wins Best Actress</li>
                            <li>Churchill said it was worth "six divisions"</li>
                            <li>Pro-British sentiment soars in America</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: '"MRS. MINIVER" WINS BEST PICTURE - PRO-BRITISH SENTIMENT SOARS'
        },

        {
            year: 1942,
            month: 11,
            id: 'casablanca_premiere',
            title: 'Casablanca Premieres',
            description: 'Warner Bros.\' wartime romance becomes an instant classic, showing how propaganda and art can merge successfully.',
            type: 'cultural',
            importance: 'major',
            effects: {
                war_romance_boost: 1.25,
                propaganda_acceptance: 10,
                bogart_mystique: 15
            },
            modal: {
                title: '🎬 Casablanca - November 1942',
                content: `
                    <div class="historical-event">
                        <p><strong>Casablanca proves wartime films can be both art and propaganda.</strong></p>
                        <p>Humphrey Bogart and Ingrid Bergman star in romance set against war backdrop.</p>
                        <h3>Industry Impact:</h3>
                        <ul>
                            <li>War-themed romance films gain popularity (+25%)</li>
                            <li>Audiences accept pro-Allied messaging</li>
                            <li>European refugee actors gain prominence</li>
                            <li>Quality doesn't suffer from war themes</li>
                            <li>"Here's looking at you, kid" enters lexicon</li>
                        </ul>
                        <p><strong>Effect on your studio:</strong></p>
                        <ul>
                            <li>War romance genre gets 25% boost</li>
                            <li>Patriotic themes are box office gold</li>
                        </ul>
                        <p><em>"We'll always have Paris..."</em></p>
                    </div>
                `
            },
            newspaperHeadline: '"CASABLANCA" PREMIERES - WARTIME ROMANCE TRIUMPH'
        },

        // ============================================================
        // 1943 - MID-WAR PERIOD
        // ============================================================

        {
            year: 1943,
            month: 1,
            id: 'film_noir_emerges',
            title: 'Film Noir Emerges as Distinct Genre',
            description: 'Dark, cynical crime dramas reflect wartime anxiety. A new aesthetic is born.',
            type: 'milestone',
            importance: 'major',
            effects: {
                film_noir_viable: true,
                dark_films_boost: 1.2,
                cynical_tone_acceptable: true
            },
            modal: {
                title: '🌙 Film Noir Emerges - 1943',
                content: `
                    <div class="historical-event">
                        <p><strong>A darker vision of America appears on screen.</strong></p>
                        <p>Films like "Double Indemnity," "The Maltese Falcon," and "Shadow of a Doubt" create a new genre: film noir.</p>
                        <h3>Film Noir Characteristics:</h3>
                        <ul>
                            <li>Dark, shadowy cinematography</li>
                            <li>Cynical, morally ambiguous characters</li>
                            <li>Femme fatales and doomed heroes</li>
                            <li>Urban crime settings</li>
                            <li>Pessimistic worldview</li>
                        </ul>
                        <p><strong>Why Now?</strong></p>
                        <ul>
                            <li>Wartime anxiety and uncertainty</li>
                            <li>European refugee directors bring style</li>
                            <li>Audiences ready for darker stories</li>
                            <li>Veterans will want realistic films</li>
                        </ul>
                        <p><strong>Impact:</strong> Film noir gets 20% box office boost</p>
                    </div>
                `
            },
            newspaperHeadline: 'DARK NEW GENRE "FILM NOIR" CAPTIVATES AUDIENCES'
        },

        {
            year: 1943,
            month: 3,
            id: 'film_noir_style',
            title: 'Film Noir Style Becomes Defined',
            description: 'Cinematographers perfect the shadowy, expressionist look that will define film noir.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                cinematography_innovation: 10
            },
            modal: {
                title: '🎥 Noir Cinematography - March 1943',
                content: `
                    <div class="historical-event">
                        <p><strong>A visual revolution in cinematography!</strong></p>
                        <p>Cinematographers develop the distinctive noir look: harsh shadows, Dutch angles, rain-slicked streets.</p>
                        <h3>Visual Innovations:</h3>
                        <ul>
                            <li>Low-key lighting creates deep shadows</li>
                            <li>Venetian blind patterns iconic</li>
                            <li>Wet streets reflect neon signs</li>
                            <li>Cigarette smoke diffuses light</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'NOIR CINEMATOGRAPHY CREATES NEW VISUAL LANGUAGE'
        },

        {
            year: 1943,
            month: 6,
            id: 'betty_grable_star',
            title: 'Betty Grable Becomes Biggest Star',
            description: 'With male stars at war, Betty Grable\'s pin-up photo and musicals make her #1 box office draw.',
            type: 'industry',
            importance: 'minor',
            effects: {
                female_stars_dominance: 1.2,
                pin_up_culture: 15,
                musical_popularity: 1.15
            },
            modal: {
                title: '⭐ Betty Grable - June 1943',
                content: `
                    <div class="historical-event">
                        <p><strong>Betty Grable is Hollywood's #1 star!</strong></p>
                        <p>With male stars in military service, Grable's legs (insured for $1 million) and musical talent make her America's sweetheart.</p>
                        <h3>Grable Phenomenon:</h3>
                        <ul>
                            <li>Top box office star 1943</li>
                            <li>Pin-up photo in 5 million lockers</li>
                            <li>Technicolor musicals dominate</li>
                            <li>Represents girl-next-door glamour</li>
                            <li>Earns $300,000 per year</li>
                        </ul>
                        <p><strong>Impact:</strong> Female-led films get 20% boost during war</p>
                    </div>
                `
            },
            newspaperHeadline: 'BETTY GRABLE TOPS BOX OFFICE - PIN-UP QUEEN REIGNS'
        },

        {
            year: 1943,
            month: 8,
            id: 'oklahoma_broadway',
            title: '"Oklahoma!" Broadway Smash Hit',
            description: 'Rodgers and Hammerstein revolutionize musical theater. Film adaptations will follow.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                musical_theater_source: 10,
                integrated_musicals: true
            },
            modal: {
                title: '🎭 Oklahoma! - August 1943',
                content: `
                    <div class="historical-event">
                        <p><strong>"Oklahoma!" transforms musical theater!</strong></p>
                        <p>Rodgers and Hammerstein's breakthrough show runs for 2,212 performances.</p>
                        <h3>Innovation:</h3>
                        <ul>
                            <li>Songs advance plot (not just entertainment)</li>
                            <li>Characters develop through music</li>
                            <li>Sets new template for musicals</li>
                            <li>Hollywood will adapt it (and others) later</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: '"OKLAHOMA!" REVOLUTIONIZES BROADWAY'
        },

        {
            year: 1943,
            month: 11,
            id: 'tehran_conference',
            title: 'Tehran Conference',
            description: 'Allied leaders plan final push against Axis. Victory seems closer, affecting film content.',
            type: 'political',
            importance: 'flavor',
            effects: {
                victory_optimism: 10
            },
            modal: {
                title: '🌍 Tehran Conference - November 1943',
                content: `
                    <div class="historical-event">
                        <p><strong>Big Three meet: Roosevelt, Churchill, Stalin.</strong></p>
                        <p>Allied strategy for defeating Hitler is coordinated. Victory is in sight.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Optimism about war's end</li>
                            <li>Pro-Soviet films encouraged</li>
                            <li>Planning for post-war content</li>
                        </ul>
                        <p><em>This pro-Soviet sentiment will haunt Hollywood in HUAC hearings...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'BIG THREE MEET - VICTORY STRATEGY PLANNED'
        },

        // ============================================================
        // 1944 - D-DAY & WAR'S END APPROACHING
        // ============================================================

        {
            year: 1944,
            month: 6,
            id: 'dday_invasion',
            title: 'D-Day Invasion',
            description: 'Allied forces land in Normandy. The end of the war in Europe is in sight.',
            type: 'political',
            importance: 'minor',
            effects: {
                victory_sentiment: 20,
                war_end_planning: true
            },
            modal: {
                title: '🎖️ D-Day - June 6, 1944',
                content: `
                    <div class="historical-event">
                        <p><strong>Allied forces invade Nazi-occupied France!</strong></p>
                        <p>The largest amphibious invasion in history begins the liberation of Europe.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>War's end seems near</li>
                            <li>Studios plan post-war transition</li>
                            <li>Victory films in development</li>
                            <li>Veteran return anticipated</li>
                        </ul>
                        <p><em>What will audiences want after the war ends?</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'D-DAY - ALLIES INVADE NORMANDY'
        },

        {
            year: 1944,
            month: 7,
            id: 'lauren_bacall_discovered',
            title: 'Lauren Bacall Discovered',
            description: '19-year-old Lauren Bacall\'s smoldering debut opposite Humphrey Bogart in "To Have and Have Not" creates instant star.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                bacall_bogart_chemistry: 15,
                sophisticated_romance: 1.1
            },
            modal: {
                title: '⭐ Lauren Bacall - July 1944',
                content: `
                    <div class="historical-event">
                        <p><strong>New star discovered in "To Have and Have Not"!</strong></p>
                        <p>19-year-old Lauren Bacall's sultry performance opposite Bogart creates sensation.</p>
                        <h3>Star is Born:</h3>
                        <ul>
                            <li>"You know how to whistle, don't you?"</li>
                            <li>Bogart-Bacall chemistry is electric</li>
                            <li>New type of sophisticated woman</li>
                            <li>They'll marry in real life (1945)</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'LAUREN BACALL STEALS HEARTS IN DEBUT'
        },

        {
            year: 1944,
            month: 9,
            id: 'war_bonds_success',
            title: 'War Bond Drive Success',
            description: 'Hollywood\'s war bond tours raise millions. Stars prove their patriotic value.',
            type: 'industry',
            importance: 'flavor',
            effects: {
                government_goodwill: 15,
                star_patriotic_value: 10
            },
            modal: {
                title: '🎖️ War Bond Success - September 1944',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood stars raise millions for war effort!</strong></p>
                        <p>Bond tours featuring major stars raise over $1 billion for war effort.</p>
                        <h3>Star Contributions:</h3>
                        <ul>
                            <li>Carole Lombard died in bond tour crash (1942)</li>
                            <li>Hedy Lamarr raises $25 million in one night</li>
                            <li>Bette Davis runs Hollywood Canteen</li>
                            <li>Bob Hope's USO tours legendary</li>
                        </ul>
                        <p><em>Hollywood proves its patriotic worth to government.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD STARS RAISE MILLIONS IN WAR BONDS'
        },

        {
            year: 1944,
            month: 11,
            id: 'double_indemnity',
            title: '"Double Indemnity" Released',
            description: 'Billy Wilder\'s noir masterpiece defines the genre. Barbara Stanwyck is the ultimate femme fatale.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                noir_template: 15,
                femme_fatale_archetype: 10
            },
            modal: {
                title: '🌙 Double Indemnity - November 1944',
                content: `
                    <div class="historical-event">
                        <p><strong>Billy Wilder perfects film noir!</strong></p>
                        <p>Barbara Stanwyck seduces Fred MacMurray into murder in definitive noir.</p>
                        <h3>Noir Template:</h3>
                        <ul>
                            <li>Deadly femme fatale</li>
                            <li>Doomed protagonist narrates</li>
                            <li>Crime motivated by lust and greed</li>
                            <li>No one escapes consequences</li>
                            <li>Venetian blind shadows everywhere</li>
                        </ul>
                        <p><em>Every noir will be compared to this one.</em></p>
                    </div>
                `
            },
            newspaperHeadline: '"DOUBLE INDEMNITY" - NOIR MASTERPIECE'
        },

        // ============================================================
        // 1945 - WAR ENDS & POST-WAR TRANSITION
        // ============================================================

        {
            year: 1945,
            month: 8,
            id: 'wwii_ends',
            title: 'World War II Ends',
            description: 'Victory over Japan brings WWII to a close. Hollywood must now adapt to peacetime again as soldiers return home.',
            type: 'war',
            importance: 'major',
            effects: {
                war_active: false,
                returning_veterans: true,
                audience_tastes_shift: true,
                actor_draft_risk: 0,
                material_rationing: 1.0,
                darker_content_acceptable: true
            },
            modal: {
                title: '🕊️ Victory - August 1945',
                content: `
                    <div class="historical-event">
                        <p><strong>The war is over. Victory in Europe and the Pacific.</strong></p>
                        <p>V-E Day (May 8) and V-J Day (August 15) bring World War II to an end.</p>
                        <h3>Post-War Hollywood:</h3>
                        <ul>
                            <li>✅ Actors returning from military service</li>
                            <li>✅ Material rationing ending</li>
                            <li>✅ Full production capacity restored</li>
                            <li>⚠️ Audience tastes are changing</li>
                            <li>⚠️ Veterans want darker, realistic stories</li>
                            <li>📉 Propaganda films no longer popular</li>
                        </ul>
                        <p><strong>New Challenges:</strong></p>
                        <ul>
                            <li>Film noir gains popularity</li>
                            <li>Social realism emerges</li>
                            <li>Escapist musicals still work</li>
                            <li>War films must be respectful</li>
                        </ul>
                        <p><em>"The world has changed. Hollywood must change with it."</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'VICTORY! WORLD WAR II ENDS'
        },

        {
            year: 1945,
            month: 11,
            id: 'rko_struggles',
            title: 'RKO Pictures Financial Troubles',
            description: 'RKO faces financial difficulties. Post-war studio system shows cracks.',
            type: 'industry',
            importance: 'flavor',
            effects: {
                rko_weakness: true,
                studio_system_cracks: 10
            },
            modal: {
                title: '💼 RKO Troubles - November 1945',
                content: `
                    <div class="historical-event">
                        <p><strong>RKO Pictures faces financial crisis.</strong></p>
                        <p>Howard Hughes will buy the studio in 1948, but mismanagement continues.</p>
                        <h3>Studio System Weakening:</h3>
                        <ul>
                            <li>RKO losing money despite hits</li>
                            <li>Independent producers gaining power</li>
                            <li>Stars demanding more freedom</li>
                            <li>Paramount case looming</li>
                        </ul>
                        <p><em>The studio system's golden age is ending.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'RKO PICTURES IN FINANCIAL TROUBLE'
        },

        {
            year: 1945,
            month: 12,
            id: 'lost_weekend',
            title: '"The Lost Weekend" Wins Awards',
            description: 'Billy Wilder\'s unflinching alcoholism drama proves post-war audiences want realism.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                social_problem_films: 1.2,
                realism_acceptable: true
            },
            modal: {
                title: '🏆 The Lost Weekend - December 1945',
                content: `
                    <div class="historical-event">
                        <p><strong>Brutally realistic alcoholism drama wins acclaim!</strong></p>
                        <p>Billy Wilder's film breaks taboos by honestly depicting addiction.</p>
                        <h3>New Realism:</h3>
                        <ul>
                            <li>No sugar-coating of alcoholism</li>
                            <li>Ray Milland's harrowing performance</li>
                            <li>Will win Best Picture Oscar</li>
                            <li>Post-war audiences want truth</li>
                        </ul>
                        <p><strong>Impact:</strong> Social problem films gain 20% boost</p>
                    </div>
                `
            },
            newspaperHeadline: '"THE LOST WEEKEND" - UNFLINCHING REALISM PRAISED'
        },

        // ============================================================
        // 1946 - RECORD BOX OFFICE YEAR
        // ============================================================

        {
            year: 1946,
            month: 1,
            id: 'capra_returns',
            title: 'Frank Capra Returns from War',
            description: 'Director Frank Capra returns from military service, ready to make "It\'s a Wonderful Life."',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                capra_optimism: 10,
                veteran_directors: true
            },
            modal: {
                title: '🎬 Capra Returns - January 1946',
                content: `
                    <div class="historical-event">
                        <p><strong>Frank Capra back from making "Why We Fight" documentaries!</strong></p>
                        <p>The master of American optimism returns to direct "It's a Wonderful Life."</p>
                        <h3>Capra's Return:</h3>
                        <ul>
                            <li>Made propaganda films during war</li>
                            <li>Now forms independent production company</li>
                            <li>"It's a Wonderful Life" in production</li>
                            <li>Will flop initially, later become classic</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'FRANK CAPRA RETURNS TO HOLLYWOOD'
        },

        {
            year: 1946,
            month: 3,
            id: 'record_box_office',
            title: 'Record Box Office Year - $1.7 Billion',
            description: 'Returning veterans and prosperity create Hollywood\'s best year ever. But television looms...',
            type: 'milestone',
            importance: 'major',
            effects: {
                box_office_peak: 1.25,
                theater_attendance_peak: true,
                optimism: 20
            },
            modal: {
                title: '💰 Record Box Office - 1946',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood's greatest year ever!</strong></p>
                        <p>Box office reaches $1.7 billion. 90 million Americans go to movies every week.</p>
                        <h3>Peak Success:</h3>
                        <ul>
                            <li>Returning veterans fuel attendance</li>
                            <li>Post-war prosperity means disposable income</li>
                            <li>Pent-up demand for entertainment</li>
                            <li>Studios at peak profitability</li>
                        </ul>
                        <p><strong>But...</strong></p>
                        <ul>
                            <li>This is the peak - decline coming</li>
                            <li>Television development accelerating</li>
                            <li>Paramount case threatens studio system</li>
                            <li>Enjoy it while it lasts</li>
                        </ul>
                        <p><strong>Effect:</strong> Box office receipts boosted 25%</p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD SETS ALL-TIME BOX OFFICE RECORD'
        },

        {
            year: 1946,
            month: 7,
            id: 'bikini_atomic_tests',
            title: 'Bikini Atomic Tests',
            description: 'Nuclear tests in Pacific. Atomic anxiety enters American consciousness - and films.',
            type: 'political',
            importance: 'flavor',
            effects: {
                atomic_anxiety: 10,
                sci_fi_potential: 10
            },
            modal: {
                title: '☢️ Bikini Atomic Tests - July 1946',
                content: `
                    <div class="historical-event">
                        <p><strong>America tests atomic bombs at Bikini Atoll.</strong></p>
                        <p>Nuclear weapons display awesome - and terrifying - power.</p>
                        <h3>Cultural Impact:</h3>
                        <ul>
                            <li>Atomic anxiety begins</li>
                            <li>Sci-fi films will exploit nuclear fears</li>
                            <li>"Godzilla" concept born (Japan, 1954)</li>
                            <li>Cold War paranoia growing</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'ATOMIC TESTS DISPLAY NUCLEAR POWER'
        },

        {
            year: 1946,
            month: 11,
            id: 'best_years_phenomenon',
            title: '"The Best Years of Our Lives" Phenomenon',
            description: 'William Wyler\'s veteran adjustment drama becomes cultural touchstone. Wins 7 Oscars.',
            type: 'industry',
            importance: 'major',
            effects: {
                veteran_films: 1.3,
                social_realism: 1.25,
                prestige_drama: 15
            },
            modal: {
                title: '🏆 Best Years of Our Lives - November 1946',
                content: `
                    <div class="historical-event">
                        <p><strong>William Wyler's veteran drama becomes phenomenon!</strong></p>
                        <p>The film honestly depicts veterans' struggle to readjust to civilian life.</p>
                        <h3>Cultural Resonance:</h3>
                        <ul>
                            <li>Millions of veterans relate to story</li>
                            <li>Casts real amputee (Harold Russell)</li>
                            <li>Addresses PTSD before term existed</li>
                            <li>Will win 7 Academy Awards</li>
                            <li>Becomes highest-grossing film since GWTW</li>
                        </ul>
                        <p><strong>Impact:</strong></p>
                        <ul>
                            <li>Veteran films get 30% boost</li>
                            <li>Social realism gains 25% boost</li>
                            <li>Proves post-war audiences want truth</li>
                        </ul>
                        <p><em>"Last year it was kill Japs, this year it's make money." - Fredric March</em></p>
                    </div>
                `
            },
            newspaperHeadline: '"BEST YEARS OF OUR LIVES" CAPTURES POST-WAR AMERICA'
        },

        // ============================================================
        // 1947 - HUAC & CANNES FESTIVAL
        // ============================================================

        {
            year: 1947,
            month: 5,
            id: 'cannes_festival',
            title: 'First Cannes Film Festival',
            description: 'International film festival launches in France. European cinema begins post-war recovery.',
            type: 'industry',
            importance: 'major',
            effects: {
                international_prestige: 15,
                european_competition: 1.1,
                art_film_awareness: 10
            },
            modal: {
                title: '🎬 Cannes Film Festival - May 1947',
                content: `
                    <div class="historical-event">
                        <p><strong>First Cannes Film Festival celebrates international cinema!</strong></p>
                        <p>France launches prestigious film festival to compete with Venice and promote cinema as art.</p>
                        <h3>Significance:</h3>
                        <ul>
                            <li>European cinema recovering from war</li>
                            <li>Italian neo-realism emerging</li>
                            <li>Hollywood faces international competition</li>
                            <li>Art cinema gains prestige</li>
                        </ul>
                        <p><strong>Impact:</strong> International film awareness increases</p>
                    </div>
                `
            },
            newspaperHeadline: 'CANNES FILM FESTIVAL CELEBRATES INTERNATIONAL CINEMA'
        },

        {
            year: 1947,
            month: 6,
            id: 'blacklist_expands',
            title: 'Hollywood Blacklist Expands',
            description: 'More names added to unofficial blacklist. Fear spreads through the industry.',
            type: 'political',
            importance: 'flavor',
            effects: {
                blacklist_fear: 20,
                political_content_risk: 25
            },
            modal: {
                title: '⚠️ Blacklist Grows - June 1947',
                content: `
                    <div class="historical-event">
                        <p><strong>More artists blacklisted as Red Scare intensifies.</strong></p>
                        <p>Anyone with past liberal or communist associations is at risk.</p>
                        <h3>Blacklist Reality:</h3>
                        <ul>
                            <li>Unofficial but enforced by all studios</li>
                            <li>No due process or appeal</li>
                            <li>Accusation enough to end career</li>
                            <li>Some work under pseudonyms</li>
                            <li>Careers destroyed on rumor alone</li>
                        </ul>
                        <p><em>Make any controversial films at your peril.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'BLACKLIST EXPANDS - CAREERS DESTROYED'
        },

        {
            year: 1947,
            month: 10,
            id: 'huac_begins',
            title: 'HUAC Hollywood Hearings Begin',
            description: 'The House Un-American Activities Committee begins investigating Communist influence in Hollywood. The Red Scare has arrived.',
            type: 'political',
            importance: 'major',
            effects: {
                huac_active: true,
                political_risk: 30,
                blacklist_begins: true,
                social_films_risky: true,
                creative_freedom: -20
            },
            modal: {
                title: '⚠️ HUAC Hearings - October 1947',
                content: `
                    <div class="historical-event">
                        <p><strong>The House Un-American Activities Committee is investigating Hollywood.</strong></p>
                        <p>Congress is hunting for Communist sympathizers in the film industry. Careers are being destroyed.</p>
                        <h3>The Hollywood Ten:</h3>
                        <ul>
                            <li>10 screenwriters and directors cited for contempt</li>
                            <li>They refused to answer: "Are you now or have you ever been a member of the Communist Party?"</li>
                            <li>All will be blacklisted and imprisoned</li>
                            <li>Dalton Trumbo, Ring Lardner Jr., among them</li>
                        </ul>
                        <h3>Impact on Your Studio:</h3>
                        <ul>
                            <li>⚠️ Social justice films are now dangerous</li>
                            <li>⚠️ Politically active talent may be investigated</li>
                            <li>❌ Working with blacklisted artists is forbidden</li>
                            <li>🎬 Stick to safe, non-controversial content</li>
                            <li>⚠️ Your own films may draw HUAC attention</li>
                        </ul>
                        <p><strong>Studio Policy Options:</strong></p>
                        <ul>
                            <li><strong>Cooperate:</strong> Provide names, protect your studio</li>
                            <li><strong>Resist:</strong> Defend artistic freedom, risk investigation</li>
                            <li><strong>Stay Silent:</strong> Make safe films, avoid controversy</li>
                        </ul>
                        <p><em>"In Hollywood, you're either a friendly witness or a red."</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HUAC WITCH HUNT BEGINS IN HOLLYWOOD'
        },

        {
            year: 1947,
            month: 12,
            id: 'miracle_34th_street',
            title: '"Miracle on 34th Street"',
            description: 'Heartwarming Christmas fantasy provides relief from HUAC darkness. Optimism still sells.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                wholesome_content: 1.15,
                christmas_films: 10
            },
            modal: {
                title: '🎄 Miracle on 34th Street - December 1947',
                content: `
                    <div class="historical-event">
                        <p><strong>Christmas magic at the movies!</strong></p>
                        <p>Edmund Gwenn as Kris Kringle reminds audiences that faith and optimism still matter.</p>
                        <h3>The Film:</h3>
                        <ul>
                            <li>Wholesome fantasy in cynical times</li>
                            <li>Wins Edmund Gwenn Best Supporting Actor</li>
                            <li>Proves escapism still viable</li>
                            <li>Safe content during HUAC era</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: '"MIRACLE ON 34TH STREET" BRINGS CHRISTMAS CHEER'
        },

        // ============================================================
        // 1948 - PARAMOUNT DECREE & TELEVISION THREAT
        // ============================================================

        {
            year: 1948,
            month: 5,
            id: 'paramount_decree',
            title: 'Supreme Court Rules Against Studios',
            description: 'The Paramount Antitrust Decision forces studios to divest their theater chains. The studio system begins to crumble.',
            type: 'business',
            importance: 'major',
            effects: {
                vertical_integration_ends: true,
                distribution_harder: true,
                independent_producers_rise: true,
                box_office_uncertainty: 0.15,
                studio_power_decline: 20
            },
            modal: {
                title: '⚖️ Paramount Decision - May 1948',
                content: `
                    <div class="historical-event">
                        <p><strong>The Supreme Court has ruled against the studios.</strong></p>
                        <p>The golden age of vertical integration is over. Studios must sell their theater chains.</p>
                        <h3>The Decision:</h3>
                        <ul>
                            <li>❌ Studios can no longer own theaters</li>
                            <li>❌ Block booking is illegal</li>
                            <li>❌ Guaranteed distribution is ending</li>
                            <li>⚠️ Competition from independent producers</li>
                            <li>💼 Major business model destroyed</li>
                        </ul>
                        <h3>Impact on Your Studio:</h3>
                        <ul>
                            <li>📉 Box office revenue more uncertain (+15% variance)</li>
                            <li>⚠️ Must compete for theater bookings</li>
                            <li>💰 Distribution costs may increase</li>
                            <li>🎬 Quality matters more than ever</li>
                            <li>⚠️ Independent producers become rivals</li>
                        </ul>
                        <p><em>"The studio system is dying. Adapt or perish."</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'SUPREME COURT BREAKS UP STUDIO MONOPOLY'
        },

        {
            year: 1948,
            month: 8,
            id: 'television_threat',
            title: 'Television Threatens Theaters',
            description: 'TV ownership explodes. Americans can watch entertainment at home. Theater attendance begins decline.',
            type: 'industry',
            importance: 'major',
            effects: {
                television_competition: 0.9,
                theater_attendance_decline: 0.85,
                home_entertainment_threat: 20
            },
            modal: {
                title: '📺 Television Threat - August 1948',
                content: `
                    <div class="historical-event">
                        <p><strong>Television is invading American homes!</strong></p>
                        <p>TV ownership growing rapidly. Why go to the theater when you can watch at home?</p>
                        <h3>The Threat:</h3>
                        <ul>
                            <li>TV sets in 1 million homes (growing fast)</li>
                            <li>Free entertainment at home</li>
                            <li>Theater attendance starting to decline</li>
                            <li>Studios unsure how to respond</li>
                        </ul>
                        <p><strong>Impact:</strong></p>
                        <ul>
                            <li>Box office receipts down 10%</li>
                            <li>Theater attendance down 15%</li>
                            <li>Threat will only grow in 1950s</li>
                        </ul>
                        <p><em>Hollywood's existential crisis has arrived.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'TELEVISION THREATENS MOVIE THEATERS'
        },

        {
            year: 1948,
            month: 11,
            id: 'treasure_sierra_madre',
            title: 'John Huston\'s "Treasure of the Sierra Madre"',
            description: 'Huston\'s cynical adventure proves post-war audiences accept dark, ambiguous endings.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                cynical_films: 1.15,
                huston_prestige: 10
            },
            modal: {
                title: '🎬 Treasure of Sierra Madre - November 1948',
                content: `
                    <div class="historical-event">
                        <p><strong>John Huston's dark masterpiece!</strong></p>
                        <p>Humphrey Bogart's greed-consumed prospector descends into paranoid madness.</p>
                        <h3>Dark Vision:</h3>
                        <ul>
                            <li>No happy ending</li>
                            <li>Greed destroys everyone</li>
                            <li>Nature laughs at human ambition</li>
                            <li>Walter Huston (director's father) wins Oscar</li>
                        </ul>
                        <p><em>"Badges? We ain't got no badges!"</em></p>
                    </div>
                `
            },
            newspaperHeadline: '"TREASURE OF SIERRA MADRE" - DARK MASTERPIECE'
        },

        {
            year: 1948,
            month: 11,
            id: 'truman_upsets_dewey',
            title: 'Truman Upsets Dewey',
            description: 'Harry Truman\'s shocking victory. Cold War president will intensify anti-communist crusade.',
            type: 'political',
            importance: 'flavor',
            effects: {
                cold_war_intensifies: 10,
                huac_continues: true
            },
            modal: {
                title: '🗳️ Truman Wins - November 1948',
                content: `
                    <div class="historical-event">
                        <p><strong>"Dewey Defeats Truman" - WRONG!</strong></p>
                        <p>Truman's upset victory means Cold War policies continue.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>HUAC investigations will continue</li>
                            <li>Anti-communist pressure intensifies</li>
                            <li>Cold War paranoia growing</li>
                        </ul>
                    </div>
                `
            },
            newspaperHeadline: 'TRUMAN UPSETS DEWEY IN STUNNING VICTORY'
        },

        // ============================================================
        // 1949 - GAME END & FINAL EVENTS
        // ============================================================

        {
            year: 1949,
            month: 3,
            id: 'hollywood_ten_jailed',
            title: 'Hollywood Ten Sentenced to Prison',
            description: 'The Hollywood Ten begin prison sentences for contempt of Congress. Blacklist is now permanent.',
            type: 'political',
            importance: 'minor',
            effects: {
                blacklist_permanent: true,
                fear_maximum: 30
            },
            modal: {
                title: '⚠️ Hollywood Ten Jailed - March 1949',
                content: `
                    <div class="historical-event">
                        <p><strong>The Hollywood Ten go to prison.</strong></p>
                        <p>Writers and directors serve 6-12 months for contempt of Congress. Their careers are over.</p>
                        <h3>The Ten:</h3>
                        <ul>
                            <li>Dalton Trumbo (will write under pseudonyms)</li>
                            <li>Ring Lardner Jr. (future "M*A*S*H" writer)</li>
                            <li>And 8 others - all blacklisted permanently</li>
                        </ul>
                        <p><strong>Chilling Effect:</strong></p>
                        <ul>
                            <li>No one dares defend them</li>
                            <li>Blacklist now permanent institution</li>
                            <li>Political content completely taboo</li>
                            <li>Creative freedom at all-time low</li>
                        </ul>
                        <p><em>The blacklist will last until the 1960s.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD TEN BEGIN PRISON SENTENCES'
        },

        {
            year: 1949,
            month: 6,
            id: 'ava_gardner_scandal',
            title: 'Ava Gardner Scandal',
            description: 'Ava Gardner\'s affair with married Frank Sinatra creates scandal. Studios\' morality clauses tested.',
            type: 'cultural',
            importance: 'flavor',
            effects: {
                scandal_publicity: 1.1,
                morality_clause_tension: 10
            },
            modal: {
                title: '💔 Ava Gardner Scandal - June 1949',
                content: `
                    <div class="historical-event">
                        <p><strong>Ava Gardner and Frank Sinatra's affair makes headlines!</strong></p>
                        <p>Gardner's relationship with married Sinatra shocks conservative America.</p>
                        <h3>The Scandal:</h3>
                        <ul>
                            <li>Sinatra still married to Nancy</li>
                            <li>Public affair flouts morality</li>
                            <li>MGM worries about Gardner's image</li>
                            <li>But scandal also sells tickets</li>
                        </ul>
                        <p><em>They'll marry in 1951, divorce in 1957.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'AVA GARDNER-SINATRA SCANDAL ROCKS HOLLYWOOD'
        },

        {
            year: 1949,
            month: 12,
            id: 'golden_age_ends',
            title: 'The Golden Age Ends',
            description: 'The golden age of Hollywood draws to a close. Television is rising, the studio system is crumbling — but your journey continues into a new era.',
            type: 'milestone',
            importance: 'major',
            effects: {},
            modal: {
                title: '🎬 A New Era Begins - 1950',
                content: `
                    <div class="historical-event">
                        <p><strong>You have survived 16 years in Hollywood's Golden Age.</strong></p>
                        <h3>What You Experienced:</h3>
                        <ul>
                            <li>The end of the Pre-Code era (1934)</li>
                            <li>The rise of film noir and new genres</li>
                            <li>World War II and Hollywood's war effort (1941-1945)</li>
                            <li>Post-war record box office (1946)</li>
                            <li>The Red Scare and HUAC hearings (1947-1949)</li>
                            <li>The Paramount Decision (1948)</li>
                        </ul>
                        <h3>What Comes Next:</h3>
                        <ul>
                            <li>Television will devastate movie attendance</li>
                            <li>New technologies (CinemaScope, 3D) will fight TV</li>
                            <li>The studio system will collapse</li>
                            <li>New Hollywood auteurs will revolutionize filmmaking</li>
                            <li>The blockbuster era will transform the business</li>
                            <li>Digital technology will change everything</li>
                        </ul>
                        <p><em>Your studio must adapt or die. 60 more years of Hollywood history await...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'END OF AN ERA - HOLLYWOOD ENTERS UNCERTAIN FUTURE'
        },

        // ============================================================
        // 1950-2010: EXPANDED ERA MILESTONES
        // ============================================================

        // --- 1950s: TELEVISION THREAT ---
        {
            year: 1950, month: 1, id: 'tv_competition_begins',
            title: 'Television Invades American Homes',
            description: 'Television set ownership explodes past 9% of US households and climbing fast. Weekly cinema attendance begins a steep decline.',
            type: 'industry', importance: 'major',
            effects: { box_office_modifier: -0.15 },
            modal: {
                title: '📺 Television Invades America - January 1950',
                content: `
                    <div class="historical-event">
                        <p><strong>The small screen threatens to destroy the big screen.</strong></p>
                        <p>Television set ownership is exploding across America. Families who once went to the movies three times a week are now staying home to watch Milton Berle for free. Weekly cinema attendance has begun a steep and alarming decline.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>TV ownership past 9% of households and climbing fast</li>
                            <li>Weekly movie attendance dropping sharply</li>
                            <li>Studios must find ways to offer what TV cannot</li>
                            <li>Spectacle, widescreen, and color become weapons against the small screen</li>
                        </ul>
                        <p><strong>Effect:</strong> Box office revenue reduced by 15% as audiences stay home.</p>
                    </div>
                `
            },
            newspaperHeadline: 'TV THREATENS HOLLYWOOD - ATTENDANCE DROPS SHARPLY'
        },
        {
            year: 1950, month: 6, id: 'korean_war_begins',
            title: 'Korean War Begins',
            description: 'North Korea invades the South, drawing the United States into another conflict. War films gain renewed relevance.',
            type: 'political', importance: 'major',
            effects: { genre_boost: { war: 0.2 } },
            modal: {
                title: '🎖️ Korean War Begins - June 1950',
                content: `
                    <div class="historical-event">
                        <p><strong>America goes to war again — just five years after V-J Day.</strong></p>
                        <p>North Korea has invaded the South, and President Truman commits U.S. forces to defend the peninsula. Hollywood gears up for another cycle of war pictures, though this "police action" lacks the clear moral purpose of World War II.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>War films gain renewed box office relevance</li>
                            <li>Audiences hungry for patriotic stories — but also weary</li>
                            <li>Some young actors and crew called up for service</li>
                            <li>Cold War tensions intensify HUAC scrutiny of Hollywood</li>
                        </ul>
                        <p><strong>Effect:</strong> War genre films receive a 20% box office boost.</p>
                    </div>
                `
            },
            newspaperHeadline: 'KOREAN WAR ERUPTS - HOLLYWOOD MOBILIZES AGAIN'
        },
        {
            year: 1950, month: 11, id: 'paramount_decree_divestiture',
            title: 'Paramount Decree Forces Theater Sales',
            description: 'Studios begin divesting their theater chains under the 1948 Supreme Court ruling. The vertically integrated studio system is ending.',
            type: 'industry', importance: 'major',
            effects: { distribution_cost_modifier: 0.2 },
            modal: {
                title: '⚖️ Paramount Decree — Studios Lose Their Theaters - November 1950',
                content: `
                    <div class="historical-event">
                        <p><strong>The Supreme Court breaks Hollywood's monopoly.</strong></p>
                        <p>The 1948 <em>United States v. Paramount Pictures</em> ruling is now being enforced. Studios must divest their theater chains, ending the vertical integration that guaranteed every film a screen. For the first time, your pictures must compete for bookings on their own merits.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Studios can no longer guarantee their films play in their own theaters</li>
                            <li>Block booking (forcing theaters to take bad films with good ones) is outlawed</li>
                            <li>Independent theaters gain power to choose which films to screen</li>
                            <li>Distribution costs rise as studios must now negotiate with independent exhibitors</li>
                        </ul>
                        <p><strong>Effect:</strong> Distribution costs increase by 20% as the guaranteed exhibition pipeline disappears.</p>
                    </div>
                `
            },
            newspaperHeadline: 'STUDIOS FORCED TO SELL THEATER CHAINS'
        },
        {
            year: 1951, month: 3, id: 'huac_blacklist_expands',
            title: 'HUAC Hearings Resume — Blacklist Expands',
            description: 'The House Un-American Activities Committee resumes Hollywood hearings. Hundreds of writers, directors, and actors are blacklisted.',
            type: 'political', importance: 'major',
            effects: { talent_restriction: true },
            modal: {
                title: '⚠️ HUAC Blacklist Expands - March 1951',
                content: `
                    <div class="historical-event">
                        <p><strong>The Red Scare tightens its grip on Hollywood.</strong></p>
                        <p>The House Un-American Activities Committee has resumed its investigation of Communist influence in the motion picture industry. Hundreds of writers, directors, and actors are being blacklisted. Those who refuse to "name names" find themselves unemployable overnight.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Hundreds of talented professionals barred from working</li>
                            <li>Writers work under pseudonyms or use "fronts"</li>
                            <li>Studios require loyalty oaths from employees</li>
                            <li>Self-censorship increases — political content becomes dangerous</li>
                        </ul>
                        <p><strong>Effect:</strong> Talent pool restricted. Some of Hollywood's best writers and directors are now unavailable.</p>
                    </div>
                `
            },
            newspaperHeadline: 'HUAC EXPANDS BLACKLIST - HUNDREDS NAMED'
        },
        {
            year: 1953, month: 6, id: 'moon_is_blue_defies_code',
            title: '"The Moon Is Blue" Released Without Code Seal',
            description: 'Otto Preminger releases the film without Hays Code approval. It becomes a hit, proving audiences want mature content.',
            type: 'regulation', importance: 'moderate',
            effects: { censorship_modifier: -0.1 },
            modal: {
                title: '🌙 "The Moon Is Blue" Defies the Code - June 1953',
                content: `
                    <div class="historical-event">
                        <p><strong>A film released without the Production Code seal becomes a hit.</strong></p>
                        <p>Otto Preminger's comedy uses the words "virgin," "seduce," and "mistress" — forbidden under the Hays Code. The Production Code Administration denies its seal. Preminger releases it anyway through United Artists, and audiences flock to see it.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Proves audiences want more mature content</li>
                            <li>Demonstrates a film can profit without Code approval</li>
                            <li>Weakens the Production Code's authority</li>
                            <li>Emboldens other filmmakers to push boundaries</li>
                        </ul>
                        <p><strong>Effect:</strong> Censorship pressure reduced by 10% as the Code's grip loosens.</p>
                    </div>
                `
            },
            newspaperHeadline: '"MOON IS BLUE" DEFIES CENSORS - AND PROFITS'
        },
        {
            year: 1953, month: 9, id: 'cinemascope_debut',
            title: 'CinemaScope Debuts',
            description: 'Fox introduces CinemaScope widescreen with "The Robe". Studios rush to adopt widescreen to compete with television.',
            type: 'technology', importance: 'major',
            effects: { technology_available: 'cinemascope' },
            modal: {
                title: '🎞️ CinemaScope Debuts - September 1953',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood fights television with a wider picture.</strong></p>
                        <p>20th Century Fox introduces CinemaScope with "The Robe," projecting images across a vast widescreen canvas that no television set can match. The message is clear: you can't get <em>this</em> at home. Studios rush to adopt widescreen formats.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Widescreen becomes the new standard for prestige pictures</li>
                            <li>Spectacle and epic filmmaking gain renewed appeal</li>
                            <li>Theater owners invest in new projection equipment</li>
                            <li>Films shot in CinemaScope command premium ticket prices</li>
                        </ul>
                        <p><strong>Effect:</strong> CinemaScope technology now available for your productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'CINEMASCOPE DEBUTS - WIDESCREEN SPECTACLE FIGHTS TV'
        },
        {
            year: 1954, month: 1, id: 'drive_in_boom',
            title: 'Drive-In Theaters Boom',
            description: 'Over 4,000 drive-in theaters now operate across America, creating a new market hungry for genre pictures.',
            type: 'industry', importance: 'moderate',
            effects: { genre_boost: { horror: 0.15, sci_fi: 0.15 } },
            modal: {
                title: '🚗 Drive-In Theater Boom - 1954',
                content: `
                    <div class="historical-event">
                        <p><strong>Over 4,000 drive-in theaters now dot the American landscape.</strong></p>
                        <p>The drive-in craze has created an entirely new exhibition market. These "ozoners" cater to teenagers and young families who want cheap entertainment under the stars. They're hungry for genre pictures — horror, sci-fi, anything exciting.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>New market for low-budget genre films</li>
                            <li>Horror and sci-fi pictures find a devoted audience</li>
                            <li>Double features become the standard drive-in format</li>
                            <li>Youth audience becomes a powerful demographic</li>
                        </ul>
                        <p><strong>Effect:</strong> Horror and sci-fi genres receive a 15% box office boost.</p>
                    </div>
                `
            },
            newspaperHeadline: 'DRIVE-IN THEATERS BOOM - 4,000 AND COUNTING'
        },
        {
            year: 1955, month: 9, id: 'james_dean_death',
            title: 'James Dean Killed in Car Crash',
            description: 'James Dean dies at 24. His death crystallizes the rebellious youth culture reshaping Hollywood audiences.',
            type: 'cultural', importance: 'moderate',
            effects: { genre_boost: { drama: 0.1 } },
            modal: {
                title: '💫 James Dean — Gone at 24 - September 1955',
                content: `
                    <div class="historical-event">
                        <p><strong>Hollywood's brightest young rebel is dead.</strong></p>
                        <p>James Dean is killed in a highway collision near Cholame, California, at the age of 24. With only three films to his name — "East of Eden," "Rebel Without a Cause," and "Giant" — Dean has become the symbol of restless American youth. His death crystallizes the generational shift reshaping Hollywood's audience.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Youth rebellion becomes a bankable theme</li>
                            <li>Intense, Method-style acting gains prestige</li>
                            <li>Studios realize the teenage audience is Hollywood's future</li>
                            <li>Dean's posthumous releases become massive hits</li>
                        </ul>
                        <p><strong>Effect:</strong> Drama genre receives a 10% boost as audiences crave emotional intensity.</p>
                    </div>
                `
            },
            newspaperHeadline: 'JAMES DEAN DEAD AT 24 - REBEL WITHOUT A CAUSE'
        },
        {
            year: 1958, month: 4, id: 'studio_system_collapses',
            title: 'Golden Age Studio System Collapses',
            description: 'Contract player systems dissolve. Weekly attendance has fallen from 80 million in 1946 to 40 million. Studios slash overhead.',
            type: 'industry', importance: 'major',
            effects: { talent_cost_modifier: 0.4 },
            modal: {
                title: '🏚️ The Studio System Collapses - 1958',
                content: `
                    <div class="historical-event">
                        <p><strong>The Golden Age is officially over.</strong></p>
                        <p>The contract player system that defined Hollywood for three decades has dissolved. Weekly attendance has plummeted from 80 million in 1946 to just 40 million. Stars, directors, and writers are now free agents who negotiate deal-by-deal, demanding higher pay and creative control. Studios are slashing overhead and closing soundstages.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Stars become free agents — talent costs skyrocket</li>
                            <li>Studios can no longer stockpile contract players</li>
                            <li>Independent production companies proliferate</li>
                            <li>Package deals (star + director + script) become the norm</li>
                        </ul>
                        <p><strong>Effect:</strong> Talent costs increase by 40% as stars command premium salaries.</p>
                    </div>
                `
            },
            newspaperHeadline: 'STUDIO SYSTEM COLLAPSES - STARS GO FREELANCE'
        },

        // --- 1960s: NEW WAVE ---
        {
            year: 1960, month: 6, id: 'psycho_changes_horror',
            title: '"Psycho" Shocks Audiences',
            description: 'Hitchcock\'s low-budget "Psycho" outgrosses big-budget epics. The shower scene pushes violence further than the Code allows.',
            type: 'landmark', importance: 'major',
            effects: { genre_boost: { horror: 0.2, thriller: 0.2 } },
            modal: {
                title: '🔪 "Psycho" Shocks Audiences - June 1960',
                content: `
                    <div class="historical-event">
                        <p><strong>Alfred Hitchcock kills his leading lady in the first act — and changes cinema forever.</strong></p>
                        <p>Made for just $806,000 with a television crew, "Psycho" outgrosses every bloated epic of the year. The infamous shower scene pushes screen violence further than anyone thought possible. Hitchcock proves that suspense and shock, not spectacle, fill seats.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Low-budget horror can outperform expensive epics</li>
                            <li>Screen violence pushed to new extremes</li>
                            <li>Psychological horror emerges as a prestige genre</li>
                            <li>Hitchcock demands "no late seating" — event cinema is born</li>
                        </ul>
                        <p><strong>Effect:</strong> Horror and thriller genres receive a 20% box office boost.</p>
                    </div>
                `
            },
            newspaperHeadline: '"PSYCHO" SHOCKS NATION - HITCHCOCK DEFIES ALL RULES'
        },
        {
            year: 1960, month: 10, id: 'spartacus_breaks_blacklist',
            title: '"Spartacus" Credits Dalton Trumbo — Blacklist Broken',
            description: 'Kirk Douglas insists blacklisted writer Dalton Trumbo receive screen credit. The blacklist begins to crumble.',
            type: 'political', importance: 'moderate',
            effects: { talent_restriction: false },
            modal: {
                title: '✊ "Spartacus" Breaks the Blacklist - October 1960',
                content: `
                    <div class="historical-event">
                        <p><strong>Kirk Douglas credits blacklisted writer Dalton Trumbo by name — and the blacklist begins to crumble.</strong></p>
                        <p>For over a decade, hundreds of Hollywood professionals have been denied work for alleged Communist sympathies. Now Kirk Douglas insists that Dalton Trumbo — one of the original "Hollywood Ten" — receive on-screen credit for writing "Spartacus." President-elect Kennedy even crosses a picket line to see the film.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>The Hollywood blacklist begins to collapse</li>
                            <li>Blacklisted talent gradually returns to work</li>
                            <li>Political content becomes less dangerous to produce</li>
                            <li>A dark chapter in Hollywood history nears its end</li>
                        </ul>
                        <p><strong>Effect:</strong> Talent restrictions lifted. Previously blacklisted writers and directors become available again.</p>
                    </div>
                `
            },
            newspaperHeadline: 'SPARTACUS CREDITS BLACKLISTED WRITER - WALL CRUMBLES'
        },
        {
            year: 1963, month: 6, id: 'cleopatra_disaster',
            title: '"Cleopatra" Nearly Bankrupts Fox',
            description: 'Elizabeth Taylor\'s "Cleopatra" costs $44 million and nearly destroys 20th Century Fox. The age of the bloated epic is over.',
            type: 'landmark', importance: 'major',
            effects: { budget_risk_modifier: 0.3 },
            modal: {
                title: '👑 "Cleopatra" Nearly Destroys Fox - June 1963',
                content: `
                    <div class="historical-event">
                        <p><strong>The most expensive film ever made nearly bankrupts a major studio.</strong></p>
                        <p>Elizabeth Taylor's "Cleopatra" has ballooned from a $2 million production to a staggering $44 million catastrophe. Beset by Taylor's illnesses, the Burton-Taylor scandal, and runaway costs in Rome, the film nearly destroys 20th Century Fox. Even with decent ticket sales, it cannot recoup its monstrous budget.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Bloated historical epics fall out of favor</li>
                            <li>Studios become wary of runaway productions</li>
                            <li>Budget overruns now carry existential risk</li>
                            <li>Star salary escalation seen as dangerous</li>
                        </ul>
                        <p><strong>Effect:</strong> Budget risk increased by 30%. Overspending on productions is now more dangerous than ever.</p>
                    </div>
                `
            },
            newspaperHeadline: 'CLEOPATRA FIASCO - FOX TEETERS ON BANKRUPTCY'
        },
        {
            year: 1964, month: 7, id: 'civil_rights_act',
            title: 'Civil Rights Act Signed Into Law',
            description: 'The Civil Rights Act reshapes American society. Hollywood faces pressure to improve representation.',
            type: 'political', importance: 'major',
            effects: {},
            modal: {
                title: '🏛️ Civil Rights Act Signed - July 1964',
                content: `
                    <div class="historical-event">
                        <p><strong>Landmark legislation transforms America — and Hollywood must reckon with its own record.</strong></p>
                        <p>President Johnson signs the Civil Rights Act of 1964, outlawing discrimination based on race, color, religion, sex, or national origin. Hollywood, which has long marginalized Black actors and filmmakers, faces mounting pressure to improve representation both on screen and behind the camera.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Pressure grows for meaningful minority representation</li>
                            <li>Sidney Poitier becomes Hollywood's first Black leading man</li>
                            <li>Socially conscious dramas gain cultural relevance</li>
                            <li>Studios begin — slowly — to diversify their output</li>
                        </ul>
                        <p><em>The industry's progress will be slow, but the direction is irreversible.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'CIVIL RIGHTS ACT SIGNED - AMERICA TRANSFORMS'
        },
        {
            year: 1966, month: 6, id: 'virginia_woolf_exemption',
            title: '"Who\'s Afraid of Virginia Woolf?" Gets Special Exemption',
            description: 'Warner Bros. releases the film with profanity under a special Code exemption. The Hays Code is effectively dead.',
            type: 'regulation', importance: 'major',
            effects: { censorship_modifier: -0.3 },
            modal: {
                title: '🎭 "Virginia Woolf" Kills the Hays Code - June 1966',
                content: `
                    <div class="historical-event">
                        <p><strong>The Hays Production Code is effectively dead.</strong></p>
                        <p>Warner Bros. releases "Who's Afraid of Virginia Woolf?" starring Elizabeth Taylor and Richard Burton, with its frank language and adult themes, under a special exemption from the Production Code. The film is a critical and commercial smash. If a Code seal can simply be waived for a prestige picture, what authority does the Code still hold? The answer: almost none.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Profanity and adult language appear on screen</li>
                            <li>The Production Code loses all meaningful enforcement power</li>
                            <li>Mature, adult-themed films gain commercial viability</li>
                            <li>The stage is set for a formal replacement of the Code</li>
                        </ul>
                        <p><strong>Effect:</strong> Censorship pressure reduced by 30%. The Code is now toothless.</p>
                    </div>
                `
            },
            newspaperHeadline: 'VIRGINIA WOOLF BREAKS CODE - PROFANITY ON SCREEN'
        },
        {
            year: 1966, month: 10, id: 'conglomerate_era_begins',
            title: 'Gulf+Western Acquires Paramount Pictures',
            description: 'Gulf+Western buys Paramount, launching the conglomerate era. Studios become corporate divisions.',
            type: 'industry', importance: 'major',
            effects: {},
            modal: {
                title: '🏢 Conglomerates Swallow Hollywood - October 1966',
                content: `
                    <div class="historical-event">
                        <p><strong>Corporate America buys Hollywood.</strong></p>
                        <p>Gulf+Western Industries acquires Paramount Pictures, kicking off a wave of corporate takeovers. The founding moguls — men like Jack Warner, Louis B. Mayer, and Darryl Zanuck — are being replaced by corporate executives who view films as product lines in diversified portfolios. The personal touch of the studio mogul era gives way to boardroom decision-making.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Studios become divisions of massive conglomerates</li>
                            <li>Financial accountability replaces mogul instinct</li>
                            <li>Corporate owners demand predictable returns</li>
                            <li>The era of the all-powerful studio boss fades away</li>
                        </ul>
                        <p><em>Hollywood is now big business — in every sense of the word.</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'CONGLOMERATES SWALLOW HOLLYWOOD'
        },

        // --- RATINGS ERA ---
        {
            year: 1968, month: 11, id: 'mpaa_rating_system',
            title: 'MPAA Rating System Replaces Hays Code',
            description: 'Jack Valenti\'s MPAA rating system (G, M, R, X) officially replaces the Hays Production Code. Filmmakers are free to tackle any subject.',
            type: 'regulation', importance: 'critical',
            effects: { censorship_system: 'mpaa', censorship_modifier: -0.5 },
            modal: {
                title: '⚖️ MPAA Rating System Replaces the Hays Code - November 1968',
                content: `
                    <div class="historical-event">
                        <p><strong>After 34 years, the Hays Production Code is dead. Long live the rating system.</strong></p>
                        <p>MPAA president Jack Valenti introduces a voluntary rating system: G (General Audiences), M (Mature), R (Restricted), and X (No one under 17). Filmmakers are now free to tackle any subject — violence, sexuality, language, drugs — as long as the film receives an appropriate rating. The era of content prohibition is over; the era of content classification begins.</p>
                        <h3>The New Ratings:</h3>
                        <ul>
                            <li><strong>G</strong> — General Audiences (all ages)</li>
                            <li><strong>M</strong> — Suggested for Mature Audiences</li>
                            <li><strong>R</strong> — Restricted (under 16 requires parent/guardian)</li>
                            <li><strong>X</strong> — No one under 17 admitted</li>
                        </ul>
                        <p><strong>Effect:</strong> Censorship dramatically reduced. Films can now explore any subject with the appropriate rating. The creative floodgates are open.</p>
                    </div>
                `
            },
            newspaperHeadline: 'HAYS CODE ABOLISHED - MPAA RATINGS TAKE EFFECT'
        },
        {
            year: 1969, month: 8, id: 'easy_rider_new_hollywood',
            title: '"Easy Rider" Launches New Hollywood',
            description: 'Made for $400,000, "Easy Rider" grosses $60 million. Studios hand creative control to young auteur directors.',
            type: 'landmark', importance: 'major',
            effects: { genre_boost: { drama: 0.15 } },
            modal: {
                title: '🏍️ "Easy Rider" Launches New Hollywood - August 1969',
                content: `
                    <div class="historical-event">
                        <p><strong>A $400,000 motorcycle movie grosses $60 million — and the inmates take over the asylum.</strong></p>
                        <p>Dennis Hopper and Peter Fonda's "Easy Rider" proves that young, hungry filmmakers with personal vision can connect with audiences in ways that expensive studio product cannot. Terrified by their own irrelevance, studios begin handing creative control to a new generation of auteur directors: Coppola, Scorsese, Altman, Bogdanovich.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Studios hand creative control to young directors</li>
                            <li>Low-budget, personal filmmaking becomes viable</li>
                            <li>Counterculture themes enter the mainstream</li>
                            <li>The "New Hollywood" auteur era begins</li>
                        </ul>
                        <p><strong>Effect:</strong> Drama genre receives a 15% boost as personal, daring filmmaking finds its audience.</p>
                    </div>
                `
            },
            newspaperHeadline: 'EASY RIDER BREAKS ALL RULES - YOUTH TAKES OVER HOLLYWOOD'
        },

        // --- NEW HOLLYWOOD ---
        {
            year: 1972, month: 3, id: 'godfather_phenomenon',
            title: '"The Godfather" Becomes Cultural Phenomenon',
            description: 'Coppola\'s "The Godfather" shatters records and proves R-rated adult drama can dominate commercially.',
            type: 'landmark', importance: 'major',
            effects: { genre_boost: { crime: 0.25 } },
            modal: {
                title: '🎬 "The Godfather" — A Cultural Phenomenon - March 1972',
                content: `
                    <div class="historical-event">
                        <p><strong>Francis Ford Coppola makes an offer the world can't refuse.</strong></p>
                        <p>"The Godfather" shatters every box office record, proving that R-rated adult drama can dominate commercially. Coppola — a young director the studio didn't even want — delivers a masterpiece that elevates the gangster genre into American mythology. The film earns $245 million worldwide against a $6 million budget.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>R-rated adult drama proven as blockbuster material</li>
                            <li>Crime genre explodes in popularity and prestige</li>
                            <li>Auteur directors gain unprecedented power</li>
                            <li>Sequel potential for hit films becomes apparent</li>
                        </ul>
                        <p><strong>Effect:</strong> Crime genre receives a massive 25% box office boost.</p>
                    </div>
                `
            },
            modal: {
                title: '🎬 "The Godfather" — A Cultural Phenomenon - March 1972',
                content: `
                    <div class="historical-event">
                        <p><strong>Francis Ford Coppola's masterpiece proves R-rated adult drama can dominate the box office.</strong></p>
                        <p>Paramount nearly fired Coppola twice during production. The studio wanted a cheap, contemporary crime picture. Coppola fought for period authenticity, Marlon Brando, and his artistic vision. The result? The highest-grossing film of 1972 and an instant American classic that redefines what popular cinema can be.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>R-rated adult drama proves commercially dominant</li>
                            <li>Crime and gangster films surge in popularity</li>
                            <li>Director as auteur gains enormous cultural prestige</li>
                            <li>Sequel potential of franchise storytelling demonstrated</li>
                        </ul>
                        <p><strong>Effect:</strong> Crime genre receives a 25% box office boost.</p>
                    </div>
                `
            },
            newspaperHeadline: 'GODFATHER SHATTERS RECORDS - CRIME EPIC DOMINATES'
        },
        {
            year: 1974, month: 8, id: 'watergate_nixon_resigns',
            title: 'Nixon Resigns Over Watergate',
            description: 'Nixon resigns in disgrace. Deep public cynicism fuels a wave of paranoid thrillers and anti-establishment films.',
            type: 'political', importance: 'major',
            effects: { genre_boost: { thriller: 0.25 } },
            modal: {
                title: '🏛️ Nixon Resigns — Watergate Shatters Trust - August 1974',
                content: `
                    <div class="historical-event">
                        <p><strong>The President of the United States resigns in disgrace.</strong></p>
                        <p>Richard Nixon's resignation over the Watergate scandal plunges America into deep cynicism about authority, government, and institutions. This national mood of paranoia and distrust feeds directly into Hollywood, fueling a wave of conspiracy thrillers, anti-establishment dramas, and films questioning American power.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Paranoid thrillers surge in popularity ("The Parallax View," "Three Days of the Condor")</li>
                            <li>Anti-hero protagonists replace clean-cut leading men</li>
                            <li>Audiences embrace dark, morally ambiguous storytelling</li>
                            <li>Investigative journalism becomes glamorous ("All the President's Men")</li>
                        </ul>
                        <p><strong>Effect:</strong> Thriller genre receives a 25% box office boost as audiences crave conspiracy narratives.</p>
                    </div>
                `
            },
            modal: {
                title: '🏛️ Nixon Resigns — Watergate Shatters Trust - August 1974',
                content: `
                    <div class="historical-event">
                        <p><strong>The President of the United States resigns in disgrace.</strong></p>
                        <p>Richard Nixon's resignation over the Watergate scandal leaves America deeply cynical about its institutions. This pervasive distrust fuels a remarkable wave of paranoid thrillers and anti-establishment films: "The Conversation," "The Parallax View," "Three Days of the Condor," and eventually "All the President's Men."</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Paranoid thrillers become the genre of the moment</li>
                            <li>Anti-authority and conspiracy narratives resonate deeply</li>
                            <li>Audiences distrust happy endings — darker films thrive</li>
                            <li>Investigative journalism becomes a cinematic subject</li>
                        </ul>
                        <p><strong>Effect:</strong> Thriller genre receives a 25% box office boost as audiences crave conspiracy narratives.</p>
                    </div>
                `
            },
            newspaperHeadline: 'NIXON RESIGNS - WATERGATE SHAKES AMERICA'
        },
        {
            year: 1975, month: 6, id: 'jaws_invents_blockbuster',
            title: '"Jaws" Invents the Summer Blockbuster',
            description: 'Spielberg\'s "Jaws" opens wide on 464 screens with massive TV advertising. First film to gross $100 million domestically.',
            type: 'landmark', importance: 'critical',
            effects: { distribution_strategy: 'wide_release_enhanced' },
            modal: {
                title: '🦈 "Jaws" Invents the Summer Blockbuster - June 1975',
                content: `
                    <div class="historical-event">
                        <p><strong>Steven Spielberg creates the template that will define Hollywood for the next fifty years.</strong></p>
                        <p>"Jaws" opens wide on 464 screens simultaneously — an unheard-of release strategy — backed by a massive television advertising blitz. The result: the first film in history to gross $100 million domestically. Spielberg has invented the summer blockbuster, and Hollywood will never be the same. Wide releases, saturation marketing, and opening weekend grosses become the new obsession.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Wide-release strategy replaces slow, city-by-city rollouts</li>
                            <li>Television advertising becomes essential for film marketing</li>
                            <li>Summer becomes Hollywood's most important season</li>
                            <li>Opening weekend box office becomes the key metric of success</li>
                        </ul>
                        <p><strong>Effect:</strong> Enhanced wide-release distribution strategy now available. The blockbuster era begins.</p>
                    </div>
                `
            },
            modal: {
                title: '🦈 "Jaws" Invents the Summer Blockbuster - June 1975',
                content: `
                    <div class="historical-event">
                        <p><strong>Steven Spielberg's mechanical shark eats the old Hollywood — and the blockbuster era is born.</strong></p>
                        <p>"Jaws" opens wide on 464 screens simultaneously — unheard of in an era of slow, platform releases — backed by a massive national television advertising campaign. It becomes the first film to gross $100 million domestically. The "wide release" distribution model, the summer tentpole, and the event movie are all born in the waters off Amity Island.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Wide-release distribution model replaces slow rollouts</li>
                            <li>Summer becomes the prime blockbuster season</li>
                            <li>TV advertising becomes essential for film marketing</li>
                            <li>$100 million domestic gross — a new benchmark</li>
                        </ul>
                        <p><strong>Effect:</strong> Wide-release distribution strategy enhanced. The blockbuster era begins.</p>
                    </div>
                `
            },
            newspaperHeadline: 'JAWS DEVOURS BOX OFFICE - $100 MILLION BARRIER SMASHED'
        },
        {
            year: 1975, month: 12, id: 'dolby_stereo_arrives',
            title: 'Dolby Stereo Comes to Cinema',
            description: 'Dolby Laboratories introduces Dolby Stereo, dramatically improving theater audio quality.',
            type: 'technology', importance: 'moderate',
            effects: { technology_available: 'dolby_stereo' },
            modal: {
                title: '🔊 Dolby Stereo Arrives in Cinema - December 1975',
                content: `
                    <div class="historical-event">
                        <p><strong>The movies finally sound as good as they look.</strong></p>
                        <p>Dolby Laboratories introduces Dolby Stereo for theatrical exhibition, dramatically improving the quality of movie sound. For the first time, audiences experience true directional audio, deep bass, and crystal-clear dialogue. The technology will become standard equipment in theaters worldwide, and films that utilize it gain a powerful immersive advantage.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Theatrical sound quality leaps forward dramatically</li>
                            <li>Sound design becomes a major creative tool</li>
                            <li>Action and sci-fi films benefit most from immersive audio</li>
                            <li>Theater owners upgrade equipment to stay competitive</li>
                        </ul>
                        <p><strong>Effect:</strong> Dolby Stereo technology now available for your productions.</p>
                    </div>
                `
            },
            modal: {
                title: '🔊 Dolby Stereo Arrives - December 1975',
                content: `
                    <div class="historical-event">
                        <p><strong>The movies finally sound as good as they look.</strong></p>
                        <p>Dolby Laboratories introduces Dolby Stereo for cinema, encoding four channels of audio onto standard optical film prints. The result is a dramatic leap in sound quality — richer music, clearer dialogue, and immersive sound effects. Theaters equipped with Dolby processors offer an audio experience that television simply cannot match.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Film sound quality improves dramatically</li>
                            <li>Theaters gain another weapon against home viewing</li>
                            <li>Sound design becomes a critical production element</li>
                            <li>"Star Wars" (1977) will showcase Dolby's full potential</li>
                        </ul>
                        <p><strong>Effect:</strong> Dolby Stereo technology now available for your productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'DOLBY STEREO REVOLUTIONIZES MOVIE SOUND'
        },
        {
            year: 1977, month: 5, id: 'star_wars_changes_everything',
            title: '"Star Wars" Changes Everything',
            description: 'George Lucas\'s "Star Wars" earns $461 million and creates the franchise model. Merchandising dwarfs ticket sales.',
            type: 'landmark', importance: 'critical',
            effects: { genre_boost: { sci_fi: 0.4 }, franchise_model: true },
            modal: {
                title: '⭐ "Star Wars" Changes Everything - May 1977',
                content: `
                    <div class="historical-event">
                        <p><strong>A long time ago, in a galaxy far, far away... Hollywood was reborn.</strong></p>
                        <p>George Lucas's space opera was dismissed by every studio except Fox. It opens on May 25, 1977, and earns $461 million worldwide. But the real revolution is merchandising: Star Wars toys, lunchboxes, and merchandise generate billions more than ticket sales. The franchise model — where a single property spawns sequels, prequels, spin-offs, and an empire of licensed products — becomes Hollywood's holy grail.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Sci-fi becomes Hollywood's most bankable genre</li>
                            <li>Merchandising revenue dwarfs theatrical returns</li>
                            <li>The franchise/sequel model becomes the industry standard</li>
                            <li>Special effects technology leaps forward (ILM founded)</li>
                        </ul>
                        <p><strong>Effect:</strong> Sci-fi genre receives a massive 40% boost. Franchise filmmaking model unlocked.</p>
                    </div>
                `
            },
            newspaperHeadline: 'STAR WARS CONQUERS THE GALAXY - RECORDS OBLITERATED'
        },

        // --- BLOCKBUSTER AGE ---
        {
            year: 1980, month: 4, id: 'home_video_revolution',
            title: 'Home Video Market Explodes',
            description: 'VHS player penetration reaches critical mass. Studios discover they can sell films twice — once in theaters, again on tape.',
            type: 'technology', importance: 'critical',
            effects: { revenue_stream: 'home_video' },
            modal: {
                title: '📼 Home Video Revolution - April 1980',
                content: `
                    <div class="historical-event">
                        <p><strong>Studios discover they can sell their films twice — and the second time is even more profitable.</strong></p>
                        <p>VHS player penetration has reached critical mass in American homes. After initially fighting home video in court (Universal sued Sony over the Betamax), studios realize that home video is not piracy — it's a goldmine. Films that underperformed theatrically can find new life on tape. Catalog titles generate pure profit. A new revenue stream is born.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Home video creates a massive new revenue stream</li>
                            <li>Films gain a profitable "second life" after theatrical release</li>
                            <li>Video rental stores become a cultural institution</li>
                            <li>Direct-to-video market emerges for lower-budget films</li>
                        </ul>
                        <p><strong>Effect:</strong> Home video revenue stream unlocked. Your films now earn money long after they leave theaters.</p>
                    </div>
                `
            },
            newspaperHeadline: 'VHS REVOLUTION - STUDIOS DISCOVER HOME VIDEO GOLD'
        },
        {
            year: 1980, month: 11, id: 'heavens_gate_disaster',
            title: '"Heaven\'s Gate" Ends the Auteur Era',
            description: 'Cimino\'s $44 million "Heaven\'s Gate" earns $3.5 million. United Artists collapses. Studios reclaim control from directors.',
            type: 'landmark', importance: 'major',
            effects: { budget_risk_modifier: 0.5 },
            modal: {
                title: '💥 "Heaven\'s Gate" Ends the Auteur Era - November 1980',
                content: `
                    <div class="historical-event">
                        <p><strong>One film's catastrophic failure changes Hollywood's power structure forever.</strong></p>
                        <p>Michael Cimino, fresh off his Oscar win for "The Deer Hunter," is given carte blanche by United Artists. His western "Heaven's Gate" balloons to $44 million and earns just $3.5 million. United Artists — the studio founded by Chaplin, Pickford, Fairbanks, and Griffith — collapses and is sold to MGM. The message is clear: never again will directors have unchecked power.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Studios reclaim creative control from directors</li>
                            <li>Budget oversight becomes paramount</li>
                            <li>The New Hollywood auteur era is officially over</li>
                            <li>United Artists ceases to exist as an independent studio</li>
                        </ul>
                        <p><strong>Effect:</strong> Budget risk increased by 50%. Studios now enforce strict financial controls on productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'HEAVEN\'S GATE DESTROYS UNITED ARTISTS'
        },
        {
            year: 1982, month: 7, id: 'tron_cgi_pioneer',
            title: '"Tron" Pioneers Computer-Generated Imagery',
            description: 'Disney\'s "Tron" features 15 minutes of CGI — the most ever in a feature film.',
            type: 'technology', importance: 'moderate',
            effects: { technology_available: 'basic_cgi' },
            modal: {
                title: '💻 "Tron" Pioneers CGI - July 1982',
                content: `
                    <div class="historical-event">
                        <p><strong>Disney bets on the future — 15 minutes of computer-generated imagery in a feature film.</strong></p>
                        <p>"Tron" features the most extensive use of computer-generated imagery ever seen in a motion picture. While the film is only a modest commercial success, its neon-lit digital world opens a door that will never close. The technology is primitive, but the potential is limitless.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>First major use of CGI in a feature film</li>
                            <li>Demonstrates that virtual worlds can be rendered on screen</li>
                            <li>Ironically, the Academy refuses to nominate it for Visual Effects — they consider computer animation "cheating"</li>
                            <li>Plants the seed for the CGI revolution to come</li>
                        </ul>
                        <p><strong>Effect:</strong> Basic CGI technology now available for your productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'TRON OPENS DOOR TO COMPUTER-GENERATED CINEMA'
        },
        {
            year: 1982, month: 6, id: 'et_breaks_records',
            title: '"E.T." Breaks All Box Office Records',
            description: 'Spielberg\'s "E.T." grosses $435 million, becoming the highest-grossing film ever. Family sci-fi proves supreme.',
            type: 'landmark', importance: 'major',
            effects: { genre_boost: { sci_fi: 0.2 } },
            modal: {
                title: '👽 "E.T." Breaks All Records - June 1982',
                content: `
                    <div class="historical-event">
                        <p><strong>A gentle alien steals the hearts of the world — and $435 million.</strong></p>
                        <p>Steven Spielberg's "E.T. the Extra-Terrestrial" becomes the highest-grossing film of all time, surpassing "Star Wars." The story of a boy and his alien friend proves that family-oriented sci-fi, powered by genuine emotion rather than spectacle alone, can achieve unprecedented commercial success. Reese's Pieces sales jump 65% from the product placement.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Family sci-fi confirmed as supremely bankable</li>
                            <li>Emotional storytelling trumps pure spectacle</li>
                            <li>Product placement becomes a lucrative revenue source</li>
                            <li>Spielberg cemented as Hollywood's most powerful director</li>
                        </ul>
                        <p><strong>Effect:</strong> Sci-fi genre receives a 20% box office boost.</p>
                    </div>
                `
            },
            newspaperHeadline: 'E.T. PHONES HOME TO RECORD-BREAKING $435 MILLION'
        },
        {
            year: 1984, month: 7, id: 'pg13_rating_introduced',
            title: 'PG-13 Rating Introduced',
            description: 'After outcry over "Temple of Doom" and "Gremlins", the MPAA creates PG-13 — the sweet spot for blockbusters.',
            type: 'regulation', importance: 'major',
            effects: { rating_available: 'pg13' },
            modal: {
                title: '🎬 PG-13 Rating Introduced - July 1984',
                content: `
                    <div class="historical-event">
                        <p><strong>Spielberg creates a problem — then helps solve it.</strong></p>
                        <p>After parental outcry over the intense violence in PG-rated "Indiana Jones and the Temple of Doom" and "Gremlins" (both Spielberg productions), the MPAA introduces a new rating: PG-13. It fills the enormous gap between the family-friendly PG and the restrictive R. The new rating will prove to be the commercial sweet spot — edgy enough to attract teenagers, accessible enough for broad audiences.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>PG-13 bridges the gap between PG and R</li>
                            <li>Blockbusters can now include moderate violence and mild language</li>
                            <li>The "four-quadrant" blockbuster targets all demographics</li>
                            <li>PG-13 will become the most profitable rating in Hollywood</li>
                        </ul>
                        <p><strong>Effect:</strong> PG-13 rating now available — the blockbuster sweet spot for maximum audience reach.</p>
                    </div>
                `
            },
            newspaperHeadline: 'MPAA INTRODUCES PG-13 RATING'
        },
        {
            year: 1986, month: 1, id: 'home_video_surpasses_theatrical',
            title: 'Home Video Revenue Surpasses Theatrical',
            description: 'Studios earn more from VHS than theaters for the first time. The economics of filmmaking are permanently altered.',
            type: 'industry', importance: 'major',
            effects: { revenue_stream: 'home_video_dominant' },
            modal: {
                title: '📼 Home Video Surpasses Theatrical Revenue - 1986',
                content: `
                    <div class="historical-event">
                        <p><strong>For the first time, studios earn more money from VHS tapes than from movie theaters.</strong></p>
                        <p>The economics of filmmaking have been permanently altered. Home video revenue has surpassed theatrical box office for the first time. A film that underperforms in theaters can now be rescued by strong video sales and rentals. The theatrical release is increasingly becoming a marketing event for the home video release — an expensive advertisement for the real moneymaker.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Home video becomes the primary revenue source for studios</li>
                            <li>Theatrical release serves partly as marketing for home video</li>
                            <li>Video rental chains (Blockbuster) become industry kingmakers</li>
                            <li>Direct-to-video market explodes for genre films</li>
                        </ul>
                        <p><strong>Effect:</strong> Home video is now the dominant revenue stream. Your studio's economics are fundamentally changed.</p>
                    </div>
                `
            },
            newspaperHeadline: 'VHS REVENUE SURPASSES BOX OFFICE - SEISMIC SHIFT'
        },
        {
            year: 1989, month: 6, id: 'batman_marketing_era',
            title: '"Batman" Launches Event Marketing Era',
            description: 'Warner Bros.\' "Batman" earns $411 million driven by the most aggressive marketing campaign in history.',
            type: 'landmark', importance: 'major',
            effects: { marketing_strategy: 'event_marketing' },
            modal: {
                title: '🦇 "Batman" Launches Event Marketing - June 1989',
                content: `
                    <div class="historical-event">
                        <p><strong>The Bat-Signal lights up not just Gotham, but every billboard, bus, and T-shirt in America.</strong></p>
                        <p>Warner Bros.' "Batman" is accompanied by the most aggressive marketing campaign in film history. The iconic Bat-logo appears everywhere months before release. Merchandise is in stores before audiences see a single frame. Tim Burton's dark vision earns $411 million worldwide, but the marketing spend and licensing deals generate far more. Films are now "events" that begin selling long before opening night.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Event-scale marketing campaigns become essential for tentpoles</li>
                            <li>Pre-release merchandise generates massive revenue</li>
                            <li>Brand awareness campaigns begin months before release</li>
                            <li>Comic book properties proven as blockbuster IP</li>
                        </ul>
                        <p><strong>Effect:</strong> Event marketing strategy unlocked. Major releases now benefit from aggressive pre-release campaigns.</p>
                    </div>
                `
            },
            newspaperHeadline: 'BATMAN MARKETING BLITZ SETS NEW STANDARD'
        },

        // --- INDIE BOOM ---
        {
            year: 1990, month: 9, id: 'nc17_replaces_x',
            title: 'NC-17 Rating Replaces X',
            description: 'The MPAA introduces NC-17 to replace the stigmatized X rating, debuting with "Henry & June".',
            type: 'regulation', importance: 'moderate',
            effects: { rating_available: 'nc17' },
            modal: {
                title: '🎬 NC-17 Replaces the X Rating - September 1990',
                content: `
                    <div class="historical-event">
                        <p><strong>The MPAA attempts to rescue serious adult cinema from the pornography stigma.</strong></p>
                        <p>The X rating, intended for serious adult films, has been co-opted by the pornography industry (which trademarked "XXX"). As a result, newspapers refuse to advertise X-rated films and many theater chains won't show them. The MPAA introduces NC-17 — "No Children 17 and Under Admitted" — debuting with Philip Kaufman's "Henry & June." The goal: give legitimate adult films a rating free from pornographic association.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>NC-17 provides a non-stigmatized adults-only rating</li>
                            <li>Serious filmmakers can tackle explicit content without the X label</li>
                            <li>However, many theaters and advertisers still shy away from NC-17</li>
                            <li>The commercial viability of NC-17 films remains limited</li>
                        </ul>
                        <p><strong>Effect:</strong> NC-17 rating now available for your productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'NC-17 REPLACES X RATING - NEW ERA FOR ADULT FILMS'
        },
        {
            year: 1991, month: 7, id: 't2_cgi_breakthrough',
            title: '"Terminator 2" CGI Breakthrough',
            description: 'Cameron\'s "T2" stuns with the liquid-metal T-1000, proving CGI can create photorealistic characters.',
            type: 'technology', importance: 'major',
            effects: { technology_available: 'advanced_cgi' },
            modal: {
                title: '🤖 "Terminator 2" CGI Breakthrough - July 1991',
                content: `
                    <div class="historical-event">
                        <p><strong>The liquid-metal T-1000 proves that CGI can create photorealistic characters.</strong></p>
                        <p>James Cameron's "Terminator 2: Judgment Day" stuns audiences with Industrial Light & Magic's liquid-metal T-1000 — a shape-shifting assassin rendered entirely in CGI. For the first time, a computer-generated character is completely convincing on screen. The technology that was a novelty in "Tron" is now a weapon that can create the impossible.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>CGI proven capable of creating photorealistic characters</li>
                            <li>Digital effects become a primary selling point for blockbusters</li>
                            <li>Practical effects artists begin transitioning to digital</li>
                            <li>VFX budgets begin their inexorable climb upward</li>
                        </ul>
                        <p><strong>Effect:</strong> Advanced CGI technology now available for your productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'T-1000 LIQUID METAL - CGI FUTURE IS NOW'
        },
        {
            year: 1993, month: 6, id: 'jurassic_park_cgi_revolution',
            title: '"Jurassic Park" — CGI Replaces Practical Effects',
            description: 'Spielberg\'s photorealistic dinosaurs convince the industry that CGI will replace models and miniatures.',
            type: 'technology', importance: 'critical',
            effects: { technology_available: 'cgi_standard' },
            modal: {
                title: '🦖 "Jurassic Park" — CGI Replaces Practical Effects - June 1993',
                content: `
                    <div class="historical-event">
                        <p><strong>Spielberg's photorealistic dinosaurs make stop-motion and animatronics obsolete overnight.</strong></p>
                        <p>When Steven Spielberg and his team at ILM render a herd of galloping Gallimimus in full daylight, the film industry crosses a point of no return. Phil Tippett, the stop-motion master originally hired for the dinosaurs, watches the CGI test footage and reportedly says: "I think I'm extinct." He's not wrong. Practical effects will never dominate again.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>CGI becomes the industry standard for visual effects</li>
                            <li>Practical effects (models, miniatures, stop-motion) begin their decline</li>
                            <li>Any creature, environment, or spectacle can now be digitally created</li>
                            <li>VFX-heavy films become the dominant blockbuster format</li>
                        </ul>
                        <p><strong>Effect:</strong> Standard CGI technology now available. Digital effects become the default for major productions.</p>
                    </div>
                `
            },
            newspaperHeadline: 'JURASSIC PARK CGI STUNS WORLD - PRACTICAL EFFECTS EXTINCT'
        },
        {
            year: 1994, month: 1, id: 'indie_golden_age',
            title: 'Independent Film Golden Age Begins',
            description: '"Pulp Fiction" proves indie films can break out. Studios launch specialty divisions. Sundance becomes Hollywood\'s farm system.',
            type: 'industry', importance: 'major',
            effects: { distribution_strategy: 'indie_division' },
            modal: {
                title: '🎥 Independent Film Golden Age - January 1994',
                content: `
                    <div class="historical-event">
                        <p><strong>Quentin Tarantino's "Pulp Fiction" proves that indie cinema can break out — way out.</strong></p>
                        <p>Made for $8 million, "Pulp Fiction" grosses $213 million worldwide and wins the Palme d'Or at Cannes. The film's success, along with the rise of the Sundance Film Festival, convinces every major studio to launch a specialty/indie division: Fox Searchlight, Focus Features, Sony Classics, Paramount Vantage. Independent film is no longer a niche — it's Hollywood's farm system.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Major studios launch indie/specialty divisions</li>
                            <li>Sundance becomes Hollywood's premier talent pipeline</li>
                            <li>Low-budget films with distinctive voices find wide audiences</li>
                            <li>A new generation of auteurs emerges outside the studio system</li>
                        </ul>
                        <p><strong>Effect:</strong> Indie distribution division strategy unlocked. Smaller, distinctive films can now reach wide audiences.</p>
                    </div>
                `
            },
            newspaperHeadline: 'PULP FICTION IGNITES INDIE REVOLUTION'
        },
        {
            year: 1995, month: 11, id: 'toy_story_all_cgi',
            title: '"Toy Story" — First Fully CGI Feature Film',
            description: 'Pixar\'s "Toy Story" proves entire features can be computer-generated. Traditional animation begins its decline.',
            type: 'technology', importance: 'critical',
            effects: { technology_available: 'full_cgi_animation' },
            modal: {
                title: '🧸 "Toy Story" — First Fully CGI Feature - November 1995',
                content: `
                    <div class="historical-event">
                        <p><strong>Pixar proves that an entire feature film can be computer-generated — and it can have a heart.</strong></p>
                        <p>Pixar Animation Studios, led by John Lasseter and backed by Steve Jobs, releases "Toy Story" — the first feature film made entirely with computer-generated imagery. The film grosses $373 million worldwide and earns rave reviews. Traditional hand-drawn animation, which has defined the art form since Walt Disney's "Snow White," begins its slow decline. The future of animation is digital.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>First fully computer-animated feature film</li>
                            <li>Pixar established as a major creative force</li>
                            <li>Traditional hand-drawn animation begins its decline</li>
                            <li>CGI animation becomes commercially viable for features</li>
                        </ul>
                        <p><strong>Effect:</strong> Full CGI animation technology now available. Animated features enter the digital age.</p>
                    </div>
                `
            },
            newspaperHeadline: 'TOY STORY - FIRST ALL-CGI FILM MAKES HISTORY'
        },

        // --- DIGITAL DAWN ---
        {
            year: 1997, month: 3, id: 'dvd_format_launches',
            title: 'DVD Format Launches',
            description: 'DVD arrives with superior quality and bonus features. Consumers begin replacing VHS libraries.',
            type: 'technology', importance: 'major',
            effects: { revenue_stream: 'dvd' },
            modal: {
                title: '💿 DVD Format Launches - March 1997',
                content: `
                    <div class="historical-event">
                        <p><strong>A shiny disc promises to replace VHS — and deliver even bigger profits.</strong></p>
                        <p>The DVD (Digital Versatile Disc) arrives with dramatically superior picture and sound quality, bonus features, director's commentaries, and chapter selection. Consumers who built VHS libraries are now motivated to repurchase their entire collections on DVD. For studios, this is nothing short of a second gold rush — they can sell the same films to the same customers all over again.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Superior quality drives consumers to replace VHS collections</li>
                            <li>Bonus features and special editions create premium pricing</li>
                            <li>Catalog titles generate massive new revenue</li>
                            <li>DVD revenue will soon dwarf all other income streams</li>
                        </ul>
                        <p><strong>Effect:</strong> DVD revenue stream unlocked. A lucrative new home video format arrives.</p>
                    </div>
                `
            },
            newspaperHeadline: 'DVD FORMAT LAUNCHES - VHS REPLACEMENT BEGINS'
        },
        {
            year: 1997, month: 12, id: 'titanic_phenomenon',
            title: '"Titanic" Becomes Highest-Grossing Film Ever',
            description: 'Cameron\'s $200M "Titanic" grosses $1.8 billion worldwide, proving mega-budgets can yield mega-returns.',
            type: 'landmark', importance: 'critical',
            effects: { budget_ceiling_raised: true },
            modal: {
                title: '🚢 "Titanic" — The Unsinkable Blockbuster - December 1997',
                content: `
                    <div class="historical-event">
                        <p><strong>James Cameron's $200 million gamble becomes the highest-grossing film in history.</strong></p>
                        <p>The press called it "Cameron's Folly." The budget ballooned to $200 million — the most expensive film ever made. Paramount was so nervous they split the cost with Fox. Then "Titanic" opens and simply refuses to stop making money. It grosses $1.84 billion worldwide, wins 11 Academy Awards (tying "Ben-Hur"), and proves that mega-budgets, in the right hands, can yield mega-returns.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>$200 million budgets become thinkable for potential mega-hits</li>
                            <li>Global box office (not just domestic) drives financial calculations</li>
                            <li>Repeat viewership — audiences seeing a film 5, 10, 15 times — powers record runs</li>
                            <li>Co-financing between studios becomes a risk-management strategy</li>
                        </ul>
                        <p><strong>Effect:</strong> Budget ceiling raised. Studios now willing to invest massive budgets for potential global blockbusters.</p>
                    </div>
                `
            },
            newspaperHeadline: 'TITANIC UNSINKABLE - $1.8 BILLION AND COUNTING'
        },
        {
            year: 1999, month: 7, id: 'blair_witch_viral_marketing',
            title: '"Blair Witch Project" Proves Internet Marketing',
            description: 'Made for $60,000, "Blair Witch" grosses $248 million using viral internet marketing.',
            type: 'landmark', importance: 'moderate',
            effects: { marketing_strategy: 'viral_internet' },
            modal: {
                title: '📹 "Blair Witch" Proves Internet Marketing - July 1999',
                content: `
                    <div class="historical-event">
                        <p><strong>A $60,000 horror film grosses $248 million — powered by a website.</strong></p>
                        <p>Daniel Myrick and Eduardo Sanchez's "The Blair Witch Project" uses a brilliant internet marketing campaign to convince audiences the footage is real. The film's website, featuring fake police reports and missing-person posters, goes viral months before release. Made for just $60,000, the film grosses $248 million worldwide — a return on investment that Hollywood has never seen. The internet has arrived as a marketing force.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>Internet viral marketing proven as a powerful tool</li>
                            <li>Found-footage horror established as a viable format</li>
                            <li>Ultra-low-budget films can achieve blockbuster returns</li>
                            <li>Online buzz becomes a measurable predictor of success</li>
                        </ul>
                        <p><strong>Effect:</strong> Viral internet marketing strategy unlocked. Online buzz can now amplify a film's reach exponentially.</p>
                    </div>
                `
            },
            newspaperHeadline: 'BLAIR WITCH - $60,000 FILM EARNS $248 MILLION'
        },
        {
            year: 2001, month: 9, id: 'september_11_attacks',
            title: 'September 11 Terrorist Attacks',
            description: 'The 9/11 attacks devastate America. Films with terrorism or urban destruction are delayed. Audiences seek escapism.',
            type: 'political', importance: 'critical',
            effects: { box_office_modifier: -0.1, genre_boost: { action: -0.2 } },
            modal: {
                title: '🇺🇸 September 11 Terrorist Attacks - September 2001',
                content: `
                    <div class="historical-event">
                        <p><strong>America is attacked. Everything changes — including Hollywood.</strong></p>
                        <p>On September 11, 2001, terrorist attacks destroy the World Trade Center and damage the Pentagon, killing nearly 3,000 people. The nation is plunged into grief, fear, and anger. Hollywood responds immediately: films featuring terrorism, urban destruction, or tall buildings under threat are delayed or shelved. Trailers are re-edited. Release dates shift. Audiences, seeking comfort and escape, turn away from dark or violent content.</p>
                        <h3>Impact on Hollywood:</h3>
                        <ul>
                            <li>Films depicting terrorism or urban destruction delayed or canceled</li>
                            <li>Action genre temporarily suppressed — audiences avoid destruction spectacle</li>
                            <li>Escapist and patriotic content finds strong demand</li>
                            <li>The industry enters a period of uncertain self-censorship</li>
                        </ul>
                        <p><strong>Effect:</strong> Box office reduced 10%. Action genre takes a 20% hit as audiences reject destruction-driven entertainment.</p>
                    </div>
                `
            },
            newspaperHeadline: 'AMERICA ATTACKED - HOLLYWOOD IN SHOCK'
        },
        {
            year: 2001, month: 12, id: 'lord_of_the_rings_trilogy',
            title: '"Lord of the Rings" Redefines Franchise Filmmaking',
            description: 'Peter Jackson\'s gamble to shoot three films simultaneously pays off. The trilogy grosses $2.9 billion total.',
            type: 'landmark', importance: 'major',
            effects: { franchise_model: 'trilogy' },
            modal: {
                title: '💍 "Lord of the Rings" Redefines Franchise Filmmaking - December 2001',
                content: `
                    <div class="historical-event">
                        <p><strong>Peter Jackson's audacious gamble — shooting three epic films simultaneously — pays off spectacularly.</strong></p>
                        <p>New Line Cinema bets the entire company on an untested New Zealand director's plan to adapt J.R.R. Tolkien's trilogy by filming all three installments back-to-back-to-back. "The Fellowship of the Ring" opens to massive acclaim and box office. The trilogy will ultimately gross $2.9 billion worldwide and win 17 Academy Awards. The "shoot multiple sequels simultaneously" model becomes the new template for franchise filmmaking.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Simultaneous trilogy production proven as a viable strategy</li>
                            <li>Literary IP (intellectual property) becomes Hollywood's most prized asset</li>
                            <li>CGI enables fantasy worlds impossible with practical effects</li>
                            <li>Extended editions on DVD create additional revenue from the same content</li>
                        </ul>
                        <p><strong>Effect:</strong> Trilogy franchise model unlocked. Multi-film production strategies become viable.</p>
                    </div>
                `
            },
            newspaperHeadline: 'LORD OF THE RINGS - TRILOGY GAMBLE PAYS $2.9 BILLION'
        },
        {
            year: 2004, month: 6, id: 'dvd_revenue_peak',
            title: 'DVD Revenue Reaches All-Time Peak',
            description: 'DVD sales hit $21.2 billion — more than double theatrical revenue. Studios dangerously dependent on the format.',
            type: 'industry', importance: 'major',
            effects: { revenue_stream: 'dvd_peak' },
            modal: {
                title: '💿 DVD Revenue Reaches All-Time Peak - 2004',
                content: `
                    <div class="historical-event">
                        <p><strong>DVD sales hit $21.2 billion — more than double theatrical revenue. Studios have never had it so good.</strong></p>
                        <p>The DVD boom has reached its zenith. Studios are swimming in profits from new releases, special editions, box sets, and catalog titles. DVD revenue is now the financial engine that greenlights films, subsidizes flops, and funds development slates. But this golden age carries a hidden danger: studios have become dangerously dependent on a single physical format. When DVD declines — and it will — the shock will be seismic.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>DVD revenue peaks at $21.2 billion annually</li>
                            <li>Home video generates more than double theatrical box office</li>
                            <li>Studios increasingly dependent on DVD for profitability</li>
                            <li>Warning signs: digital piracy and broadband internet are growing</li>
                        </ul>
                        <p><strong>Effect:</strong> DVD revenue at peak. Enjoy it while it lasts — disruption is coming.</p>
                    </div>
                `
            },
            newspaperHeadline: 'DVD SALES HIT $21 BILLION - STUDIOS SWIMMING IN GOLD'
        },

        // --- CONVERGENCE ERA ---
        {
            year: 2005, month: 6, id: 'youtube_founded',
            title: 'YouTube Launches',
            description: 'Video-sharing platform YouTube goes live. Short-form content and user-generated video will reshape audience habits.',
            type: 'technology', importance: 'major',
            effects: { audience_fragmentation: true },
            modal: {
                title: '▶️ YouTube Launches - June 2005',
                content: `
                    <div class="historical-event">
                        <p><strong>A video-sharing website will reshape how the world consumes visual entertainment.</strong></p>
                        <p>Three former PayPal employees launch YouTube, a platform where anyone can upload and share video content. Within a year, it will serve 100 million video views per day. While it begins with cat videos and home movies, YouTube represents something far more disruptive: the democratization of moving images. Audiences — especially young ones — are developing new viewing habits that don't include movie theaters or scheduled television.</p>
                        <h3>Impact:</h3>
                        <ul>
                            <li>User-generated video competes for audience attention</li>
                            <li>Short-form content reshapes viewing habits</li>
                            <li>Film trailers and marketing clips go viral on the platform</li>
                            <li>Audience fragmentation accelerates — attention is the new currency</li>
                        </ul>
                        <p><strong>Effect:</strong> Audience fragmentation increases. Capturing viewer attention becomes harder as content options multiply.</p>
                    </div>
                `
            },
            newspaperHeadline: 'YOUTUBE LAUNCHES - VIDEO GOES VIRAL'
        },
        {
            year: 2007, month: 1, id: 'netflix_streaming_launches',
            title: 'Netflix Launches Streaming Service',
            description: 'Netflix introduces streaming alongside DVD-by-mail. The convenience of instant streaming will eventually devour physical media.',
            type: 'technology', importance: 'critical',
            effects: { revenue_stream: 'streaming_begins', dvd_decline: true },
            modal: {
                title: '📡 Netflix Launches Streaming - January 2007',
                content: `
                    <div class="historical-event">
                        <p><strong>The red envelope gives way to the red play button — and physical media begins its death spiral.</strong></p>
                        <p>Netflix, the DVD-by-mail company, introduces a streaming service that allows subscribers to watch films and TV shows instantly on their computers. The initial library is small and the quality is mediocre, but the convenience is irresistible. Why drive to Blockbuster when you can click "play"? DVD sales, which peaked at $21 billion just three years ago, begin a decline from which they will never recover.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Streaming introduces instant, on-demand film viewing</li>
                            <li>DVD sales begin their irreversible decline</li>
                            <li>Physical media (DVD, Blu-ray) loses its dominance</li>
                            <li>Studios must adapt to a world where ownership gives way to access</li>
                        </ul>
                        <p><strong>Effect:</strong> Streaming revenue stream begins. DVD revenue enters decline. The distribution landscape is transforming.</p>
                    </div>
                `
            },
            newspaperHeadline: 'NETFLIX STREAMING ARRIVES - PHYSICAL MEDIA DOOMED?'
        },
        {
            year: 2008, month: 7, id: 'dark_knight_billion',
            title: '"The Dark Knight" Crosses $1 Billion',
            description: 'Nolan\'s "Dark Knight" proves superhero films can be prestige events. The billion-dollar club becomes the new benchmark.',
            type: 'landmark', importance: 'major',
            effects: { genre_boost: { superhero: 0.3 } },
            modal: {
                title: '🦇 "The Dark Knight" Crosses $1 Billion - July 2008',
                content: `
                    <div class="historical-event">
                        <p><strong>Christopher Nolan proves that superhero films can be prestige cinema — and billion-dollar earners.</strong></p>
                        <p>Heath Ledger's posthumous performance as the Joker elevates "The Dark Knight" from comic book movie to cultural event. Nolan's gritty, grounded approach proves that superhero films need not be campy or juvenile — they can be serious, thematically rich, and critically acclaimed while still grossing over $1 billion worldwide. The billion-dollar club becomes the new benchmark for tentpole success.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>Superhero films established as prestige events</li>
                            <li>$1 billion worldwide becomes the new success benchmark</li>
                            <li>Dark, grounded takes on comic book properties gain credibility</li>
                            <li>Superhero genre begins its ascent to total industry dominance</li>
                        </ul>
                        <p><strong>Effect:</strong> Superhero genre receives a 30% box office boost. The age of the superhero tentpole accelerates.</p>
                    </div>
                `
            },
            newspaperHeadline: 'DARK KNIGHT JOINS BILLION DOLLAR CLUB'
        },
        {
            year: 2009, month: 12, id: 'avatar_3d_revolution',
            title: '"Avatar" Launches 3D Revolution',
            description: 'Cameron\'s "Avatar" grosses $2.8 billion worldwide driven by the 3D premium. Studios rush to convert films to 3D.',
            type: 'landmark', importance: 'critical',
            effects: { technology_available: '3d_premium' },
            modal: {
                title: '🌍 "Avatar" Launches the 3D Revolution - December 2009',
                content: `
                    <div class="historical-event">
                        <p><strong>James Cameron does it again — "Avatar" grosses $2.8 billion and makes 3D the future of cinema.</strong></p>
                        <p>Twelve years after "Titanic," Cameron returns with "Avatar," a science fiction epic filmed with revolutionary 3D camera technology. The film's immersive 3D experience drives audiences to pay premium ticket prices, pushing the worldwide gross to $2.8 billion — shattering every record. Studios rush to convert films to 3D (often poorly), chasing the premium pricing. For better or worse, 3D becomes the industry's latest obsession.</p>
                        <h3>Key Changes:</h3>
                        <ul>
                            <li>3D premium ticket pricing becomes a major revenue driver</li>
                            <li>Studios rush to convert films to 3D in post-production</li>
                            <li>Motion capture technology reaches new heights of sophistication</li>
                            <li>$2.8 billion worldwide sets a record that will stand for over a decade</li>
                        </ul>
                        <p><strong>Effect:</strong> 3D premium technology available. Films can now command higher ticket prices with 3D presentation.</p>
                    </div>
                `
            },
            newspaperHeadline: 'AVATAR SHATTERS RECORDS - $2.8 BILLION WORLDWIDE'
        },
        {
            year: 2010, month: 12, id: 'game_end',
            title: 'The Digital Age',
            description: 'From the golden age of the studio system to the digital revolution — your Hollywood journey spans nearly eight decades of cinematic history.',
            type: 'milestone', importance: 'critical',
            effects: { game_complete: true },
            modal: {
                title: '🎬 The End of an Era - 2010',
                content: `
                    <div class="historical-event">
                        <p><strong>You have survived 77 years in Hollywood — from the Golden Age to the Digital Revolution.</strong></p>
                        <h3>Eras You Navigated:</h3>
                        <ul>
                            <li>The Pre-Code era and Hays Code enforcement</li>
                            <li>The Golden Age studio system</li>
                            <li>World War II and Hollywood's war effort</li>
                            <li>Television's devastating competition</li>
                            <li>The New Hollywood auteur revolution</li>
                            <li>The blockbuster age of Jaws and Star Wars</li>
                            <li>The VHS and DVD home video booms</li>
                            <li>The CGI revolution and digital filmmaking</li>
                            <li>The rise of streaming and franchise dominance</li>
                        </ul>
                        <p><em>Your final statistics and studio legacy will determine your ending...</em></p>
                    </div>
                `
            },
            newspaperHeadline: 'HOLLYWOOD 2010: STREAMING, SUPERHEROES, AND THE FUTURE'
        }
    ];

    /**
     * Check if a historical event should trigger
     */
    function checkForEvents(gameState) {
        const currentYear = gameState.gameYear;
        const currentMonth = gameState.currentDate.getMonth() + 1;

        // Find all events for current year/month that haven't triggered
        const eligibleEvents = HISTORICAL_EVENTS.filter(event => {
            return event.year === currentYear &&
                   event.month === currentMonth &&
                   !triggeredEvents.has(event.id);
        });

        // Trigger all eligible events
        const triggeredThisMonth = [];
        eligibleEvents.forEach(event => {
            triggeredEvents.add(event.id);
            triggerEvent(event, gameState);
            triggeredThisMonth.push(event);
        });

        return triggeredThisMonth.length > 0 ? triggeredThisMonth : null;
    }

    /**
     * Trigger a historical event
     */
    function triggerEvent(event, gameState) {
        // Apply event effects to game state
        applyEventEffects(event, gameState);

        // Show modal if present
        if (event.modal) {
            showEventModal(event);
        }

        // Add alert
        window.HollywoodMogul.addAlert({
            type: event.type === 'censorship' || event.type === 'political' ? 'warning' : 'info',
            icon: getEventIcon(event.type),
            message: event.title,
            priority: event.importance === 'major' ? 'high' : 'normal'
        });

        // Record in game state
        if (!gameState.historicalEvents) {
            gameState.historicalEvents = [];
        }
        gameState.historicalEvents.push({
            id: event.id,
            year: event.year,
            month: event.month,
            title: event.title
        });

        return event;
    }

    /**
     * Apply event effects to game state
     */
    function applyEventEffects(event, gameState) {
        const effects = event.effects || {};

        // Censorship effects
        if (effects.censorship_active !== undefined) {
            gameState.censorshipActive = effects.censorship_active;
        }

        // War effects
        if (effects.war_active !== undefined) {
            gameState.warActive = effects.war_active;
        }

        if (effects.actor_draft_risk !== undefined) {
            gameState.actorDraftRisk = effects.actor_draft_risk;
        }

        // HUAC effects
        if (effects.huac_active !== undefined) {
            gameState.huacActive = effects.huac_active;
        }

        if (effects.political_risk !== undefined) {
            gameState.politicalRisk = (gameState.politicalRisk || 0) + effects.political_risk;
        }

        if (effects.blacklist_begins !== undefined) {
            gameState.blacklistActive = effects.blacklist_begins;
        }

        // Business effects
        if (effects.vertical_integration_ends !== undefined) {
            gameState.verticalIntegration = !effects.vertical_integration_ends;
        }

        if (effects.box_office_uncertainty !== undefined) {
            gameState.boxOfficeVariance = (gameState.boxOfficeVariance || 0) + effects.box_office_uncertainty;
        }

        // Industry effects
        if (effects.audience_expectations !== undefined) {
            gameState.audienceExpectations = (gameState.audienceExpectations || 50) + effects.audience_expectations;
        }

        // Game completion
        if (effects.game_complete !== undefined) {
            gameState.gameComplete = effects.game_complete;
        }
    }

    /**
     * Show event modal
     */
    function showEventModal(event) {
        const modal = event.modal;

        window.HollywoodMogul.showModal(`
            <div class="historical-event-modal">
                <h2>${modal.title}</h2>
                ${modal.content}
                <div class="modal-actions">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn primary">
                        CONTINUE
                    </button>
                </div>
            </div>
        `);
    }

    /**
     * Get icon for event type
     */
    function getEventIcon(type) {
        const icons = {
            milestone: '🎬',
            censorship: '⚖️',
            industry: '🎞️',
            war: '🎖️',
            political: '⚠️',
            business: '💼',
            cultural: '🎭'
        };
        return icons[type] || '📰';
    }

    /**
     * Get all triggered events (returns full event objects with title, year, etc.)
     */
    function getTriggeredEvents() {
        return Array.from(triggeredEvents).map(eventId => {
            return getEventById(eventId);
        }).filter(event => event !== null);
    }

    /**
     * Reset triggered events (for new game)
     */
    function reset() {
        triggeredEvents.clear();
    }

    /**
     * Get event by ID
     */
    function getEventById(id) {
        return HISTORICAL_EVENTS.find(event => event.id === id) || null;
    }

    /**
     * Get all events for a specific year
     */
    function getEventsForYear(year) {
        return HISTORICAL_EVENTS.filter(event => event.year === year);
    }

    // Public API
    return {
        checkForEvents,
        triggerEvent,
        getTriggeredEvents,
        getEventById,
        getEventsForYear,
        reset,
        HISTORICAL_EVENTS
    };
})();
