package com.luckvicky.blur.domain.comment.model.dto.request;

import com.luckvicky.blur.domain.board.model.entity.Board;
import com.luckvicky.blur.domain.comment.model.entity.Comment;
import com.luckvicky.blur.domain.member.model.entity.Member;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.Builder;

@Builder
@Schema(name = "댓글 생성 요청")
public record CommentCreateRequest(

        @Schema(description = "사용자 고유 식별값")
        UUID memberId,

        @Schema(description = "게시글 고유 식별값")
        UUID boardId,

        @Schema(description = "작성 내용", example ="댓글")
        String content

) {

    public Comment toEntity(Member member, Board board) {

        return Comment.builder()
                .member(member)
                .board(board)
                .content(this.content)
                .build();

    }

}
