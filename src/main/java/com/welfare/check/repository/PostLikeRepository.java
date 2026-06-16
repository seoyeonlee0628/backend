package com.welfare.check.repository;

import com.welfare.check.entity.PostLike;
import com.welfare.check.entity.Post;
import com.welfare.check.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    boolean existsByPostAndUser(Post post, User user);
    List<PostLike> findByUser(User user);
}
