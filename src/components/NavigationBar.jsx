import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">facedetector</Navbar.Brand>
        <div className="float-end">End</div>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
