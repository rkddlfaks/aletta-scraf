/**
 * Compresses an image file (JPG/PNG) to WebP format using HTML5 Canvas.
 * It resizes the image proportionally if it exceeds the maximum dimension.
 * 
 * @param file The original image File object
 * @param maxDimension The maximum width or height in pixels (default 1500)
 * @param quality WebP compression quality from 0 to 1 (default 0.8)
 * @returns A Promise resolving to a new File object in WebP format
 */
export async function compressImageToWebp(
  file: File, 
  maxDimension: number = 1500, 
  quality: number = 0.8
): Promise<File> {
  // Hanya proses jika file adalah gambar
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Kalkulasi aspek rasio jika melebihi dimensi maksimal
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        // Draw the image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            
            // Create a new filename with .webp extension
            const originalName = file.name;
            const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            const newFilename = `${nameWithoutExtension}.webp`;
            
            // Return as File object
            const webpFile = new File([blob], newFilename, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            
            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
}
