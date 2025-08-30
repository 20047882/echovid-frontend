import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { Container, Form, Button } from "react-bootstrap";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/signup", form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">EchoVid Signup</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" type="text" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">Sign Up</Button>
      </Form>
      <p className="mt-3 text-center">
        Already have an account?{" "}
        <Button variant="link" onClick={() => navigate("/login")}>Login</Button>
      </p>
    </Container>
  );
};

export default Signup;
