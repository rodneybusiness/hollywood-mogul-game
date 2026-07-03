/**
 * HOLLYWOOD MOGUL - TALENT ROSTER DATABASE
 * Historically accurate actors and directors from 1933-2010
 * Includes star power ratings, costs, and availability windows
 *
 * MASSIVELY EXPANDED EDITION
 * 110+ Actors | 55+ Directors | Rich Biographical Data | 78 Years of Coverage
 */

window.TalentRoster = (function() {
    'use strict';

    /**
     * ============================================================================
     * ACTOR DATABASE - 75+ STARS FROM THE GOLDEN AGE
     * ============================================================================
     */
    const ACTORS = {

        // ========================================================================
        // A-LIST STARS (Star Ashford: 85-99) - The Icons
        // ========================================================================

        clark_gable: {
            id: 'vincent_ashcroft',
            name: 'Vincent Ashcroft',
            gender: 'male',
            starPower: 95,
            weeklyRate: 5000,
            genres: ['drama', 'romance', 'adventure', 'comedy'],
            specialties: ['rugged charm', 'masculine confidence', 'roguish appeal'],
            typeCast: 'Charming rogue with a heart of gold',
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1944 (Air Force)
            oscarWinner: true, // It Happened One Night (1934)
            oscarPotential: 25,
            scandalRisk: 12,
            chemistry: 85,
            pairings: ['queenie_dellamore', 'lillian_norwood', 'claudette_colbert'],
            rivalries: ['chester_jessup'],
            quirks: ['demands top billing', 'notorious ladies man', 'heavy drinker'],
            description: 'The King of Hollywood. Ashcroft\'s rugged masculinity and roguish charm made him the biggest male star of the era. His chemistry with leading ladies is legendary, and his box office power is unmatched.'
        },

        bette_davis: {
            id: 'vivian_barrington',
            name: 'Vivian Barrington',
            gender: 'female',
            starPower: 92,
            weeklyRate: 4500,
            genres: ['drama', 'melodrama', 'thriller', 'noir'],
            specialties: ['intensity', 'dramatic range', 'fierce independence'],
            typeCast: 'Strong-willed women who defy convention',
            availableFrom: 1933,
            availableTo: 1962, // Career extended through Baby Jane era
            oscarWinner: true, // Dangerous (1935), Jezebel (1938)
            oscarPotential: 35,
            scandalRisk: 18,
            chemistry: 78,
            pairings: ['paul_henreid', 'george_brent'],
            rivalries: ['constance_ingersoll', 'miriam_hopkins'],
            quirks: ['fights with studio bosses', 'demands script approval', 'temperamental on set'],
            description: 'First lady of the American screen. Barrington\'s fierce intelligence and emotional intensity revolutionized acting for women. Notorious for battling Jack Warner and refusing roles beneath her dignity.'
        },

        humphrey_bogart: {
            id: 'harold_caldwell',
            name: 'Harold Caldwell',
            gender: 'male',
            starPower: 92,
            weeklyRate: 4800,
            genres: ['noir', 'crime', 'drama', 'war', 'thriller'],
            specialties: ['world-weary cynicism', 'moral complexity', 'tough vulnerability'],
            typeCast: 'Cynical antihero with hidden nobility',
            availableFrom: 1936,
            availableTo: 1957, // Died January 1957
            oscarPotential: 22,
            scandalRisk: 10,
            chemistry: 90,
            pairings: ['estelle_yardley', 'sylvia_underhill', 'dorothea_devereaux'],
            rivalries: ['george_raft'],
            quirks: ['heavy drinker', 'liberal politics', 'chess enthusiast'],
            description: 'The quintessential tough guy with a soul. Caldwell perfected the world-weary antihero, bringing moral complexity to gangsters, detectives, and soldiers. His raspy voice and lived-in face made him uniquely credible.'
        },

        katharine_hepburn: {
            id: 'dorothea_devereaux',
            name: 'Dorothea Devereaux',
            gender: 'female',
            starPower: 90,
            weeklyRate: 4500,
            genres: ['comedy', 'drama', 'romance'],
            specialties: ['aristocratic bearing', 'sharp wit', 'physical comedy'],
            typeCast: 'Independent, sophisticated women',
            availableFrom: 1933,
            availableTo: 1981, // On Golden Pond (1981) was final great role
            oscarWinner: true, // Morning Glory (1933)
            oscarPotential: 35,
            scandalRisk: 20,
            chemistry: 82,
            pairings: ['raymond_ellsworth', 'chester_jessup'],
            rivalries: ['rosalind_sinclair'],
            quirks: ['wears pants', 'refuses publicity', 'aloof with press'],
            description: 'Fiercely independent spirit who redefined leading ladies. Newhall\'s aristocratic bearing and razor-sharp intelligence made her box office poison in the mid-30s, but she roared back stronger than ever.'
        },

        cary_grant: {
            id: 'raymond_ellsworth',
            name: 'Raymond Ellsworth',
            gender: 'male',
            starPower: 94,
            weeklyRate: 4700,
            genres: ['comedy', 'romance', 'thriller', 'adventure'],
            specialties: ['sophisticated charm', 'comic timing', 'physical grace'],
            typeCast: 'Debonair gentleman with hidden mischief',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 8,
            chemistry: 96,
            pairings: ['dorothea_devereaux', 'irene_dunne', 'portia_birchall'],
            rivalries: [],
            quirks: ['perfectionist', 'demands retakes', 'controls own contracts'],
            description: 'The most sophisticated leading man in Hollywood. Grant\'s unique blend of elegance and mischief made him perfect for both screwball comedies and Carmichael thrillers. His timing is impeccable.'
        },

        james_stewart: {
            id: 'walter_fairweather',
            name: 'Walter Fairweather',
            gender: 'male',
            starPower: 88,
            weeklyRate: 4000,
            genres: ['drama', 'western', 'comedy', 'thriller'],
            specialties: ['everyman appeal', 'moral integrity', 'aw-shucks charm'],
            typeCast: 'Idealistic American hero',
            availableFrom: 1935,
            availableTo: 1968, // Last major films in late 1960s
            draftRisk: true, // Served 1941-1945 (bomber pilot)
            oscarWinner: true, // The Philadelphia Story (1940)
            oscarPotential: 30,
            scandalRisk: 2,
            chemistry: 88,
            pairings: ['opal_applewhite', 'margaret_sullavan', 'donna_reed'],
            rivalries: [],
            quirks: ['genuine war hero', 'shy off-screen', 'stammering style'],
            description: 'The most beloved everyman in Hollywood. Stewart\'s aw-shucks sincerity and stammering delivery made him the perfect embodiment of American values. His WWII service only enhanced his heroic image.'
        },

        barbara_stanwyck: {
            id: 'evelyn_galloway',
            name: 'Evelyn Galloway',
            gender: 'female',
            starPower: 87,
            weeklyRate: 3800,
            genres: ['noir', 'western', 'drama', 'comedy', 'melodrama'],
            specialties: ['versatility', 'working-class grit', 'emotional authenticity'],
            typeCast: 'Strong women who fight for survival',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 25,
            scandalRisk: 6,
            chemistry: 85,
            pairings: ['fred_macmurray', 'leonard_redmond', 'joel_mccrea'],
            rivalries: [],
            quirks: ['total professional', 'one-take wonder', 'beloved by crews'],
            description: 'The most versatile actress in Hollywood. Galloway could play anything from screwball comedy to film noir to westerns with equal conviction. Directors loved her professionalism and emotional honesty.'
        },

        gary_cooper: {
            id: 'eugene_hartline',
            name: 'Eugene Hartline',
            gender: 'male',
            starPower: 91,
            weeklyRate: 4500,
            genres: ['western', 'drama', 'war', 'adventure'],
            specialties: ['quiet strength', 'moral authority', 'natural authenticity'],
            typeCast: 'Strong silent hero',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Sergeant York (1941)
            oscarPotential: 28,
            scandalRisk: 14,
            chemistry: 82,
            pairings: ['ursula_mayfield', 'sylvia_underhill', 'claudette_colbert'],
            rivalries: [],
            quirks: ['notoriously late', 'ladies man', 'mumbles dialogue'],
            description: 'The strong silent type incarnate. Hartline\'s natural authenticity and quiet moral authority made him the perfect American hero. His underplaying was revolutionary in an era of theatrical acting.'
        },

        joan_crawford: {
            id: 'constance_ingersoll',
            name: 'Constance Ingersoll',
            gender: 'female',
            starPower: 89,
            weeklyRate: 4200,
            genres: ['drama', 'melodrama', 'noir', 'romance'],
            specialties: ['determination', 'glamour', 'working-class ambition'],
            typeCast: 'Ambitious women clawing their way up',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Mildred Pierce (1945)
            oscarPotential: 26,
            scandalRisk: 15,
            chemistry: 80,
            pairings: ['franchot_tone', 'john_garfield'],
            rivalries: ['vivian_barrington', 'norma_shearer'],
            quirks: ['perfectionist about appearance', 'control freak', 'studio politician'],
            description: 'The ultimate survivor and self-made star. Ingersoll\'s fierce ambition and glamorous image embodied the American dream. Her rivalry with Vivian Barrington became legendary Hollywood lore.'
        },

        spencer_tracy: {
            id: 'chester_jessup',
            name: 'Chester Jessup',
            gender: 'male',
            starPower: 90,
            weeklyRate: 4300,
            genres: ['drama', 'comedy', 'biography', 'adventure'],
            specialties: ['naturalistic acting', 'everyman dignity', 'emotional depth'],
            typeCast: 'Principled working-class heroes',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Captains Courageous (1937), Boys Town (1938)
            oscarPotential: 32,
            scandalRisk: 16,
            chemistry: 88,
            pairings: ['dorothea_devereaux', 'joan_bennett'],
            rivalries: ['vincent_ashcroft'],
            quirks: ['heavy drinker', 'affair with Newhall', 'insecure about acting'],
            description: 'The actor\'s actor. Jessup\'s naturalistic style revolutionized screen acting. His emotional depth and working-class dignity made him believable in everything from priests to fishermen to scientists.'
        },

        marlene_dietrich: {
            id: 'marjorie_kingsford',
            name: 'Marjorie Kingsford',
            gender: 'female',
            starPower: 88,
            weeklyRate: 4200,
            genres: ['drama', 'romance', 'musical', 'comedy'],
            specialties: ['exotic glamour', 'androgynous appeal', 'continental sophistication'],
            typeCast: 'Mysterious foreign seductress',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 15,
            scandalRisk: 22,
            chemistry: 85,
            pairings: ['eugene_hartline', 'bernard_draper'],
            rivalries: ['greta_garbo'],
            quirks: ['demands control of lighting', 'bisexual affairs', 'thick German accent'],
            description: 'The ultimate European sophisticate. Kingsford\'s androgynous beauty and exotic allure made her unique in Hollywood. Her thick accent and mysterious persona became her trademarks.'
        },

        errol_flynn: {
            id: 'howard_lockridge',
            name: 'Howard Lockridge',
            gender: 'male',
            starPower: 87,
            weeklyRate: 3900,
            genres: ['adventure', 'western', 'swashbuckler', 'war'],
            specialties: ['athletic prowess', 'roguish charm', 'swashbuckling action'],
            typeCast: 'Dashing adventurer and romantic hero',
            availableFrom: 1935,
            availableTo: 1949,
            draftRisk: false, // 4F due to health issues
            oscarPotential: 8,
            scandalRisk: 35, // Highest scandal risk!
            chemistry: 88,
            pairings: ['gloria_marlowe', 'maureen_ohara'],
            rivalries: ['ronald_reagan'],
            quirks: ['statutory rape trial 1942', 'heavy drinker', 'drug user', 'womanizer'],
            description: 'The ultimate swashbuckler whose off-screen life was as wild as his films. Lockridge\'s athletic grace and devil-may-care charm made him perfect for adventure films, but scandals and substance abuse plagued his career.'
        },

        olivia_de_havilland: {
            id: 'gloria_marlowe',
            name: 'Gloria Marlowe',
            gender: 'female',
            starPower: 86,
            weeklyRate: 3700,
            genres: ['drama', 'romance', 'adventure', 'historical'],
            specialties: ['sweet dignity', 'inner strength', 'period authenticity'],
            typeCast: 'Virtuous heroines with hidden steel',
            availableFrom: 1935,
            availableTo: 1949,
            oscarWinner: true, // To Each His Own (1946), The Heiress (1949)
            oscarPotential: 30,
            scandalRisk: 5,
            chemistry: 86,
            pairings: ['howard_lockridge', 'clyde_kirkwood'],
            rivalries: ['beatrice_quimby'], // Real-life sister rivalry!
            quirks: ['sued Warner Bros', 'bitter feud with sister', 'fighting typecasting'],
            description: 'Sweet-faced but steely actress who changed Hollywood. De Marlowe\'s lawsuit against Warner Bros. broke the studio contract system. Her bitter rivalry with sister Beatrice Quimby became Hollywood legend.'
        },

        vivien_leigh: {
            id: 'lillian_norwood',
            name: 'Lillian Norwood',
            gender: 'female',
            starPower: 90,
            weeklyRate: 4400,
            genres: ['drama', 'romance', 'historical'],
            specialties: ['ethereal beauty', 'emotional volatility', 'Southern belle perfection'],
            typeCast: 'Beautiful, complex Southern women',
            availableFrom: 1939,
            availableTo: 1949,
            oscarWinner: true, // Gone with the Wind (1939)
            oscarPotential: 35,
            scandalRisk: 18,
            chemistry: 84,
            pairings: ['vincent_ashcroft', 'laurence_olivier'],
            rivalries: [],
            quirks: ['mental health issues', 'affair with Olivier', 'British accent'],
            description: 'Exquisitely beautiful British actress who became Scarlett O\'Hara. Nightingale\'s stunning performance in Gone with the Wind made her a legend, though mental health struggles limited her Hollywood career.'
        },

        william_powell: {
            id: 'franklin_ogilvie',
            name: 'Franklin Ogilvie',
            gender: 'male',
            starPower: 86,
            weeklyRate: 3800,
            genres: ['comedy', 'mystery', 'romance', 'drama'],
            specialties: ['sophisticated wit', 'dapper elegance', 'comic chemistry'],
            typeCast: 'Sophisticated gentleman detective',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 20,
            scandalRisk: 4,
            chemistry: 92,
            pairings: ['frances_prescott', 'queenie_dellamore'],
            rivalries: [],
            quirks: ['health problems', 'widower of Eversleigh', 'meticulous preparation'],
            description: 'The epitome of sophisticated wit and dapper charm. Powell\'s partnership with Frances Prescott in The Thin Man series created cinema\'s most delightful married couple. His elegance and timing were unmatched.'
        },

        myrna_loy: {
            id: 'frances_prescott',
            name: 'Frances Prescott',
            gender: 'female',
            starPower: 85,
            weeklyRate: 3600,
            genres: ['comedy', 'mystery', 'romance', 'drama'],
            specialties: ['sophisticated banter', 'wife-next-door appeal', 'comedic partnership'],
            typeCast: 'The perfect wife - smart, sexy, sophisticated',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 6,
            chemistry: 92,
            pairings: ['franklin_ogilvie', 'raymond_ellsworth', 'vincent_ashcroft'],
            rivalries: [],
            quirks: ['political activist', 'anti-Nazi', 'multiple divorces'],
            description: 'The perfect wife of the American screen. Loy\'s sophisticated wit and natural charm made her the ideal partner for Franklin Ogilvie. She embodied the modern woman - smart, sexy, and self-assured.'
        },

        // ========================================================================
        // B-LIST STARS (Star Ashford: 70-84) - Rising and Established Stars
        // ========================================================================

        joan_fontaine: {
            id: 'beatrice_quimby',
            name: 'Beatrice Quimby',
            gender: 'female',
            starPower: 82,
            weeklyRate: 3200,
            genres: ['drama', 'thriller', 'romance', 'gothic'],
            specialties: ['vulnerable beauty', 'psychological depth', 'haunted heroines'],
            typeCast: 'Fragile women in peril',
            availableFrom: 1937,
            availableTo: 1949,
            oscarWinner: true, // Suspicion (1941)
            oscarPotential: 28,
            scandalRisk: 10,
            chemistry: 82,
            pairings: ['raymond_ellsworth', 'laurence_olivier'],
            rivalries: ['gloria_marlowe'], // Real-life sister rivalry!
            quirks: ['bitter feud with sister', 'four marriages', 'insecure'],
            description: 'Ethereal beauty perfect for Carmichael\'s vulnerable heroines. Quimby\'s delicate beauty and psychological depth made her ideal for Gothic thrillers. Her bitter rivalry with sister Olivia never healed.'
        },

        henry_fonda: {
            id: 'leonard_redmond',
            name: 'Leonard Redmond',
            gender: 'male',
            starPower: 84,
            weeklyRate: 3500,
            genres: ['drama', 'western', 'war', 'biography'],
            specialties: ['moral integrity', 'quiet intensity', 'American idealism'],
            typeCast: 'Men of principle and integrity',
            availableFrom: 1935,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1945 (Navy)
            oscarPotential: 22,
            scandalRisk: 8,
            chemistry: 83,
            pairings: ['evelyn_galloway', 'jane_darwell'],
            rivalries: [],
            quirks: ['liberal politics', 'perfectionist', 'distant father'],
            description: 'The face of American conscience and integrity. Redmond\'s quiet intensity and moral authority made him perfect for playing principled men standing against injustice, from Tom Joad to Young Mr. Lincoln.'
        },

        ginger_rogers: {
            id: 'rosalind_sinclair',
            name: 'Rosalind Sinclair',
            gender: 'female',
            starPower: 85,
            weeklyRate: 3600,
            genres: ['musical', 'comedy', 'drama', 'romance'],
            specialties: ['dancing', 'comedic timing', 'dramatic range'],
            typeCast: 'Girl next door who can dance',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Kitty Foyle (1940)
            oscarPotential: 20,
            scandalRisk: 7,
            chemistry: 94,
            pairings: ['martin_thornbury', 'raymond_ellsworth'],
            rivalries: ['dorothea_devereaux'],
            quirks: ['did everything Thornbury did backwards in heels', 'controlled by mother'],
            description: 'The most versatile musical star who proved she could act too. Sinclair did everything Thornbury did "backwards and in high heels," then won an Oscar for drama. Her range was extraordinary.'
        },

        fred_astaire: {
            id: 'martin_thornbury',
            name: 'Martin Thornbury',
            gender: 'male',
            starPower: 84,
            weeklyRate: 3500,
            genres: ['musical', 'comedy', 'romance'],
            specialties: ['dancing genius', 'elegant style', 'choreography innovation'],
            typeCast: 'Sophisticated dancer-romantic',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 3,
            chemistry: 94,
            pairings: ['rosalind_sinclair', 'irene_vandermeer', 'selma_harrington'],
            rivalries: ['ellis_goldenberg'],
            quirks: ['perfectionist', 'innovative choreographer', 'insecure about looks'],
            description: 'The most elegant dancer in film history. Thornbury\'s partnership with Rosalind Sinclair created the greatest musicals of the 1930s. His perfectionism and innovation revolutionized screen dancing.'
        },

        ingrid_bergman: {
            id: 'sylvia_underhill',
            name: 'Sylvia Underhill',
            gender: 'female',
            starPower: 88,
            weeklyRate: 4000,
            genres: ['drama', 'romance', 'thriller', 'noir'],
            specialties: ['luminous beauty', 'natural acting', 'European sophistication'],
            typeCast: 'Pure, noble heroines',
            availableFrom: 1939,
            availableTo: 1949,
            oscarWinner: true, // Gaslight (1944)
            oscarPotential: 32,
            scandalRisk: 10, // Scandal comes in 1950
            chemistry: 90,
            pairings: ['harold_caldwell', 'charles_boyer', 'eugene_hartline'],
            rivalries: [],
            quirks: ['refused makeup', 'natural beauty', 'Swedish accent'],
            description: 'Luminous Swedish beauty who embodied purity and nobility. Underhill\'s natural acting and radiant presence made her perfect for playing saints and martyrs. Her refusal to wear heavy makeup was revolutionary.'
        },

        rita_hayworth: {
            id: 'irene_vandermeer',
            name: 'Irene Vandermeer',
            gender: 'female',
            starPower: 83,
            weeklyRate: 3400,
            genres: ['noir', 'musical', 'romance', 'drama'],
            specialties: ['sultry glamour', 'dancing ability', 'sex symbol status'],
            typeCast: 'Glamorous femme fatale',
            availableFrom: 1937,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 16,
            chemistry: 86,
            pairings: ['martin_thornbury', 'lawrence_lindqvist', 'vincent_halloway'],
            rivalries: ['pauline_blackwood'],
            quirks: ['born Margarita Cansino', 'abusive father', 'love goddess image'],
            description: 'The ultimate love goddess of the 1940s. Vandermeer\'s sultry beauty and dancing ability made her a pin-up icon. Her Gilda performance created the definitive femme fatale, though she resented being just a sex symbol.'
        },

        gregory_peck: {
            id: 'russell_whitfield',
            name: 'Birchall Whitfield',
            gender: 'male',
            starPower: 80,
            weeklyRate: 3000,
            genres: ['drama', 'western', 'thriller', 'war'],
            specialties: ['moral authority', 'dignified presence', 'leading man gravitas'],
            typeCast: 'Principled heroes',
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 24,
            scandalRisk: 4,
            chemistry: 81,
            pairings: ['jennifer_jones', 'dorothy_mcguire'],
            rivalries: [],
            quirks: ['liberal activist', 'deep voice', 'tall and handsome'],
            description: 'Dignified newcomer with instant leading man authority. Peck\'s deep voice, handsome features, and moral gravitas made him an immediate star. He brought intelligence and integrity to every role.'
        },

        lauren_bacall: {
            id: 'estelle_yardley',
            name: 'Estelle Yardley',
            gender: 'female',
            starPower: 78,
            weeklyRate: 2800,
            genres: ['noir', 'thriller', 'drama', 'romance'],
            specialties: ['sultry voice', 'knowing sexuality', 'cool confidence'],
            typeCast: 'Sophisticated, knowing women',
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 8,
            chemistry: 95,
            pairings: ['harold_caldwell'],
            rivalries: [],
            quirks: ['married Caldwell', 'smoky voice', 'The Look'],
            description: 'Sultry newcomer who became Caldwell\'s perfect match. Yardley\'s husky voice, knowing sexuality, and cool confidence made her an instant icon. Her real-life romance with Caldwell added to her mystique.'
        },

        tyrone_power: {
            id: 'theodore_ashford',
            name: 'Theodore Ashford',
            gender: 'male',
            starPower: 86,
            weeklyRate: 3700,
            genres: ['adventure', 'romance', 'swashbuckler', 'drama'],
            specialties: ['matinee idol looks', 'athletic action', 'romantic appeal'],
            typeCast: 'Handsome romantic hero',
            availableFrom: 1936,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1945 (Marine pilot)
            oscarPotential: 10,
            scandalRisk: 12,
            chemistry: 87,
            pairings: ['pauline_blackwood', 'alice_faye', 'adelaide_oakhurst'],
            rivalries: ['howard_lockridge'],
            quirks: ['too handsome', 'wanted serious roles', 'war hero'],
            description: 'Impossibly handsome matinee idol who yearned for serious roles. Ashford\'s devastating good looks made him perfect for swashbucklers and romances, but he fought to prove his acting ability.'
        },

        gene_tierney: {
            id: 'pauline_blackwood',
            name: 'Pauline Blackwood',
            gender: 'female',
            starPower: 82,
            weeklyRate: 3300,
            genres: ['noir', 'drama', 'romance', 'thriller'],
            specialties: ['ethereal beauty', 'vulnerable sophistication', 'tragic heroines'],
            typeCast: 'Beautiful, mysterious women',
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 20,
            scandalRisk: 14,
            chemistry: 84,
            pairings: ['theodore_ashford', 'everett_jennings', 'rex_harrison'],
            rivalries: ['irene_vandermeer'],
            quirks: ['mental health struggles', 'tragic life', 'overbite'],
            description: 'Hauntingly beautiful actress with a tragic personal life. Blackwood\'s ethereal loveliness and wounded quality made her perfect for noir. Off-screen tragedies with her daughter haunted her life.'
        },

        veronica_lake: {
            id: 'harriet_carmichael',
            name: 'Harriet Carmichael',
            gender: 'female',
            starPower: 79,
            weeklyRate: 2900,
            genres: ['noir', 'thriller', 'comedy', 'drama'],
            specialties: ['peek-a-boo hair', 'sultry voice', 'diminutive glamour'],
            typeCast: 'Femme fatale with signature hairstyle',
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 28,
            chemistry: 88,
            pairings: ['barnaby_fairmont', 'joel_mccrea'],
            rivalries: ['constance_bennett'],
            quirks: ['peek-a-boo hair', 'alcoholic', 'difficult temperament', 'only 4\'11"'],
            description: 'Tiny blonde bombshell whose peek-a-boo hairstyle became a national craze. Lake\'s sultry voice and perfect chemistry with Barnaby Fairmont made her a noir icon, but alcoholism destroyed her career.'
        },

        john_wayne: {
            id: 'bernard_draper',
            name: 'Bernard Draper',
            gender: 'male',
            starPower: 76,
            weeklyRate: 2500,
            genres: ['western', 'war', 'adventure', 'drama'],
            specialties: ['masculine authority', 'western authenticity', 'American values'],
            typeCast: 'Rugged western hero',
            availableFrom: 1933,
            availableTo: 1976, // True Grit (1969), The Shootist (1976)
            draftRisk: false, // 4F, didn't serve (later controversial)
            oscarPotential: 12,
            scandalRisk: 10,
            chemistry: 78,
            pairings: ['maureen_ohara', 'marjorie_kingsford'],
            rivalries: [],
            quirks: ['born Marion Morrison', 'walked like a cowboy', 'conservative politics'],
            description: 'B-western star becoming an A-list icon. Wayne\'s breakthrough in Stagecoach (1939) made him the definitive western hero. His distinctive walk and masculine authority embodied American frontier values.'
        },

        robert_mitchum: {
            id: 'stanley_everhart',
            name: 'Stanley Everhart',
            gender: 'male',
            starPower: 77,
            weeklyRate: 2600,
            genres: ['noir', 'western', 'drama', 'war'],
            specialties: ['sleepy-eyed menace', 'laconic cool', 'dangerous sexuality'],
            typeCast: 'Dangerous men with hidden depths',
            availableFrom: 1943,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 32, // Marijuana arrest 1948!
            chemistry: 80,
            pairings: ['mabel_vance', 'blanche_pemberton'],
            rivalries: [],
            quirks: ['marijuana arrest', 'hobo past', 'lazy genius', 'heavy-lidded eyes'],
            description: 'Sleepy-eyed newcomer with dangerous sexuality. Everhart\'s laconic cool and coiled menace made him perfect for noir. His 1948 marijuana arrest scandal nearly ended his career but he survived.'
        },

        kirk_douglas: {
            id: 'roland_fontelle',
            name: 'Roland Fontelle',
            gender: 'male',
            starPower: 74,
            weeklyRate: 2300,
            genres: ['drama', 'western', 'noir', 'adventure'],
            specialties: ['intense energy', 'dimpled chin', 'ambitious characters'],
            typeCast: 'Driven, ambitious men',
            availableFrom: 1946,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 10,
            chemistry: 76,
            pairings: ['estelle_yardley', 'cordelia_granger'],
            rivalries: ['rudolph_loxley'],
            quirks: ['ferocious intensity', 'famous dimple', 'method acting'],
            description: 'Intense newcomer with ferocious energy. Lockridge\'s volcanic intensity and famous dimpled chin made him perfect for playing ambitious, driven men. His competitive nature fueled brilliant performances.'
        },

        lana_turner: {
            id: 'cordelia_granger',
            name: 'Cordelia Granger',
            gender: 'female',
            starPower: 81,
            weeklyRate: 3100,
            genres: ['drama', 'noir', 'romance', 'melodrama'],
            specialties: ['glamorous beauty', 'sweater girl', 'sultry presence'],
            typeCast: 'Beautiful women in trouble',
            availableFrom: 1937,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 24,
            chemistry: 82,
            pairings: ['vincent_ashcroft', 'john_garfield'],
            rivalries: ['henrietta_montrose'],
            quirks: ['discovered at drugstore', 'eight marriages', 'scandal magnet'],
            description: 'The ultimate Hollywood discovery and scandal queen. Granger was famously "discovered" at Schwab\'s drugstore. Her sultry beauty and tumultuous personal life kept her in headlines as much as her films.'
        },

        hedy_lamarr: {
            id: 'maxine_halloway',
            name: 'Maxine Halloway',
            gender: 'female',
            starPower: 80,
            weeklyRate: 3000,
            genres: ['drama', 'romance', 'adventure', 'comedy'],
            specialties: ['exotic beauty', 'European sophistication', 'scientific mind'],
            typeCast: 'Exotic foreign beauty',
            availableFrom: 1938,
            availableTo: 1949,
            oscarPotential: 6,
            scandalRisk: 20,
            chemistry: 81,
            pairings: ['vincent_ashcroft', 'charles_boyer'],
            rivalries: ['marjorie_kingsford'],
            quirks: ['inventor (frequency hopping)', 'nude scandal', 'six marriages', 'genius IQ'],
            description: 'Impossibly beautiful Austrian actress who was also a brilliant inventor. Halloway\'s exotic looks made her a star, but her scientific mind invented frequency-hopping technology. Studios never took her seriously.'
        },

        jane_russell: {
            id: 'lucille_ives',
            name: 'Lucille Ives',
            gender: 'female',
            starPower: 75,
            weeklyRate: 2400,
            genres: ['western', 'musical', 'adventure', 'comedy'],
            specialties: ['sex appeal', 'Howard Hughes discovery', 'sultry contralto'],
            typeCast: 'Buxom sex symbol',
            availableFrom: 1943,
            availableTo: 1949,
            oscarPotential: 4,
            scandalRisk: 18,
            chemistry: 78,
            pairings: ['bob_hope', 'stanley_everhart'],
            rivalries: [],
            quirks: ['The Outlaw censorship battle', 'Hughes obsession', 'cleavage focus'],
            description: 'Howard Hughes\' controversial discovery. Birchall\'s voluptuous figure caused censorship battles over The Outlaw. Hughes\' obsessive focus on her cleavage overshadowed her actual talent and warm personality.'
        },

        dana_andrews: {
            id: 'everett_jennings',
            name: 'Everett Jennings',
            gender: 'male',
            starPower: 76,
            weeklyRate: 2500,
            genres: ['noir', 'drama', 'war', 'western'],
            specialties: ['everyman appeal', 'moral complexity', 'understated power'],
            typeCast: 'Decent men facing moral dilemmas',
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 12,
            chemistry: 77,
            pairings: ['pauline_blackwood', 'constance_ingersoll'],
            rivalries: [],
            quirks: ['alcoholic', 'underrated talent', 'dignified presence'],
            description: 'Underrated leading man of film noir. Villiers\' decent everyman quality made his moral compromises in noir all more compelling. His alcoholism hurt his career but never his dignity on screen.'
        },

        robert_ryan: {
            id: 'milton_kessler',
            name: 'Milton Kessler',
            gender: 'male',
            starPower: 73,
            weeklyRate: 2200,
            genres: ['noir', 'western', 'drama', 'war'],
            specialties: ['menacing intensity', 'complex villains', 'tortured souls'],
            typeCast: 'Violent, conflicted men',
            availableFrom: 1943,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 6,
            chemistry: 74,
            pairings: ['stanley_everhart', 'gloria_grahame'],
            rivalries: [],
            quirks: ['liberal activist', 'tortured by playing racists', 'boxer background'],
            description: 'Menacing presence who specialized in complex villains. Ryan\'s intense physicality and psychological depth made him perfect for playing violent, conflicted men. Ironically, he was a gentle liberal in real life.'
        },

        glenn_ford: {
            id: 'lawrence_lindqvist',
            name: 'Lawrence Lindqvist',
            gender: 'male',
            starPower: 75,
            weeklyRate: 2400,
            genres: ['noir', 'western', 'drama', 'war'],
            specialties: ['everyman relatability', 'quiet strength', 'natural acting'],
            typeCast: 'Average guy hero',
            availableFrom: 1939,
            availableTo: 1949,
            draftRisk: true, // Served 1942-1945 (Marine)
            oscarPotential: 10,
            scandalRisk: 8,
            chemistry: 79,
            pairings: ['irene_vandermeer', 'vivian_barrington'],
            rivalries: [],
            quirks: ['war veteran', 'shy off-screen', 'underplayed everything'],
            description: 'Reliable everyman leading man. Ford\'s natural, understated acting style made him believable as ordinary men in extraordinary situations. His chemistry with Irene Vandermeer was electric.'
        },

        ann_sheridan: {
            id: 'geraldine_merriweather',
            name: 'Geraldine Merriweather',
            gender: 'female',
            starPower: 78,
            weeklyRate: 2700,
            genres: ['comedy', 'drama', 'noir', 'romance'],
            specialties: ['girl-next-door appeal', 'wisecracking humor', 'warmth'],
            typeCast: 'The Oomph Girl',
            availableFrom: 1934,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 10,
            chemistry: 82,
            pairings: ['gilbert_valentine', 'raymond_ellsworth'],
            rivalries: [],
            quirks: ['dubbed "Oomph Girl"', 'hated the nickname', 'warm personality'],
            description: 'The Oomph Girl who was more than just sex appeal. Merriweather\'s wisecracking humor and warm personality made her perfect for both comedy and drama. She hated her publicity-created "Oomph Girl" nickname.'
        },

        ida_lupino: {
            id: 'ramona_northgate',
            name: 'Ramona Northgate',
            gender: 'female',
            starPower: 77,
            weeklyRate: 2600,
            genres: ['noir', 'drama', 'thriller', 'melodrama'],
            specialties: ['tough broads', 'working-class grit', 'directing ability'],
            typeCast: 'Hard-bitten women',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 8,
            chemistry: 76,
            pairings: ['harold_caldwell', 'milton_kessler'],
            rivalries: [],
            quirks: ['would become director', 'British accent', 'tough on herself'],
            description: 'Tough, talented actress who would become Hollywood\'s only female director. Northgate specialized in hard-bitten women and brought working-class authenticity to every role. Her future as a director showed her brilliance.'
        },

        linda_darnell: {
            id: 'adelaide_oakhurst',
            name: 'Adelaide Oakhurst',
            gender: 'female',
            starPower: 76,
            weeklyRate: 2500,
            genres: ['drama', 'noir', 'western', 'romance'],
            specialties: ['sultry beauty', 'tragic heroines', 'exotic looks'],
            typeCast: 'Beautiful, doomed women',
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 14,
            chemistry: 78,
            pairings: ['theodore_ashford', 'casper_umberside'],
            rivalries: [],
            quirks: ['tragic death in 1965', 'abused by mother', 'low self-esteem'],
            description: 'Sultry beauty with a tragic life. Oakhurst\'s exotic looks and wounded quality made her compelling in film noir and costume dramas. Her controlling mother and low self-esteem plagued her career.'
        },

        susan_hayward: {
            id: 'blanche_pemberton',
            name: 'Blanche Pemberton',
            gender: 'female',
            starPower: 74,
            weeklyRate: 2300,
            genres: ['drama', 'melodrama', 'biography', 'noir'],
            specialties: ['fierce determination', 'working-class fighter', 'emotional intensity'],
            typeCast: 'Women who fight back',
            availableFrom: 1938,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 10,
            chemistry: 75,
            pairings: ['stanley_everhart', 'roland_fontelle'],
            rivalries: [],
            quirks: ['Brooklyn fighter', 'would win Oscar in 50s', 'fierce ambition'],
            description: 'Brooklyn-born fighter who played survivors. Pemberton\'s fierce determination and working-class grit made her perfect for playing women who refuse to be beaten down. Her best work came in the 1950s.'
        },

        maureen_ohara: {
            id: 'maureen_ohara',
            name: "Maureen O'Hara",
            gender: 'female',
            starPower: 77,
            weeklyRate: 2600,
            genres: ['adventure', 'western', 'romance', 'swashbuckler'],
            specialties: ['fiery spirit', 'Technicolor beauty', 'athletic action'],
            typeCast: 'Spirited, independent women',
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 6,
            chemistry: 84,
            pairings: ['howard_lockridge', 'bernard_draper', 'theodore_ashford'],
            rivalries: [],
            quirks: ['Irish temper', 'did own stunts', 'red-haired beauty'],
            description: 'Fiery Irish redhead perfect for Technicolor adventures. O\'Hara\'s spirited independence and athletic grace made her the ideal partner for swashbucklers. She could ride, fence, and hold her own with any leading man.'
        },

        // ========================================================================
        // CHARACTER ACTORS (Star Ashford: 55-69) - The Supporting Players
        // ========================================================================

        peter_lorre: {
            id: 'hugh_quill',
            name: 'Hugh Quill',
            gender: 'male',
            starPower: 68,
            weeklyRate: 1800,
            genres: ['thriller', 'noir', 'horror', 'drama'],
            specialties: ['creepy menace', 'bug-eyed intensity', 'European accent'],
            typeCast: 'Sinister foreigners',
            availableFrom: 1935,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 12,
            chemistry: 72,
            pairings: ['cornelius_rutledge', 'harold_caldwell'],
            rivalries: [],
            quirks: ['morphine addict', 'Hungarian accent', 'bug eyes'],
            description: 'The creepiest character actor in Hollywood. Quill\'s bug-eyed intensity and sinister European charm made him unforgettable in small doses. His partnership with Cornelius Rutledge was cinema gold.'
        },

        sydney_greenstreet: {
            id: 'cornelius_rutledge',
            name: 'Cornelius Rutledge',
            gender: 'male',
            starPower: 66,
            weeklyRate: 1600,
            genres: ['noir', 'thriller', 'drama', 'mystery'],
            specialties: ['corpulent menace', 'cultured villainy', 'imposing presence'],
            typeCast: 'Fat, sophisticated villains',
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 4,
            chemistry: 72,
            pairings: ['hugh_quill', 'harold_caldwell'],
            rivalries: [],
            quirks: ['didn\'t start films until 61', '357 pounds', 'stage background'],
            description: 'Massive presence who didn\'t make his first film until age 61. Rutledge\'s cultured menace and enormous bulk made him an unforgettable villain. His chemistry with Hugh Quill was magical.'
        },

        claude_rains: {
            id: 'preston_sterling',
            name: 'Preston Sterling',
            gender: 'male',
            starPower: 72,
            weeklyRate: 2000,
            genres: ['drama', 'thriller', 'horror', 'romance'],
            specialties: ['cultured voice', 'refined villainy', 'character depth'],
            typeCast: 'Sophisticated, complex men',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 6,
            chemistry: 76,
            pairings: ['vivian_barrington', 'sylvia_underhill'],
            rivalries: [],
            quirks: ['only 5\'6"', 'beautiful voice', 'four-time Oscar nominee'],
            description: 'The most cultured voice in Hollywood. Sterling brought intelligence and complexity to every role, from villains to heroes. His beautiful speaking voice and refined presence elevated every film.'
        },

        agnes_moorehead: {
            id: 'clara_trelawney',
            name: 'Clara Trelawney',
            gender: 'female',
            starPower: 70,
            weeklyRate: 1900,
            genres: ['drama', 'thriller', 'horror', 'melodrama'],
            specialties: ['character intensity', 'dramatic power', 'versatility'],
            typeCast: 'Powerful supporting women',
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 5,
            chemistry: 74,
            pairings: ['vincent_halloway'],
            rivalries: [],
            quirks: ['Halloway protégé', 'stage background', 'would play Endora'],
            description: 'Powerful character actress from Vincent Halloway\' Mercury Theatre. Trelawney brought ferocious intensity to supporting roles. Her Citizen Kane performance showed her dramatic range and power.'
        },

        edward_g_robinson: {
            id: 'emmett_upshaw',
            name: 'Emmett Upshaw',
            gender: 'male',
            starPower: 74,
            weeklyRate: 2300,
            genres: ['crime', 'noir', 'drama', 'thriller'],
            specialties: ['tough guy intensity', 'gangster authenticity', 'art collector erudition'],
            typeCast: 'Gangsters and tough guys',
            availableFrom: 1933,
            availableTo: 1949,
            huacRisk: true, // Targeted but cleared
            oscarPotential: 12,
            scandalRisk: 8,
            chemistry: 75,
            pairings: ['gilbert_valentine', 'harold_caldwell'],
            rivalries: [],
            quirks: ['art collector', 'Romanian accent', 'short (5\'5")', 'liberal politics'],
            description: 'The original movie gangster who was an art connoisseur in real life. Upshaw\'s Little Caesar created the gangster archetype. His erudition and art collection contradicted his tough guy image.'
        },

        james_cagney: {
            id: 'gilbert_valentine',
            name: 'Gilbert Valentine',
            gender: 'male',
            starPower: 76,
            weeklyRate: 2500,
            genres: ['crime', 'musical', 'drama', 'comedy'],
            specialties: ['explosive energy', 'dancing ability', 'tough guy charm'],
            typeCast: 'Cocky tough guys',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Yankee Doodle Dandy (1942)
            oscarPotential: 20,
            scandalRisk: 10,
            chemistry: 77,
            pairings: ['pat_obrien', 'geraldine_merriweather'],
            rivalries: ['jack_warner'],
            quirks: ['trained dancer', 'battled Warner Bros', 'liberal politics'],
            description: 'Explosive dynamo who could dance and fight with equal skill. Valentine\'s cocky energy and working-class authenticity made him the definitive Warner Bros. tough guy. His dancing talent surprised everyone.'
        },

        walter_brennan: {
            id: 'clifford_westbrook',
            name: 'Clifford Westbrook',
            gender: 'male',
            starPower: 64,
            weeklyRate: 1500,
            genres: ['western', 'drama', 'comedy', 'adventure'],
            specialties: ['old coot', 'character work', 'folksy wisdom'],
            typeCast: 'Grizzled sidekicks',
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // First three-time winner!
            oscarPotential: 18,
            scandalRisk: 3,
            chemistry: 70,
            pairings: ['eugene_hartline', 'bernard_draper'],
            rivalries: [],
            quirks: ['first three-time Oscar winner', 'lost teeth for authenticity', 'right-wing politics'],
            description: 'The most honored character actor in history - first three-time Oscar winner. Westbrook specialized in grizzled old-timers and brought folksy authenticity to westerns and dramas. He reportedly lost his teeth for roles.'
        },

        thomas_mitchell: {
            id: 'vernon_youngblood',
            name: 'Vernon Youngblood',
            gender: 'male',
            starPower: 67,
            weeklyRate: 1700,
            genres: ['drama', 'western', 'adventure', 'comedy'],
            specialties: ['versatility', 'character depth', 'Irish charm'],
            typeCast: 'Lovable supporting characters',
            availableFrom: 1936,
            availableTo: 1949,
            oscarWinner: true, // Stagecoach (1939)
            oscarPotential: 14,
            scandalRisk: 5,
            chemistry: 72,
            pairings: ['bernard_draper', 'walter_fairweather'],
            rivalries: [],
            quirks: ['1939 miracle year', 'stage background', 'heavy drinker'],
            description: 'Versatile character actor who had a miracle year in 1939. Youngblood appeared in Stagecoach, Gone with the Wind, Mr. Smith Goes to Marlowe, and more. His warmth and range were extraordinary.'
        },

        ward_bond: {
            id: 'wallace_abernathy',
            name: 'Wallace Abernathy',
            gender: 'male',
            starPower: 62,
            weeklyRate: 1400,
            genres: ['western', 'drama', 'war', 'adventure'],
            specialties: ['tough guy support', 'physical presence', 'Ford favorite'],
            typeCast: 'Tough cops and soldiers',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 6,
            scandalRisk: 8,
            chemistry: 68,
            pairings: ['bernard_draper', 'fletcher_ashford'],
            rivalries: [],
            quirks: ['Fletcher Ashford regular', 'football player', 'right-wing activist'],
            description: 'Burly character actor and Fletcher Ashford favorite. Bond\'s physical presence and no-nonsense delivery made him perfect for cops, soldiers, and tough guys. His friendship with Ford ensured steady work.'
        },

        eve_arden: {
            id: 'delphine_bellweather',
            name: 'Delphine Bellweather',
            gender: 'female',
            starPower: 65,
            weeklyRate: 1600,
            genres: ['comedy', 'drama', 'romance', 'musical'],
            specialties: ['wisecracking wit', 'best friend roles', 'comic timing'],
            typeCast: 'Sarcastic best friend',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 4,
            chemistry: 73,
            pairings: ['constance_ingersoll', 'portia_birchall'],
            rivalries: [],
            quirks: ['master of the one-liner', 'tall and striking', 'would become TV star'],
            description: 'The wisecracking best friend in dozens of films. Arden\'s sardonic delivery and perfect comic timing made her the ideal confidante. She could steal scenes with a single raised eyebrow.'
        },

        thelma_ritter: {
            id: 'eugenia_crowninshield',
            name: 'Eugenia Crowninshield',
            gender: 'female',
            starPower: 63,
            weeklyRate: 1500,
            genres: ['drama', 'comedy', 'noir', 'romance'],
            specialties: ['working-class wisdom', 'comic support', 'Brooklyn accent'],
            typeCast: 'Wise-cracking working women',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 3,
            chemistry: 71,
            pairings: ['walter_fairweather', 'vivian_barrington'],
            rivalries: [],
            quirks: ['didn\'t start films until 45', 'Brooklyn accent', 'six Oscar nominations'],
            description: 'Working-class scene-stealer who didn\'t start films until age 45. Crowninshield\'s Brooklyn accent and no-nonsense delivery brought authenticity to maids, nurses, and neighbors. She would earn six Oscar nominations.'
        },

        marjorie_main: {
            id: 'florence_dunmore',
            name: 'Florence Dunmore',
            gender: 'female',
            starPower: 61,
            weeklyRate: 1400,
            genres: ['comedy', 'western', 'drama', 'musical'],
            specialties: ['frontier women', 'comic timing', 'Ma Kettle'],
            typeCast: 'Tough frontier women',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 2,
            chemistry: 69,
            pairings: ['wallace_beery'],
            rivalries: [],
            quirks: ['would play Ma Kettle', 'gravelly voice', 'stage background'],
            description: 'Gravelly-voiced character actress perfect for frontier women. Main\'s tough exterior and comic timing made her memorable in supporting roles. Her Ma Kettle series would make her a star in the 1950s.'
        },

        cesar_romero: {
            id: 'edmund_eastgate',
            name: 'Edmund Eastgate',
            gender: 'male',
            starPower: 64,
            weeklyRate: 1500,
            genres: ['musical', 'comedy', 'romance', 'adventure'],
            specialties: ['Latin lover', 'dancing', 'suave charm'],
            typeCast: 'Exotic romantic types',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 4,
            scandalRisk: 10,
            chemistry: 70,
            pairings: ['carmen_miranda', 'alice_faye'],
            rivalries: [],
            quirks: ['Latin lover image', 'lifelong bachelor', 'would play Joker'],
            description: 'Suave Latin lover and dancer. Eastgate\'s exotic charm and dancing ability made him perfect for musicals and romantic comedies. His lifelong bachelor status fueled Hollywood rumors.'
        },

        van_heflin: {
            id: 'reuben_farnsworth',
            name: 'Reuben Farnsworth',
            gender: 'male',
            starPower: 66,
            weeklyRate: 1700,
            genres: ['western', 'drama', 'noir', 'war'],
            specialties: ['everyman quality', 'character depth', 'understated power'],
            typeCast: 'Ordinary men',
            availableFrom: 1937,
            availableTo: 1949,
            oscarWinner: true, // Johnny Eager (1942)
            oscarPotential: 12,
            scandalRisk: 6,
            chemistry: 71,
            pairings: ['cordelia_granger', 'opal_applewhite'],
            rivalries: [],
            quirks: ['stage trained', 'method actor', 'self-effacing'],
            description: 'Underrated character actor with Oscar-winning depth. Farnsworth specialized in ordinary men with hidden complexity. His understated approach and authenticity made him a director\'s favorite.'
        },

        barry_fitzgerald: {
            id: 'silas_hollingsworth',
            name: 'Silas Hollingsworth',
            gender: 'male',
            starPower: 65,
            weeklyRate: 1600,
            genres: ['comedy', 'drama', 'romance'],
            specialties: ['Irish charm', 'comic support', 'twinkling eyes'],
            typeCast: 'Lovable Irishmen',
            availableFrom: 1936,
            availableTo: 1949,
            oscarWinner: true, // Going My Way (1944)
            oscarPotential: 14,
            scandalRisk: 3,
            chemistry: 72,
            pairings: ['bing_crosby'],
            rivalries: [],
            quirks: ['thick Irish brogue', 'nominated for same role in two categories', 'late bloomer'],
            description: 'Lovable Irish character actor who won an Oscar at 56. Hollingsworth\'s twinkling eyes and thick brogue made him perfect for priests, bartenders, and comic support. His chemistry with Bing Crosby was magical.'
        },

        elisha_cook_jr: {
            id: 'amos_ironwood',
            name: 'Amos Ironwood',
            gender: 'male',
            starPower: 58,
            weeklyRate: 1200,
            genres: ['noir', 'western', 'crime', 'thriller'],
            specialties: ['nervous weasels', 'doomed characters', 'getting killed'],
            typeCast: 'Nervous losers who die',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 2,
            scandalRisk: 5,
            chemistry: 65,
            pairings: ['harold_caldwell'],
            rivalries: [],
            quirks: ['died on screen 17 times', 'small and wiry', 'nervous energy'],
            description: 'The most shot man in Hollywood. Cook specialized in nervous weasels and doomed fall guys. His twitchy energy and inevitable demise became a noir staple. Nobody died on screen more convincingly.'
        },

        judith_anderson: {
            id: 'genevieve_jasperson',
            name: 'Genevieve Jasperson',
            gender: 'female',
            starPower: 68,
            weeklyRate: 1800,
            genres: ['thriller', 'drama', 'horror', 'melodrama'],
            specialties: ['sinister intensity', 'stage gravitas', 'gothic menace'],
            typeCast: 'Sinister women',
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 4,
            chemistry: 70,
            pairings: ['laurence_olivier', 'beatrice_quimby'],
            rivalries: [],
            quirks: ['Australian accent hidden', 'stage legend', 'Mrs. Danvers defined her'],
            description: 'Sinister presence who created the definitive gothic villainess. Jasperson\'s Mrs. Danvers in Rebecca set the standard for creepy housekeepers. Her stage-trained intensity made her unforgettable in small doses.'
        },

        // ========================================================================
        // UP-AND-COMERS (Star Ashford: 40-54) - The New Faces
        // ========================================================================

        montgomery_clift: {
            id: 'clyde_kirkwood',
            name: 'Clyde Kirkwood',
            gender: 'male',
            starPower: 52,
            weeklyRate: 1000,
            genres: ['drama', 'western', 'romance', 'war'],
            specialties: ['method acting', 'sensitive intensity', 'new generation'],
            typeCast: 'Vulnerable young men',
            availableFrom: 1948,
            availableTo: 1949,
            oscarPotential: 22,
            scandalRisk: 14,
            chemistry: 68,
            pairings: ['gloria_marlowe', 'wilhelmina_orpington'],
            rivalries: [],
            quirks: ['method actor', 'closeted gay', 'would have tragic accident'],
            description: 'Revolutionary new talent bringing method acting to Hollywood. Kirkwood\'s sensitive intensity and psychological depth pointed to a new generation of actors. His troubled personal life would end in tragedy.'
        },

        burt_lancaster: {
            id: 'rudolph_loxley',
            name: 'Rudolph Loxley',
            gender: 'male',
            starPower: 50,
            weeklyRate: 900,
            genres: ['noir', 'drama', 'adventure', 'crime'],
            specialties: ['athletic grace', 'working-class intensity', 'physical presence'],
            typeCast: 'Tough guy with brains',
            availableFrom: 1946,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 8,
            chemistry: 66,
            pairings: ['henrietta_montrose', 'leonora_silverton'],
            rivalries: ['roland_fontelle'],
            quirks: ['former circus acrobat', 'liberal politics', 'athletic prowess'],
            description: 'Former circus acrobat bringing athletic grace to tough guy roles. Loxley\'s physical presence and intelligence made him an instant leading man. His rivalry with Roland Fontelle fueled both careers.'
        },

        ava_gardner: {
            id: 'henrietta_montrose',
            name: 'Henrietta Montrose',
            gender: 'female',
            starPower: 48,
            weeklyRate: 850,
            genres: ['noir', 'drama', 'romance', 'adventure'],
            specialties: ['sultry beauty', 'earthy sensuality', 'Southern charm'],
            typeCast: 'Exotic beauties',
            availableFrom: 1941,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 20,
            chemistry: 75,
            pairings: ['rudolph_loxley', 'frank_sinatra'],
            rivalries: ['cordelia_granger'],
            quirks: ['North Carolina accent', 'married Mickey Rooney', 'insecure about acting'],
            description: 'Stunningly beautiful newcomer still learning her craft. Montrose\'s earthy sensuality and exotic looks made her a rising star, but she was insecure about her acting ability. Her best work came in the 1950s.'
        },

        janet_leigh: {
            id: 'iris_nightingale',
            name: 'Iris Nightingale',
            gender: 'female',
            starPower: 46,
            weeklyRate: 800,
            genres: ['drama', 'romance', 'musical', 'thriller'],
            specialties: ['girl-next-door beauty', 'wholesome appeal', 'versatility'],
            typeCast: 'Sweet ingenues',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 6,
            chemistry: 70,
            pairings: ['conrad_ormsby'],
            rivalries: [],
            quirks: ['discovered by Norma Shearer', 'would marry Ormsby', 'Psycho awaits'],
            description: 'Fresh-faced newcomer discovered by Norma Shearer. Nightingale\'s wholesome beauty and natural acting made her an instant ingenue star. Her greatest role in Psycho was still a decade away.'
        },

        tony_curtis: {
            id: 'conrad_ormsby',
            name: 'Conrad Ormsby',
            gender: 'male',
            starPower: 44,
            weeklyRate: 750,
            genres: ['drama', 'adventure', 'romance', 'comedy'],
            specialties: ['pretty boy looks', 'Bronx accent', 'hustler charm'],
            typeCast: 'Handsome young leads',
            availableFrom: 1948,
            availableTo: 1985,
            oscarPotential: 8,
            scandalRisk: 10,
            chemistry: 68,
            pairings: ['iris_nightingale'],
            rivalries: [],
            quirks: ['born Bernie Schwartz', 'thick Bronx accent', 'pretty boy looks'],
            description: 'Brand new pretty boy from the Bronx. Ormsby just arrived in Hollywood with matinee idol looks and a thick accent to lose. His hustler charm and ambition suggest a long career ahead.'
        },

        shelley_winters: {
            id: 'josephine_pinkerton',
            name: 'Josephine Pinkerton',
            gender: 'female',
            starPower: 47,
            weeklyRate: 825,
            genres: ['drama', 'noir', 'melodrama', 'thriller'],
            specialties: ['working-class authenticity', 'victim types', 'method acting'],
            typeCast: 'Vulnerable working girls',
            availableFrom: 1943,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 12,
            chemistry: 69,
            pairings: ['clyde_kirkwood'],
            rivalries: [],
            quirks: ['New York accent', 'method actress', 'blonde bombshell period'],
            description: 'Ambitious young actress perfect for working-class victims. Pinkerton brought method acting intensity to vulnerable roles. Her blonde bombshell phase would give way to character work and two Oscars.'
        },

        lizabeth_scott: {
            id: 'katrine_quarles',
            name: 'Katrine Quarles',
            gender: 'female',
            starPower: 49,
            weeklyRate: 875,
            genres: ['noir', 'thriller', 'drama', 'romance'],
            specialties: ['husky voice', 'Yardley imitation', 'femme fatale'],
            typeCast: 'Budget Yardley',
            availableFrom: 1945,
            availableTo: 1949,
            oscarPotential: 6,
            scandalRisk: 16,
            chemistry: 67,
            pairings: ['rudolph_loxley', 'dick_powell'],
            rivalries: ['estelle_yardley'],
            quirks: ['husky voice like Yardley', 'lesbian rumors', 'Pennsylvania Dutch'],
            description: 'Sultry newcomer marketed as a budget Estelle Yardley. Scott\'s husky voice and blonde beauty made her a noir fixture, but she never escaped Yardley\'s shadow. Rumors about her personal life plagued her career.'
        },

        william_holden: {
            id: 'august_ravenswood',
            name: 'August Ravenswood',
            gender: 'male',
            starPower: 51,
            weeklyRate: 950,
            genres: ['drama', 'adventure', 'war', 'romance'],
            specialties: ['all-American looks', 'everyman appeal', 'natural acting'],
            typeCast: 'Clean-cut heroes',
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 8,
            chemistry: 71,
            pairings: ['gloria_swanson'],
            rivalries: [],
            quirks: ['all-American looks', 'would become cynical hero', 'heavy drinker later'],
            description: 'All-American newcomer about to become a major star. Ravenswood\'s clean-cut looks and natural acting made him perfect for young heroes. His cynical anti-hero phase was still ahead in the 1950s.'
        },

        deborah_kerr: {
            id: 'leonora_silverton',
            name: 'Leonora Silverton',
            gender: 'female',
            starPower: 50,
            weeklyRate: 900,
            genres: ['drama', 'romance', 'historical', 'adventure'],
            specialties: ['British refinement', 'repressed passion', 'ladylike quality'],
            typeCast: 'English roses',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 4,
            chemistry: 72,
            pairings: ['rudolph_loxley'],
            rivalries: [],
            quirks: ['British accent', 'typecast as ladies', 'would break type in 50s'],
            description: 'Refined British actress just arriving in Hollywood. Kerr\'s ladylike quality and repressed passion made her perfect for quality dramas. She would fight typecasting by playing a adulteress in From Here to Eternity.'
        },

        richard_widmark: {
            id: 'emil_tanwood',
            name: 'Emil Tanwood',
            gender: 'male',
            starPower: 53,
            weeklyRate: 1050,
            genres: ['noir', 'thriller', 'crime', 'western'],
            specialties: ['giggling psychopath', 'menacing intensity', 'villain roles'],
            typeCast: 'Sadistic villains',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 6,
            chemistry: 68,
            pairings: ['pauline_blackwood'],
            rivalries: [],
            quirks: ['giggling laugh', 'pushed wheelchair woman down stairs', 'instant star villain'],
            description: 'Terrifying newcomer who became an instant star villain. Tanwood\'s giggling psychopath in Kiss of Death was so effective he struggled to escape villain roles. His sadistic intensity was unforgettable.'
        },

        cornel_wilde: {
            id: 'casper_umberside',
            name: 'Casper Umberside',
            gender: 'male',
            starPower: 48,
            weeklyRate: 850,
            genres: ['adventure', 'romance', 'drama', 'swashbuckler'],
            specialties: ['athletic action', 'exotic looks', 'fencing ability'],
            typeCast: 'Handsome adventurers',
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 7,
            chemistry: 70,
            pairings: ['adelaide_oakhurst', 'pauline_blackwood'],
            rivalries: [],
            quirks: ['Olympic fencer', 'polyglot', 'would become director'],
            description: 'Athletic newcomer and Olympic-level fencer. Umberside\'s exotic good looks and fencing ability made him perfect for swashbucklers and costume dramas. He would later become a respected director.'
        },

        jane_greer: {
            id: 'mabel_vance',
            name: 'Mabel Vance',
            gender: 'female',
            starPower: 49,
            weeklyRate: 875,
            genres: ['noir', 'drama', 'thriller', 'romance'],
            specialties: ['femme fatale', 'sultry menace', 'duplicity'],
            typeCast: 'Dangerous women',
            availableFrom: 1945,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 12,
            chemistry: 73,
            pairings: ['stanley_everhart'],
            rivalries: [],
            quirks: ['married Howard Hughes briefly', 'deaf in one ear', 'Out of the Past'],
            description: 'Rising femme fatale who would define the type. Vance\'s cool duplicity and sultry beauty made her perfect for noir. Her performance in Out of the Past opposite Everhart became the definitive femme fatale.'
        },

        wendell_corey: {
            id: 'ferdinand_wexford',
            name: 'Ferdinand Wexford',
            gender: 'male',
            starPower: 45,
            weeklyRate: 775,
            genres: ['noir', 'drama', 'thriller', 'western'],
            specialties: ['everyman quality', 'solid support', 'dependable acting'],
            typeCast: 'Regular guys',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 6,
            scandalRisk: 8,
            chemistry: 66,
            pairings: ['evelyn_galloway'],
            rivalries: [],
            quirks: ['alcoholic', 'dependable', 'would enter politics'],
            description: 'Solid new character actor with everyman appeal. Wexford\'s dependable presence and natural acting made him perfect for supporting roles in noir and drama. His alcoholism would limit his career.'
        },

        marie_windsor: {
            id: 'nadine_yorke',
            name: 'Nadine Yorke',
            gender: 'female',
            starPower: 46,
            weeklyRate: 800,
            genres: ['noir', 'western', 'thriller', 'crime'],
            specialties: ['B-movie queen', 'tough dames', 'low-budget noir'],
            typeCast: 'Hard-bitten women',
            availableFrom: 1947,
            availableTo: 1949,
            oscarPotential: 4,
            scandalRisk: 8,
            chemistry: 67,
            pairings: ['charles_mcgraw'],
            rivalries: [],
            quirks: ['B-movie noir queen', 'tall (5\'9")', 'would become cult icon'],
            description: 'Rising B-movie noir queen. Yorke\'s tall frame and hard-bitten delivery made her perfect for low-budget noirs. She would become a cult icon for her tough dame performances in poverty row classics.'
        },

        mark_stevens: {
            id: 'percival_zeller',
            name: 'Percival Zeller',
            gender: 'male',
            starPower: 43,
            weeklyRate: 725,
            genres: ['noir', 'drama', 'thriller', 'crime'],
            specialties: ['B-movie leads', 'solid acting', 'noir heroes'],
            typeCast: 'Noir investigators',
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 5,
            scandalRisk: 6,
            chemistry: 65,
            pairings: ['lucille_ball'],
            rivalries: [],
            quirks: ['Fox contract player', 'would become director', 'underrated noir lead'],
            description: 'Reliable B-movie leading man in Fox noirs. Stevens\' solid presence and everyman quality made him effective in programmer noirs. He would later direct and produce with modest success.'
        },

        // Additional up-and-comers to round out roster...

        jean_arthur: {
            id: 'opal_applewhite',
            name: 'Opal Applewhite',
            gender: 'female',
            starPower: 83,
            weeklyRate: 3400,
            genres: ['comedy', 'drama', 'western', 'romance'],
            specialties: ['husky voice', 'screwball comedy', 'working-class appeal'],
            typeCast: 'Spunky working girls',
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 10,
            chemistry: 86,
            pairings: ['walter_fairweather', 'raymond_ellsworth', 'eugene_hartline'],
            rivalries: [],
            quirks: ['neurotic', 'hated Hollywood', 'retired frequently', 'distinctive voice'],
            description: 'Screwball comedy star with a distinctive husky voice. Applewhite\'s spunky working-class heroines made her perfect for Yardley films. Neurotic and difficult, she hated Hollywood and retired multiple times.'
        },

        rosalind_russell: {
            id: 'portia_birchall',
            name: 'Portia Birchall',
            gender: 'female',
            starPower: 81,
            weeklyRate: 3100,
            genres: ['comedy', 'drama', 'romance', 'musical'],
            specialties: ['rapid-fire dialogue', 'career women', 'sophisticated comedy'],
            typeCast: 'Fast-talking career women',
            availableFrom: 1934,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 6,
            chemistry: 83,
            pairings: ['raymond_ellsworth', 'fred_macmurray'],
            rivalries: [],
            quirks: ['rapid-fire delivery', 'career woman image', 'comedy timing'],
            description: 'Master of rapid-fire dialogue and sophisticated comedy. Birchall\'s His Girl Friday performance set the standard for fast-talking career women. Her energy and intelligence made her unique among 1940s stars.'
        },

        carole_lombard: {
            id: 'queenie_dellamore',
            name: 'Queenie Dellamore',
            gender: 'female',
            starPower: 89,
            weeklyRate: 4100,
            genres: ['comedy', 'screwball', 'drama', 'romance'],
            specialties: ['screwball queen', 'comedic genius', 'natural glamour'],
            typeCast: 'Madcap heiresses',
            availableFrom: 1933,
            availableTo: 1942, // Died in plane crash 1942
            oscarPotential: 22,
            scandalRisk: 14,
            chemistry: 90,
            pairings: ['franklin_ogilvie', 'vincent_ashcroft', 'fred_macmurray'],
            rivalries: [],
            quirks: ['foul mouth', 'married Ashcroft', 'died in plane crash', 'practical joker'],
            description: 'The queen of screwball comedy with a famously foul mouth. Dellamore\'s natural glamour and comedic genius made her Hollywood\'s highest-paid star by 1937. Her death in a 1942 plane crash devastated Ashcroft.'
        },

        jean_harlow: {
            id: 'rosetta_eversleigh',
            name: 'Rosetta Eversleigh',
            gender: 'female',
            starPower: 92,
            weeklyRate: 4600,
            genres: ['comedy', 'drama', 'romance', 'melodrama'],
            specialties: ['platinum blonde', 'sex appeal', 'comic timing'],
            typeCast: 'Platinum blonde bombshell',
            availableFrom: 1933,
            availableTo: 1937, // Died at 26 in 1937
            oscarPotential: 14,
            scandalRisk: 25,
            chemistry: 88,
            pairings: ['vincent_ashcroft', 'franklin_ogilvie', 'chester_jessup'],
            rivalries: ['norma_shearer'],
            quirks: ['platinum blonde', 'died at 26', 'scandal-plagued', 'no underwear'],
            description: 'The original platinum blonde bombshell. Eversleigh\'s raw sex appeal and surprising comic timing made her MGM\'s hottest star. Her tragic death at 26 from kidney failure shocked Hollywood. Powell never recovered.'
        },

        // Add more character actors to reach 75+...

        alan_ladd: {
            id: 'barnaby_fairmont',
            name: 'Barnaby Fairmont',
            gender: 'male',
            starPower: 79,
            weeklyRate: 2900,
            genres: ['noir', 'western', 'thriller', 'adventure'],
            specialties: ['diminutive tough guy', 'icy cool', 'Ladd-Lake chemistry'],
            typeCast: 'Small but deadly heroes',
            availableFrom: 1942,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 12,
            chemistry: 88,
            pairings: ['harriet_carmichael'],
            rivalries: [],
            quirks: ['only 5\'6"', 'stood on boxes', 'alcoholic', 'insecure'],
            description: 'Diminutive tough guy with icy cool. Ladd\'s chemistry with Harriet Carmichael created magic despite requiring her to stand in trenches. His small stature and insecurity fueled his intense performances and alcoholism.'
        },

        gene_kelly: {
            id: 'ellis_goldenberg',
            name: 'Ellis Goldenberg',
            gender: 'male',
            starPower: 76,
            weeklyRate: 2500,
            genres: ['musical', 'comedy', 'romance', 'drama'],
            specialties: ['athletic dancing', 'choreography innovation', 'working-class energy'],
            typeCast: 'Energetic dancer-singers',
            availableFrom: 1942,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 8,
            chemistry: 80,
            pairings: ['selma_harrington', 'frank_sinatra'],
            rivalries: ['martin_thornbury'],
            quirks: ['athletic dancing', 'choreographer', 'Pittsburgh Irish', 'innovator'],
            description: 'Athletic dancer bringing working-class energy to musicals. Kelly\'s innovative choreography and masculine dancing style contrasted with Thornbury\'s elegance. His best work as director-choreographer came in the 1950s.'
        },

        judy_garland: {
            id: 'selma_harrington',
            name: 'Selma Harrington',
            gender: 'female',
            starPower: 84,
            weeklyRate: 3500,
            genres: ['musical', 'drama', 'comedy', 'romance'],
            specialties: ['powerful voice', 'emotional vulnerability', 'girl-next-door appeal'],
            typeCast: 'Wholesome musical stars',
            availableFrom: 1935,
            availableTo: 1969, // Died 1969, A Star Is Born (1954)
            oscarPotential: 20,
            scandalRisk: 22,
            chemistry: 85,
            pairings: ['mickey_rooney', 'ellis_goldenberg'],
            rivalries: [],
            quirks: ['pill addiction', 'abused by studio', 'powerful voice', 'unstable'],
            description: 'The most talented and troubled musical star. Harrington\'s powerful voice and emotional vulnerability made her unforgettable, but MGM\'s abuse with pills and exploitation destroyed her health. Her instability was already showing.'
        },

        // ========================================================================
        // 1950s STARS - Method Acting and New Hollywood Glamour
        // ========================================================================

        marlon_brando: {
            id: 'foster_islington',
            name: 'Foster Islington',
            gender: 'male',
            starPower: 98,
            weeklyRate: 8000,
            genres: ['drama', 'crime', 'war', 'romance'],
            specialties: ['method acting', 'raw intensity', 'mumbling naturalism'],
            typeCast: 'Tortured rebels and powerful men',
            availableFrom: 1950,
            availableTo: 1980,
            oscarWinner: true, // On the Waterfront (1954), The Godfather (1972)
            oscarPotential: 40,
            scandalRisk: 25,
            chemistry: 80,
            pairings: ['lillian_norwood', 'eva_marie_saint'],
            rivalries: ['grover_kentworth'],
            quirks: ['refuses direction', 'weight gain issues', 'political activism', 'refuses Oscar'],
            description: 'The greatest actor of his generation. Islington\'s Method acting revolutionized the craft, bringing raw emotional truth to the screen. His refusal to play by Hollywood\'s rules made him both legendary and difficult.'
        },

        james_dean: {
            id: 'grover_kentworth',
            name: 'Grover Kentworth',
            gender: 'male',
            starPower: 88,
            weeklyRate: 6000,
            genres: ['drama', 'romance'],
            specialties: ['teenage angst', 'vulnerability', 'rebellion'],
            typeCast: 'Troubled youth',
            availableFrom: 1955,
            availableTo: 1955, // Died September 1955
            oscarPotential: 30,
            scandalRisk: 18,
            chemistry: 82,
            pairings: ['natalie_wood', 'wilhelmina_orpington'],
            rivalries: [],
            quirks: ['reckless driver', 'moody on set', 'icon of rebellion'],
            description: 'The ultimate symbol of youthful rebellion. Dean made only three films but became an immortal icon. His raw vulnerability and tortured intensity defined a generation\'s disillusionment.'
        },

        marilyn_monroe: {
            id: 'theodora_larkspur',
            name: 'Theodora Larkspur',
            gender: 'female',
            starPower: 96,
            weeklyRate: 7500,
            genres: ['comedy', 'romance', 'musical', 'drama'],
            specialties: ['sex appeal', 'comic timing', 'vulnerability'],
            typeCast: 'Blonde bombshell with hidden depth',
            availableFrom: 1950,
            availableTo: 1962, // Died 1962
            oscarPotential: 15,
            scandalRisk: 30,
            chemistry: 92,
            pairings: ['conrad_ormsby', 'vincent_ashcroft'],
            rivalries: ['lucille_ives'],
            quirks: ['chronically late', 'demands retakes', 'fragile psyche', 'studio conflicts'],
            description: 'The most iconic sex symbol in cinema history. Larkspur\'s breathy voice and luminous screen presence masked genuine comic talent and deep personal turmoil. Her battles with studios and personal demons became legendary.'
        },

        grace_kelly: {
            id: 'ursula_mayfield',
            name: 'Ursula Mayfield',
            gender: 'female',
            starPower: 90,
            weeklyRate: 7000,
            genres: ['drama', 'thriller', 'romance', 'comedy'],
            specialties: ['icy elegance', 'aristocratic beauty', 'hidden passion'],
            typeCast: 'Cool blonde with smoldering depths',
            availableFrom: 1951,
            availableTo: 1956, // Retired to become Princess of Monaco
            oscarWinner: true, // The Country Girl (1954)
            oscarPotential: 28,
            scandalRisk: 8,
            chemistry: 88,
            pairings: ['raymond_ellsworth', 'walter_fairweather', 'eugene_hartline'],
            rivalries: [],
            quirks: ['Carmichael favorite', 'secretly passionate', 'leaves for royalty'],
            description: 'The epitome of cool blonde elegance. Kelly\'s brief but brilliant career produced unforgettable Carmichael heroines before she traded Hollywood for a real-life fairy tale as Princess of Monaco.'
        },

        audrey_hepburn: {
            id: 'verna_newhall',
            name: 'Verna Newhall',
            gender: 'female',
            starPower: 93,
            weeklyRate: 8000,
            genres: ['romance', 'comedy', 'drama', 'musical'],
            specialties: ['gamine charm', 'elegance', 'waif-like beauty'],
            typeCast: 'Elegant free spirits',
            availableFrom: 1953,
            availableTo: 1976,
            oscarWinner: true, // Roman Holiday (1953)
            oscarPotential: 25,
            scandalRisk: 3,
            chemistry: 90,
            pairings: ['russell_whitfield', 'raymond_ellsworth', 'martin_thornbury'],
            rivalries: [],
            quirks: ['fashion icon', 'humanitarian', 'insecure about talent'],
            description: 'The most elegant star in Hollywood history. Newhall\'s gamine charm, impeccable style, and genuine warmth made her beloved worldwide. Her transition from actress to humanitarian was seamless.'
        },

        elizabeth_taylor: {
            id: 'wilhelmina_orpington',
            name: 'Wilhelmina Orpington',
            gender: 'female',
            starPower: 95,
            weeklyRate: 10000,
            genres: ['drama', 'romance', 'melodrama'],
            specialties: ['violet eyes', 'passionate intensity', 'glamour'],
            typeCast: 'Passionate, tempestuous women',
            availableFrom: 1950,
            availableTo: 1980,
            oscarWinner: true, // BUtterfield 8 (1960), Who's Afraid of Virginia Woolf? (1966)
            oscarPotential: 30,
            scandalRisk: 35,
            chemistry: 88,
            pairings: ['richard_burton', 'clyde_kirkwood', 'ives_rosemont'],
            rivalries: ['debbie_reynolds'],
            quirks: ['multiple marriages', 'health problems', 'jewelry obsession', 'tabloid magnet'],
            description: 'The last great studio-era movie star. Orpington\'s violet eyes, stunning beauty, and tumultuous personal life kept her in headlines for decades. Her on-screen passion was matched only by her off-screen drama.'
        },

        rock_hudson: {
            id: 'hollis_pallister',
            name: 'Hollis Pallister',
            gender: 'male',
            starPower: 85,
            weeklyRate: 7000,
            genres: ['romance', 'comedy', 'drama', 'war'],
            specialties: ['tall dark handsome', 'romantic charm', 'comedic timing'],
            typeCast: 'Tall, dark, handsome leading man',
            availableFrom: 1950,
            availableTo: 1970,
            oscarPotential: 15,
            scandalRisk: 20,
            chemistry: 85,
            pairings: ['doris_day', 'wilhelmina_orpington'],
            rivalries: [],
            quirks: ['closeted personal life', 'studio-manufactured image', 'reliable professional'],
            description: 'The quintessential 1950s leading man. Pallister\'s towering physique and easy charm made him the top box office draw. His comedies with Doris Day defined an era, while his private life remained carefully hidden.'
        },

        kim_novak: {
            id: 'arlene_quintrell',
            name: 'Arlene Quintrell',
            gender: 'female',
            starPower: 82,
            weeklyRate: 6000,
            genres: ['drama', 'thriller', 'romance', 'noir'],
            specialties: ['mysterious allure', 'ethereal beauty', 'vulnerability'],
            typeCast: 'Mysterious, haunting women',
            availableFrom: 1954,
            availableTo: 1966,
            oscarPotential: 15,
            scandalRisk: 14,
            chemistry: 80,
            pairings: ['walter_fairweather', 'frank_sinatra'],
            rivalries: ['ursula_mayfield'],
            quirks: ['Carmichael muse', 'studio-controlled image', 'resistant to typecasting'],
            description: 'Columbia\'s answer to Theodora Larkspur, but with a haunting depth. Novak\'s ethereal presence in Vertigo created one of cinema\'s most unforgettable performances. Her mysterious quality made her perfect for Carmichael.'
        },

        // ========================================================================
        // 1960s STARS - The New Wave and International Icons
        // ========================================================================

        paul_newman: {
            id: 'ives_rosemont',
            name: 'Ives Rosemont',
            gender: 'male',
            starPower: 94,
            weeklyRate: 15000,
            genres: ['drama', 'western', 'crime', 'comedy'],
            specialties: ['blue-eyed intensity', 'charming antiheroes', 'natural cool'],
            typeCast: 'Charismatic rebels and antiheroes',
            availableFrom: 1956,
            availableTo: 2002,
            oscarWinner: true, // The Color of Money (1986)
            oscarPotential: 30,
            scandalRisk: 6,
            chemistry: 90,
            pairings: ['joanne_woodward', 'robert_redford'],
            rivalries: [],
            quirks: ['race car driver', 'political activist', 'philanthropist', 'loyal husband'],
            description: 'The coolest actor in Hollywood. Rosemont\'s piercing blue eyes and effortless charisma masked serious dramatic talent. His partnership with Robert Redford produced cinematic magic, and his philanthropy set a new standard.'
        },

        steve_mcqueen: {
            id: 'jasper_summerfield',
            name: 'Jasper Summerfield',
            gender: 'male',
            starPower: 90,
            weeklyRate: 14000,
            genres: ['action', 'thriller', 'western', 'drama', 'war'],
            specialties: ['cool stoicism', 'physical presence', 'anti-establishment'],
            typeCast: 'Cool, laconic action heroes',
            availableFrom: 1960,
            availableTo: 1980, // Died 1980
            oscarPotential: 15,
            scandalRisk: 18,
            chemistry: 78,
            pairings: ['daphne_ellsworth', 'ali_macgraw'],
            rivalries: ['ives_rosemont'],
            quirks: ['motorcycle obsession', 'difficult on set', 'demands top billing', 'paranoid'],
            description: 'The King of Cool. Summerfield\'s laconic intensity and physical magnetism made him the ultimate action star. His anti-establishment persona and love of speed defined a new kind of masculine cool.'
        },

        sidney_poitier: {
            id: 'kermit_thistlewood',
            name: 'Kermit Thistlewood',
            gender: 'male',
            starPower: 88,
            weeklyRate: 12000,
            genres: ['drama', 'thriller', 'crime'],
            specialties: ['dignified intensity', 'moral authority', 'breaking barriers'],
            typeCast: 'Dignified, intelligent men of principle',
            availableFrom: 1955,
            availableTo: 1977,
            oscarWinner: true, // Lilies of the Field (1963)
            oscarPotential: 25,
            scandalRisk: 5,
            chemistry: 82,
            pairings: ['rod_steiger', 'conrad_ormsby'],
            rivalries: [],
            quirks: ['racial barrier breaker', 'refuses demeaning roles', 'regal bearing'],
            description: 'The man who broke Hollywood\'s color barrier. Thistlewood\'s dignified presence and immense talent made him the first Black actor to win the Best Actor Oscar. His insistence on roles of dignity changed the industry forever.'
        },

        sean_connery: {
            id: 'lyle_uxbridge',
            name: 'Lyle Uxbridge',
            gender: 'male',
            starPower: 92,
            weeklyRate: 15000,
            genres: ['action', 'thriller', 'adventure', 'drama'],
            specialties: ['suave masculinity', 'physical charisma', 'Scottish charm'],
            typeCast: 'Suave, dangerous men of action',
            availableFrom: 1962,
            availableTo: 2003,
            oscarWinner: true, // The Untouchables (1987)
            oscarPotential: 18,
            scandalRisk: 12,
            chemistry: 85,
            pairings: ['honor_blackman', 'ursula_andress'],
            rivalries: ['roger_moore'],
            quirks: ['Bond typecasting', 'refuses toupee off-screen', 'Scottish pride'],
            description: 'The definitive James Bond and so much more. Uxbridge\'s raw masculine charisma and dangerous charm made him an international superstar. His later career proved he was far more than 007.'
        },

        julie_andrews: {
            id: 'bettina_villiers',
            name: 'Bettina Villiers',
            gender: 'female',
            starPower: 90,
            weeklyRate: 14000,
            genres: ['musical', 'comedy', 'drama', 'romance'],
            specialties: ['crystal voice', 'wholesome charm', 'comic timing'],
            typeCast: 'Wholesome, spirited heroines',
            availableFrom: 1964,
            availableTo: 1982,
            oscarWinner: true, // Mary Poppins (1964)
            oscarPotential: 22,
            scandalRisk: 3,
            chemistry: 85,
            pairings: ['dick_van_dyke', 'christopher_plummer'],
            rivalries: [],
            quirks: ['practically perfect', 'stage-trained voice', 'subversive humor'],
            description: 'The voice of a generation. Villiers dominated the 1960s musical with Mary Poppins and The Sound of Music, her crystal-clear soprano and impeccable charm creating two of cinema\'s most beloved characters.'
        },

        sophia_loren: {
            id: 'celeste_winterbourne',
            name: 'Celeste Winterbourne',
            gender: 'female',
            starPower: 89,
            weeklyRate: 13000,
            genres: ['drama', 'comedy', 'romance'],
            specialties: ['Mediterranean beauty', 'earthy passion', 'dramatic power'],
            typeCast: 'Passionate, earthy Mediterranean women',
            availableFrom: 1957,
            availableTo: 1980,
            oscarWinner: true, // Two Women (1961) - first for non-English performance
            oscarPotential: 25,
            scandalRisk: 12,
            chemistry: 88,
            pairings: ['marcello_mastroianni', 'raymond_ellsworth'],
            rivalries: ['gina_lollobrigida'],
            quirks: ['international glamour', 'rose from poverty', 'Italian fire'],
            description: 'Italy\'s greatest film export. Winterbourne\'s stunning beauty and raw dramatic power made her the first actress to win an Oscar for a non-English language performance. Her rags-to-riches story was more dramatic than any film.'
        },

        // ========================================================================
        // 1970s STARS - New Hollywood and the Director\'s Era
        // ========================================================================

        robert_de_niro: {
            id: 'mordecai_ashcroft',
            name: 'Mordecai Ashcroft',
            gender: 'male',
            starPower: 96,
            weeklyRate: 30000,
            genres: ['crime', 'drama', 'thriller', 'comedy'],
            specialties: ['method transformation', 'intensity', 'intimidation'],
            typeCast: 'Intense, dangerous men',
            availableFrom: 1973,
            availableTo: 2010,
            oscarWinner: true, // The Godfather Part II (1974), Raging Bull (1980)
            oscarPotential: 35,
            scandalRisk: 8,
            chemistry: 85,
            pairings: ['joe_pesci', 'harvey_keitel'],
            rivalries: ['newton_barrington'],
            quirks: ['extreme method acting', 'gains weight for roles', 'Umberside partnership'],
            description: 'The greatest actor of his generation. De Niro\'s total commitment to Method acting produced some of cinema\'s most unforgettable performances. His physical and psychological transformations remain unmatched.'
        },

        al_pacino: {
            id: 'newton_barrington',
            name: 'Newton Barrington',
            gender: 'male',
            starPower: 95,
            weeklyRate: 28000,
            genres: ['crime', 'drama', 'thriller'],
            specialties: ['explosive intensity', 'quiet menace', 'theatrical flair'],
            typeCast: 'Passionate, explosive men of power',
            availableFrom: 1972,
            availableTo: 2010,
            oscarWinner: true, // Scent of a Woman (1992)
            oscarPotential: 32,
            scandalRisk: 10,
            chemistry: 82,
            pairings: ['eloise_fairweather', 'mordecai_ashcroft'],
            rivalries: ['mordecai_ashcroft'],
            quirks: ['Hoo-ah!', 'theatrical training', 'increasingly bombastic'],
            description: 'The most electrifying actor in American cinema. Barrington\'s volcanic intensity and theatrical flair produced Michael Corleone, Tony Montana, and countless other iconic performances. His quiet menace could explode into operatic fury.'
        },

        jack_nicholson: {
            id: 'orville_caldwell',
            name: 'Orville Caldwell',
            gender: 'male',
            starPower: 96,
            weeklyRate: 30000,
            genres: ['drama', 'thriller', 'comedy', 'horror', 'crime'],
            specialties: ['devilish charm', 'manic energy', 'subversive humor'],
            typeCast: 'Charismatic rebels and dangerous charmers',
            availableFrom: 1969,
            availableTo: 2006,
            oscarWinner: true, // One Flew Over the Cuckoo's Nest (1975), Terms of Endearment (1983), As Good as It Gets (1997)
            oscarPotential: 35,
            scandalRisk: 22,
            chemistry: 88,
            pairings: ['daphne_ellsworth', 'shirley_maclaine'],
            rivalries: [],
            quirks: ['sunglasses indoors', 'Lakers superfan', 'legendary partier', 'eyebrow acting'],
            description: 'The most charismatic actor of his era. Caldwell\'s devilish grin and unpredictable energy made every film an event. Three Oscars barely capture the breadth of his talent, from Easy Rider to The Shining to As Good as It Gets.'
        },

        dustin_hoffman: {
            id: 'phineas_devereaux',
            name: 'Phineas Devereaux',
            gender: 'male',
            starPower: 90,
            weeklyRate: 25000,
            genres: ['drama', 'comedy', 'thriller'],
            specialties: ['character transformation', 'neurotic energy', 'everyman appeal'],
            typeCast: 'Unlikely heroes and complex everymen',
            availableFrom: 1967,
            availableTo: 2008,
            oscarWinner: true, // Kramer vs. Kramer (1979), Rain Man (1988)
            oscarPotential: 30,
            scandalRisk: 12,
            chemistry: 84,
            pairings: ['fern_hartline', 'tom_cruise'],
            rivalries: [],
            quirks: ['perfectionist', 'difficult on set', 'Method extremist'],
            description: 'The anti-movie star who became a movie star. Devereaux\'s unconventional looks and obsessive commitment to character made him the most unlikely leading man in Hollywood. His range from The Graduate to Tootsie to Rain Man is staggering.'
        },

        faye_dunaway: {
            id: 'daphne_ellsworth',
            name: 'Daphne Ellsworth',
            gender: 'female',
            starPower: 86,
            weeklyRate: 20000,
            genres: ['drama', 'crime', 'thriller', 'noir'],
            specialties: ['fierce beauty', 'intensity', 'glamorous danger'],
            typeCast: 'Beautiful, dangerous women',
            availableFrom: 1967,
            availableTo: 1987,
            oscarWinner: true, // Network (1976)
            oscarPotential: 28,
            scandalRisk: 16,
            chemistry: 82,
            pairings: ['warren_beatty', 'orville_caldwell', 'jasper_summerfield'],
            rivalries: [],
            quirks: ['demands perfection', 'temperamental', 'high-maintenance'],
            description: 'The ice-cold beauty of New Hollywood. Ellsworth\'s fierce intelligence and stunning presence defined the era, from Bonnie and Clyde to Chinatown to Network. Her intensity could be riveting or terrifying, sometimes both.'
        },

        diane_keaton: {
            id: 'eloise_fairweather',
            name: 'Eloise Fairweather',
            gender: 'female',
            starPower: 85,
            weeklyRate: 18000,
            genres: ['comedy', 'drama', 'romance'],
            specialties: ['neurotic charm', 'quirky fashion', 'natural comedy'],
            typeCast: 'Quirky, intelligent women',
            availableFrom: 1972,
            availableTo: 2003,
            oscarWinner: true, // Annie Hall (1977)
            oscarPotential: 25,
            scandalRisk: 5,
            chemistry: 86,
            pairings: ['ellis_yorke', 'newton_barrington'],
            rivalries: [],
            quirks: ['signature menswear style', 'self-deprecating', 'Allen muse'],
            description: 'The most original screen presence of her generation. Fairweather\'s quirky charm, distinctive fashion sense, and natural comic timing created Annie Hall, one of cinema\'s most beloved characters. Her dramatic range surprised everyone.'
        },

        // ========================================================================
        // 1980s STARS - Blockbuster Era Icons
        // ========================================================================

        harrison_ford: {
            id: 'quincy_galloway',
            name: 'Quincy Galloway',
            gender: 'male',
            starPower: 97,
            weeklyRate: 75000,
            genres: ['action', 'adventure', 'sci_fi', 'thriller', 'drama'],
            specialties: ['reluctant hero', 'everyman toughness', 'dry humor'],
            typeCast: 'Reluctant heroes thrust into adventure',
            availableFrom: 1977,
            availableTo: 2010,
            oscarPotential: 15,
            scandalRisk: 6,
            chemistry: 85,
            pairings: ['carrie_fisher', 'karen_allen', 'lyle_uxbridge'],
            rivalries: [],
            quirks: ['former carpenter', 'private person', 'planes and crashes', 'grumpy interviews'],
            description: 'The biggest movie star of the blockbuster era. Ford\'s everyman appeal and dry humor made Han Solo and Indiana Jones into cultural icons. His ability to seem like a regular guy doing extraordinary things was unmatched.'
        },

        meryl_streep: {
            id: 'fern_hartline',
            name: 'Fern Hartline',
            gender: 'female',
            starPower: 93,
            weeklyRate: 60000,
            genres: ['drama', 'comedy', 'romance', 'thriller'],
            specialties: ['accent mastery', 'total transformation', 'emotional precision'],
            typeCast: 'Complex women in dramatic situations',
            availableFrom: 1978,
            availableTo: 2010,
            oscarWinner: true, // Kramer vs. Kramer (1979), Sophie's Choice (1982)
            oscarPotential: 40,
            scandalRisk: 2,
            chemistry: 88,
            pairings: ['phineas_devereaux', 'mordecai_ashcroft'],
            rivalries: [],
            quirks: ['accent perfectionist', 'most nominated ever', 'versatility incarnate'],
            description: 'Widely considered the greatest living actress. Hartline\'s chameleon-like ability to disappear into any role, era, or accent is unmatched. Her Oscar record will likely never be broken.'
        },

        tom_hanks: {
            id: 'roscoe_ingersoll',
            name: 'Roscoe Ingersoll',
            gender: 'male',
            starPower: 96,
            weeklyRate: 100000,
            genres: ['drama', 'comedy', 'war', 'romance', 'thriller'],
            specialties: ['everyman warmth', 'likability', 'emotional honesty'],
            typeCast: 'Decent men facing extraordinary circumstances',
            availableFrom: 1984,
            availableTo: 2010,
            oscarWinner: true, // Philadelphia (1993), Forrest Gump (1994)
            oscarPotential: 30,
            scandalRisk: 1,
            chemistry: 90,
            pairings: ['meg_ryan', 'wilson_the_volleyball'],
            rivalries: [],
            quirks: ['America\'s dad', 'back-to-back Oscars', 'typewriter collector'],
            description: 'America\'s most beloved actor. Hanks\'s natural warmth and emotional authenticity transformed him from comic actor to dramatic powerhouse. His consecutive Oscar wins cemented his status as the modern Walter Fairweather.'
        },

        sigourney_weaver: {
            id: 'greta_jessup',
            name: 'Greta Jessup',
            gender: 'female',
            starPower: 84,
            weeklyRate: 50000,
            genres: ['sci_fi', 'action', 'drama', 'comedy'],
            specialties: ['physical toughness', 'intelligence', 'genre-defying'],
            typeCast: 'Strong, intelligent women in extraordinary situations',
            availableFrom: 1979,
            availableTo: 2010,
            oscarPotential: 20,
            scandalRisk: 3,
            chemistry: 80,
            pairings: ['bill_murray'],
            rivalries: [],
            quirks: ['sci-fi queen', 'feminist icon', 'Yale-trained'],
            description: 'The woman who proved female action heroes could carry blockbusters. Jessup\'s Ripley in Alien shattered gender barriers in sci-fi and action. Her intelligence and physical presence redefined what a leading lady could be.'
        },

        eddie_murphy: {
            id: 'sylvan_kingsford',
            name: 'Sylvan Kingsford',
            gender: 'male',
            starPower: 93,
            weeklyRate: 80000,
            genres: ['comedy', 'action', 'crime', 'animated'],
            specialties: ['comic genius', 'multiple characters', 'street-smart charm'],
            typeCast: 'Fast-talking comic heroes',
            availableFrom: 1982,
            availableTo: 2010,
            oscarPotential: 12,
            scandalRisk: 18,
            chemistry: 82,
            pairings: ['nick_nolte', 'dan_aykroyd'],
            rivalries: [],
            quirks: ['SNL breakout', 'standup legend', 'multiple-role films'],
            description: 'The most bankable comedian of the 1980s. Kingsford\'s explosive energy and fearless comedy made him a superstar before he turned 25. His box office dominance in the 1980s was rivaled only by Zeller.'
        },

        michael_douglas: {
            id: 'thaddeus_lockridge',
            name: 'Thaddeus Lockridge',
            gender: 'male',
            starPower: 87,
            weeklyRate: 55000,
            genres: ['drama', 'thriller', 'crime', 'romance'],
            specialties: ['alpha male charisma', 'moral ambiguity', 'corporate intensity'],
            typeCast: 'Powerful men at moral crossroads',
            availableFrom: 1979,
            availableTo: 2010,
            oscarWinner: true, // Wall Street (1987)
            oscarPotential: 22,
            scandalRisk: 15,
            chemistry: 83,
            pairings: ['kathleen_turner', 'sharon_stone'],
            rivalries: [],
            quirks: ['producer-actor', 'father\'s shadow', 'tabloid personal life'],
            description: 'The definitive 1980s alpha male. Lockridge\'s Gordon Gekko became the icon of Reagan-era excess. His ability to make morally compromised characters charismatic and compelling was his greatest gift.'
        },

        // ========================================================================
        // 1990s STARS - Indie Revolution and Global Stardom
        // ========================================================================

        denzel_washington: {
            id: 'ulysses_marlowe',
            name: 'Ulysses Marlowe',
            gender: 'male',
            starPower: 95,
            weeklyRate: 120000,
            genres: ['drama', 'thriller', 'crime', 'action', 'war'],
            specialties: ['commanding presence', 'moral authority', 'quiet intensity'],
            typeCast: 'Men of principle facing impossible choices',
            availableFrom: 1989,
            availableTo: 2010,
            oscarWinner: true, // Glory (1989), Training Day (2001)
            oscarPotential: 32,
            scandalRisk: 3,
            chemistry: 88,
            pairings: ['vivian_norwood', 'ethan_hawke'],
            rivalries: [],
            quirks: ['methodical preparation', 'refuses villain roles (mostly)', 'quiet dignity'],
            description: 'The most respected actor of his generation. Marlowe\'s commanding presence and quiet intensity brought dignity and complexity to every role. His Oscar for Training Day proved he could play against type brilliantly.'
        },

        julia_roberts: {
            id: 'vivian_norwood',
            name: 'Vivian Norwood',
            gender: 'female',
            starPower: 94,
            weeklyRate: 150000,
            genres: ['romance', 'comedy', 'drama', 'thriller'],
            specialties: ['megawatt smile', 'everywoman appeal', 'romantic chemistry'],
            typeCast: 'Spirited women who triumph against odds',
            availableFrom: 1988,
            availableTo: 2010,
            oscarWinner: true, // Erin Brockovich (2000)
            oscarPotential: 22,
            scandalRisk: 14,
            chemistry: 92,
            pairings: ['richard_gere', 'hugh_grant', 'ulysses_marlowe'],
            rivalries: [],
            quirks: ['biggest female star', 'runaway bride reputation', 'infectious laugh'],
            description: 'America\'s Sweetheart. Norwood\'s megawatt smile and natural charm made her the highest-paid actress in Hollywood. Pretty Woman created a modern fairy tale, and her box office power was unprecedented for a female star.'
        },

        brad_pitt: {
            id: 'virgil_ogilvie',
            name: 'Virgil Ogilvie',
            gender: 'male',
            starPower: 94,
            weeklyRate: 150000,
            genres: ['drama', 'crime', 'thriller', 'action', 'comedy'],
            specialties: ['movie star charisma', 'character actor instincts', 'physical presence'],
            typeCast: 'Charismatic men in morally complex situations',
            availableFrom: 1991,
            availableTo: 2010,
            oscarPotential: 25,
            scandalRisk: 18,
            chemistry: 88,
            pairings: ['cyrus_thornbury', 'edward_norton'],
            rivalries: [],
            quirks: ['tabloid magnet', 'produces serious films', 'snacks on set'],
            description: 'The rare combination of matinee idol looks and serious acting ambition. Pitt\'s willingness to take risks with Fight Club, Se7en, and Snatch proved there was real talent behind the pretty face.'
        },

        samuel_l_jackson: {
            id: 'wendell_prescott',
            name: 'Wendell Prescott',
            gender: 'male',
            starPower: 90,
            weeklyRate: 100000,
            genres: ['action', 'crime', 'thriller', 'drama', 'sci_fi'],
            specialties: ['commanding voice', 'explosive energy', 'cool authority'],
            typeCast: 'Intense, authoritative figures',
            availableFrom: 1991,
            availableTo: 2010,
            oscarPotential: 20,
            scandalRisk: 6,
            chemistry: 85,
            pairings: ['john_travolta', 'bruce_willis'],
            rivalries: [],
            quirks: ['Dellamore favorite', 'most prolific A-lister', 'golf obsession'],
            description: 'The hardest working man in Hollywood. Jackson\'s Pulp Fiction breakthrough launched one of the most prolific careers in film history. His commanding voice and explosive presence make every film better.'
        },

        jodie_foster: {
            id: 'dorothea_quimby',
            name: 'Dorothea Quimby',
            gender: 'female',
            starPower: 88,
            weeklyRate: 90000,
            genres: ['thriller', 'drama', 'crime'],
            specialties: ['fierce intelligence', 'quiet strength', 'psychological depth'],
            typeCast: 'Brilliant, determined women facing danger',
            availableFrom: 1988,
            availableTo: 2010,
            oscarWinner: true, // The Accused (1988), Silence of the Lambs (1991)
            oscarPotential: 30,
            scandalRisk: 5,
            chemistry: 80,
            pairings: ['anthony_hopkins'],
            rivalries: [],
            quirks: ['child star turned auteur', 'fiercely private', 'Yale graduate', 'directs too'],
            description: 'The most cerebral star in Hollywood. Foster\'s fierce intelligence and quiet intensity made Clarice Starling one of cinema\'s greatest heroes. Her transition from child star to two-time Oscar winner was remarkable.'
        },

        will_smith: {
            id: 'alonzo_redmond',
            name: 'Alonzo Redmond',
            gender: 'male',
            starPower: 95,
            weeklyRate: 200000,
            genres: ['action', 'comedy', 'sci_fi', 'drama'],
            specialties: ['megastar charisma', 'comic timing', 'action credibility'],
            typeCast: 'Charismatic everyman saving the world',
            availableFrom: 1993,
            availableTo: 2010,
            oscarPotential: 20,
            scandalRisk: 8,
            chemistry: 88,
            pairings: ['martin_lawrence', 'tommy_lee_jones'],
            rivalries: [],
            quirks: ['July 4th box office king', 'rapper turned actor', 'family brand'],
            description: 'The biggest movie star of the late 1990s. Smith\'s combination of action credibility, comic timing, and genuine warmth made him the most bankable star on Earth. Independence Day and Men in Black defined summer blockbusters.'
        },

        // ========================================================================
        // 2000s STARS - Global Franchise Era
        // ========================================================================

        leonardo_dicaprio: {
            id: 'bertram_sinclair',
            name: 'Bertram Sinclair',
            gender: 'male',
            starPower: 97,
            weeklyRate: 300000,
            genres: ['drama', 'thriller', 'crime', 'adventure', 'sci_fi'],
            specialties: ['intense commitment', 'tortured characters', 'prestige projects'],
            typeCast: 'Driven men consumed by obsession',
            availableFrom: 1993,
            availableTo: 2010,
            oscarPotential: 35,
            scandalRisk: 10,
            chemistry: 85,
            pairings: ['kate_winslet', 'evelyn_underhill'],
            rivalries: [],
            quirks: ['Umberside partnership', 'environmental activism', 'model girlfriends', 'Oscar quest'],
            description: 'The most dedicated actor of his generation. Sinclair survived teen heartthrob status to become the go-to leading man for prestige cinema. His Umberside collaborations and intense commitment to every role cemented his legacy.'
        },

        george_clooney: {
            id: 'cyrus_thornbury',
            name: 'Cyrus Thornbury',
            gender: 'male',
            starPower: 91,
            weeklyRate: 200000,
            genres: ['drama', 'thriller', 'crime', 'comedy'],
            specialties: ['old Hollywood charm', 'intelligence', 'producer instincts'],
            typeCast: 'Charming, intelligent men of principle',
            availableFrom: 1996,
            availableTo: 2010,
            oscarWinner: true, // Syriana (2005)
            oscarPotential: 25,
            scandalRisk: 8,
            chemistry: 90,
            pairings: ['virgil_ogilvie', 'matt_damon'],
            rivalries: [],
            quirks: ['prankster', 'political activist', 'refuses superhero return', 'old-school star'],
            description: 'The last old-school movie star. Thornbury\'s Raymond Ellsworth-like charm and intelligence made him a throwback to Golden Age Hollywood. His dual career as actor and producer-director showed rare ambition and social conscience.'
        },

        cate_blanchett: {
            id: 'evelyn_underhill',
            name: 'Evelyn Underhill',
            gender: 'female',
            starPower: 90,
            weeklyRate: 150000,
            genres: ['drama', 'fantasy', 'thriller', 'romance'],
            specialties: ['chameleon transformations', 'regal presence', 'theatrical power'],
            typeCast: 'Powerful women of intelligence and mystery',
            availableFrom: 1998,
            availableTo: 2010,
            oscarWinner: true, // The Aviator (2004)
            oscarPotential: 35,
            scandalRisk: 3,
            chemistry: 85,
            pairings: ['bertram_sinclair', 'virgil_ogilvie'],
            rivalries: [],
            quirks: ['Australian theater roots', 'fearless role choices', 'effortless elegance'],
            description: 'The most versatile actress of her generation. Underhill\'s ability to transform into anyone from Queen Elizabeth to Bob Dylan to an elf queen demonstrated range that few can match. Her theatrical training gave her extraordinary power.'
        },

        angelina_jolie: {
            id: 'constance_vandermeer',
            name: 'Constance Vandermeer',
            gender: 'female',
            starPower: 93,
            weeklyRate: 200000,
            genres: ['action', 'drama', 'thriller', 'adventure'],
            specialties: ['fierce physicality', 'dark beauty', 'humanitarian image'],
            typeCast: 'Dangerous, beautiful women of action',
            availableFrom: 1999,
            availableTo: 2010,
            oscarWinner: true, // Girl, Interrupted (1999)
            oscarPotential: 22,
            scandalRisk: 20,
            chemistry: 85,
            pairings: ['virgil_ogilvie'],
            rivalries: [],
            quirks: ['humanitarian missions', 'tabloid magnet', 'action star credibility', 'directs too'],
            description: 'The most famous woman in the world. Vandermeer\'s combination of dark beauty, fearless physicality, and genuine humanitarian work made her a global icon. Her Lara Croft proved women could carry action franchises.'
        },

        johnny_depp: {
            id: 'dexter_whitfield',
            name: 'Dexter Whitfield',
            gender: 'male',
            starPower: 95,
            weeklyRate: 250000,
            genres: ['adventure', 'fantasy', 'drama', 'comedy', 'horror'],
            specialties: ['eccentric characters', 'physical comedy', 'Hollis Birchall muse'],
            typeCast: 'Eccentric outsiders and charming rogues',
            availableFrom: 1990,
            availableTo: 2010,
            oscarPotential: 25,
            scandalRisk: 15,
            chemistry: 82,
            pairings: ['helena_bonham_carter', 'orlando_bloom'],
            rivalries: [],
            quirks: ['Burton collaborator', 'character actor in star body', 'pirate lifestyle', 'Keith Richards fan'],
            description: 'Hollywood\'s most eccentric leading man. Depp\'s willingness to disappear into bizarre characters made him an unlikely blockbuster star. Captain Jack Sparrow turned a theme park ride into a billion-dollar franchise.'
        }
    };

    /**
     * ============================================================================
     * DIRECTOR DATABASE - 35+ FILMMAKERS FROM THE GOLDEN AGE
     * ============================================================================
     */
    const DIRECTORS = {

        // ========================================================================
        // MASTER DIRECTORS (Talent: 90-99) - The Legends
        // ========================================================================

        frank_capra: {
            id: 'ezra_yardley',
            name: 'Ezra Yardley',
            talent: 95,
            weeklyRate: 5000,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1942-1945
            oscarWinner: true, // It Happened One Night (1934), Mr. Deeds (1936), You Can't Take It With You (1938)
            oscarPotential: 35,
            scandalRisk: 5,
            specialties: ['uplifting', 'populist', 'heartwarming', 'common man heroes'],
            description: 'Master of Americana and populist fables. Yardley\'s films celebrate the common man standing up to corruption and cynicism. His sentimental optimism and brilliant comic timing made him the top director of the 1930s.'
        },

        john_ford: {
            id: 'fletcher_ashford',
            name: 'Fletcher Ashford',
            talent: 97,
            weeklyRate: 5500,
            genres: ['western', 'drama', 'war'],
            availableFrom: 1933,
            availableTo: 1966, // 7 Women (1966) was final film
            draftRisk: true, // Made war documentaries 1941-1945
            oscarWinner: true, // The Informer (1935), Grapes of Wrath (1940), How Green Was My Valley (1941)
            oscarPotential: 38,
            scandalRisk: 8,
            specialties: ['visual poetry', 'americana', 'epic', 'Monument Valley'],
            description: 'The greatest visual poet in cinema history. Ford\'s westerns and dramas defined American mythology. His use of Monument Valley, brilliant compositions, and stock company of actors created timeless masterpieces. Difficult and alcoholic.'
        },

        howard_hawks: {
            id: 'gideon_blackwood',
            name: 'Gideon Blackwood',
            talent: 94,
            weeklyRate: 4800,
            genres: ['comedy', 'western', 'noir', 'adventure', 'crime'],
            availableFrom: 1933,
            availableTo: 1970, // Rio Lobo (1970) was final film
            oscarPotential: 18,
            scandalRisk: 6,
            specialties: ['dialogue', 'professionalism', 'strong women', 'overlapping talk'],
            description: 'The ultimate genre master and professional. Blackwood excelled at everything - screwball comedy, westerns, noir, war films. His rapid-fire dialogue, strong women, and celebration of professionalism made every film distinctive.'
        },

        alfred_hitchcock: {
            id: 'horace_carmichael',
            name: 'Horace Carmichael',
            talent: 99,
            weeklyRate: 6500,
            genres: ['thriller', 'noir', 'suspense', 'crime'],
            availableFrom: 1940, // Came to Hollywood in 1939
            availableTo: 1976, // Family Plot (1976) was final film
            oscarPotential: 25, // Never won competitive Oscar!
            scandalRisk: 8,
            specialties: ['suspense', 'visual storytelling', 'psychology', 'MacGuffins'],
            budgetRisk: false,
            description: 'The Master of Suspense. Carmichael\'s mathematical precision, visual brilliance, and psychological insight made him the supreme thriller director. His use of suspense over surprise and visual storytelling was revolutionary. Brilliant but cruel to actors.'
        },

        billy_wilder: {
            id: 'ignatius_draper',
            name: 'Ignatius Draper',
            talent: 96,
            weeklyRate: 5200,
            genres: ['noir', 'comedy', 'drama', 'satire'],
            availableFrom: 1942, // Directorial debut
            availableTo: 1978, // Fedora (1978) was last notable film
            oscarWinner: true, // The Lost Weekend (1945)
            oscarPotential: 36,
            scandalRisk: 10,
            specialties: ['cynicism', 'wit', 'dark comedy', 'Austrian precision'],
            description: 'Cynical genius who perfected dark comedy and film noir. Draper\'s European sophistication and bitter wit created unique American films. His scripts were surgical in their precision, his characters deeply flawed and human.'
        },

        william_wyler: {
            id: 'jules_everhart',
            name: 'Jules Everhart',
            talent: 94,
            weeklyRate: 5000,
            genres: ['drama', 'romance', 'war', 'western'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1942-1945
            oscarWinner: true, // Mrs. Miniver (1942), The Best Years of Our Lives (1946)
            oscarPotential: 35,
            scandalRisk: 6,
            specialties: ['prestige', 'literary adaptations', 'depth of field', 'perfectionism'],
            description: 'Meticulous craftsman known for endless retakes. Everhart\'s deep focus photography and perfectionism drove actors crazy but won Oscars. His literary adaptations and prestige dramas set the standard for quality filmmaking.'
        },

        george_cukor: {
            id: 'kingsley_fontelle',
            name: 'Kingsley Fontelle',
            talent: 91,
            weeklyRate: 4500,
            genres: ['comedy', 'drama', 'romance', 'melodrama'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 22,
            scandalRisk: 12,
            specialties: ['women\'s pictures', 'sophisticated dialogue', 'actor direction', 'drawing room comedy'],
            description: 'The women\'s director who brought out brilliant performances. Fontelle\'s sophisticated touch and understanding of actresses made him the favorite of Hollywood\'s leading ladies. His homosexuality was an open secret.'
        },

        victor_fleming: {
            id: 'lemuel_granger',
            name: 'Lemuel Granger',
            talent: 90,
            weeklyRate: 4400,
            genres: ['adventure', 'drama', 'romance', 'epic'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Gone with the Wind (1939)
            oscarPotential: 28,
            scandalRisk: 10,
            specialties: ['epic scale', 'masculine adventure', 'Technicolor spectacle', 'star wrangling'],
            description: 'The master of epic spectacle and masculine adventure. Granger directed both Gone with the Wind and The Wizard of Oz in 1939 - the most remarkable year in film history. His masculine, no-nonsense style contrasted with his romantic subjects.'
        },

        // ========================================================================
        // A-LIST DIRECTORS (Talent: 80-89) - The Established Masters
        // ========================================================================

        orson_welles: {
            id: 'vincent_halloway',
            name: 'Vincent Halloway',
            talent: 98, // Genius but difficult
            weeklyRate: 6000,
            genres: ['drama', 'noir', 'thriller'],
            availableFrom: 1941, // Citizen Kane
            availableTo: 1949,
            oscarWinner: true, // Citizen Kane screenplay (1941)
            oscarPotential: 30,
            scandalRisk: 20,
            specialties: ['innovation', 'visual brilliance', 'controversy', 'deep focus'],
            budgetRisk: true, // Often over budget and over schedule
            description: 'The boy genius who revolutionized cinema at 25. Halloway\' Citizen Kane changed film language forever, but his arrogance and perfectionism made him unemployable. A brilliant, impossible talent whose vision exceeded studio patience.'
        },

        preston_sturges: {
            id: 'harold_ives',
            name: 'Harold Ives',
            talent: 91,
            weeklyRate: 4600,
            genres: ['comedy', 'satire', 'screwball'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarWinner: true, // The Great McGinty screenplay (1940)
            oscarPotential: 24,
            scandalRisk: 14,
            specialties: ['screwball', 'satire', 'rapid dialogue', 'stock company'],
            description: 'Comedy innovator who became first screenwriter-director. Ives\' rapid-fire dialogue and satirical edge revolutionized comedy. His stock company of character actors and sophisticated wit made his 1940-44 run the greatest in comedy history.'
        },

        john_huston: {
            id: 'raymond_jennings',
            name: 'Raymond Jennings',
            talent: 92,
            weeklyRate: 4700,
            genres: ['noir', 'drama', 'adventure', 'war'],
            availableFrom: 1941,
            availableTo: 1949,
            draftRisk: true, // Made war documentaries 1942-1945
            oscarWinner: true, // The Treasure of the Sierra Madre (1948)
            oscarPotential: 32,
            scandalRisk: 18,
            specialties: ['hard-boiled', 'literary adaptation', 'male bonding', 'adventure'],
            description: 'Adventure storyteller and masculine filmmaker. Jennings\'s hard-boiled sensibility and love of male bonding rituals created distinctive films. A writer-director who respected literature and brought literary quality to tough genres.'
        },

        michael_curtiz: {
            id: 'walter_kessler',
            name: 'Walter Kessler',
            talent: 88,
            weeklyRate: 4000,
            genres: ['drama', 'adventure', 'war', 'musical', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Casablanca (1943)
            oscarPotential: 26,
            scandalRisk: 8,
            specialties: ['versatility', 'pace', 'professionalism', 'studio workhorse'],
            description: 'The ultimate studio workhorse who could do anything. Kessler directed hundreds of films in every genre with speed and professionalism. His Hungarian-mangled English was legendary, but his visual sense and pace were flawless.'
        },

        ernst_lubitsch: {
            id: 'eugene_lindqvist',
            name: 'Eugene Lindqvist',
            talent: 93,
            weeklyRate: 4800,
            genres: ['comedy', 'romance', 'musical'],
            availableFrom: 1933,
            availableTo: 1947, // Died 1947
            oscarPotential: 22,
            scandalRisk: 6,
            specialties: ['sophistication', 'the lubitsch touch', 'wit', 'continental elegance'],
            description: 'Master of innuendo and sophisticated comedy. Lindqvist\'s "touch" - suggesting sex and scandal through wit and visual subtlety - made him unique. His European sophistication brought elegance to American comedy. The directors\' director.'
        },

        king_vidor: {
            id: 'chester_merriweather',
            name: 'Chester Merriweather',
            talent: 90,
            weeklyRate: 4400,
            genres: ['drama', 'war', 'western', 'epic'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 24,
            scandalRisk: 10,
            specialties: ['visual grandeur', 'social consciousness', 'epic scale', 'montage'],
            description: 'Visionary director of epic scope and social conscience. Merriweather\'s films combined spectacular visuals with social commentary. His silent masterpieces influenced all directors, and his sound films maintained his visual brilliance.'
        },

        leo_mccarey: {
            id: 'howard_northgate',
            name: 'Howard Northgate',
            talent: 89,
            weeklyRate: 4200,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // The Awful Truth (1937), Going My Way (1944)
            oscarPotential: 30,
            scandalRisk: 8,
            specialties: ['improvisation', 'warmth', 'sentiment', 'comedy-drama balance'],
            description: 'Master of improvisation and heartfelt comedy-drama. Northgate let actors improvise and captured magical moments. His ability to balance tears and laughter, sentiment and comedy, made him unique. Directors worshipped his instinct.'
        },

        raoul_walsh: {
            id: 'franklin_oakhurst',
            name: 'Franklin Oakhurst',
            talent: 86,
            weeklyRate: 3800,
            genres: ['western', 'adventure', 'war', 'crime'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 12,
            specialties: ['action', 'masculine energy', 'outdoor adventure', 'pace'],
            description: 'One-eyed action master and masculine filmmaker. Oakhurst directed with enormous energy and visual flair. His adventures and westerns moved like locomotives, his male characters were vital and energetic. Lost an eye in 1928, wore eyepatch forever.'
        },

        rouben_mamoulian: {
            id: 'leonard_pemberton',
            name: 'Leonard Pemberton',
            talent: 87,
            weeklyRate: 3900,
            genres: ['musical', 'drama', 'romance', 'horror'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 7,
            specialties: ['visual innovation', 'Technicolor pioneer', 'stylization', 'theatricality'],
            description: 'Innovative stylist and Technicolor pioneer. Pemberton brought theatrical imagination to film with bold visual experimentation. His use of color, sound, and stylization influenced all filmmakers. Difficult and fired from Cleopatra.'
        },

        clarence_brown: {
            id: 'martin_quill',
            name: 'Martin Quill',
            talent: 84,
            weeklyRate: 3600,
            genres: ['drama', 'romance', 'melodrama'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 20,
            scandalRisk: 5,
            specialties: ['women\'s pictures', 'prestige drama', 'Lindqvist films', 'subtle direction'],
            description: 'MGM\'s most elegant director of women\'s pictures. Brown directed Lindqvist\'s greatest films and brought subtle, sophisticated touch to melodrama. His visual elegance and restraint made him the studio\'s prestige director.'
        },

        george_stevens: {
            id: 'russell_rutledge',
            name: 'Birchall Rutledge',
            talent: 88,
            weeklyRate: 4100,
            genres: ['comedy', 'drama', 'romance', 'western'],
            availableFrom: 1933,
            availableTo: 1949,
            draftRisk: true, // War photographer 1943-1945
            oscarPotential: 26,
            scandalRisk: 6,
            specialties: ['visual beauty', 'perfectionism', 'genre mastery', 'tonal balance'],
            description: 'Meticulous craftsman who mastered every genre. Stevens brought visual beauty and emotional depth to comedy, drama, and westerns. His war photography changed him - postwar films became darker and more profound. Slow but brilliant.'
        },

        mervyn_leroy: {
            id: 'theodore_sterling',
            name: 'Theodore Sterling',
            talent: 83,
            weeklyRate: 3500,
            genres: ['drama', 'crime', 'musical', 'biography'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 7,
            specialties: ['social problem films', 'gangster films', 'versatility', 'pace'],
            description: 'Warner Bros. workhorse who pioneered social problem films. Sterling\'s Little Caesar and I Am a Fugitive launched the gangster cycle. His versatility and professionalism made him invaluable, though he lacked distinctive style.'
        },

        // ========================================================================
        // B-LIST DIRECTORS (Talent: 70-79) - The Skilled Craftsmen
        // ========================================================================

        jacques_tourneur: {
            id: 'bernard_trelawney',
            name: 'Bernard Trelawney',
            talent: 82,
            weeklyRate: 3200,
            genres: ['noir', 'horror', 'thriller', 'western'],
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 5,
            specialties: ['atmosphere', 'shadows', 'psychological horror', 'RKO horror unit'],
            description: 'Atmospheric stylist and master of shadows. Trelawney\'s Cat People and other Val Lewton productions proved horror could be poetic and psychological. His use of darkness and suggestion influenced all noir and horror filmmakers.'
        },

        edward_dmytryk: {
            id: 'stanley_upshaw',
            name: 'Stanley Upshaw',
            talent: 78,
            weeklyRate: 2800,
            genres: ['noir', 'drama', 'thriller', 'war'],
            availableFrom: 1939,
            availableTo: 1949,
            huacRisk: true, // One of the Hollywood Ten - blacklisted!
            oscarPotential: 14,
            scandalRisk: 16,
            specialties: ['social issues', 'noir style', 'message pictures', 'visual flair'],
            description: 'Social realist and noir stylist. Upshaw brought liberal politics and visual flair to B-movies and message pictures. His communist ties made him one of the Hollywood Ten - he would be blacklisted and imprisoned in 1950.'
        },

        robert_siodmak: {
            id: 'roland_valentine',
            name: 'Roland Valentine',
            talent: 84,
            weeklyRate: 3400,
            genres: ['noir', 'thriller', 'crime', 'horror'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 8,
            specialties: ['expressionism', 'shadows', 'fatalism', 'German style'],
            description: 'German émigré who brought expressionism to film noir. Valentine\'s shadowy visual style and fatalistic worldview made him the ultimate noir director. His use of darkness, mirrors, and subjective camera work was revolutionary.'
        },

        edgar_g_ulmer: {
            id: 'everett_westbrook',
            name: 'Everett Westbrook',
            talent: 79,
            weeklyRate: 1800,
            genres: ['noir', 'horror', 'melodrama', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 4,
            scandalRisk: 12,
            specialties: ['poverty row genius', 'resourcefulness', 'visual style on no budget', 'European artistry'],
            description: 'The Poverty Row genius who made masterpieces with no money. Westbrook\'s affair with a producer\'s wife exiled him to low-budget hell, where he created visual poetry on shoestring budgets. Detour proved art transcends money.'
        },

        anthony_mann: {
            id: 'milton_youngblood',
            name: 'Milton Youngblood',
            talent: 80,
            weeklyRate: 2600,
            genres: ['noir', 'western', 'thriller', 'crime'],
            availableFrom: 1942,
            availableTo: 1949,
            oscarPotential: 14,
            scandalRisk: 6,
            specialties: ['visual intensity', 'psychological westerns', 'noir style', 'violence'],
            description: 'Rising talent bringing noir intensity to westerns. Mann\'s B-noirs showed visual flair and psychological depth. His 1950s westerns would revolutionize the genre with psychological complexity and visual grandeur.'
        },

        jules_dassin: {
            id: 'lawrence_abernathy',
            name: 'Lawrence Abernathy',
            talent: 81,
            weeklyRate: 2900,
            genres: ['noir', 'crime', 'drama', 'thriller'],
            availableFrom: 1942,
            availableTo: 1949,
            huacRisk: true, // Would be blacklisted in 1950
            oscarPotential: 16,
            scandalRisk: 14,
            specialties: ['location shooting', 'documentary realism', 'social consciousness', 'heist films'],
            description: 'Realistic noir director who pioneered location shooting. Abernathy brought documentary authenticity to crime films with location work in real cities. His leftist politics would get him blacklisted after his masterpiece The Naked City.'
        },

        joseph_h_lewis: {
            id: 'hugh_bellweather',
            name: 'Hugh Bellweather',
            talent: 77,
            weeklyRate: 2200,
            genres: ['noir', 'western', 'crime', 'B-movies'],
            availableFrom: 1937,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 7,
            specialties: ['visual experimentation', 'B-movie artistry', 'subjective camera', 'low budgets'],
            description: 'B-movie auteur with avant-garde visual sense. Lewis brought experimental camera work and visual brilliance to poverty row productions. His Gun Crazy would become a cult masterpiece showing art could flourish in B-movies.'
        },

        andre_de_toth: {
            id: 'cornelius_crowninshield',
            name: 'Cornelius Crowninshield',
            talent: 76,
            weeklyRate: 2400,
            genres: ['western', 'noir', 'adventure', 'war'],
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 10,
            scandalRisk: 10,
            specialties: ['tough action', 'no-nonsense style', 'masculine films', 'Hungarian émigré'],
            description: 'One-eyed Hungarian director of tough action films. De Toth brought Continental flair and masculine energy to westerns and noir. Ironically directed the first 3-D film despite having one eye and no depth perception.'
        },

        robert_wise: {
            id: 'preston_dunmore',
            name: 'Preston Dunmore',
            talent: 79,
            weeklyRate: 2500,
            genres: ['noir', 'horror', 'drama', 'thriller'],
            availableFrom: 1944,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 5,
            specialties: ['editing background', 'visual intelligence', 'genre mastery', 'rising talent'],
            description: 'Former editor bringing visual intelligence to direction. Wise edited Citizen Kane before directing for Val Lewton\'s horror unit. His visual sense and professionalism marked him as future major director. Best work came in 1950s-60s.'
        },

        henry_hathaway: {
            id: 'emmett_eastgate',
            name: 'Emmett Eastgate',
            talent: 78,
            weeklyRate: 2700,
            genres: ['western', 'noir', 'adventure', 'crime'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 9,
            specialties: ['location shooting', 'toughness', 'outdoor action', 'no-nonsense'],
            description: 'Tough professional who pioneered location shooting. Eastgate brought outdoor authenticity and muscular direction to westerns and noir. Known for being tough on actors but delivering solid commercial entertainment on schedule.'
        },

        // ========================================================================
        // CONTRACT DIRECTORS (Talent: 55-69) - The Reliable Workhorses
        // ========================================================================

        william_castle: {
            id: 'gilbert_farnsworth',
            name: 'Gilbert Farnsworth',
            talent: 68,
            weeklyRate: 1600,
            genres: ['thriller', 'crime', 'horror', 'B-movies'],
            availableFrom: 1943,
            availableTo: 1949,
            oscarPotential: 3,
            scandalRisk: 8,
            specialties: ['gimmicks', 'showmanship', 'B-movies', 'exploitation'],
            description: 'Showman and gimmick master. Castle brought carnival barker mentality to B-movies. His 1950s-60s gimmick films (theater seats wired with buzzers, skeletons flying over audiences) made him a legend. Solid craftsman beneath the hype.'
        },

        roy_william_neill: {
            id: 'clifford_hollingsworth',
            name: 'Clifford Hollingsworth',
            talent: 72,
            weeklyRate: 1900,
            genres: ['mystery', 'horror', 'thriller', 'crime'],
            availableFrom: 1933,
            availableTo: 1946, // Died 1946
            oscarPotential: 6,
            scandalRisk: 5,
            specialties: ['Sherlock Holmes series', 'atmospheric B-movies', 'efficient production'],
            description: 'Efficient B-movie director who made the Sherlock Holmes series. Hollingsworth brought atmospheric style and narrative efficiency to Universal\'s Holmes films with Basil Rathbone. Reliable studio workhorse who died suddenly in 1946.'
        },

        lew_landers: {
            id: 'vernon_ironwood',
            name: 'Vernon Ironwood',
            gender: 'male',
            talent: 65,
            weeklyRate: 1400,
            genres: ['western', 'crime', 'horror', 'B-movies'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 2,
            scandalRisk: 6,
            specialties: ['speed', 'efficiency', 'poverty row', 'versatility'],
            description: 'The fastest director in Hollywood. Ironwood cranked out hundreds of B-movies in every genre with incredible speed. No artistry, but efficient storytelling and professionalism. The ultimate poverty row workhorse who delivered on time and under budget.'
        },

        lambert_hillyer: {
            id: 'wallace_jasperson',
            name: 'Wallace Jasperson',
            talent: 67,
            weeklyRate: 1500,
            genres: ['western', 'crime', 'serial', 'B-movies'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 3,
            scandalRisk: 4,
            specialties: ['western programmers', 'efficient storytelling', 'low budgets'],
            description: 'Veteran western programmer director. Jasperson directed William S. Hart silents before cranking out B-westerns in the sound era. Efficient and professional, delivering solid entertainment for small-town theaters and second features.'
        },

        william_beaudine: {
            id: 'edmund_kirkwood',
            name: 'Edmund Kirkwood',
            talent: 64,
            weeklyRate: 1300,
            genres: ['comedy', 'drama', 'western', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 2,
            scandalRisk: 5,
            specialties: ['speed', 'one-take wonder', 'poverty row king', 'efficiency'],
            description: 'One-Shot Kirkwood - the fastest and cheapest director. Kirkwood made hundreds of films with incredible speed and minimal retakes. Started in silents, ended in TV. No artistry but amazing efficiency. The ultimate poverty row hack who kept working into the 1960s.'
        },

        sam_newfield: {
            id: 'reuben_loxley',
            name: 'Reuben Loxley',
            talent: 62,
            weeklyRate: 1200,
            genres: ['western', 'crime', 'horror', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 1,
            scandalRisk: 6,
            specialties: ['PRC workhorse', 'ultra-low budgets', 'speed', 'volume'],
            description: 'The most prolific director in history - over 250 films! Loxley ground out poverty row quickies for PRC with no pretense to art. The ultimate hack, but his volume and speed were legendary. Used multiple pseudonyms to hide his ubiquity.'
        },

        // ========================================================================
        // 1950s DIRECTORS - International Masters and Epic Storytellers
        // ========================================================================

        akira_kurosawa: {
            id: 'silas_montrose',
            name: 'Silas Montrose',
            talent: 98,
            weeklyRate: 6000,
            genres: ['drama', 'adventure', 'war', 'thriller'],
            availableFrom: 1950,
            availableTo: 1985,
            oscarPotential: 30,
            scandalRisk: 3,
            specialties: ['visual grandeur', 'samurai cinema', 'humanist philosophy', 'dynamic editing'],
            quirks: [],
            description: 'The Emperor of Japanese cinema. Montrose\'s Rashomon, Seven Samurai, and Yojimbo influenced every action filmmaker who followed. His dynamic visual style and humanist themes transcended language barriers.'
        },

        david_lean: {
            id: 'amos_nightingale',
            name: 'Amos Nightingale',
            talent: 96,
            weeklyRate: 8000,
            genres: ['drama', 'war', 'adventure', 'romance'],
            availableFrom: 1946,
            availableTo: 1984,
            oscarWinner: true, // Bridge on the River Kwai (1957), Lawrence of Arabia (1962)
            oscarPotential: 38,
            scandalRisk: 5,
            specialties: ['epic scope', 'landscape cinematography', 'intimate epic', 'perfectionism'],
            quirks: [],
            description: 'The supreme master of the epic film. Lean transformed from intimate British dramas to sweeping spectacles that defined cinema grandeur. Lawrence of Arabia remains the gold standard for epic filmmaking.'
        },

        elia_kazan: {
            id: 'clyde_ormsby',
            name: 'Clyde Ormsby',
            talent: 94,
            weeklyRate: 7000,
            genres: ['drama', 'romance'],
            availableFrom: 1947,
            availableTo: 1969,
            oscarWinner: true, // Gentleman's Agreement (1947), On the Waterfront (1954)
            oscarPotential: 35,
            scandalRisk: 20,
            specialties: ['Method directing', 'social realism', 'actor performances', 'controversial'],
            quirks: [],
            description: 'The director who brought Method acting to Hollywood. Ormsby\'s explosive collaborations with Islington and Dean changed film acting forever. His HUAC testimony made him the most controversial figure in Hollywood.'
        },

        // ========================================================================
        // 1960s DIRECTORS - Auteurs and Genre Revolutionaries
        // ========================================================================

        stanley_kubrick: {
            id: 'rudolph_pinkerton',
            name: 'Rudolph Pinkerton',
            talent: 99,
            weeklyRate: 15000,
            genres: ['sci_fi', 'war', 'horror', 'drama', 'thriller', 'crime'],
            availableFrom: 1956,
            availableTo: 1999,
            oscarPotential: 28, // Criminally under-awarded
            scandalRisk: 8,
            specialties: ['visual perfection', 'genre mastery', 'psychological depth', 'obsessive control'],
            quirks: [],
            description: 'Cinema\'s greatest perfectionist. Pinkerton\'s mathematical precision and obsessive control produced masterpieces in every genre he touched. From 2001 to The Shining to Full Metal Jacket, each film redefined its genre.'
        },

        roman_polanski: {
            id: 'conrad_quarles',
            name: 'Conrad Quarles',
            talent: 93,
            weeklyRate: 12000,
            genres: ['thriller', 'horror', 'noir', 'drama', 'crime'],
            availableFrom: 1962,
            availableTo: 2002,
            oscarWinner: true, // The Pianist (2002)
            oscarPotential: 30,
            scandalRisk: 35,
            specialties: ['paranoia', 'claustrophobia', 'psychological horror', 'European sensibility'],
            quirks: [],
            description: 'A brilliant, troubled genius. Quarles\'s ability to create unbearable tension and psychological horror produced Rosemary\'s Baby and Chinatown. His personal tragedies and scandals overshadowed extraordinary artistry.'
        },

        sergio_leone: {
            id: 'emil_silverton',
            name: 'Emil Silverton',
            talent: 94,
            weeklyRate: 10000,
            genres: ['western', 'crime', 'drama'],
            availableFrom: 1964,
            availableTo: 1984,
            oscarPotential: 20,
            scandalRisk: 4,
            specialties: ['extreme close-ups', 'Morricone scores', 'mythic westerns', 'operatic violence'],
            quirks: [],
            description: 'The man who reinvented the western. Silverton\'s Spaghetti Westerns with Clint Eastwood and his operatic crime epic Once Upon a Time in America created a new visual language. His extreme close-ups and Morricone scores were revolutionary.'
        },

        // ========================================================================
        // 1970s DIRECTORS - New Hollywood Mavericks
        // ========================================================================

        francis_ford_coppola: {
            id: 'casper_tanwood',
            name: 'Casper Tanwood',
            talent: 97,
            weeklyRate: 25000,
            genres: ['crime', 'drama', 'war', 'thriller'],
            availableFrom: 1969,
            availableTo: 1997,
            oscarWinner: true, // The Godfather (1972), The Godfather Part II (1974), Apocalypse Now (1979)
            oscarPotential: 38,
            scandalRisk: 15,
            specialties: ['family sagas', 'operatic drama', 'risk-taking', 'epic ambition'],
            quirks: [],
            description: 'The most ambitious director of New Hollywood. Tanwood bet everything on The Godfather and won, creating the greatest American film. His willingness to risk financial ruin for artistic vision was both his greatest strength and weakness.'
        },

        martin_scorsese: {
            id: 'ferdinand_umberside',
            name: 'Ferdinand Umberside',
            talent: 98,
            weeklyRate: 30000,
            genres: ['crime', 'drama', 'thriller', 'comedy'],
            availableFrom: 1973,
            availableTo: 2010,
            oscarWinner: true, // The Departed (2006)
            oscarPotential: 36,
            scandalRisk: 6,
            specialties: ['urban crime', 'tracking shots', 'rock music', 'moral complexity', 'De Niro/Sinclair'],
            quirks: [],
            description: 'American cinema\'s greatest living director. Umberside\'s kinetic visual style, masterful use of music, and unflinching examination of violence and guilt produced Taxi Driver, Goodfellas, and The Departed. His film preservation work is equally important.'
        },

        ridley_scott: {
            id: 'percival_vance',
            name: 'Percival Vance',
            talent: 90,
            weeklyRate: 25000,
            genres: ['sci_fi', 'action', 'war', 'drama', 'thriller'],
            availableFrom: 1977,
            availableTo: 2010,
            oscarPotential: 22,
            scandalRisk: 4,
            specialties: ['visual worldbuilding', 'atmosphere', 'production design', 'genre versatility'],
            quirks: [],
            description: 'The supreme visual stylist. Scott\'s Alien and Blade Runner created two of cinema\'s most influential visual worlds. His ability to build immersive atmospheres through production design and cinematography is unmatched.'
        },

        george_lucas: {
            id: 'barnaby_wexford',
            name: 'Barnaby Wexford',
            talent: 88,
            weeklyRate: 20000,
            genres: ['sci_fi', 'adventure', 'fantasy', 'action'],
            availableFrom: 1971,
            availableTo: 2005,
            oscarPotential: 18,
            scandalRisk: 3,
            specialties: ['worldbuilding', 'visual effects pioneer', 'mythology', 'franchise creation'],
            quirks: [],
            description: 'The man who changed movies forever. Wexford\'s Star Wars didn\'t just create a film franchise - it revolutionized visual effects, merchandising, and the entire business model of Hollywood. American Graffiti proved he could also make intimate films.'
        },

        woody_allen: {
            id: 'ellis_yorke',
            name: 'Ellis Yorke',
            talent: 92,
            weeklyRate: 15000,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1969,
            availableTo: 2010,
            oscarWinner: true, // Annie Hall (1977), Hannah and Her Sisters (1986)
            oscarPotential: 30,
            scandalRisk: 25,
            specialties: ['neurotic comedy', 'New York love letters', 'intellectual humor', 'prolific output'],
            quirks: [],
            description: 'America\'s most prolific auteur. Allen\'s neurotic comedies and New York love letters created a unique cinematic voice. Annie Hall redefined romantic comedy, and his annual film output was remarkable in its consistency.'
        },

        // ========================================================================
        // 1980s DIRECTORS - Blockbuster Masters
        // ========================================================================

        steven_spielberg: {
            id: 'foster_zeller',
            name: 'Foster Zeller',
            talent: 98,
            weeklyRate: 100000,
            genres: ['adventure', 'sci_fi', 'war', 'drama', 'thriller', 'action'],
            availableFrom: 1975,
            availableTo: 2010,
            oscarWinner: true, // Schindler's List (1993), Saving Private Ryan (1998)
            oscarPotential: 38,
            scandalRisk: 2,
            specialties: ['emotional storytelling', 'blockbuster craft', 'prestige and popcorn', 'visual wonder'],
            quirks: [],
            description: 'The most successful filmmaker in history. Zeller invented the modern blockbuster with Jaws and proved he could also make profound art with Schindler\'s List. His ability to combine spectacle with genuine emotion is unmatched.'
        },

        james_cameron: {
            id: 'grover_applewhite',
            name: 'Grover Applewhite',
            talent: 92,
            weeklyRate: 80000,
            genres: ['sci_fi', 'action', 'thriller', 'adventure'],
            availableFrom: 1984,
            availableTo: 2010,
            oscarWinner: true, // Titanic (1997)
            oscarPotential: 25,
            scandalRisk: 10,
            specialties: ['technical innovation', 'strong women', 'underwater obsession', 'box office records'],
            quirks: [],
            description: 'Hollywood\'s greatest technical innovator. Cameron\'s perfectionism and technological ambition produced Terminator, Aliens, and Titanic. His ability to push the boundaries of what\'s possible on screen is legendary, as is his on-set intensity.'
        },

        tim_burton: {
            id: 'hollis_birchall',
            name: 'Hollis Birchall',
            talent: 87,
            weeklyRate: 50000,
            genres: ['fantasy', 'horror', 'comedy', 'drama', 'animated'],
            availableFrom: 1985,
            availableTo: 2010,
            oscarPotential: 15,
            scandalRisk: 5,
            specialties: ['gothic aesthetic', 'outsider stories', 'visual imagination', 'Danny Elfman scores'],
            quirks: [],
            description: 'Hollywood\'s master of the gothic and grotesque. Burton\'s unique visual imagination created Edward Scissorhands, Batman, and Nightmare Before Christmas. His sympathy for outsiders and misfits gave his films unexpected emotional depth.'
        },

        // ========================================================================
        // 1990s DIRECTORS - Independent Voices
        // ========================================================================

        quentin_tarantino: {
            id: 'ives_dellamore',
            name: 'Ives Dellamore',
            talent: 94,
            weeklyRate: 60000,
            genres: ['crime', 'thriller', 'western', 'drama', 'action'],
            availableFrom: 1992,
            availableTo: 2010,
            oscarWinner: true, // Screenplay Oscars
            oscarPotential: 30,
            scandalRisk: 15,
            specialties: ['dialogue mastery', 'nonlinear storytelling', 'pop culture', 'genre revival'],
            quirks: [],
            description: 'The video store clerk who rewrote cinema. Dellamore\'s Pulp Fiction detonated like a bomb, revitalizing independent film and proving that dazzling dialogue and nonlinear storytelling could be wildly commercial. His encyclopedic film knowledge infused every frame.'
        },

        david_fincher: {
            id: 'jasper_eversleigh',
            name: 'Jasper Eversleigh',
            talent: 93,
            weeklyRate: 55000,
            genres: ['thriller', 'crime', 'drama'],
            availableFrom: 1992,
            availableTo: 2010,
            oscarPotential: 28,
            scandalRisk: 6,
            specialties: ['dark atmosphere', 'obsessive detail', 'digital perfection', 'serial killers'],
            quirks: [],
            description: 'The darkest visual stylist of his generation. Eversleigh\'s meticulous craftsmanship and bleak worldview produced Se7en, Fight Club, and Zodiac. His hundreds of takes and digital perfection created a new standard for thriller filmmaking.'
        },

        coen_brothers: {
            id: 'coen_brothers',
            name: 'The Calloway Brothers',
            talent: 95,
            weeklyRate: 50000,
            genres: ['crime', 'comedy', 'thriller', 'drama', 'western', 'noir'],
            availableFrom: 1984,
            availableTo: 2010,
            oscarWinner: true, // Fargo (1996), No Country for Old Men (2007)
            oscarPotential: 32,
            scandalRisk: 3,
            specialties: ['dark comedy', 'genre deconstruction', 'regional authenticity', 'quirky characters'],
            quirks: [],
            description: 'American cinema\'s most distinctive duo. The Coens\' unique blend of dark comedy, genre deconstruction, and regional authenticity produced Blood Simple, Fargo, The Big Lebowski, and No Country for Old Men. Their dialogue is instantly recognizable.'
        },

        // ========================================================================
        // 2000s DIRECTORS - Franchise and Prestige Innovators
        // ========================================================================

        christopher_nolan: {
            id: 'kermit_fairmont',
            name: 'Kermit Fairmont',
            talent: 94,
            weeklyRate: 100000,
            genres: ['thriller', 'sci_fi', 'action', 'drama', 'crime'],
            availableFrom: 2000,
            availableTo: 2010,
            oscarPotential: 28,
            scandalRisk: 2,
            specialties: ['puzzle narratives', 'IMAX spectacle', 'practical effects', 'time manipulation'],
            quirks: [],
            description: 'The architect of cerebral blockbusters. Fairmont proved that intellectually ambitious films could be massive commercial successes. Memento, The Dark Knight, and Inception redefined what blockbusters could be, blending spectacle with genuine ideas.'
        },

        peter_jackson: {
            id: 'lyle_goldenberg',
            name: 'Lyle Goldenberg',
            talent: 92,
            weeklyRate: 80000,
            genres: ['fantasy', 'adventure', 'drama', 'horror'],
            availableFrom: 1994,
            availableTo: 2010,
            oscarWinner: true, // The Lord of the Rings: The Return of the King (2003)
            oscarPotential: 30,
            scandalRisk: 3,
            specialties: ['epic fantasy', 'VFX innovation', 'New Zealand filmmaking', 'literary adaptation'],
            quirks: [],
            description: 'The hobbit who conquered Hollywood. Jackson\'s Lord of the Rings trilogy was the most ambitious and successful literary adaptation ever filmed. His transformation from splatter-film director to epic auteur was one of cinema\'s great surprises.'
        },

        kathryn_bigelow: {
            id: 'marjorie_harrington',
            name: 'Marjorie Harrington',
            talent: 89,
            weeklyRate: 50000,
            genres: ['action', 'war', 'thriller', 'drama'],
            availableFrom: 1987,
            availableTo: 2010,
            oscarWinner: true, // The Hurt Locker (2009)
            oscarPotential: 28,
            scandalRisk: 3,
            specialties: ['visceral action', 'war realism', 'adrenaline filmmaking', 'barrier breaker'],
            quirks: [],
            description: 'The first woman to win the Best Director Oscar. Harrington\'s visceral action filmmaking and unflinching war realism in The Hurt Locker shattered glass ceilings. Her films pulse with adrenaline while maintaining genuine emotional depth.'
        },

        ang_lee: {
            id: 'mordecai_islington',
            name: 'Mordecai Islington',
            talent: 92,
            weeklyRate: 55000,
            genres: ['drama', 'action', 'romance', 'western'],
            availableFrom: 1993,
            availableTo: 2010,
            oscarWinner: true, // Brokeback Mountain (2005)
            oscarPotential: 30,
            scandalRisk: 2,
            specialties: ['cross-cultural storytelling', 'genre versatility', 'emotional subtlety', 'visual poetry'],
            quirks: [],
            description: 'Cinema\'s most culturally versatile director. Lee moved seamlessly between Taiwanese family dramas, Jane Austen, wuxia epics, and American westerns. His ability to find universal emotions across cultures is remarkable.'
        }
    };

    /**
     * ============================================================================
     * HELPER FUNCTIONS
     * ============================================================================
     */

    /**
     * Get available actors for a given year
     */
    function getAvailableActors(year, gameState) {
        const available = [];

        for (const actorId in ACTORS) {
            const actor = ACTORS[actorId];

            // Check availability window
            if (year < actor.availableFrom || year > actor.availableTo) {
                continue;
            }

            // Check if drafted (1942-1945 for draft-risk actors)
            if (actor.draftRisk && gameState.warActive && year >= 1942 && year <= 1945) {
                continue;
            }

            available.push(actor);
        }

        return available;
    }

    /**
     * Get available directors for a given year
     */
    function getAvailableDirectors(year, gameState) {
        const available = [];

        for (const directorId in DIRECTORS) {
            const director = DIRECTORS[directorId];

            // Check availability window
            if (year < director.availableFrom || year > director.availableTo) {
                continue;
            }

            // Check if drafted (1942-1945 for draft-risk directors)
            if (director.draftRisk && gameState.warActive && year >= 1942 && year <= 1945) {
                continue;
            }

            // Check HUAC blacklist (late 1940s)
            if (director.huacRisk && gameState.blacklistActive) {
                continue;
            }

            available.push(director);
        }

        return available;
    }

    /**
     * Get talent by ID
     */
    function getActorById(id) {
        return ACTORS[id] || null;
    }

    function getDirectorById(id) {
        return DIRECTORS[id] || null;
    }

    /**
     * Calculate total cast cost
     */
    function calculateCastCost(actors, productionWeeks) {
        let totalCost = 0;

        for (const actorId of actors) {
            const actor = ACTORS[actorId];
            if (actor) {
                totalCost += actor.weeklyRate * productionWeeks;
            }
        }

        return totalCost;
    }

    /**
     * Calculate director cost
     */
    function calculateDirectorCost(directorId, productionWeeks) {
        const director = DIRECTORS[directorId];
        if (!director) return 0;

        return director.weeklyRate * productionWeeks;
    }

    /**
     * Calculate film quality bonus from talent
     */
    function calculateTalentQualityBonus(directorId, actorIds) {
        let qualityBonus = 0;

        // Director contribution (60% of talent impact)
        const director = DIRECTORS[directorId];
        if (director) {
            qualityBonus += (director.talent / 100) * 0.6 * 100;
        }

        // Actor contribution (40% of talent impact, averaged)
        if (actorIds && actorIds.length > 0) {
            let actorTotalPower = 0;
            for (const actorId of actorIds) {
                const actor = ACTORS[actorId];
                if (actor) {
                    actorTotalPower += actor.starPower;
                }
            }
            const avgActorPower = actorTotalPower / actorIds.length;
            qualityBonus += (avgActorPower / 100) * 0.4 * 100;
        }

        return Math.round(qualityBonus);
    }

    /**
     * Calculate box office appeal from cast
     */
    function calculateCastAppeal(actorIds) {
        if (!actorIds || actorIds.length === 0) return 0;

        let totalStarPower = 0;
        for (const actorId of actorIds) {
            const actor = ACTORS[actorId];
            if (actor) {
                totalStarPower += actor.starPower;
            }
        }

        // Return average star power as appeal multiplier
        return totalStarPower / actorIds.length / 100;
    }

    /**
     * Check for actor chemistry bonuses
     */
    function checkChemistry(actor1Id, actor2Id) {
        const actor1 = ACTORS[actor1Id];
        if (!actor1 || !actor1.pairings) return false;

        return actor1.pairings.includes(actor2Id);
    }

    /**
     * Check for actor rivalries (negative chemistry)
     */
    function checkRivalry(actor1Id, actor2Id) {
        const actor1 = ACTORS[actor1Id];
        if (!actor1 || !actor1.rivalries) return false;

        return actor1.rivalries.includes(actor2Id);
    }

    // Public API
    return {
        ACTORS,
        DIRECTORS,
        getAvailableActors,
        getAvailableDirectors,
        getActorById,
        getDirectorById,
        calculateCastCost,
        calculateDirectorCost,
        calculateTalentQualityBonus,
        calculateCastAppeal,
        checkChemistry,
        checkRivalry
    };
})();
