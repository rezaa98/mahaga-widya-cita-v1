const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            headless: true
        });

        const docsDir = path.join(__dirname, '../docs');
        const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
            const mdPath = path.join(docsDir, file);
            const pdfPath = path.join(docsDir, file.replace('.md', '.pdf'));
            console.log(`Converting ${mdPath} to ${pdfPath}`);
            
            const mdContent = fs.readFileSync(mdPath, 'utf8');
            const htmlContent = marked.parse(mdContent);
            
            const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1, h2, h3 { color: #1E6FD9; }
                    code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; }
                    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
            `;

            const page = await browser.newPage();
            await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
            await page.pdf({ 
                path: pdfPath, 
                format: 'A4',
                printBackground: true,
                margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
            });
            await page.close();
            console.log(`Done converting ${file}`);
        }

        await browser.close();
        console.log("All conversions complete!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
