import React from "react";
import styled from "styled-components";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "../history";

export const NavigationFooter = () => {
  return (
    <Footer>
      <Link href="https://github.com/Tejpbit/hashtag-lunch-reviews">
        <Item name="github" size="2x" />
      </Link>
    </Footer>
  );
};

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  width: 100%;
  padding: 1em 0em;

  background-color: rgb(227, 227, 227);
  color: rgb(155, 155, 155);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.8);
`;

const Item = styled(FontAwesome)`
  margin: 0em 1em;
`;

const Link = styled.a`
  &:visited {
    color: rgb(155, 155, 155);
  }
`;
