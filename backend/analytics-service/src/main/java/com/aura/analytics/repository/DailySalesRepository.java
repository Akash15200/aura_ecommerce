package com.aura.analytics.repository;

import com.aura.analytics.model.DailySales;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailySalesRepository extends MongoRepository<DailySales, String> {
}
