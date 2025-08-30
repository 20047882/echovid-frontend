import React, { useState, useEffect } from "react";
import API from "../../api";
import { Card, Button, Form } from "react-bootstrap";

const VideoCard = ({ video }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState({ AvgRating: 0, TotalRatings: 0 });

  const fetchComments = async () => {
    const res = await API.get(`/getComments/${video.VideoID}`);
    setComments(res.data);
  };

  const fetchRatings = async () => {
    const res = await API.get(`/getRatings/${video.VideoID}`);
    setRatings(res.data || { AvgRating: 0, TotalRatings: 0 });
  };

  const addComment = async () => {
    await API.post("/comment", { videoId: video.VideoID, comment });
    setComment("");
    fetchComments(); // ✅ reload
  };

  const addRating = async () => {
    await API.post("/rate", { videoId: video.VideoID, rating: parseInt(rating) });
    setRating("");
    fetchRatings(); // ✅ reload
  };

  useEffect(() => {
    fetchComments();
    fetchRatings();
  }, [video.VideoID]);

  return (
    <Card>
      <video controls style={{ width: "100%" }}>
        <source src={video.BlobURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Card.Body>
        <Card.Title>{video.Title}</Card.Title>
        <Card.Text>{video.Genre} | {video.AgeRating}</Card.Text>

        {/* Ratings */}
        <p>⭐ {ratings.AvgRating?.toFixed(1) || 0} ({ratings.TotalRatings} ratings)</p>

        {/* Comments list */}
        <div style={{ maxHeight: "100px", overflowY: "auto", marginBottom: "8px" }}>
          {comments.map((c, i) => (
            <p key={i}><strong>{c.Name}:</strong> {c.CommentText}</p>
          ))}
        </div>

        {/* Comment input */}
        <Form.Control
          className="mb-2"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button size="sm" onClick={addComment}>Comment</Button>

        {/* Rating input */}
        <Form.Control
          type="number"
          className="mt-2 mb-2"
          placeholder="Rate 1-5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <Button size="sm" onClick={addRating}>Rate</Button>
      </Card.Body>
    </Card>
  );
};

export default VideoCard;
