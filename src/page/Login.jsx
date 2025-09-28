import { useState, useMemo } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

// 👉 ถ้ามี Firebase อยู่แล้ว ให้แก้ path import ให้ถูก
// ตัวอย่างไฟล์ firebase.js ควร export: auth, googleProvider
// import { auth, googleProvider } from "../firebase";

// --- ตัวช่วย (เอาออกเมื่อเชื่อม Firebase จริง) ---
const fakeAuth = async (email, password) => {
  // เดโม่: อนุญาตเฉพาะอีเมลลงท้าย @example.com และรหัส 12345678
  await new Promise((r) => setTimeout(r, 900));
  if (!email.endsWith("@example.com") || password !== "12345678") {
    const err = new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    err.code = "auth/invalid-credentials";
    throw err;
  }
  return { user: { email } };
};

export default function Login() {
  const navigate = useNavigate?.() || (() => {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const isPwdValid = useMemo(() => password.length >= 8, [password]);
  const formValid = isEmailValid && isPwdValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formValid) {
      setError("กรุณากรอกอีเมลให้ถูกต้องและรหัสผ่านอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);

      // --- ใช้จริงกับ Firebase ---
      // const { setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } = await import("firebase/auth");
      // await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      // await signInWithEmailAndPassword(auth, email, password);

      // --- เดโม่ (ลบเมื่อใช้จริง) ---
      await fakeAuth(email, password);

      setSuccess("เข้าสู่ระบบสำเร็จ 🎉");
      setTimeout(() => {
        navigate("/", { replace: true }); // กลับหน้าหลักหรือเปลี่ยน path ตามต้องการ
      }, 600);
    } catch (err) {
      let msg = "ไม่สามารถเข้าสู่ระบบได้";
      if (err?.code === "auth/invalid-credentials") msg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      if (err?.code === "auth/too-many-requests") msg = "พยายามมากเกินไป โปรดลองใหม่ภายหลัง";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError("");
      setLoading(true);

      // --- ใช้จริงกับ Firebase ---
      // const { signInWithPopup } = await import("firebase/auth");
      // await signInWithPopup(auth, googleProvider);

      // --- เดโม่ ---
      await new Promise((r) => setTimeout(r, 900));
      setSuccess("เข้าสู่ระบบด้วย Google สำเร็จ 🎉");
      setTimeout(() => navigate("/", { replace: true }), 600);
    } catch (err) {
      setError("ไม่สามารถเข้าสู่ระบบด้วย Google ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={bgStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <Row className="g-0">
                {/* ด้านซ้าย (ภาพ/แบรนด์) — ซ่อนบนจอเล็ก */}
                <Col md={5} className="d-none d-md-block" style={sideColStyle}>
                  <div className="h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h2 className="fw-bold">Skincare</h2>
                      <p className="mb-0 opacity-75">เข้าสู่ระบบเพื่อช้อปผิวสวย ✨</p>
                    </div>
                    <small className="opacity-75">HCI Friendly • Contrast ดี • แตะง่าย</small>
                  </div>
                </Col>

                {/* ด้านขวา (ฟอร์ม) */}
                <Col md={7} className="bg-white">
                  <div className="p-4 p-md-5">
                    <h3 className="fw-bold mb-3">เข้าสู่ระบบ</h3>
                    <p className="text-muted mb-4">ยินดีต้อนรับกลับมา 👋</p>

                    {error && (
                      <Alert variant="danger" className="rounded-3 py-2">
                        {error}
                      </Alert>
                    )}
                    {success && (
                      <Alert variant="success" className="rounded-3 py-2">
                        {success}
                      </Alert>
                    )}

                    <Form noValidate onSubmit={handleSubmit}>
                      {/* Email */}
                      <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>อีเมล</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          isInvalid={email.length > 0 && !isEmailValid}
                          disabled={loading}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          รูปแบบอีเมลไม่ถูกต้อง
                        </Form.Control.Feedback>
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>รหัสผ่าน</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPwd ? "text" : "password"}
                            placeholder="อย่างน้อย 8 ตัวอักษร"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={password.length > 0 && !isPwdValid}
                            disabled={loading}
                            required
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPwd((s) => !s)}
                            tabIndex={-1}
                            title={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                          >
                            {showPwd ? "ซ่อน" : "แสดง"}
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Check
                          type="switch"
                          id="rememberMe"
                          label="จดจำฉันไว้"
                          checked={remember}
                          disabled={loading}
                          onChange={(e) => setRemember(e.target.checked)}
                        />
                        <Link to="/forgot" className="small text-decoration-none">
                          ลืมรหัสผ่าน?
                        </Link>
                      </div>

                      <div className="d-grid gap-2">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={!formValid || loading}
                          className="py-2 fw-semibold"
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              กำลังเข้าสู่ระบบ...
                            </>
                          ) : (
                            "เข้าสู่ระบบ"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline-dark"
                          onClick={signInWithGoogle}
                          disabled={loading}
                          className="py-2 fw-semibold"
                        >
                          {/* คุณสามารถใส่ไอคอน Google ได้ตามต้องการ */}
                          เข้าสู่ระบบด้วย Google
                        </Button>
                      </div>
                    </Form>

                    <hr className="my-4" />
                    <p className="mb-0 text-center">
                      ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// --- สไตล์พื้นหลังที่อ่านง่าย (HCI): contrast ดี, เรียบง่าย ---
const bgStyle = {
  background:
    "radial-gradient(1200px 600px at 10% -20%, rgba(255,255,255,0.55), rgba(255,255,255,0)), linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fff 100%)",
};

const sideColStyle = {
  background:
    "linear-gradient(160deg, rgba(99,102,241,0.2), rgba(56,189,248,0.15)), url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop') center/cover",
  color: "#0f172a",
};

/* -----------------------------------------------------------
   วิธีเชื่อม Firebase Auth (ตัวอย่างไฟล์ firebase.js)
   -----------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PID",
  appId: "YOUR_APPID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// จากนั้นใน Login.jsx ให้ย้ายไปใช้โค้ดส่วนที่ "ใช้จริงกับ Firebase"
*/
