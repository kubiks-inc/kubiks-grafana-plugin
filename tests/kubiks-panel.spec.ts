import { test, expect } from '@grafana/plugin-e2e';

test.describe('Kubiks Panel Plugin', () => {
    test('should render panel in panel edit page', async ({ panelEditPage }) => {
        // Set the panel visualization to our Kubiks panel
        await panelEditPage.setVisualization('kubiks-kubiks-panel');

        // Wait for the panel to load
        await panelEditPage.panel.locator.waitFor();

        // Check that the panel is visible
        await expect(panelEditPage.panel.locator).toBeVisible();

        // Check for the main heading from our App component
        const heading = panelEditPage.panel.locator.getByRole('heading', { name: 'Kubiks Plugin' });
        await expect(heading).toBeVisible();

        // Check for the description text
        const description = panelEditPage.panel.locator.getByText('This is the main app component for the Kubiks plugin.');
        await expect(description).toBeVisible();
    });

    test('should be able to set panel configuration', async ({ panelEditPage }) => {
        // Set the panel visualization to our Kubiks panel
        await panelEditPage.setVisualization('kubiks-kubiks-panel');

        // Set a custom title
        await panelEditPage.setPanelTitle('My Kubiks Service Map');

        // Verify the panel renders with the updated configuration
        await expect(panelEditPage.panel.locator).toBeVisible();

        // Check that the panel still contains our plugin content
        await expect(panelEditPage.panel.locator).toContainText('Kubiks Plugin');
    });

    test('should display plugin content correctly', async ({ panelEditPage }) => {
        // Set the panel visualization to our Kubiks panel
        await panelEditPage.setVisualization('kubiks-kubiks-panel');

        // Wait for the panel to render
        await panelEditPage.panel.locator.waitFor();

        // Check that our basic content is displayed
        await expect(panelEditPage.panel.locator).toContainText('Kubiks Plugin');
        await expect(panelEditPage.panel.locator).toContainText('This is the main app component for the Kubiks plugin.');
    });
}); 