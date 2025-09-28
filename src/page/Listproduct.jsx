import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Offcanvas,
  Pagination,
  Row,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import NavbarComponent from "../components/Navbar";
/**
 * React-Bootstrap สกินแคร์: หน้ารายการสินค้า (Products.jsx)
 * - ค้นหา + คัดกรอง + เรียงลำดับ + แสดงผลแบบการ์ด + หน้าเพจ (pagination)
 * - รองรับมือถือ/เดสก์ท็อป ดีต่อ HCI: ชัด, แตะง่าย, contrast ดี, ปุ่มสำคัญเด่น
 * - ใช้ไฟล์เดียว นำไปวางใน src/pages/Products.jsx ได้ทันที
 */

// ------- ข้อมูลตัวอย่าง (สามารถดึงจาก API/Firestore แทนได้) -------
const SAMPLE_PRODUCTS = [
  {
    id: "p01",
    name: "เซรั่มวิตามินซี 15%",
    brand: "GlowLab",
    price: 459,
    oldPrice: 620,
    rating: 4.6,
    reviews: 128,
    category: "เซรั่ม",
    concerns: ["ผิวหมองคล้ำ", "จุดด่างดำ"],
    isNew: true,
    img: "",
  },
  {
    id: "p02",
    name: "มอยส์เจอไรเซอร์ ไฮยาลูรอน",
    brand: "Hydra+",
    price: 329,
    rating: 4.2,
    reviews: 64,
    category: "มอยส์เจอไรเซอร์",
    concerns: ["ผิวแห้ง", "ระคายเคือง"],
    img: "",
  },
  {
    id: "p03",
    name: "กันแดด SPF50+ PA++++",
    brand: "Sunveil",
    price: 289,
    rating: 4.8,
    reviews: 412,
    category: "กันแดด",
    concerns: ["รอยคล้ำแดด", "สิวอุดตัน"],
    isNew: true,
    img: "",
  },
  {
    id: "p04",
    name: "โทนเนอร์ผลัดเซลล์ AHA/BHA",
    brand: "ClearTone",
    price: 379,
    oldPrice: 450,
    rating: 4.4,
    reviews: 238,
    category: "โทนเนอร์",
    concerns: ["สิวอุดตัน", "ผิวไม่เรียบ"],
    img: "",
  },
  {
    id: "p05",
    name: "คลีนซิ่งวอเตอร์ ผิวแพ้ง่าย",
    brand: "SoftClean",
    price: 249,
    rating: 4.1,
    reviews: 76,
    category: "ทำความสะอาด",
    concerns: ["ผิวแพ้ง่าย"],
    img: "",
  },
  {
    id: "p06",
    name: "เรตินอล 0.3% ครีมกลางคืน",
    brand: "DermAct",
    price: 529,
    rating: 4.5,
    reviews: 154,
    category: "ทรีตเมนต์",
    concerns: ["ริ้วรอย", "รูขุมขนกว้าง"],
    img: "",
  },
  {
    id: "p07",
    name: "เอสเซนส์ น้ำตบผิวฉ่ำ",
    brand: "Dewdrop",
    price: 299,
    rating: 4.0,
    reviews: 51,
    category: "เอสเซนส์",
    concerns: ["ผิวหมองคล้ำ", "ขาดน้ำ"],
    img: "",
  },
  {
    id: "p08",
    name: "ไนท์มาสก์ นอนตื่นผิวฟู",
    brand: "PlumpUp",
    price: 349,
    rating: 4.3,
    reviews: 83,
    category: "มาสก์",
    concerns: ["ขาดน้ำ", "ผิวโทรม"],
    img: "",
  },
];

const CATEGORIES = [
  "ทั้งหมด",
  "ทำความสะอาด",
  "โทนเนอร์",
  "เอสเซนส์",
  "เซรั่ม",
  "มอยส์เจอไรเซอร์",
  "ทรีตเมนต์",
  "มาสก์",
  "กันแดด",
];

const CONCERNS = [
  "สิวอุดตัน",
  "รอยคล้ำแดด",
  "จุดด่างดำ",
  "ผิวหมองคล้ำ",
  "ผิวแห้ง",
  "ผิวแพ้ง่าย",
  "รูขุมขนกว้าง",
  "ริ้วรอย",
  "ขาดน้ำ",
  "ผิวไม่เรียบ",
];

// ------- UI Helpers -------
function StarRating({ value }) {
  const rounded = Math.round(value * 2) / 2; // รองรับครึ่งดาว
  const stars = Array.from({ length: 5 }, (_, i) => {
    const full = i + 1 <= Math.floor(rounded);
    const half = !full && i + 0.5 < rounded + 0.01;
    return (
      <span key={i} aria-hidden>
        {full ? "★" : half ? "⯪" : "☆"}
      </span>
    );
  });
  return (
    <span
      className="text-warning"
      aria-label={`คะแนน ${value.toFixed(1)} จาก 5 ดาว`}
      title={`คะแนน ${value.toFixed(1)} / 5`}
      style={{ letterSpacing: 2 }}
    >
      {stars}
    </span>
  );
}

function Price({ price, oldPrice }) {
  return (
    <Stack direction="horizontal" gap={2} className="align-items-baseline">
      <strong className="fs-5">฿{price.toLocaleString()}</strong>
      {oldPrice && (
        <span className="text-secondary text-decoration-line-through">
          ฿{oldPrice.toLocaleString()}
        </span>
      )}
    </Stack>
  );
}

function ProductCard({ p, onAdd }) {
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const discount = hasDiscount
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;
  return (
   
    <Card className="h-100 shadow-sm border-0">
      <div className="position-relative">
        {hasDiscount && (
          <Badge bg="danger" className="position-absolute m-2" style={{ top: 0, left: 0 }}>
            -{discount}%
          </Badge>
        )}
        {p.isNew && (
          <Badge bg="success" className="position-absolute m-2" style={{ top: 0, right: 0 }}>
            ใหม่!
          </Badge>
        )}
        <Card.Img
          variant="top"
          src={p.img}
          alt={`${p.name} โดย ${p.brand}`}
          style={{ aspectRatio: "4/3", objectFit: "cover" }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="small text-uppercase text-secondary">{p.brand}</div>
        <Card.Title className="fs-6 text-truncate" title={p.name}>
          {p.name}
        </Card.Title>

        <div className="d-flex align-items-center gap-2">
          <StarRating value={p.rating} />
          <span className="text-secondary small">({p.reviews})</span>
        </div>

        <div className="mt-2">
          <Price price={p.price} oldPrice={p.oldPrice} />
        </div>

        <div className="mt-2 d-flex flex-wrap gap-2">
          <Badge bg="light" text="dark">{p.category}</Badge>
          {p.concerns?.slice(0, 2).map((c) => (
            <Badge key={c} bg="outline" className="border text-secondary">
              {c}
            </Badge>
          ))}
        </div>

        {/* ปุ่มอยู่ล่างการ์ดเสมอ และจัดกึ่งกลาง */}
        <div className="mt-auto">
          <div className="d-grid">
            <Button variant="primary" onClick={() => onAdd?.(p)}>
              เพิ่มลงตะกร้า
            </Button>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button variant="outline-secondary" size="sm">
              ดูรายละเอียด
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function ProductsPage() {
  // ------- States -------
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [priceMax, setPriceMax] = useState(800);
  const [sortBy, setSortBy] = useState("popular"); // popular | price_asc | price_desc | newest
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  // ------- Derived list -------
  const filtered = useMemo(() => {
    let list = [...SAMPLE_PRODUCTS];

    // ค้นหาคำ
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // หมวดหมู่
    if (activeCategory !== "ทั้งหมด") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // ปัญหาผิว
    if (selectedConcerns.length) {
      list = list.filter((p) =>
        selectedConcerns.every((c) => p.concerns?.includes(c))
      );
    }

    // ราคาสูงสุด
    list = list.filter((p) => p.price <= priceMax);

    // เรียงลำดับ
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew === true) - (a.isNew === true));
        break;
      default:
        // popular: ใช้ reviews มากเป็นหลัก
        list.sort((a, b) => b.reviews - a.reviews);
    }

    return list;
  }, [query, activeCategory, selectedConcerns, priceMax, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const handleAdd = (p) => {
    setToast({ title: "เพิ่มลงตะกร้าแล้ว", message: p.name });
  };

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("ทั้งหมด");
    setSelectedConcerns([]);
    setPriceMax(800);
    setSortBy("popular");
    setPage(1);
  };

  return (
    <>
    <NavbarComponent></NavbarComponent>
    <Container className="py-4">
        
      {/* Header & Search */}
      <Stack direction="horizontal" className="mb-3 flex-wrap gap-2">
        <div>
          <h1 className="fs-3 m-0">รายการสกินแคร์</h1>
          <div className="text-secondary small">ค้นหา • กรอง • เรียงลำดับ • เพิ่มลงตะกร้า</div>
        </div>
        <div className="ms-auto d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => setShowFilters(true)}>
            ตัวกรอง
          </Button>
          <DropdownButton
            variant="outline-secondary"
            title={
              sortBy === "popular"
                ? "เรียงตามความนิยม"
                : sortBy === "price_asc"
                ? "ราคาต่ำ-สูง"
                : sortBy === "price_desc"
                ? "ราคาสูง-ต่ำ"
                : "มาใหม่"
            }
            onSelect={(k) => setSortBy(k || "popular")}
          >
            <Dropdown.Item eventKey="popular" active={sortBy === "popular"}>
              เรียงตามความนิยม
            </Dropdown.Item>
            <Dropdown.Item eventKey="newest" active={sortBy === "newest"}>
              มาใหม่
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="price_asc" active={sortBy === "price_asc"}>
              ราคาต่ำ → สูง
            </Dropdown.Item>
            <Dropdown.Item eventKey="price_desc" active={sortBy === "price_desc"}>
              ราคาสูง → ต่ำ
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </Stack>

      <InputGroup className="mb-3 shadow-sm">
        <InputGroup.Text id="search-label">ค้นหา</InputGroup.Text>
        <Form.Control
          placeholder="ค้นหาชื่อสินค้า/แบรนด์/หมวดหมู่"
          aria-label="ค้นหาสินค้า"
          aria-describedby="search-label"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        {query && (
          <Button variant="outline-secondary" onClick={() => setQuery("")}>ล้าง</Button>
        )}
      </InputGroup>

      {/* Filter bar (desktop) */}
      <Row className="g-3">
        <Col lg={3} className="d-none d-lg-block">
          <FilterPanel
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            selectedConcerns={selectedConcerns}
            setSelectedConcerns={setSelectedConcerns}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            onReset={resetFilters}
          />
        </Col>

        <Col lg={9}>
          <Row xs={1} sm={2} md={3} xl={4} className="g-3">
            {paged.map((p) => (
              <Col key={p.id}>
                <ProductCard p={p} onAdd={handleAdd} />
              </Col>
            ))}
          </Row>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center text-secondary py-5">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
              <div className="mt-3">
                <Button variant="outline-primary" onClick={resetFilters}>
                  รีเซ็ตตัวกรอง
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Pagination.Item
                    key={n}
                    active={n === currentPage}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Pagination.Item>
                ))}
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
          )}
        </Col>
      </Row>

      {/* Mobile filter drawer */}
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ตัวกรองสินค้า</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterPanel
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            selectedConcerns={selectedConcerns}
            setSelectedConcerns={setSelectedConcerns}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            onReset={resetFilters}
          />
          <div className="d-grid gap-2 mt-3">
            <Button onClick={() => setShowFilters(false)}>เสร็จสิ้น</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Toast add to cart */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="light"
          show={!!toast}
          delay={1800}
          autohide
          onClose={() => setToast(null)}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">{toast?.title}</strong>
          </Toast.Header>
          <Toast.Body>{toast?.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
    </>
  );
}

function FilterPanel({
  activeCategory,
  setActiveCategory,
  selectedConcerns,
  setSelectedConcerns,
  priceMax,
  setPriceMax,
  onReset,
}) {
  const toggleConcern = (c) => {
    setSelectedConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <Stack gap={3}>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title as="h6">หมวดหมู่</Card.Title>
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={activeCategory === c ? "dark" : "outline-secondary"}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title as="h6">ปัญหาผิว</Card.Title>
          <Row xs={2} className="g-2">
            {CONCERNS.map((c) => (
              <Col key={c}>
                <Form.Check
                  type="checkbox"
                  id={`concern-${c}`}
                  label={c}
                  checked={selectedConcerns.includes(c)}
                  onChange={() => toggleConcern(c)}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Card.Title as="h6">ช่วงราคา (สูงสุด)</Card.Title>
          <Form.Range
            min={100}
            max={1000}
            step={10}
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between">
            <span className="text-secondary">฿100</span>
            <span className="fw-semibold">฿{priceMax.toLocaleString()}</span>
          </div>
        </Card.Body>
      </Card>

      <div className="d-grid">
        <Button variant="outline-secondary" onClick={onReset}>รีเซ็ตตัวกรองทั้งหมด</Button>
      </div>
    </Stack>
  );
}
