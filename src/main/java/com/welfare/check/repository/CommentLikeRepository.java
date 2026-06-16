package com.welfare.check.repository;

import com.welfare.check.entity.Comment;
import com.welfare.check.entity.CommentLike;
import com.welfare.check.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByCommentAndUser(Comment comment, User user);
    boolean existsByCommentAndUser(Comment comment, User user);
}
