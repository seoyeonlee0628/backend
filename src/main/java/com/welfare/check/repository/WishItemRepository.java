package com.welfare.check.repository;

import com.welfare.check.entity.WishItem;
import com.welfare.check.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface WishItemRepository extends JpaRepository<WishItem, Long> {
    List<WishItem> findByUserOrderByEndDateAsc(User user);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("DELETE FROM WishItem w WHERE w.id = :id AND w.user = :user")
    void deleteByIdAndUser(@Param("id") Long id, @Param("user") User user);
}
