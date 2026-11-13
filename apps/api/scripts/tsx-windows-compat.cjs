if (process.platform === "win32") {
  process.geteuid = () => 0;

  if (process.env.CATLAS_TSX_WINDOWS_COMPAT !== "1") {
    process.env.CATLAS_TSX_WINDOWS_COMPAT = "1";
    const preloadPath = __filename.replace(/\\/g, "/");
    const preload = `--require=${preloadPath}`;
    const nodeOptions = process.env.NODE_OPTIONS?.trim();

    process.env.NODE_OPTIONS = nodeOptions
      ? `${nodeOptions} ${preload}`
      : preload;
  }
}
