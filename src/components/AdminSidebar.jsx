// src/components/AdminSidebar.jsx
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
function AdminSidebar() {
  return (
    <div
      className="d-flex flex-column vh-100 p-3 bg-dark text-white"
      style={{ width: "250px", position: "fixed", left: 0, top: 0 }}
    >
      <h3 className="text-center mb-4">Admin Panel</h3>
      <Nav className="flex-column">
        <Nav.Link href="#dashboard" className="text-white mb-2">
          📊 Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/TBproduct"className="text-white mb-2">
          🛍️ จัดการสินค้า
        </Nav.Link>
        <Nav.Link href="#orders" className="text-white mb-2">
          📦 คำสั่งซื้อ
        </Nav.Link>
        <Nav.Link href="#users" className="text-white mb-2">
          👤 ผู้ใช้งาน
        </Nav.Link>
        <Nav.Link href="#settings" className="text-white mb-2">
          ⚙️ ตั้งค่า
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default AdminSidebar;
