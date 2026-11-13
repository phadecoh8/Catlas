export function getWebGL2Context(
  canvas: HTMLCanvasElement,
): WebGL2RenderingContext | null {
  let context: WebGL2RenderingContext | null;

  try {
    context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }

  if (!context) return null;

  return context;
}
