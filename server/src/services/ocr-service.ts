import Tesseract from "tesseract.js";

export class OCRService {
  public async performOCR(
    filePath: string
  ): Promise<{ text: string; confidence: number }> {
    try {
      const result = await Tesseract.recognize(filePath, "eng", {
        logger: (m) => console.log(m),
      });

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
