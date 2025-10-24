package sv.edu.udb.bookapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.bookapi.model.Book;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // búsqueda por título (contenga, case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);
}
