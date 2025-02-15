package com.luckvicky.blur.domain.like.model.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(name = "좋아요 삭제 응답")
public record LikeDeleteResponse(

        @Schema(description = "좋아요 개수")
        Long likeCount,

        @Schema(description = "좋아요 여부")
        Boolean isLike

) {

        public static LikeDeleteResponse of(Long likeCount, Boolean isLike) {
                return LikeDeleteResponse.builder()
                        .likeCount(likeCount)
                        .isLike(isLike)
                        .build();
        }

}
