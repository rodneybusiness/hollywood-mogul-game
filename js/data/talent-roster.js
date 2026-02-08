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
        // A-LIST STARS (Star Power: 85-99) - The Icons
        // ========================================================================

        clark_gable: {
            id: 'clark_gable',
            name: 'Clark Gable',
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
            pairings: ['carole_lombard', 'vivien_leigh', 'claudette_colbert'],
            rivalries: ['spencer_tracy'],
            quirks: ['demands top billing', 'notorious ladies man', 'heavy drinker'],
            description: 'The King of Hollywood. Gable\'s rugged masculinity and roguish charm made him the biggest male star of the era. His chemistry with leading ladies is legendary, and his box office power is unmatched.'
        },

        bette_davis: {
            id: 'bette_davis',
            name: 'Bette Davis',
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
            rivalries: ['joan_crawford', 'miriam_hopkins'],
            quirks: ['fights with studio bosses', 'demands script approval', 'temperamental on set'],
            description: 'First lady of the American screen. Davis\'s fierce intelligence and emotional intensity revolutionized acting for women. Notorious for battling Jack Warner and refusing roles beneath her dignity.'
        },

        humphrey_bogart: {
            id: 'humphrey_bogart',
            name: 'Humphrey Bogart',
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
            pairings: ['lauren_bacall', 'ingrid_bergman', 'katharine_hepburn'],
            rivalries: ['george_raft'],
            quirks: ['heavy drinker', 'liberal politics', 'chess enthusiast'],
            description: 'The quintessential tough guy with a soul. Bogart perfected the world-weary antihero, bringing moral complexity to gangsters, detectives, and soldiers. His raspy voice and lived-in face made him uniquely credible.'
        },

        katharine_hepburn: {
            id: 'katharine_hepburn',
            name: 'Katharine Hepburn',
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
            pairings: ['cary_grant', 'spencer_tracy'],
            rivalries: ['ginger_rogers'],
            quirks: ['wears pants', 'refuses publicity', 'aloof with press'],
            description: 'Fiercely independent spirit who redefined leading ladies. Hepburn\'s aristocratic bearing and razor-sharp intelligence made her box office poison in the mid-30s, but she roared back stronger than ever.'
        },

        cary_grant: {
            id: 'cary_grant',
            name: 'Cary Grant',
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
            pairings: ['katharine_hepburn', 'irene_dunne', 'rosalind_russell'],
            rivalries: [],
            quirks: ['perfectionist', 'demands retakes', 'controls own contracts'],
            description: 'The most sophisticated leading man in Hollywood. Grant\'s unique blend of elegance and mischief made him perfect for both screwball comedies and Hitchcock thrillers. His timing is impeccable.'
        },

        james_stewart: {
            id: 'james_stewart',
            name: 'James Stewart',
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
            pairings: ['jean_arthur', 'margaret_sullavan', 'donna_reed'],
            rivalries: [],
            quirks: ['genuine war hero', 'shy off-screen', 'stammering style'],
            description: 'The most beloved everyman in Hollywood. Stewart\'s aw-shucks sincerity and stammering delivery made him the perfect embodiment of American values. His WWII service only enhanced his heroic image.'
        },

        barbara_stanwyck: {
            id: 'barbara_stanwyck',
            name: 'Barbara Stanwyck',
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
            pairings: ['fred_macmurray', 'henry_fonda', 'joel_mccrea'],
            rivalries: [],
            quirks: ['total professional', 'one-take wonder', 'beloved by crews'],
            description: 'The most versatile actress in Hollywood. Stanwyck could play anything from screwball comedy to film noir to westerns with equal conviction. Directors loved her professionalism and emotional honesty.'
        },

        gary_cooper: {
            id: 'gary_cooper',
            name: 'Gary Cooper',
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
            pairings: ['grace_kelly', 'ingrid_bergman', 'claudette_colbert'],
            rivalries: [],
            quirks: ['notoriously late', 'ladies man', 'mumbles dialogue'],
            description: 'The strong silent type incarnate. Cooper\'s natural authenticity and quiet moral authority made him the perfect American hero. His underplaying was revolutionary in an era of theatrical acting.'
        },

        joan_crawford: {
            id: 'joan_crawford',
            name: 'Joan Crawford',
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
            rivalries: ['bette_davis', 'norma_shearer'],
            quirks: ['perfectionist about appearance', 'control freak', 'studio politician'],
            description: 'The ultimate survivor and self-made star. Crawford\'s fierce ambition and glamorous image embodied the American dream. Her rivalry with Bette Davis became legendary Hollywood lore.'
        },

        spencer_tracy: {
            id: 'spencer_tracy',
            name: 'Spencer Tracy',
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
            pairings: ['katharine_hepburn', 'joan_bennett'],
            rivalries: ['clark_gable'],
            quirks: ['heavy drinker', 'affair with Hepburn', 'insecure about acting'],
            description: 'The actor\'s actor. Tracy\'s naturalistic style revolutionized screen acting. His emotional depth and working-class dignity made him believable in everything from priests to fishermen to scientists.'
        },

        marlene_dietrich: {
            id: 'marlene_dietrich',
            name: 'Marlene Dietrich',
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
            pairings: ['gary_cooper', 'john_wayne'],
            rivalries: ['greta_garbo'],
            quirks: ['demands control of lighting', 'bisexual affairs', 'thick German accent'],
            description: 'The ultimate European sophisticate. Dietrich\'s androgynous beauty and exotic allure made her unique in Hollywood. Her thick accent and mysterious persona became her trademarks.'
        },

        errol_flynn: {
            id: 'errol_flynn',
            name: 'Errol Flynn',
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
            pairings: ['olivia_de_havilland', 'maureen_ohara'],
            rivalries: ['ronald_reagan'],
            quirks: ['statutory rape trial 1942', 'heavy drinker', 'drug user', 'womanizer'],
            description: 'The ultimate swashbuckler whose off-screen life was as wild as his films. Flynn\'s athletic grace and devil-may-care charm made him perfect for adventure films, but scandals and substance abuse plagued his career.'
        },

        olivia_de_havilland: {
            id: 'olivia_de_havilland',
            name: 'Olivia de Havilland',
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
            pairings: ['errol_flynn', 'montgomery_clift'],
            rivalries: ['joan_fontaine'], // Real-life sister rivalry!
            quirks: ['sued Warner Bros', 'bitter feud with sister', 'fighting typecasting'],
            description: 'Sweet-faced but steely actress who changed Hollywood. De Havilland\'s lawsuit against Warner Bros. broke the studio contract system. Her bitter rivalry with sister Joan Fontaine became Hollywood legend.'
        },

        vivien_leigh: {
            id: 'vivien_leigh',
            name: 'Vivien Leigh',
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
            pairings: ['clark_gable', 'laurence_olivier'],
            rivalries: [],
            quirks: ['mental health issues', 'affair with Olivier', 'British accent'],
            description: 'Exquisitely beautiful British actress who became Scarlett O\'Hara. Leigh\'s stunning performance in Gone with the Wind made her a legend, though mental health struggles limited her Hollywood career.'
        },

        william_powell: {
            id: 'william_powell',
            name: 'William Powell',
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
            pairings: ['myrna_loy', 'carole_lombard'],
            rivalries: [],
            quirks: ['health problems', 'widower of Harlow', 'meticulous preparation'],
            description: 'The epitome of sophisticated wit and dapper charm. Powell\'s partnership with Myrna Loy in The Thin Man series created cinema\'s most delightful married couple. His elegance and timing were unmatched.'
        },

        myrna_loy: {
            id: 'myrna_loy',
            name: 'Myrna Loy',
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
            pairings: ['william_powell', 'cary_grant', 'clark_gable'],
            rivalries: [],
            quirks: ['political activist', 'anti-Nazi', 'multiple divorces'],
            description: 'The perfect wife of the American screen. Loy\'s sophisticated wit and natural charm made her the ideal partner for William Powell. She embodied the modern woman - smart, sexy, and self-assured.'
        },

        // ========================================================================
        // B-LIST STARS (Star Power: 70-84) - Rising and Established Stars
        // ========================================================================

        joan_fontaine: {
            id: 'joan_fontaine',
            name: 'Joan Fontaine',
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
            pairings: ['cary_grant', 'laurence_olivier'],
            rivalries: ['olivia_de_havilland'], // Real-life sister rivalry!
            quirks: ['bitter feud with sister', 'four marriages', 'insecure'],
            description: 'Ethereal beauty perfect for Hitchcock\'s vulnerable heroines. Fontaine\'s delicate beauty and psychological depth made her ideal for Gothic thrillers. Her bitter rivalry with sister Olivia never healed.'
        },

        henry_fonda: {
            id: 'henry_fonda',
            name: 'Henry Fonda',
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
            pairings: ['barbara_stanwyck', 'jane_darwell'],
            rivalries: [],
            quirks: ['liberal politics', 'perfectionist', 'distant father'],
            description: 'The face of American conscience and integrity. Fonda\'s quiet intensity and moral authority made him perfect for playing principled men standing against injustice, from Tom Joad to Young Mr. Lincoln.'
        },

        ginger_rogers: {
            id: 'ginger_rogers',
            name: 'Ginger Rogers',
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
            pairings: ['fred_astaire', 'cary_grant'],
            rivalries: ['katharine_hepburn'],
            quirks: ['did everything Astaire did backwards in heels', 'controlled by mother'],
            description: 'The most versatile musical star who proved she could act too. Rogers did everything Astaire did "backwards and in high heels," then won an Oscar for drama. Her range was extraordinary.'
        },

        fred_astaire: {
            id: 'fred_astaire',
            name: 'Fred Astaire',
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
            pairings: ['ginger_rogers', 'rita_hayworth', 'judy_garland'],
            rivalries: ['gene_kelly'],
            quirks: ['perfectionist', 'innovative choreographer', 'insecure about looks'],
            description: 'The most elegant dancer in film history. Astaire\'s partnership with Ginger Rogers created the greatest musicals of the 1930s. His perfectionism and innovation revolutionized screen dancing.'
        },

        ingrid_bergman: {
            id: 'ingrid_bergman',
            name: 'Ingrid Bergman',
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
            pairings: ['humphrey_bogart', 'charles_boyer', 'gary_cooper'],
            rivalries: [],
            quirks: ['refused makeup', 'natural beauty', 'Swedish accent'],
            description: 'Luminous Swedish beauty who embodied purity and nobility. Bergman\'s natural acting and radiant presence made her perfect for playing saints and martyrs. Her refusal to wear heavy makeup was revolutionary.'
        },

        rita_hayworth: {
            id: 'rita_hayworth',
            name: 'Rita Hayworth',
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
            pairings: ['fred_astaire', 'glenn_ford', 'orson_welles'],
            rivalries: ['gene_tierney'],
            quirks: ['born Margarita Cansino', 'abusive father', 'love goddess image'],
            description: 'The ultimate love goddess of the 1940s. Hayworth\'s sultry beauty and dancing ability made her a pin-up icon. Her Gilda performance created the definitive femme fatale, though she resented being just a sex symbol.'
        },

        gregory_peck: {
            id: 'gregory_peck',
            name: 'Gregory Peck',
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
            id: 'lauren_bacall',
            name: 'Lauren Bacall',
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
            pairings: ['humphrey_bogart'],
            rivalries: [],
            quirks: ['married Bogart', 'smoky voice', 'The Look'],
            description: 'Sultry newcomer who became Bogart\'s perfect match. Bacall\'s husky voice, knowing sexuality, and cool confidence made her an instant icon. Her real-life romance with Bogart added to her mystique.'
        },

        tyrone_power: {
            id: 'tyrone_power',
            name: 'Tyrone Power',
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
            pairings: ['gene_tierney', 'alice_faye', 'linda_darnell'],
            rivalries: ['errol_flynn'],
            quirks: ['too handsome', 'wanted serious roles', 'war hero'],
            description: 'Impossibly handsome matinee idol who yearned for serious roles. Power\'s devastating good looks made him perfect for swashbucklers and romances, but he fought to prove his acting ability.'
        },

        gene_tierney: {
            id: 'gene_tierney',
            name: 'Gene Tierney',
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
            pairings: ['tyrone_power', 'dana_andrews', 'rex_harrison'],
            rivalries: ['rita_hayworth'],
            quirks: ['mental health struggles', 'tragic life', 'overbite'],
            description: 'Hauntingly beautiful actress with a tragic personal life. Tierney\'s ethereal loveliness and wounded quality made her perfect for noir. Off-screen tragedies with her daughter haunted her life.'
        },

        veronica_lake: {
            id: 'veronica_lake',
            name: 'Veronica Lake',
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
            pairings: ['alan_ladd', 'joel_mccrea'],
            rivalries: ['constance_bennett'],
            quirks: ['peek-a-boo hair', 'alcoholic', 'difficult temperament', 'only 4\'11"'],
            description: 'Tiny blonde bombshell whose peek-a-boo hairstyle became a national craze. Lake\'s sultry voice and perfect chemistry with Alan Ladd made her a noir icon, but alcoholism destroyed her career.'
        },

        john_wayne: {
            id: 'john_wayne',
            name: 'John Wayne',
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
            pairings: ['maureen_ohara', 'marlene_dietrich'],
            rivalries: [],
            quirks: ['born Marion Morrison', 'walked like a cowboy', 'conservative politics'],
            description: 'B-western star becoming an A-list icon. Wayne\'s breakthrough in Stagecoach (1939) made him the definitive western hero. His distinctive walk and masculine authority embodied American frontier values.'
        },

        robert_mitchum: {
            id: 'robert_mitchum',
            name: 'Robert Mitchum',
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
            pairings: ['jane_greer', 'susan_hayward'],
            rivalries: [],
            quirks: ['marijuana arrest', 'hobo past', 'lazy genius', 'heavy-lidded eyes'],
            description: 'Sleepy-eyed newcomer with dangerous sexuality. Mitchum\'s laconic cool and coiled menace made him perfect for noir. His 1948 marijuana arrest scandal nearly ended his career but he survived.'
        },

        kirk_douglas: {
            id: 'kirk_douglas',
            name: 'Kirk Douglas',
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
            pairings: ['lauren_bacall', 'lana_turner'],
            rivalries: ['burt_lancaster'],
            quirks: ['ferocious intensity', 'famous dimple', 'method acting'],
            description: 'Intense newcomer with ferocious energy. Douglas\'s volcanic intensity and famous dimpled chin made him perfect for playing ambitious, driven men. His competitive nature fueled brilliant performances.'
        },

        lana_turner: {
            id: 'lana_turner',
            name: 'Lana Turner',
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
            pairings: ['clark_gable', 'john_garfield'],
            rivalries: ['ava_gardner'],
            quirks: ['discovered at drugstore', 'eight marriages', 'scandal magnet'],
            description: 'The ultimate Hollywood discovery and scandal queen. Turner was famously "discovered" at Schwab\'s drugstore. Her sultry beauty and tumultuous personal life kept her in headlines as much as her films.'
        },

        hedy_lamarr: {
            id: 'hedy_lamarr',
            name: 'Hedy Lamarr',
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
            pairings: ['clark_gable', 'charles_boyer'],
            rivalries: ['marlene_dietrich'],
            quirks: ['inventor (frequency hopping)', 'nude scandal', 'six marriages', 'genius IQ'],
            description: 'Impossibly beautiful Austrian actress who was also a brilliant inventor. Lamarr\'s exotic looks made her a star, but her scientific mind invented frequency-hopping technology. Studios never took her seriously.'
        },

        jane_russell: {
            id: 'jane_russell',
            name: 'Jane Russell',
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
            pairings: ['bob_hope', 'robert_mitchum'],
            rivalries: [],
            quirks: ['The Outlaw censorship battle', 'Hughes obsession', 'cleavage focus'],
            description: 'Howard Hughes\' controversial discovery. Russell\'s voluptuous figure caused censorship battles over The Outlaw. Hughes\' obsessive focus on her cleavage overshadowed her actual talent and warm personality.'
        },

        dana_andrews: {
            id: 'dana_andrews',
            name: 'Dana Andrews',
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
            pairings: ['gene_tierney', 'joan_crawford'],
            rivalries: [],
            quirks: ['alcoholic', 'underrated talent', 'dignified presence'],
            description: 'Underrated leading man of film noir. Andrews\' decent everyman quality made his moral compromises in noir all more compelling. His alcoholism hurt his career but never his dignity on screen.'
        },

        robert_ryan: {
            id: 'robert_ryan',
            name: 'Robert Ryan',
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
            pairings: ['robert_mitchum', 'gloria_grahame'],
            rivalries: [],
            quirks: ['liberal activist', 'tortured by playing racists', 'boxer background'],
            description: 'Menacing presence who specialized in complex villains. Ryan\'s intense physicality and psychological depth made him perfect for playing violent, conflicted men. Ironically, he was a gentle liberal in real life.'
        },

        glenn_ford: {
            id: 'glenn_ford',
            name: 'Glenn Ford',
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
            pairings: ['rita_hayworth', 'bette_davis'],
            rivalries: [],
            quirks: ['war veteran', 'shy off-screen', 'underplayed everything'],
            description: 'Reliable everyman leading man. Ford\'s natural, understated acting style made him believable as ordinary men in extraordinary situations. His chemistry with Rita Hayworth was electric.'
        },

        ann_sheridan: {
            id: 'ann_sheridan',
            name: 'Ann Sheridan',
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
            pairings: ['james_cagney', 'cary_grant'],
            rivalries: [],
            quirks: ['dubbed "Oomph Girl"', 'hated the nickname', 'warm personality'],
            description: 'The Oomph Girl who was more than just sex appeal. Sheridan\'s wisecracking humor and warm personality made her perfect for both comedy and drama. She hated her publicity-created "Oomph Girl" nickname.'
        },

        ida_lupino: {
            id: 'ida_lupino',
            name: 'Ida Lupino',
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
            pairings: ['humphrey_bogart', 'robert_ryan'],
            rivalries: [],
            quirks: ['would become director', 'British accent', 'tough on herself'],
            description: 'Tough, talented actress who would become Hollywood\'s only female director. Lupino specialized in hard-bitten women and brought working-class authenticity to every role. Her future as a director showed her brilliance.'
        },

        linda_darnell: {
            id: 'linda_darnell',
            name: 'Linda Darnell',
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
            pairings: ['tyrone_power', 'cornel_wilde'],
            rivalries: [],
            quirks: ['tragic death in 1965', 'abused by mother', 'low self-esteem'],
            description: 'Sultry beauty with a tragic life. Darnell\'s exotic looks and wounded quality made her compelling in film noir and costume dramas. Her controlling mother and low self-esteem plagued her career.'
        },

        susan_hayward: {
            id: 'susan_hayward',
            name: 'Susan Hayward',
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
            pairings: ['robert_mitchum', 'kirk_douglas'],
            rivalries: [],
            quirks: ['Brooklyn fighter', 'would win Oscar in 50s', 'fierce ambition'],
            description: 'Brooklyn-born fighter who played survivors. Hayward\'s fierce determination and working-class grit made her perfect for playing women who refuse to be beaten down. Her best work came in the 1950s.'
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
            pairings: ['errol_flynn', 'john_wayne', 'tyrone_power'],
            rivalries: [],
            quirks: ['Irish temper', 'did own stunts', 'red-haired beauty'],
            description: 'Fiery Irish redhead perfect for Technicolor adventures. O\'Hara\'s spirited independence and athletic grace made her the ideal partner for swashbucklers. She could ride, fence, and hold her own with any leading man.'
        },

        // ========================================================================
        // CHARACTER ACTORS (Star Power: 55-69) - The Supporting Players
        // ========================================================================

        peter_lorre: {
            id: 'peter_lorre',
            name: 'Peter Lorre',
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
            pairings: ['sydney_greenstreet', 'humphrey_bogart'],
            rivalries: [],
            quirks: ['morphine addict', 'Hungarian accent', 'bug eyes'],
            description: 'The creepiest character actor in Hollywood. Lorre\'s bug-eyed intensity and sinister European charm made him unforgettable in small doses. His partnership with Sydney Greenstreet was cinema gold.'
        },

        sydney_greenstreet: {
            id: 'sydney_greenstreet',
            name: 'Sydney Greenstreet',
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
            pairings: ['peter_lorre', 'humphrey_bogart'],
            rivalries: [],
            quirks: ['didn\'t start films until 61', '357 pounds', 'stage background'],
            description: 'Massive presence who didn\'t make his first film until age 61. Greenstreet\'s cultured menace and enormous bulk made him an unforgettable villain. His chemistry with Peter Lorre was magical.'
        },

        claude_rains: {
            id: 'claude_rains',
            name: 'Claude Rains',
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
            pairings: ['bette_davis', 'ingrid_bergman'],
            rivalries: [],
            quirks: ['only 5\'6"', 'beautiful voice', 'four-time Oscar nominee'],
            description: 'The most cultured voice in Hollywood. Rains brought intelligence and complexity to every role, from villains to heroes. His beautiful speaking voice and refined presence elevated every film.'
        },

        agnes_moorehead: {
            id: 'agnes_moorehead',
            name: 'Agnes Moorehead',
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
            pairings: ['orson_welles'],
            rivalries: [],
            quirks: ['Welles protégé', 'stage background', 'would play Endora'],
            description: 'Powerful character actress from Orson Welles\' Mercury Theatre. Moorehead brought ferocious intensity to supporting roles. Her Citizen Kane performance showed her dramatic range and power.'
        },

        edward_g_robinson: {
            id: 'edward_g_robinson',
            name: 'Edward G. Robinson',
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
            pairings: ['james_cagney', 'humphrey_bogart'],
            rivalries: [],
            quirks: ['art collector', 'Romanian accent', 'short (5\'5")', 'liberal politics'],
            description: 'The original movie gangster who was an art connoisseur in real life. Robinson\'s Little Caesar created the gangster archetype. His erudition and art collection contradicted his tough guy image.'
        },

        james_cagney: {
            id: 'james_cagney',
            name: 'James Cagney',
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
            pairings: ['pat_obrien', 'ann_sheridan'],
            rivalries: ['jack_warner'],
            quirks: ['trained dancer', 'battled Warner Bros', 'liberal politics'],
            description: 'Explosive dynamo who could dance and fight with equal skill. Cagney\'s cocky energy and working-class authenticity made him the definitive Warner Bros. tough guy. His dancing talent surprised everyone.'
        },

        walter_brennan: {
            id: 'walter_brennan',
            name: 'Walter Brennan',
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
            pairings: ['gary_cooper', 'john_wayne'],
            rivalries: [],
            quirks: ['first three-time Oscar winner', 'lost teeth for authenticity', 'right-wing politics'],
            description: 'The most honored character actor in history - first three-time Oscar winner. Brennan specialized in grizzled old-timers and brought folksy authenticity to westerns and dramas. He reportedly lost his teeth for roles.'
        },

        thomas_mitchell: {
            id: 'thomas_mitchell',
            name: 'Thomas Mitchell',
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
            pairings: ['john_wayne', 'james_stewart'],
            rivalries: [],
            quirks: ['1939 miracle year', 'stage background', 'heavy drinker'],
            description: 'Versatile character actor who had a miracle year in 1939. Mitchell appeared in Stagecoach, Gone with the Wind, Mr. Smith Goes to Washington, and more. His warmth and range were extraordinary.'
        },

        ward_bond: {
            id: 'ward_bond',
            name: 'Ward Bond',
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
            pairings: ['john_wayne', 'john_ford'],
            rivalries: [],
            quirks: ['John Ford regular', 'football player', 'right-wing activist'],
            description: 'Burly character actor and John Ford favorite. Bond\'s physical presence and no-nonsense delivery made him perfect for cops, soldiers, and tough guys. His friendship with Ford ensured steady work.'
        },

        eve_arden: {
            id: 'eve_arden',
            name: 'Eve Arden',
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
            pairings: ['joan_crawford', 'rosalind_russell'],
            rivalries: [],
            quirks: ['master of the one-liner', 'tall and striking', 'would become TV star'],
            description: 'The wisecracking best friend in dozens of films. Arden\'s sardonic delivery and perfect comic timing made her the ideal confidante. She could steal scenes with a single raised eyebrow.'
        },

        thelma_ritter: {
            id: 'thelma_ritter',
            name: 'Thelma Ritter',
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
            pairings: ['james_stewart', 'bette_davis'],
            rivalries: [],
            quirks: ['didn\'t start films until 45', 'Brooklyn accent', 'six Oscar nominations'],
            description: 'Working-class scene-stealer who didn\'t start films until age 45. Ritter\'s Brooklyn accent and no-nonsense delivery brought authenticity to maids, nurses, and neighbors. She would earn six Oscar nominations.'
        },

        marjorie_main: {
            id: 'marjorie_main',
            name: 'Marjorie Main',
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
            id: 'cesar_romero',
            name: 'Cesar Romero',
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
            description: 'Suave Latin lover and dancer. Romero\'s exotic charm and dancing ability made him perfect for musicals and romantic comedies. His lifelong bachelor status fueled Hollywood rumors.'
        },

        van_heflin: {
            id: 'van_heflin',
            name: 'Van Heflin',
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
            pairings: ['lana_turner', 'jean_arthur'],
            rivalries: [],
            quirks: ['stage trained', 'method actor', 'self-effacing'],
            description: 'Underrated character actor with Oscar-winning depth. Heflin specialized in ordinary men with hidden complexity. His understated approach and authenticity made him a director\'s favorite.'
        },

        barry_fitzgerald: {
            id: 'barry_fitzgerald',
            name: 'Barry Fitzgerald',
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
            description: 'Lovable Irish character actor who won an Oscar at 56. Fitzgerald\'s twinkling eyes and thick brogue made him perfect for priests, bartenders, and comic support. His chemistry with Bing Crosby was magical.'
        },

        elisha_cook_jr: {
            id: 'elisha_cook_jr',
            name: 'Elisha Cook Jr.',
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
            pairings: ['humphrey_bogart'],
            rivalries: [],
            quirks: ['died on screen 17 times', 'small and wiry', 'nervous energy'],
            description: 'The most shot man in Hollywood. Cook specialized in nervous weasels and doomed fall guys. His twitchy energy and inevitable demise became a noir staple. Nobody died on screen more convincingly.'
        },

        judith_anderson: {
            id: 'judith_anderson',
            name: 'Judith Anderson',
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
            pairings: ['laurence_olivier', 'joan_fontaine'],
            rivalries: [],
            quirks: ['Australian accent hidden', 'stage legend', 'Mrs. Danvers defined her'],
            description: 'Sinister presence who created the definitive gothic villainess. Anderson\'s Mrs. Danvers in Rebecca set the standard for creepy housekeepers. Her stage-trained intensity made her unforgettable in small doses.'
        },

        // ========================================================================
        // UP-AND-COMERS (Star Power: 40-54) - The New Faces
        // ========================================================================

        montgomery_clift: {
            id: 'montgomery_clift',
            name: 'Montgomery Clift',
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
            pairings: ['olivia_de_havilland', 'elizabeth_taylor'],
            rivalries: [],
            quirks: ['method actor', 'closeted gay', 'would have tragic accident'],
            description: 'Revolutionary new talent bringing method acting to Hollywood. Clift\'s sensitive intensity and psychological depth pointed to a new generation of actors. His troubled personal life would end in tragedy.'
        },

        burt_lancaster: {
            id: 'burt_lancaster',
            name: 'Burt Lancaster',
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
            pairings: ['ava_gardner', 'deborah_kerr'],
            rivalries: ['kirk_douglas'],
            quirks: ['former circus acrobat', 'liberal politics', 'athletic prowess'],
            description: 'Former circus acrobat bringing athletic grace to tough guy roles. Lancaster\'s physical presence and intelligence made him an instant leading man. His rivalry with Kirk Douglas fueled both careers.'
        },

        ava_gardner: {
            id: 'ava_gardner',
            name: 'Ava Gardner',
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
            pairings: ['burt_lancaster', 'frank_sinatra'],
            rivalries: ['lana_turner'],
            quirks: ['North Carolina accent', 'married Mickey Rooney', 'insecure about acting'],
            description: 'Stunningly beautiful newcomer still learning her craft. Gardner\'s earthy sensuality and exotic looks made her a rising star, but she was insecure about her acting ability. Her best work came in the 1950s.'
        },

        janet_leigh: {
            id: 'janet_leigh',
            name: 'Janet Leigh',
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
            pairings: ['tony_curtis'],
            rivalries: [],
            quirks: ['discovered by Norma Shearer', 'would marry Curtis', 'Psycho awaits'],
            description: 'Fresh-faced newcomer discovered by Norma Shearer. Leigh\'s wholesome beauty and natural acting made her an instant ingenue star. Her greatest role in Psycho was still a decade away.'
        },

        tony_curtis: {
            id: 'tony_curtis',
            name: 'Tony Curtis',
            gender: 'male',
            starPower: 44,
            weeklyRate: 750,
            genres: ['drama', 'adventure', 'romance', 'comedy'],
            specialties: ['pretty boy looks', 'Bronx accent', 'hustler charm'],
            typeCast: 'Handsome young leads',
            availableFrom: 1949,
            availableTo: 1949,
            oscarPotential: 8,
            scandalRisk: 10,
            chemistry: 68,
            pairings: ['janet_leigh'],
            rivalries: [],
            quirks: ['born Bernie Schwartz', 'thick Bronx accent', 'pretty boy looks'],
            description: 'Brand new pretty boy from the Bronx. Curtis just arrived in Hollywood with matinee idol looks and a thick accent to lose. His hustler charm and ambition suggest a long career ahead.'
        },

        shelley_winters: {
            id: 'shelley_winters',
            name: 'Shelley Winters',
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
            pairings: ['montgomery_clift'],
            rivalries: [],
            quirks: ['New York accent', 'method actress', 'blonde bombshell period'],
            description: 'Ambitious young actress perfect for working-class victims. Winters brought method acting intensity to vulnerable roles. Her blonde bombshell phase would give way to character work and two Oscars.'
        },

        lizabeth_scott: {
            id: 'lizabeth_scott',
            name: 'Lizabeth Scott',
            gender: 'female',
            starPower: 49,
            weeklyRate: 875,
            genres: ['noir', 'thriller', 'drama', 'romance'],
            specialties: ['husky voice', 'Bacall imitation', 'femme fatale'],
            typeCast: 'Budget Bacall',
            availableFrom: 1945,
            availableTo: 1949,
            oscarPotential: 6,
            scandalRisk: 16,
            chemistry: 67,
            pairings: ['burt_lancaster', 'dick_powell'],
            rivalries: ['lauren_bacall'],
            quirks: ['husky voice like Bacall', 'lesbian rumors', 'Pennsylvania Dutch'],
            description: 'Sultry newcomer marketed as a budget Lauren Bacall. Scott\'s husky voice and blonde beauty made her a noir fixture, but she never escaped Bacall\'s shadow. Rumors about her personal life plagued her career.'
        },

        william_holden: {
            id: 'william_holden',
            name: 'William Holden',
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
            description: 'All-American newcomer about to become a major star. Holden\'s clean-cut looks and natural acting made him perfect for young heroes. His cynical anti-hero phase was still ahead in the 1950s.'
        },

        deborah_kerr: {
            id: 'deborah_kerr',
            name: 'Deborah Kerr',
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
            pairings: ['burt_lancaster'],
            rivalries: [],
            quirks: ['British accent', 'typecast as ladies', 'would break type in 50s'],
            description: 'Refined British actress just arriving in Hollywood. Kerr\'s ladylike quality and repressed passion made her perfect for quality dramas. She would fight typecasting by playing a adulteress in From Here to Eternity.'
        },

        richard_widmark: {
            id: 'richard_widmark',
            name: 'Richard Widmark',
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
            pairings: ['gene_tierney'],
            rivalries: [],
            quirks: ['giggling laugh', 'pushed wheelchair woman down stairs', 'instant star villain'],
            description: 'Terrifying newcomer who became an instant star villain. Widmark\'s giggling psychopath in Kiss of Death was so effective he struggled to escape villain roles. His sadistic intensity was unforgettable.'
        },

        cornel_wilde: {
            id: 'cornel_wilde',
            name: 'Cornel Wilde',
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
            pairings: ['linda_darnell', 'gene_tierney'],
            rivalries: [],
            quirks: ['Olympic fencer', 'polyglot', 'would become director'],
            description: 'Athletic newcomer and Olympic-level fencer. Wilde\'s exotic good looks and fencing ability made him perfect for swashbucklers and costume dramas. He would later become a respected director.'
        },

        jane_greer: {
            id: 'jane_greer',
            name: 'Jane Greer',
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
            pairings: ['robert_mitchum'],
            rivalries: [],
            quirks: ['married Howard Hughes briefly', 'deaf in one ear', 'Out of the Past'],
            description: 'Rising femme fatale who would define the type. Greer\'s cool duplicity and sultry beauty made her perfect for noir. Her performance in Out of the Past opposite Mitchum became the definitive femme fatale.'
        },

        wendell_corey: {
            id: 'wendell_corey',
            name: 'Wendell Corey',
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
            pairings: ['barbara_stanwyck'],
            rivalries: [],
            quirks: ['alcoholic', 'dependable', 'would enter politics'],
            description: 'Solid new character actor with everyman appeal. Corey\'s dependable presence and natural acting made him perfect for supporting roles in noir and drama. His alcoholism would limit his career.'
        },

        marie_windsor: {
            id: 'marie_windsor',
            name: 'Marie Windsor',
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
            description: 'Rising B-movie noir queen. Windsor\'s tall frame and hard-bitten delivery made her perfect for low-budget noirs. She would become a cult icon for her tough dame performances in poverty row classics.'
        },

        mark_stevens: {
            id: 'mark_stevens',
            name: 'Mark Stevens',
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
            id: 'jean_arthur',
            name: 'Jean Arthur',
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
            pairings: ['james_stewart', 'cary_grant', 'gary_cooper'],
            rivalries: [],
            quirks: ['neurotic', 'hated Hollywood', 'retired frequently', 'distinctive voice'],
            description: 'Screwball comedy star with a distinctive husky voice. Arthur\'s spunky working-class heroines made her perfect for Capra films. Neurotic and difficult, she hated Hollywood and retired multiple times.'
        },

        rosalind_russell: {
            id: 'rosalind_russell',
            name: 'Rosalind Russell',
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
            pairings: ['cary_grant', 'fred_macmurray'],
            rivalries: [],
            quirks: ['rapid-fire delivery', 'career woman image', 'comedy timing'],
            description: 'Master of rapid-fire dialogue and sophisticated comedy. Russell\'s His Girl Friday performance set the standard for fast-talking career women. Her energy and intelligence made her unique among 1940s stars.'
        },

        carole_lombard: {
            id: 'carole_lombard',
            name: 'Carole Lombard',
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
            pairings: ['william_powell', 'clark_gable', 'fred_macmurray'],
            rivalries: [],
            quirks: ['foul mouth', 'married Gable', 'died in plane crash', 'practical joker'],
            description: 'The queen of screwball comedy with a famously foul mouth. Lombard\'s natural glamour and comedic genius made her Hollywood\'s highest-paid star by 1937. Her death in a 1942 plane crash devastated Gable.'
        },

        jean_harlow: {
            id: 'jean_harlow',
            name: 'Jean Harlow',
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
            pairings: ['clark_gable', 'william_powell', 'spencer_tracy'],
            rivalries: ['norma_shearer'],
            quirks: ['platinum blonde', 'died at 26', 'scandal-plagued', 'no underwear'],
            description: 'The original platinum blonde bombshell. Harlow\'s raw sex appeal and surprising comic timing made her MGM\'s hottest star. Her tragic death at 26 from kidney failure shocked Hollywood. Powell never recovered.'
        },

        // Add more character actors to reach 75+...

        alan_ladd: {
            id: 'alan_ladd',
            name: 'Alan Ladd',
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
            pairings: ['veronica_lake'],
            rivalries: [],
            quirks: ['only 5\'6"', 'stood on boxes', 'alcoholic', 'insecure'],
            description: 'Diminutive tough guy with icy cool. Ladd\'s chemistry with Veronica Lake created magic despite requiring her to stand in trenches. His small stature and insecurity fueled his intense performances and alcoholism.'
        },

        gene_kelly: {
            id: 'gene_kelly',
            name: 'Gene Kelly',
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
            pairings: ['judy_garland', 'frank_sinatra'],
            rivalries: ['fred_astaire'],
            quirks: ['athletic dancing', 'choreographer', 'Pittsburgh Irish', 'innovator'],
            description: 'Athletic dancer bringing working-class energy to musicals. Kelly\'s innovative choreography and masculine dancing style contrasted with Astaire\'s elegance. His best work as director-choreographer came in the 1950s.'
        },

        judy_garland: {
            id: 'judy_garland',
            name: 'Judy Garland',
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
            pairings: ['mickey_rooney', 'gene_kelly'],
            rivalries: [],
            quirks: ['pill addiction', 'abused by studio', 'powerful voice', 'unstable'],
            description: 'The most talented and troubled musical star. Garland\'s powerful voice and emotional vulnerability made her unforgettable, but MGM\'s abuse with pills and exploitation destroyed her health. Her instability was already showing.'
        },

        // ========================================================================
        // 1950s STARS - Method Acting and New Hollywood Glamour
        // ========================================================================

        marlon_brando: {
            id: 'marlon_brando',
            name: 'Marlon Brando',
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
            pairings: ['vivien_leigh', 'eva_marie_saint'],
            rivalries: ['james_dean'],
            quirks: ['refuses direction', 'weight gain issues', 'political activism', 'refuses Oscar'],
            description: 'The greatest actor of his generation. Brando\'s Method acting revolutionized the craft, bringing raw emotional truth to the screen. His refusal to play by Hollywood\'s rules made him both legendary and difficult.'
        },

        james_dean: {
            id: 'james_dean',
            name: 'James Dean',
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
            pairings: ['natalie_wood', 'elizabeth_taylor'],
            rivalries: [],
            quirks: ['reckless driver', 'moody on set', 'icon of rebellion'],
            description: 'The ultimate symbol of youthful rebellion. Dean made only three films but became an immortal icon. His raw vulnerability and tortured intensity defined a generation\'s disillusionment.'
        },

        marilyn_monroe: {
            id: 'marilyn_monroe',
            name: 'Marilyn Monroe',
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
            pairings: ['tony_curtis', 'clark_gable'],
            rivalries: ['jane_russell'],
            quirks: ['chronically late', 'demands retakes', 'fragile psyche', 'studio conflicts'],
            description: 'The most iconic sex symbol in cinema history. Monroe\'s breathy voice and luminous screen presence masked genuine comic talent and deep personal turmoil. Her battles with studios and personal demons became legendary.'
        },

        grace_kelly: {
            id: 'grace_kelly',
            name: 'Grace Kelly',
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
            pairings: ['cary_grant', 'james_stewart', 'gary_cooper'],
            rivalries: [],
            quirks: ['Hitchcock favorite', 'secretly passionate', 'leaves for royalty'],
            description: 'The epitome of cool blonde elegance. Kelly\'s brief but brilliant career produced unforgettable Hitchcock heroines before she traded Hollywood for a real-life fairy tale as Princess of Monaco.'
        },

        audrey_hepburn: {
            id: 'audrey_hepburn',
            name: 'Audrey Hepburn',
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
            pairings: ['gregory_peck', 'cary_grant', 'fred_astaire'],
            rivalries: [],
            quirks: ['fashion icon', 'humanitarian', 'insecure about talent'],
            description: 'The most elegant star in Hollywood history. Hepburn\'s gamine charm, impeccable style, and genuine warmth made her beloved worldwide. Her transition from actress to humanitarian was seamless.'
        },

        elizabeth_taylor: {
            id: 'elizabeth_taylor',
            name: 'Elizabeth Taylor',
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
            pairings: ['richard_burton', 'montgomery_clift', 'paul_newman'],
            rivalries: ['debbie_reynolds'],
            quirks: ['multiple marriages', 'health problems', 'jewelry obsession', 'tabloid magnet'],
            description: 'The last great studio-era movie star. Taylor\'s violet eyes, stunning beauty, and tumultuous personal life kept her in headlines for decades. Her on-screen passion was matched only by her off-screen drama.'
        },

        rock_hudson: {
            id: 'rock_hudson',
            name: 'Rock Hudson',
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
            pairings: ['doris_day', 'elizabeth_taylor'],
            rivalries: [],
            quirks: ['closeted personal life', 'studio-manufactured image', 'reliable professional'],
            description: 'The quintessential 1950s leading man. Hudson\'s towering physique and easy charm made him the top box office draw. His comedies with Doris Day defined an era, while his private life remained carefully hidden.'
        },

        kim_novak: {
            id: 'kim_novak',
            name: 'Kim Novak',
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
            pairings: ['james_stewart', 'frank_sinatra'],
            rivalries: ['grace_kelly'],
            quirks: ['Hitchcock muse', 'studio-controlled image', 'resistant to typecasting'],
            description: 'Columbia\'s answer to Marilyn Monroe, but with a haunting depth. Novak\'s ethereal presence in Vertigo created one of cinema\'s most unforgettable performances. Her mysterious quality made her perfect for Hitchcock.'
        },

        // ========================================================================
        // 1960s STARS - The New Wave and International Icons
        // ========================================================================

        paul_newman: {
            id: 'paul_newman',
            name: 'Paul Newman',
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
            description: 'The coolest actor in Hollywood. Newman\'s piercing blue eyes and effortless charisma masked serious dramatic talent. His partnership with Robert Redford produced cinematic magic, and his philanthropy set a new standard.'
        },

        steve_mcqueen: {
            id: 'steve_mcqueen',
            name: 'Steve McQueen',
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
            pairings: ['faye_dunaway', 'ali_macgraw'],
            rivalries: ['paul_newman'],
            quirks: ['motorcycle obsession', 'difficult on set', 'demands top billing', 'paranoid'],
            description: 'The King of Cool. McQueen\'s laconic intensity and physical magnetism made him the ultimate action star. His anti-establishment persona and love of speed defined a new kind of masculine cool.'
        },

        sidney_poitier: {
            id: 'sidney_poitier',
            name: 'Sidney Poitier',
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
            pairings: ['rod_steiger', 'tony_curtis'],
            rivalries: [],
            quirks: ['racial barrier breaker', 'refuses demeaning roles', 'regal bearing'],
            description: 'The man who broke Hollywood\'s color barrier. Poitier\'s dignified presence and immense talent made him the first Black actor to win the Best Actor Oscar. His insistence on roles of dignity changed the industry forever.'
        },

        sean_connery: {
            id: 'sean_connery',
            name: 'Sean Connery',
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
            description: 'The definitive James Bond and so much more. Connery\'s raw masculine charisma and dangerous charm made him an international superstar. His later career proved he was far more than 007.'
        },

        julie_andrews: {
            id: 'julie_andrews',
            name: 'Julie Andrews',
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
            description: 'The voice of a generation. Andrews dominated the 1960s musical with Mary Poppins and The Sound of Music, her crystal-clear soprano and impeccable charm creating two of cinema\'s most beloved characters.'
        },

        sophia_loren: {
            id: 'sophia_loren',
            name: 'Sophia Loren',
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
            pairings: ['marcello_mastroianni', 'cary_grant'],
            rivalries: ['gina_lollobrigida'],
            quirks: ['international glamour', 'rose from poverty', 'Italian fire'],
            description: 'Italy\'s greatest film export. Loren\'s stunning beauty and raw dramatic power made her the first actress to win an Oscar for a non-English language performance. Her rags-to-riches story was more dramatic than any film.'
        },

        // ========================================================================
        // 1970s STARS - New Hollywood and the Director\'s Era
        // ========================================================================

        robert_de_niro: {
            id: 'robert_de_niro',
            name: 'Robert De Niro',
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
            rivalries: ['al_pacino'],
            quirks: ['extreme method acting', 'gains weight for roles', 'Scorsese partnership'],
            description: 'The greatest actor of his generation. De Niro\'s total commitment to Method acting produced some of cinema\'s most unforgettable performances. His physical and psychological transformations remain unmatched.'
        },

        al_pacino: {
            id: 'al_pacino',
            name: 'Al Pacino',
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
            pairings: ['diane_keaton', 'robert_de_niro'],
            rivalries: ['robert_de_niro'],
            quirks: ['Hoo-ah!', 'theatrical training', 'increasingly bombastic'],
            description: 'The most electrifying actor in American cinema. Pacino\'s volcanic intensity and theatrical flair produced Michael Corleone, Tony Montana, and countless other iconic performances. His quiet menace could explode into operatic fury.'
        },

        jack_nicholson: {
            id: 'jack_nicholson',
            name: 'Jack Nicholson',
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
            pairings: ['faye_dunaway', 'shirley_maclaine'],
            rivalries: [],
            quirks: ['sunglasses indoors', 'Lakers superfan', 'legendary partier', 'eyebrow acting'],
            description: 'The most charismatic actor of his era. Nicholson\'s devilish grin and unpredictable energy made every film an event. Three Oscars barely capture the breadth of his talent, from Easy Rider to The Shining to As Good as It Gets.'
        },

        dustin_hoffman: {
            id: 'dustin_hoffman',
            name: 'Dustin Hoffman',
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
            pairings: ['meryl_streep', 'tom_cruise'],
            rivalries: [],
            quirks: ['perfectionist', 'difficult on set', 'Method extremist'],
            description: 'The anti-movie star who became a movie star. Hoffman\'s unconventional looks and obsessive commitment to character made him the most unlikely leading man in Hollywood. His range from The Graduate to Tootsie to Rain Man is staggering.'
        },

        faye_dunaway: {
            id: 'faye_dunaway',
            name: 'Faye Dunaway',
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
            pairings: ['warren_beatty', 'jack_nicholson', 'steve_mcqueen'],
            rivalries: [],
            quirks: ['demands perfection', 'temperamental', 'high-maintenance'],
            description: 'The ice-cold beauty of New Hollywood. Dunaway\'s fierce intelligence and stunning presence defined the era, from Bonnie and Clyde to Chinatown to Network. Her intensity could be riveting or terrifying, sometimes both.'
        },

        diane_keaton: {
            id: 'diane_keaton',
            name: 'Diane Keaton',
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
            pairings: ['woody_allen', 'al_pacino'],
            rivalries: [],
            quirks: ['signature menswear style', 'self-deprecating', 'Allen muse'],
            description: 'The most original screen presence of her generation. Keaton\'s quirky charm, distinctive fashion sense, and natural comic timing created Annie Hall, one of cinema\'s most beloved characters. Her dramatic range surprised everyone.'
        },

        // ========================================================================
        // 1980s STARS - Blockbuster Era Icons
        // ========================================================================

        harrison_ford: {
            id: 'harrison_ford',
            name: 'Harrison Ford',
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
            pairings: ['carrie_fisher', 'karen_allen', 'sean_connery'],
            rivalries: [],
            quirks: ['former carpenter', 'private person', 'planes and crashes', 'grumpy interviews'],
            description: 'The biggest movie star of the blockbuster era. Ford\'s everyman appeal and dry humor made Han Solo and Indiana Jones into cultural icons. His ability to seem like a regular guy doing extraordinary things was unmatched.'
        },

        meryl_streep: {
            id: 'meryl_streep',
            name: 'Meryl Streep',
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
            pairings: ['dustin_hoffman', 'robert_de_niro'],
            rivalries: [],
            quirks: ['accent perfectionist', 'most nominated ever', 'versatility incarnate'],
            description: 'Widely considered the greatest living actress. Streep\'s chameleon-like ability to disappear into any role, era, or accent is unmatched. Her Oscar record will likely never be broken.'
        },

        tom_hanks: {
            id: 'tom_hanks',
            name: 'Tom Hanks',
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
            description: 'America\'s most beloved actor. Hanks\'s natural warmth and emotional authenticity transformed him from comic actor to dramatic powerhouse. His consecutive Oscar wins cemented his status as the modern James Stewart.'
        },

        sigourney_weaver: {
            id: 'sigourney_weaver',
            name: 'Sigourney Weaver',
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
            description: 'The woman who proved female action heroes could carry blockbusters. Weaver\'s Ripley in Alien shattered gender barriers in sci-fi and action. Her intelligence and physical presence redefined what a leading lady could be.'
        },

        eddie_murphy: {
            id: 'eddie_murphy',
            name: 'Eddie Murphy',
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
            description: 'The most bankable comedian of the 1980s. Murphy\'s explosive energy and fearless comedy made him a superstar before he turned 25. His box office dominance in the 1980s was rivaled only by Spielberg.'
        },

        michael_douglas: {
            id: 'michael_douglas',
            name: 'Michael Douglas',
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
            description: 'The definitive 1980s alpha male. Douglas\'s Gordon Gekko became the icon of Reagan-era excess. His ability to make morally compromised characters charismatic and compelling was his greatest gift.'
        },

        // ========================================================================
        // 1990s STARS - Indie Revolution and Global Stardom
        // ========================================================================

        denzel_washington: {
            id: 'denzel_washington',
            name: 'Denzel Washington',
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
            pairings: ['julia_roberts', 'ethan_hawke'],
            rivalries: [],
            quirks: ['methodical preparation', 'refuses villain roles (mostly)', 'quiet dignity'],
            description: 'The most respected actor of his generation. Washington\'s commanding presence and quiet intensity brought dignity and complexity to every role. His Oscar for Training Day proved he could play against type brilliantly.'
        },

        julia_roberts: {
            id: 'julia_roberts',
            name: 'Julia Roberts',
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
            pairings: ['richard_gere', 'hugh_grant', 'denzel_washington'],
            rivalries: [],
            quirks: ['biggest female star', 'runaway bride reputation', 'infectious laugh'],
            description: 'America\'s Sweetheart. Roberts\'s megawatt smile and natural charm made her the highest-paid actress in Hollywood. Pretty Woman created a modern fairy tale, and her box office power was unprecedented for a female star.'
        },

        brad_pitt: {
            id: 'brad_pitt',
            name: 'Brad Pitt',
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
            pairings: ['george_clooney', 'edward_norton'],
            rivalries: [],
            quirks: ['tabloid magnet', 'produces serious films', 'snacks on set'],
            description: 'The rare combination of matinee idol looks and serious acting ambition. Pitt\'s willingness to take risks with Fight Club, Se7en, and Snatch proved there was real talent behind the pretty face.'
        },

        samuel_l_jackson: {
            id: 'samuel_l_jackson',
            name: 'Samuel L. Jackson',
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
            quirks: ['Tarantino favorite', 'most prolific A-lister', 'golf obsession'],
            description: 'The hardest working man in Hollywood. Jackson\'s Pulp Fiction breakthrough launched one of the most prolific careers in film history. His commanding voice and explosive presence make every film better.'
        },

        jodie_foster: {
            id: 'jodie_foster',
            name: 'Jodie Foster',
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
            id: 'will_smith',
            name: 'Will Smith',
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
            id: 'leonardo_dicaprio',
            name: 'Leonardo DiCaprio',
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
            pairings: ['kate_winslet', 'cate_blanchett'],
            rivalries: [],
            quirks: ['Scorsese partnership', 'environmental activism', 'model girlfriends', 'Oscar quest'],
            description: 'The most dedicated actor of his generation. DiCaprio survived teen heartthrob status to become the go-to leading man for prestige cinema. His Scorsese collaborations and intense commitment to every role cemented his legacy.'
        },

        george_clooney: {
            id: 'george_clooney',
            name: 'George Clooney',
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
            pairings: ['brad_pitt', 'matt_damon'],
            rivalries: [],
            quirks: ['prankster', 'political activist', 'refuses superhero return', 'old-school star'],
            description: 'The last old-school movie star. Clooney\'s Cary Grant-like charm and intelligence made him a throwback to Golden Age Hollywood. His dual career as actor and producer-director showed rare ambition and social conscience.'
        },

        cate_blanchett: {
            id: 'cate_blanchett',
            name: 'Cate Blanchett',
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
            pairings: ['leonardo_dicaprio', 'brad_pitt'],
            rivalries: [],
            quirks: ['Australian theater roots', 'fearless role choices', 'effortless elegance'],
            description: 'The most versatile actress of her generation. Blanchett\'s ability to transform into anyone from Queen Elizabeth to Bob Dylan to an elf queen demonstrated range that few can match. Her theatrical training gave her extraordinary power.'
        },

        angelina_jolie: {
            id: 'angelina_jolie',
            name: 'Angelina Jolie',
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
            pairings: ['brad_pitt'],
            rivalries: [],
            quirks: ['humanitarian missions', 'tabloid magnet', 'action star credibility', 'directs too'],
            description: 'The most famous woman in the world. Jolie\'s combination of dark beauty, fearless physicality, and genuine humanitarian work made her a global icon. Her Lara Croft proved women could carry action franchises.'
        },

        johnny_depp: {
            id: 'johnny_depp',
            name: 'Johnny Depp',
            gender: 'male',
            starPower: 95,
            weeklyRate: 250000,
            genres: ['adventure', 'fantasy', 'drama', 'comedy', 'horror'],
            specialties: ['eccentric characters', 'physical comedy', 'Tim Burton muse'],
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
            id: 'frank_capra',
            name: 'Frank Capra',
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
            description: 'Master of Americana and populist fables. Capra\'s films celebrate the common man standing up to corruption and cynicism. His sentimental optimism and brilliant comic timing made him the top director of the 1930s.'
        },

        john_ford: {
            id: 'john_ford',
            name: 'John Ford',
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
            id: 'howard_hawks',
            name: 'Howard Hawks',
            talent: 94,
            weeklyRate: 4800,
            genres: ['comedy', 'western', 'noir', 'adventure', 'crime'],
            availableFrom: 1933,
            availableTo: 1970, // Rio Lobo (1970) was final film
            oscarPotential: 18,
            scandalRisk: 6,
            specialties: ['dialogue', 'professionalism', 'strong women', 'overlapping talk'],
            description: 'The ultimate genre master and professional. Hawks excelled at everything - screwball comedy, westerns, noir, war films. His rapid-fire dialogue, strong women, and celebration of professionalism made every film distinctive.'
        },

        alfred_hitchcock: {
            id: 'alfred_hitchcock',
            name: 'Alfred Hitchcock',
            talent: 99,
            weeklyRate: 6500,
            genres: ['thriller', 'noir', 'suspense', 'crime'],
            availableFrom: 1940, // Came to Hollywood in 1939
            availableTo: 1976, // Family Plot (1976) was final film
            oscarPotential: 25, // Never won competitive Oscar!
            scandalRisk: 8,
            specialties: ['suspense', 'visual storytelling', 'psychology', 'MacGuffins'],
            budgetRisk: false,
            description: 'The Master of Suspense. Hitchcock\'s mathematical precision, visual brilliance, and psychological insight made him the supreme thriller director. His use of suspense over surprise and visual storytelling was revolutionary. Brilliant but cruel to actors.'
        },

        billy_wilder: {
            id: 'billy_wilder',
            name: 'Billy Wilder',
            talent: 96,
            weeklyRate: 5200,
            genres: ['noir', 'comedy', 'drama', 'satire'],
            availableFrom: 1942, // Directorial debut
            availableTo: 1978, // Fedora (1978) was last notable film
            oscarWinner: true, // The Lost Weekend (1945)
            oscarPotential: 36,
            scandalRisk: 10,
            specialties: ['cynicism', 'wit', 'dark comedy', 'Austrian precision'],
            description: 'Cynical genius who perfected dark comedy and film noir. Wilder\'s European sophistication and bitter wit created unique American films. His scripts were surgical in their precision, his characters deeply flawed and human.'
        },

        william_wyler: {
            id: 'william_wyler',
            name: 'William Wyler',
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
            description: 'Meticulous craftsman known for endless retakes. Wyler\'s deep focus photography and perfectionism drove actors crazy but won Oscars. His literary adaptations and prestige dramas set the standard for quality filmmaking.'
        },

        george_cukor: {
            id: 'george_cukor',
            name: 'George Cukor',
            talent: 91,
            weeklyRate: 4500,
            genres: ['comedy', 'drama', 'romance', 'melodrama'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 22,
            scandalRisk: 12,
            specialties: ['women\'s pictures', 'sophisticated dialogue', 'actor direction', 'drawing room comedy'],
            description: 'The women\'s director who brought out brilliant performances. Cukor\'s sophisticated touch and understanding of actresses made him the favorite of Hollywood\'s leading ladies. His homosexuality was an open secret.'
        },

        victor_fleming: {
            id: 'victor_fleming',
            name: 'Victor Fleming',
            talent: 90,
            weeklyRate: 4400,
            genres: ['adventure', 'drama', 'romance', 'epic'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Gone with the Wind (1939)
            oscarPotential: 28,
            scandalRisk: 10,
            specialties: ['epic scale', 'masculine adventure', 'Technicolor spectacle', 'star wrangling'],
            description: 'The master of epic spectacle and masculine adventure. Fleming directed both Gone with the Wind and The Wizard of Oz in 1939 - the most remarkable year in film history. His masculine, no-nonsense style contrasted with his romantic subjects.'
        },

        // ========================================================================
        // A-LIST DIRECTORS (Talent: 80-89) - The Established Masters
        // ========================================================================

        orson_welles: {
            id: 'orson_welles',
            name: 'Orson Welles',
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
            description: 'The boy genius who revolutionized cinema at 25. Welles\' Citizen Kane changed film language forever, but his arrogance and perfectionism made him unemployable. A brilliant, impossible talent whose vision exceeded studio patience.'
        },

        preston_sturges: {
            id: 'preston_sturges',
            name: 'Preston Sturges',
            talent: 91,
            weeklyRate: 4600,
            genres: ['comedy', 'satire', 'screwball'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarWinner: true, // The Great McGinty screenplay (1940)
            oscarPotential: 24,
            scandalRisk: 14,
            specialties: ['screwball', 'satire', 'rapid dialogue', 'stock company'],
            description: 'Comedy innovator who became first screenwriter-director. Sturges\' rapid-fire dialogue and satirical edge revolutionized comedy. His stock company of character actors and sophisticated wit made his 1940-44 run the greatest in comedy history.'
        },

        john_huston: {
            id: 'john_huston',
            name: 'John Huston',
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
            description: 'Adventure storyteller and masculine filmmaker. Huston\'s hard-boiled sensibility and love of male bonding rituals created distinctive films. A writer-director who respected literature and brought literary quality to tough genres.'
        },

        michael_curtiz: {
            id: 'michael_curtiz',
            name: 'Michael Curtiz',
            talent: 88,
            weeklyRate: 4000,
            genres: ['drama', 'adventure', 'war', 'musical', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // Casablanca (1943)
            oscarPotential: 26,
            scandalRisk: 8,
            specialties: ['versatility', 'pace', 'professionalism', 'studio workhorse'],
            description: 'The ultimate studio workhorse who could do anything. Curtiz directed hundreds of films in every genre with speed and professionalism. His Hungarian-mangled English was legendary, but his visual sense and pace were flawless.'
        },

        ernst_lubitsch: {
            id: 'ernst_lubitsch',
            name: 'Ernst Lubitsch',
            talent: 93,
            weeklyRate: 4800,
            genres: ['comedy', 'romance', 'musical'],
            availableFrom: 1933,
            availableTo: 1947, // Died 1947
            oscarPotential: 22,
            scandalRisk: 6,
            specialties: ['sophistication', 'the lubitsch touch', 'wit', 'continental elegance'],
            description: 'Master of innuendo and sophisticated comedy. Lubitsch\'s "touch" - suggesting sex and scandal through wit and visual subtlety - made him unique. His European sophistication brought elegance to American comedy. The directors\' director.'
        },

        king_vidor: {
            id: 'king_vidor',
            name: 'King Vidor',
            talent: 90,
            weeklyRate: 4400,
            genres: ['drama', 'war', 'western', 'epic'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 24,
            scandalRisk: 10,
            specialties: ['visual grandeur', 'social consciousness', 'epic scale', 'montage'],
            description: 'Visionary director of epic scope and social conscience. Vidor\'s films combined spectacular visuals with social commentary. His silent masterpieces influenced all directors, and his sound films maintained his visual brilliance.'
        },

        leo_mccarey: {
            id: 'leo_mccarey',
            name: 'Leo McCarey',
            talent: 89,
            weeklyRate: 4200,
            genres: ['comedy', 'drama', 'romance'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarWinner: true, // The Awful Truth (1937), Going My Way (1944)
            oscarPotential: 30,
            scandalRisk: 8,
            specialties: ['improvisation', 'warmth', 'sentiment', 'comedy-drama balance'],
            description: 'Master of improvisation and heartfelt comedy-drama. McCarey let actors improvise and captured magical moments. His ability to balance tears and laughter, sentiment and comedy, made him unique. Directors worshipped his instinct.'
        },

        raoul_walsh: {
            id: 'raoul_walsh',
            name: 'Raoul Walsh',
            talent: 86,
            weeklyRate: 3800,
            genres: ['western', 'adventure', 'war', 'crime'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 12,
            specialties: ['action', 'masculine energy', 'outdoor adventure', 'pace'],
            description: 'One-eyed action master and masculine filmmaker. Walsh directed with enormous energy and visual flair. His adventures and westerns moved like locomotives, his male characters were vital and energetic. Lost an eye in 1928, wore eyepatch forever.'
        },

        rouben_mamoulian: {
            id: 'rouben_mamoulian',
            name: 'Rouben Mamoulian',
            talent: 87,
            weeklyRate: 3900,
            genres: ['musical', 'drama', 'romance', 'horror'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 7,
            specialties: ['visual innovation', 'Technicolor pioneer', 'stylization', 'theatricality'],
            description: 'Innovative stylist and Technicolor pioneer. Mamoulian brought theatrical imagination to film with bold visual experimentation. His use of color, sound, and stylization influenced all filmmakers. Difficult and fired from Cleopatra.'
        },

        clarence_brown: {
            id: 'clarence_brown',
            name: 'Clarence Brown',
            talent: 84,
            weeklyRate: 3600,
            genres: ['drama', 'romance', 'melodrama'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 20,
            scandalRisk: 5,
            specialties: ['women\'s pictures', 'prestige drama', 'Garbo films', 'subtle direction'],
            description: 'MGM\'s most elegant director of women\'s pictures. Brown directed Garbo\'s greatest films and brought subtle, sophisticated touch to melodrama. His visual elegance and restraint made him the studio\'s prestige director.'
        },

        george_stevens: {
            id: 'george_stevens',
            name: 'George Stevens',
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
            id: 'mervyn_leroy',
            name: 'Mervyn LeRoy',
            talent: 83,
            weeklyRate: 3500,
            genres: ['drama', 'crime', 'musical', 'biography'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 18,
            scandalRisk: 7,
            specialties: ['social problem films', 'gangster films', 'versatility', 'pace'],
            description: 'Warner Bros. workhorse who pioneered social problem films. LeRoy\'s Little Caesar and I Am a Fugitive launched the gangster cycle. His versatility and professionalism made him invaluable, though he lacked distinctive style.'
        },

        // ========================================================================
        // B-LIST DIRECTORS (Talent: 70-79) - The Skilled Craftsmen
        // ========================================================================

        jacques_tourneur: {
            id: 'jacques_tourneur',
            name: 'Jacques Tourneur',
            talent: 82,
            weeklyRate: 3200,
            genres: ['noir', 'horror', 'thriller', 'western'],
            availableFrom: 1939,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 5,
            specialties: ['atmosphere', 'shadows', 'psychological horror', 'RKO horror unit'],
            description: 'Atmospheric stylist and master of shadows. Tourneur\'s Cat People and other Val Lewton productions proved horror could be poetic and psychological. His use of darkness and suggestion influenced all noir and horror filmmakers.'
        },

        edward_dmytryk: {
            id: 'edward_dmytryk',
            name: 'Edward Dmytryk',
            talent: 78,
            weeklyRate: 2800,
            genres: ['noir', 'drama', 'thriller', 'war'],
            availableFrom: 1939,
            availableTo: 1949,
            huacRisk: true, // One of the Hollywood Ten - blacklisted!
            oscarPotential: 14,
            scandalRisk: 16,
            specialties: ['social issues', 'noir style', 'message pictures', 'visual flair'],
            description: 'Social realist and noir stylist. Dmytryk brought liberal politics and visual flair to B-movies and message pictures. His communist ties made him one of the Hollywood Ten - he would be blacklisted and imprisoned in 1950.'
        },

        robert_siodmak: {
            id: 'robert_siodmak',
            name: 'Robert Siodmak',
            talent: 84,
            weeklyRate: 3400,
            genres: ['noir', 'thriller', 'crime', 'horror'],
            availableFrom: 1940,
            availableTo: 1949,
            oscarPotential: 16,
            scandalRisk: 8,
            specialties: ['expressionism', 'shadows', 'fatalism', 'German style'],
            description: 'German émigré who brought expressionism to film noir. Siodmak\'s shadowy visual style and fatalistic worldview made him the ultimate noir director. His use of darkness, mirrors, and subjective camera work was revolutionary.'
        },

        edgar_g_ulmer: {
            id: 'edgar_g_ulmer',
            name: 'Edgar G. Ulmer',
            talent: 79,
            weeklyRate: 1800,
            genres: ['noir', 'horror', 'melodrama', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 4,
            scandalRisk: 12,
            specialties: ['poverty row genius', 'resourcefulness', 'visual style on no budget', 'European artistry'],
            description: 'The Poverty Row genius who made masterpieces with no money. Ulmer\'s affair with a producer\'s wife exiled him to low-budget hell, where he created visual poetry on shoestring budgets. Detour proved art transcends money.'
        },

        anthony_mann: {
            id: 'anthony_mann',
            name: 'Anthony Mann',
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
            id: 'jules_dassin',
            name: 'Jules Dassin',
            talent: 81,
            weeklyRate: 2900,
            genres: ['noir', 'crime', 'drama', 'thriller'],
            availableFrom: 1942,
            availableTo: 1949,
            huacRisk: true, // Would be blacklisted in 1950
            oscarPotential: 16,
            scandalRisk: 14,
            specialties: ['location shooting', 'documentary realism', 'social consciousness', 'heist films'],
            description: 'Realistic noir director who pioneered location shooting. Dassin brought documentary authenticity to crime films with location work in real cities. His leftist politics would get him blacklisted after his masterpiece The Naked City.'
        },

        joseph_h_lewis: {
            id: 'joseph_h_lewis',
            name: 'Joseph H. Lewis',
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
            id: 'andre_de_toth',
            name: 'Andre De Toth',
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
            id: 'robert_wise',
            name: 'Robert Wise',
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
            id: 'henry_hathaway',
            name: 'Henry Hathaway',
            talent: 78,
            weeklyRate: 2700,
            genres: ['western', 'noir', 'adventure', 'crime'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 12,
            scandalRisk: 9,
            specialties: ['location shooting', 'toughness', 'outdoor action', 'no-nonsense'],
            description: 'Tough professional who pioneered location shooting. Hathaway brought outdoor authenticity and muscular direction to westerns and noir. Known for being tough on actors but delivering solid commercial entertainment on schedule.'
        },

        // ========================================================================
        // CONTRACT DIRECTORS (Talent: 55-69) - The Reliable Workhorses
        // ========================================================================

        william_castle: {
            id: 'william_castle',
            name: 'William Castle',
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
            id: 'roy_william_neill',
            name: 'Roy William Neill',
            talent: 72,
            weeklyRate: 1900,
            genres: ['mystery', 'horror', 'thriller', 'crime'],
            availableFrom: 1933,
            availableTo: 1946, // Died 1946
            oscarPotential: 6,
            scandalRisk: 5,
            specialties: ['Sherlock Holmes series', 'atmospheric B-movies', 'efficient production'],
            description: 'Efficient B-movie director who made the Sherlock Holmes series. Neill brought atmospheric style and narrative efficiency to Universal\'s Holmes films with Basil Rathbone. Reliable studio workhorse who died suddenly in 1946.'
        },

        lew_landers: {
            id: 'lew_landers',
            name: 'Lew Landers',
            gender: 'male',
            talent: 65,
            weeklyRate: 1400,
            genres: ['western', 'crime', 'horror', 'B-movies'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 2,
            scandalRisk: 6,
            specialties: ['speed', 'efficiency', 'poverty row', 'versatility'],
            description: 'The fastest director in Hollywood. Landers cranked out hundreds of B-movies in every genre with incredible speed. No artistry, but efficient storytelling and professionalism. The ultimate poverty row workhorse who delivered on time and under budget.'
        },

        lambert_hillyer: {
            id: 'lambert_hillyer',
            name: 'Lambert Hillyer',
            talent: 67,
            weeklyRate: 1500,
            genres: ['western', 'crime', 'serial', 'B-movies'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 3,
            scandalRisk: 4,
            specialties: ['western programmers', 'efficient storytelling', 'low budgets'],
            description: 'Veteran western programmer director. Hillyer directed William S. Hart silents before cranking out B-westerns in the sound era. Efficient and professional, delivering solid entertainment for small-town theaters and second features.'
        },

        william_beaudine: {
            id: 'william_beaudine',
            name: 'William Beaudine',
            talent: 64,
            weeklyRate: 1300,
            genres: ['comedy', 'drama', 'western', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 2,
            scandalRisk: 5,
            specialties: ['speed', 'one-take wonder', 'poverty row king', 'efficiency'],
            description: 'One-Shot Beaudine - the fastest and cheapest director. Beaudine made hundreds of films with incredible speed and minimal retakes. Started in silents, ended in TV. No artistry but amazing efficiency. The ultimate poverty row hack who kept working into the 1960s.'
        },

        sam_newfield: {
            id: 'sam_newfield',
            name: 'Sam Newfield',
            talent: 62,
            weeklyRate: 1200,
            genres: ['western', 'crime', 'horror', 'poverty row'],
            availableFrom: 1933,
            availableTo: 1949,
            oscarPotential: 1,
            scandalRisk: 6,
            specialties: ['PRC workhorse', 'ultra-low budgets', 'speed', 'volume'],
            description: 'The most prolific director in history - over 250 films! Newfield ground out poverty row quickies for PRC with no pretense to art. The ultimate hack, but his volume and speed were legendary. Used multiple pseudonyms to hide his ubiquity.'
        },

        // ========================================================================
        // 1950s DIRECTORS - International Masters and Epic Storytellers
        // ========================================================================

        akira_kurosawa: {
            id: 'akira_kurosawa',
            name: 'Akira Kurosawa',
            talent: 98,
            weeklyRate: 6000,
            genres: ['drama', 'adventure', 'war', 'thriller'],
            availableFrom: 1950,
            availableTo: 1985,
            oscarPotential: 30,
            scandalRisk: 3,
            specialties: ['visual grandeur', 'samurai cinema', 'humanist philosophy', 'dynamic editing'],
            quirks: [],
            description: 'The Emperor of Japanese cinema. Kurosawa\'s Rashomon, Seven Samurai, and Yojimbo influenced every action filmmaker who followed. His dynamic visual style and humanist themes transcended language barriers.'
        },

        david_lean: {
            id: 'david_lean',
            name: 'David Lean',
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
            id: 'elia_kazan',
            name: 'Elia Kazan',
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
            description: 'The director who brought Method acting to Hollywood. Kazan\'s explosive collaborations with Brando and Dean changed film acting forever. His HUAC testimony made him the most controversial figure in Hollywood.'
        },

        // ========================================================================
        // 1960s DIRECTORS - Auteurs and Genre Revolutionaries
        // ========================================================================

        stanley_kubrick: {
            id: 'stanley_kubrick',
            name: 'Stanley Kubrick',
            talent: 99,
            weeklyRate: 15000,
            genres: ['sci_fi', 'war', 'horror', 'drama', 'thriller', 'crime'],
            availableFrom: 1956,
            availableTo: 1999,
            oscarPotential: 28, // Criminally under-awarded
            scandalRisk: 8,
            specialties: ['visual perfection', 'genre mastery', 'psychological depth', 'obsessive control'],
            quirks: [],
            description: 'Cinema\'s greatest perfectionist. Kubrick\'s mathematical precision and obsessive control produced masterpieces in every genre he touched. From 2001 to The Shining to Full Metal Jacket, each film redefined its genre.'
        },

        roman_polanski: {
            id: 'roman_polanski',
            name: 'Roman Polanski',
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
            description: 'A brilliant, troubled genius. Polanski\'s ability to create unbearable tension and psychological horror produced Rosemary\'s Baby and Chinatown. His personal tragedies and scandals overshadowed extraordinary artistry.'
        },

        sergio_leone: {
            id: 'sergio_leone',
            name: 'Sergio Leone',
            talent: 94,
            weeklyRate: 10000,
            genres: ['western', 'crime', 'drama'],
            availableFrom: 1964,
            availableTo: 1984,
            oscarPotential: 20,
            scandalRisk: 4,
            specialties: ['extreme close-ups', 'Morricone scores', 'mythic westerns', 'operatic violence'],
            quirks: [],
            description: 'The man who reinvented the western. Leone\'s Spaghetti Westerns with Clint Eastwood and his operatic crime epic Once Upon a Time in America created a new visual language. His extreme close-ups and Morricone scores were revolutionary.'
        },

        // ========================================================================
        // 1970s DIRECTORS - New Hollywood Mavericks
        // ========================================================================

        francis_ford_coppola: {
            id: 'francis_ford_coppola',
            name: 'Francis Ford Coppola',
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
            description: 'The most ambitious director of New Hollywood. Coppola bet everything on The Godfather and won, creating the greatest American film. His willingness to risk financial ruin for artistic vision was both his greatest strength and weakness.'
        },

        martin_scorsese: {
            id: 'martin_scorsese',
            name: 'Martin Scorsese',
            talent: 98,
            weeklyRate: 30000,
            genres: ['crime', 'drama', 'thriller', 'comedy'],
            availableFrom: 1973,
            availableTo: 2010,
            oscarWinner: true, // The Departed (2006)
            oscarPotential: 36,
            scandalRisk: 6,
            specialties: ['urban crime', 'tracking shots', 'rock music', 'moral complexity', 'De Niro/DiCaprio'],
            quirks: [],
            description: 'American cinema\'s greatest living director. Scorsese\'s kinetic visual style, masterful use of music, and unflinching examination of violence and guilt produced Taxi Driver, Goodfellas, and The Departed. His film preservation work is equally important.'
        },

        ridley_scott: {
            id: 'ridley_scott',
            name: 'Ridley Scott',
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
            id: 'george_lucas',
            name: 'George Lucas',
            talent: 88,
            weeklyRate: 20000,
            genres: ['sci_fi', 'adventure', 'fantasy', 'action'],
            availableFrom: 1971,
            availableTo: 2005,
            oscarPotential: 18,
            scandalRisk: 3,
            specialties: ['worldbuilding', 'visual effects pioneer', 'mythology', 'franchise creation'],
            quirks: [],
            description: 'The man who changed movies forever. Lucas\'s Star Wars didn\'t just create a film franchise - it revolutionized visual effects, merchandising, and the entire business model of Hollywood. American Graffiti proved he could also make intimate films.'
        },

        woody_allen: {
            id: 'woody_allen',
            name: 'Woody Allen',
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
            id: 'steven_spielberg',
            name: 'Steven Spielberg',
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
            description: 'The most successful filmmaker in history. Spielberg invented the modern blockbuster with Jaws and proved he could also make profound art with Schindler\'s List. His ability to combine spectacle with genuine emotion is unmatched.'
        },

        james_cameron: {
            id: 'james_cameron',
            name: 'James Cameron',
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
            id: 'tim_burton',
            name: 'Tim Burton',
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
            id: 'quentin_tarantino',
            name: 'Quentin Tarantino',
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
            description: 'The video store clerk who rewrote cinema. Tarantino\'s Pulp Fiction detonated like a bomb, revitalizing independent film and proving that dazzling dialogue and nonlinear storytelling could be wildly commercial. His encyclopedic film knowledge infused every frame.'
        },

        david_fincher: {
            id: 'david_fincher',
            name: 'David Fincher',
            talent: 93,
            weeklyRate: 55000,
            genres: ['thriller', 'crime', 'drama'],
            availableFrom: 1992,
            availableTo: 2010,
            oscarPotential: 28,
            scandalRisk: 6,
            specialties: ['dark atmosphere', 'obsessive detail', 'digital perfection', 'serial killers'],
            quirks: [],
            description: 'The darkest visual stylist of his generation. Fincher\'s meticulous craftsmanship and bleak worldview produced Se7en, Fight Club, and Zodiac. His hundreds of takes and digital perfection created a new standard for thriller filmmaking.'
        },

        coen_brothers: {
            id: 'coen_brothers',
            name: 'Joel and Ethan Coen',
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
            id: 'christopher_nolan',
            name: 'Christopher Nolan',
            talent: 94,
            weeklyRate: 100000,
            genres: ['thriller', 'sci_fi', 'action', 'drama', 'crime'],
            availableFrom: 2000,
            availableTo: 2010,
            oscarPotential: 28,
            scandalRisk: 2,
            specialties: ['puzzle narratives', 'IMAX spectacle', 'practical effects', 'time manipulation'],
            quirks: [],
            description: 'The architect of cerebral blockbusters. Nolan proved that intellectually ambitious films could be massive commercial successes. Memento, The Dark Knight, and Inception redefined what blockbusters could be, blending spectacle with genuine ideas.'
        },

        peter_jackson: {
            id: 'peter_jackson',
            name: 'Peter Jackson',
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
            id: 'kathryn_bigelow',
            name: 'Kathryn Bigelow',
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
            description: 'The first woman to win the Best Director Oscar. Bigelow\'s visceral action filmmaking and unflinching war realism in The Hurt Locker shattered glass ceilings. Her films pulse with adrenaline while maintaining genuine emotional depth.'
        },

        ang_lee: {
            id: 'ang_lee',
            name: 'Ang Lee',
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
