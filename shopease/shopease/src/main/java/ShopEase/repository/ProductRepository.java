package ShopEase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}