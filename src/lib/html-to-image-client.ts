import { toPng } from "html-to-image"

type DownloadProps = {
  element: HTMLElement | null
  fileName: string
}

export async function downloadNodeAsPng(props: DownloadProps): Promise<void> {
  if (!props.element) {
    throw new Error("保存するカードが見つかりません。")
  }
  const dataUrl = await toPng(props.element, {
    cacheBust: true,
    pixelRatio: 2,
  })
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = `${props.fileName}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
