package ShopEase.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import ShopEase.model.Cart;
import ShopEase.model.CartItem;
import ShopEase.model.Order;
import ShopEase.model.OrderItem;
import ShopEase.model.Product;
import ShopEase.model.User;
import ShopEase.repository.CartItemRepository;
import ShopEase.repository.CartRepository;
import ShopEase.repository.OrderItemRepository;
import ShopEase.repository.OrderRepository;
import ShopEase.repository.ProductRepository;
import ShopEase.repository.UserRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Checkout
    @PostMapping("/checkout/{userId}")
    public Order checkout(@PathVariable Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            return null;
        }

        List<CartItem> cartItems =
                cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            return null;
        }

        double totalAmount = 0;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStock()) {
                return null;
            }

            totalAmount += product.getPrice()
                            * cartItem.getQuantity();
        }
        Order order = new Order(
                totalAmount,
                "PLACED",
                LocalDateTime.now(),
                user
        );

        order = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem(
                    cartItem.getQuantity(),
                    product.getPrice(),
                    order,
                    product
            );

            orderItemRepository.save(orderItem);

            product.setStock(
                    product.getStock() - cartItem.getQuantity()
            );

            productRepository.save(product);
        }

        // Clear cart after checkout
        cartItemRepository.deleteAll(cartItems);

        return order;
    }

    // Get all orders of a user
    @GetMapping("/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {

        return orderRepository.findByUserId(userId);
    }
    @GetMapping("/all")
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }
    // Update order status
    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId,
                                   @RequestParam String status,
                                   @RequestParam Long userId) {

        User admin = userRepository.findById(userId).orElse(null);

        if (admin == null || !"ADMIN".equals(admin.getRole())) {
            return null;
        }

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return null;
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }
}