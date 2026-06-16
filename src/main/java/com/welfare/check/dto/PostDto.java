package com.welfare.check.dto;

import com.welfare.check.entity.Post;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PostDto {
    private Long id;
    private Integer boardId;
    private String title;
    private String content;
    private String author;
    private String authorEmoji;
    private Long authorId;
    private boolean pinned;
    private int views;
    private int likeCount;
    private int commentCount;
    private LocalDateTime createdAt;
    private List<CommentDto> comments;
    private boolean boosted;

    public static PostDto from(Post post) {
        return PostDto.builder()
            .id(post.getId())
            .boardId(post.getBoardId())
            .title(post.getTitle())
            .content(post.getContent())
            .author(post.getUser().getNickname())
            .authorEmoji(post.getUser().getNicknameEmoji() == null ? "" : post.getUser().getNicknameEmoji())
            .authorId(post.getUser().getId())
            .pinned(post.isPinned())
            .views(post.getViews())
            .likeCount(post.getLikeCount())
            .commentCount(post.getComments() != null ? post.getComments().size() : 0)
            .createdAt(post.getCreatedAt())
            .boosted(post.getBoostedUntil() != null && post.getBoostedUntil().isAfter(java.time.LocalDateTime.now()))
            .build();
    }
}
