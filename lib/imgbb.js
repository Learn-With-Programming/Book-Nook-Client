export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) {
    throw new Error(
      "Image upload is not configured yet — set NEXT_PUBLIC_IMGBB_KEY in .env.",
    );
  }
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.data?.display_url) {
    throw new Error(data?.error?.message || "Image upload failed. Please try again.");
  }
  return data.data.display_url;
}
