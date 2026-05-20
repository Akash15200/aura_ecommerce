package com.aura.recommendation.repository;

import com.aura.recommendation.model.UserAction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserActionRepository extends MongoRepository<UserAction, String> {
    List<UserAction> findByUserId(Long userId);
    List<UserAction> findByProductId(Long productId);
}
