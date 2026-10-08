package ShopEase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findByUserId(Long userId);
}