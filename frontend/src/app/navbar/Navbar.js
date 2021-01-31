import React from "react";
import { Grid } from "antd";
import Mobile from "./Mobile";
import Desktop from "./Desktop";
import "./style.scss";

const { useBreakpoint } = Grid;

function Navbar() {
  const { md } = useBreakpoint();

  return <>{md ? <Desktop /> : <Mobile />}</>;
}

export default Navbar;
