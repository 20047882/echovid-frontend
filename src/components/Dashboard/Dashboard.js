import React, { useEffect, useState } from "react";
import API from "../../api";
import VideoCard from "./VideoCard";
import UploadModal from "./UploadModal";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const res = await API.get("/getVideos");
      setVideos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filtered = videos.filter((v) =>
    v.Title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signup"); // redirect to signup page
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Latest Videos</h2>
        </Col>
        <Col className="text-end">
          {role === "Creator" && (
            <Button
              className="me-2"
              onClick={() => setShowUpload(true)}
              variant="success"
            >
              Upload Video
            </Button>
          )}
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {filtered.map((video) => (
          <Col md={4} key={video.VideoID} className="mb-4">
            <VideoCard video={video} fetchVideos={fetchVideos} />
          </Col>
        ))}
      </Row>
      <UploadModal
        show={showUpload}
        onHide={() => setShowUpload(false)}
        fetchVideos={fetchVideos}
      />
    </Container>
  );
};

export default Dashboard;
