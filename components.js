/**
 * components.js — Click Genius shared component loader
 *
 * How to use in any HTML page:
 *
 *   1. Add placeholder divs in your <body>:
 *        <div id="header-placeholder"></div>
 *        <div id="footer-placeholder"></div>
 *
 *   2. Add this script before </body>:
 *        <script src="components.js"></script>
 *
 *   That's it. Header and footer are loaded automatically.
 */

(function () {
    /**
     * Fetches an HTML file and injects its content into a target element.
     * Also executes any <script> tags found inside the fetched HTML.
     */
    async function loadComponent(file, targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}: ${response.status}`);
            const html = await response.text();

            // Parse the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Grab all direct children of <body> (skips DOCTYPE, <html>, <head>)
            const bodyChildren = Array.from(doc.body.childNodes);
            bodyChildren.forEach(node => target.appendChild(document.importNode(node, true)));

            // Re-execute any <script> tags (browsers don't run scripts inserted via innerHTML/importNode)
            target.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr =>
                    newScript.setAttribute(attr.name, attr.value)
                );
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

        } catch (err) {
            console.warn(`[Click Genius] Could not load component "${file}":`, err.message);
        }
    }

    // Load both components once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        loadComponent('header.html', 'header-placeholder');
        loadComponent('footer.html', 'footer-placeholder');
    }
})();