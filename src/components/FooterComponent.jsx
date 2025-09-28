// src/components/FooterComponent.jsx
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function FooterComponent() {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Skincare Shop</h5>
            <p>
              ร้านขายเครื่องสำอางออนไลน์ สกินแคร์คุณภาพดี
              ราคาย่อมเยา ส่งตรงถึงบ้านคุณ
            </p>
          </Col>

          <Col md={4}>
            <h5>ลิงก์ที่สำคัญ</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-white">หน้าหลัก</a></li>
              <li><a href="#products" className="text-white">สินค้า</a></li>
              <li><a href="#about" className="text-white">เกี่ยวกับเรา</a></li>
              <li><a href="#contact" className="text-white">ติดต่อเรา</a></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>ติดต่อเรา</h5>
            <p>Email: support@skincare.com</p>
            <p>โทร: 012-345-6789</p>
            <p>ที่อยู่: กรุงเทพฯ ประเทศไทย</p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">© 2025 Skincare Shop. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterComponent;
