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

  const getPrecision = context.getShaderPrecisionFormat.bind(context);
  try {
    Object.defineProperty(context, "getShaderPrecisionFormat", {
      configurable: true,
      value: (shaderType: number, precisionType: number) => {
        return getPrecision(shaderType, precisionType) ?? {
          rangeMin: 127,
          rangeMax: 127,
          precision: 23,
        };
      },
    });
  } catch {
    return null;
  }

  return context;
}
