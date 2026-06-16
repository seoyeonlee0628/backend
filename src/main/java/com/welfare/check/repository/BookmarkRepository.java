package com.welfare.check.repository;

import com.welfare.check.entity.Bookmark;
import com.welfare.check.entity.Post;
import com.welfare.check.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByPostAndUser(Post post, User user);
    boolean existsByPostAndUser(Post post, User user);
    List<Bookmark> findByUser(User user);
}
