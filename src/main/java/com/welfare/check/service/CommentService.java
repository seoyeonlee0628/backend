package com.welfare.check.service;

import com.welfare.check.dto.CommentDto;
import com.welfare.check.entity.Comment;
import com.welfare.check.entity.CommentLike;
import com.welfare.check.entity.Post;
import com.welfare.check.entity.User;
import com.welfare.check.repository.CommentLikeRepository;
import com.welfare.check.repository.CommentRepository;
import com.welfare.check.repository.PostRepository;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentDto> getComments(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        return commentRepository.findByPostAndParentIsNullOrderByCreatedAtAsc(post)
            .stream().map(CommentDto::from).collect(Collectors.toList());
    }

    @Transactional
    public CommentDto addComment(Long postId, String content, Long parentId, String username) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Comment.CommentBuilder builder = Comment.builder()
            .post(post).user(user).content(content);

        if (parentId != null) {
            commentRepository.findById(parentId).ifPresent(builder::parent);
        }

        return CommentDto.from(commentRepository.save(builder.build()));
    }

    @Transactional
    public void deleteComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (!comment.getUser().getUsername().equals(username) && user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        commentRepository.delete(comment);
    }

    @Transactional
    public boolean toggleLike(Long id, String username) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        if (commentLikeRepository.existsByCommentAndUser(comment, user)) {
            commentLikeRepository.findByCommentAndUser(comment, user)
                .ifPresent(commentLikeRepository::delete);
            comment.setLikeCount(comment.getLikeCount() - 1);
            commentRepository.save(comment);
            return false;
        } else {
            commentLikeRepository.save(CommentLike.builder().comment(comment).user(user).build());
            comment.setLikeCount(comment.getLikeCount() + 1);
            commentRepository.save(comment);
            return true;
        }
    }
}
