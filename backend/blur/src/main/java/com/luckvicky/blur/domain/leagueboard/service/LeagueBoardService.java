package com.luckvicky.blur.domain.leagueboard.service;

import com.luckvicky.blur.domain.board.model.dto.BoardDetailDto;
import com.luckvicky.blur.domain.board.model.dto.BoardDto;
import com.luckvicky.blur.domain.channelboard.model.dto.ChannelBoardDto;
import com.luckvicky.blur.domain.leagueboard.model.dto.request.LeagueBoardCreateRequest;
import java.util.List;
import java.util.UUID;

public interface LeagueBoardService {

    UUID createLeagueBoard(UUID leagueId, UUID id, LeagueBoardCreateRequest request);

    List<ChannelBoardDto> getMentionLeagueBoards(UUID leagueId, UUID memberId, int pageNumber, String criteria);

    BoardDetailDto getLeagueBoardDetail(UUID memberId, UUID boardId);

    List<BoardDto> search(UUID leagueId, String keyword, String condition, int pageNumber, String criteria);

    List<BoardDto> getLeagueBoards(UUID leagueId, String leagueType, int pageNumber, String criteria);

}