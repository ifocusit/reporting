package ch.focusit.reporting.endpoint

import ch.focusit.reporting.domain.Time
import ch.focusit.reporting.repository.TimeRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.reactive.server.WebTestClient
import java.time.LocalDateTime

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TimeControllerIT {

    @Autowired
    lateinit var repository: TimeRepository

    private lateinit var webClient: WebTestClient

    @BeforeEach
    fun setUp() {
        webClient = WebTestClient.bindToController(TimeController(repository)).build()

        repository.save(TEST_TIME_2).subscribe()
        repository.save(TEST_TIME_1).subscribe()
    }

    @AfterEach
    fun tearDown() {
        repository.deleteAll().subscribe()
    }

    @Test
    fun `find all`() {
        webClient.get()
                .uri("/times/").accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_1.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_2.id!!)
    }

    @Test
    fun `insert time`() {
        val newTime = LocalDateTime.parse("2018-03-26T10:15")
        val timeInserted = webClient.post().uri("/times/").accept(MediaType.APPLICATION_JSON_UTF8)
                .syncBody(Time(null, newTime))
                .exchange()
                .expectStatus().isCreated
                .expectBody(Time::class.java)
                .returnResult().responseBody

        Assertions.assertThat(timeInserted?.id).isNotBlank()
        Assertions.assertThat(timeInserted?.time).isEqualTo(newTime)
    }

    @Test
    fun `find time by id`() {
        val founded = webClient.get()
                .uri("/times/{id}", TEST_TIME_1.id).accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk
                .expectBody(Time::class.java)
                .returnResult().responseBody

        Assertions.assertThat(founded).isEqualTo(TEST_TIME_1)
    }

    @Test
    fun `update time`() {
        val newTime = LocalDateTime.now()
        val founded = webClient.put().uri("/times/{id}", TEST_TIME_1.id).accept(MediaType.APPLICATION_JSON)
                .syncBody(Time(null, newTime)).exchange()
                .expectStatus().isOk
                .expectBody(Time::class.java)
                .returnResult().responseBody

        Assertions.assertThat(founded?.id).isEqualTo(TEST_TIME_1.id)
        Assertions.assertThat(founded?.time).isEqualTo(newTime)
    }

    @Test
    fun `delete time`() {
        webClient.delete().uri("/times/{id}", TEST_TIME_1.id).accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk
    }

    @Test
    fun `find by month`() {
        repository.save(TEST_TIME_3).subscribe()
        repository.save(TEST_TIME_4).subscribe()

        webClient.get().uri("/times/month/{month}", "2018-02").accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk.expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_3.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_4.id!!)
    }

    @Test
    fun `find by day`() {
        repository.save(TEST_TIME_3).subscribe()
        repository.save(TEST_TIME_4).subscribe()
        repository.save(TEST_TIME_5).subscribe()
        repository.save(TEST_TIME_6).subscribe()

        webClient.get().uri("/times/day/{day}", "2018-02-03").accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk.expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_5.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_6.id!!)
    }

    @Test
    fun `find by date`() {
        repository.save(TEST_TIME_3).subscribe()
        repository.save(TEST_TIME_4).subscribe()
        repository.save(TEST_TIME_5).subscribe()
        repository.save(TEST_TIME_6).subscribe()
        repository.save(TEST_TIME_7).subscribe()

        webClient.get().uri("/times/date/{date}", "2018-02-03").accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk.expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_5.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_6.id!!)

        webClient.get().uri("/times/date/{date}", "2018-02").accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk.expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_3.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_4.id!!)
                .jsonPath("$[2].id").isEqualTo(TEST_TIME_5.id!!)
                .jsonPath("$[3].id").isEqualTo(TEST_TIME_6.id!!)

        webClient.get().uri("/times/date/{date}", "2018").accept(MediaType.APPLICATION_JSON).exchange()
                .expectStatus().isOk.expectBody()
                .jsonPath("$[0].id").isEqualTo(TEST_TIME_3.id!!)
                .jsonPath("$[1].id").isEqualTo(TEST_TIME_4.id!!)
                .jsonPath("$[2].id").isEqualTo(TEST_TIME_5.id!!)
                .jsonPath("$[3].id").isEqualTo(TEST_TIME_6.id!!)
                .jsonPath("$[4].id").isEqualTo(TEST_TIME_1.id!!)
                .jsonPath("$[5].id").isEqualTo(TEST_TIME_2.id!!)


        webClient.get().uri("/times/date/{date}", "2018-04").accept(MediaType.APPLICATION_JSON).exchange().expectStatus().isOk
        webClient.get().uri("/times/date/{date}", "2018-02-10").accept(MediaType.APPLICATION_JSON).exchange().expectStatus().isOk
        webClient.get().uri("/times/date/{date}", "2018-02-10T13:20").accept(MediaType.APPLICATION_JSON).exchange().expectStatus().isOk
        webClient.get().uri("/times/date/{date}", "2018-02-10 13:20").accept(MediaType.APPLICATION_JSON).exchange().expectStatus().isOk
    }

    companion object {
        val TEST_TIME_1 = Time("_1", LocalDateTime.parse("2018-03-01T10:30"))
        val TEST_TIME_2 = Time("_2", LocalDateTime.parse("2018-03-01T14:50"))
        val TEST_TIME_3 = Time("_3", LocalDateTime.parse("2018-02-02T10:10"))
        val TEST_TIME_4 = Time("_4", LocalDateTime.parse("2018-02-02T18:10"))
        val TEST_TIME_5 = Time("_5", LocalDateTime.parse("2018-02-03T07:25"))
        val TEST_TIME_6 = Time("_6", LocalDateTime.parse("2018-02-03T15:55"))
        val TEST_TIME_7 = Time("_7", LocalDateTime.parse("2017-02-03T15:55"))
    }
}