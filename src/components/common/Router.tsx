import { BrowserRouter, Route, Routes } from "react-router-dom";

import Main from "../../pages/Main/Main";
import Menu from "../../pages/Menu/Menu";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
