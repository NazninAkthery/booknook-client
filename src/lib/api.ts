const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getToken() {
  const res = await fetch("/api/jwt");
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.token as string;
}

export async function apiGet(path: string, needAuth = false) {
  const headers: Record<string, string> = {};

  if (needAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    cache: "no-store",
  });

  return res;
}

export async function apiSend(
  path: string,
  method: string,
  body?: unknown,
  needAuth = true
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (needAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}

export async function uploadToImgbb(file: File) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error("Image upload failed");
  }

  return data.data.url as string;
}
