import html2canvas from "html2canvas";
import { MutableRefObject } from "react";

export async function generateScreenshot(
  keyboardRef: MutableRefObject<null>,
){
  if (!keyboardRef.current) {
    throw new Error("Keyboard component not found");
  }

  const canvas = await html2canvas(keyboardRef.current, {
    backgroundColor: null,
  });

  const image = canvas.toDataURL("image/png");
  return image
}

export async function blobToBase64(screenshot: Blob): Promise<string> {
  const reader = new FileReader()
  return new Promise((res, rej) => {
    reader.onloadend = () => {
      const result = reader.result as string
      res(result.split(",")[1])
    }
    reader.onerror = rej
    reader.readAsDataURL(screenshot)
  })
}