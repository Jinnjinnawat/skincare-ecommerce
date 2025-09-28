// src/components/NavbarComponent.jsx
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavbarComponent() {
  return (
    <Navbar
      expand="lg"                 // แตกเป็นเมนูเต็มเมื่อ >= lg
      bg="light"
      data-bs-theme="light"
      sticky="top"                // ตรึงด้านบนเวลาเลื่อนหน้า (ถ้าไม่ต้องการลบได้)
      collapseOnSelect            // คลิกแล้วปิดเมนูอัตโนมัติบนมือถือ
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand href="#">Skincare</Navbar.Brand>

        {/* ปุ่ม hamburger บนจอเล็ก */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* เนื้อหาเมนูที่ยุบ/ขยายได้ */}
        <Navbar.Collapse id="main-navbar">
          {/* เมนูซ้าย */}
          <Nav className="me-auto">
            <Nav.Link href="#home">หน้าหลัก</Nav.Link>
            <Nav.Link href="#features">รายการสินค้า</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>

          {/* เมนูขวา */}
          <Nav>
            <NavDropdown title="Link" id="navbarScrollingDropdown" align="end">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">คำสั่งซื้อ</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
