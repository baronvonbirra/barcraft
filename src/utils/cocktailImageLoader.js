const categoryImageModules = import.meta.glob('../assets/categories/*.(png|jpg|jpeg|gif|svg)', { eager: true, query: '?url', import: 'default' });

const images = {};
for (const pathInAssets in categoryImageModules) {
  const url = categoryImageModules[pathInAssets];
  const fileName = pathInAssets.substring(pathInAssets.lastIndexOf('/') + 1);
  images[fileName] = url;
}

export const getImageUrl = (imagePathFromJson) => {
  if (!imagePathFromJson || typeof imagePathFromJson !== 'string') {
    return 'default_placeholder_image.png';
  }
  const fileName = imagePathFromJson.substring(imagePathFromJson.lastIndexOf('/') + 1);
  return images[fileName] || 'specific_image_not_found_placeholder.png';
};

export default images;
