package ShopEase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);

    CartItem findByCartIdAndProductId(Long cartId, Long productId);
}