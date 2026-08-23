const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

module.exports = extractTextFromPDF;