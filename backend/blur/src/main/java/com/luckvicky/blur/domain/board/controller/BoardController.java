package com.luckvicky.blur.domain.board.controller;

import com.luckvicky.blur.domain.board.model.dto.BoardDetailDto;
import com.luckvicky.blur.domain.board.model.dto.BoardDto;
import com.luckvicky.blur.domain.board.model.dto.request.BoardCreateRequest;
import com.luckvicky.blur.domain.board.model.dto.response.BoardDetailResponse;
import com.luckvicky.blur.domain.board.model.dto.response.BoardListResponse;
import com.luckvicky.blur.domain.board.service.BoardService;
import com.luckvicky.blur.domain.comment.model.dto.response.CommentListResponse;
import com.luckvicky.blur.global.model.dto.Result;
import com.luckvicky.blur.global.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "게시글 API")
@RestController
@RequestMapping("/v1/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @Operation(summary = "게시글 생성 API")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "게시글 생성 성공"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "게시글 생성 실패"
            )
    })
    @PostMapping
    public ResponseEntity createBoard(@RequestBody BoardCreateRequest request) {
        return ResponseUtil.created(
                Result.builder()
                        .data(boardService.createBoard(request))
                        .build()
        );

    }

    @Operation(
            summary = "유형별 게시글 목록 조회 API",
            description = "유형과 일치하는 모든 게시글의 목록을 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "게시글 목록 조회 성공",
                    content = @Content(schema = @Schema(implementation = BoardListResponse.class))
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "게시글 목록 조회 성공(단, 데이터 없음)"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "유효하지 않은 유형에 대한 게시글 조회로 실패"
            )
    })
    @Parameters({
            @Parameter(
                    name = "boardType",
                    description = "게시글 유형",
                    examples = {
                            @ExampleObject(name = "channel", value = "CHANNEL"),
                            @ExampleObject(name = "league", value = "LEAGUE"),
                            @ExampleObject(name = "dashcam", value = "DASHCAM"),
                    }
            ),
            @Parameter(name = "pageNumber", description = "페이지 번호"),
            @Parameter(
                    name = "criteria",
                    description = "정렬 기준",
                    examples = {
                            @ExampleObject(name = "최신", value = "createdAt"),
                            @ExampleObject(name = "좋아요", value = "likeCount"),
                            @ExampleObject(name = "조회수", value = "viewCount"),
                            @ExampleObject(name = "댓글", value = "commentCount"),
                    }
            ),
    })
    @GetMapping
    public ResponseEntity findBoardsByType(
            @RequestParam(name = "type") String type,
            @RequestParam(required = false, defaultValue = "0", value = "pageNumber") int pageNumber,
            @RequestParam(required = false, defaultValue = "createdAt", value = "criteria") String criteria
    ) {

        List<BoardDto> boards = boardService.findBoardsByType(type, pageNumber, criteria);

        if (Objects.isNull(boards) || boards.isEmpty()) {
            return ResponseUtil.noContent(
                    Result.builder().build()
            );
        }

        return ResponseUtil.ok(
                Result.builder()
                        .data(BoardListResponse.of(boards))
                        .build()
        );

    }

    @Operation(
            summary = "게시글 상세 조회 API",
            description = "특정 게시글에 대한 본문, 조회수, 댓글을 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 완료",
                    content = @Content(schema = @Schema(implementation = CommentListResponse.class))
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "조회 완료 (단, 데이터 없음)"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 게시글"
            )
    })
    @Parameter(name = "boardId", description = "게시글 고유 식별값", in = ParameterIn.PATH)
    @GetMapping("/{boardId}")
    public ResponseEntity getComments(
            @PathVariable(name = "boardId") UUID boardId
    ) {

        BoardDetailDto boardDetail = boardService.getBoardDetail(boardId);

        return ResponseUtil.ok(
                Result.builder()
                        .data(BoardDetailResponse.of(boardDetail))
                        .build()
        );

    }

}