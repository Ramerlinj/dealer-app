export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD!}/image/upload`,
    {
      method: "POST",
      body: form
    }
  );

  return await res.json(); // este JSON es el que guardas en Supabase
}
