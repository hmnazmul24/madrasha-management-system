import imageCompression from "browser-image-compression";
const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 250,
  useWebWorker: true,
};
export const getBase64String = async (file: File | null): Promise<string> => {
  if (file) {
    const compressedFile = await imageCompression(file, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target!.result as string);
      };

      reader.onerror = () => {
        reject("");
      };

      reader.readAsDataURL(compressedFile);
    });
  } else {
    return "";
  }
};
