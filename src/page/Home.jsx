import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavbarComponent from "../components/Navbar";
import MyCarousel from "../components/Carousel";
import FooterComponent from "../components/FooterComponent";

function Home() {
    // --- ข้อมูลหมวดหมู่ (แก้ไข/เพิ่มได้ตามต้องการ) ---
    const categories = [
        {
            name: "มอยเจอร์ไรเซอร์ สำหรับผิวหน้า",
            img: "https://images.unsplash.com/photo-1629198720000-1f2d7f4c9a10?q=80&w=800&auto=format&fit=crop",
            href: "#/category/face-moisturizer",
        },
        {
            name: "มอยเจอร์ไรเซอร์ สำหรับผิวกาย",
            img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800&auto=format&fit=crop",
            href: "#/category/body-moisturizer",
        },
        {
            name: "คลีนเซอร์ สำหรับผิวหน้า",
            img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa0?q=80&w=800&auto=format&fit=crop",
            href: "#/category/cleanser",
        },
        {
            name: "เซรั่ม สำหรับผิวหน้า",
            img: "https://images.unsplash.com/photo-1611930021909-1f61b9ad6f75?q=80&w=800&auto=format&fit=crop",
            href: "#/category/serum",
        },
    ];

    return (
        <>
            <NavbarComponent />
            <MyCarousel />
            {/* ค้นหาผลิตภัณฑ์ตามหมวดหมู่ */}
            <Container className="mt-5 mb-5">
                <h1 className="text-center mb-4" style={{ color: "#183b56" }}>
                    ค้นหาผลิตภัณฑ์ตามหมวดหมู่
                </h1>

                <Row className="g-4">
                    {categories.map((c) => (
                        <Col key={c.name} md={3} sm={6}>
                            <a
                                href={c.href}
                                className="text-decoration-none text-reset"
                            >
                                <Card className="shadow-sm h-100 border-0">
                                    {/* กล่องภาพพื้นหลังเทาอ่อน ให้ลุคเหมือนตัวอย่าง */}
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            background: "#f1f3f5",
                                            height: 220,
                                        }}
                                    >
                                        <img
                                            src={c.img}
                                            alt={c.name}
                                            style={{
                                                maxHeight: 180,
                                                width: "auto",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                    <Card.Body className="text-center">
                                        <div
                                            className="fw-bold"
                                            style={{ color: "#183b56" }}
                                        >
                                            {c.name}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </a>
                        </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="outline-secondary">ดูสินค้าทั้งหมด</Button>
                </div>
            </Container>
            {/* สินค้าขายดี */}
            <Container className="mt-5">
                <h1 className="text-rigth mb-4"> สินค้าขายดี </h1>
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="shadow-sm h-100">
                            <Card.Img
                                variant="top"
                                src="https://via.placeholder.com/300x180"
                            />
                            <Card.Body>
                                <Card.Title>เซรั่มบำรุงผิว</Card.Title>
                                <Card.Text>
                                    เซรั่มสูตรเข้มข้นช่วยให้ผิวกระจ่างใส
                                    ลดเลือนริ้วรอย
                                    และเติมความชุ่มชื้นให้ผิวสุขภาพดี
                                </Card.Text>
                                <Button variant="primary" className="w-100">
                                    สั่งซื้อเลย
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm h-100">
                            <Card.Img
                                variant="top"
                                src="https://via.placeholder.com/300x180"
                            />
                            <Card.Body>
                                <Card.Title>ครีมกันแดด</Card.Title>
                                <Card.Text>
                                    ปกป้องผิวจากรังสี UVA/UVB เนื้อบางเบา
                                    ซึมซับง่าย ไม่เหนียวเหนอะหนะ
                                </Card.Text>
                                <Button variant="primary" className="w-100">
                                    สั่งซื้อเลย
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm h-100">
                            <Card.Img
                                variant="top"
                                src="https://via.placeholder.com/300x180"
                            />
                            <Card.Body>
                                <Card.Title>มาส์กหน้า</Card.Title>
                                <Card.Text>
                                    มาส์กบำรุงเข้มข้น ช่วยฟื้นฟูผิวที่อ่อนล้า
                                    คืนความสดใสในทันที
                                </Card.Text>
                                <Button variant="primary" className="w-100">
                                    สั่งซื้อเลย
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* สินค้าแนะนำ */}
            <Container className="mt-5">
                <h1 className="text-rigth mb-4"> สินค้าแนะนำ </h1>
                <Row className="g-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Col key={i} md={3} sm={6}>
                            <Card className="shadow-sm h-100">
                                <div
                                    className="bg-light d-flex align-items-center justify-content-center"
                                    style={{ height: 180 }}
                                >
                                    <img
                                        src="https://via.placeholder.com/250x160"
                                        alt="แนะนำ"
                                        style={{
                                            maxHeight: 160,
                                            objectFit: "contain",
                                        }}
                                    />
                                </div>
                                <Card.Body className="text-center">
                                    <Card.Title className="fs-6 mb-2">
                                        สินค้าแนะนำ #{i}
                                    </Card.Title>
                                    <Button variant="success" className="w-100">
                                        ดูรายละเอียด
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <FooterComponent />
        </>
    );
}

export default Home;
