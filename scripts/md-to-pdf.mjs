import { chromium } from '@playwright/test';
import { marked } from 'marked';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const inputFile = process.argv[2];
const outputFile = process.argv[3];

const markdown = readFileSync(inputFile, 'utf-8');
const body = marked.parse(markdown);

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 20mm 18mm 20mm 18mm; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 100%;
    }
    h1 {
      font-size: 18pt;
      color: #1a237e;
      border-bottom: 2px solid #1a237e;
      padding-bottom: 6px;
      margin-top: 24px;
    }
    h2 {
      font-size: 14pt;
      color: #283593;
      border-bottom: 1px solid #c5cae9;
      padding-bottom: 4px;
      margin-top: 20px;
    }
    h3 {
      font-size: 12pt;
      color: #3949ab;
      margin-top: 16px;
    }
    h4 {
      font-size: 11pt;
      color: #1565c0;
      margin-top: 12px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0;
      font-size: 10pt;
    }
    th {
      background-color: #1a237e;
      color: white;
      padding: 7px 10px;
      text-align: left;
    }
    td {
      padding: 6px 10px;
      border: 1px solid #c5cae9;
    }
    tr:nth-child(even) td { background-color: #e8eaf6; }
    blockquote {
      background: #e3f2fd;
      border-left: 4px solid #1565c0;
      margin: 10px 0;
      padding: 8px 14px;
      font-style: italic;
      color: #333;
    }
    code {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 2px 5px;
      font-family: 'Consolas', monospace;
      font-size: 10pt;
      white-space: pre-wrap;
    }
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px 14px;
      font-family: 'Consolas', monospace;
      font-size: 10pt;
      white-space: pre-wrap;
    }
    hr {
      border: none;
      border-top: 1px solid #c5cae9;
      margin: 16px 0;
    }
    strong { color: #1a237e; }
    ul, ol { padding-left: 22px; }
    li { margin-bottom: 3px; }
    p { margin: 8px 0; }
  </style>
</head>
<body>${body}</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({
  path: outputFile,
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' }
});
await browser.close();
console.log('PDF generado: ' + outputFile);
