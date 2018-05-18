package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.TimeRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.test.context.junit.jupiter.SpringExtension
import reactor.test.StepVerifier
import java.time.LocalDateTime

@ExtendWith(SpringExtension::class)
@SpringBootTest
class TimeControllerTest {

    @Autowired
    lateinit var repository: TimeRepository

    @Autowired
    lateinit var endpoint: TimeController

    @BeforeEach
    fun setUp() {
        repository.save(TEST_TIME_2).block()
        repository.save(TEST_TIME_1).block()
    }

    @Test
    fun testFindAll() {
        StepVerifier.create(endpoint.findAll())
                .expectNext(TEST_TIME_1)
                .expectNext(TEST_TIME_2)
                .verifyComplete()
    }

    @Test
    fun testFindByIdShouldReturnFounded() {
        StepVerifier.create(endpoint.find(TEST_TIME_1.id.toString()))
                .expectNext(ResponseEntity.ok(TEST_TIME_1))
                .verifyComplete()
    }

    @Test
    fun testFindByIdShouldReturnNotFound() {
        StepVerifier.create(endpoint.find("unknown"))
                .expectNext(ResponseEntity(HttpStatus.NOT_FOUND))
                .verifyComplete()
    }

    companion object {
        val TEST_TIME_1 = Time("_1", LocalDateTime.parse("2018-03-01T10:30"))
        val TEST_TIME_2 = Time("_2", LocalDateTime.parse("2018-03-01T14:50"))
    }
}