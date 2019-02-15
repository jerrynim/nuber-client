import Typography from "typography";

const typography = new Typography({
  baseFontSize: "14px",
  bodyFontFamily: ["Open Sans", "Helvetica", "Segoe UI", "sans-serif"],
  googleFonts: [
    {
      name: "Nunito",
      styles: ["400", "700"]
    },
    {
      name: "Open Sans",
      styles: ["400"]
    }
  ],
  headerFontFamily: ["Maven Pro", "sans-serif"],
  includeNormalize: false
});

export default typography.toString();
