import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(" handleSubmit fired");

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/login`;

      // Debug logs
      console.log(" API URL:", apiUrl);
      console.log(" Payload being sent:", {
        email: form.email.toLowerCase(),
        password: form.password,
      });

      const res = await axios.post(
        apiUrl,
        {
          email: form.email.toLowerCase(),
          password: form.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(" API response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(" Login error (raw):", err);
      console.error(" Login error (response):", err.response?.data);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">EchoVid Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
