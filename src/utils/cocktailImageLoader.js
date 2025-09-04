const cocktailImageModules = import.meta.glob('../assets/cocktails/*.(png|jpg|jpeg|gif|svg)', { eager: true, as: 'url' });
const categoryImageModules = import.meta.glob('../assets/categories/*.(png|jpg|jpeg|gif|svg)', { eager: true, as: 'url' });

const allImageModules = { ...cocktailImageModules, ...categoryImageModules };

const images = {};
for (const pathInAssets in allImageModules) {
  const url = allImageModules[pathInAssets];
  const fileName = pathInAssets.substring(pathInAssets.lastIndexOf('/') + 1);
  images[fileName] = url;
}

export const getImageUrl = (imagePathFromJson) => {
  if (!imagePathFromJson || typeof imagePathFromJson !== 'string') {
    return images['placeholder.jpg'] || 'default_placeholder_image.png'; 
  }
  const fileName = imagePathFromJson.substring(imagePathFromJson.lastIndexOf('/') + 1);
  return images[fileName] || images['placeholder.jpg'] || 'specific_image_not_found_placeholder.png';
};

export default images;
