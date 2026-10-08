package ShopEase.controller;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import ShopEase.model.User;
import ShopEase.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @GetMapping
    public List<User> getAllUsers(@RequestParam Long userId) {

        User admin = userRepository.findById(userId).orElse(null);

        if (admin == null || !"ADMIN".equals(admin.getRole())) {
            return List.of();
        }

        return userRepository.findAll();
    }
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            return null;
        }
        user.setRole("USER");
        
   

        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginUser) {

        User user = userRepository.findByEmail(loginUser.getEmail());

        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return user;
        }

        return null;
    }
}