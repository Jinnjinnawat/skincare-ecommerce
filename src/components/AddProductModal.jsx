// src/components/AddProductModal.jsx
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Toast,
  ToastContainer,
  Modal,
} from "react-bootstrap";
import { db } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CATEGORIES = [
  "ทำความสะอาด",
  "โทนเนอร์",
  "เอสเซนส์",
  "เซรั่ม",
  "มอยส์เจอไรเซอร์",
  "ทรีตเมนต์",
  "มาสก์",
  "กันแดด",
];

export default function AddProductModal({ show, onHide, onSaved }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const resetForm = () => {
    setName("");
    setBrand("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageURL("");
  };

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !brand.trim() || !price || !category) {
      setToast({
        show: true,
        message: "กรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, แบรนด์, ราคา, หมวดหมู่)",
        variant: "danger",
      });
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setToast({ show: true, message: "ราคาสินค้าไม่ถูกต้อง", variant: "danger" });
      return;
    }

    if (!imageURL || !isValidUrl(imageURL)) {
      setToast({
        show: true,
        message: "กรุณาระบุลิงก์รูปภาพที่ถูกต้อง (https://...)",
        variant: "danger",
      });
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "product"), {
        name: name.trim(),
        brand: brand.trim(),
        price: numericPrice,
        description: description.trim(),
        category,
        imageURL: imageURL.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
      });

      setToast({ show: true, message: "บันทึกสินค้าสำเร็จ!", variant: "success" });
      resetForm();
      // แจ้งให้หน้าแม่รีเฟรชรายการได้ถ้าจำเป็น
      onSaved && onSaved();
      // ปิด modal หลังแสดง toast สั้น ๆ
      setTimeout(() => {
        onHide && onHide();
      }, 600);
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: `เกิดข้อผิดพลาด: ${err.message || err}`,
        variant: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // เมื่อ modal ถูกปิด ให้เคลียร์ฟอร์มด้วย (กันค่าค้าง)
  const handleClose = () => {
    resetForm();
    onHide && onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={!submitting}
      size="lg"
      centered
    >
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>เพิ่มสินค้าใหม่</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="productName">
                <Form.Label>ชื่อสินค้า *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="เช่น เซรั่มวิตามินซี 15%"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="brand">
                <Form.Label>แบรนด์ *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="เช่น GlowLab"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label>ราคาสินค้า (บาท) *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>฿</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="เช่น 259.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label>หมวดหมู่ *</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    เลือกหมวดหมู่
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="imageURL">
                <Form.Label>ลิงก์รูปภาพสินค้า (URL) *</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  required
                />
                {imageURL && isValidUrl(imageURL) && (
                  <div className="mt-2">
                    <img
                      src={imageURL}
                      alt="ตัวอย่างรูปสินค้า"
                      className="img-fluid rounded border"
                      style={{ maxHeight: 180, objectFit: "cover" }}
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/300x180?text=Preview")
                      }
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label>รายละเอียดสินค้า</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="ส่วนผสมเด่น วิธีใช้ เหมาะกับผิวแบบใด ฯลฯ"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={resetForm}
              disabled={submitting}
            >
              ล้างฟอร์ม
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "กำลังบันทึก..." : "บันทึกสินค้า"}
            </Button>
          </div>
        </Form>
      </Modal.Body>

      {/* ใช้ Toast ภายใน Modal */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={2200}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Modal>
  );
}
