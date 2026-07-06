
# Drama Green

DramaGreen es una API REST diseñada para gestionar el cuidado de plantas domésticas, ayudando a los usuarios a evitar el "drama" de que sus plantas mueran por olvido. La aplicación calcula automáticamente los ciclos de riego y fertilización basándose en las necesidades específicas de cada especie.

## ScreenShots

<img width="1920" height="1080" alt="Captura de pantalla 2026-06-06 141429" src="https://github.com/user-attachments/assets/c3cb810a-f0af-4940-9d47-e637f4ece9fd" />

<img width="1920" height="1080" alt="Captura de pantalla 2026-06-06 141520" src="https://github.com/user-attachments/assets/2ad5d986-cd7b-4d97-b8ad-3c474b7a564c" />

<img width="1920" height="1080" alt="Captura de pantalla 2026-06-06 141607" src="https://github.com/user-attachments/assets/a914bd4f-6bd3-4d2a-b201-a1359024f105" />

<img width="1920" height="1080" alt="Captura de pantalla 2026-06-06 141624" src="https://github.com/user-attachments/assets/5639b138-3136-4bad-bae7-8a40ee992f0c" />

<img width="1920" height="888" alt="Captura de pantalla 2026-06-06 205941" src="https://github.com/user-attachments/assets/caa76b24-7732-4662-ab30-8db7536db5d2" />

## Features

- Gestión de Plantas (CRUD): Registro completo de plantas con nickname, ubicación y especie.

- Cálculo de Necesidades (Smart Logic): El sistema calcula en tiempo real si una planta necesita agua o abono basándose en la frecuencia de su especie.

- Historial de Cuidados: Registro detallado de cada riego y fertilización (Logs).

- Estado Dinámico: Atributos calculados en el DTO para facilitar el consumo desde el Frontend (React).

- Categorización por Especies: Base de datos de especies con sus requerimientos de luz, humedad y frecuencia de riego.


## Tech Stack

- Backend: Java 17, Spring Boot 3, Spring Data JPA.

- Frontend: React

- Base de Datos: PostgreSQL (o H2 para desarrollo).

- Mapeo de Objetos: MapStruct (para conversión eficiente entre Entidades y DTOs).

- Productividad: Lombok.

- API: RESTful Architecture con documentación (próximamente Swagger/OpenAPI).


## Installation

Instala DramaGreen con npm:

```bash
git clone https://github.com/tu-usuario/dramagreen-api.git
cd dramagreen-api
```
Configurar la base de datos:
Modifica el archivo src/main/resources/application.properties con tus credenciales de base de datos.

Compilar y generar los Mappers (MapStruct):

```bash
mvn clean install
```

Ejecutar la aplicación:

```bash
mvn spring-boot:run
```
