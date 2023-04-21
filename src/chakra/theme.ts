import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const styles = {};

const components = {};

const fonts = {
  body: "Poppins, sans-serif",
  heading: "Poppins, sans-serif",
};

const colors = {
  brand: {
    "100": "#3086FB",
    "200": "#681BBA",
    "300": "#EF4358",
    "400": "#676767",
    "500": "#E8B6EC",
  },
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: "false",
};

const theme = extendTheme({
  config,
  styles,
  components,
  colors,
  fonts,
});

export default theme;
