package com.welfare.check.repository;

import com.welfare.check.entity.Comment;
import com.welfare.check.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostAndParentIsNullOrderByCreatedAtAsc(Post post);
}
