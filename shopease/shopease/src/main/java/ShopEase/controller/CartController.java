package ShopEase.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ShopEase.model.Cart;
import ShopEase.model.CartItem;
import ShopEase.model.Product;
import ShopEase.model.User;
import ShopEase.repository.CartItemRepository;
import ShopEase.repository.CartRepository;
import ShopEase.repository.ProductRepository;
import ShopEase.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartRepository cartRepository,
                          CartItemRepository cartItemRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId,
                              @RequestParam Long productId,
                              @RequestParam int quantity) {

        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        // Check user and product
        if (user == null || product == null) {
            return null;
        }

        // Check valid quantity
        if (quantity <= 0) {
            return null;
        }

        Cart cart = cartRepository.findByUserId(userId);

        // Create cart if user does not have one
        if (cart == null) {
            cart = new Cart(user);
            cart = cartRepository.save(cart);
        }

        CartItem cartItem =
                cartItemRepository.findByCartIdAndProductId(
                        cart.getId(),
                        product.getId());

        // Check existing quantity
        int currentQuantity = 0;

        if (cartItem != null) {
            currentQuantity = cartItem.getQuantity();
        }

        // Check stock availability
        if (currentQuantity + quantity > product.getStock()) {
            return null;
        }

        // Update existing cart item
        if (cartItem != null) {
            cartItem.setQuantity(
                    cartItem.getQuantity() + quantity);
        }

        // Add new cart item
        else {
            cartItem = new CartItem(
                    quantity,
                    cart,
                    product);
        }

        return cartItemRepository.save(cartItem);
    }


    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {

        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            return List.of();
        }

        return cartItemRepository.findByCartId(cart.getId());
    }


    @PutMapping("/update/{itemId}")
    public CartItem updateQuantity(@PathVariable Long itemId,
                                   @RequestParam int quantity) {

        CartItem cartItem =
                cartItemRepository.findById(itemId).orElse(null);

        if (cartItem == null) {
            return null;
        }

        // Check valid quantity
        if (quantity <= 0) {
            return null;
        }

        // Check stock before updating
        Product product = cartItem.getProduct();

        if (quantity > product.getStock()) {
            return null;
        }

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }


    @DeleteMapping("/remove/{itemId}")
    public void removeFromCart(@PathVariable Long itemId) {

        cartItemRepository.deleteById(itemId);
    }
}