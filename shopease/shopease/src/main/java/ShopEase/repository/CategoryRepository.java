package ShopEase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}