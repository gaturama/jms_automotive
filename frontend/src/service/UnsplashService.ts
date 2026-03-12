import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: "MyhY-fmfW-radLQFZg8_LDKr6L_3cpXgBV2PfcQqusY",
});

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

/**
 * Fetch photos of a specific car
 */
export const searchCarImages = async (
  carName: string,
  count: number = 10,
): Promise<UnsplashImage[]> => {
  try {
    const result = await unsplash.search.getPhotos({
      query: carName,
      perPage: count,
      orientation: "landscape",
      orderBy: "relevant",
    });

    if (result.errors) {
      console.error("Unsplash API Error:", result.errors);
      return [];
    }

    return result.response.results.map((photo: any) => ({
      id: photo.id,
      urls: photo.urls,
      width: photo.width,
      height: photo.height,
      alt_description: photo.alt_description,
      user: {
        name: photo.user.name,
        username: photo.user.username,
      },
    }));
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
};

/**
 * Fetch photos of multiple cars
 */
export const fetchAllCarImages = async (cars: any[]) => {
  try {
    const promises = cars.map((car) =>
      searchCarImages(`${car.brand} ${car.model} ${car.year}`, 8),
    );

    const results = await Promise.all(promises);

    return cars.map((car, index) => ({
      ...car,
      unsplashImages: results[index],
    }));
  } catch (error) {
    console.error("Error fetching images for all cars:", error);
    return cars;
  }
};

/**
 * Optimized queries by brand
 */
export const getOptimizedQuery = (car: any): string => {
  const brandQueries: Record<string, string> = {
    Ferrari: `${car.model} ferrari red sports car`,
    Lamborghini: `${car.model} lamborghini supercar`,
    Porsche: `${car.model} porsche sports car`,
    'Mercedes-AMG': `${car.model} mercedes amg`,
    Audi: `${car.model} audi sports car`,
    BMW: `${car.model} bmw m series`,
    McLaren: `${car.model} mclaren supercar`,
    Bentley: `${car.model} bentley luxury car`,
    Koenigsegg: `${car.model} koenigsegg hypercar`,
  };

  return brandQueries[car.brand] || `${car.brand} ${car.model} ${car.year}`;
};

/**
 * Fetch with optimized query
 */
export const searchCarImagesOptimized = async (car: any): Promise<UnsplashImage[]> => {
  const query = getOptimizedQuery(car);
  return searchCarImages(query, 10);
};

/**
 * Image download (tracking for Unsplash)
 */
export const trackDownload = async (downloadUrl: string) => {
  try {
    await fetch(downloadUrl);
  } catch (error) {
    console.error('Error tracking download:', error);
  }
};

/**
 * Image cache
 */
const imageCache: Record<string, UnsplashImage[]> = {};

export const getCachedImages = async (carId: string, query: string): Promise<UnsplashImage[]> => {
  if (imageCache[carId]) {
    return imageCache[carId];
  }

  const images = await searchCarImages(query, 10);
  
  imageCache[carId] = images;
  
  return images;
};

/**
 * Clear cache
 */
export const clearImageCache = () => {
  Object.keys(imageCache).forEach(key => delete imageCache[key]);
};