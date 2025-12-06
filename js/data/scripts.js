/**
 * HOLLYWOOD MOGUL - SCRIPT LIBRARY
 * Historically authentic film scripts spanning 1933-1949
 * 150+ unique scripts across all major Golden Age genres
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
        ]
    };

    // Script generation parameters by era
    const ERA_PARAMETERS = {
        1933: { preCodeChance: 0.7, bMovieChance: 0.4 },
        1934: { preCodeChance: 0.3, bMovieChance: 0.5 },
        1935: { goldenAgeChance: 0.6, bMovieChance: 0.4 },
        1936: { goldenAgeChance: 0.7, bMovieChance: 0.4 },
        1937: { goldenAgeChance: 0.75, bMovieChance: 0.4 },
        1938: { technicolorAvailable: true, goldenAgeChance: 0.8, bMovieChance: 0.35 },
        1939: { technicolorAvailable: true, goldenAgeChance: 0.85, bMovieChance: 0.35 },
        1940: { goldenAgeChance: 0.8, bMovieChance: 0.35 },
        1941: { goldenAgeChance: 0.5, warYearsChance: 0.3, bMovieChance: 0.35 },
        1942: { warYearsChance: 0.6, propagandaBonus: true, bMovieChance: 0.3 },
        1943: { warYearsChance: 0.8, propagandaBonus: true, bMovieChance: 0.3 },
        1944: { warYearsChance: 0.75, propagandaBonus: true, bMovieChance: 0.3 },
        1945: { warYearsChance: 0.6, postWarChance: 0.2, bMovieChance: 0.3 },
        1946: { postWarChance: 0.5, noirChance: 0.4, bMovieChance: 0.35 },
        1947: { postWarChance: 0.7, huacRisk: true, noirChance: 0.5, bMovieChance: 0.35 },
        1948: { postWarChance: 0.8, tvCompetition: true, noirChance: 0.4, bMovieChance: 0.4 },
        1949: { postWarChance: 0.9, industryChange: true, noirChance: 0.35, bMovieChance: 0.4 }
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

        // Determine available script categories based on year
        if (year <= 1934 && Math.random() < params.preCodeChance) {
            availableCategories.push('preCode');
        }

        if (year >= 1935 && year <= 1941 && Math.random() < params.goldenAgeChance) {
            availableCategories.push('goldenAge');
        }

        if (year >= 1941 && year <= 1945 && Math.random() < params.warYearsChance) {
            availableCategories.push('warYears');
        }

        if (year >= 1946 && Math.random() < params.postWarChance) {
            availableCategories.push('postWar');
        }

        // B-movies available throughout
        if (Math.random() < params.bMovieChance) {
            availableCategories.push('bMovies');
        }

        // Default to golden age if no category selected
        if (availableCategories.length === 0) {
            availableCategories.push('goldenAge');
        }

        // Select category and script
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const scripts = SCRIPT_DATABASE[category];

        if (!scripts || scripts.length === 0) return null;

        // Filter by year appropriateness
        const appropriateScripts = scripts.filter(script =>
            Math.abs(script.year - year) <= 2
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
        // Pre-Code era (1933-1934): Lower censorship
        if (year <= 1934) {
            return Math.max(5, baseCensorRisk - 20);
        }

        // Hays Code enforcement (1935-1941): Higher censorship
        if (year >= 1935 && year <= 1941) {
            return Math.min(95, baseCensorRisk + 15);
        }

        // War years (1942-1945): Moderate, patriotic content encouraged
        if (year >= 1942 && year <= 1945) {
            return baseCensorRisk;
        }

        // Post-war (1946-1949): Increasing social commentary, some relaxation
        if (year >= 1946) {
            return Math.max(5, baseCensorRisk - 5);
        }

        return baseCensorRisk;
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
