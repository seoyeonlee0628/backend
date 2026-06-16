package com.welfare.check.repository;

import com.welfare.check.entity.Post;
import com.welfare.check.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.boardId = :boardId ORDER BY p.pinned DESC, CASE WHEN p.boostedUntil IS NOT NULL AND p.boostedUntil > :now THEN 1 ELSE 0 END DESC, p.createdAt DESC")
    Page<Post> findByBoardIdOrderByPinnedDescCreatedAtDesc(@Param("boardId") Integer boardId, @Param("now") LocalDateTime now, Pageable pageable);

    List<Post> findByUser(User user);
    Page<Post> findByBoardIdAndTitleContainingOrBoardIdAndContentContaining(
        Integer boardId1, String title, Integer boardId2, String content, Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.likeCount DESC, p.views DESC")
    List<Post> findTopByOrderByLikeCountDesc(Pageable pageable);
}
