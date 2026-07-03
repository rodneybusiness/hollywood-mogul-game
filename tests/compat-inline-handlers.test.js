/**
 * Inline-handler compatibility shim: under a CSP with script-src-attr 'none'
 * the browser never compiles onclick attributes into element handlers, so the
 * delegated dispatcher must invoke the referenced Namespace.method itself —
 * the scenario-selection stuck screen. Jest's jsdom DOES compile attributes,
 * so each test simulates the blocked host by nulling the compiled handler.
 */

describe('InlineHandlerCompat', () => {
    beforeAll(() => {
        require('../js/core/compat-inline-handlers.js');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete window.ScenarioSystem;
        delete window.HelpSystem;
    });

    // Render markup, then strip the jsdom-compiled handlers the way a
    // script-src-attr 'none' CSP would (they never compile at all).
    function renderBlocked(html) {
        document.body.innerHTML = html;
        document.body.querySelectorAll('[onclick]').forEach(el => { el.onclick = null; });
        document.body.querySelectorAll('[oninput]').forEach(el => { el.oninput = null; });
    }

    function clickOn(el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    test('dispatches Namespace.method with a string literal', () => {
        window.ScenarioSystem = { selectScenario: jest.fn() };
        renderBlocked('<button onclick="ScenarioSystem.selectScenario(\'poverty_row\')">GO</button>');
        clickOn(document.querySelector('button'));
        expect(window.ScenarioSystem.selectScenario).toHaveBeenCalledWith('poverty_row');
    });

    test('handles multiple args and clicks on nested children', () => {
        window.ScenarioSystem = { sign: jest.fn() };
        renderBlocked('<button onclick="ScenarioSystem.sign(\'talent_1\', \'star\', 3)"><span>SIGN</span></button>');
        clickOn(document.querySelector('span'));
        expect(window.ScenarioSystem.sign).toHaveBeenCalledWith('talent_1', 'star', 3);
    });

    test('does not double-fire when the attribute compiled natively', () => {
        window.ScenarioSystem = { selectScenario: jest.fn() };
        document.body.innerHTML =
            '<button onclick="ScenarioSystem.selectScenario(\'classic_start\')">GO</button>';
        clickOn(document.querySelector('button')); // native jsdom handler fires
        expect(window.ScenarioSystem.selectScenario).toHaveBeenCalledTimes(1);
    });

    test('oninput passes this.value from the element', () => {
        window.HelpSystem = { handleSearch: jest.fn() };
        renderBlocked('<input oninput="HelpSystem.handleSearch(this.value)">');
        const input = document.querySelector('input');
        input.value = 'hays code';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(window.HelpSystem.handleSearch).toHaveBeenCalledWith('hays code');
    });

    test('refuses to dispatch unrecognized argument shapes', () => {
        window.ScenarioSystem = { selectScenario: jest.fn() };
        renderBlocked('<button onclick="ScenarioSystem.selectScenario(window.location.href)">X</button>');
        clickOn(document.querySelector('button'));
        expect(window.ScenarioSystem.selectScenario).not.toHaveBeenCalled();
    });

    test('every inline handler shape shipped in the game parses and dispatches', () => {
        // Shapes lifted from the actual codebase (grep onclick=/oninput=)
        const samples = [
            "CensorshipSystem.selectRating('script_1', 'pg')",
            "CrisisSystem.handleCrisisChoice('crisis_9', 2)",
            "DashboardUI.signTalent('t_1', 'director', 1)",
            "EventSystem.selectChoice(0)",
            "FinancialSystem.makeInvestment('theaterChain')",
            "HollywoodMogul.closeModal()",
            "ScenarioSystem.selectScenario('classic_start')",
            "TutorialSystem.nextStep()",
            "Integration.completeIntegrationGreenlight()",
            "FinancialSystem.updateLoanPreview()"
        ];
        for (const code of samples) {
            const ns = code.split('.')[0];
            const method = code.split('.')[1].split('(')[0];
            window[ns] = { [method]: jest.fn() };
            renderBlocked(`<button onclick="${code}">X</button>`);
            clickOn(document.querySelector('button'));
            expect(window[ns][method]).toHaveBeenCalled();
            delete window[ns];
        }
    });
});
