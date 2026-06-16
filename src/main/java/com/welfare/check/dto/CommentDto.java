package com.welfare.check.dto;

import com.welfare.check.entity.Comment;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private String author;
    private String authorEmoji;
    private Long authorId;
    private Long parentId;
    private int likeCount;
    private LocalDateTime createdAt;
    private List<CommentDto> replies;

    public static CommentDto from(Comment comment) {
        return CommentDto.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .author(comment.getUser().getNickname())
            .authorEmoji(comment.getUser().getNicknameEmoji() == null ? "" : comment.getUser().getNicknameEmoji())
            .authorId(comment.getUser().getId())
            .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
            .likeCount(comment.getLikeCount())
            .createdAt(comment.getCreatedAt())
            .replies(comment.getReplies() != null
                ? comment.getReplies().stream().map(CommentDto::from).collect(Collectors.toList())
                : List.of())
            .build();
    }
}
