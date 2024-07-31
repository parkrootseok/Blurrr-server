import { fetchCommentCreate, fetchReplyCreate } from "@/api/comment";
import React, { useState } from "react";
import styled from "styled-components";
import { Comment } from "@/types/league";

interface CreateCommentProps {
  boardId: string;
  isReply: boolean;
  commentId: string;
}

export default function CreateComment({
  boardId,
  isReply,
  commentId,
}: CreateCommentProps) {
  const [comment, setComment] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit11 = () => {
    // 댓글 작성 로직을 추가하세요.
    console.log("Comment submitted:", comment);
    fetchCommentCreate(comment, boardId);
    setComment("");
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return; // 빈 댓글은 제출하지 않음

    if (isReply) {
      try {
        await fetchReplyCreate(commentId, boardId, comment);
        setComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    } else {
      try {
        await fetchCommentCreate(boardId, comment);
        setComment("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <Container>
      <Avatar />
      <Input
        type="text"
        placeholder="댓글 달기..."
        value={comment}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>작성</Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c4c4c4;
  margin-right: 8px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  background-color: #fbc02d;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
`;
