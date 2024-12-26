// Simplified development storage using localStorage
export async function mockUploadImage(file: Blob): Promise<{ url: string; success: boolean; error?: string }> {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    const base64Url = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Store in localStorage with timestamp key
    const key = `img_${Date.now()}`;
    localStorage.setItem(key, base64Url);

    return {
      url: base64Url,
      success: true
    };
  } catch (error) {
    console.error('Development storage error:', error);
    return {
      url: '',
      success: false,
      error: 'Failed to store image'
    };
  }
}