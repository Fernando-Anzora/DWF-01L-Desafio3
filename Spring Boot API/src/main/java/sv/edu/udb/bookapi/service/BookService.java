package sv.edu.udb.bookapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.bookapi.dto.BookCreateDto;
import sv.edu.udb.bookapi.dto.BookUpdateDto;
import sv.edu.udb.bookapi.exception.ResourceNotFoundException;
import sv.edu.udb.bookapi.model.Book;
import sv.edu.udb.bookapi.repository.BookRepository;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Page<Book> listAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Book getById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado con el ID: " + id));
    }

    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    @Transactional
    public Book create(BookCreateDto dto) {
        Book b = new Book();
        b.setTitle(dto.getTitle().trim());
        b.setAuthor(dto.getAuthor().trim());
        b.setPublicationYear(dto.getPublicationYear());
        return bookRepository.save(b);
    }

    @Transactional
    public Book update(Long id, BookUpdateDto dto) {
        Book existing = getById(id);
        if (dto.getTitle() != null) existing.setTitle(dto.getTitle().trim());
        if (dto.getAuthor() != null) existing.setAuthor(dto.getAuthor().trim());
        if (dto.getPublicationYear() != null) existing.setPublicationYear(dto.getPublicationYear());
        return bookRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Book existing = getById(id);
        bookRepository.delete(existing);
    }
}
