import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faList,
  faMap,
  faPlus,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { useGoogleAuth } from "../customHooks/useGoogleAuth";

export const StatusBar = () => {
  const { user, authorize } = useGoogleAuth();

  return (
    <Bar>
      <NavItemWithIcon to={"/ratings"} title={"Lista"} icon={faList} />
      <NavItemWithIcon to={"/map"} title={"Karta"} icon={faMap} />
      <NavItemWithIcon
        to={"/ratings/newplace"}
        title={"Nytt"}
        icon={faPlus}
        active={!!user}
      />
      {user ? (
        <NavItemWithIcon to={"/me"} title={user.displayName} icon={faUser} />
      ) : (
        <Item onClick={authorize}>
          <TabMenuItem icon={faUser} title={"Logga in"} />
        </Item>
      )}
    </Bar>
  );
};

interface NavItemWithIconProps {
  to: string;
  title: string;
  icon: IconProp;
  active?: boolean;
}

export const NavItemWithIcon: React.FC<NavItemWithIconProps> = ({
  to,
  title,
  icon,
  active = true
}) =>
  active ? (
    <NavItem to={to} activeClassName="active">
      <TabMenuItem title={title} icon={icon} />
    </NavItem>
  ) : (
    <Disabled>
      <TabMenuItem title={title} icon={icon} />
    </Disabled>
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
    background-color: #5279c4;
    cursor: pointer;
  }

  &.active {
    background-color: #5279c4;
  }
`;

const Disabled = styled.div`
  color: #888;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  width: 25%;

  background-color: rgb(227, 227, 227);
`;

const Item = styled.div`
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  width: 25%;

  &:hover {
    background-color: #5279c4;
    cursor: pointer;
  }

  &.active {
    background-color: #5279c4;
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
