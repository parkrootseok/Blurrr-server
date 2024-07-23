import React from "react";
import styled from "styled-components";

interface CarPicture {
  name: string;
  description: string;
  image: string;
  views: number;
}

function CarPictureCard({ name, description, image, views }: CarPicture) {
  return (
    <Container>
      <ImageContainer>
        <Image src={image} alt="Car" />
      </ImageContainer>
      <InfoContainer>
        <TextContainer>
          <Name>{name}</Name>
          <Description>{description}</Description>
        </TextContainer>
        <Views>👁️ {views}</Views>
      </InfoContainer>
    </Container>
  );
}

export default CarPictureCard;

const Container = styled.div`
  width: 260px;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 75%;
  background-color: #d8d8d8;
  position: relative;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: black;
  margin: 0;
`;

const Description = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subDiscription};
  margin: 0;
`;

const Views = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: gray;
  margin-bottom: auto;
`;

const Icon = styled.span`
  margin-right: 5px;
  font-size: 14px;
`;
