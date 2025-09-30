// src/pages/TBproduct.jsx
import "../style/admin.css";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Container,
  Image,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
  Table,
  Toast,
  ToastContainer,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
import { db } from "../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import AdminSidebar from "../components/AdminSidebar";
import AddProductModal from "../components/AddProductModal";

const CATEGORY_COLORS = {
  "ทำความสะอาด": "info",
  "โทนเนอร์": "secondary",
  "เอสเซนส์": "primary",
  "เซรั่ม": "warning",
  "มอยส์เจอไรเซอร์": "success",
  "ทรีตเมนต์": "dark",
  "มาสก์": "danger",
  "กันแดด": "success",
};

export default function TBproduct() {
  const [openAdd, setOpenAdd] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ค้นหา/กรอง/เรียง/แบ่งหน้า
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // name | brand | category | price | createdAt
  const [sortDir, setSortDir] = useState("desc");     // asc | desc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // แก้ไข
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // แจ้งเตือน
  const [toast, setToast] = useState({ show: false, title: "", body: "" });

  useEffect(() => {
    const q = query(collection(db, "product"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(rows);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setToast({ show: true, title: "เกิดข้อผิดพลาด", body: "ไม่สามารถดึงข้อมูลสินค้าได้" });
      }
    );
    return () => unsub();
  }, []);

  const handleSaved = () => {
    setToast({ show: true, title: "สำเร็จ", body: "บันทึกสินค้าสำเร็จ" });
  };

  const handleDelete = async (id, name) => {
    const ok = window.confirm(`ต้องการลบสินค้า “${name ?? id}” ใช่หรือไม่?`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "product", id));
      setToast({ show: true, title: "ลบสำเร็จ", body: "ลบสินค้าเรียบร้อย" });
    } catch (e) {
      console.error(e);
      setToast({ show: true, title: "ลบไม่สำเร็จ", body: "โปรดลองอีกครั้ง" });
    }
  };

  const categories = useMemo(() => {
    const s = new Set();
    products.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [products]);

  const fmtPrice = (v) => {
    const n = Number(v || 0);
    return n.toLocaleString("th-TH", { minimumFractionDigits: 2 });
  };

  const startEdit = (p) => {
    setEditing({
      id: p.id,
      name: p.name || "",
      brand: p.brand || "",
      price: p.price || "",
      category: p.category || "",
      imageURL: p.imageURL || "",
      description: p.description || "",
    });
  };

  const submitEdit = async () => {
    if (!editing?.id) return;
    setSavingEdit(true);
    try {
      const ref = doc(db, "product", editing.id);
      await updateDoc(ref, {
        name: editing.name?.trim() || "",
        brand: editing.brand?.trim() || "",
        price: Number(editing.price || 0),
        category: editing.category || "",
        imageURL: editing.imageURL || "",
        description: editing.description || "",
      });
      setSavingEdit(false);
      setEditing(null);
      setToast({ show: true, title: "บันทึกสำเร็จ", body: "แก้ไขสินค้าแล้ว" });
    } catch (e) {
      console.error(e);
      setSavingEdit(false);
      setToast({ show: true, title: "บันทึกไม่สำเร็จ", body: "โปรดลองอีกครั้ง" });
    }
  };

  // กรอง + เรียง
  const processed = useMemo(() => {
    const kw = search.trim().toLowerCase();
    let arr = products.filter((p) => {
      const matchKW =
        !kw ||
        [p.name, p.brand, p.category]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(kw));
      const matchCat = !categoryFilter || p.category === categoryFilter;
      return matchKW && matchCat;
    });

    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const A = a[sortBy];
      const B = b[sortBy];
      if (sortBy === "price") return (Number(A) - Number(B)) * dir;
      if (sortBy === "createdAt") {
        const da = A?.toMillis ? A.toMillis() : new Date(A || 0).getTime();
        const db = B?.toMillis ? B.toMillis() : new Date(B || 0).getTime();
        return (da - db) * dir;
      }
      return String(A || "").localeCompare(String(B || ""), "th") * dir;
    });

    return arr;
  }, [products, search, categoryFilter, sortBy, sortDir]);

  // แบ่งหน้า
  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, currentPage, pageSize]);

  const SortBtn = ({ id, label, align = "start" }) => (
    <button
      className={`th-sort btn-reset ${align === "end" ? "text-end w-100" : ""}`}
      onClick={() => {
        if (sortBy === id) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
          setSortBy(id);
          setSortDir(id === "name" || id === "brand" || id === "category" ? "asc" : "desc");
        }
      }}
      title="คลิกเพื่อเรียง"
    >
      <span>{label}</span>
      <span className={`carat ${sortBy === id ? "active" : ""}`}>
        {sortBy === id ? (sortDir === "asc" ? "▲" : "▼") : "▵▿"}
      </span>
    </button>
  );

  return (
    <>
      <AdminSidebar />

      <div className="admin-with-sidebar">
        <Container className="py-4 admin-page-container">
          {/* Head actions */}
          <Row className="align-items-center g-2 mb-3">
            <Col xs={12} md="auto" className="text-center text-md-start">
              <Button variant="success" onClick={() => setOpenAdd(true)}>
                + เพิ่มข้อมูลสินค้า
              </Button>
            </Col>
            <Col xs={12} md>
              <InputGroup>
                <InputGroup.Text>ค้นหา</InputGroup.Text>
                <Form.Control
                  placeholder="ชื่อสินค้า / แบรนด์ / หมวดหมู่"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </InputGroup>
            </Col>
            <Col xs={6} md={3}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">— all หมวดหมู่ —</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md="auto">
              <Form.Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / หน้า
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* ตาราง */}
          <div className="table-card shadow-sm rounded-4">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" role="status" />
              </div>
            ) : total === 0 ? (
              <div className="empty-state text-center py-5">
                <div className="emoji">🗒️</div>
                <div className="title">ยังไม่มีข้อมูลสินค้า</div>
                <div className="desc text-muted">คลิก “เพิ่มข้อมูลสินค้า” เพื่อสร้างรายการแรก</div>
              </div>
            ) : (
              <>
                <Table responsive hover className="align-middle tbl mb-0">
                  <thead className="table-light th-sticky">
                    <tr>
                      <th style={{ width: 64 }}>ภาพ</th>
                      <th><SortBtn id="name" label="ชื่อสินค้า" /></th>
                      <th><SortBtn id="brand" label="แบรนด์" /></th>
                      <th><SortBtn id="category" label="หมวดหมู่" /></th>
                      <th style={{ width: 140 }} className="text-end">
                        <SortBtn id="price" label="ราคา (บาท)" align="end" />
                      </th>
                      <th style={{ width: 160 }} className="text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => (
                      <tr key={p.id}>
                        <td>
                          {p.imageURL ? (
                            <Image src={p.imageURL} alt={p.name} rounded className="thumb" />
                          ) : (
                            <div className="thumb thumb-empty">ไม่มีรูป</div>
                          )}
                        </td>
                        <td className="fw-semibold">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>{p.name}</Tooltip>}
                          >
                            <div className="cell-ellipsis">{p.name || "-"}</div>
                          </OverlayTrigger>
                          {p.description ? (
                            <OverlayTrigger placement="top" overlay={<Tooltip>{p.description}</Tooltip>}>
                              <div className="cell-ellipsis small text-muted mt-1">
                                {p.description}
                              </div>
                            </OverlayTrigger>
                          ) : null}
                        </td>
                        <td>
                          <div className="cell-ellipsis">{p.brand || "-"}</div>
                        </td>
                        <td>
                          {p.category ? (
                            <Badge
                              bg={CATEGORY_COLORS[p.category] || "secondary"}
                              className="rounded-pill"
                            >
                              {p.category}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-end">฿ {fmtPrice(p.price)}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <ButtonGroup size="sm">
                              <OverlayTrigger placement="top" overlay={<Tooltip>แก้ไข</Tooltip>}>
                                <Button variant="outline-secondary" onClick={() => startEdit(p)}>
                                  ✏️
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>ลบ</Tooltip>}>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => handleDelete(p.id, p.name)}
                                >
                                  🗑️
                                </Button>
                              </OverlayTrigger>
                            </ButtonGroup>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Footer table: สรุป/แบ่งหน้า */}
                <div className="tbl-footer d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-2">
                  <div className="text-muted small">
                    แสดง {pageItems.length} จากทั้งหมด {total} รายการ
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.First onClick={() => setPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].slice(0, 5).map((_, i) => {
                      // แสดงได้สูงสุด 5 ปุ่มรัว ๆ; ทำแบบ window ง่าย ๆ
                      const base = Math.min(
                        Math.max(1, currentPage - 2),
                        Math.max(1, totalPages - 4)
                      );
                      const n = base + i;
                      if (n > totalPages) return null;
                      return (
                        <Pagination.Item key={n} active={n === currentPage} onClick={() => setPage(n)}>
                          {n}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>

      {/* Modal เพิ่มสินค้า */}
      <AddProductModal show={openAdd} onHide={() => setOpenAdd(false)} onSaved={handleSaved} />

      {/* Modal แก้ไขสินค้า */}
      <Modal show={!!editing} onHide={() => setEditing(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editing && (
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ชื่อสินค้า</Form.Label>
                    <Form.Control
                      value={editing.name}
                      onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>แบรนด์</Form.Label>
                    <Form.Control
                      value={editing.brand}
                      onChange={(e) => setEditing((s) => ({ ...s, brand: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ราคา (บาท)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      value={editing.price}
                      onChange={(e) => setEditing((s) => ({ ...s, price: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>หมวดหมู่</Form.Label>
                    <Form.Control
                      value={editing.category}
                      onChange={(e) => setEditing((s) => ({ ...s, category: e.target.value }))}
                      placeholder="ทำความสะอาด / โทนเนอร์ / เซรั่ม / …"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ลิงก์รูปภาพ (URL)</Form.Label>
                    <Form.Control
                      value={editing.imageURL}
                      onChange={(e) => setEditing((s) => ({ ...s, imageURL: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>คำอธิบาย</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editing.description}
                      onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setEditing(null)}>ยกเลิก</Button>
          <Button variant="primary" onClick={submitEdit} disabled={savingEdit}>
            {savingEdit ? (<><Spinner size="sm" animation="border" className="me-2" />กำลังบันทึก…</>) : "บันทึก"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast */}
      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          bg="light"
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          show={toast.show}
          delay={2200}
          autohide
        >
          <Toast.Header><strong className="me-auto">{toast.title}</strong></Toast.Header>
          <Toast.Body>{toast.body}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
