import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/client.ts", "./src/server.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm"],
});
