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



