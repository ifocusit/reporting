package ch.focusit.reporting.repository

import ch.focusit.reporting.domain.Time
import org.assertj.core.api.Assertions
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.ReactiveMongoOperations
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.test.context.junit4.SpringRunner
import reactor.core.publisher.Flux
import java.time.LocalDateTime

@RunWith(SpringRunner::class)
@SpringBootTest
class TimeRepositoryTest {

    @Autowired
    lateinit var template: ReactiveMongoTemplate

    @Autowired
    lateinit var repository: TimeRepository

    @Autowired
    lateinit var operations: ReactiveMongoOperations

    @Before
    fun setUp() {
//        StepVerifier.create(template.dropCollection(Time::class.java)).verifyComplete()
//        val insertAll = template.insertAll(Flux.just<Any>(TEST_TIME_1, TEST_TIME_2).collectList())
//        StepVerifier.create(insertAll).expectNextCount(4).verifyComplete()

        repository.save(TEST_TIME_1).block()
        repository.save(TEST_TIME_2).block()
//        template.dropCollection(Time::class.java)
//        template.insertAll(Flux.just<Any>(TEST_TIME_1, TEST_TIME_2).collectList())
    }

    @Test
    fun findShouldGetTime() {
        Assertions.assertThat(repository.findById("_1").block()).isEqualToComparingFieldByField(TEST_TIME_1)
    }

    companion object {
        val TEST_TIME_1 = Time("_1", LocalDateTime.parse("2018-03-01T10:30"))
        val TEST_TIME_2 = Time("_2", LocalDateTime.parse("2018-03-01T14:50"))
    }
}