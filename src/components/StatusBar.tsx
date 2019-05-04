import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faList, faMap, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { useUserContext } from "../customHooks/useUserContext";

export const StatusBar = () => {
  const user = useUserContext()!;
  return (
    <Bar>
      <NavItemWithIcon to={"/ratings"} title={"Lista"} icon={faList} />
      <NavItemWithIcon to={"/map"} title={"Karta"} icon={faMap} />
      <NavItemWithIcon to={"/ratings/newplace"} title={"Nytt"} icon={faPlus} />
      <NavItemWithIcon to={"/me"} title={user.displayName} icon={faUser} />
    </Bar>
  );
};

interface NavItemWithIconProps {
  to: string;
  title: string;
  icon: IconProp;
}

export const NavItemWithIcon: React.FC<NavItemWithIconProps> = ({
  to,
  title,
  icon
}) => (
  <NavItem to={to} activeClassName="active">
    <TabMenuItem title={title} icon={icon} />
  </NavItem>
);

interface TabMenuItemProps {
  title: string;
  icon: IconProp;
}

export const TabMenuItem: React.FC<TabMenuItemProps> = ({ title, icon }) => (
  <Column>
    <FontAwesomeIcon icon={icon} style={{ fontSize: "1.7rem" }} />
    {title}
  </Column>
);

const NavItem = styled(NavLink)`
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  width: 25%;

  &:hover {
    background-color: #fff2;
    cursor: pointer;
  }

  &.active {
    color: #002f7d;
    background-color: #fff2;
  }
`;

const Bar = styled.div`
  display: flex;
  background-color: cornflowerblue;
  justify-content: space-around;
  width: 100%;

  position: fixed;
  top: 0;
  z-index: 99;
  transition: padding-bottom ease;

  @media screen and (max-width: 600px) {
    top: auto;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
