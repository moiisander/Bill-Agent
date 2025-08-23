import sharp from "sharp";
import Tesseract from "tesseract.js";

export class OCRService {
    public async performOCR(
        filePath: string
    ): Promise<{ text: string; confidence: number }> {
        try {
            const preprocessedBuffer = await sharp(filePath)
                .grayscale()
                .resize({ width: 1000 })
                .threshold(128)
                .toBuffer();

            const result = await Tesseract.recognize(preprocessedBuffer, "eng");

            return {
                text: result.data.text,
                confidence: result.data.confidence || 0,
            };
        } catch (error) {
            console.error("OCR Error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown OCR error";
            throw new Error(`OCR processing failed: ${errorMessage}`);
        }
    }
}
