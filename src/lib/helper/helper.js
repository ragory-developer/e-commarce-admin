// slugify function
export const slugify = (text) => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Replace spaces with -
    .replace(/[^\w\-]+/g, "")    // Remove special characters
    .replace(/\-\-+/g, "-");     // Replace multiple - with single -
};




// convert uuid to number
export const uuidToNumber=(uuid) =>{
    // Remove all non-numeric characters and convert to number
    const numericString = uuid.replace(/\D/g, '');
    
    // Handle potential large numbers by using BigInt or limiting length
    if (numericString.length > 15) {
        // Take first 15 digits to avoid precision issues with JavaScript numbers
        return parseInt(numericString.slice(0, 15), 10);
    }
    
    return parseInt(numericString, 10) || 0;
}


