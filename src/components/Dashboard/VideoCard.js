import React, { useState, useEffect, useCallback } from "react";
import API from "../../api";
import { Card, Button, Form } from "react-bootstrap";

const VideoCard = ({ video }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState({ AvgRating: 0, TotalRatings: 0 });

  // ✅ Stable fetchComments
  const fetchComments = useCallback(async () => {
    try {
      const res = await API.get(`/getComments/${video.VideoID}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [video.VideoID]);

  // ✅ Stable fetchRatings
  const fetchRatings = useCallback(async () => {
    try {
      const res = await API.get(`/getRatings/${video.VideoID}`);
      setRatings(res.data || { AvgRating: 0, TotalRatings: 0 });
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
    }
  }, [video.VideoID]);

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post("/comment", { videoId: video.VideoID, comment });
      setComment("");
      fetchComments(); // reload
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const addRating = async () => {
    const num = parseInt(rating);
    if (isNaN(num) || num < 1 || num > 5) return;
    try {
      await API.post("/rate", { videoId: video.VideoID, rating: num });
      setRating("");
      fetchRatings(); // reload
    } catch (err) {
      console.error("Failed to add rating:", err);
    }
  };

  // ✅ Now ESLint is happy
  useEffect(() => {
    fetchComments();
    fetchRatings();
  }, [fetchComments, fetchRatings]);

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
            <p key={i}><strong>{c.Name || "User"}:</strong> {c.CommentText}</p>
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
