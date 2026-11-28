import { expect, test } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'rejected');
  });
});

async function createImageBuffer(page: import('@playwright/test').Page, type: 'image/png' | 'image/jpeg') {
  const dataUrl = await page.evaluate((mimeType) => {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable');
    context.fillStyle = '#2563eb';
    context.fillRect(0, 0, 8, 8);
    return canvas.toDataURL(mimeType);
  }, type);

  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function createPdfBuffer(pageLabel: string) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([300, 300]);
  page.drawText(pageLabel, { x: 30, y: 250 });
  return Buffer.from(await pdf.save());
}

test('image upload converts a PNG into a Base64 data URL', async ({ page }) => {
  await page.goto('/tool/image-to-base64');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'smoke-image.png',
    mimeType: 'image/png',
    buffer: await createImageBuffer(page, 'image/png'),
  });

  await expect(page.getByText('smoke-image.png')).toBeVisible();
  const output = page.locator('textarea[readonly]');
  await expect(output).toHaveValue(/^data:image\/png;base64,/);
});

test('JPG upload converts to a downloadable PDF', async ({ page }) => {
  await page.goto('/tool/jpg-to-pdf');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'smoke-image.jpg',
    mimeType: 'image/jpeg',
    buffer: await createImageBuffer(page, 'image/jpeg'),
  });

  await expect(page.getByText('Selected Images (1)')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert to PDF' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('converted-images.pdf');
  const filePath = await download.path();
  expect(filePath).not.toBeNull();
  const pdfBytes = await import('node:fs/promises').then(({ readFile }) => readFile(filePath!));
  expect(pdfBytes.subarray(0, 5).toString()).toBe('%PDF-');
});

test('two PDFs merge into a valid two-page PDF', async ({ page }) => {
  await page.goto('/tool/merge-pdf');
  await page.locator('input[type="file"]').first().setInputFiles([
    { name: 'first.pdf', mimeType: 'application/pdf', buffer: await createPdfBuffer('First page') },
    { name: 'second.pdf', mimeType: 'application/pdf', buffer: await createPdfBuffer('Second page') },
  ]);

  await expect(page.getByText('first.pdf')).toBeVisible();
  await expect(page.getByText('second.pdf')).toBeVisible();
  await page.getByRole('button', { name: 'Process Now' }).click();
  await expect(page.getByText('Successfully Processed!')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Result' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('merged_photosize.pdf');
  const filePath = await download.path();
  expect(filePath).not.toBeNull();
  const bytes = await import('node:fs/promises').then(({ readFile }) => readFile(filePath!));
  const merged = await PDFDocument.load(bytes);
  expect(merged.getPageCount()).toBe(2);
});

test('QR code exports a PNG download', async ({ page }) => {
  await page.goto('/tool/qr-generator');
  await page.getByLabel('QR code URL or text').fill('https://example.com/photosize-smoke');
  await expect(page.locator('svg')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('photosize-qr.png');
  const filePath = await download.path();
  expect(filePath).not.toBeNull();
  const pngBytes = await import('node:fs/promises').then(({ readFile }) => readFile(filePath!));
  expect(pngBytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
});
