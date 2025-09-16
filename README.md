# Plataforma Financial Management

Repositorio monorepo que agrupa múltiples microservicios (Java/Spring Boot 3, arquitectura hexagonal + DDD) y microfrontends (Angular) para la gestión de cuentas, clientes, transacciones y componentes de infraestructura (Eureka, API Gateway) dentro del dominio financiero.

## Tabla de Contenido
1. Visión General
2. Arquitectura
3. Estructura del Repositorio
4. Microservicios Backend
5. Microfrontends / Shell Frontend
6. Stack Tecnológico
7. Flujo de Desarrollo (Git Branching)
8. Construcción & Ejecución
9. Generación de Código OpenAPI
10. Tests, Calidad y Métricas
11. Seguridad y Configuración
12. Pipelines CI/CD
13. Estándares de Código
14. Troubleshooting Rápido
15. Próximos Pasos / Backlog Técnico

---
## 1. Visión General
La plataforma expone servicios de negocio relacionados a cuentas, clientes y transacciones a través de un ecosistema de microservicios Spring Boot y un frontend basado en microfrontends Angular, orquestados mediante un API Gateway y registrados en un servidor Eureka.

## 2. Arquitectura
- Estilo: Microservicios + Hexagonal (Ports & Adapters) + DDD.
- Backend: Spring Boot 3.3.x, Spring Cloud 2023.x, OpenFeign, Eureka, OAuth2 Resource Server, Cache (Caffeine / Redis), JPA + PostgreSQL.
- Frontend: Angular (múltiples microfrontends + shell), integración modular.
- Generación de contratos: OpenAPI Generator (server + clients) vía tareas Gradle personalizadas.
- Observabilidad: Actuator + logs JSON estructurados + log transaccional/auditoría.

Diagrama lógico simplificado:
```
[ MF Shell / Microfrontends ] --> [ API Gateway ] --> [ Microservices (Accounts, Customers, Transactions) ]
                                                        |-- PostgreSQL
                                                        |-- Redis Cache
                                                        |-- External Integrations (Feign clients)
```

## 3. Estructura del Repositorio
```
backend/
  msa-account-transaction/
  msa-customer-profiles/
  msa-deposit-account/
  msa-eureka/
  msa-gateway/
frontend/
  mfa-accounts/
  mfa-customers/
  mfa-transactions/
  shell-financial-management/
.gitignore
README.md
```
Cada microservicio mantiene su propio `build.gradle`, `Dockerfile`, Helm chart y configuraciones de pipeline.

## 4. Microservicios Backend
| Servicio | Propósito (resumen) | Notas técnicas |
|----------|--------------------|----------------|
| `msa-account-transaction` | Gestión de transacciones de cuenta | OpenAPI server + generación de clientes adicionales; Redis; PDF; auditoría |
| `msa-customer-profiles` | Perfiles / datos de clientes | Hexagonal, validación, Feign |
| `msa-deposit-account` | Operaciones sobre cuentas depósito | JPA, caching |
| `msa-gateway` | API Gateway / Edge | Routing, seguridad, centralización |
| `msa-eureka` | Service Discovery | Registro de instancias |

Patrón de paquetes (hexagonal) típico:
```
application/
domain/
infrastructure/
  input.adapter.rest
  output.repository
  ...
```

## 5. Microfrontends / Shell Frontend
- Shell (`mfa-accounts` como template base) orquesta la composición visual y navegación.
- Microfrontends especializados (`mfa-customers`, `mfa-transactions`, etc.).
- Recomendado: separación de UI (components) vs lógica (views) vs cross-cutting (services, guards, layouts).

Comandos típicos (desde carpeta de cada frontend):
```
yarn install
yarn start        # modo desarrollo (puerto 4200 por defecto)
yarn build:prod   # build producción
yarn test         # pruebas unitarias (Jest / Karma según config)
yarn lint         # estilo de código
```

## 6. Stack Tecnológico
Backend:
- Java 17 (toolchain)
- Spring Boot 3.3.7
- Spring Cloud 2023.0.1 BOM
- OpenAPI Generator 7.9.x
- MapStruct 1.5.5.Final
- PostgreSQL Driver 42.7.x
- Redis, Caffeine
- Feign, Actuator, OAuth2 Resource Server
- Jacoco, PIT Mutation Testing

Frontend:
- Node (>= 12.14.1 indicado; sugerido actualizar a LTS actual)
- Angular CLI (versión según `package.json` de cada MFE)
- Jest para pruebas unitarias

Observabilidad & Calidad:
- Log estructurado (logstash encoder)
- Auditoría transaccional (libs internas)
- Jacoco coverage; PIT Mutation (umbral mutación >=45%)

## 7. Flujo de Desarrollo (Git Branching)
- Rama base de integración: `develop`
- Feature branches: `feature/<descripcion-kebab-case>`
- (Opcional) Release: `release/<version>`
- Producción: `main` o `master` (según convención que se adopte)
- Convenciones de commits recomendadas (Angular conventional commits):
  - `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`

## 8. Construcción & Ejecución
### Backend (ejemplo `msa-account-transaction`)
Desde la carpeta del microservicio:
```
./gradlew clean build
./gradlew bootRun
```
Perfil / configuración se maneja en `application.yml` y variables de entorno.

Ejecución de un microservicio con parámetros (ejemplo puerto):
```
./gradlew bootRun --args='--server.port=8085'
```

### Frontend
En cada microfrontend:
```
yarn install
yarn start
```

### Docker (ejemplo)
```
# Backend
docker build -t account-transaction-service:local ./backend/msa-account-transaction

docker run --rm -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  account-transaction-service:local

# Frontend (shell)
docker build -t mf-shell:local ./frontend/mfa-accounts
docker run --rm -p 4200:80 mf-shell:local
```

## 9. Generación de Código OpenAPI
Se definen tareas Gradle personalizadas:
- `buildSpringServer`: genera controladores (interfaces) server.
- `buildSpringAccount`: genera cliente Feign contra especificación externa.

Comando combinado (parte de `compileJava`):
```
./gradlew buildSpringServer buildSpringAccount
```
Los artefactos generados quedan en `build/generated/` y `build/generated-account/` y se añaden al source set.

## 10. Tests, Calidad y Métricas
```
./gradlew test                 # Pruebas unitarias + Jacoco
./gradlew pitest               # Mutation testing (report en build/reports/pitest)
./gradlew jacocoTestReport     # Reporte coverage HTML/XML
```
Integración continua puede publicar XML de Jacoco para herramientas como SonarQube.

Umbrales/cobertura: ajustar política en pipeline según necesidades (actual PIT mutationThreshold=45).

## 11. Seguridad y Configuración
- Autenticación / Autorización: OAuth2 Resource Server (JWT/Bearer).
- Configuración sensible vía variables de entorno: `ARTIFACT_USERNAME`, `ARTIFACT_TOKEN`, credenciales DB, Redis, etc.
- Nunca commitear: `.env`, llaves, certificados (protegido por `.gitignore`).
- Logs en formato JSON para correlación.
- Considerar habilitar headers de seguridad (CSP, HSTS) en Gateway.

## 12. Pipelines CI/CD
Archivos `azure-pipelines.yml` por módulo definen stages (build -> test -> análisis -> package -> deploy). Ejemplos típicos:
- Cache de dependencias Gradle / Node.
- Publicación de artefactos (JAR / imágenes Docker / Helm charts).
- Escaneo de seguridad (StackHawk YAML presente: `stackhawk*.yml`).

Pasos sugeridos en pipeline backend:
1. `./gradlew clean build` (incluye test, generación OpenAPI)
2. `./gradlew pitest` (opcional gate)
3. Publicar cobertura (Jacoco XML)
4. Construir imagen Docker & push
5. Despliegue Helm (según ambiente)

Frontend pipeline sugerido:
1. `yarn install --frozen-lockfile`
2. `yarn lint && yarn test --coverage`
3. `yarn build:prod`
4. Imagen Docker & push

## 13. Estándares de Código
Backend:
- Lombok para reducción de boilerplate
- MapStruct para mapeos
- Validación con `jakarta.validation`
- Principios: puertos (interfaces) en dominio/application; adapters en infraestructura

Frontend:
- Dividir UI (components) vs lógica (views)
- Reutilizar pipes / directives / services
- Seguir convenciones de ESLint / Prettier

Commits: seguir convención semántica; PRs deben incluir descripción y checklist de pruebas.

## 14. Troubleshooting Rápido
| Problema | Posible causa | Acción |
|----------|---------------|--------|
| Gradle falla descargando dependencias | Credenciales artifactory no seteadas | Exportar `ARTIFACT_USERNAME` y `ARTIFACT_TOKEN` |
| Código generado vació/no aparece | OpenAPI spec faltante o ruta incorrecta | Verificar `src/main/resources/openapi*.yaml` |
| Puerto ya en uso | Servicio previo activo | Cambiar `--server.port` o detener proceso |
| Redis cache no conecta | Instancia local no levantada | `docker run -p 6379:6379 redis:alpine` |
| Frontend no arranca | Versión Node incompatible | Usar LTS recomendada (>= v18.x) |

## 15. Próximos Pasos / Backlog Técnico
- Unificar versión mínima de Node a LTS y actualizar documentación.
- Añadir SonarQube (quality gate) centralizado.
- Incorporar pruebas de contrato (Pact) entre microservicios.
- Automatizar escaneo SAST/DAST adicional.
- Documentar endpoints clave en catálogo central (Backstage / Techdocs si aplica).
- Incrementar umbral de mutación PIT > 60% progresivamente.

---
## Cómo Contribuir
1. Crear rama `feature/...`
2. Implementar cambios + pruebas + documentación.
3. Ejecutar `./gradlew clean build pitest` y asegurar que pasa local.
4. Abrir PR a `develop` con descripción clara.

## Licencia
Uso interno corporativo. Si se requiere licencia OSS especificar aquí.

---
Si necesitas ampliar alguna sección (por ejemplo, políticas de despliegue o diagramas más formales) abre una incidencia o un PR de documentación.
