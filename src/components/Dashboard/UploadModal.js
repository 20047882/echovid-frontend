import React, { useState } from "react";
import API from "../../api";
import { Modal, Button, Form } from "react-bootstrap";

const UploadModal = ({ show, onHide, fetchVideos }) => {
  const [form, setForm] = useState({
    title: "", publisher: "", producer: "", genre: "", ageRating: ""
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async () => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      await API.post("/upload", {
        ...form,
        fileName: file.name,
        fileContent: base64
      });
      fetchVideos();
      onHide();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Upload Video</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control className="mb-2" name="title" placeholder="Title" onChange={handleChange} />
          <Form.Control className="mb-2" name="publisher" placeholder="Publisher" onChange={handleChange} />
          <Form.Control className="mb-2" name="producer" placeholder="Producer" onChange={handleChange} />
          <Form.Control className="mb-2" name="genre" placeholder="Genre" onChange={handleChange} />
          <Form.Control className="mb-2" name="ageRating" placeholder="Age Rating" onChange={handleChange} />
          <Form.Control type="file" className="mb-2" onChange={(e) => setFile(e.target.files[0])} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpload} disabled={!file}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
