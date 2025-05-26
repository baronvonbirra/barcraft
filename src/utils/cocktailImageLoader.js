// src/utils/cocktailImageLoader.js
const cocktailImageModules = import.meta.glob('../assets/cocktails/*.(png|jpg|jpeg|gif|svg)', { eager: true, as: 'url' });
const categoryImageModules = import.meta.glob('../assets/categories/*.(png|jpg|jpeg|gif|svg)', { eager: true, as: 'url' });

const allImageModules = { ...cocktailImageModules, ...categoryImageModules };

const images = {};
for (const pathInAssets in allImageModules) {
  const url = allImageModules[pathInAssets];
  // Extract the filename (e.g., 'mojito.jpg' or 'rum-category.png') from the path
  const fileName = pathInAssets.substring(pathInAssets.lastIndexOf('/') + 1);
  images[fileName] = url;
}

// Function to get an image URL by its original filename as stored in JSON files
// e.g., cocktail.image might be "src/assets/cocktails/mojito.jpg"
// we need to extract "mojito.jpg" and use that as the key.
export const getImageUrl = (imagePathFromJson) => {
  if (!imagePathFromJson || typeof imagePathFromJson !== 'string') {
    // Attempt to return a generic placeholder if available, otherwise a more noticeable missing image string
    return images['placeholder.png'] || 'default_placeholder_image.png'; 
  }
  const fileName = imagePathFromJson.substring(imagePathFromJson.lastIndexOf('/') + 1);
  // Fallback to a generic placeholder if specific image not found or if placeholder itself is missing
  return images[fileName] || images['placeholder.png'] || 'specific_image_not_found_placeholder.png';
};

export default images; // Optionally export the full map if needed elsewhere
