package ShopEase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ShopEase.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}