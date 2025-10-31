package sv.edu.udb.bookapi.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Letras Vivas - Book API")
                        .version("v1")
                        .description("API REST para gestionar el catálogo de la editorial Letras Vivas")
                );
    }
}
