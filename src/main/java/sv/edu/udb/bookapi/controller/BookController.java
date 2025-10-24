package sv.edu.udb.bookapi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.bookapi.dto.BookCreateDto;
import sv.edu.udb.bookapi.dto.BookUpdateDto;
import sv.edu.udb.bookapi.model.Book;
import sv.edu.udb.bookapi.service.BookService;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @Operation(summary = "Lista todos los libros")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de libros obtenida exitosamente")
    })
    @GetMapping
    public ResponseEntity<Page<Book>> list(Pageable pageable) {
        Page<Book> page = bookService.listAll(pageable);
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "Obtiene un libro por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Libro encontrado"),
            @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getById(id));
    }

    @Operation(summary = "Busca libros por título")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resultados de búsqueda")
    })
    @GetMapping("/search")
    public ResponseEntity<List<Book>> search(@RequestParam String title) {
        return ResponseEntity.ok(bookService.searchByTitle(title));
    }

    @Operation(summary = "Crea un nuevo libro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Libro creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody BookCreateDto dto) {
        Book created = bookService.create(dto);
        return ResponseEntity.created(URI.create("/api/v1/books/" + created.getId())).body(created);
    }

    @Operation(summary = "Actualiza un libro por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Libro actualizado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @Valid @RequestBody BookUpdateDto dto) {
        Book updated = bookService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Elimina un libro por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Libro eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Libro no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
