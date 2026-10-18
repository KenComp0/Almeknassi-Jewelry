const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_ALBUM_ID = import.meta.env.VITE_IMGBB_ALBUM_ID;
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

if (!IMGBB_API_KEY || !IMGBB_ALBUM_ID) {
  console.warn("ImgBB env vars missing: VITE_IMGBB_API_KEY, VITE_IMGBB_ALBUM_ID");
}

function fileToWebP(file, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("WebP conversion failed"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadImagesToImgBB(files) {
  if (!IMGBB_API_KEY || !IMGBB_ALBUM_ID) {
    throw new Error("ImgBB configuration missing");
  }
  const urls = [];
  for (const file of files) {
    const webpBlob = await fileToWebP(file);
    const base64 = await blobToBase64(webpBlob);

    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64);
    formData.append("album", IMGBB_ALBUM_ID);

    const res = await fetch(IMGBB_UPLOAD_URL, { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }
    urls.push(data.data.url);
  }
  return urls;
}

export async function deleteImageFromImgBB(deleteUrl) {
  if (!deleteUrl) return;
  try {
    await fetch(deleteUrl, { method: "GET" });
  } catch {
    // ignore
  }
}