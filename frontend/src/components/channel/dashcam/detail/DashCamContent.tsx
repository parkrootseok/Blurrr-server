import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from "@/store/authStore";
import { DashCamDetail } from '@/types/channelType';
import { MdAccessTime } from 'react-icons/md';
import { formatPostDate } from "@/utils/formatPostDate";
import { fetchChannelLike, fetchChannelLikeDelete } from "@/api/board";

const DashCamContent: React.FC<DashCamDetail> = ({
  id,
  member,
  title,
  createdAt,
  videos,
  content,
  mentionedLeagues,
  viewCount,
  likeCount,
  liked,
}) => {
  const { isLoggedIn, user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(liked ?? false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [like, setLike] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        const likeData = await fetchChannelLikeDelete(id);
        setLike(likeData.likeCount);
        setIsLiked(likeData.isLike);
      } else {
        const likeData = await fetchChannelLike(id);
        setLike(likeData.likeCount);
        setIsLiked(likeData.isLike);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeVideo = (newIndex: number, direction: 'next' | 'prev') => {
    setIsSliding(true);
    setSlideDirection(direction);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsSliding(false);
    }, 300); // 300ms 동안의 슬라이드 효과
  };

  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      changeVideo(currentIndex + 1, 'next');
    }
  };

  const prevVideo = () => {
    if (currentIndex > 0) {
      changeVideo(currentIndex - 1, 'prev');
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Header>
        <User>
          <Avatar src={member.profileUrl} alt={`${member.nickname}'s avatar`} />
          <UserInfo>
            <Username>{member.nickname}</Username>
            <CarInfo>{member.carTitle || '뚜벅이'}</CarInfo>
          </UserInfo>
        </User>
        <TimeSection>
          <Icon>
            <MdAccessTime />
          </Icon>
          <FormatDate>{formatPostDate(createdAt)}</FormatDate>
        </TimeSection>
      </Header>
      <Body>
        {mentionedLeagues.length > 0 && (
          <Tags>
            {mentionedLeagues.map((league, index) => (
              <Tag key={index}>@ {league.name}</Tag>
            ))}
          </Tags>
        )}
        {videos && videos.length > 0 && (
          <VideoSliderContainer>
            <ArrowButton onClick={prevVideo} disabled={currentIndex === 0}>
              <FaArrowLeft />
            </ArrowButton>
            <VideoWrapper isSliding={isSliding} direction={slideDirection}>
              <video controls autoPlay loop>
                <source src={videos[currentIndex].videoUrl} type="video/mp4" />
              </video>
            </VideoWrapper>
            <ArrowButton onClick={nextVideo} disabled={currentIndex === videos.length - 1}>
              <FaArrowRight />
            </ArrowButton>
          </VideoSliderContainer>
        )}
        <Content dangerouslySetInnerHTML={{ __html: content }} />
        {isLoggedIn && (
          <HeartButton onClick={toggleLike} $isLiked={isLiked}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </HeartButton>
        )}
      </Body>
    </Container>
  );
};


const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutToLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const slideOutToRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

// 스타일 컴포넌트 정의
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-bottom: 30px;
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
  margin-bottom: 16px;
  padding: 5px 28px;
`;

const Title = styled.h3`
  padding: 13px 28px;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

const Body = styled.div`
  padding: 0 28px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  font-weight: bold;
`;

const CarInfo = styled.div`
  color: #666;
  font-size: 13px;
  margin-top: 4px;
`;

const FormatDate = styled.div`
  font-size: 14px;
  color: #999;
`;

const Tags = styled.div`
  margin-bottom: 16px;
`;

const Tag = styled.span`
  background-color: #ddd;
  border-radius: 9px;
  padding: 4px 8px;
  margin-right: 8px;
  font-size: 12px;
`;

const VideoSliderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const VideoWrapper = styled.div<{ isSliding: boolean; direction: 'next' | 'prev' }>`
  width: 100%;
  animation: ${({ isSliding, direction }) =>
    isSliding
      ? direction === 'next'
        ? slideOutToLeft
        : slideOutToRight
      : direction === 'next'
        ? slideInFromRight
        : slideInFromLeft
  } 300ms ease-in-out;

  video {
    width: 100%;
    height: auto;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #666;

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  font-size: 17px;
  line-height: 1.5;
  color: #333;
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 15px;
`;

const Icon = styled.span`
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  vertical-align: middle;
`;

const HeartButton = styled.button<{ $isLiked: boolean }>`
  margin: 5px 0px 2px 0px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${({ $isLiked }) => ($isLiked ? "#d60606" : "#333")};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${({ $isLiked }) => ($isLiked ? "#ff6666" : "#d60606")};
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const TimeSection = styled.span`
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 8px;
  margin-top: auto;
  color: #999;
  font-size: 14px;
`;

export default DashCamContent;
