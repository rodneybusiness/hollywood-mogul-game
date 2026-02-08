/**
 * HOLLYWOOD MOGUL - SCRIPT LIBRARY
 * Historically authentic film scripts spanning 1933-2010
 * 250+ unique scripts across 12 eras and all major genres
 */

window.ScriptLibrary = (function() {
    'use strict';

    // Master script database with historical authenticity
    const SCRIPT_DATABASE = {
        // PRE-CODE ERA (1933-1934) - Risqué content, fewer restrictions
        preCode: [
            // GANGSTER/CRIME
            {
                title: "The Public Enemy",
                genre: "gangster",
                year: 1933,
                budget: 85000,
                quality: 82,
                description: "A hard-hitting tale of two boys who rise from poverty to become ruthless bootleggers in Prohibition-era Chicago.",
                censorRisk: 85,
                shootingDays: 18,
                themes: ["crime", "corruption", "prohibition"],
                castRequirements: { male_lead: 2, female_lead: 2, supporting: 6 },
                locationNeeds: ["urban_street", "speakeasy", "tenement"],
                historicalNotes: "Pre-Code gangster films glorified criminals before Hays Code enforcement"
            },
            {
                title: "Little Caesar's Empire",
                genre: "gangster",
                year: 1933,
                budget: 75000,
                quality: 78,
                description: "An ambitious small-time hood rises to become the city's most powerful crime lord, but power corrupts absolutely.",
                censorRisk: 88,
                shootingDays: 16,
                themes: ["ambition", "violence", "downfall"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["nightclub", "police_station", "penthouse"],
                historicalNotes: "Based on Al Capone's rise, these films would be banned after 1934"
            },
            {
                title: "Scarface Nation",
                genre: "gangster",
                year: 1933,
                budget: 95000,
                quality: 85,
                description: "A ruthless immigrant builds a bootlegging empire through violence and cunning in this brutal crime saga.",
                censorRisk: 92,
                shootingDays: 20,
                themes: ["immigration", "violence", "ambition"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["speakeasy", "warehouse", "mansion"],
                historicalNotes: "Extremely violent for its time, heavily censored in many states"
            },

            // DRAMA - PRE-CODE
            {
                title: "Scarlet Nights",
                genre: "drama",
                year: 1933,
                budget: 75000,
                quality: 72,
                description: "A provocative story of a woman's rise from poverty to society through questionable means.",
                censorRisk: 90,
                shootingDays: 18,
                themes: ["sexuality", "class", "morality"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 },
                locationNeeds: ["mansion", "nightclub", "tenement"],
                historicalNotes: "This type of 'fallen woman' narrative would be banned under the Hays Code"
            },
            {
                title: "Baby Face",
                genre: "drama",
                year: 1933,
                budget: 70000,
                quality: 76,
                description: "A young woman uses her beauty and sexuality to sleep her way to the top of corporate America.",
                censorRisk: 95,
                shootingDays: 17,
                themes: ["sexuality", "ambition", "exploitation"],
                castRequirements: { male_lead: 4, female_lead: 1, supporting: 6 },
                locationNeeds: ["office_building", "apartment", "bar"],
                historicalNotes: "One of the most notorious Pre-Code films, heavily censored after 1934"
            },
            {
                title: "Red-Headed Woman",
                genre: "drama",
                year: 1933,
                budget: 68000,
                quality: 70,
                description: "A scheming secretary breaks up marriages and destroys families to achieve wealth and status.",
                censorRisk: 87,
                shootingDays: 16,
                themes: ["adultery", "ambition", "immorality"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 5 },
                locationNeeds: ["mansion", "office", "country_club"],
                historicalNotes: "Amoral heroines were common in Pre-Code but disappeared after censorship"
            },
            {
                title: "The Divorcee",
                genre: "drama",
                year: 1933,
                budget: 72000,
                quality: 74,
                description: "A sophisticated woman responds to her husband's infidelity by taking lovers of her own.",
                censorRisk: 85,
                shootingDays: 18,
                themes: ["marriage", "equality", "sexuality"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 4 },
                locationNeeds: ["penthouse", "nightclub", "beach_house"],
                historicalNotes: "Pre-Code treatment of female sexuality and double standards"
            },

            // MUSICAL - PRE-CODE
            {
                title: "Gold Diggers of Broadway",
                genre: "musical",
                year: 1933,
                budget: 125000,
                quality: 80,
                description: "Chorus girls scheme to marry wealthy men during the Depression in this lavish backstage musical.",
                censorRisk: 60,
                shootingDays: 25,
                themes: ["depression", "survival", "romance"],
                castRequirements: { male_lead: 3, female_lead: 4, dancers: 12 },
                locationNeeds: ["theater", "luxury_hotel", "rehearsal_hall"],
                historicalNotes: "Early musical revues often featured elaborate production numbers"
            },
            {
                title: "42nd Street Dreams",
                genre: "musical",
                year: 1933,
                budget: 135000,
                quality: 83,
                description: "A young chorus girl gets her big break when the star breaks her ankle on opening night.",
                censorRisk: 45,
                shootingDays: 28,
                themes: ["showbusiness", "ambition", "depression"],
                castRequirements: { male_lead: 2, female_lead: 3, dancers: 20 },
                locationNeeds: ["broadway_theater", "rehearsal_hall", "dressing_room"],
                historicalNotes: "Busby Berkeley's elaborate choreography defined the era"
            },
            {
                title: "Footlight Parade",
                genre: "musical",
                year: 1933,
                budget: 140000,
                quality: 81,
                description: "A Broadway director fights to save his theater by creating spectacular musical prologues for movie houses.",
                censorRisk: 50,
                shootingDays: 30,
                themes: ["showbusiness", "innovation", "survival"],
                castRequirements: { male_lead: 2, female_lead: 3, dancers: 25 },
                locationNeeds: ["theater", "swimming_pool", "backstage"],
                historicalNotes: "Famous for elaborate water ballet sequences"
            },

            // COMEDY - PRE-CODE
            {
                title: "She Done Him Wrong",
                genre: "comedy",
                year: 1933,
                budget: 65000,
                quality: 75,
                description: "A saucy saloon singer in the Gay Nineties dispenses wisecracks and attracts men like flies.",
                censorRisk: 80,
                shootingDays: 15,
                themes: ["sexuality", "comedy", "innuendo"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 6 },
                locationNeeds: ["saloon", "apartment", "street"],
                historicalNotes: "Mae West's double entendres pushed Pre-Code boundaries"
            },
            {
                title: "Design for Living",
                genre: "comedy",
                year: 1933,
                budget: 78000,
                quality: 77,
                description: "A woman lives with two men in an unconventional ménage à trois arrangement.",
                censorRisk: 88,
                shootingDays: 19,
                themes: ["sexuality", "unconventional_relationships", "sophistication"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 },
                locationNeeds: ["paris_apartment", "artist_studio", "penthouse"],
                historicalNotes: "Ernst Lubitsch's sophisticated Pre-Code comedy about a threesome"
            },

            // WESTERN - PRE-CODE
            {
                title: "Law and Disorder",
                genre: "western",
                year: 1933,
                budget: 55000,
                quality: 65,
                description: "A morally ambiguous gunfighter brings his own brand of justice to a corrupt frontier town.",
                censorRisk: 55,
                shootingDays: 16,
                themes: ["violence", "vigilantism", "frontier"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["western_town", "saloon", "desert"],
                historicalNotes: "Pre-Code Westerns were more violent and morally ambiguous"
            },

            // HORROR - PRE-CODE
            {
                title: "The Island of Lost Souls",
                genre: "horror",
                year: 1933,
                budget: 45000,
                quality: 72,
                description: "A mad scientist creates human-animal hybrids on a remote tropical island.",
                censorRisk: 75,
                shootingDays: 18,
                themes: ["science", "horror", "ethics"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 10 },
                locationNeeds: ["jungle_lab", "island", "compound"],
                historicalNotes: "Disturbing imagery led to bans in many countries"
            },
            {
                title: "Freaks of Nature",
                genre: "horror",
                year: 1933,
                budget: 38000,
                quality: 68,
                description: "Circus sideshow performers exact terrible revenge on those who exploit them.",
                censorRisk: 95,
                shootingDays: 15,
                themes: ["exploitation", "revenge", "horror"],
                castRequirements: { male_lead: 2, female_lead: 2, supporting: 15 },
                locationNeeds: ["circus", "tent", "wagon"],
                historicalNotes: "Banned for 30 years due to disturbing content featuring real sideshow performers"
            },

            // ROMANCE - PRE-CODE
            {
                title: "Brief Encounter in Paris",
                genre: "romance",
                year: 1933,
                budget: 62000,
                quality: 70,
                description: "A married woman has a passionate affair with a dashing stranger during a weekend in Paris.",
                censorRisk: 82,
                shootingDays: 17,
                themes: ["adultery", "passion", "guilt"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 3 },
                locationNeeds: ["paris_hotel", "cafe", "train_station"],
                historicalNotes: "Pre-Code films treated adultery with sophistication rather than condemnation"
            },

            // MYSTERY - PRE-CODE
            {
                title: "The Thin Man",
                genre: "mystery",
                year: 1934,
                budget: 85000,
                quality: 84,
                description: "A sophisticated detective and his glamorous wife solve murders while trading witty banter and cocktails.",
                censorRisk: 45,
                shootingDays: 20,
                themes: ["mystery", "sophistication", "marriage"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["penthouse", "nightclub", "mansion"],
                historicalNotes: "Sophisticated treatment of marriage and drinking before Hays Code crackdown"
            },

            // ADVENTURE - PRE-CODE
            {
                title: "King Kong's Wrath",
                genre: "adventure",
                year: 1933,
                budget: 160000,
                quality: 88,
                description: "Explorers capture a giant ape on a mysterious island and bring it to New York with catastrophic results.",
                censorRisk: 60,
                shootingDays: 35,
                themes: ["adventure", "spectacle", "nature"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 12 },
                locationNeeds: ["jungle", "ship", "new_york"],
                specialRequirements: ["special_effects", "stop_motion"],
                historicalNotes: "Revolutionary special effects work, enormous budget for the era"
            },

            // BIOGRAPHY - PRE-CODE
            {
                title: "The Private Life of Henry VIII",
                genre: "biography",
                year: 1933,
                budget: 95000,
                quality: 79,
                description: "The tumultuous reign and six marriages of England's most notorious king.",
                censorRisk: 70,
                shootingDays: 24,
                themes: ["history", "power", "marriage"],
                castRequirements: { male_lead: 1, female_lead: 6, supporting: 10 },
                locationNeeds: ["palace", "throne_room", "bedroom"],
                historicalNotes: "Frank treatment of Henry's marital and sexual exploits"
            }
        ],

        // GOLDEN AGE (1935-1941) - Studio system peak, Hays Code in effect
        goldenAge: [
            // WESTERN
            {
                title: "Stagecoach to Destiny",
                genre: "western",
                year: 1939,
                budget: 120000,
                quality: 87,
                description: "A diverse group of travelers face Apache attacks and personal conflicts on a dangerous stagecoach journey.",
                censorRisk: 20,
                shootingDays: 25,
                themes: ["journey", "redemption", "frontier"],
                castRequirements: { male_lead: 3, female_lead: 2, supporting: 6 },
                locationNeeds: ["desert", "stagecoach", "western_town"],
                historicalNotes: "John Ford elevated the Western to prestige cinema"
            },
            {
                title: "Dodge City Law",
                genre: "western",
                year: 1939,
                budget: 95000,
                quality: 75,
                description: "A trail boss becomes sheriff and cleans up the wildest town in the West.",
                censorRisk: 18,
                shootingDays: 22,
                themes: ["law", "civilization", "courage"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["western_town", "saloon", "main_street"],
                historicalNotes: "Technicolor spectacle made Westerns more prestigious"
            },
            {
                title: "Destry Rides Again",
                genre: "western",
                year: 1939,
                budget: 88000,
                quality: 78,
                description: "A mild-mannered deputy sheriff uses his wits instead of his guns to tame a lawless town.",
                censorRisk: 25,
                shootingDays: 21,
                themes: ["nonviolence", "wit", "justice"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["saloon", "western_town", "sheriff_office"],
                historicalNotes: "Marlene Dietrich's iconic saloon singer role"
            },
            {
                title: "The Westerner",
                genre: "western",
                year: 1940,
                budget: 105000,
                quality: 80,
                description: "A wandering cowboy gets caught between cattlemen and homesteaders in a range war.",
                censorRisk: 22,
                shootingDays: 24,
                themes: ["conflict", "honor", "frontier"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["ranch", "courthouse", "plains"],
                historicalNotes: "Walter Brennan won Oscar for Judge Roy Bean portrayal"
            },
            {
                title: "Jesse James Rides",
                genre: "western",
                year: 1939,
                budget: 110000,
                quality: 76,
                description: "The legendary outlaw becomes a folk hero after railroad corruption destroys his family.",
                censorRisk: 35,
                shootingDays: 26,
                themes: ["outlaws", "revenge", "folk_hero"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 10 },
                locationNeeds: ["farm", "railroad", "hideout"],
                historicalNotes: "Sympathetic outlaw portrayal tested Hays Code limits"
            },
            {
                title: "Union Pacific",
                genre: "western",
                year: 1939,
                budget: 145000,
                quality: 79,
                description: "The epic story of building the transcontinental railroad across dangerous frontier territory.",
                censorRisk: 20,
                shootingDays: 32,
                themes: ["progress", "industry", "frontier"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 15 },
                locationNeeds: ["railroad", "construction_camp", "plains"],
                specialRequirements: ["trains", "large_scale_construction"],
                historicalNotes: "Cecil B. DeMille's epic Western spectacle"
            },
            {
                title: "Western Justice",
                genre: "western",
                year: 1936,
                budget: 95000,
                quality: 75,
                description: "A noble sheriff brings law and order to a corrupt frontier town.",
                censorRisk: 20,
                shootingDays: 20,
                themes: ["justice", "frontier", "good_vs_evil"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["western_town", "saloon", "desert"],
                historicalNotes: "Westerns became the quintessential American genre during this period"
            },
            {
                title: "The Plainsman",
                genre: "western",
                year: 1937,
                budget: 115000,
                quality: 77,
                description: "Wild Bill Hickok and Calamity Jane fight to bring civilization to the frontier.",
                censorRisk: 25,
                shootingDays: 28,
                themes: ["frontier", "romance", "civilization"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["fort", "plains", "frontier_town"],
                historicalNotes: "DeMille's romantic vision of Western expansion"
            },

            // SCREWBALL COMEDY
            {
                title: "It Happened One Night",
                genre: "comedy",
                year: 1935,
                budget: 95000,
                quality: 91,
                description: "A runaway heiress and a cynical reporter fall in love during a madcap cross-country bus trip.",
                censorRisk: 15,
                shootingDays: 22,
                themes: ["class", "romance", "adventure"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["bus", "motel", "highway"],
                historicalNotes: "First film to win all five major Oscars, defined screwball comedy"
            },
            {
                title: "My Man Godfrey",
                genre: "comedy",
                year: 1936,
                budget: 105000,
                quality: 85,
                description: "A zany socialite hires a forgotten man from the city dump as the family butler.",
                censorRisk: 12,
                shootingDays: 24,
                themes: ["depression", "class", "redemption"],
                castRequirements: { male_lead: 1, female_lead: 2, supporting: 8 },
                locationNeeds: ["mansion", "dump", "nightclub"],
                historicalNotes: "Sophisticated Depression-era class commentary disguised as comedy"
            },
            {
                title: "Bringing Up Baby",
                genre: "comedy",
                year: 1938,
                budget: 115000,
                quality: 88,
                description: "A scatterbrained heiress and her pet leopard turn a paleontologist's life upside down.",
                censorRisk: 10,
                shootingDays: 26,
                themes: ["chaos", "romance", "eccentricity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["museum", "connecticut_estate", "jail"],
                specialRequirements: ["animal_handlers", "leopard"],
                historicalNotes: "Hawks' masterpiece of controlled chaos and rapid-fire dialogue"
            },
            {
                title: "The Awful Truth",
                genre: "comedy",
                year: 1937,
                budget: 98000,
                quality: 84,
                description: "A divorcing couple engage in escalating sabotage of each other's new romances.",
                censorRisk: 18,
                shootingDays: 23,
                themes: ["marriage", "jealousy", "romance"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["apartment", "nightclub", "country_house"],
                historicalNotes: "Sophisticated treatment of divorce within Hays Code limits"
            },
            {
                title: "His Girl Friday",
                genre: "comedy",
                year: 1940,
                budget: 110000,
                quality: 89,
                description: "A newspaper editor tries to prevent his ex-wife and star reporter from remarrying and quitting the paper.",
                censorRisk: 20,
                shootingDays: 25,
                themes: ["journalism", "romance", "career"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 10 },
                locationNeeds: ["newspaper_office", "pressroom", "jail"],
                historicalNotes: "Fastest dialogue ever filmed, 240 words per minute"
            },
            {
                title: "Screwball Society",
                genre: "comedy",
                year: 1937,
                budget: 110000,
                quality: 85,
                description: "A wealthy heiress and a common reporter engage in witty romantic warfare.",
                censorRisk: 15,
                shootingDays: 22,
                themes: ["class_differences", "romance", "wit"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["mansion", "newspaper_office", "yacht"],
                historicalNotes: "Screwball comedies defined sophisticated entertainment in the late 1930s"
            },
            {
                title: "The Lady Eve",
                genre: "comedy",
                year: 1941,
                budget: 102000,
                quality: 86,
                description: "A con artist sets out to seduce a wealthy ale heir aboard an ocean liner.",
                censorRisk: 25,
                shootingDays: 24,
                themes: ["deception", "romance", "revenge"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["ocean_liner", "mansion", "dining_room"],
                historicalNotes: "Preston Sturges' sophisticated comedy about sexual politics"
            },
            {
                title: "The Philadelphia Story",
                genre: "comedy",
                year: 1940,
                budget: 125000,
                quality: 90,
                description: "A socialite's wedding weekend is complicated by her ex-husband and a tabloid reporter.",
                censorRisk: 22,
                shootingDays: 28,
                themes: ["class", "romance", "second_chances"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 8 },
                locationNeeds: ["estate", "library", "garden"],
                historicalNotes: "Katharine Hepburn's comeback vehicle, sophisticated romantic triangle"
            },

            // MUSICAL
            {
                title: "Top Hat Dreams",
                genre: "musical",
                year: 1935,
                budget: 130000,
                quality: 86,
                description: "An American dancer in London pursues a woman who keeps mistaking him for her friend's husband.",
                censorRisk: 8,
                shootingDays: 30,
                themes: ["mistaken_identity", "romance", "dance"],
                castRequirements: { male_lead: 1, female_lead: 1, dancers: 10 },
                locationNeeds: ["hotel", "ballroom", "venice"],
                historicalNotes: "Astaire-Rogers at their peak, iconic Art Deco sets"
            },
            {
                title: "Swing Time",
                genre: "musical",
                year: 1936,
                budget: 125000,
                quality: 87,
                description: "A gambler-dancer must earn $25,000 to win permission to marry, but falls for his dance instructor instead.",
                censorRisk: 10,
                shootingDays: 32,
                themes: ["dance", "romance", "class"],
                castRequirements: { male_lead: 1, female_lead: 1, dancers: 8 },
                locationNeeds: ["dance_studio", "nightclub", "apartment"],
                historicalNotes: "Features 'The Way You Look Tonight' and classic Astaire choreography"
            },
            {
                title: "Shall We Dance",
                genre: "musical",
                year: 1937,
                budget: 135000,
                quality: 82,
                description: "A ballet dancer and a tap dancer fall in love despite pretending not to be married.",
                censorRisk: 12,
                shootingDays: 34,
                themes: ["dance", "fame", "romance"],
                castRequirements: { male_lead: 1, female_lead: 1, dancers: 15 },
                locationNeeds: ["ocean_liner", "theater", "rooftop"],
                historicalNotes: "Gershwin score, blend of ballet and tap dancing"
            },
            {
                title: "The Wizard of Oz",
                genre: "musical",
                year: 1939,
                budget: 275000,
                quality: 93,
                description: "A Kansas farm girl is transported to a magical land where she must find her way home.",
                censorRisk: 5,
                shootingDays: 40,
                themes: ["fantasy", "home", "adventure"],
                castRequirements: { male_lead: 3, female_lead: 2, supporting: 12 },
                locationNeeds: ["kansas_farm", "yellow_brick_road", "emerald_city"],
                specialRequirements: ["technicolor", "special_effects", "elaborate_sets"],
                historicalNotes: "Revolutionary use of Technicolor, became cultural phenomenon"
            },
            {
                title: "Babes in Arms",
                genre: "musical",
                year: 1939,
                budget: 115000,
                quality: 78,
                description: "The children of vaudeville performers put on a show to prove they have talent.",
                censorRisk: 8,
                shootingDays: 26,
                themes: ["youth", "showbusiness", "perseverance"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 20 },
                locationNeeds: ["theater", "barn", "small_town"],
                historicalNotes: "Mickey Rooney and Judy Garland's first pairing"
            },
            {
                title: "Broadway Melody of 1940",
                genre: "musical",
                year: 1940,
                budget: 142000,
                quality: 81,
                description: "Two dance partners compete for the same girl and the same big break on Broadway.",
                censorRisk: 10,
                shootingDays: 35,
                themes: ["competition", "friendship", "showbusiness"],
                castRequirements: { male_lead: 2, female_lead: 1, dancers: 20 },
                locationNeeds: ["broadway_theater", "nightclub", "dance_studio"],
                historicalNotes: "Astaire and Eleanor Powell's only pairing, spectacular tap numbers"
            },
            {
                title: "Technicolor Dreams",
                genre: "musical",
                year: 1938,
                budget: 200000,
                quality: 88,
                description: "A Broadway producer stages the most spectacular musical revue ever conceived.",
                censorRisk: 10,
                shootingDays: 35,
                themes: ["ambition", "showbusiness", "spectacle"],
                castRequirements: { male_lead: 2, female_lead: 2, dancers: 20 },
                locationNeeds: ["theater", "rehearsal_hall", "backstage"],
                specialRequirements: ["technicolor", "elaborate_sets"],
                historicalNotes: "Color films were rare and expensive but drew huge audiences"
            },
            {
                title: "Meet Me in St. Louis",
                genre: "musical",
                year: 1944,
                budget: 165000,
                quality: 85,
                description: "A turn-of-the-century family prepares for the 1904 World's Fair while facing a move to New York.",
                censorRisk: 5,
                shootingDays: 32,
                themes: ["family", "nostalgia", "home"],
                castRequirements: { male_lead: 2, female_lead: 3, children: 2, supporting: 8 },
                locationNeeds: ["victorian_house", "streetcar", "fairgrounds"],
                specialRequirements: ["technicolor", "period_sets"],
                historicalNotes: "Judy Garland's most iconic non-Oz role, introduces 'Have Yourself a Merry Little Christmas'"
            },

            // DRAMA
            {
                title: "The Grapes of Wrath",
                genre: "drama",
                year: 1940,
                budget: 180000,
                quality: 92,
                description: "A migrant family flees the Oklahoma Dust Bowl seeking a better life in California.",
                censorRisk: 45,
                shootingDays: 32,
                themes: ["depression", "migration", "injustice"],
                castRequirements: { male_lead: 2, female_lead: 1, children: 2, supporting: 12 },
                locationNeeds: ["farm", "highway", "migrant_camp"],
                historicalNotes: "Steinbeck adaptation, powerful social commentary on Depression"
            },
            {
                title: "Citizen Kane",
                genre: "drama",
                year: 1941,
                budget: 150000,
                quality: 95,
                description: "A reporter investigates the dying words of a powerful newspaper magnate, uncovering his mysterious past.",
                censorRisk: 35,
                shootingDays: 34,
                themes: ["power", "corruption", "loss"],
                castRequirements: { male_lead: 1, female_lead: 2, supporting: 15 },
                locationNeeds: ["mansion", "newspaper_office", "opera_house"],
                specialRequirements: ["innovative_cinematography", "elaborate_makeup"],
                historicalNotes: "Revolutionary filmmaking techniques, Hearst tried to suppress it"
            },
            {
                title: "How Green Was My Valley",
                genre: "drama",
                year: 1941,
                budget: 175000,
                quality: 88,
                description: "A Welsh mining family struggles with poverty, union strife, and changing times.",
                censorRisk: 25,
                shootingDays: 36,
                themes: ["family", "labor", "nostalgia"],
                castRequirements: { male_lead: 3, female_lead: 2, children: 3, supporting: 15 },
                locationNeeds: ["mining_village", "coal_mine", "church"],
                historicalNotes: "Beat Citizen Kane for Best Picture, John Ford's family saga"
            },
            {
                title: "Rebecca",
                genre: "drama",
                year: 1940,
                budget: 165000,
                quality: 89,
                description: "A young bride is haunted by the shadow of her husband's dead first wife.",
                censorRisk: 30,
                shootingDays: 30,
                themes: ["mystery", "psychology", "obsession"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["mansion", "cliffside", "bedroom"],
                historicalNotes: "Hitchcock's first American film, won Best Picture"
            },
            {
                title: "Wuthering Heights",
                genre: "drama",
                year: 1939,
                budget: 155000,
                quality: 85,
                description: "A passionate but doomed love affair on the Yorkshire moors spans generations.",
                censorRisk: 28,
                shootingDays: 28,
                themes: ["passion", "revenge", "class"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["manor_house", "moors", "farmhouse"],
                historicalNotes: "Gothic romance, Laurence Olivier's Hollywood debut"
            },
            {
                title: "Mr. Smith Goes to Washington",
                genre: "drama",
                year: 1939,
                budget: 145000,
                quality: 90,
                description: "An idealistic young senator fights corruption in the nation's capital.",
                censorRisk: 40,
                shootingDays: 30,
                themes: ["politics", "corruption", "idealism"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 15 },
                locationNeeds: ["senate_chamber", "washington_dc", "office"],
                historicalNotes: "Capra's ode to American democracy, controversial in Washington"
            },
            {
                title: "The Grapes of Hope",
                genre: "drama",
                year: 1939,
                budget: 150000,
                quality: 92,
                description: "A migrant family struggles to survive during the Great Depression.",
                censorRisk: 35,
                shootingDays: 28,
                themes: ["depression", "family", "resilience"],
                castRequirements: { male_lead: 1, female_lead: 1, children: 3, supporting: 8 },
                locationNeeds: ["farm", "migrant_camp", "highway"],
                historicalNotes: "Social realist dramas addressed Depression hardships"
            },
            {
                title: "Of Mice and Men",
                genre: "drama",
                year: 1939,
                budget: 135000,
                quality: 83,
                description: "Two migrant workers dream of owning their own land during the Depression.",
                censorRisk: 38,
                shootingDays: 26,
                themes: ["friendship", "dreams", "tragedy"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["ranch", "bunkhouse", "river"],
                historicalNotes: "Steinbeck's tragic tale of friendship and shattered dreams"
            },
            {
                title: "All This and Heaven Too",
                genre: "drama",
                year: 1940,
                budget: 158000,
                quality: 79,
                description: "A governess becomes involved in a scandalous love triangle in 19th century France.",
                censorRisk: 42,
                shootingDays: 30,
                themes: ["scandal", "class", "tragedy"],
                castRequirements: { male_lead: 1, female_lead: 1, children: 4, supporting: 10 },
                locationNeeds: ["french_estate", "courtroom", "school"],
                historicalNotes: "Lavish period drama based on true crime scandal"
            },
            {
                title: "Dark Victory",
                genre: "drama",
                year: 1939,
                budget: 125000,
                quality: 81,
                description: "A socialite facing terminal illness finds love and meaning in her final months.",
                censorRisk: 25,
                shootingDays: 24,
                themes: ["death", "love", "redemption"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["mansion", "hospital", "countryside"],
                historicalNotes: "Bette Davis' iconic tearjerker performance"
            },
            {
                title: "Jezebel",
                genre: "drama",
                year: 1938,
                budget: 140000,
                quality: 84,
                description: "A headstrong Southern belle's pride costs her the man she loves before the Civil War.",
                censorRisk: 32,
                shootingDays: 28,
                themes: ["pride", "redemption", "south"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 12 },
                locationNeeds: ["plantation", "ballroom", "new_orleans"],
                historicalNotes: "Consolation prize for Davis losing Gone with the Wind role"
            },

            // ROMANCE
            {
                title: "Love Affair",
                genre: "romance",
                year: 1939,
                budget: 95000,
                quality: 82,
                description: "Two people engaged to others fall in love aboard a ship and agree to meet atop the Empire State Building.",
                censorRisk: 28,
                shootingDays: 24,
                themes: ["fate", "sacrifice", "love"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["ocean_liner", "empire_state", "chapel"],
                historicalNotes: "Later remade as An Affair to Remember"
            },
            {
                title: "Camille",
                genre: "romance",
                year: 1936,
                budget: 118000,
                quality: 86,
                description: "A Parisian courtesan sacrifices her one true love to save his reputation.",
                censorRisk: 48,
                shootingDays: 26,
                themes: ["sacrifice", "tragedy", "love"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["paris_apartment", "opera", "countryside"],
                historicalNotes: "Garbo's greatest tragic romance within Hays Code limits"
            },
            {
                title: "Waterloo Bridge",
                genre: "romance",
                year: 1940,
                budget: 112000,
                quality: 80,
                description: "A ballerina and an officer fall in love during WWI London, but fate tears them apart.",
                censorRisk: 35,
                shootingDays: 25,
                themes: ["war", "tragedy", "love"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["bridge", "theater", "manor"],
                historicalNotes: "Vivien Leigh's follow-up to Gone with the Wind"
            },
            {
                title: "Intermezzo",
                genre: "romance",
                year: 1939,
                budget: 105000,
                quality: 77,
                description: "A married violinist has an affair with his daughter's piano teacher.",
                censorRisk: 52,
                shootingDays: 23,
                themes: ["adultery", "music", "guilt"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["concert_hall", "villa", "apartment"],
                historicalNotes: "Ingrid Bergman's Hollywood debut, adultery carefully handled"
            },
            {
                title: "The Shop Around the Corner",
                genre: "romance",
                year: 1940,
                budget: 98000,
                quality: 85,
                description: "Two feuding shop clerks don't realize they're anonymous pen pals falling in love.",
                censorRisk: 8,
                shootingDays: 22,
                themes: ["mistaken_identity", "romance", "Budapest"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["shop", "cafe", "street"],
                historicalNotes: "Lubitsch's charming romance, later remade as You've Got Mail"
            },
            {
                title: "Ninotchka",
                genre: "romance",
                year: 1939,
                budget: 122000,
                quality: 87,
                description: "A stern Soviet envoy sent to Paris is seduced by capitalism and a charming count.",
                censorRisk: 30,
                shootingDays: 27,
                themes: ["politics", "romance", "transformation"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["paris_hotel", "cafe", "nightclub"],
                historicalNotes: "Garbo laughs! Sophisticated Cold War era romance"
            },

            // ADVENTURE
            {
                title: "The Adventures of Robin Hood",
                genre: "adventure",
                year: 1938,
                budget: 185000,
                quality: 88,
                description: "The legendary outlaw fights tyranny and wins the heart of Maid Marian in Sherwood Forest.",
                censorRisk: 15,
                shootingDays: 35,
                themes: ["heroism", "justice", "romance"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 12 },
                locationNeeds: ["forest", "castle", "tournament"],
                specialRequirements: ["technicolor", "swordplay", "archery"],
                historicalNotes: "Errol Flynn's most iconic role, lavish Technicolor production"
            },
            {
                title: "Gunga Din",
                genre: "adventure",
                year: 1939,
                budget: 175000,
                quality: 81,
                description: "Three British sergeants and their water bearer face a murderous cult in colonial India.",
                censorRisk: 35,
                shootingDays: 34,
                themes: ["colonialism", "heroism", "brotherhood"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 15 },
                locationNeeds: ["india", "temple", "barracks"],
                historicalNotes: "Kipling adaptation, problematic colonial attitudes"
            },
            {
                title: "The Mark of Zorro",
                genre: "adventure",
                year: 1940,
                budget: 145000,
                quality: 84,
                description: "A foppish nobleman secretly fights tyranny as the masked swordsman Zorro.",
                censorRisk: 18,
                shootingDays: 28,
                themes: ["heroism", "dual_identity", "justice"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["hacienda", "mission", "pueblo"],
                specialRequirements: ["swordplay", "horsemanship"],
                historicalNotes: "Tyrone Power's swashbuckling masterpiece"
            },
            {
                title: "Adventure in the Amazon",
                genre: "adventure",
                year: 1940,
                budget: 130000,
                quality: 70,
                description: "Explorers search for a lost city deep in the dangerous Amazon jungle.",
                censorRisk: 25,
                shootingDays: 30,
                themes: ["exploration", "danger", "discovery"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 },
                locationNeeds: ["jungle", "river", "native_village"],
                specialRequirements: ["animal_handlers", "stunt_coordinators"],
                historicalNotes: "Exotic adventure films were popular escapist entertainment"
            },

            // HORROR
            {
                title: "Dracula's Legacy",
                genre: "horror",
                year: 1935,
                budget: 52000,
                quality: 75,
                description: "The immortal vampire count preys on London society while pursued by Van Helsing.",
                censorRisk: 45,
                shootingDays: 18,
                themes: ["supernatural", "evil", "victorian"],
                castRequirements: { male_lead: 2, female_lead: 2, supporting: 6 },
                locationNeeds: ["castle", "london", "cemetery"],
                historicalNotes: "Universal horror classic, Bela Lugosi iconic"
            },
            {
                title: "Frankenstein's Monster",
                genre: "horror",
                year: 1935,
                budget: 48000,
                quality: 78,
                description: "A scientist creates life from dead tissue, unleashing a tragic monster upon the world.",
                censorRisk: 50,
                shootingDays: 19,
                themes: ["science", "hubris", "tragedy"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["laboratory", "castle", "village"],
                specialRequirements: ["makeup", "special_effects"],
                historicalNotes: "Boris Karloff's iconic makeup took hours to apply"
            },
            {
                title: "The Mummy Awakens",
                genre: "horror",
                year: 1936,
                budget: 55000,
                quality: 72,
                description: "An ancient Egyptian priest is resurrected and searches for his lost love across millennia.",
                censorRisk: 42,
                shootingDays: 20,
                themes: ["ancient_egypt", "reincarnation", "curse"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["museum", "tomb", "cairo"],
                historicalNotes: "Karloff again, playing on Egypt mania"
            },
            {
                title: "Cat People",
                genre: "horror",
                year: 1942,
                budget: 62000,
                quality: 80,
                description: "A young woman fears she will transform into a deadly panther if sexually aroused.",
                censorRisk: 55,
                shootingDays: 16,
                themes: ["sexuality", "transformation", "fear"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 },
                locationNeeds: ["apartment", "zoo", "pool"],
                historicalNotes: "Val Lewton's psychological horror, atmospheric rather than explicit"
            },

            // NOIR (Early examples in Golden Age period)
            {
                title: "The Maltese Falcon",
                genre: "noir",
                year: 1941,
                budget: 115000,
                quality: 90,
                description: "A cynical private detective gets caught in a web of murder and intrigue over a priceless statuette.",
                censorRisk: 40,
                shootingDays: 24,
                themes: ["greed", "betrayal", "cynicism"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["detective_office", "apartment", "hotel"],
                historicalNotes: "Defined film noir style, Bogart's breakthrough role"
            },
            {
                title: "Stranger on the Third Floor",
                genre: "noir",
                year: 1940,
                budget: 72000,
                quality: 74,
                description: "A reporter who testified against a murder suspect begins to doubt his own testimony.",
                censorRisk: 35,
                shootingDays: 18,
                themes: ["guilt", "paranoia", "justice"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["courtroom", "apartment", "dark_street"],
                historicalNotes: "Early noir with expressionist nightmare sequences"
            },

            // MYSTERY/THRILLER
            {
                title: "Suspicion",
                genre: "mystery",
                year: 1941,
                budget: 98000,
                quality: 82,
                description: "A woman begins to suspect her charming husband is trying to murder her.",
                censorRisk: 32,
                shootingDays: 22,
                themes: ["paranoia", "marriage", "suspense"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["country_house", "cliffside", "village"],
                historicalNotes: "Hitchcock's psychological thriller, Joan Fontaine won Oscar"
            },
            {
                title: "Shadow of a Doubt",
                genre: "mystery",
                year: 1943,
                budget: 105000,
                quality: 85,
                description: "A young woman realizes her beloved uncle may be a serial killer.",
                censorRisk: 45,
                shootingDays: 25,
                themes: ["evil", "family", "innocence"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["small_town", "house", "library"],
                historicalNotes: "Hitchcock's personal favorite of his films"
            },

            // BIOGRAPHY
            {
                title: "The Life of Emile Zola",
                genre: "biography",
                year: 1937,
                budget: 145000,
                quality: 86,
                description: "The French writer risks everything to expose the Dreyfus Affair conspiracy.",
                censorRisk: 28,
                shootingDays: 32,
                themes: ["justice", "courage", "anti-semitism"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 15 },
                locationNeeds: ["courtroom", "paris", "prison"],
                historicalNotes: "Won Best Picture, rare Hollywood treatment of anti-Semitism"
            },
            {
                title: "Yankee Doodle Dandy",
                genre: "biography",
                year: 1942,
                budget: 155000,
                quality: 84,
                description: "The life story of legendary entertainer George M. Cohan from vaudeville to Broadway.",
                censorRisk: 5,
                shootingDays: 30,
                themes: ["showbusiness", "patriotism", "success"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 12 },
                locationNeeds: ["theater", "white_house", "stage"],
                historicalNotes: "Cagney won Oscar, perfect patriotic wartime entertainment"
            }
        ],

        // WAR YEARS (1941-1945) - Propaganda, patriotism, wartime themes
        warYears: [
            // WAR FILMS
            {
                title: "Casablanca",
                genre: "war",
                year: 1942,
                budget: 135000,
                quality: 94,
                description: "In wartime Morocco, a cynical American nightclub owner must choose between love and the resistance.",
                censorRisk: 15,
                shootingDays: 28,
                themes: ["sacrifice", "resistance", "love"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 12 },
                locationNeeds: ["nightclub", "airport", "marketplace"],
                historicalNotes: "Perfect wartime romance, became instant classic"
            },
            {
                title: "Mrs. Miniver",
                genre: "war",
                year: 1942,
                budget: 148000,
                quality: 88,
                description: "An English family endures the Blitz and shows courage on the home front.",
                censorRisk: 8,
                shootingDays: 30,
                themes: ["homefront", "courage", "family"],
                castRequirements: { male_lead: 2, female_lead: 1, children: 2, supporting: 10 },
                locationNeeds: ["english_village", "house", "church"],
                governmentSupport: true,
                historicalNotes: "Churchill said it did more for the war effort than a fleet of destroyers"
            },
            {
                title: "Wake Island",
                genre: "war",
                year: 1942,
                budget: 168000,
                quality: 79,
                description: "Marines make a heroic last stand against overwhelming Japanese forces.",
                censorRisk: 10,
                shootingDays: 32,
                themes: ["sacrifice", "heroism", "patriotism"],
                castRequirements: { male_lead: 3, female_lead: 0, supporting: 15 },
                locationNeeds: ["pacific_island", "bunker", "beach"],
                specialRequirements: ["military_cooperation", "combat_scenes"],
                governmentSupport: true,
                historicalNotes: "Released six months after actual battle, boosted morale"
            },
            {
                title: "Wings Over the Pacific",
                genre: "war",
                year: 1942,
                budget: 175000,
                quality: 82,
                description: "Navy pilots fight heroically in the Pacific Theater against overwhelming odds.",
                censorRisk: 5,
                shootingDays: 32,
                themes: ["patriotism", "sacrifice", "brotherhood"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 10 },
                locationNeeds: ["aircraft_carrier", "airfield", "pacific_island"],
                specialRequirements: ["aircraft", "military_cooperation"],
                governmentSupport: true,
                historicalNotes: "Government actively encouraged war films and provided military equipment"
            },
            {
                title: "Air Force",
                genre: "war",
                year: 1943,
                budget: 165000,
                quality: 80,
                description: "A B-17 bomber crew fights from Pearl Harbor to the Coral Sea.",
                censorRisk: 8,
                shootingDays: 34,
                themes: ["patriotism", "teamwork", "sacrifice"],
                castRequirements: { male_lead: 5, female_lead: 0, supporting: 8 },
                locationNeeds: ["bomber", "airfield", "pacific"],
                specialRequirements: ["aircraft", "aerial_combat"],
                governmentSupport: true,
                historicalNotes: "Hawks' tribute to bomber crews, documentary-like realism"
            },
            {
                title: "Destination Tokyo",
                genre: "war",
                year: 1943,
                budget: 158000,
                quality: 77,
                description: "A submarine crew undertakes a dangerous mission to Tokyo Bay.",
                censorRisk: 12,
                shootingDays: 30,
                themes: ["courage", "submarine", "mission"],
                castRequirements: { male_lead: 2, female_lead: 0, supporting: 12 },
                locationNeeds: ["submarine", "tokyo_bay", "base"],
                specialRequirements: ["submarine_sets", "underwater"],
                governmentSupport: true,
                historicalNotes: "Cary Grant in rare action role, claustrophobic tension"
            },
            {
                title: "Bataan",
                genre: "war",
                year: 1943,
                budget: 152000,
                quality: 81,
                description: "A ragtag patrol makes a desperate last stand in the Philippines.",
                censorRisk: 15,
                shootingDays: 28,
                themes: ["sacrifice", "diversity", "heroism"],
                castRequirements: { male_lead: 1, female_lead: 0, supporting: 13 },
                locationNeeds: ["jungle", "foxhole", "bridge"],
                governmentSupport: true,
                historicalNotes: "One of the first diverse military units on screen"
            },
            {
                title: "Guadalcanal Diary",
                genre: "war",
                year: 1943,
                budget: 172000,
                quality: 78,
                description: "Marines land on Guadalcanal in the first major Pacific offensive.",
                censorRisk: 18,
                shootingDays: 35,
                themes: ["combat", "marines", "victory"],
                castRequirements: { male_lead: 4, female_lead: 0, supporting: 15 },
                locationNeeds: ["beach", "jungle", "bunker"],
                specialRequirements: ["combat_scenes", "military_equipment"],
                governmentSupport: true,
                historicalNotes: "Based on real correspondent's account of the campaign"
            },
            {
                title: "Sahara",
                genre: "war",
                year: 1943,
                budget: 145000,
                quality: 82,
                description: "A tank crew and Allied stragglers make a stand at a desert well in North Africa.",
                censorRisk: 20,
                shootingDays: 26,
                themes: ["survival", "unity", "determination"],
                castRequirements: { male_lead: 1, female_lead: 0, supporting: 12 },
                locationNeeds: ["desert", "oasis", "tank"],
                historicalNotes: "Bogart leads international force, promotes Allied unity"
            },
            {
                title: "Thirty Seconds Over Tokyo",
                genre: "war",
                year: 1944,
                budget: 185000,
                quality: 83,
                description: "The Doolittle Raid brings the war to Japan's doorstep in a daring bombing mission.",
                censorRisk: 10,
                shootingDays: 36,
                themes: ["heroism", "innovation", "revenge"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 15 },
                locationNeeds: ["aircraft_carrier", "bomber", "china"],
                specialRequirements: ["aircraft", "special_effects"],
                governmentSupport: true,
                historicalNotes: "Based on real mission that boosted American morale after Pearl Harbor"
            },
            {
                title: "The Story of G.I. Joe",
                genre: "war",
                year: 1945,
                budget: 162000,
                quality: 86,
                description: "War correspondent Ernie Pyle follows infantrymen through the Italian campaign.",
                censorRisk: 25,
                shootingDays: 32,
                themes: ["infantry", "realism", "exhaustion"],
                castRequirements: { male_lead: 2, female_lead: 0, supporting: 20 },
                locationNeeds: ["italy", "trenches", "village"],
                historicalNotes: "Pyle killed before release, brutally realistic war portrayal"
            },

            // HOME FRONT
            {
                title: "Since You Went Away",
                genre: "drama",
                year: 1944,
                budget: 195000,
                quality: 85,
                description: "A mother and her daughters struggle to maintain the home front while father is at war.",
                censorRisk: 12,
                shootingDays: 35,
                themes: ["homefront", "family", "sacrifice"],
                castRequirements: { male_lead: 2, female_lead: 3, supporting: 12 },
                locationNeeds: ["house", "factory", "train_station"],
                governmentSupport: true,
                historicalNotes: "Epic home front drama, Selznick's paean to American families"
            },
            {
                title: "Rosie the Riveter",
                genre: "drama",
                year: 1943,
                budget: 90000,
                quality: 78,
                description: "Women take over factory jobs while their men fight overseas.",
                censorRisk: 10,
                shootingDays: 20,
                themes: ["women_workforce", "homefront", "independence"],
                castRequirements: { male_lead: 1, female_lead: 3, supporting: 8 },
                locationNeeds: ["factory", "neighborhood", "train_station"],
                governmentSupport: true,
                historicalNotes: "Films about women's wartime contributions were encouraged"
            },
            {
                title: "Tender Comrade",
                genre: "drama",
                year: 1943,
                budget: 88000,
                quality: 72,
                description: "Women war workers share a house while their husbands serve overseas.",
                censorRisk: 15,
                shootingDays: 22,
                themes: ["homefront", "female_solidarity", "sacrifice"],
                castRequirements: { male_lead: 1, female_lead: 4, supporting: 6 },
                locationNeeds: ["shared_house", "factory", "neighborhood"],
                governmentSupport: true,
                historicalNotes: "Later attacked during Red Scare for 'communist' themes"
            },

            // WARTIME ROMANCE
            {
                title: "Casablanca Nights",
                genre: "romance",
                year: 1943,
                budget: 105000,
                quality: 90,
                description: "Love and espionage intersect in wartime Morocco.",
                censorRisk: 20,
                shootingDays: 24,
                themes: ["love", "sacrifice", "resistance"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["nightclub", "airport", "hotel"],
                historicalNotes: "Wartime romances often featured exotic locations and moral complexity"
            },
            {
                title: "Random Harvest",
                genre: "romance",
                year: 1942,
                budget: 125000,
                quality: 83,
                description: "A shell-shocked WWI veteran falls in love twice with the same woman without remembering.",
                censorRisk: 18,
                shootingDays: 26,
                themes: ["amnesia", "love", "identity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["asylum", "cottage", "manor"],
                historicalNotes: "Popular escapist romance during wartime"
            },

            // WARTIME COMEDY
            {
                title: "Victory Garden",
                genre: "comedy",
                year: 1944,
                budget: 75000,
                quality: 65,
                description: "A bumbling civilian tries to help the war effort with disastrous comic results.",
                censorRisk: 5,
                shootingDays: 16,
                themes: ["homefront", "patriotism", "comedy"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["suburban_home", "factory", "garden"],
                governmentSupport: true,
                historicalNotes: "Light comedies helped maintain morale during wartime"
            },
            {
                title: "The More the Merrier",
                genre: "comedy",
                year: 1943,
                budget: 92000,
                quality: 81,
                description: "Housing shortage in wartime Washington forces three strangers to share an apartment.",
                censorRisk: 22,
                shootingDays: 24,
                themes: ["housing_shortage", "romance", "wartime"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["apartment", "washington_dc", "office"],
                historicalNotes: "Sophisticated comedy about wartime conditions"
            },

            // ANTI-NAZI
            {
                title: "To Be or Not to Be",
                genre: "comedy",
                year: 1942,
                budget: 108000,
                quality: 84,
                description: "Polish actors use their theatrical skills to fool the Nazis and escape occupied Warsaw.",
                censorRisk: 35,
                shootingDays: 26,
                themes: ["resistance", "satire", "theater"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 12 },
                locationNeeds: ["theater", "warsaw", "gestapo_hq"],
                historicalNotes: "Controversial for satirizing Nazis during war, now considered classic"
            },
            {
                title: "The Great Dictator",
                genre: "comedy",
                year: 1940,
                budget: 195000,
                quality: 89,
                description: "A Jewish barber is mistaken for a Hitler-like dictator in this bold satire.",
                censorRisk: 45,
                shootingDays: 35,
                themes: ["anti-fascism", "satire", "humanity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 15 },
                locationNeeds: ["ghetto", "palace", "streets"],
                historicalNotes: "Chaplin's first talkie, powerful anti-Nazi message before US entry"
            },
            {
                title: "Hangmen Also Die",
                genre: "noir",
                year: 1943,
                budget: 112000,
                quality: 79,
                description: "Czech resistance fighters assassinate a Nazi leader and face brutal reprisals.",
                censorRisk: 42,
                shootingDays: 28,
                themes: ["resistance", "nazi_occupation", "sacrifice"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 15 },
                locationNeeds: ["prague", "gestapo_hq", "hideout"],
                historicalNotes: "Fritz Lang's anti-Nazi thriller based on Heydrich assassination"
            }
        ],

        // POST-WAR (1946-1949) - Film noir, cynicism, changing world
        postWar: [
            // FILM NOIR
            {
                title: "The Best Years of Our Lives",
                genre: "drama",
                year: 1946,
                budget: 215000,
                quality: 93,
                description: "Three veterans return home and struggle to adjust to civilian life after WWII.",
                censorRisk: 28,
                shootingDays: 38,
                themes: ["veterans", "adjustment", "ptsd"],
                castRequirements: { male_lead: 3, female_lead: 3, supporting: 12 },
                locationNeeds: ["suburban_home", "bar", "bank"],
                historicalNotes: "Won Best Picture, captured national mood about returning veterans"
            },
            {
                title: "The Big Sleep",
                genre: "noir",
                year: 1946,
                budget: 125000,
                quality: 87,
                description: "A private detective gets caught in a web of blackmail, murder, and corruption in Los Angeles.",
                censorRisk: 48,
                shootingDays: 26,
                themes: ["corruption", "sexuality", "murder"],
                castRequirements: { male_lead: 1, female_lead: 2, supporting: 10 },
                locationNeeds: ["detective_office", "mansion", "nightclub"],
                historicalNotes: "Bogart and Bacall chemistry, deliberately confusing plot"
            },
            {
                title: "Double Indemnity",
                genre: "noir",
                year: 1944,
                budget: 118000,
                quality: 91,
                description: "An insurance salesman and a femme fatale plot to murder her husband for the insurance money.",
                censorRisk: 55,
                shootingDays: 24,
                themes: ["murder", "greed", "betrayal"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["house", "insurance_office", "market"],
                historicalNotes: "Defined noir style, shocking for showing murder plot in detail"
            },
            {
                title: "Out of the Past",
                genre: "noir",
                year: 1947,
                budget: 115000,
                quality: 88,
                description: "A private eye tries to escape his past but is drawn back into a web of crime and betrayal.",
                censorRisk: 50,
                shootingDays: 27,
                themes: ["fate", "betrayal", "past"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["small_town", "san_francisco", "acapulco"],
                historicalNotes: "Quintessential noir, fatalistic worldview"
            },
            {
                title: "The Postman Always Rings Twice",
                genre: "noir",
                year: 1946,
                budget: 108000,
                quality: 84,
                description: "A drifter and a married woman plot to murder her husband but guilt destroys them.",
                censorRisk: 58,
                shootingDays: 25,
                themes: ["adultery", "murder", "guilt"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 3 },
                locationNeeds: ["roadside_diner", "highway", "courthouse"],
                historicalNotes: "Steamy adaptation pushed Hays Code limits"
            },
            {
                title: "Mildred Pierce",
                genre: "noir",
                year: 1945,
                budget: 132000,
                quality: 86,
                description: "A woman builds a restaurant empire but her ungrateful daughter and weak men destroy her.",
                censorRisk: 45,
                shootingDays: 28,
                themes: ["ambition", "motherhood", "betrayal"],
                castRequirements: { male_lead: 2, female_lead: 2, supporting: 8 },
                locationNeeds: ["restaurant", "beach_house", "police_station"],
                historicalNotes: "Joan Crawford's comeback, strong female protagonist"
            },
            {
                title: "Gilda",
                genre: "noir",
                year: 1946,
                budget: 122000,
                quality: 82,
                description: "A gambler's life is complicated when his boss marries his ex-lover.",
                censorRisk: 52,
                shootingDays: 26,
                themes: ["obsession", "sexuality", "triangle"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["casino", "buenos_aires", "nightclub"],
                historicalNotes: "Rita Hayworth's most iconic role, sexually charged"
            },
            {
                title: "The Killers",
                genre: "noir",
                year: 1946,
                budget: 98000,
                quality: 83,
                description: "An insurance investigator unravels the mystery of why a man accepted his own murder.",
                censorRisk: 47,
                shootingDays: 24,
                themes: ["fate", "femme_fatale", "flashback"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["small_town", "boxing_ring", "hotel"],
                historicalNotes: "Burt Lancaster's debut, classic noir structure"
            },
            {
                title: "Nightmare Alley",
                genre: "noir",
                year: 1947,
                budget: 128000,
                quality: 85,
                description: "A carnival mentalist rises to fame but his ambition and alcoholism destroy him.",
                censorRisk: 60,
                shootingDays: 30,
                themes: ["ambition", "degradation", "alcoholism"],
                castRequirements: { male_lead: 1, female_lead: 2, supporting: 12 },
                locationNeeds: ["carnival", "nightclub", "flophouse"],
                historicalNotes: "Shockingly dark for its time, downbeat ending"
            },
            {
                title: "City of Shadows",
                genre: "noir",
                year: 1946,
                budget: 120000,
                quality: 85,
                description: "A war veteran returns home to find his city corrupted by crime and betrayal.",
                censorRisk: 45,
                shootingDays: 26,
                themes: ["corruption", "disillusionment", "urban_decay"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["dark_alley", "police_station", "nightclub"],
                specialRequirements: ["night_shooting", "atmospheric_lighting"],
                historicalNotes: "Film noir emerged from post-war disillusionment and anxiety"
            },
            {
                title: "The Lady from Shanghai",
                genre: "noir",
                year: 1947,
                budget: 135000,
                quality: 81,
                description: "An Irish sailor is seduced into a murder plot by a beautiful but deadly woman.",
                censorRisk: 53,
                shootingDays: 29,
                themes: ["betrayal", "obsession", "identity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["yacht", "chinatown", "funhouse"],
                specialRequirements: ["hall_of_mirrors"],
                historicalNotes: "Welles' surreal noir, famous mirror maze climax"
            },
            {
                title: "Kiss of Death",
                genre: "noir",
                year: 1947,
                budget: 105000,
                quality: 80,
                description: "A reformed criminal testifies against a psychopathic killer who seeks revenge.",
                censorRisk: 62,
                shootingDays: 25,
                themes: ["violence", "redemption", "vengeance"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["new_york_street", "courthouse", "apartment"],
                historicalNotes: "Richard Widmark's shocking debut as giggling psychopath"
            },
            {
                title: "Criss Cross",
                genre: "noir",
                year: 1949,
                budget: 112000,
                quality: 82,
                description: "An armored car guard plans a heist to win back his ex-wife from a gangster.",
                censorRisk: 51,
                shootingDays: 26,
                themes: ["obsession", "heist", "fate"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["nightclub", "warehouse", "hospital"],
                historicalNotes: "Lancaster and De Carlo, fatalistic heist noir"
            },

            // POST-WAR DRAMA
            {
                title: "Gentleman's Agreement",
                genre: "drama",
                year: 1947,
                budget: 165000,
                quality: 87,
                description: "A journalist poses as Jewish to expose anti-Semitism in polite society.",
                censorRisk: 38,
                shootingDays: 30,
                themes: ["anti-semitism", "prejudice", "journalism"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["magazine_office", "hotel", "connecticut"],
                historicalNotes: "Won Best Picture, bold treatment of American anti-Semitism"
            },
            {
                title: "Crossfire",
                genre: "drama",
                year: 1947,
                budget: 95000,
                quality: 81,
                description: "A detective investigates the murder of a Jewish man by anti-Semitic soldiers.",
                censorRisk: 42,
                shootingDays: 22,
                themes: ["anti-semitism", "murder", "prejudice"],
                castRequirements: { male_lead: 3, female_lead: 1, supporting: 8 },
                locationNeeds: ["apartment", "bar", "police_station"],
                historicalNotes: "Low budget noir tackling anti-Semitism, shot in 22 days"
            },
            {
                title: "The Snake Pit",
                genre: "drama",
                year: 1948,
                budget: 142000,
                quality: 84,
                description: "A woman struggles with mental illness in a nightmarish asylum.",
                censorRisk: 48,
                shootingDays: 28,
                themes: ["mental_illness", "institutions", "recovery"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 15 },
                locationNeeds: ["asylum", "ward", "therapy_room"],
                historicalNotes: "Shocking exposé of mental health treatment, led to reforms"
            },
            {
                title: "Sunset Boulevard",
                genre: "noir",
                year: 1950,
                budget: 175000,
                quality: 95,
                description: "A struggling screenwriter becomes entangled with a delusional silent film star.",
                censorRisk: 55,
                shootingDays: 32,
                themes: ["hollywood", "delusion", "exploitation"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["mansion", "studio", "swimming_pool"],
                historicalNotes: "Wilder's masterpiece about Hollywood's dark side"
            },
            {
                title: "All the King's Men",
                genre: "drama",
                year: 1949,
                budget: 158000,
                quality: 89,
                description: "A idealistic politician becomes corrupted by power in this Southern political drama.",
                censorRisk: 40,
                shootingDays: 32,
                themes: ["corruption", "power", "politics"],
                castRequirements: { male_lead: 1, female_lead: 2, supporting: 15 },
                locationNeeds: ["capitol", "mansion", "rural_south"],
                historicalNotes: "Won Best Picture, based on Huey Long"
            },
            {
                title: "The Treasure of the Sierra Madre",
                genre: "adventure",
                year: 1948,
                budget: 145000,
                quality: 92,
                description: "Gold fever and paranoia destroy three prospectors in the Mexican mountains.",
                censorRisk: 35,
                shootingDays: 34,
                themes: ["greed", "paranoia", "human_nature"],
                castRequirements: { male_lead: 3, female_lead: 0, supporting: 8 },
                locationNeeds: ["mountains", "village", "mine"],
                historicalNotes: "Huston's masterpiece, Bogart's greatest role"
            },
            {
                title: "The Blacklist",
                genre: "drama",
                year: 1947,
                budget: 100000,
                quality: 88,
                description: "A Hollywood writer faces persecution during the communist witch hunts.",
                censorRisk: 95,
                shootingDays: 22,
                themes: ["mccarthyism", "censorship", "integrity"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 },
                locationNeeds: ["studio", "courtroom", "blacklisted_writer_home"],
                riskWarning: "EXTREMELY CONTROVERSIAL - Could trigger HUAC investigation",
                historicalNotes: "Few films dared address HUAC directly due to industry fear"
            },
            {
                title: "Suburban Dreams",
                genre: "drama",
                year: 1948,
                budget: 85000,
                quality: 75,
                description: "A returning veteran struggles to adjust to peacetime family life.",
                censorRisk: 25,
                shootingDays: 18,
                themes: ["ptsd", "family", "adjustment"],
                castRequirements: { male_lead: 1, female_lead: 1, children: 2, supporting: 5 },
                locationNeeds: ["suburban_home", "factory", "va_hospital"],
                historicalNotes: "Post-war adjustment became a major theme in late 1940s cinema"
            },

            // POST-WAR COMEDY
            {
                title: "Television Blues",
                genre: "comedy",
                year: 1949,
                budget: 95000,
                quality: 70,
                description: "A radio comedian tries to adapt his act for the new medium of television.",
                censorRisk: 15,
                shootingDays: 20,
                themes: ["technology", "change", "showbusiness"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["tv_studio", "radio_station", "apartment"],
                historicalNotes: "Television's emergence threatened Hollywood's dominance"
            },

            // POST-WAR WESTERN
            {
                title: "The Last Frontier",
                genre: "western",
                year: 1949,
                budget: 110000,
                quality: 80,
                description: "The old West gives way to modern civilization in this elegiac Western.",
                censorRisk: 20,
                shootingDays: 25,
                themes: ["progress", "nostalgia", "civilization"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["frontier_town", "railroad", "ranch"],
                historicalNotes: "Late 1940s Westerns began exploring themes of change and loss"
            },
            {
                title: "Red River",
                genre: "western",
                year: 1948,
                budget: 155000,
                quality: 90,
                description: "A ruthless cattle baron and his adopted son clash on the first great cattle drive.",
                censorRisk: 28,
                shootingDays: 38,
                themes: ["father_son", "obsession", "cattle_drive"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 15 },
                locationNeeds: ["ranch", "chisholm_trail", "abilene"],
                historicalNotes: "Hawks' epic Western, psychological depth uncommon for genre"
            },
            {
                title: "The Ox-Bow Incident",
                genre: "western",
                year: 1943,
                budget: 125000,
                quality: 86,
                description: "A lynch mob hangs innocent men, exposing the dark side of frontier justice.",
                censorRisk: 52,
                shootingDays: 24,
                themes: ["lynch_mob", "injustice", "guilt"],
                castRequirements: { male_lead: 3, female_lead: 0, supporting: 20 },
                locationNeeds: ["western_town", "forest", "clearing"],
                historicalNotes: "Anti-Western exposing mob psychology and racism"
            }
        ],

        // B-MOVIES - Low budget quickies for double features
        bMovies: [
            // B-WESTERNS
            {
                title: "Range Riders",
                genre: "western",
                year: 1940,
                budget: 45000,
                quality: 60,
                description: "Cowboys protect a frontier town from cattle rustlers.",
                censorRisk: 10,
                shootingDays: 14,
                themes: ["justice", "frontier", "cattle"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["ranch", "desert", "small_town"],
                budgetCategory: "B-movie",
                historicalNotes: "B-Westerns were the backbone of many studios' output"
            },
            {
                title: "Six-Gun Justice",
                genre: "western",
                year: 1938,
                budget: 38000,
                quality: 55,
                description: "A singing cowboy cleans up a lawless mining town.",
                censorRisk: 8,
                shootingDays: 12,
                themes: ["law", "music", "frontier"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 },
                locationNeeds: ["mining_town", "saloon", "ranch"],
                budgetCategory: "B-movie",
                historicalNotes: "Singing cowboys like Gene Autry dominated B-Westerns"
            },
            {
                title: "Dusty Trails",
                genre: "western",
                year: 1941,
                budget: 42000,
                quality: 58,
                description: "A Texas Ranger tracks outlaws across the desert.",
                censorRisk: 12,
                shootingDays: 13,
                themes: ["law", "pursuit", "desert"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["desert", "hideout", "border_town"],
                budgetCategory: "B-movie",
                historicalNotes: "Cheap to shoot in California desert locations"
            },
            {
                title: "Thunder Mesa",
                genre: "western",
                year: 1943,
                budget: 46000,
                quality: 62,
                description: "A frontier marshal faces down a gang of bank robbers.",
                censorRisk: 15,
                shootingDays: 14,
                themes: ["law", "showdown", "courage"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["western_town", "bank", "main_street"],
                budgetCategory: "B-movie",
                historicalNotes: "Formula Westerns shot in a week on studio backlots"
            },

            // B-HORROR
            {
                title: "Midnight Terror",
                genre: "horror",
                year: 1935,
                budget: 35000,
                quality: 55,
                description: "A mad scientist creates monsters in his secret laboratory.",
                censorRisk: 40,
                shootingDays: 12,
                themes: ["science", "horror", "madness"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 },
                locationNeeds: ["laboratory", "castle", "village"],
                budgetCategory: "B-movie",
                historicalNotes: "Horror B-movies were profitable with low production costs"
            },
            {
                title: "The Vampire's Curse",
                genre: "horror",
                year: 1937,
                budget: 32000,
                quality: 52,
                description: "A vampire terrorizes a small village in Transylvania.",
                censorRisk: 38,
                shootingDays: 11,
                themes: ["vampire", "gothic", "horror"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 },
                locationNeeds: ["castle", "village", "crypt"],
                budgetCategory: "B-movie",
                historicalNotes: "Cheap vampire films flooded market after Dracula's success"
            },
            {
                title: "Voodoo Woman",
                genre: "horror",
                year: 1944,
                budget: 40000,
                quality: 50,
                description: "A scientist transforms a woman into a monster using voodoo rituals.",
                censorRisk: 45,
                shootingDays: 13,
                themes: ["voodoo", "transformation", "exploitation"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 },
                locationNeeds: ["jungle", "laboratory", "village"],
                budgetCategory: "B-movie",
                historicalNotes: "Exploitation horror traded on exotic 'voodoo' imagery"
            },
            {
                title: "The Zombie Returns",
                genre: "horror",
                year: 1945,
                budget: 37000,
                quality: 53,
                description: "Zombies rise from a Caribbean plantation to seek revenge.",
                censorRisk: 42,
                shootingDays: 12,
                themes: ["zombies", "voodoo", "caribbean"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["plantation", "cemetery", "jungle"],
                budgetCategory: "B-movie",
                historicalNotes: "Early zombie films before Romero redefined the genre"
            },

            // B-ADVENTURE
            {
                title: "Jungle Goddess",
                genre: "adventure",
                year: 1942,
                budget: 40000,
                quality: 50,
                description: "Explorers discover a lost civilization ruled by a beautiful queen.",
                censorRisk: 30,
                shootingDays: 16,
                themes: ["adventure", "exotic", "discovery"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["jungle", "temple", "native_village"],
                budgetCategory: "B-movie",
                historicalNotes: "Exotic adventures were cheap to produce using studio backlots"
            },
            {
                title: "Safari Danger",
                genre: "adventure",
                year: 1939,
                budget: 44000,
                quality: 56,
                description: "Big game hunters face deadly animals and hostile tribes in darkest Africa.",
                censorRisk: 28,
                shootingDays: 15,
                themes: ["hunting", "africa", "danger"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 },
                locationNeeds: ["jungle", "camp", "river"],
                budgetCategory: "B-movie",
                historicalNotes: "Stock footage of animals kept costs low"
            },
            {
                title: "Perils of the Amazon",
                genre: "adventure",
                year: 1941,
                budget: 43000,
                quality: 54,
                description: "Treasure hunters navigate deadly rapids and hostile natives.",
                censorRisk: 32,
                shootingDays: 16,
                themes: ["treasure", "danger", "jungle"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 7 },
                locationNeeds: ["river", "jungle", "cave"],
                budgetCategory: "B-movie",
                historicalNotes: "Jungle adventures recycled sets and stock footage"
            },

            // B-CRIME
            {
                title: "Gangster's Den",
                genre: "gangster",
                year: 1936,
                budget: 35000,
                quality: 58,
                description: "A detective goes undercover in a bootlegging operation.",
                censorRisk: 48,
                shootingDays: 13,
                themes: ["crime", "undercover", "prohibition"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["speakeasy", "warehouse", "alley"],
                budgetCategory: "B-movie",
                historicalNotes: "Poverty Row studios churned out cheap crime films"
            },
            {
                title: "The Big Heist",
                genre: "gangster",
                year: 1947,
                budget: 48000,
                quality: 61,
                description: "A gang plans an armored car robbery but betrayal ruins everything.",
                censorRisk: 52,
                shootingDays: 14,
                themes: ["heist", "betrayal", "crime"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["hideout", "warehouse", "street"],
                budgetCategory: "B-movie",
                historicalNotes: "Post-war heist films influenced by noir"
            },

            // B-MYSTERY
            {
                title: "Mystery at Midnight",
                genre: "mystery",
                year: 1940,
                budget: 36000,
                quality: 57,
                description: "A reporter solves murders at a spooky mansion.",
                censorRisk: 25,
                shootingDays: 12,
                themes: ["mystery", "mansion", "reporter"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 },
                locationNeeds: ["mansion", "library", "cellar"],
                budgetCategory: "B-movie",
                historicalNotes: "Old dark house mysteries were cheap programmers"
            },
            {
                title: "The Phantom Killer",
                genre: "mystery",
                year: 1943,
                budget: 39000,
                quality: 55,
                description: "A masked killer terrorizes a small town.",
                censorRisk: 35,
                shootingDays: 13,
                themes: ["serial_killer", "mystery", "small_town"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["small_town", "theater", "police_station"],
                budgetCategory: "B-movie",
                historicalNotes: "B-mysteries kept theaters filled for double features"
            },

            // B-SCI-FI
            {
                title: "Rocket to Mars",
                genre: "adventure",
                year: 1946,
                budget: 45000,
                quality: 51,
                description: "Scientists journey to Mars and encounter alien civilizations.",
                censorRisk: 20,
                shootingDays: 15,
                themes: ["space", "aliens", "exploration"],
                castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 },
                locationNeeds: ["rocket_ship", "mars_surface", "alien_city"],
                budgetCategory: "B-movie",
                specialRequirements: ["special_effects", "miniatures"],
                historicalNotes: "Post-war sci-fi reflected atomic age anxieties"
            },

            // B-NOIR
            {
                title: "Desperate Shadows",
                genre: "noir",
                year: 1948,
                budget: 42000,
                quality: 64,
                description: "A down-on-his-luck gambler gets involved with a dangerous woman.",
                censorRisk: 46,
                shootingDays: 14,
                themes: ["femme_fatale", "gambling", "betrayal"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 },
                locationNeeds: ["casino", "apartment", "alley"],
                budgetCategory: "B-movie",
                historicalNotes: "Poverty Row studios made cheap noir films"
            },
            {
                title: "City Without Mercy",
                genre: "noir",
                year: 1949,
                budget: 46000,
                quality: 62,
                description: "A corrupt cop tries to go straight but his past catches up.",
                censorRisk: 50,
                shootingDays: 15,
                themes: ["corruption", "redemption", "urban"],
                castRequirements: { male_lead: 1, female_lead: 1, supporting: 7 },
                locationNeeds: ["police_station", "nightclub", "tenement"],
                budgetCategory: "B-movie",
                historicalNotes: "Low budget noir used night shooting to hide cheap sets"
            }
        ],

        // ============================================================
        // TV THREAT (1950-1959) — CinemaScope epics, peak westerns, sci-fi, teen rebels
        // ============================================================
        tvThreat: [
            { title: "The Searchers of Mesa Verde", genre: "western", year: 1956, budget: 2500000, quality: 86, description: "A Civil War veteran obsessively searches for his niece kidnapped by raiders across the vast American frontier.", censorRisk: 20, shootingDays: 35, themes: ["obsession", "frontier", "redemption"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["desert", "canyon", "frontier_fort"], historicalNotes: "Widescreen Westerns became prestige cinema in the CinemaScope era" },
            { title: "The Ten Plagues", genre: "drama", year: 1956, budget: 13000000, quality: 82, description: "A biblical epic following Moses from Egyptian prince to deliverer of his people, filmed in stunning VistaVision.", censorRisk: 10, shootingDays: 90, themes: ["religion", "freedom", "spectacle"], castRequirements: { male_lead: 2, female_lead: 2, supporting: 20 }, locationNeeds: ["egypt_sets", "desert", "red_sea"], historicalNotes: "Biblical epics were Hollywood's weapon against television" },
            { title: "Creature from the Black Depths", genre: "horror", year: 1954, budget: 500000, quality: 68, description: "A scientific expedition discovers a prehistoric gill-man lurking in the Amazon, with terrifying underwater photography.", censorRisk: 25, shootingDays: 20, themes: ["science", "nature", "horror"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 }, locationNeeds: ["lagoon", "jungle", "underwater"], historicalNotes: "Monster movies thrived as drive-in double features" },
            { title: "Invasion of the Body Thieves", genre: "sci_fi", year: 1956, budget: 400000, quality: 78, description: "A small-town doctor discovers that his neighbors are being replaced by emotionless alien duplicates grown in giant seed pods.", censorRisk: 15, shootingDays: 18, themes: ["paranoia", "cold_war", "conformity"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["small_town", "greenhouse", "hospital"], historicalNotes: "1950s sci-fi reflected Cold War paranoia about communist infiltration" },
            { title: "Rebel on the Highway", genre: "drama", year: 1955, budget: 1500000, quality: 80, description: "A troubled teenager from a dysfunctional family struggles to fit in at his new school, finding solace in forbidden drag racing.", censorRisk: 35, shootingDays: 24, themes: ["rebellion", "youth", "alienation"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["high_school", "chickie_run", "planetarium"], historicalNotes: "Teen rebellion films tapped the emerging youth market" },
            { title: "Singin' in the Spotlight", genre: "musical", year: 1952, budget: 2500000, quality: 90, description: "A silent-film star and a chorus girl navigate the chaotic transition to talkies in this joyous Technicolor musical.", censorRisk: 5, shootingDays: 40, themes: ["showbusiness", "innovation", "romance"], castRequirements: { male_lead: 2, female_lead: 1, dancers: 15 }, locationNeeds: ["sound_stage", "theater", "hollywood_street"], historicalNotes: "MGM musicals represented the peak of studio craftsmanship" },
            { title: "High Noon at Hadleyville", genre: "western", year: 1952, budget: 800000, quality: 88, description: "A marshal who has just hung up his guns must face a gang of killers alone when the entire town refuses to help him.", censorRisk: 15, shootingDays: 25, themes: ["courage", "cowardice", "duty"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["western_town", "saloon", "train_station"], historicalNotes: "An allegory for the Hollywood blacklist era" },
            { title: "Vertigo Heights", genre: "thriller", year: 1958, budget: 2000000, quality: 85, description: "A retired detective with a crippling fear of heights becomes obsessed with a mysterious woman who seems possessed by the dead.", censorRisk: 30, shootingDays: 28, themes: ["obsession", "deception", "identity"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["san_francisco", "bell_tower", "apartment"], historicalNotes: "Psychological thrillers pushed boundaries of what studios would finance" },
            { title: "Around the Globe in 80 Days", genre: "adventure", year: 1956, budget: 6000000, quality: 75, description: "An eccentric Victorian gentleman wagers he can circumnavigate the globe in just 80 days, encountering spectacular adventures.", censorRisk: 5, shootingDays: 60, themes: ["adventure", "spectacle", "wager"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 30 }, locationNeeds: ["london", "india", "american_west"], historicalNotes: "Globe-trotting spectacles with all-star cameos fought TV with sheer scale" },
            { title: "The Bridge on the River Kwae", genre: "war", year: 1957, budget: 3000000, quality: 89, description: "British POWs build a strategic bridge for their Japanese captors while Allied commandos plan to destroy it.", censorRisk: 20, shootingDays: 40, themes: ["duty", "madness", "war"], castRequirements: { male_lead: 3, female_lead: 0, supporting: 10 }, locationNeeds: ["jungle", "prison_camp", "river_bridge"], historicalNotes: "Prestige war epics combined spectacle with serious themes" },
            { title: "Attack of the 50-Foot Woman", genre: "sci_fi", year: 1958, budget: 200000, quality: 45, description: "After an alien encounter, a wealthy socialite grows to enormous size and terrorizes her unfaithful husband and his mistress.", censorRisk: 30, shootingDays: 12, themes: ["revenge", "aliens", "infidelity"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["desert", "mansion", "town"], historicalNotes: "Cheap sci-fi exploitation films packed drive-in theaters" },
            { title: "The Apartment on Park Avenue", genre: "comedy", year: 1959, budget: 1800000, quality: 87, description: "A lonely office worker loans his apartment to executives for their affairs, until he falls for his boss's mistress.", censorRisk: 40, shootingDays: 28, themes: ["loneliness", "corruption", "romance"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["office_building", "apartment", "chinese_restaurant"], historicalNotes: "Sophisticated comedies pushed boundaries as the Code weakened" }
        ],

        // ============================================================
        // NEW WAVE (1960-1966) — Hitchcock, spy films, spectacle epics, Code crumbles
        // ============================================================
        newWave: [
            { title: "The Birds of Bodega Bay", genre: "horror", year: 1963, budget: 3000000, quality: 82, description: "Unexplained mass bird attacks terrorize a small coastal town, turning nature itself into a weapon of destruction.", censorRisk: 35, shootingDays: 40, themes: ["nature", "terror", "isolation"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["coastal_town", "schoolhouse", "farmhouse"], historicalNotes: "Hitchcock pioneered special effects horror with no musical score" },
            { title: "Doctor Strange Love", genre: "comedy", year: 1964, budget: 1800000, quality: 90, description: "A deranged general launches a nuclear attack on the Soviets, and the War Room scrambles to prevent Armageddon in this savage satire.", censorRisk: 50, shootingDays: 30, themes: ["cold_war", "satire", "nuclear"], castRequirements: { male_lead: 3, female_lead: 0, supporting: 8 }, locationNeeds: ["war_room", "bomber_cockpit", "air_base"], historicalNotes: "Black comedies about nuclear war shocked 1960s audiences" },
            { title: "Cleopatra's Throne", genre: "drama", year: 1963, budget: 44000000, quality: 65, description: "The legendary Egyptian queen seduces Caesar and Antony in this lavish four-hour epic that nearly bankrupts the studio.", censorRisk: 40, shootingDays: 120, themes: ["power", "seduction", "empire"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 25 }, locationNeeds: ["rome", "egypt_palace", "battle_sea"], historicalNotes: "Colossal budget overruns nearly destroyed 20th Century Fox" },
            { title: "Agent 008: Goldeneye", genre: "thriller", year: 1964, budget: 3000000, quality: 77, description: "A suave British secret agent battles a gold-obsessed villain planning to irradiate Fort Knox.", censorRisk: 25, shootingDays: 35, themes: ["espionage", "glamour", "cold_war"], castRequirements: { male_lead: 1, female_lead: 2, supporting: 6 }, locationNeeds: ["casino", "villain_lair", "exotic_locale"], historicalNotes: "Spy films became a global phenomenon in the 1960s" },
            { title: "The Melody of Music", genre: "musical", year: 1965, budget: 8000000, quality: 83, description: "A young Austrian governess brings music and joy to a strict widower's seven children as the Nazis close in.", censorRisk: 5, shootingDays: 50, themes: ["music", "family", "resistance"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 }, locationNeeds: ["austrian_alps", "mansion", "abbey"], historicalNotes: "The last great studio musical smash before the genre collapsed" },
            { title: "To Kill a Songbird", genre: "drama", year: 1962, budget: 2000000, quality: 91, description: "A principled Southern lawyer defends a Black man falsely accused of assaulting a white woman, as seen through his daughter's eyes.", censorRisk: 45, shootingDays: 30, themes: ["justice", "racism", "innocence"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["courthouse", "southern_town", "porch"], historicalNotes: "Social justice dramas gained prominence during the Civil Rights era" },
            { title: "Lawrence of the Desert", genre: "adventure", year: 1962, budget: 15000000, quality: 92, description: "A brilliant but tortured British officer leads an Arab revolt against the Ottoman Empire across endless desert landscapes.", censorRisk: 15, shootingDays: 70, themes: ["identity", "colonialism", "spectacle"], castRequirements: { male_lead: 2, female_lead: 0, supporting: 12 }, locationNeeds: ["desert", "damascus", "cairo"], historicalNotes: "70mm roadshow epics defined prestige cinema in the early 1960s" },
            { title: "Psycho Ward", genre: "horror", year: 1960, budget: 800000, quality: 88, description: "A woman on the run checks into a remote motel run by a dangerously disturbed young man and his overbearing mother.", censorRisk: 60, shootingDays: 22, themes: ["madness", "murder", "deception"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["motel", "old_house", "office"], historicalNotes: "Low-budget horror could outgross expensive epics" },
            { title: "The Great Escape Route", genre: "war", year: 1963, budget: 4000000, quality: 80, description: "Allied POWs plan the most ambitious mass escape from an \"escape-proof\" German prison camp.", censorRisk: 15, shootingDays: 40, themes: ["ingenuity", "camaraderie", "freedom"], castRequirements: { male_lead: 4, female_lead: 0, supporting: 10 }, locationNeeds: ["prison_camp", "tunnel", "countryside"], historicalNotes: "All-star ensemble casts became a major selling point" },
            { title: "Beach Blanket Bash", genre: "comedy", year: 1965, budget: 600000, quality: 50, description: "Surf-crazy teens throw the ultimate beach party while dealing with bumbling bikers and a scheming real estate developer.", censorRisk: 15, shootingDays: 14, themes: ["youth", "surf", "romance"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["beach", "surf_shack", "boardwalk"], historicalNotes: "Beach party films were cheap, profitable, and targeted teenagers" },
            { title: "West Side Rumble", genre: "musical", year: 1961, budget: 6000000, quality: 86, description: "Romeo and Juliet retold as rival street gangs in 1950s New York, with electrifying dance sequences and soaring music.", censorRisk: 30, shootingDays: 45, themes: ["gang_violence", "forbidden_love", "prejudice"], castRequirements: { male_lead: 2, female_lead: 1, dancers: 20 }, locationNeeds: ["new_york_streets", "playground", "dance_hall"], historicalNotes: "Location shooting in actual New York streets was revolutionary" },
            { title: "The Manchurian Candidate's Return", genre: "thriller", year: 1962, budget: 2200000, quality: 84, description: "A Korean War hero is secretly brainwashed into becoming a political assassin, controlled by communist handlers.", censorRisk: 55, shootingDays: 30, themes: ["brainwashing", "conspiracy", "politics"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 }, locationNeeds: ["political_rally", "apartment", "garden_party"], historicalNotes: "Political thrillers reflected Cold War anxieties about hidden enemies" }
        ],

        // ============================================================
        // RATINGS ERA (1967-1972) — Counterculture, MPAA replaces Code, low-budget revolution
        // ============================================================
        ratingsEra: [
            { title: "Easy Highways", genre: "drama", year: 1969, budget: 400000, quality: 78, description: "Two hippie bikers ride across America selling drugs to fund their freedom, only to discover the American Dream is dead.", censorRisk: 75, shootingDays: 14, themes: ["freedom", "counterculture", "drugs"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 }, locationNeeds: ["highway", "commune", "southern_diner"], historicalNotes: "Micro-budget films proved audiences craved authentic counterculture stories" },
            { title: "The Godson", genre: "crime", year: 1972, budget: 6000000, quality: 95, description: "The aging patriarch of a crime dynasty transfers control to his reluctant youngest son, who embraces the family business.", censorRisk: 65, shootingDays: 60, themes: ["family", "power", "corruption"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 12 }, locationNeeds: ["estate", "restaurant", "sicily"], historicalNotes: "Crime epics achieved artistic legitimacy in the Ratings Era" },
            { title: "Midnight Cowboy Blues", genre: "drama", year: 1969, budget: 1000000, quality: 85, description: "A naive Texas hustler and a sickly con man form an unlikely friendship while struggling to survive in New York City.", censorRisk: 80, shootingDays: 25, themes: ["loneliness", "desperation", "friendship"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 }, locationNeeds: ["times_square", "flophouse", "bus_station"], historicalNotes: "The only X-rated film to win Best Picture, proving the Ratings Era's freedom" },
            { title: "Bonnie and Claude", genre: "crime", year: 1967, budget: 2500000, quality: 84, description: "A charismatic couple embarks on a Depression-era crime spree across the Midwest, becoming folk heroes before a violent end.", censorRisk: 70, shootingDays: 30, themes: ["rebellion", "violence", "celebrity"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["rural_bank", "dusty_road", "motel"], historicalNotes: "Graphic violence shattered the Hays Code's last pretense of authority" },
            { title: "Night of the Living Corpses", genre: "horror", year: 1968, budget: 115000, quality: 72, description: "Strangers barricade themselves in a farmhouse as the recently dead rise and attack the living.", censorRisk: 85, shootingDays: 10, themes: ["survival", "horror", "social_commentary"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["farmhouse", "cemetery", "basement"], historicalNotes: "Micro-budget horror created the zombie genre and shocked mainstream America" },
            { title: "2001: A Space Journey", genre: "sci_fi", year: 1968, budget: 10000000, quality: 93, description: "From the dawn of man to the moons of Jupiter, a mysterious monolith guides humanity's evolution in this visionary epic.", censorRisk: 10, shootingDays: 80, themes: ["evolution", "technology", "cosmic"], castRequirements: { male_lead: 2, female_lead: 0, supporting: 6 }, locationNeeds: ["space_station", "lunar_surface", "spacecraft"], historicalNotes: "Revolutionary special effects and avant-garde storytelling redefined sci-fi" },
            { title: "The Graduate's Dilemma", genre: "comedy", year: 1967, budget: 3000000, quality: 86, description: "A directionless college graduate is seduced by an older woman, then falls for her daughter, scandalizing suburban America.", censorRisk: 55, shootingDays: 25, themes: ["alienation", "sexuality", "generation_gap"], castRequirements: { male_lead: 1, female_lead: 2, supporting: 4 }, locationNeeds: ["suburban_home", "hotel", "church"], historicalNotes: "The counterculture generation gap became a box office goldmine" },
            { title: "Shaft's Big Score", genre: "crime", year: 1971, budget: 500000, quality: 70, description: "A cool Black private detective navigates Harlem's criminal underworld to rescue a kidnapped girl.", censorRisk: 50, shootingDays: 18, themes: ["empowerment", "justice", "urban"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["harlem", "nightclub", "warehouse"], historicalNotes: "Blaxploitation films gave Black filmmakers and audiences representation" },
            { title: "MASH Unit", genre: "comedy", year: 1970, budget: 3000000, quality: 83, description: "Irreverent Army surgeons use dark humor and pranks to cope with the insanity of a mobile hospital during the Korean War.", censorRisk: 45, shootingDays: 28, themes: ["war", "satire", "absurdity"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 8 }, locationNeeds: ["army_camp", "operating_room", "mess_tent"], historicalNotes: "Anti-war satire disguised as Korean War comedy resonated during Vietnam" },
            { title: "A Clockwork Tangerine", genre: "drama", year: 1971, budget: 2000000, quality: 88, description: "A violent young delinquent undergoes experimental aversion therapy that robs him of free will in a dystopian near-future Britain.", censorRisk: 90, shootingDays: 30, themes: ["violence", "free_will", "dystopia"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["council_estate", "prison", "modernist_interior"], historicalNotes: "Ultra-violent art films tested the new ratings system's limits" },
            { title: "The French Connection Point", genre: "thriller", year: 1971, budget: 1800000, quality: 85, description: "A relentless NYPD detective pursues a suave French heroin smuggler through the streets of New York.", censorRisk: 45, shootingDays: 30, themes: ["obsession", "corruption", "drugs"], castRequirements: { male_lead: 2, female_lead: 0, supporting: 6 }, locationNeeds: ["brooklyn", "subway", "marseille"], historicalNotes: "Gritty location shooting and real car chases set new standards for realism" },
            { title: "Butch and the Sundance Kid", genre: "western", year: 1969, budget: 6000000, quality: 84, description: "Two charming outlaws flee to Bolivia as the Old West closes in, mixing comedy with inevitable tragedy.", censorRisk: 25, shootingDays: 35, themes: ["friendship", "outlaws", "nostalgia"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 }, locationNeeds: ["western_town", "train", "bolivia"], historicalNotes: "Revisionist Westerns romanticized outlaws while mourning the genre's death" }
        ],

        // ============================================================
        // NEW HOLLYWOOD (1973-1979) — Auteurs, disaster films, blockbusters born
        // ============================================================
        newHollywood: [
            { title: "Jaws of the Deep", genre: "thriller", year: 1975, budget: 9000000, quality: 90, description: "A massive great white shark terrorizes a beach town, and three very different men set out to hunt it down.", censorRisk: 35, shootingDays: 55, themes: ["survival", "nature", "fear"], castRequirements: { male_lead: 3, female_lead: 0, supporting: 6 }, locationNeeds: ["beach_town", "ocean", "boat"], historicalNotes: "The first summer blockbuster invented wide-release saturation marketing" },
            { title: "Star Conflicts", genre: "sci_fi", year: 1977, budget: 11000000, quality: 88, description: "A farm boy joins a ragtag rebellion against a galactic empire, guided by an ancient mystical order.", censorRisk: 5, shootingDays: 65, themes: ["heroism", "destiny", "good_vs_evil"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 }, locationNeeds: ["desert_planet", "space_station", "rebel_base"], historicalNotes: "Merchandise and sequels created the modern franchise model" },
            { title: "The Exorcism", genre: "horror", year: 1973, budget: 12000000, quality: 86, description: "A mother watches helplessly as her 12-year-old daughter is possessed by a demon, turning to two priests for salvation.", censorRisk: 85, shootingDays: 40, themes: ["faith", "evil", "motherhood"], castRequirements: { male_lead: 2, female_lead: 2, supporting: 4 }, locationNeeds: ["georgetown_house", "church", "hospital"], historicalNotes: "Horror became prestige cinema, grossing more than most dramas" },
            { title: "Rocky Road", genre: "drama", year: 1976, budget: 1000000, quality: 83, description: "A small-time boxer from Philadelphia gets a once-in-a-lifetime shot at the heavyweight championship.", censorRisk: 20, shootingDays: 25, themes: ["underdog", "determination", "love"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["boxing_ring", "philadelphia_streets", "meat_locker"], historicalNotes: "Low-budget underdog story became the decade's most inspirational film" },
            { title: "Apocalypse Then", genre: "war", year: 1979, budget: 20000000, quality: 92, description: "A special ops captain journeys upriver into Cambodia to terminate a rogue colonel who has gone insane in the jungle.", censorRisk: 75, shootingDays: 80, themes: ["madness", "war", "morality"], castRequirements: { male_lead: 2, female_lead: 0, supporting: 8 }, locationNeeds: ["jungle_river", "military_base", "temple"], historicalNotes: "A legendary troubled production that nearly destroyed its director" },
            { title: "Taxi Driver's Confession", genre: "thriller", year: 1976, budget: 1300000, quality: 89, description: "An insomniac Vietnam vet driving a taxi through New York's seedy streets descends into violent vigilantism.", censorRisk: 80, shootingDays: 25, themes: ["alienation", "violence", "redemption"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["new_york_streets", "taxi", "apartment"], historicalNotes: "Auteur-driven character studies defined the New Hollywood movement" },
            { title: "The Towering Flame", genre: "drama", year: 1974, budget: 14000000, quality: 72, description: "A massive fire breaks out in the world's tallest skyscraper on its dedication night, trapping hundreds of guests.", censorRisk: 25, shootingDays: 45, themes: ["disaster", "heroism", "hubris"], castRequirements: { male_lead: 3, female_lead: 2, supporting: 15 }, locationNeeds: ["skyscraper", "penthouse", "stairwell"], historicalNotes: "Disaster films with all-star casts dominated the mid-1970s" },
            { title: "Close Encounters of the Third Type", genre: "sci_fi", year: 1977, budget: 19000000, quality: 87, description: "Ordinary people across the globe experience mysterious visions that draw them to a remote mountain for humanity's first alien contact.", censorRisk: 5, shootingDays: 50, themes: ["wonder", "obsession", "contact"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["suburban_home", "devils_tower", "desert"], historicalNotes: "Spielberg proved sci-fi could be optimistic and emotionally profound" },
            { title: "Chinatown Confidential", genre: "crime", year: 1974, budget: 6000000, quality: 91, description: "A 1930s private eye uncovers a conspiracy involving water rights, real estate corruption, and terrible family secrets in Los Angeles.", censorRisk: 55, shootingDays: 35, themes: ["corruption", "incest", "power"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["los_angeles", "reservoir", "mansion"], historicalNotes: "Neo-noir masterpiece showed the New Hollywood at its most cynical" },
            { title: "Enter the Dragon's Den", genre: "action", year: 1973, budget: 850000, quality: 74, description: "A martial arts master enters an underground tournament on a remote island to avenge his sister and expose a crime lord.", censorRisk: 40, shootingDays: 22, themes: ["revenge", "martial_arts", "honor"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 10 }, locationNeeds: ["island_fortress", "tournament_arena", "underground_lair"], historicalNotes: "Martial arts films crossed over to mainstream Western audiences" },
            { title: "One Flew Over the Asylum", genre: "drama", year: 1975, budget: 4400000, quality: 93, description: "A charming criminal fakes insanity to serve his sentence in a mental institution, clashing with a tyrannical nurse.", censorRisk: 50, shootingDays: 30, themes: ["freedom", "authority", "madness"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 }, locationNeeds: ["mental_hospital", "ward", "basketball_court"], historicalNotes: "One of only three films to sweep all five major Oscar categories" },
            { title: "Superman Soars", genre: "sci_fi", year: 1978, budget: 55000000, quality: 80, description: "The last son of a dying planet is raised on a Kansas farm and becomes Earth's greatest hero in Metropolis.", censorRisk: 5, shootingDays: 55, themes: ["heroism", "identity", "hope"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["metropolis", "fortress_of_solitude", "kansas_farm"], historicalNotes: "Proved comic book adaptations could work as big-budget prestige films" }
        ],

        // ============================================================
        // BLOCKBUSTER AGE (1980-1989) — Action, sci-fi, teen comedies, sequels, VHS
        // ============================================================
        blockbusterAge: [
            { title: "Steel Fortress", genre: "action", year: 1985, budget: 25000000, quality: 78, description: "A maverick NYPD cop wages a one-man war against terrorists who seize a downtown skyscraper on Christmas Eve.", censorRisk: 35, shootingDays: 45, themes: ["heroism", "terrorism", "survival"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["skyscraper", "rooftop", "parking_garage"], historicalNotes: "High-concept action with a marketable premise dominated the 1980s" },
            { title: "Raiders of the Lost Temple", genre: "adventure", year: 1981, budget: 20000000, quality: 90, description: "A globe-trotting archaeologist races Nazis to find the Ark of the Covenant before its power falls into evil hands.", censorRisk: 15, shootingDays: 50, themes: ["adventure", "archaeology", "nazis"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["jungle_temple", "desert", "submarine_base"], historicalNotes: "The ultimate throwback adventure serial, updated for modern audiences" },
            { title: "The Termination Machine", genre: "sci_fi", year: 1984, budget: 6400000, quality: 82, description: "A cybernetic assassin from the future is sent back in time to kill the mother of humanity's future resistance leader.", censorRisk: 40, shootingDays: 30, themes: ["fate", "technology", "survival"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 }, locationNeeds: ["los_angeles", "tech_noir_club", "factory"], historicalNotes: "Low-budget sci-fi action could launch massive franchises" },
            { title: "Breakfast at Detention", genre: "comedy", year: 1985, budget: 1000000, quality: 82, description: "Five very different high school students bond during a Saturday detention, discovering they have more in common than they thought.", censorRisk: 25, shootingDays: 18, themes: ["identity", "conformity", "youth"], castRequirements: { male_lead: 3, female_lead: 2, supporting: 2 }, locationNeeds: ["high_school_library", "hallway", "parking_lot"], historicalNotes: "Teen comedies became their own profitable genre in the 1980s" },
            { title: "Ghost Chasers", genre: "comedy", year: 1984, budget: 30000000, quality: 80, description: "Three eccentric parapsychologists start a ghost removal business in New York City, battling an ancient Sumerian god.", censorRisk: 10, shootingDays: 40, themes: ["comedy", "supernatural", "entrepreneurship"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 6 }, locationNeeds: ["firehouse", "apartment_building", "new_york"], historicalNotes: "Effects-heavy comedies became tentpole releases" },
            { title: "Elm Street Nightmares", genre: "horror", year: 1984, budget: 1800000, quality: 72, description: "A disfigured killer invades teenagers' dreams, murdering them in their sleep in increasingly surreal ways.", censorRisk: 70, shootingDays: 16, themes: ["dreams", "murder", "teenage_fear"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["suburban_house", "dreamscape", "boiler_room"], historicalNotes: "Slasher franchises generated enormous returns on modest budgets" },
            { title: "Top Ace", genre: "action", year: 1986, budget: 15000000, quality: 70, description: "A hotshot Navy fighter pilot competes at an elite training school while dealing with the ghosts of his father's legacy.", censorRisk: 10, shootingDays: 35, themes: ["competition", "pride", "legacy"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["aircraft_carrier", "bar", "air_base"], historicalNotes: "Military action films boosted Navy recruitment by 500%" },
            { title: "Back to Yesterday", genre: "sci_fi", year: 1985, budget: 19000000, quality: 85, description: "A teenager accidentally travels 30 years into the past in a time machine built from a DeLorean, accidentally preventing his parents from meeting.", censorRisk: 10, shootingDays: 35, themes: ["time_travel", "family", "adventure"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 }, locationNeeds: ["suburban_town", "high_school", "clock_tower"], historicalNotes: "Family-friendly adventure-comedies with sci-fi hooks were license to print money" },
            { title: "Platoon's Crossing", genre: "war", year: 1986, budget: 6000000, quality: 87, description: "A young soldier in Vietnam is torn between two sergeants representing good and evil as combat destroys innocence.", censorRisk: 60, shootingDays: 30, themes: ["war", "morality", "coming_of_age"], castRequirements: { male_lead: 3, female_lead: 0, supporting: 10 }, locationNeeds: ["jungle", "base_camp", "village"], historicalNotes: "Vietnam War films finally confronted America's collective trauma" },
            { title: "The Princess Bride's Tale", genre: "romance", year: 1987, budget: 16000000, quality: 84, description: "A grandfather reads a fairy tale of fencing, fighting, torture, true love, and miracles to his sick grandson.", censorRisk: 5, shootingDays: 35, themes: ["love", "adventure", "fairy_tale"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 8 }, locationNeeds: ["castle", "forest", "cliffs_of_insanity"], historicalNotes: "Beloved cult classic that found its massive audience on home video" },
            { title: "Rain Main", genre: "drama", year: 1988, budget: 25000000, quality: 86, description: "A selfish yuppie discovers he has an autistic savant brother and kidnaps him from an institution for a cross-country road trip.", censorRisk: 15, shootingDays: 35, themes: ["family", "disability", "redemption"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 3 }, locationNeeds: ["institution", "las_vegas", "highway"], historicalNotes: "Star-driven prestige dramas could still compete at the blockbuster box office" },
            { title: "Blade Sprinter", genre: "sci_fi", year: 1982, budget: 28000000, quality: 88, description: "In a rain-soaked dystopian Los Angeles, a retired detective hunts rogue androids who are desperate to extend their lifespans.", censorRisk: 30, shootingDays: 40, themes: ["humanity", "mortality", "dystopia"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 4 }, locationNeeds: ["dystopian_city", "rooftop", "noodle_bar"], historicalNotes: "A box office disappointment that became the most influential sci-fi film of the decade on VHS" }
        ],

        // ============================================================
        // INDIE BOOM (1990-1996) — Sundance, Tarantino, CGI dawn, indie/tentpole split
        // ============================================================
        indieBoom: [
            { title: "Reservoir Hounds", genre: "crime", year: 1992, budget: 1200000, quality: 82, description: "A jewel heist goes catastrophically wrong, and the surviving criminals hole up in a warehouse trying to identify the rat.", censorRisk: 65, shootingDays: 20, themes: ["betrayal", "violence", "loyalty"], castRequirements: { male_lead: 6, female_lead: 0, supporting: 3 }, locationNeeds: ["warehouse", "diner", "car"], historicalNotes: "Sundance launched a new wave of ultra-cool independent crime films" },
            { title: "Pulp Friction", genre: "crime", year: 1994, budget: 8000000, quality: 93, description: "The intersecting stories of two hitmen, a boxer, and a mob boss's wife unfold in a kaleidoscopic Los Angeles underworld.", censorRisk: 70, shootingDays: 35, themes: ["crime", "redemption", "pop_culture"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 8 }, locationNeeds: ["diner", "apartment", "boxing_ring"], historicalNotes: "Non-linear storytelling and pop culture dialogue redefined cool" },
            { title: "Jurassic Theme Park", genre: "sci_fi", year: 1993, budget: 63000000, quality: 85, description: "A billionaire's cloned dinosaur theme park goes catastrophically wrong when the animals escape their enclosures.", censorRisk: 20, shootingDays: 50, themes: ["technology", "hubris", "survival"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 5 }, locationNeeds: ["tropical_island", "lab", "jungle"], historicalNotes: "CGI dinosaurs proved digital effects could create photorealistic creatures" },
            { title: "Schindler's Ledger", genre: "drama", year: 1993, budget: 22000000, quality: 95, description: "A German industrialist saves over a thousand Jews from the Holocaust by employing them in his factories.", censorRisk: 45, shootingDays: 55, themes: ["holocaust", "redemption", "humanity"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 15 }, locationNeeds: ["krakow", "concentration_camp", "factory"], historicalNotes: "Black-and-white prestige filmmaking proved commercially viable" },
            { title: "Forrest's Run", genre: "comedy", year: 1994, budget: 55000000, quality: 82, description: "A simple man from Alabama stumbles through every major event of the 1960s and 70s, achieving inadvertent greatness.", censorRisk: 15, shootingDays: 45, themes: ["innocence", "history", "destiny"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["alabama", "vietnam", "washington_dc"], historicalNotes: "Digital effects seamlessly inserted characters into historical footage" },
            { title: "The Shawshank Atonement", genre: "drama", year: 1994, budget: 25000000, quality: 92, description: "A wrongfully convicted banker forms a transformative friendship over decades in a brutal Maine state prison.", censorRisk: 35, shootingDays: 40, themes: ["hope", "friendship", "injustice"], castRequirements: { male_lead: 2, female_lead: 0, supporting: 8 }, locationNeeds: ["prison", "library", "rooftop"], historicalNotes: "A box office underperformer that became the most-rented video of all time" },
            { title: "The Silence of the Wolves", genre: "thriller", year: 1991, budget: 19000000, quality: 91, description: "An FBI trainee seeks the help of an imprisoned cannibal psychiatrist to catch another serial killer at large.", censorRisk: 70, shootingDays: 35, themes: ["psychology", "evil", "manipulation"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["fbi_academy", "prison_cell", "basement"], historicalNotes: "Horror-thriller swept the Big Five Oscars, proving genre film excellence" },
            { title: "Toy Warriors", genre: "animated", year: 1995, budget: 30000000, quality: 86, description: "A cowboy toy's world is turned upside down when a flashy space ranger action figure threatens his position as the favorite.", censorRisk: 5, shootingDays: 0, themes: ["friendship", "jealousy", "identity"], castRequirements: { voice_cast: 6 }, locationNeeds: ["bedroom", "gas_station", "moving_van"], historicalNotes: "The first fully CGI-animated feature film revolutionized animation forever" },
            { title: "The Usual Suspects Lineup", genre: "thriller", year: 1995, budget: 6000000, quality: 85, description: "Five criminals thrown together in a police lineup pull off a massive heist, but who is the mysterious mastermind behind it all?", censorRisk: 40, shootingDays: 25, themes: ["deception", "identity", "crime"], castRequirements: { male_lead: 5, female_lead: 0, supporting: 4 }, locationNeeds: ["police_station", "boat_dock", "office"], historicalNotes: "Twist-ending thrillers became a staple of 1990s cinema" },
            { title: "Unforgiven Sins", genre: "western", year: 1992, budget: 14500000, quality: 89, description: "A retired outlaw reluctantly takes one last job to collect a bounty, confronting the violence he thought he'd left behind.", censorRisk: 40, shootingDays: 30, themes: ["violence", "redemption", "legacy"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 }, locationNeeds: ["frontier_town", "ranch", "prairie"], historicalNotes: "A revisionist Western that deconstructed the genre's mythology" },
            { title: "Groundhog Day Loop", genre: "comedy", year: 1993, budget: 14600000, quality: 84, description: "A cynical TV weatherman relives the same day over and over in a small Pennsylvania town until he learns to be a better person.", censorRisk: 5, shootingDays: 28, themes: ["self_improvement", "repetition", "love"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["small_town", "hotel", "town_square"], historicalNotes: "High-concept comedies proved studios didn't need explosions to draw audiences" },
            { title: "Braveheart's Rebellion", genre: "war", year: 1995, budget: 72000000, quality: 81, description: "A Scottish warrior leads a bloody rebellion against English tyranny in medieval Scotland.", censorRisk: 55, shootingDays: 60, themes: ["freedom", "revenge", "sacrifice"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 12 }, locationNeeds: ["scottish_highlands", "castle", "battlefield"], historicalNotes: "Star-directed epics could still sweep the Oscars" }
        ],

        // ============================================================
        // DIGITAL DAWN (1997-2004) — DVD boom, franchises, CGI epics, superhero origins
        // ============================================================
        digitalDawn: [
            { title: "Titanic Dreams", genre: "romance", year: 1997, budget: 200000000, quality: 85, description: "A penniless artist and a high-society woman fall in love aboard the doomed ocean liner on its maiden voyage.", censorRisk: 20, shootingDays: 80, themes: ["love", "class", "tragedy"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 }, locationNeeds: ["ocean_liner", "ocean", "lifeboat"], historicalNotes: "The most expensive film ever made became the highest-grossing of all time" },
            { title: "The Matrix Protocol", genre: "sci_fi", year: 1999, budget: 63000000, quality: 88, description: "A computer hacker discovers reality is a simulation controlled by machines, and he may be the prophesied one to free humanity.", censorRisk: 30, shootingDays: 50, themes: ["reality", "freedom", "destiny"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["dystopian_city", "dojo", "office_building"], historicalNotes: "Bullet-time effects and cyberpunk philosophy became cultural touchstones" },
            { title: "Lord of the Rings: The Fellowship", genre: "adventure", year: 2001, budget: 93000000, quality: 92, description: "A humble hobbit must carry a powerful ring across a dangerous world to destroy it in the fires where it was forged.", censorRisk: 10, shootingDays: 90, themes: ["friendship", "courage", "evil"], castRequirements: { male_lead: 4, female_lead: 1, supporting: 12 }, locationNeeds: ["shire", "mines_of_moria", "rivendell"], historicalNotes: "Filming three epic fantasy films simultaneously was unprecedented" },
            { title: "Spider-Boy", genre: "superhero", year: 2002, budget: 139000000, quality: 78, description: "A nerdy teenager gains spider-like powers from a genetically modified spider and must battle a deranged industrialist.", censorRisk: 15, shootingDays: 50, themes: ["responsibility", "identity", "power"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["new_york", "lab", "bridge"], historicalNotes: "The modern superhero blockbuster template was established" },
            { title: "Saving Captain Ryan", genre: "war", year: 1998, budget: 70000000, quality: 90, description: "After D-Day, a squad of soldiers risks everything to find and bring home the last surviving brother from a family of four servicemen.", censorRisk: 55, shootingDays: 50, themes: ["duty", "sacrifice", "brotherhood"], castRequirements: { male_lead: 4, female_lead: 0, supporting: 8 }, locationNeeds: ["omaha_beach", "french_village", "bridge"], historicalNotes: "Hyper-realistic combat sequences redefined the war film genre" },
            { title: "Harry Wizard and the Sorcerer's Stone", genre: "adventure", year: 2001, budget: 125000000, quality: 79, description: "An orphaned boy discovers he's a wizard and attends a magical school, where he uncovers a plot involving a dark sorcerer.", censorRisk: 5, shootingDays: 55, themes: ["magic", "friendship", "destiny"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 10 }, locationNeeds: ["castle", "train", "dungeon"], historicalNotes: "IP-driven franchise filmmaking became Hollywood's dominant business model" },
            { title: "Scream Queen", genre: "horror", year: 1997, budget: 15000000, quality: 76, description: "A masked killer terrorizes a small town, targeting teens who know the rules of horror movies but still can't escape.", censorRisk: 50, shootingDays: 25, themes: ["self_awareness", "murder", "survival"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["suburban_house", "high_school", "video_store"], historicalNotes: "Meta-horror revived the slasher genre by deconstructing its conventions" },
            { title: "Gladiator's Revenge", genre: "action", year: 2000, budget: 103000000, quality: 83, description: "A Roman general is betrayed, enslaved, and fights his way through the gladiatorial arena to avenge his family.", censorRisk: 40, shootingDays: 55, themes: ["revenge", "honor", "freedom"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 8 }, locationNeeds: ["colosseum", "roman_villa", "arena"], historicalNotes: "Historical epics made a stunning comeback powered by CGI crowd scenes" },
            { title: "Finding Marlin", genre: "animated", year: 2003, budget: 94000000, quality: 87, description: "An overprotective clownfish crosses the entire ocean to rescue his son, who's been captured by a scuba diver.", censorRisk: 5, shootingDays: 0, themes: ["parenthood", "adventure", "letting_go"], castRequirements: { voice_cast: 8 }, locationNeeds: ["coral_reef", "ocean", "fish_tank"], historicalNotes: "CGI animated films became the most reliable family entertainment" },
            { title: "The Sixth Perception", genre: "thriller", year: 1999, budget: 40000000, quality: 84, description: "A child psychologist treats a young boy who claims to see dead people walking among the living.", censorRisk: 20, shootingDays: 30, themes: ["death", "perception", "redemption"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 3 }, locationNeeds: ["apartment", "church", "school"], historicalNotes: "Twist endings became a marketing phenomenon unto themselves" },
            { title: "American Splendor", genre: "comedy", year: 1999, budget: 10000000, quality: 80, description: "A dysfunctional father has a midlife crisis and becomes obsessed with beauty, freedom, and a teenager next door.", censorRisk: 55, shootingDays: 25, themes: ["suburban_decay", "beauty", "delusion"], castRequirements: { male_lead: 1, female_lead: 2, supporting: 5 }, locationNeeds: ["suburban_house", "fast_food", "high_school"], historicalNotes: "Dark suburban satire found its audience in the DVD era" },
            { title: "X-Warriors", genre: "superhero", year: 2000, budget: 75000000, quality: 76, description: "Mutants with extraordinary powers struggle for acceptance in a world that fears them, while a militant faction pushes for war.", censorRisk: 15, shootingDays: 40, themes: ["prejudice", "identity", "power"], castRequirements: { male_lead: 3, female_lead: 2, supporting: 8 }, locationNeeds: ["mansion", "island_base", "statue_of_liberty"], historicalNotes: "Ensemble superhero teams proved there was room beyond solo heroes" }
        ],

        // ============================================================
        // CONVERGENCE (2005-2010) — Superhero franchises, 3D, found footage, streaming
        // ============================================================
        convergence: [
            { title: "The Dark Crusader", genre: "superhero", year: 2008, budget: 185000000, quality: 91, description: "A billionaire vigilante faces his greatest foe: a psychopathic clown who wants to prove that anyone can be corrupted.", censorRisk: 40, shootingDays: 65, themes: ["chaos", "morality", "sacrifice"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 6 }, locationNeeds: ["gotham_city", "warehouse", "hospital"], historicalNotes: "Superhero films achieved artistic legitimacy and billion-dollar grosses" },
            { title: "Iron Warrior", genre: "superhero", year: 2008, budget: 140000000, quality: 80, description: "A billionaire arms dealer builds a high-tech suit of armor and becomes a superhero after being captured by terrorists.", censorRisk: 20, shootingDays: 50, themes: ["redemption", "technology", "responsibility"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["workshop", "desert_cave", "mansion"], historicalNotes: "Launched the shared cinematic universe model that transformed Hollywood" },
            { title: "Avatar: Blue World", genre: "sci_fi", year: 2009, budget: 237000000, quality: 78, description: "A paralyzed Marine operates an alien body on a lush jungle moon, falling in love with the native culture he was sent to exploit.", censorRisk: 10, shootingDays: 60, themes: ["colonialism", "nature", "identity"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["alien_jungle", "military_base", "floating_mountains"], historicalNotes: "3D filmmaking and performance capture created immersive alien worlds" },
            { title: "Paranormal Footage", genre: "horror", year: 2007, budget: 15000, quality: 62, description: "A couple sets up cameras in their home to capture evidence of a demon that has been haunting them since childhood.", censorRisk: 30, shootingDays: 7, themes: ["fear", "supernatural", "voyeurism"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 0 }, locationNeeds: ["house", "bedroom", "hallway"], historicalNotes: "Found footage horror proved $15,000 films could gross $200 million" },
            { title: "No Country for Old Killers", genre: "thriller", year: 2007, budget: 25000000, quality: 92, description: "A hunter stumbles upon a drug deal gone wrong and takes the money, pursued by a relentless psychopathic killer across West Texas.", censorRisk: 55, shootingDays: 35, themes: ["fate", "violence", "morality"], castRequirements: { male_lead: 3, female_lead: 0, supporting: 4 }, locationNeeds: ["texas_desert", "motel", "gas_station"], historicalNotes: "Austere, intellectual thrillers could still dominate awards season" },
            { title: "The Departed Souls", genre: "crime", year: 2006, budget: 90000000, quality: 87, description: "A mole in the police and an undercover cop in the mob race to identify each other before their covers are blown.", censorRisk: 55, shootingDays: 40, themes: ["identity", "betrayal", "corruption"], castRequirements: { male_lead: 3, female_lead: 1, supporting: 6 }, locationNeeds: ["boston", "police_station", "bar"], historicalNotes: "Star-driven crime dramas remained viable at premium budget levels" },
            { title: "WALL-Bot", genre: "animated", year: 2008, budget: 180000000, quality: 90, description: "A lonely trash-compacting robot on an abandoned Earth falls in love and follows his beloved into space to save humanity.", censorRisk: 5, shootingDays: 0, themes: ["love", "environment", "loneliness"], castRequirements: { voice_cast: 4 }, locationNeeds: ["post_apocalyptic_earth", "spaceship", "space"], historicalNotes: "Animated films tackled environmentalism and nearly wordless storytelling" },
            { title: "The Curious Case of Benjamin Bolton", genre: "drama", year: 2008, budget: 150000000, quality: 79, description: "A man born with the appearance of an 80-year-old ages backwards, experiencing love and loss in reverse.", censorRisk: 10, shootingDays: 50, themes: ["aging", "love", "time"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 5 }, locationNeeds: ["new_orleans", "tugboat", "nursing_home"], historicalNotes: "Digital de-aging effects opened new possibilities for character-driven stories" },
            { title: "Inception Dreams", genre: "sci_fi", year: 2010, budget: 160000000, quality: 89, description: "A thief who steals secrets by entering dreams is offered a chance to erase his criminal record by planting an idea in someone's mind.", censorRisk: 15, shootingDays: 55, themes: ["dreams", "reality", "redemption"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["dreamscape", "hotel_corridor", "snow_fortress"], historicalNotes: "Original sci-fi concepts could still command blockbuster budgets" },
            { title: "Slumdog Thousandaire", genre: "drama", year: 2008, budget: 15000000, quality: 85, description: "A Mumbai teen from the slums appears on a game show, and each question triggers a flashback to the events that gave him the answer.", censorRisk: 25, shootingDays: 30, themes: ["destiny", "love", "poverty"], castRequirements: { male_lead: 1, female_lead: 1, supporting: 6 }, locationNeeds: ["mumbai_slums", "tv_studio", "train"], historicalNotes: "Global settings and diverse stories found worldwide audiences" },
            { title: "The Social Disconnect", genre: "drama", year: 2010, budget: 40000000, quality: 86, description: "The founding of the world's largest social network leads to lawsuits, broken friendships, and billions of dollars.", censorRisk: 15, shootingDays: 30, themes: ["ambition", "betrayal", "technology"], castRequirements: { male_lead: 2, female_lead: 1, supporting: 4 }, locationNeeds: ["harvard_dorm", "office", "courtroom"], historicalNotes: "Tech-industry dramas reflected the new Silicon Valley power structure" },
            { title: "District Ten", genre: "sci_fi", year: 2009, budget: 30000000, quality: 81, description: "Aliens have been living in a Johannesburg slum for 20 years when a bureaucrat tasked with relocating them starts transforming into one.", censorRisk: 30, shootingDays: 25, themes: ["apartheid", "transformation", "xenophobia"], castRequirements: { male_lead: 1, female_lead: 0, supporting: 5 }, locationNeeds: ["johannesburg", "alien_camp", "lab"], historicalNotes: "Low-budget sci-fi with social commentary could compete globally" }
        ]
    };

    // Script generation parameters by era
    const ERA_PARAMETERS = {
        // PRE-CODE (1933-1934)
        1933: { preCodeChance: 0.7, bMovieChance: 0.4 },
        1934: { preCodeChance: 0.3, bMovieChance: 0.5 },
        // GOLDEN AGE (1935-1941)
        1935: { goldenAgeChance: 0.6, bMovieChance: 0.4 },
        1936: { goldenAgeChance: 0.7, bMovieChance: 0.4 },
        1937: { goldenAgeChance: 0.75, bMovieChance: 0.4 },
        1938: { technicolorAvailable: true, goldenAgeChance: 0.8, bMovieChance: 0.35 },
        1939: { technicolorAvailable: true, goldenAgeChance: 0.85, bMovieChance: 0.35 },
        1940: { goldenAgeChance: 0.8, bMovieChance: 0.35 },
        1941: { goldenAgeChance: 0.5, warYearsChance: 0.3, bMovieChance: 0.35 },
        // WAR YEARS (1942-1945)
        1942: { warYearsChance: 0.6, propagandaBonus: true, bMovieChance: 0.3 },
        1943: { warYearsChance: 0.8, propagandaBonus: true, bMovieChance: 0.3 },
        1944: { warYearsChance: 0.75, propagandaBonus: true, bMovieChance: 0.3 },
        1945: { warYearsChance: 0.6, postWarChance: 0.2, bMovieChance: 0.3 },
        // POST-WAR (1946-1949)
        1946: { postWarChance: 0.5, noirChance: 0.4, bMovieChance: 0.35 },
        1947: { postWarChance: 0.7, huacRisk: true, noirChance: 0.5, bMovieChance: 0.35 },
        1948: { postWarChance: 0.8, tvCompetition: true, noirChance: 0.4, bMovieChance: 0.4 },
        1949: { postWarChance: 0.9, industryChange: true, noirChance: 0.35, bMovieChance: 0.4 },
        // TV THREAT (1950-1959)
        1950: { tvThreatChance: 0.5, postWarChance: 0.3, bMovieChance: 0.4 },
        1951: { tvThreatChance: 0.6, bMovieChance: 0.4 },
        1952: { tvThreatChance: 0.7, bMovieChance: 0.35 },
        1953: { tvThreatChance: 0.7, cinemascope: true, bMovieChance: 0.35 },
        1954: { tvThreatChance: 0.75, cinemascope: true, bMovieChance: 0.35 },
        1955: { tvThreatChance: 0.8, bMovieChance: 0.35 },
        1956: { tvThreatChance: 0.8, bMovieChance: 0.3 },
        1957: { tvThreatChance: 0.8, bMovieChance: 0.3 },
        1958: { tvThreatChance: 0.75, bMovieChance: 0.35 },
        1959: { tvThreatChance: 0.75, newWaveChance: 0.1, bMovieChance: 0.35 },
        // NEW WAVE (1960-1966)
        1960: { newWaveChance: 0.5, tvThreatChance: 0.3, bMovieChance: 0.3 },
        1961: { newWaveChance: 0.6, bMovieChance: 0.3 },
        1962: { newWaveChance: 0.7, bMovieChance: 0.3 },
        1963: { newWaveChance: 0.75, bMovieChance: 0.25 },
        1964: { newWaveChance: 0.8, bMovieChance: 0.25 },
        1965: { newWaveChance: 0.8, bMovieChance: 0.25 },
        1966: { newWaveChance: 0.75, ratingsEraChance: 0.15, bMovieChance: 0.25 },
        // RATINGS ERA (1967-1972)
        1967: { ratingsEraChance: 0.5, newWaveChance: 0.3, bMovieChance: 0.25 },
        1968: { ratingsEraChance: 0.6, bMovieChance: 0.25 },
        1969: { ratingsEraChance: 0.7, bMovieChance: 0.25 },
        1970: { ratingsEraChance: 0.75, bMovieChance: 0.2 },
        1971: { ratingsEraChance: 0.8, bMovieChance: 0.2 },
        1972: { ratingsEraChance: 0.75, newHollywoodChance: 0.15, bMovieChance: 0.2 },
        // NEW HOLLYWOOD (1973-1979)
        1973: { newHollywoodChance: 0.5, ratingsEraChance: 0.3, bMovieChance: 0.2 },
        1974: { newHollywoodChance: 0.6, bMovieChance: 0.2 },
        1975: { newHollywoodChance: 0.7, bMovieChance: 0.2 },
        1976: { newHollywoodChance: 0.75, bMovieChance: 0.2 },
        1977: { newHollywoodChance: 0.8, bMovieChance: 0.2 },
        1978: { newHollywoodChance: 0.8, bMovieChance: 0.2 },
        1979: { newHollywoodChance: 0.75, blockbusterAgeChance: 0.15, bMovieChance: 0.2 },
        // BLOCKBUSTER AGE (1980-1989)
        1980: { blockbusterAgeChance: 0.5, newHollywoodChance: 0.3, bMovieChance: 0.2 },
        1981: { blockbusterAgeChance: 0.6, bMovieChance: 0.2 },
        1982: { blockbusterAgeChance: 0.7, bMovieChance: 0.2 },
        1983: { blockbusterAgeChance: 0.75, bMovieChance: 0.2 },
        1984: { blockbusterAgeChance: 0.8, bMovieChance: 0.2 },
        1985: { blockbusterAgeChance: 0.8, bMovieChance: 0.2 },
        1986: { blockbusterAgeChance: 0.8, bMovieChance: 0.2 },
        1987: { blockbusterAgeChance: 0.8, bMovieChance: 0.2 },
        1988: { blockbusterAgeChance: 0.75, bMovieChance: 0.2 },
        1989: { blockbusterAgeChance: 0.7, indieBoomChance: 0.15, bMovieChance: 0.2 },
        // INDIE BOOM (1990-1996)
        1990: { indieBoomChance: 0.5, blockbusterAgeChance: 0.3, bMovieChance: 0.15 },
        1991: { indieBoomChance: 0.6, bMovieChance: 0.15 },
        1992: { indieBoomChance: 0.7, bMovieChance: 0.15 },
        1993: { indieBoomChance: 0.75, bMovieChance: 0.15 },
        1994: { indieBoomChance: 0.8, bMovieChance: 0.15 },
        1995: { indieBoomChance: 0.8, bMovieChance: 0.15 },
        1996: { indieBoomChance: 0.75, digitalDawnChance: 0.1, bMovieChance: 0.15 },
        // DIGITAL DAWN (1997-2004)
        1997: { digitalDawnChance: 0.5, indieBoomChance: 0.3, bMovieChance: 0.1 },
        1998: { digitalDawnChance: 0.6, bMovieChance: 0.1 },
        1999: { digitalDawnChance: 0.7, bMovieChance: 0.1 },
        2000: { digitalDawnChance: 0.75, bMovieChance: 0.1 },
        2001: { digitalDawnChance: 0.8, bMovieChance: 0.1 },
        2002: { digitalDawnChance: 0.8, bMovieChance: 0.1 },
        2003: { digitalDawnChance: 0.8, bMovieChance: 0.1 },
        2004: { digitalDawnChance: 0.75, convergenceChance: 0.1, bMovieChance: 0.1 },
        // CONVERGENCE (2005-2010)
        2005: { convergenceChance: 0.5, digitalDawnChance: 0.3, bMovieChance: 0.1 },
        2006: { convergenceChance: 0.6, bMovieChance: 0.1 },
        2007: { convergenceChance: 0.7, bMovieChance: 0.1 },
        2008: { convergenceChance: 0.8, bMovieChance: 0.1 },
        2009: { convergenceChance: 0.8, bMovieChance: 0.1 },
        2010: { convergenceChance: 0.85, bMovieChance: 0.1 }
    };

    /**
     * Generate initial script selection for game start
     */
    function generateInitialScripts() {
        const scripts = [];

        // Always include a mix of budgets and genres for 1933
        scripts.push(selectScriptByType('preCode', 'low_budget'));
        scripts.push(selectScriptByType('preCode', 'medium_budget'));
        scripts.push(selectScriptByType('bMovies', 'b_movie'));
        scripts.push(selectScriptByType('preCode', 'high_risk'));
        scripts.push(selectScriptByType('goldenAge', 'safe_bet'));

        return scripts.map(addScriptMetadata);
    }

    /**
     * Generate new scripts monthly based on current year and industry conditions
     */
    function generateMonthlyScripts(gameState) {
        const year = gameState.gameYear;
        const params = getEraParameters(year);
        const scripts = [];

        // Generate 2-4 new scripts per month
        const scriptCount = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < scriptCount; i++) {
            const script = generateScriptForYear(year, params, gameState);
            if (script) {
                scripts.push(addScriptMetadata(script));
            }
        }

        return scripts;
    }

    /**
     * Generate a script appropriate for the current year
     */
    function generateScriptForYear(year, params, gameState) {
        const availableCategories = [];

        // Era-specific category chances (checked in order)
        var categoryChecks = [
            { key: 'preCode', chance: params.preCodeChance, minYear: 0, maxYear: 1934 },
            { key: 'goldenAge', chance: params.goldenAgeChance, minYear: 1935, maxYear: 1941 },
            { key: 'warYears', chance: params.warYearsChance, minYear: 1941, maxYear: 1945 },
            { key: 'postWar', chance: params.postWarChance, minYear: 1946, maxYear: 1959 },
            { key: 'tvThreat', chance: params.tvThreatChance, minYear: 1950, maxYear: 1959 },
            { key: 'newWave', chance: params.newWaveChance, minYear: 1960, maxYear: 1966 },
            { key: 'ratingsEra', chance: params.ratingsEraChance, minYear: 1967, maxYear: 1972 },
            { key: 'newHollywood', chance: params.newHollywoodChance, minYear: 1973, maxYear: 1979 },
            { key: 'blockbusterAge', chance: params.blockbusterAgeChance, minYear: 1980, maxYear: 1989 },
            { key: 'indieBoom', chance: params.indieBoomChance, minYear: 1990, maxYear: 1996 },
            { key: 'digitalDawn', chance: params.digitalDawnChance, minYear: 1997, maxYear: 2004 },
            { key: 'convergence', chance: params.convergenceChance, minYear: 2005, maxYear: 2010 }
        ];

        for (var i = 0; i < categoryChecks.length; i++) {
            var check = categoryChecks[i];
            if (check.chance && year >= check.minYear && year <= check.maxYear && Math.random() < check.chance) {
                if (SCRIPT_DATABASE[check.key] && SCRIPT_DATABASE[check.key].length > 0) {
                    availableCategories.push(check.key);
                }
            }
        }

        // B-movies available throughout
        if (Math.random() < (params.bMovieChance || 0)) {
            availableCategories.push('bMovies');
        }

        // Default: find the best matching category for the year
        if (availableCategories.length === 0) {
            var eraKey = null;
            if (window.GameConstants && window.GameConstants.getEraKeyForYear) {
                eraKey = window.GameConstants.getEraKeyForYear(year);
            }
            // Map era keys to script category names
            var eraToCategory = {
                PRE_CODE: 'preCode', GOLDEN_AGE: 'goldenAge', WAR_YEARS: 'warYears',
                POST_WAR: 'postWar', TV_THREAT: 'tvThreat', NEW_WAVE: 'newWave',
                RATINGS_ERA: 'ratingsEra', NEW_HOLLYWOOD: 'newHollywood',
                BLOCKBUSTER_AGE: 'blockbusterAge', INDIE_BOOM: 'indieBoom',
                DIGITAL_DAWN: 'digitalDawn', CONVERGENCE: 'convergence'
            };
            var fallbackCat = eraToCategory[eraKey] || 'goldenAge';
            if (SCRIPT_DATABASE[fallbackCat] && SCRIPT_DATABASE[fallbackCat].length > 0) {
                availableCategories.push(fallbackCat);
            } else {
                availableCategories.push('goldenAge');
            }
        }

        // Select category and script
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const scripts = SCRIPT_DATABASE[category];

        if (!scripts || scripts.length === 0) return null;

        // Filter by year appropriateness (wider range for newer eras with fewer templates)
        var yearRange = year >= 1950 ? 5 : 2;
        const appropriateScripts = scripts.filter(script =>
            Math.abs(script.year - year) <= yearRange
        );

        const selectedScripts = appropriateScripts.length > 0 ? appropriateScripts : scripts;
        const baseScript = selectedScripts[Math.floor(Math.random() * selectedScripts.length)];

        // Create variation of base script
        return createScriptVariation(baseScript, year, gameState);
    }

    /**
     * Create a variation of an existing script
     */
    function createScriptVariation(baseScript, currentYear, gameState) {
        const variation = { ...baseScript };

        // Adjust for current year
        variation.year = currentYear;

        // Budget variations (+/- 20%)
        const budgetVariation = 0.8 + (Math.random() * 0.4);
        variation.budget = Math.floor(baseScript.budget * budgetVariation);

        // Quality variations (+/- 15 points)
        const qualityVariation = -15 + (Math.random() * 30);
        variation.quality = Math.max(30, Math.min(95, baseScript.quality + qualityVariation));

        // Adjust censor risk based on current era
        variation.censorRisk = adjustCensorRiskForEra(baseScript.censorRisk, currentYear);

        return variation;
    }

    /**
     * Adjust censor risk based on current era
     */
    function adjustCensorRiskForEra(baseCensorRisk, year) {
        // Use centralized era adjustments from constants if available
        if (window.GameConstants && window.GameConstants.CENSORSHIP && window.GameConstants.getEraKeyForYear) {
            var eraKey = window.GameConstants.getEraKeyForYear(year);
            var adj = window.GameConstants.CENSORSHIP.ERA_ADJUSTMENTS[eraKey];
            if (adj !== undefined) {
                return Math.max(5, Math.min(95, baseCensorRisk + adj));
            }
        }

        // Fallback for when constants not available
        if (year <= 1934) return Math.max(5, baseCensorRisk - 20);
        if (year <= 1941) return Math.min(95, baseCensorRisk + 15);
        if (year <= 1945) return baseCensorRisk;
        if (year <= 1949) return Math.max(5, baseCensorRisk - 5);
        if (year <= 1959) return Math.max(5, baseCensorRisk - 5);
        if (year <= 1966) return Math.max(5, baseCensorRisk - 15);
        if (year <= 1972) return Math.max(5, baseCensorRisk - 30);
        if (year <= 1979) return Math.max(5, baseCensorRisk - 35);
        if (year <= 1989) return Math.max(5, baseCensorRisk - 25);
        if (year <= 1996) return Math.max(5, baseCensorRisk - 30);
        if (year <= 2004) return Math.max(5, baseCensorRisk - 25);
        return Math.max(5, baseCensorRisk - 20);
    }

    /**
     * Add metadata to script for game use
     */
    function addScriptMetadata(script) {
        return {
            ...script,
            id: generateScriptId(),
            available: true,
            optioned: false,
            optionDate: null,
            optionExpiry: null,
            recommendedBudget: calculateRecommendedBudget(script),
            profitProjection: calculateProfitProjection(script),
            riskAssessment: assessRisk(script),
            marketAppeal: assessMarketAppeal(script)
        };
    }

    /**
     * Calculate recommended production budget
     */
    function calculateRecommendedBudget(script) {
        let budget = script.budget;

        // Adjust for special requirements
        if (script.specialRequirements) {
            script.specialRequirements.forEach(req => {
                switch (req) {
                    case 'technicolor':
                        budget *= 1.5;
                        break;
                    case 'elaborate_sets':
                        budget *= 1.3;
                        break;
                    case 'animal_handlers':
                    case 'stunt_coordinators':
                        budget *= 1.2;
                        break;
                }
            });
        }

        // Adjust for cast requirements
        const totalCast = Object.values(script.castRequirements).reduce((sum, count) =>
            sum + (typeof count === 'number' ? count : 0), 0
        );

        if (totalCast > 10) {
            budget *= 1.1;
        }

        return Math.floor(budget);
    }

    /**
     * Calculate profit projection
     */
    function calculateProfitProjection(script) {
        const budget = script.budget;
        let projection = budget * 1.3;

        // Quality bonus
        if (script.quality > 80) {
            projection *= 1.5;
        } else if (script.quality > 70) {
            projection *= 1.2;
        }

        // Genre popularity
        const genreMultipliers = {
            musical: 1.4,
            comedy: 1.3,
            western: 1.2,
            romance: 1.2,
            drama: 1.1,
            adventure: 1.1,
            gangster: 1.0,
            war: 1.3,
            noir: 1.0,
            horror: 0.9,
            mystery: 1.0,
            biography: 1.1
        };

        projection *= (genreMultipliers[script.genre] || 1.0);

        // Censor risk penalty
        if (script.censorRisk > 70) {
            projection *= 0.8;
        } else if (script.censorRisk > 50) {
            projection *= 0.9;
        }

        return Math.floor(projection);
    }

    /**
     * Assess production risk
     */
    function assessRisk(script) {
        let riskScore = 0;

        // Budget risk
        if (script.budget > 150000) riskScore += 30;
        else if (script.budget > 100000) riskScore += 20;
        else if (script.budget > 50000) riskScore += 10;

        // Censor risk
        riskScore += Math.floor(script.censorRisk / 3);

        // Special requirements risk
        if (script.specialRequirements) {
            riskScore += script.specialRequirements.length * 5;
        }

        // Shooting complexity
        if (script.shootingDays > 30) riskScore += 15;
        else if (script.shootingDays > 20) riskScore += 10;

        // Quality uncertainty
        if (script.quality < 60) riskScore += 20;
        else if (script.quality < 70) riskScore += 10;

        if (riskScore <= 20) return 'LOW';
        if (riskScore <= 40) return 'MEDIUM';
        if (riskScore <= 60) return 'HIGH';
        return 'EXTREME';
    }

    /**
     * Assess market appeal
     */
    function assessMarketAppeal(script) {
        let appealScore = script.quality;

        // Genre appeal
        const currentGenreHeat = getGenreHeat(script.genre, script.year);
        appealScore += (currentGenreHeat - 100) / 2;

        // Censor risk penalty
        appealScore -= script.censorRisk / 4;

        // Special bonuses
        if (script.governmentSupport) appealScore += 10;
        if (script.budgetCategory === 'B-movie') appealScore -= 15;

        if (appealScore >= 80) return 'EXCELLENT';
        if (appealScore >= 70) return 'GOOD';
        if (appealScore >= 60) return 'FAIR';
        return 'POOR';
    }

    /**
     * Show script selection interface
     */
    function showScriptSelection(gameState) {
        const availableScripts = gameState.availableScripts.filter(script =>
            script.available && !script.optioned
        );

        if (availableScripts.length === 0) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.showModal(`
                    <h2>No Scripts Available</h2>
                    <p>No new scripts are available this month. Try advancing time to get new submissions.</p>
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn primary">Close</button>
                `);
            }
            return;
        }

        let modalContent = `
            <div class="script-library">
                <h2>Available Scripts - ${window.TimeSystem ? window.TimeSystem.formatDate(gameState.currentDate) : gameState.gameYear}</h2>
                <p class="library-subtitle">Select a script to greenlight for production</p>

                <div class="scripts-grid">
                    ${availableScripts.slice(0, 6).map(script => createScriptCard(script, gameState)).join('')}
                </div>

                <div class="library-footer">
                    <button onclick="HollywoodMogul.closeModal()" class="action-btn secondary">Cancel</button>
                </div>
            </div>
        `;

        if (window.HollywoodMogul) {
            window.HollywoodMogul.showModal(modalContent);
        }
    }

    /**
     * Create script card HTML
     */
    function createScriptCard(script, gameState) {
        const canAfford = gameState.cash >= script.recommendedBudget;
        const riskColor = {
            'LOW': 'success',
            'MEDIUM': 'warning',
            'HIGH': 'danger',
            'EXTREME': 'danger'
        };

        return `
            <div class="script-card ${canAfford ? '' : 'unaffordable'}">
                <div class="script-header">
                    <h3 class="script-title">${script.title}</h3>
                    <div class="script-genre">${script.genre.toUpperCase()}</div>
                </div>

                <div class="script-details">
                    <p class="script-description">${script.description}</p>

                    <div class="script-stats">
                        <div class="stat-row">
                            <span class="stat-label">Budget:</span>
                            <span class="stat-value">$${script.recommendedBudget.toLocaleString()}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Quality:</span>
                            <span class="stat-value">${script.quality}/100</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Shooting Days:</span>
                            <span class="stat-value">${script.shootingDays} days</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Censor Risk:</span>
                            <span class="stat-value risk-${script.censorRisk > 70 ? 'high' : script.censorRisk > 40 ? 'medium' : 'low'}">
                                ${script.censorRisk}%
                            </span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Risk Level:</span>
                            <span class="stat-value text-${riskColor[script.riskAssessment]}">${script.riskAssessment}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Market Appeal:</span>
                            <span class="stat-value">${script.marketAppeal}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Projected Revenue:</span>
                            <span class="stat-value">$${script.profitProjection.toLocaleString()}</span>
                        </div>
                    </div>

                    ${script.riskWarning ? `
                        <div class="risk-warning">
                            ⚠️ ${script.riskWarning}
                        </div>
                    ` : ''}

                    ${script.historicalNotes ? `
                        <div class="historical-notes">
                            📚 ${script.historicalNotes}
                        </div>
                    ` : ''}
                </div>

                <div class="script-actions">
                    <button onclick="ScriptLibrary.greenlightScript('${script.id}')"
                            class="action-btn ${canAfford ? 'primary' : 'disabled'}"
                            ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'GREENLIGHT' : 'INSUFFICIENT FUNDS'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Greenlight a script for production
     */
    function greenlightScript(scriptId) {
        const gameState = window.HollywoodMogul ? window.HollywoodMogul.getGameState() : null;
        if (!gameState) return;

        const script = gameState.availableScripts.find(s => s.id === scriptId);
        if (!script) return;

        // Check if can afford
        if (gameState.cash < script.recommendedBudget) {
            if (window.HollywoodMogul) {
                window.HollywoodMogul.addAlert({
                    type: 'warning',
                    icon: '💸',
                    message: `Cannot afford "${script.title}" - need $${script.recommendedBudget.toLocaleString()}`,
                    priority: 'high'
                });
            }
            return;
        }

        // Start production
        if (window.ProductionSystem) {
            window.ProductionSystem.startProduction(script, gameState);

            // Remove from available scripts
            script.available = false;
            script.optioned = true;
            script.optionDate = new Date(gameState.currentDate);
        }

        if (window.HollywoodMogul) {
            window.HollywoodMogul.closeModal();
        }

        console.log(`Greenlit "${script.title}" for production`);
    }

    /**
     * Helper functions
     */

    function getEraParameters(year) {
        return ERA_PARAMETERS[year] || {
            goldenAgeChance: 0.6,
            bMovieChance: 0.3
        };
    }

    function selectScriptByType(category, type) {
        const scripts = SCRIPT_DATABASE[category] || [];

        if (type === 'low_budget') {
            return scripts.find(s => s.budget < 75000) || scripts[0];
        }
        if (type === 'medium_budget') {
            return scripts.find(s => s.budget >= 75000 && s.budget < 150000) || scripts[0];
        }
        if (type === 'high_budget') {
            return scripts.find(s => s.budget >= 150000) || scripts[0];
        }
        if (type === 'high_risk') {
            return scripts.find(s => s.censorRisk > 70) || scripts[0];
        }
        if (type === 'safe_bet') {
            return scripts.find(s => s.censorRisk < 30) || scripts[0];
        }
        if (type === 'b_movie') {
            return scripts[Math.floor(Math.random() * scripts.length)];
        }

        return scripts[0];
    }

    function getGenreHeat(genre, year) {
        if (window.TimeSystem) {
            const modifiers = window.TimeSystem.getEraGenreModifiers(year);
            return (modifiers[genre] || 1.0) * 100;
        }
        return 100;
    }

    function generateScriptId() {
        return 'script_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    /**
     * Public API
     */
    return {
        generateInitialScripts,
        generateMonthlyScripts,
        showScriptSelection,
        greenlightScript,

        // For external systems
        getScriptDatabase: () => SCRIPT_DATABASE,
        getEraParameters: (year) => getEraParameters(year)
    };
})();
