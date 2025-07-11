export function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s&]+/) // Split by spaces and ampersands
    .map((word, index) => {
      const cleanedWord = word.replace(/[^a-z0-9]/g, ""); // Remove non-alphanumeric characters
      if (index === 0) {
        return cleanedWord;
      }
      return cleanedWord.charAt(0).toUpperCase() + cleanedWord.slice(1);
    })
    .join("");
}
