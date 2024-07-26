package com.luckvicky.blur.domain.channel.service;

import com.luckvicky.blur.domain.channel.mapper.ChannelMapper;
import com.luckvicky.blur.domain.channel.model.dto.ChannelDto;
import com.luckvicky.blur.domain.channel.model.dto.request.ChannelCreateRequest;
import com.luckvicky.blur.domain.channel.model.entity.Channel;
import com.luckvicky.blur.domain.channel.model.entity.ChannelTag;
import com.luckvicky.blur.domain.channel.model.entity.Tag;
import com.luckvicky.blur.domain.channel.repository.ChannelTagRepository;
import com.luckvicky.blur.domain.channel.repository.ChannelRepository;
import com.luckvicky.blur.domain.channel.repository.TagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChannelServiceImpl implements ChannelService{

    private final ChannelRepository channelRepository;
    private final ChannelTagRepository channelTagRepository;
    private final TagRepository tagRepository;
    private final ChannelMapper channelMapper;

    @Override
    @Transactional
    public ChannelDto createChannel(ChannelCreateRequest request) {
        Channel channel = request.toEntity();
        channel = channelRepository.save(channel);

        List<Tag> tags = tagRepository.findAllByNameIn(request.tags());
        Map<String, Tag> existingTagMap = tags.stream()
                .collect(Collectors.toMap(Tag::getName, tag -> tag));

        for (String tagName : request.tags()) {
            Tag tag = existingTagMap.get(tagName);
            if (tag == null) {
                tag = Tag.builder().name(tagName).build();
                tag = tagRepository.save(tag);
            }

            ChannelTag channelTag = ChannelTag.builder()
                    .channel(channel)
                    .tag(tag)
                    .build();
            channelTagRepository.save(channelTag);
        }

        // 저장된 태그들을 다시 조회
        List<Tag> savedTags = channelTagRepository.findByChannelId(channel.getId())
                .stream()
                .map(ChannelTag::getTag)
                .collect(Collectors.toList());

        return channelMapper.convertToDto(channel, savedTags);
    }



    @Override
    public List<ChannelDto> getAllChannels(){
        List<Channel> channels = channelRepository.findAll();
        List<UUID> channelIds = channels.stream()
                .map(Channel::getId)
                .collect(Collectors.toList());

        List<ChannelTag> channelTags = channelTagRepository.findByChannelIdIn(channelIds);

        Map<UUID, List<Tag>> channelTagsMap = channelTags.stream()
                .collect(Collectors.groupingBy(
                        ct -> ct.getChannel().getId(),
                        Collectors.mapping(ChannelTag::getTag, Collectors.toList())
                ));

        return channels.stream()
                .map(channel -> channelMapper.convertToDto(channel,
                        channelTagsMap.getOrDefault(channel.getId(), Collections.emptyList())))
                .collect(Collectors.toList());
    }

    @Override
    public List<ChannelDto> searchChannelsByTags(List<String> tagNames) {
        List<ChannelTag> channelTags = channelTagRepository.findByTagNameIn(tagNames);

        return channelTags.stream()
                .collect(Collectors.groupingBy(
                        ChannelTag::getChannel,
                        Collectors.mapping(ChannelTag::getTag, Collectors.toList())
                ))
                .entrySet().stream()
                .map(entry -> channelMapper.convertToDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }


}
