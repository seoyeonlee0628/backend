package com.welfare.check.service;

import com.welfare.check.dto.PostDto;
import com.welfare.check.dto.PostRequest;
import com.welfare.check.entity.*;
import com.welfare.check.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public Page<PostDto> getPosts(int boardId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository
            .findByBoardIdOrderByPinnedDescCreatedAtDesc(boardId, java.time.LocalDateTime.now(), pageable)
            .map(PostDto::from);
    }

    @Transactional
    public PostDto getPost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return PostDto.from(post);
    }

    @Transactional
    public PostDto createPost(PostRequest request, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        Post post = Post.builder()
            .user(user)
            .boardId(request.getBoardId())
            .title(request.getTitle())
            .content(request.getContent())
            .build();
        return PostDto.from(postRepository.save(post));
    }

    @Transactional
    public PostDto updatePost(Long id, PostRequest request, String username) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        if (!post.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        return PostDto.from(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (!post.getUser().getUsername().equals(username) && user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        postRepository.delete(post);
    }

    @Transactional
    public java.util.Map<String, Object> toggleLike(Long postId, String username) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        boolean liked;
        if (postLikeRepository.existsByPostAndUser(post, user)) {
            postLikeRepository.findByPostAndUser(post, user)
                .ifPresent(postLikeRepository::delete);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            liked = false;
        } else {
            postLikeRepository.save(PostLike.builder().post(post).user(user).build());
            post.setLikeCount(post.getLikeCount() + 1);
            liked = true;
        }
        postRepository.save(post);
        return java.util.Map.of("liked", liked, "likeCount", post.getLikeCount());
    }

    @Transactional
    public boolean toggleBookmark(Long postId, String username) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        if (bookmarkRepository.existsByPostAndUser(post, user)) {
            bookmarkRepository.findByPostAndUser(post, user)
                .ifPresent(bookmarkRepository::delete);
            return false;
        } else {
            bookmarkRepository.save(Bookmark.builder().post(post).user(user).build());
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<PostDto> getPopularPosts() {
        return postRepository.findTopByOrderByLikeCountDesc(PageRequest.of(0, 5))
            .stream().map(PostDto::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostDto> getMyPosts(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return postRepository.findByUser(user).stream().map(PostDto::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostDto> getLikedPosts(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return postLikeRepository.findByUser(user).stream()
            .map(like -> PostDto.from(like.getPost())).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostDto> getBookmarkedPosts(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return bookmarkRepository.findByUser(user).stream()
            .map(bm -> PostDto.from(bm.getPost())).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> boostPost(Long postId, String username) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (!post.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("내 게시글만 부스트할 수 있습니다.");
        }
        if (user.getPoints() < 50) {
            throw new IllegalArgumentException("포인트가 부족해요. (50P 필요)");
        }
        user.setPoints(user.getPoints() - 50);
        post.setBoostedUntil(java.time.LocalDateTime.now().plusDays(3));
        userRepository.save(user);
        postRepository.save(post);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("remainPoints", user.getPoints());
        return result;
    }
}
