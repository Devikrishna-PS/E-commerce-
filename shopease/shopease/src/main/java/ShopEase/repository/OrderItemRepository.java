package ShopEase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);
}