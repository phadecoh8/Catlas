if (process.platform === "win32" && !process.geteuid) {
  process.geteuid = () => 0;
}
