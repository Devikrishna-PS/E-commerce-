package ShopEase.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ShopEase.model.Product;
import ShopEase.model.User;
import ShopEase.repository.ProductRepository;
import ShopEase.repository.UserRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository,
                             UserRepository userRepository) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    @PostMapping
    public Product addProduct(@RequestParam Long userId,
                              @RequestBody Product product) {

        if (!isAdmin(userId)) {
            return null;
        }

        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {

        return productRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id,
                              @RequestParam Long userId) {

        if (!isAdmin(userId)) {
            return;
        }

        productRepository.deleteById(id);
    }

    private boolean isAdmin(Long userId) {

        User user =
                userRepository.findById(userId).orElse(null);

        return user != null &&
               "ADMIN".equals(user.getRole());
    }
}