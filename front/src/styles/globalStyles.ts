import { createGlobalStyle, css } from "styled-components";

export const reset = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  menu,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;

    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
    display: none;
  }
  body {
    line-height: 1;
  }
  menu,
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  button {
    padding: 0;
    cursor: pointer;
  }
`;

export const GlobalStyle = createGlobalStyle`
${reset}




#root, body, html {
    max-width: 76.8rem;
    height: 100%; 

    margin: 0 auto;
    overflow-y: auto;
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */

    background-color: black;

    -webkit-tap-highlight-color: rgba(0,0,0,0);



    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
}
#root::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
}
  
* {
    box-sizing: border-box;
    color: white;
    font-size: 16px;
    font-family: 'Play';
    text-transform: lowercase;

    @font-face {
  font-family: 'Play';
  src: url('./fonts/Play-Regular.ttf');
  font-weight: 400;
  font-style: normal;
    }

}

:root {
  // greens
  --primary-color: #36d6ae;
  --primary-color-r: 54;
  --primary-color-g: 214;
  --primary-color-b: 174;

  --green-light: #76ff03;
  --green-2: #7afaa1;

  --blue: #000aff;
  --blue-light: #1fcbff;

  --yellow: #fcf000;
  --yellow-r: 252;
  --yellow-g: 240;
  --yellow-b: 0;

  --red: #ff5c00;
  --red-r: 255;
  --red-g: 92;
  --red-b: 13;

  --grayscale-disabled: #616161;
  --grayscale-dark: #808080;
  --grayscale-secondary: #c7c7c7;
  --grayscale-primary: #fff;

  --text-opacity-2: 0.7;
  --text-opacity-3: 0.7;
  --text-opacity-4: 0.38;

  --pink: #f62bfd;
}

    
`;

export default GlobalStyle;
