/**
 * Azure AI Document Intelligence OCR Service
 *
 * Setup:
 * 1. Create Azure account and Document Intelligence resource
 * 2. Get endpoint and API key from Azure Portal
 * 3. Add to .env:
 *    REACT_APP_AZURE_OCR_ENDPOINT=https://xxx.cognitiveservices.azure.com/
 *    REACT_APP_AZURE_OCR_KEY=your_api_key
 *
 * Docs: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/
 */

const AZURE_OCR_ENDPOINT = process.env.REACT_APP_AZURE_OCR_ENDPOINT;
const AZURE_OCR_KEY = process.env.REACT_APP_AZURE_OCR_KEY;

/**
 * Parse receipt image using Azure Document Intelligence
 */
export async function parseReceiptWithOCR(imageUri) {
  if (!AZURE_OCR_ENDPOINT || !AZURE_OCR_KEY) {
    throw new Error('Azure OCR not configured. Set REACT_APP_AZURE_OCR_ENDPOINT and REACT_APP_AZURE_OCR_KEY in .env');
  }

  try {
    const response = await fetch(imageUri);
    if (!response.ok) throw new Error('Failed to fetch image: ' + response.status);
    const imageBlob = await response.blob();

    const ocrResponse = await fetch(
      AZURE_OCR_ENDPOINT + '/formrecognizer/v3.1/prebuilt/receipt/analyze?includeTextDetails=true',
      {
        method: 'POST',
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_OCR_KEY, 'Content-Type': 'application/octet-stream' },
        body: imageBlob,
      }
    );

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      throw new Error('Azure OCR failed: ' + ocrResponse.status);
    }

    const operationLocation = ocrResponse.headers.get('Operation-Location');
    if (!operationLocation) throw new Error('No operation location returned');

    let result = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const pollResponse = await fetch(operationLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_OCR_KEY }
      });
      if (!pollResponse.ok) continue;
      const pollResult = await pollResponse.json();
      if (pollResult.status === 'succeeded') { result = pollResult; break; }
      else if (pollResult.status === 'failed') throw new Error('Azure OCR processing failed');
    }

    if (!result) throw new Error('Azure OCR timeout');

    const receipt = result.analyzeResult?.documentResults?.[0]?.fields;
    return {
      store: receipt?.MerchantName?.content || 'Unknown Store',
      total: parseFloat(receipt?.Total?.content) || 0,
      date: receipt?.TransactionDate?.content || new Date().toISOString().split('T')[0],
      confidence: receipt?.Total?.confidence || 0,
    };
  } catch (err) {
    console.error('Azure OCR error:', err.message);
    throw err;
  }
}

export function calculatePoints(total) {
  return Math.floor(total / 10);
}