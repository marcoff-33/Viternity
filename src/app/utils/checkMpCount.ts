import { promises } from "dns";

export function calculateMegapixels(file: File): Promise<number> {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve) => {
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result as string;

      img.onload = () => {
        const megapixels = (img.width * img.height) / (1024 * 1024);
        resolve(megapixels);
      };
    };
  });
}
